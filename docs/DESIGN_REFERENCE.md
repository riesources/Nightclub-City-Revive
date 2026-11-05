# Design reference: what the original looked like

Written from public screenshots only. **No original art is copied or committed.** The screenshots stay outside the repo; everything below is a written description. Our own art is redrawn from scratch.

Labels: **CONFIRMED** (seen in a screenshot), **HEADLINE** (only a search-result headline was read), **GAP** (our build differs).

## Sources added in this pass
| # | Source | What it gave us |
|---|---|---|
| S11 | [To Game For Life, "Nightclub City in screenshots" (Feb 2012)](https://togameforlife.wordpress.com/2012/02/04/nightclub-city-in-screenshots/) | Five late-version player clubs and the world map (6 images). By far the best look at the finished game: walls, bar, crowd, avatars, bottom toolbar, expansion arrows. |
| S12 | Adweek, "Booyah Removes Energy from Nightclub City, Adds More Club Options" | HEADLINE only: the energy bar was removed late on, and more club options were added. |

Still blocked from this environment: MobyGames screenshots (HTTP 403), Merciad review (no response), TouchArcade (403). The Lost Media Archive thread and Wayback captures of `apps.facebook.com/nightclubcity` have not been checked.

## 1. The world map and multiple clubs (CONFIRMED, GAP)
- A night-sky **world map** shows club locations joined by roads, each on a glowing ring with a name, a star rating (out of 5) and a small scene of that district.
- Locations seen: DJ Alley (club "Drunken Excess"), Main Street ("The Blue Room"), Nashville ("Coyote Ugly"), Twilight Acropolis ("Gothic Realm"), TRON City ("Electric Dreams", a cross-promotion), Gaslight District (steampunk), Las Vegas, New York, Tokyo, plus two "?" slots for event-earned clubs.
- Badges: red "NEW!", padlocks on locked cities, neon "VACANCY" signs on unbought ones.
- Per the blogger: the first club is one of the biggest; early on you had to give up the old club to buy a new one, later you could own many. You unlock locations by level, expanding up and right across the map. Nashville once had country music, later removed.
- **Our build:** one club only. This is the biggest missing feature. See "Proposed work" below.

## 2. The room (CONFIRMED)
- The club is a floating isometric box on a **dark city street**: asphalt with lane markings, curbs, street lamps, and per-location surroundings (warm brick buildings with signs and string lights in Nashville, neon lines in TRON City, ruins in Twilight Acropolis). **GAP:** ours is plain dark tiles.
- **Two back walls, tall and themed**, with a pale cap on top. Each club dresses its walls differently: dark purple with arches, red patterned panels, black glass, brick. **GAP:** ours are light-grey brick in every club.
- **Back walls hold lit shelf alcoves full of bottles**, speakers stacked against the wall, a door, and wall art. **GAP:** we have none of this.
- The **bar is a long counter along a wall** with a row of drink tanks (purple liquid in tubes) on it, bottle shelves behind, the bartender in a white shirt behind it, and guests queuing along the front. **GAP:** ours is a short counter.
- In build mode, **green arrows around the room edge** expand the room in that direction. **GAP:** ours expands through the level-up unlocks, not arrows.
- Crowds of 20-30 guests on screen, thick with hats. Speech bubbles are white rounded rectangles with a heavy black border and a bold title ("Bottoms Up!") above small text. Floating cash text is green, two lines ("$27 Drink / $8 Tip"). Small white round thought bubbles with an icon float over guests who want something.

## 3. Avatars (CONFIRMED)
Seen on guests, the DJ, bouncers and the bartender:
- **Proportions:** chibi, roughly 2.5-3 heads tall. The head is as wide as the shoulders and the body is small with short stubby legs. Hands are tiny. **GAP:** ours are slightly taller, with a smaller head-to-body ratio.
- **Outline:** a thick dark outline around the whole figure and around the hair, with flat cel colours and one soft highlight. **GAP:** our outline is thinner and our shading is softer.
- **Face:** large round eyes with a white sclera and a big dark pupil, small mouth, simple nose, thin brows. Many guests wear **sunglasses** or round **glasses**. Our heavy-lidded eyes and angled brows are our own style and are less like the original.
- **Hair and headwear:** a wide range: mohawk, spikes, bob, ponytail, curly afro, long straight, plus **berets (red), fedoras, flat caps, hoods**. Hair colours include natural browns and black, plus bright blue, yellow, green, white-grey and streaked. Skin tones run from pale to very dark. **GAP:** we have 8 hairstyles, no hats or glasses.
- **Roles are readable at a glance:**
  - DJ: grey hair, sunglasses, white outfit, headphones, behind a turntable booth.
  - Bouncers: bald, sunglasses, black suit, arms crossed. Standing posture, not walking.
  - Bartender: white shirt, behind the counter.
  - Guests: casual coloured tops, jeans or shorts, trainers.
- Guests sit on sofas and booths and stand at the bar in a queue; arms-crossed bouncers stand at the room edge.

## 4. Interface layout (CONFIRMED)
- **Top-left:** now-playing card: album-art tile, song title, artist, a Like button, a Change button, an "Ends: time" line, and an iTunes download badge. (We built everything except the iTunes badge, which we will never add.)
- **Top-right, in the room's corner:** a **THROW A PARTY!** button with a disco-ball button beside it. (Built.)
- **Right edge:** the purple drink tube with a bottle-shaped cap, and a small stack of tool icons (full-screen, zoom in/out, save, eye, sound, music). (Built, minus full-screen and save.)
- **Bottom centre:** a dark band with a row of **large round icon buttons**: megaphone, gift box, avatar in a fedora (Dress Up), paint bucket (Decorate), move arrows (edit room), a smiling star (celebrities). **Bottom-left:** two avatar tabs with a blue selection border (guests and staff, probably). **GAP:** ours is a light-blue band with five labelled buttons. We lack the megaphone and gift buttons.
- The megaphone and gift icons suggest social features (invite friends, send gifts). These are Facebook features and are not planned.

## 5. Furniture seen
Podium DJ booth with a truss light rig and turntables; glass aquariums; frosted glass partitions; round bar tubes and drink tanks as decor; samurai-style statue; carved golden statue; moulded white lounge chairs around lime round tables; blue striped sofas with candle tables; teal curved booths; stacked speakers; a pool table and crate stacks (Nashville); tiled floors in many patterns (glowing cyan, purple star, black/white checker, mixed mosaics). Most of these are in our catalogue already as original redraws.

## Proposed work (not started)
1. **Avatar pass:** re-proportion the head and body, thicker outline, sunglasses and glasses, hats (beret, fedora, cap), more hair, role outfits (bouncer suit, bartender shirt), arms-crossed bouncer pose.
2. **Room pass:** street backdrop with lane lines and lamps, taller themed walls with lit bottle alcoves, longer bar with a tank row, expansion arrows.
3. **Bottom band:** dark band with large round icons (Decorate, Dress Up, Celebrities, Edit, Workers), blue-bordered tabs.
4. **World map and multiple clubs:** a map screen, club themes (wall, floor and street palettes), star ratings, level-gated locations, "VACANCY" signs, one save holding several clubs (needs a schema migration).
5. **Design boards in Figma or Canva** of the above so the look can be signed off before code.
