// ABO/Rh compatibility (red cells). Derived from rules AND hardcoded, then cross-checked in tests.
(function (root) {
  const GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // recipient -> list of donors who can give to them (hardcoded clinical matrix)
  const COMPAT = {
    'A+':  ['A+', 'A-', 'O+', 'O-'],
    'A-':  ['A-', 'O-'],
    'B+':  ['B+', 'B-', 'O+', 'O-'],
    'B-':  ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+':  ['O+', 'O-'],
    'O-':  ['O-']
  };

  // rule-based version, used only to verify the table above
  function canDonateByRule(donor, recipient) {
    const split = g => ({ abo: g.replace(/[+-]/, ''), rh: g.slice(-1) });
    const d = split(donor), r = split(recipient);
    const aboOk = d.abo === 'O' || r.abo === 'AB' || d.abo === r.abo;
    const rhOk = d.rh === '-' || r.rh === '+';
    return aboOk && rhOk;
  }

  function canDonate(donorGroup, recipientGroup) {
    if (!COMPAT[recipientGroup]) throw new Error('Unknown blood group: ' + recipientGroup);
    return COMPAT[recipientGroup].includes(donorGroup);
  }

  const api = { GROUPS, COMPAT, canDonate, canDonateByRule };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RRCompat = api;
})(typeof window !== 'undefined' ? window : globalThis);
