# Gate 0 event and artifact dictionary

The prototype does not transmit analytics. These events exist only inside the exported browser-session receipt.

| Event          | Definition                                               | Counts toward Gate 0                              |
| -------------- | -------------------------------------------------------- | ------------------------------------------------- |
| `M1_STARTED`   | Mission 1 session record created                         | Operational only                                  |
| `M1_COMPLETED` | Required Mission 1 fields submitted and receipt reached  | Mission 1 completion                              |
| `M2_STARTED`   | User voluntarily opens Mission 2 and a record is created | Report separately; not continuation success alone |
| `M2_COMPLETED` | Required Mission 2 fields submitted and receipt reached  | Mission 2 continuation outcome                    |

Receipt fields: schema version, anonymous session code, mission ID, start time, optional completion time, structured answers, and ordered events. It contains no requested name, email, employer, or hidden device identifier.
