# Requirement Traceability Checklist (tick every box before submitting)

## Must-have
- [ ] SOS form fields: patient name, hospital, locality, city, blood group, units, urgency deadline, doctor contact (validate: future deadline, <=24h, 10-digit phone, units 1-10)
- [ ] ABO/Rh engine: hardcoded matrix, shown in a guide page, tested for all 64 pairs
- [ ] 4-stage stepper: Open / Broadcasted -> Donors Responded -> Fulfilled / In Transit -> Closed (moves AUTOMATICALLY on "I Can Donate")
- [ ] Donor registry: blood group, city, locality, availability toggle, phone stored but never displayed
- [ ] Privacy masking: initials only, "Contact: Private", in-app relay button
- [ ] Locality filter: city + radius dropdown (2/5/10/25 km) + distance and ETA shown on each card
- [ ] Emergency feed: red pulse animation (CSS keyframes), live "x/y units" counter, sorted by urgency
- [ ] Ghost-request protection: 24h expiry + "Mark Blood Received" button
- [ ] Seed data: 30 donors (all 8 groups), 5 active requests

## Demo script (rehearse until it takes under 3 minutes)
1. Login as Patient family -> post "2 units B+, Apollo Hospital, 4 hours"
2. Show the matched pool: only B+, B-, O+, O- donors, nearest first, initials only
3. Switch role to Donor (O+) -> see urgent notification -> click "I Can Donate"
4. Public card instantly shows "1/2 Units Committed", stepper = Donors Responded
5. Second donor commits -> Fulfilled / In Transit
6. Family clicks "Mark Blood Received" -> Closed

## Stretch (do at least 3 for bonus)
- [ ] SMS SOS dispatch simulator (modal listing "SMS sent to D03, D07 ..." with masked message text)
- [ ] Leaflet + OpenStreetMap map with hospital marker and donor ETA (needs internet CDN)
- [ ] 90-day lock set automatically on confirmed donation, with "eligible again in N days"
- [ ] Downloadable donor certificate (HTML canvas -> PNG)

## Extra polish that graders notice
- [ ] Separate pages/routes with a guarded login (redirect to login if no session)
- [ ] Empty states, error messages next to fields, mobile layout checked at 375px
- [ ] No console errors; no hardcoded demo credentials shown in the UI
- [ ] README with run steps, features list, screenshots, team roles
