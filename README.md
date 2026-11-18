# Mars Lab (Space Apps Kumasi Sprint)

A small web page for a one-hour sprint. Teams use **real NASA weather data** on their phones, decide which place on Earth is most like Mars, make a **mission patch**, and **launch it to a big screen** where everyone sees it appear.

- **Mars Lab (teams, on phones):** https://phidlarkson.github.io/space-apps-kumasi-sprint/
- **Launch wall (project this on the big screen):** https://phidlarkson.github.io/space-apps-kumasi-sprint/wall.html
- **Showcase and awards (project this at the end):** https://phidlarkson.github.io/space-apps-kumasi-sprint/showcase.html
- **Crowd vote (open on phones):** https://phidlarkson.github.io/space-apps-kumasi-sprint/vote.html

## What a team does (about 15 minutes)
1. Pick 3 places (Kumasi is already chosen). NASA numbers appear: temperature, rain, sunlight.
2. Tap the place they think is most like Mars. The page gives feedback right away.
3. Name the team, pick a colour and an emoji, write one sentence. Build the patch (confetti, badges).
4. Launch it. It appears on the wall within a few seconds.
5. Level up: copy the self-filling AI prompt (it holds the team's real NASA numbers), paste it into an AI chat, paste the code back and watch it run.
6. Submit: tap the team number, copy the code and open the team's file on GitHub (`features/team-N.html`), paste over the whole file, Commit changes, Propose changes, Create pull request.
7. The coordinator merges the pull request. The team's page then appears on the **Showcase** page under its team button, and we award.

## Crowd voting
- Once teams have submitted, everyone opens **vote.html** on their phone (or taps *Open the crowd vote* in Mars Lab) and picks a team. Only teams with a submitted `features/team-N.html` can be voted for.
- One vote per device: the page makes up a random voter id and keeps it in the browser's localStorage. Tapping another team changes your vote; tapping your current choice again withdraws it.
- The top three teams and the total vote count update every 4 seconds on the **Showcase**, with a "Crowd pick" hint beside the *Crowd Favourite* award. The coordinator still chooses and reveals the winner.
- Votes go to a separate public ntfy.sh topic (`kumasi-gsc26-mtn78dup53-votes`) — the same backend-free message bus as the launch wall. There is no account, server or database, so votes are anonymous and not verified: treat this as a fun room poll, and use a show of hands if the result matters.

## For the coordinator
- Merge pull requests on the repo's Pull requests tab (Merge pull request, Confirm). The Showcase updates in about a minute; tap **Check for new submissions**.
- Each team has its own file (`features/team-1.html` to `team-6.html`), so merges never clash. To reset a team, restore its file from the first commit.
- Open the **wall** on your laptop and put it on the big screen. New cards pop in every few seconds.
- Hide a card with the small x in its corner (it hides on your screen only).
- The data is NASA POWER (power.larc.nasa.gov), the 2025 yearly average at one point per place. These are model estimates, so say "about".
- "Mars-likeness" is a simple recipe: half "how cold" and half "how dry". It is a talking point, not a verdict.

Space Apps Kumasi is a locally organised event held under the NASA Space Apps Challenge programme. Taking part is not affiliation with, sponsorship by, or endorsement from NASA or any space agency partner.
