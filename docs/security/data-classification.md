# Data classification

| Class                       | Gate 0 treatment                             | Examples                                                  |
| --------------------------- | -------------------------------------------- | --------------------------------------------------------- |
| Public/synthetic            | Allowed                                      | Fixed fictional scenarios and controlled outputs          |
| Anonymous research artifact | Browser session only; explicit export/delete | Session code, structured answers, timestamps              |
| Personal data               | Not requested or required                    | Name, email, employer identity                            |
| Confidential/restricted     | Prohibited                                   | Client files, patient data, employee records, credentials |

## Controls

- No participant identity field.
- No third-party analytics or monitoring SDK.
- No server database in Gate 0.
- `sessionStorage` rather than long-lived browser storage.
- Clear warning against entering protected or confidential information.
- Explicit receipt export and deletion.
- Synthetic fixtures only in source control and tests.

If persistent identity, a database, model calls, monitoring, or organizational data becomes necessary, stop and open a protected decision before implementation.
