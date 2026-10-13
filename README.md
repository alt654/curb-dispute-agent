# Curb dispute agent

An AI agent that helps NYC food truck and halal cart owners contest a parking ticket. It builds the evidence checklist, drafts a short statement, has a sceptical **checker** review every sentence, keeps a **claims ledger**, gives a **reading copy in the owner's language**, and makes the owner **confirm each sentence**. It never files, sends, contacts the city or pays. Not legal advice.

Built by Team Solar (Linda Sagwe, Sudina Wosti) for the AI Transformation Studio capstone. Appendix G of our paper.

**Try it:** open `index.html` (or the GitHub Pages link for this repo) and press **Show recorded run**. Live runs work when the page is opened as a claude.ai artifact, where it calls Claude directly.

## Three builds, same ticket

| | Agent 1 · Drafter | Agent 2 · Drafter + Checker | Agent 3 · Curb agent (final) |
|---|---|---|---|
| Pipeline | Drafter | Drafter → sceptical Checker | Drafter (stricter rules) → code number check → Checker → revise once → re-check (halt and log if still disputed) → reading copy (Spanish) |
| What changed | Baseline | A second agent that did not write the draft and only looks for unsupported claims | The drafter must never present the owner's word as proven; claims ledger per sentence; code check on times/amounts/numbers; one revision loop; disagreements halt instead of being smoothed over; Spanish reading copy |

## What happened on the sample ticket

Sample case: a $65 "commercial meter zone, no paid receipt" ticket. The owner says the meter was dead, they paid on ParkNYC at 11:52 for two hours, and they are "pretty sure" they reported the meter to 311. Evidence: photo of the blank meter and the ParkNYC receipt; no meter-number photo and no 311 number.

- **Agent 1** left the unproven 311 report out, but stated the meter and the payment date as plain fact and added a calculated "paid until 1:52 PM". Nothing reviewed it.
- **Agent 2**'s checker rated all five sentences "supported", including the inferred "paid until 1:52 PM". A checker on its own is only as sceptical as its instructions.
- **Agent 3** wrote the unproven parts as the owner's own statements. Its checker flagged 2 of 5 sentences as **"owner's word only"**: nothing ties the blank-meter photo to that exact meter without the meter-number photo, and the receipt shows no date. No sentence was unsupported, so no revision or halt was needed. The owner sees exactly which sentences rest on their word before confirming.

## Files

- `index.html`: the agent (Curb app UI, the three pipelines, prompts, code checks). The exact instructions for each step are in the `P` object.
- `runs.js` and `runs/*.json`: recorded outputs of each Claude call, used by "Show recorded run".
- `runs/*-prompt.txt`: the exact prompts sent for the recorded runs.
- `screenshots/`: the four owner interactions for each agent plus its step log.
- `tools/gen.cjs`: builds the checker/reviser/translator prompts from the page's own code.

## How the recorded runs were made

Each step was run on Claude (Claude Code harness, model Claude Opus 5.5) with the exact prompts in `index.html`, on 13 Oct 2026. The number check and the revise/halt rule are the page's own code. Times shown are the real time each call took. All data is sample data (fictional truck "Golden Crunch", sample ticket). The confirmation ticks in the screenshots are illustrative.
