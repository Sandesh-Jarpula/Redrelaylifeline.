# RedRelay-LifeLine: Analysis of Previous Attempt

Compared: problem brief (fsd_letz_project.pdf) vs your report (RedRelay_LifeLine_Mini_Project_Report.pdf).
Note: I could only see the report text and screenshots, not your source code. Items marked (check code) need you to confirm in script.js.

## A. Where the project did not match the brief

| # | Brief says | What your report shows | Severity |
|---|-----------|------------------------|----------|
| 1 | Donor cards show **initials only** + locality | Cards show full names (Rahul Sharma, Arjun Reddy) | High (privacy is the headline feature) |
| 2 | Filter by **city AND proximity radius** | Exact city text match + locality text box. No radius at all | High |
| 3 | "I Can Donate" updates card to **1/2 Units Committed**, stepper moves to *Donors Responded* automatically | Stepper moved by manual buttons ("Update to Donors Responded") in Track Requests (check code whether feed button updates it) | High (this is THE demo scenario) |
| 4 | **Mark Blood Received** button + **24h expiry** to kill ghost requests | Only "Close Request". No expiry mentioned anywhere | High |
| 5 | Animated **red urgency pulses** on feed | Report never mentions or shows a pulse (check code) | Medium |
| 6 | Donor sees an **urgent notification** (demo step) | Role selector exists, but no donor-specific view/notification shown | Medium |
| 7 | **5** active requests, **30** donors | Dashboard shows 4 active requests (30 donors OK) | Low but visible |
| 8 | **90-day lock after confirmed donation** | Only a filter on lastDonation. Nothing sets it on donation (check code) | Medium |
| 9 | Stretch: SMS simulator, Leaflet map, appreciation certificate | None built | Medium (easy bonus marks) |
| 10 | Request data model: Users, Donors, BloodRequests, FulfillmentTransactions | No FulfillmentTransactions / responses record | Medium |
| 11 | Login | Any email/password is accepted, role not enforced | Low-Medium |
| 12 | Tech stack suggestion: React + Express + DB | Vanilla + localStorage (fine, you chose it) but report must justify it and show a mock API layer | Low if justified |

## B. Report mistakes

1. **The report argues against itself.** Phrases like "not verified", "not stated", "not identified", "no test log supplied" appear ~15 times. Evaluators read that as incomplete work. Fix: do the work, then state it confidently. Fill OS, versions, tool names.
2. **Test cases: 5 listed, only 3 with evidence, 2 "unverified".** Need 20-30 executed cases with actual results and screenshots, including invalid inputs.
3. **No Introduction / Problem Statement / Objectives / Scope / Existing-vs-Proposed System / Future Scope chapters.** The report starts at "Software Requirements". Most university mini-project formats expect these.
4. **No traceability to the brief.** Never says which brief feature maps to which module. Add a requirement-vs-implementation table.
5. **Screenshots:** browser chrome shows "Ask Gemini", pages are cut off mid-form (SOS form ends at "Units Required"), tiny text, no figure list. Use full-page screenshots (Chrome DevTools > Ctrl+Shift+P > "Capture full size screenshot").
6. **Inconsistent institution naming:** "MRTC (MRV)", "Malla Reddy Technical Campus", "Malla Reddy Vishwavidyapeeth Technical Campus". Use one official form everywhere.
7. **Blank signatures/date** on certificate and declaration pages, no guide/HOD names typed.
8. **No ER diagram / data dictionary / use-case diagram / DFD.** Block diagram + flowchart alone is thin for a "system design" chapter.
9. **References:** W3Schools is weak; add MDN, ABO/Rh source (Red Cross, WHO already ok), and cite the hackathon brief.
10. **Conclusion has no future scope** and no team contribution table (who did what).
11. **Code section shows 2 snippets.** Add a source-code appendix or GitHub link.
12. **No limitations-vs-brief honesty table.** Better: list what is done, partly done, and planned, with reasons.
13. **Abstract/keywords:** fine but should state results ("32 test cases, 100% pass") and the 3 key algorithms.

## C. Biggest score-losing pattern

The brief's rubric is almost certainly feature-by-feature (must-haves first, stretch as bonus) plus demo flow. You lost marks where the brief used specific words: *initials*, *radius*, *1/2 Units Committed*, *Mark Blood Received*, *24 hours*, *pulse*. Next attempt: copy every such phrase into a checklist and tick them off literally.
