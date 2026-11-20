---
name: housing-search
description: Use when finding a place to live for a set stretch (a school program, a job, a season): pin the end date, search Airbnb plus local monthly and winter rentals, filter for pets, budget and walkability, and rank a shortlist by distance to the places that matter.
metadata:
  author: Alican Rowe (@alicanrowe)
---

# Housing search

Get from "find me a place until X" to a short, ranked list the renter can act on today. **Claude never books, applies, pays, or messages a host or landlord without the renter's go ahead.** Drafting a message for them to approve is fine.

## 1. Load the renter's profile first
Before searching, read the renter's housing profile in the project's working files (kept **outside** this skill folder so the skill stays free of private data). It holds the standing facts that should never have to be asked twice: pets (species, breed, weight), people who must stay close (dog sitter, work, school), budget, must-haves, and nice-to-haves like walkability. If the profile doesn't exist yet, create it from what the renter says, and add to it every time they mention a new standing fact during a search. See `references/profile-template.md`.

Facts that change the filters, and how to use them:
- **Pet weight and size.** Many listings say "small dogs only" or "under 30 lb". Know the actual weight so these can be marked as a fit rather than "depends".
- **Anchor places** (school, sitter, work). Rank by drive time to all of them, not only the main one.
- **The daily route.** Ask how the day chains the anchors (e.g. home → drop the dog at the sitter → school, then back the same way). Rank by the total loop time, not by direct distance to the main anchor. A place right next to school can be the worst pick if the sitter is in the other direction.
- **Walkability / bar nearby.** Note whether each place is in a village center or rural.

## 2. Pin the dates
- Find the official end date from the program's or employer's own page, not from a news story or an aggregator. Cite it.
- Search from tomorrow through the day after the end date (checkout).

## 3. Search, widest net first
Airbnb is usually thin for 6+ month stays in small towns, so always search local long-term sources too.
1. **Airbnb** with the exact dates, `pets=1`, `price_max` a little above budget (to show near-misses). Airbnb's results "in <town>" spill far outside the town, so check each result's real town. Results with shifted dates ("Nov 26 – May 25") don't cover the full stay; label them.
   `node scripts/airbnb_search.js "<search url>" ...` prints each card's link and text.
2. **Craigslist** apartments by zip and radius: `https://<region>.craigslist.org/search/apa?postal=<zip>&search_distance=15&max_price=<budget>`. Then `node scripts/listing_text.js <urls>` to read each post's full body (pets, lease length, utilities, dates). Look for "winter rental" posts: in seasonal towns many run fall through spring, which is a good fit for a school year.
3. **TurboTenant / Zillow / VRBO** for more listings. Craigslist posts often link to a TurboTenant page with a structured pet policy and lease length.
4. Furnished Finder blocks automated browsers (Cloudflare). Don't retry it; give the renter the search link instead.

## 4. Filter and price all-in
- Budget is **all-in per month**: rent plus any fixed utility fee, plus an estimate for heat and electric when the tenant pays them. In cold climates, winter heat can add $200 to $400 a month.
- Drop listings that say no pets. Keep "pets not mentioned" listings, but flag them as a question to ask.
- Note furnished or unfurnished, lease length vs. the needed span, start date (and any gap nights before it), and the deposit.

## 5. Distance
Geocode anchors and listings at street level (no house numbers for private people), then get drive times from OSRM: `https://router.project-osrm.org/route/v1/driving/<lon>,<lat>;<lon>,<lat>?overview=false`. Nominatim rate-limits quickly (HTTP 429). Send at most one request per 1.5 s, and fall back to known town-center coordinates if needed. Overpass (for counting bars and cafés nearby) is often unreachable; use a web search for "bar <street> <town>" instead.

## 6. Shortlist
About five places, best pick first. For each one: price all-in, the daily-route loop time (and drive time to each anchor), dates/lease, pet policy vs. the actual pet, furnished, walkability, and a link. Add one line for the best near-miss that's over budget, and say plainly when a source (e.g. Airbnb) had nothing.

## 7. Reaching out
Draft each inquiry, then run it through the humanising pass in `references/messages.md`: short, spoken, one ask, no AI tells, and true facts only. Show the renter the drafts. Send nothing without their OK, and never get around a captcha to reveal a contact. If the contact is hidden, ask the renter to reveal it.

Once the renter OKs a draft, pick the channel by what the listing gives you:
- **Craigslist:** the reply email is behind a captcha. The renter reveals it and pastes the relay address (`...@hous.craigslist.org`). Send from the renter's own webmail in their browser. Don't assume a desktop mail app is set up.
- **TurboTenant and similar landlord sites:** fill the "Contact the landlord" form yourself (name, phone, email, message), then hand the renter the captcha box and the Send button. Check for the "Information Sent!" page before you call it done.
- **Phone number only:** confirm it can take texts first. Many small landlords list a landline, so an SMS shows "Not Delivered". Fall back to the listing's form, or have the renter call.
- **Pet photo:** make one card image (a few photos, name, weight, breed, one line on temperament) and attach the same card to every inquiry, not a loose stack of photos. Attach the image file itself. Never attach a screenshot of a page showing it: the screenshot picks up the app's toolbar and looks sloppy. If the browser can't reach the file, inject the real file into the attach input, or ask the renter to drag it in. Open the attachment preview before sending.

After sending, list for the renter what went where, mark each draft sent, and close any browser tabs you opened.

## Lessons
- Small seasonal towns: Airbnb often has zero full-span, pet-friendly whole units under a mid budget, while Craigslist "winter rentals" and small landlords on TurboTenant have several.
- Two Craigslist posts for one unit can show different prices; flag both.
- Captchas belong to the renter. Fill everything else so their part takes one tick and one click.
- A landlord's listed number is often a landline. Don't spend a round trip on a text that can't land.
- Line up viewings for one day: ask every landlord for the same date in the first message.
- Sent email can't be pulled back after webmail's few-second undo window, so check the attachment before you press Send, not after.
