# Assignment 1

## Bug‑Bash & Improvement Brief

As part of this task, I conducted a bug-bash and usability review of the [T‑RIZE platform](https://platform.t-rize.io). The objective was to identify potential bugs, UI/UX issues, and areas for improvement from the perspective of a front-end developer.

Each issue in the brief includes:

- A description of the problem
- A suggested fix or improvement
- An estimated effort to implement the fix
- A severity rating (Low, Medium, High)
- Notes for additional information

📄 [Link to the Bug‑Bash & Improvement Google Sheet](https://docs.google.com/spreadsheets/d/1KaVDvzhZhYWa74zqATsZNhuErjpX9514YM1lLS2rQEE/edit?usp=sharing)

# Assignment option B

## Goal

Display a live price ticker and rolling list of price updates from a mocked SSE endpoint.

## Requirements Create `OrderBook.tsx` that:

1. Opens an SSE connection to `/api/order-stream`.
2. Shows last price and maintains the latest 20 updates in state.
3. Renders bid/ask table (timestamp | price); highlight price up/down ticks (Green blink if price ↑, red if ↓).
4. Gracefully handle disconnect / reconnect.
5. Has unit test for the stream handler or a cypress test covering a happy path.

### Creative Freedom (Stretch – optional)

• Add a high‑/low‑water‑mark column, mini‑sparkline, etc.

## File tree

order‑book‑widget/
├─ app/
│ ├─ api/
│ │ └─ order‑stream/route.ts ← mock SSE
│ └─ page.tsx
├─ components/OrderBook.tsx ← implement
├─ jest.config.js
├─ package.json
└─ tsconfig.json
