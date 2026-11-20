# Housing search skill

A Claude skill for finding a place to live for a fixed stretch, such as a school year or a contract. Claude pins the end date from the official source, searches Airbnb and local monthly and winter rentals, filters by pets, all-in budget and walkability, and ranks a shortlist by drive time to the places you care about. You book; Claude never contacts hosts without your go ahead.

## What's in it
- `SKILL.md`: the process.
- `references/profile-template.md`: the standing facts to keep about the renter (pets, anchors, budget), stored outside the skill.
- `scripts/airbnb_search.js`, `scripts/listing_text.js`: Playwright helpers that print Airbnb search cards and full listing text.
