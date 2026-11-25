const C=RRCompat,G=RRGeo,P=RRPrivacy,R=RRRequests,M=RRMatching,STAGES=R.STAGES;
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
let donors=load('rr_d',null),requests=load('rr_r',null),user=load('rr_u',null);
if(!donors||!requests){donors=RRSeed.donors;requests=RRSeed.requests}
const save=()=>{try{localStorage.setItem('rr_d',JSON.stringify(donors));localStorage.setItem('rr_r',JSON.stringify(requests))}catch(e){}};
const toast=m=>{const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.display='none',3500)};
const locOpts=s=>Object.keys(G.LOCALITIES).map(l=>`<option ${l===s?'selected':''}>${l}</option>`).join('');
const gOpts=(all)=>(all?'<option value="">Select group</option>':'')+C.GROUPS.map(g=>`<option>${g}</option>`).join('');
const me=()=>user&&user.role==='Donor'?donors.find(d=>d.id===user.donorId):null;
const errs=l=>l.length?`<div class="err">${l.map(esc).join('<br>')}</div>`:'';

/* ---------- auth ---------- */
function loginView(){return `<div class="login panel"><h1 style="color:#dc2626">RedRelay</h1><p>Every drop can save a life.</p><form onsubmit="return login(event)">
<label>Email</label><input name="email" type="email" required><label>Password (min 6)</label><input name="pw" type="password" minlength="6" required>
<label>Login as</label><select name="role" onchange="document.getElementById('dsel').style.display=this.value==='Donor'?'block':'none'"><option>Patient / Requester</option><option>Donor</option></select>
<div id="dsel" style="display:none"><label>Your donor profile</label><select name="did">${donors.map(d=>`<option value="${d.id}">${esc(d.name)} (${d.blood}, ${esc(d.locality)})</option>`).join('')}</select></div>
<div id="lerr"></div><br><button style="width:100%">Sign in</button></form><p class="note">Demo build: accounts are stored in this browser only.</p></div>`}
function login(e){e.preventDefault();const f=new FormData(e.target),pw=f.get('pw');
 if(pw.length<6){$('#lerr').innerHTML=errs(['Password must be at least 6 characters']);return false}
 const role=f.get('role')==='Donor'?'Donor':'Patient';user={email:f.get('email'),role,donorId:role==='Donor'?f.get('did'):null};
 localStorage.setItem('rr_u',JSON.stringify(user));location.hash='dashboard';render();return false}
function logout(){localStorage.removeItem('rr_u');user=null;render()}

/* ---------- shared pieces ---------- */
function card(r){const open=r.stage<3;return `<div class="card ${open?'urgent':''}"><div class="row"><span class="bg">${r.blood}</span><span class="pill s${r.stage}">${STAGES[r.stage]}${r.closedReason==='expired'?' (expired)':''}</span></div>
<h3>${esc(r.hospital)}</h3><p>📍 ${esc(r.locality)}, ${esc(r.city)}</p><p>⏰ Deadline ${new Date(r.deadline).toLocaleString()}</p>
<div class="bar"><i style="width:${r.committed/r.units*100}%"></i></div><p><b>${r.committed}/${r.units} Units Committed</b></p>
${open?`<button onclick="donate('${r.id}')">❤ I Can Donate</button>`:''}</div>`}
function donate(id){const r=requests.find(x=>x.id===id),d=me();
 if(!d)return toast('Log in as a Donor to respond to an SOS.');
 if(!C.canDonate(d.blood,r.blood))return toast(`${d.blood} cannot donate to ${r.blood}.`);
 if(!R.isDonorAvailable(d))return toast(`You are not available${d.lastDonation?` (recovery: ${R.daysUntilEligible(d)} days left)`:''}.`);
 try{R.respond(r,d);save();toast(P.createRelay(d,r).message);render()}catch(x){toast(x.message)}}

