# NASEEJ — Product & Gameplay Specification

## Product premise

NASEEJ is a quiet, premium geometric puzzle. The player traces one continuous route through points on the left side of a vertical axis. Every selected segment is reflected instantly on the right, turning a simple gesture into a complete symmetrical pattern.

## Core loop

1. Open a level and observe its faint geometric guide.
2. Touch the glowing start point at the top of the center axis.
3. Trace the points in sequence on the left side.
4. Watch the line mirror itself on the right side in real time.
5. Complete the route to reveal the finished design.
6. Save the pattern in the collection or share its PNG card.

## Controls

- Tap or drag from point to point.
- Hint highlights the next point.
- Undo removes the last selected point.
- Reset clears the current route.
- There is no countdown, lives system, loss screen, or paid retry mechanic.

## Difficulty progression

- Levels 1–5: basic turns and short routes.
- Levels 6–10: longer paths and alternating turns.
- Levels 11–16: more pronounced angles and changes of direction.
- Levels 17–24: interlaced-looking silhouettes and additional decoy points.
- Levels 25–30: longer routes with more frequent direction changes.

## Daily challenge

The daily puzzle is selected deterministically from the UTC date. All players using the same build on the same UTC day see the same level. Completing a daily level records it in the collection but does not skip the normal sequential unlock chain.

## Product principles

- Abstract geometry only; no human or animal characters.
- No music or sound effects in this MVP.
- No gambling, loot boxes, paid random rewards, or energy timers.
- No backend, login, tracking, or ads in the first release.
- Local-first progress storage so the game remains playable offline.
- Arabic and English UI with right-to-left and left-to-right layouts.

## MVP acceptance checklist

- [ ] The app opens in Arabic and can switch to English.
- [ ] The app fits a portrait phone screen and supports safe areas.
- [ ] Each of the 30 levels can be opened when unlocked.
- [ ] A player can select the route by tapping or dragging.
- [ ] The mirrored route appears on the opposite side.
- [ ] Wrong selections do not erase progress.
- [ ] Hint, undo, and reset work.
- [ ] Successful completion is persisted locally.
- [ ] A daily completion does not unlock the full campaign.
- [ ] A PNG pattern card can be shared or downloaded.
- [ ] The web build works without a server-side account or API.
