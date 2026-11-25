// Matching engine = compatibility + availability/90-day lock + city + radius, sorted nearest first.
(function (root) {
  const C = typeof require !== 'undefined' ? require('./compat') : root.RRCompat;
  const G = typeof require !== 'undefined' ? require('./geo') : root.RRGeo;
  const R = typeof require !== 'undefined' ? require('./requests') : root.RRRequests;
  const P = typeof require !== 'undefined' ? require('./privacy') : root.RRPrivacy;

  function findEligibleDonors(req, donors, radiusKm = 10, now = Date.now()) {
    return donors
      .filter(d => C.canDonate(d.blood, req.blood))
      .filter(d => d.city.toLowerCase() === req.city.toLowerCase())
      .filter(d => R.isDonorAvailable(d, now))
      .map(d => ({ d, km: G.distanceBetweenLocalities(d.locality, req.locality) }))
      .filter(x => x.km !== null && x.km <= radiusKm)
      .sort((a, b) => a.km - b.km)
      .map(x => ({ ...P.toPublicDonor(x.d), distanceKm: +x.km.toFixed(1), etaMin: G.etaMinutes(x.km) }));
  }
  const api = { findEligibleDonors };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RRMatching = api;
})(typeof window !== 'undefined' ? window : globalThis);