/* ---------- views ---------- */
const views={
dashboard(){const act=requests.filter(r=>r.stage<3),need=act.reduce((s,r)=>s+r.units-r.committed,0),done=requests.reduce((s,r)=>s+r.committed,0),d=me();
 const alerts=d?act.filter(r=>C.canDonate(d.blood,r.blood)).map(r=>`<div class="alert"><span>🔔 <b>Urgent:</b> ${r.units-r.committed} unit(s) of ${r.blood} needed at ${esc(r.hospital)}, ${esc(r.locality)}</span><button onclick="donate('${r.id}')">I Can Donate</button></div>`).join(''):'';
 return `<h1>Dashboard</h1>${alerts}<div class="stats"><div class="panel">Active requests<b>${act.length}</b></div><div class="panel">Registered donors<b>${donors.length}</b></div><div class="panel">Units committed<b>${done}</b></div><div class="panel">Units still needed<b>${need}</b></div></div>
 <h2>Recent emergencies</h2><div class="grid">${requests.slice(0,6).map(card).join('')}</div>`},
sos(){return `<h1>Emergency SOS</h1><form class="panel form" onsubmit="return sos(event)"><label class="full">Patient name *</label><input class="full" name="patient" required>
<div><label>Hospital *</label><input name="hospital" required></div><div><label>City *</label><input name="city" value="Hyderabad" required></div>
<div><label>Hospital locality *</label><select name="locality">${locOpts('Jubilee Hills')}</select></div><div><label>Doctor verification contact *</label><input name="phone" inputmode="numeric" placeholder="10-digit mobile" required></div>
<div><label>Blood group *</label><select name="blood" required>${gOpts(1)}</select></div><div><label>Units (1-10) *</label><input name="units" type="number" min="1" max="10" required></div>
<div class="full"><label>Urgency deadline (within 24h) *</label><input name="deadline" type="datetime-local" required></div><div class="full" id="sosErr"></div><div class="full"><button>Broadcast SOS</button></div></form><div id="sosOut"></div>`},
find(){return `<h1>Find Compatible Donors</h1><form class="panel form" onsubmit="return find(event)"><div><label>Patient blood group</label><select name="blood">${gOpts()}</select></div><div><label>City</label><input name="city" value="Hyderabad"></div>
<div><label>Hospital locality</label><select name="locality">${locOpts('Jubilee Hills')}</select></div><div><label>Radius</label><select name="rad"><option>2</option><option>5</option><option selected>10</option><option>25</option></select></div><div class="full"><button>Search</button></div></form><div id="findOut"></div>`},
donor(){const d=me();return `<h1>Become a Donor</h1><form class="panel form" onsubmit="return reg(event)"><div><label>Full name *</label><input name="name" required></div><div><label>Blood group *</label><select name="blood" required>${gOpts(1)}</select></div>
<div><label>City *</label><input name="city" value="Hyderabad" required></div><div><label>Locality *</label><select name="locality">${locOpts()}</select></div><div><label>Phone (private) *</label><input name="phone" inputmode="numeric" required></div>
<div><label>Availability</label><select name="av"><option>Available</option><option>Unavailable</option></select></div><div class="full note">🔒 Your phone number is never shown. Requesters only see your initials and an in-app relay.</div><div class="full" id="regErr"></div><div class="full"><button>Register</button></div></form>
${d?`<h2>My profile</h2><div class="panel"><b>${P.maskName(d.name)}</b> · ${d.blood} · ${esc(d.locality)} · ${R.isDonorAvailable(d)?'Available':'Unavailable'}${d.lastDonation?`<br>Recovery lock: ${R.daysUntilEligible(d)} day(s) left`:''}<br><br><button class="alt" onclick="toggleAv()">Toggle availability</button></div>`:''}`},
feed(){const s=[...requests].sort((a,b)=>(a.stage===3)-(b.stage===3)||a.deadline-b.deadline);return `<h1>Emergency Broadcast Feed <span class="pill">● LIVE</span></h1><div class="grid">${s.map(card).join('')}</div>`},
track(){return `<h1>Request Tracking</h1>${requests.map(r=>`<div class="panel" style="margin-bottom:14px"><div class="row"><div><b>${esc(r.hospital)}</b><br><small>${esc(r.patient)} | ${r.blood}</small></div><b style="color:#dc2626;font-size:22px">${r.committed}/${r.units}</b></div>
<div class="steps">${STAGES.map((s,i)=>`<div class="step ${i<=r.stage?'done':''}"><span>${i<=r.stage?'✓':i+1}</span>${s}</div>`).join('')}</div>
${r.stage<3?`${user&&user.role!=='Donor'?`<button class="alt" onclick="confirmDon('${r.id}')">Confirm donation done (locks donors 90 days)</button> <button onclick="received('${r.id}')">Mark Blood Received</button>`:'<small>Only the patient family can close this request.</small>'}`:`<small>Closed (${r.closedReason||'received'})</small> ${r.responders.length&&r.closedReason!=='expired'?`<button class="alt" onclick="cert('${r.id}')">⬇ Donor certificate</button>`:''}`}</div>`).join('')}`},
guide(){return `<h1>Blood Compatibility Guide</h1><table><tr><th>Recipient</th><th>Compatible donors</th></tr>${C.GROUPS.map(g=>`<tr><td><b>${g}</b></td><td>${C.COMPAT[g].join(', ')}</td></tr>`).join('')}</table>`}};

