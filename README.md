# Little Table cafe demo

A local frontend demo using plain HTML, CSS, and JavaScript with Vite. Little Table is a placeholder business; every product and price is sample data. No backend or external services are connected.

## Run locally

Install a current Node.js LTS release (Vite requires Node 20.19+ or 22.12+).

```sh
npm install
npm run dev
```

Open the local address printed by Vite. The catalog is at `/` and the owner entry is at `/admin`.

On Windows, if PowerShell blocks `npm.ps1`, use `npm.cmd` instead of `npm` in these commands.

```sh
npm test
npm run build
npm run preview
```

`preview` serves the production build locally after `build`.

## Files to study

| File | Responsibility |
| --- | --- |
| `index.html` | Semantic document and JavaScript entry point |
| `src/data.js` | Sample products, availability, and prices |
| `src/orders.js` | Quantity validation, totals, request creation, and allowed status transitions |
| `src/storage.js` | Browser persistence, saved-data validation, and reset |
| `src/views.js` | Customer and owner screen markup; escapes customer input before rendering |
| `src/main.js` | UI state, navigation entry, form and button events |
| `src/style.css` | Warm cafe styling, focus indicators, mobile and desktop layouts |
| `test/orders.test.js` | Node tests for business rules and storage handling |

Start with `data.js` and `orders.js`, then follow the submit handler in `main.js` into `storage.js` and `views.js`. Event handlers call centralized business rules rather than deciding order statuses themselves.

## Demonstration walkthrough

1. Open `/`. Add sample Spanish latte and cookie items. Change quantities and compare the estimated total. The unavailable cheesecake cannot be added.
2. Enter a fictional name such as Alex Sample and fictional number `09000000000`. Optionally add notes. Select **Submit order request**.
3. The acknowledgment shows a unique demo reference and **Pending confirmation**. The submitted cart clears. Submission never means acceptance.
4. Open **Owner demo**, then **Enter owner demo**. No credentials are collected; this entry does not secure anything.
5. Open the request details and select **Confirm request**. The dashboard and details update immediately. Refresh, re-enter the owner demo, and verify the saved status.
6. Submit a second request through the menu. Open it in the owner demo and select **Decline request**. Use status filters to find both requests. Decided requests have no further decision controls.
7. Contacting customers happens outside this app through the business's existing chat/text process. No messages are sent.
8. Select **Reset demo data** and accept the confirmation. Requests, decisions, and the current cart clear; sample products remain. Canceling the confirmation preserves data.

## Limitations and future backend

- Use fictional customer details only. Requests and contact details persist in localStorage until reset or browser data is cleared. The unfinished cart and customer form are only held during the current page visit.
- Storage belongs to this browser and origin (including port). Different devices, browsers, or development URLs do not share requests. Same-origin tabs update when storage changes, but simultaneous writes across tabs are not transactional.
- No real authentication or authorization exists. Anyone can enter the dashboard or change browser data. Owner decisions are centralized UI demo rules, not a security boundary.
- Request items snapshot names, quantities, and prices at submission. Totals are estimates; no payment, delivery, pickup, or fulfillment rules are assumed.
- Storage errors prevent a successful acknowledgment. Invalid saved data is not silently overwritten: reset the demo to recover. Disabling browser storage can prevent use of the demo.
- Duplicate clicks cannot submit the same cart twice: submission is guarded and a successful submission empties the cart. A backend must add durable idempotency and transactional writes.
- A future backend must replace localStorage with a shared database, validate product availability and prices on the server, enforce owner authentication and authorization, and enforce status transitions atomically. Define privacy/retention policies before collecting real customer data. Payments and notifications require separate agreed requirements.

## Open client questions

- What are the actual products, prices, variants, and availability rules?
- Is fulfillment pickup, delivery, or both? What details are required?
- What is the expected lead time and business confirmation process?
- When and how should payment happen?
- What are the cancellation rules before and after confirmation?

## Verification

`npm test` checks empty carts, required fields, quantities, unavailable products, totals, pending defaults, unique references, item snapshots, correct confirm/decline transitions, persistence through a storage reload, reset, and corrupt/unavailable storage.

For manual browser QA, test `/` and `/admin` at 390px and 1280px widths, keyboard tab focus, required-field errors, rapid repeated submit clicks, refresh persistence, filter changes, and both reset confirmation choices. Automated unit tests use an in-memory storage stand-in; they do not replace an actual browser refresh or visual interaction check.

Checks performed during implementation: all 8 Node tests passed, the Vite production build passed, and local HTTP checks returned 200 for both `/` and `/admin` with the expected JavaScript entry. No browser automation tool was available, so mobile/desktop visual checks, actual browser refresh persistence, duplicate-click interactions, keyboard behavior, and reset confirmation interactions remain manual checks.
