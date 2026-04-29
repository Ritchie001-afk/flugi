# Make Facebook and Instagram Autoposting

This runbook is the implementation contract for [FLU-24](/FLU/issues/FLU-24).

## Feed

- JSON feed for Make: `https://www.flugi.cz/api/social/autopost`
- Stable source fallback: `https://www.flugi.cz/api/deals/feed`
- RSS fallback: `https://www.flugi.cz/feed.xml`
- Dedupe key: `dedupeKey`
- Image field for Instagram: `make.imageUrl`

## Recommended Make Scenario

1. `HTTP > Make a request`
   - `GET https://www.flugi.cz/api/social/autopost?limit=10`
   - Parse response body as JSON.
2. `Tools > Iterator`
   - Iterate over `items`.
3. `Data store > Get a record`
   - Key: `{{2.dedupeKey}}`
   - Purpose: prevent duplicate publishes on repeated feed reads.
4. `Flow control > Router`
   - Branch A: publish when no stored record exists and `publishingDecision = publish`.
   - Branch B: operator review when no stored record exists and `publishingDecision = manual_review`.
5. Branch A: `Facebook Pages > Create a Post`
   - Message: `{{2.make.facebookMessage}}`
   - Link URL: `{{2.make.canonicalUrl}}`
6. Branch A: `Instagram for Business > Create a Photo Post`
   - Caption: `{{2.make.instagramCaption}}`
   - Image URL: `{{2.make.imageUrl}}`
7. Branch A: `Data store > Create/Update a record`
   - Key: `{{2.dedupeKey}}`
   - Store `payloadHash`, `publishedAt`, `canonicalUrl`, `facebookPostId`, `instagramMediaId`.
8. Branch B: operator alert
   - `Email > Send an email` or Slack/Teams equivalent.
   - Include `canonicalUrl`, `manualReviewReasons`, `facebookCaption`, and `instagramCaption`.
9. Error handler on both publish modules
   - Send the same alert payload plus the Make error bundle.

## Required Credentials and Permissions

- Make connection with outbound HTTPS access.
- Facebook Pages connection with permission to publish to the target Page.
- Instagram Business or Creator account linked to that Facebook Page.
- Meta account allowed to publish media posts from Make.
- Make Data Store for published dedupe records.
- Alert destination:
  - either email inbox for operators
  - or Slack/Teams webhook/channel

## Notes on Guardrails

- `publishingDecision = publish` only when the app has a trusted price, a travel window, and flight origin where needed.
- `publishingDecision = manual_review` when the feed detects missing price, missing travel window, multi-stop flights, visa/transit context, suspicious discount ratios, or self-transfer style wording.
- Instagram captions intentionally do not depend on a clickable link in the caption.
- Hashtags are capped at 3 and emitted in the payload as `hashtags`.

## Go-Live Checklist

- Create the Make Data Store used for dedupe.
- Connect the production Facebook Page.
- Connect the production Instagram Business or Creator account linked to that Page.
- Point the scenario at `https://www.flugi.cz/api/social/autopost`.
- Verify one `publish` item creates one Facebook post and one Instagram post.
- Verify rerunning the same item does not publish again because the dedupe key already exists.
- Force one `manual_review` item and confirm the alert branch fires with the review reasons.
- Force one module failure and confirm operator alerting receives the Make error details.