/* ---------- actions ---------- */
function sos(e){e.preventDefault();const f=new FormData(e.target),req={patient:f.get('patient'),hospital:f.get('hospital'),city:f.get('city'),locality:f.get('locality'),blood:f.get('blood'),units:parseInt(f.get('units'),10),doctorPhone:f.get('phone'),deadline:new Date(f.get('deadline')).getTime()};
 const v=R.validateRequest(req);if(!v.ok){$('#sosErr').innerHTML=errs(v.errors);return false}
 const r=R.createRequest(req,'R'+Date.now());requests.unshift(r);save();$('#sosErr').innerHTML='';
 const pool=M.findEligibleDonors(r,donors,10);
 $('#sosOut').innerHTML=`<div class="panel" style="margin-top:14px"><h3>SOS broadcast. ${pool.length} compatible donors within 10 km</h3><p>Eligible groups: ${C.COMPAT[r.blood].join(', ')}</p><b>SMS dispatch simulator</b><div class="sms">${pool.map(d=>`SMS &rarr; ${d.initials} (${d.blood}, ${d.distanceKm} km, ETA ${d.etaMin} min): "URGENT ${r.units} unit(s) ${r.blood} at ${esc(r.hospital)}. Open RedRelay to respond."`).join('<br>')||'No donors in range.'}</div></div>`;return false}
function find(e){e.preventDefault();const f=new FormData(e.target);if(!f.get('blood')){$('#findOut').innerHTML=errs(['Choose the patient blood group']);return false}
 const pool=M.findEligibleDonors({blood:f.get('blood'),city:f.get('city'),locality:f.get('locality')},donors,+f.get('rad'));
 $('#findOut').innerHTML=`<p>${pool.length} eligible donor(s) for ${f.get('blood')}</p><div class="grid">${pool.map(d=>`<div class="card"><div class="row"><span class="bg">${d.blood}</span><span class="pill s2">Available</span></div><h3>${esc(d.initials)}</h3><p>📍 ${esc(d.locality)}, ${esc(d.city)}</p><p>🚗 ${d.distanceKm} km · ~${d.etaMin} min</p><p>📞 Contact: Private</p><button onclick="toast('Relay request sent. Donor will confirm in-app.')">Request via relay</button></div>`).join('')}</div>`;return false}
function reg(e){e.preventDefault();const f=new FormData(e.target),l=[];if(f.get('name').trim().length<2)l.push('Enter a valid name');if(!/^[6-9]\d{9}$/.test(f.get('phone')))l.push('Phone must be a valid 10-digit mobile number');if(!f.get('blood'))l.push('Choose blood group');
 if(l.length){$('#regErr').innerHTML=errs(l);return false}
 const d={id:'D'+String(donors.length+1).padStart(2,'0'),name:f.get('name').trim(),blood:f.get('blood'),city:f.get('city'),locality:f.get('locality'),phone:f.get('phone'),available:f.get('av'),lastDonation:null};
 donors.push(d);if(user&&user.role==='Donor'&&!user.donorId){user.donorId=d.id}save();toast('Registered. Your number stays private.');render();return false}
