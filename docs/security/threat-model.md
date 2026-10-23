# Gate 0 threat model

| Threat                                        | Harm                                | Current control                                         | Verification               |
| --------------------------------------------- | ----------------------------------- | ------------------------------------------------------- | -------------------------- |
| Participant enters confidential data          | Unauthorized processing             | Repeated warning; no prompt requests private context    | Content and browser review |
| Draft survives longer than expected           | Privacy surprise                    | Session storage and explicit deletion                   | E2E storage/deletion test  |
| AI output appears before independent judgment | Invalid task and automation bias    | Staged UI and disabled progression                      | E2E flow test              |
| Mission 2 start counted as completion         | False retention evidence            | Separate started/completed events                       | Receipt E2E assertion      |
| Agent expands scope silently                  | Invalid prototype and new data risk | Scope-lock script and CLAUDE.md                         | Every QA cycle             |
| Credential enters repository                  | Account/system compromise           | `.gitignore`, secret-pattern scan, no integrations      | Every QA cycle             |
| Destructive agent command                     | Data or history loss                | Claude command guard and human approval                 | Project hook               |
| Dependency compromise                         | Build/runtime compromise            | Lockfile, minimal dependencies, audit, reviewed updates | Full QA and CI             |

Residual limitations: automated scanners do not replace human privacy/security review; browser exports become the participant/facilitator's responsibility after download; the prototype is not approved for sensitive data.
