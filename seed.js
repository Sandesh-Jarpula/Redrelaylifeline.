// 30 donors (all 8 groups, 15 localities) + 5 active requests, as the brief demands.
(function (root) {
  const names = ['Rahul Sharma','Arjun Reddy','Priya Kumar','Sneha Rao','Kiran Patel','Anjali Das','Vikram Singh','Meena Iyer','Rohit Verma','Divya Nair',
    'Suresh Babu','Lakshmi Devi','Imran Khan','Pooja Gupta','Naveen Kumar','Swathi Reddy','Harish Goud','Neha Joshi','Ravi Teja','Ayesha Begum',
    'Karthik Raj','Bhavana Sri','Manoj Yadav','Tejaswini M','Faisal Ali','Deepa Menon','Sandeep Rao','Keerthi S','Varun Chowdary','Mounika P'];
  const groups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
  const locs = ['Jubilee Hills','Banjara Hills','Secunderabad','Begumpet','Ameerpet','Kukatpally','Miyapur','Madhapur',
    'Hitech City','Gachibowli','Kondapur','Uppal','Dilsukhnagar','LB Nagar','Medchal'];
  const donors = names.map((name, i) => ({
    id: 'D' + String(i + 1).padStart(2, '0'), name, blood: groups[i % 8], city: 'Hyderabad',
    locality: locs[i % locs.length], phone: '98' + String(48000000 + i * 1237).slice(0, 8),
    available: i % 7 === 6 ? 'Unavailable' : 'Available', lastDonation: null }));

  const H = 60 * 60 * 1000, now = Date.now();
  const mk = (id, patient, hospital, locality, blood, units, hrs, stage, committed) =>
    ({ id, patient, hospital, city: 'Hyderabad', locality, blood, units, doctorPhone: '9000000000' ,
       deadline: now + hrs * H, stage, committed, responders: [], createdAt: now, expiresAt: now + 24 * H, closedReason: null });
  const requests = [
    mk('R1','Ramesh Kumar','Apollo Hospital','Jubilee Hills','B+',2,4,0,0),   // the demo request
    mk('R2','Anjali Sharma','Yashoda Hospital','Secunderabad','O-',3,6,0,0),
    mk('R3','Arjun Reddy','KIMS Hospital','Begumpet','A+',1,8,0,0),
    mk('R4','Priya Rao','Care Hospital','Banjara Hills','AB+',2,5,0,0),
    mk('R5','Mohan Das','Rainbow Hospital','Kukatpally','A-',2,3,0,0)
  ];
  const api = { donors, requests };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RRSeed = api;
})(typeof window !== 'undefined' ? window : globalThis);
