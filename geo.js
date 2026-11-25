// Locality coordinates are APPROXIMATE (good enough for a demo radius filter).
(function (root) {
  const LOCALITIES = {
    'Jubilee Hills': [17.4326, 78.4071], 'Banjara Hills': [17.4156, 78.4347],
    'Secunderabad': [17.4399, 78.4983], 'Begumpet': [17.4447, 78.4664],
    'Ameerpet': [17.4375, 78.4483], 'Kukatpally': [17.4849, 78.4138],
    'Miyapur': [17.4967, 78.3586], 'Madhapur': [17.4486, 78.3908],
    'Hitech City': [17.4435, 78.3772], 'Gachibowli': [17.4401, 78.3489],
    'Kondapur': [17.4600, 78.3640], 'Uppal': [17.4058, 78.5591],
    'Dilsukhnagar': [17.3688, 78.5247], 'LB Nagar': [17.3457, 78.5522],
    'Medchal': [17.6296, 78.4817]
  };

  function haversineKm(a, b) {
    const R = 6371, rad = x => x * Math.PI / 180;
    const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function distanceBetweenLocalities(x, y) {
    if (!LOCALITIES[x] || !LOCALITIES[y]) return null;
    return haversineKm(LOCALITIES[x], LOCALITIES[y]);
  }
  // rough city driving estimate: ~25 km/h average in traffic
  function etaMinutes(km) { return Math.max(3, Math.round(km / 25 * 60)); }

  const api = { LOCALITIES, haversineKm, distanceBetweenLocalities, etaMinutes };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RRGeo = api;
})(typeof window !== 'undefined' ? window : globalThis);
