# Playbook: how to score 95%+ without messing up

## Time plan (adjust to your deadline)
| Phase | Share | Output |
|-------|-------|--------|
| Read brief, make checklist | 5% | 02_Requirement_Checklist.md copied and filled |
| Core logic + seed data | 15% | Use starter-logic/src (already tested) |
| Pages: login, dashboard, SOS, donors, feed, track, guide | 35% | One HTML per route, shared nav + auth guard |
| Stretch features | 10% | SMS simulator, 90-day lock, certificate, then map |
| Testing + screenshots | 10% | `npm test` log, invalid-input screenshots |
| Report | 20% | Follow 03_Report_Blueprint.md |
| Rehearsal + freeze | 5% | Demo 3 times, no new code in the last day |

## Rules to avoid "messing up"
1. Do not start a feature unless it is on the checklist.
2. Freeze code 24h before the deadline; only fix bugs after that.
3. Keep a backup/zip after every working milestone (or use git).
4. Open the project in a fresh Chrome profile before submitting (catches localStorage assumptions).
5. Clear localStorage and reload: the seed data must rebuild with 30 donors and 5 requests.
6. Test on offline mode: show a fallback if Font Awesome/Leaflet CDNs fail.
7. Screenshot only after the final UI is frozen.

## How to use starter-logic in plain HTML/JS
Load in order on any page:
```html
<script src="src/compat.js"></script><script src="src/geo.js"></script>
<script src="src/privacy.js"></script><script src="src/requests.js"></script>
<script src="src/matching.js"></script><script src="src/seed.js"></script>
```
Then: `RRMatching.findEligibleDonors(request, donors, 10)` returns public (masked) donor objects with distance and ETA;
`RRRequests.respond(request, donor)` commits one unit and advances the stepper;
`RRRequests.expireOld(requests)` on page load; `RRRequests.markReceived(request)` for the family button.
Persist with localStorage as before. Run `node tests/run-tests.js` for the evidence table.

Red pulse CSS: 
```css
.urgent{animation:pulse 1.4s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(220,38,38,.6)}70%{box-shadow:0 0 0 14px rgba(220,38,38,0)}100%{box-shadow:0 0 0 0 rgba(220,38,38,0)}}
```

## Honest note
No one can guarantee a mark, since grading depends on your evaluators. But closing every gap in the analysis and matching the brief's wording literally removes the main reasons marks are lost. Send me your script.js next and I will check the (check code) items.
