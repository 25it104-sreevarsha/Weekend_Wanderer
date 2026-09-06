# Manual test cases

Automated unit tests (`tests.html`) cover the pure search/filter/sort/recommendation
logic. These cases cover UI flows that touch the DOM, localStorage, and keyboard
interaction, and should be re-run manually before each submission.

| # | Case | Steps | Expected result |
|---|------|-------|------------------|
| 1 | Search narrows grid | Type "goa" in the search box | Grid shows only Goa; result count updates |
| 2 | Search — no results | Type "xyzxyz" | "No destinations match…" empty state shown, query is escaped, no console errors |
| 3 | Filter combination | Check "Chill" (mood) and "Budget-friendly" | Grid shows only destinations matching both; a chip appears for each active filter |
| 4 | Clear filters | With filters active, click "Clear filters" | All checkboxes uncheck, chips disappear, grid resets |
| 5 | Sort by price | Choose "Price: Low to high" | Grid re-orders ascending by price, independent of current search/filter |
| 6 | Open detail | Click a card | Modal opens with gallery, description, highlights; focus moves to close button |
| 7 | Modal keyboard trap | With modal open, press Tab repeatedly | Focus cycles only within the modal; `Escape` closes it and returns focus to the card |
| 8 | Save from card | Click the heart icon on a card | Heart fills in; Favorites pill count increments; persists after page refresh |
| 9 | Save from modal | Open a destination, click "Save for later" | Button switches to "Saved to favorites"; heart on the matching card also updates |
| 10 | Remove favorite | Open Favorites drawer, click × on an item | Item disappears from drawer and count decrements; heart on card unfills |
| 11 | Add to plan | Click "+ Add to weekend plan" on a card | Destination appears under Day 1 in the planner section |
| 12 | Reorder plan | With 2+ items in Day 1, click ↑ / ↓ | Item order swaps; buttons disable at the top/bottom of the list |
| 13 | Remove from plan | Click × on a planned item | Item removed; "Your weekend is empty so far" shown if the plan becomes empty |
| 14 | Plan persistence | Add items to the plan, refresh the page | Planned items remain (loaded from localStorage) |
| 15 | Recommendations | Answer all 3 quiz questions | "Recommended for you" grid shows up to 3 matches with a match % badge |
| 16 | Reset quiz | Click "Reset answers" | Chip selections clear, recommendations section hides again |
| 17 | Responsive layout | Resize to ~375px width | Filter panel stacks above results, grid becomes 1 column, no horizontal scroll |
| 18 | Screen reader labels | Inspect with a screen reader or the accessibility tree | Search input, sort select, heart buttons, and modal all announce meaningful labels |
