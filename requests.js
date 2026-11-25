// Request lifecycle + validation + donor recovery lock.
(function (root) {
  const DAY = 24 * 60 * 60 * 1000;
  const STAGES = ['Open / Broadcasted', 'Donors Responded', 'Fulfilled / In Transit', 'Closed'];
  const GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  function validateRequest(f, now = Date.now()) {
    const errors = [];
    if (!f.patient || f.patient.trim().length < 2) errors.push('Patient name required');
    if (!f.hospital) errors.push('Hospital required');
    if (!f.city) errors.push('City required');
    if (!f.locality) errors.push('Locality required');
    if (!GROUPS.includes(f.blood)) errors.push('Valid blood group required');
    if (!Number.isInteger(f.units) || f.units < 1 || f.units > 10) errors.push('Units must be 1-10');
    if (!/^[6-9]\d{9}$/.test(String(f.doctorPhone || ''))) errors.push('Doctor contact must be a valid 10-digit mobile number');
    if (!(f.deadline > now)) errors.push('Deadline must be in the future');
    if (f.deadline > now + DAY) errors.push('Deadline cannot be beyond 24 hours');
    return { ok: errors.length === 0, errors };
  }

  function createRequest(f, id, now = Date.now()) {
    const v = validateRequest(f, now);
    if (!v.ok) throw new Error(v.errors.join('; '));
    return { id, ...f, stage: 0, committed: 0, responders: [], createdAt: now,
             expiresAt: now + DAY, closedReason: null };
  }

  // "I Can Donate": commits ONE unit per donor, moves stepper automatically.
  function respond(req, donor, now = Date.now()) {
    if (req.stage === 3) throw new Error('Request is closed');
    if (now > req.expiresAt) throw new Error('Request expired');
    if (req.responders.includes(donor.id)) throw new Error('Donor already responded');
    if (req.committed >= req.units) throw new Error('Units already fully committed');
    req.responders.push(donor.id);
    req.committed += 1;
    req.stage = req.committed >= req.units ? 2 : 1;
    return req;
  }

  // Family presses "Mark Blood Received" -> closes request (kills ghost requests)
  function markReceived(req) { req.stage = 3; req.closedReason = 'received'; return req; }

  // run on page load + every minute
  function expireOld(requests, now = Date.now()) {
    requests.forEach(r => { if (r.stage !== 3 && now > r.expiresAt) { r.stage = 3; r.closedReason = 'expired'; } });
    return requests;
  }

  // confirmed donation -> donor locked for 90 days
  function confirmDonation(donor, now = Date.now()) { donor.lastDonation = now; return donor; }
  function isDonorAvailable(donor, now = Date.now()) {
    return donor.available === 'Available' && (!donor.lastDonation || now - donor.lastDonation >= 90 * DAY);
  }
  function daysUntilEligible(donor, now = Date.now()) {
    if (!donor.lastDonation) return 0;
    return Math.max(0, Math.ceil((donor.lastDonation + 90 * DAY - now) / DAY));
  }

  const api = { DAY, STAGES, validateRequest, createRequest, respond, markReceived, expireOld,
                confirmDonation, isDonorAvailable, daysUntilEligible };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RRRequests = api;
})(typeof window !== 'undefined' ? window : globalThis);
