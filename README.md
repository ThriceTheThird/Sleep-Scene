# Sleep Scene overlay

Transparent OBS browser-source overlay for the overnight "sleep scene": night tint, clock,
sleep timer, and read-only Twitch chat. Static files, no build, no backend, no tokens.

## Add to OBS (do this while offline or between segments)
1. In the sleep scene, add a **Browser** source on top of Lurkbait, camera and streamathon.
2. URL: `index.html` as a local file, or the hosted URL (GitHub Pages).
   Example: `https://thricethethird.github.io/Sleep-Scene/?channel=ThriceTheThird`
3. Width 1920, Height 1080. Leave Custom CSS empty (page is already transparent).
4. **Uncheck** "Shutdown source when not visible" and "Refresh browser when scene becomes active",
   so chat and game state survive scene switches.

## URL options
`channel` (default ThriceTheThird), `dim` 0-1, `stars` count, `max` chat lines, `fade` ms (0 = never),
`ignore` comma list of bot names, `commands=show`, `start` epoch ms for the sleep timer,
`demo=1` fake chat for layout testing.

## Roadmap
- [x] Night theme, clock, timer, chat
- [ ] Self-running chat word game
- [ ] Shared chat pixel canvas
