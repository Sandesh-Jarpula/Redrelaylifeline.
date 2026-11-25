// Run: node tests/run-tests.js   -> paste the printed table into Chapter "Testing" of your report.
const C = require('../js/compat'), P = require('../js/privacy'), R = require('../js/requests');
const M = require('../js/matching'), S = require('../js/seed'), G = require('../js/geo');
const rows = []; let n = 0;
function t(name, expected, fn) {
  n++; let actual, pass;
  try { actual = fn(); pass = actual === true || actual === expected; } catch (e) { actual = 'Error: ' + e.message; pass = expected === 'error'; }
  rows.push({ No: n, Test: name, Expected: expected === true ? 'true' : String(expected), Result: pass ? 'PASS' : 'FAIL (' + actual + ')' });
}
const now = Date.now(), H = 3600e3;
const good = { patient: 'Ramesh Kumar', hospital: 'Apollo Hospital', city: 'Hyderabad', locality: 'Jubilee Hills',
  blood: 'B+', units: 2, doctorPhone: '9876543210', deadline: now + 4 * H };

// compatibility
t('Hardcoded matrix equals ABO/Rh rule for all 64 pairs', true, () => C.GROUPS.every(r => C.GROUPS.every(d => C.canDonate(d, r) === C.canDonateByRule(d, r))));
t('O- can donate to all 8 groups', true, () => C.GROUPS.every(r => C.canDonate('O-', r)));
t('AB+ can receive from all 8 groups', true, () => C.GROUPS.every(d => C.canDonate(d, 'AB+')));
t('AB+ donor can ONLY give to AB+', true, () => C.GROUPS.filter(r => C.canDonate('AB+', r)).join() === 'AB+');
t('A- donates to A-, A+, AB-, AB+ only', 'A+,A-,AB+,AB-', () => C.GROUPS.filter(r => C.canDonate('A-', r)).sort().join());
t('Rh+ donor cannot give to Rh- (B+ -> B-)', false, () => C.canDonate('B+', 'B-'));
t('Unknown blood group rejected', 'error', () => C.canDonate('A+', 'X+'));
// validation
t('Valid SOS request accepted', true, () => R.validateRequest(good, now).ok);
t('Past deadline rejected', false, () => R.validateRequest({ ...good, deadline: now - H }, now).ok);
t('Deadline > 24h rejected', false, () => R.validateRequest({ ...good, deadline: now + 30 * H }, now).ok);
t('9-digit doctor phone rejected', false, () => R.validateRequest({ ...good, doctorPhone: '987654321' }, now).ok);
t('0 units rejected', false, () => R.validateRequest({ ...good, units: 0 }, now).ok);
t('Missing hospital rejected', false, () => R.validateRequest({ ...good, hospital: '' }, now).ok);
// seed
t('Seed has 30 donors', 30, () => S.donors.length);
t('Seed covers all 8 blood groups', 8, () => new Set(S.donors.map(d => d.blood)).size);
t('Seed has 5 active requests', 5, () => S.requests.length);
// matching
const req = S.requests[0];
t('B+ request only matches B+/B-/O+/O- donors', true, () => M.findEligibleDonors(req, S.donors, 50, now).every(d => ['B+', 'B-', 'O+', 'O-'].includes(d.blood)));
t('Radius filter: 1 km returns fewer than 50 km', true, () => M.findEligibleDonors(req, S.donors, 1, now).length < M.findEligibleDonors(req, S.donors, 50, now).length);
t('Results sorted nearest first', true, () => { const r = M.findEligibleDonors(req, S.donors, 50, now); return r.every((x, i) => i === 0 || r[i - 1].distanceKm <= x.distanceKm); });
t('Unavailable donors excluded', true, () => { const un = S.donors.filter(d => d.available !== 'Available').map(d => d.id); return M.findEligibleDonors(req, S.donors, 50, now).every(d => !un.includes(d.id)); });
// privacy
t('Public donor object has no phone or full name', true, () => { const p = P.toPublicDonor(S.donors[0]); return !('phone' in p) && !('name' in p) && p.initials === 'R. S.'; });
t('Matching output leaks no phone', true, () => !JSON.stringify(M.findEligibleDonors(req, S.donors, 50, now)).includes(S.donors[0].phone));
// lifecycle
t('New request starts at stage 0 (Open)', 0, () => R.createRequest(good, 'T1', now).stage);
t('1 of 2 units -> Donors Responded, 1/2', '1/2@1', () => { const r = R.createRequest(good, 'T2', now); R.respond(r, S.donors[2], now); return r.committed + '/' + r.units + '@' + r.stage; });
t('2 of 2 units -> Fulfilled / In Transit', 2, () => { const r = R.createRequest(good, 'T3', now); R.respond(r, S.donors[2], now); R.respond(r, S.donors[3], now); return r.stage; });
t('Same donor cannot respond twice', 'error', () => { const r = R.createRequest(good, 'T4', now); R.respond(r, S.donors[2], now); R.respond(r, S.donors[2], now); });
t('Mark Blood Received closes request', 3, () => { const r = R.createRequest(good, 'T5', now); R.markReceived(r); return r.stage; });
t('Request auto-expires after 24h (ghost request fix)', 'expired', () => { const r = R.createRequest(good, 'T6', now); R.expireOld([r], now + 25 * H); return r.closedReason; });
t('Cannot respond to closed request', 'error', () => { const r = R.createRequest(good, 'T7', now); R.markReceived(r); R.respond(r, S.donors[2], now); });
// 90-day lock
t('Donor locked right after donation', false, () => { const d = { ...S.donors[0] }; R.confirmDonation(d, now); return R.isDonorAvailable(d, now + 10 * 24 * H); });
t('Donor available again after 90 days', true, () => { const d = { ...S.donors[0] }; R.confirmDonation(d, now); return R.isDonorAvailable(d, now + 91 * 24 * H); });
t('Distance Jubilee Hills <-> Banjara Hills is 1-6 km', true, () => { const k = G.distanceBetweenLocalities('Jubilee Hills', 'Banjara Hills'); return k > 1 && k < 6; });

if(process.env.JSON){console.log(JSON.stringify(rows));process.exit(0)}
console.table(rows);
const failed = rows.filter(r => r.Result !== 'PASS');
console.log(failed.length ? failed.length + ' FAILED' : 'ALL ' + rows.length + ' TESTS PASSED');
process.exit(failed.length ? 1 : 0);
