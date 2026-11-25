# Report Blueprint (target 30-40 pages)

Front matter: Title page (one institution name form) | Certificate (names typed, signed) | Declaration | Acknowledgement | Abstract | Table of Contents | List of Figures | List of Tables

1. **Introduction**: background (blood shortage, social-media chaos), problem statement (copy the brief), objectives (6-8 bullets), scope, organisation of report
2. **Literature / Existing system study**: 3-4 existing apps (e.g. e-RaktKosh, Red Cross donor app, social media pleas), table: existing system vs RedRelay
3. **Software and Hardware Requirements**: real versions (OS, Chrome, VS Code), functional + non-functional requirements
4. **System Design**: architecture diagram, use-case diagram, DFD level 0/1, ER diagram (Users, Donors, BloodRequests, FulfillmentTransactions), data dictionary, flowchart, algorithm for matching, compatibility matrix table, request state diagram
5. **Implementation**: module-by-module (with 8-10 short code snippets), privacy masking approach, expiry logic, 90-day lock, how localStorage maps to REST endpoints
6. **Testing**: 25-30 test cases table with actual results (use `npm test` output from starter-logic) + invalid-input screenshots + browser/screen-size checks
7. **Results**: full-page screenshots, each with 2-line caption, traceability table (brief feature -> module -> status)
8. **Conclusion, Limitations, Future Scope**: Express + PostgreSQL backend, real SMS (Twilio), doctor verification, OTP login, live GPS
References (IEEE style): brief, MDN, Red Cross, WHO, Leaflet docs, e-RaktKosh
Appendix: key source code, team contribution table, GitHub link

## Writing rules
- Say what you built, not what you did not. Put real gaps in ONE "Limitations" section.
- Every figure: numbered, captioned, referenced in text.
- Every claim in the abstract must be demonstrable in the Results chapter.
- Proofread names, roll numbers, institution name, dates against the title page.
