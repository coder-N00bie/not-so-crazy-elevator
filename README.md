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
