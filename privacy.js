// Public UI must NEVER receive phone numbers or full names.
(function (root) {
  function maskName(full) {
    return full.trim().split(/\s+/).map(p => p[0].toUpperCase() + '.').join(' ');
  }
  function maskPhone(p) { return 'XXXXXX' + String(p).slice(-2); }

  // what the public donor card is allowed to see
  function toPublicDonor(d) {
    return { id: d.id, initials: maskName(d.name), blood: d.blood, city: d.city,
             locality: d.locality, available: d.available };
  }
  // In-app relay: donor pressed "I Can Donate"; family never sees the number.
  function createRelay(donor, request) {
    return { donorId: donor.id, requestId: request.id, channel: 'in-app',
             message: 'A compatible donor (' + maskName(donor.name) + ') can donate. Please confirm hospital desk.' };
  }
  const api = { maskName, maskPhone, toPublicDonor, createRelay };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RRPrivacy = api;
})(typeof window !== 'undefined' ? window : globalThis);
