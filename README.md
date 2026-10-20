# Girl or Boy? — Sailesh & Nithya's Gender Reveal invitation

A free, single-page invitation with live countdown, event programme and RSVP form.
Hosted on GitHub Pages; RSVPs land in a Google Sheet.

**Live site:** https://saileshandroid.github.io/gender-reveal/  
**RSVP sheet:** https://docs.google.com/spreadsheets/d/1xDJTgoDqMloHrFmUhlk7Q2gxFuUiKLlufG7Wf9-fEQY/edit

**Party:** Saturday, November 21, 2026 · 5:00 – 9:30 PM PST · Tesoro Clubhouse, Crescent Village, San Jose

## Files

| File | What it is |
|---|---|
| `index.html` | The whole site (HTML + CSS + JS in one file) |
| `preview-5.jpg` | Thumbnail shown when the link is shared on WhatsApp / iMessage (a capture of the live card; regenerate if the card changes) |
| `img/icon-*.png` | Watercolor programme icons (cropped from the original design) |
| `event.ics` | "Add to Apple / Outlook calendar" file |
| `apps-script/Code.gs` | Backend that writes RSVPs into the Google Sheet (copy of what is deployed) |

## Changing text, times or the venue

Open `index.html` and edit the `CONFIG` block near the bottom (search for `EDIT HERE`):

- `EVENT_START_ISO` / `EVENT_END_ISO` drive the countdown and the Google Calendar link.
- `WHEN_LINE`, `VENUE_NAME`, `ADDRESS` are the words printed on the card; `CAL_LOCATION` is the full address used by the Add to calendar links.
- `MAPS_URL` is what the **View Location** cloud opens.
- `RSVP_DEADLINE` is the "please respond by" date.
- `SCRIPT_URL` is the Apps Script web-app URL (ends in `/exec`).

Programme rows are plain HTML in the `<ol class="timeline">` list.

An unused white/light theme exists for comparison: open the page with `?theme=light`. To make it the default, add `class="light"` to the `<body>` tag.
If you change the date, also update `DTSTART` / `DTEND` in `event.ics` (UTC: PST + 8 hours).

Then commit and push; GitHub Pages redeploys in about a minute:

```bash
gh auth switch --user saileshandroid   # the repo lives under the personal account
git add -A && git commit -m "Update invitation" && git push
gh auth switch --user saileshCBS  # back to the work account
```

## Where RSVPs go

Google Sheet → tab **RSVPs**. Columns: Timestamp, Name, Email, Attending, Adults, Kids, Guess (Team Pink / Team Blue), Diet, Allergies, Note, User Agent.

Handy formulas for a summary tab:

```
Coming:        =COUNTIF(RSVPs!D:D,"Yes")
Adults:        =SUMIF(RSVPs!D:D,"Yes",RSVPs!E:E)
Kids:          =SUMIF(RSVPs!D:D,"Yes",RSVPs!F:F)
Team Pink:     =COUNTIF(RSVPs!G:G,"Team Pink")
Team Blue:     =COUNTIF(RSVPs!G:G,"Team Blue")
Veg (adults):  =SUMIFS(RSVPs!E:E,RSVPs!D:D,"Yes",RSVPs!H:H,"Veg")
```

To get an email per RSVP, set `EMAIL_ON_RSVP = true` in the Apps Script and redeploy.

## Redeploying the Apps Script after an edit

Apps Script editor → **Deploy → Manage deployments → ✎ Edit → Version: New version → Deploy**.
The `/exec` URL stays the same, so `index.html` does not need to change.

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/ (Google Fonts need internet access).