function toggleAv(){const d=me();d.available=d.available==='Available'?'Unavailable':'Available';save();render()}
function confirmDon(id){const r=requests.find(x=>x.id===id);r.responders.forEach(i=>R.confirmDonation(donors.find(d=>d.id===i)));save();toast(r.responders.length?'Donors locked for 90 days.':'No responders yet.');render()}
function received(id){R.markReceived(requests.find(x=>x.id===id));save();toast('Request closed. Thank you.');render()}
function cert(id){const r=requests.find(x=>x.id===id),d=me()||donors.find(x=>x.id===r.responders[0]),c=document.createElement('canvas');c.width=900;c.height=560;const x=c.getContext('2d');
 x.fillStyle='#fff';x.fillRect(0,0,900,560);x.strokeStyle='#dc2626';x.lineWidth=10;x.strokeRect(20,20,860,520);x.textAlign='center';x.fillStyle='#dc2626';x.font='bold 40px sans-serif';x.fillText('Certificate of Appreciation',450,130);
 x.fillStyle='#1e293b';x.font='24px sans-serif';x.fillText('Proudly presented to',450,200);x.font='bold 46px sans-serif';x.fillText(d?d.name:'A Life Saver',450,270);x.font='22px sans-serif';x.fillText(`for responding to an emergency ${r.blood} blood request at ${r.hospital}`,450,330);x.fillText('You helped save a life.',450,370);x.fillStyle='#dc2626';x.fillText('RedRelay LifeLine',450,470);
 const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='RedRelay-certificate.png';a.click()}

/* ---------- hospital routing map (Leaflet / OpenStreetMap) ---------- */
window.mapReq=null;
const mapState=()=>{const r=requests.find(x=>x.id===window.mapReq)||requests[0];return{r,pool:M.findEligibleDonors(r,donors,25)}};
views.map=()=>{const{r,pool}=mapState();return `<h1>Hospital Routing Map</h1><div class="panel"><label>Emergency request</label><select onchange="mapReq=this.value;render()">${requests.map(q=>`<option value="${q.id}" ${q.id===r.id?'selected':''}>${esc(q.hospital)} (${q.blood})</option>`).join('')}</select><div id="map" style="height:360px;margin-top:12px;border-radius:10px;background:#e2e8f0"></div></div>
<h3>Estimated transit to ${esc(r.hospital)}, ${esc(r.locality)}</h3><table><tr><th>Donor</th><th>Group</th><th>From</th><th>Distance</th><th>Est. drive time</th></tr>${pool.map(d=>`<tr><td>${esc(d.initials)}</td><td>${d.blood}</td><td>${esc(d.locality)}</td><td>${d.distanceKm} km</td><td>${d.etaMin} min</td></tr>`).join('')||'<tr><td colspan=5>No eligible donors within 25 km</td></tr>'}</table>`};
function drawMap(){const el=$('#map');if(!el)return;if(!window.L){el.innerHTML='<p class="note" style="margin:0">Map tiles need an internet connection. Distances and drive times are listed below.</p>';return}
 const{r,pool}=mapState(),c=G.LOCALITIES[r.locality],m=L.map('map').setView(c,12);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors'}).addTo(m);
 L.marker(c).addTo(m).bindPopup('<b>'+esc(r.hospital)+'</b><br>'+r.blood+' needed').openPopup();
 pool.forEach(d=>{const p=G.LOCALITIES[d.locality];L.circleMarker(p,{color:'#16a34a',radius:7}).addTo(m).bindPopup(esc(d.initials)+' ('+d.blood+')<br>'+d.distanceKm+' km, ~'+d.etaMin+' min');L.polyline([p,c],{color:'#dc2626',weight:2,dashArray:'6'}).addTo(m)})}
/* ---------- shell ---------- */
function render(){R.expireOld(requests);save();const app=$('#app');
 if(!user){app.innerHTML=loginView();return}
 const route=location.hash.slice(1)||'dashboard',nav=[['dashboard','Dashboard'],['sos','Emergency SOS'],['find','Find Donors'],['donor','Become a Donor'],['feed','Emergency Feed'],['track','Track Requests'],['map','Hospital Map'],['guide','Blood Compatibility']];
 app.innerHTML=`<div class="shell"><nav><h2>🩸 RedRelay</h2>${nav.map(n=>`<a href="#${n[0]}" class="${n[0]===route?'on':''}">${n[1]}</a>`).join('')}<hr><small>${esc(user.email)}<br>${user.role}</small><br><br><button class="alt" onclick="logout()">Logout</button></nav><main id="view">${(views[route]||views.dashboard)()}</main></div>`;if(route==='map')drawMap()}
window.addEventListener('hashchange',render);setInterval(()=>{if(user&&!document.querySelector('form:focus-within'))render()},60000);render();
