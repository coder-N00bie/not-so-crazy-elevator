# 🛗 The Not So Crazy Elevator

A multiplayer trivia game: every question has four elevators, one per answer. Step into the right one and you ride up a floor. Get three in a row and you take the **express elevator** (+2 floors). First to the rooftop, or highest when the questions run out, wins.

- **Solo:** just ride.
- **Multiplayer:** create a room, share the 4-letter code or invite link, and everyone plays live.

## Tech
- Plain HTML/CSS/JS, hosted on GitHub Pages. No build step.
- Multiplayer runs on **Supabase Realtime** (presence for who's in the room, broadcast for game state). The room creator's browser runs the game loop.
- Supabase settings are in `config.js` (publishable key, safe for browsers).
- Questions live in `questions.js`; the first answer in each list is the correct one.
- Music: `music.mp3`.

## Run locally
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000.

## Updating
GitHub Pages caches files for a few minutes. After changing JS/CSS, bump the `?v=` number in `index.html` (and the imports at the top of `app.js`) so players get the new version right away.

## Rarity mode
Each round asks you to name something ("Name a fruit"). Answers are checked against the lists in `rare.js`, and the rarer your answer is among everyone who has ever played, the more floors you climb (up to 100).

All-time answer counts live in Supabase:
- table `public.rare_answers (prompt_id, answer, count)`: RLS on, no direct access for browsers
- function `public.submit_rare_answers(p_prompt text, p_answers text[]) returns json`: adds this round's answers and returns `{ total, counts }`. It's the only way in, and `anon` can execute it.

If Supabase can't be reached, the game falls back to guessing rarity from each list's order (common answers first).
