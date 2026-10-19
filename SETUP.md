# One-time setup (≈10 minutes total)

## Part 1 — Google Sheet that collects RSVPs — ✅ DONE (Oct 18, 2026)

Sheet: https://docs.google.com/spreadsheets/d/1xDJTgoDqMloHrFmUhlk7Q2gxFuUiKLlufG7Wf9-fEQY/edit (tab **RSVPs**)
Apps Script project: "Gender Reveal RSVP" (bound to that sheet, Extensions → Apps Script)
Web app URL (already in `CONFIG.SCRIPT_URL`): https://script.google.com/macros/s/AKfycbzQsAqP-P5uJjHyqsbEqpyjXqYKXEsCN4VcVMIdkAeI03ElfRmPmYZBqYN2FdpY4u_e/exec
Scope granted: spreadsheets.currentonly (this one sheet only). If you ever turn on `EMAIL_ON_RSVP`, add
`"https://www.googleapis.com/auth/script.send_mail"` to `oauthScopes` in appsscript.json and redeploy.

The original steps are kept below in case you ever need to redo it from scratch.

### Original steps

1. Go to https://sheets.new while signed in to your **personal** Google account.
2. Click the title "Untitled spreadsheet" (top-left) and rename it **Gender Reveal RSVPs**.
3. Menu **Extensions → Apps Script**. A new tab opens with an editor containing `function myFunction() {}`.
4. Select everything in the editor (⌘A), delete it, and paste the whole contents of
   `apps-script/Code.gs` from this folder. Press ⌘S to save.
5. In the editor toolbar choose the function **setup** in the dropdown next to "Debug", then click **Run**.
   - Google shows "Authorization required" → **Review permissions** → pick your personal account →
     "Google hasn't verified this app" → **Advanced → Go to Untitled project (unsafe)** → **Allow**.
   - This only lets *your own script* write to *your own sheet*. Afterwards the sheet gains an
     **RSVPs** tab with bold headers.
6. Click the blue **Deploy → New deployment**. Click the gear icon next to "Select type" → **Web app**.
   - Description: `rsvp`
   - Execute as: **Me**
   - Who has access: **Anyone**   ← required, otherwise the website cannot post
   - Click **Deploy**.
7. Copy the **Web app URL** (it ends in `/exec`) and send it to Claude. That is all Claude needs.

To test it yourself: open the URL in a browser tab; it should show `{"ok":true,"service":"gender-reveal-rsvp"}`.

## Part 2 — GitHub Pages — ✅ DONE (Oct 18, 2026)

Repo: https://github.com/saileshandroid/gender-reveal (public) · Live: https://saileshandroid.github.io/gender-reveal/

### Original steps

Option A (Claude pushes for you): in your Terminal run

```bash
gh auth login --hostname github.com --web
```

choose your personal account in the browser window that opens, then tell Claude "GitHub is logged in".

Option B (you push): create a new **public** repo named `gender-reveal`, upload `index.html`,
`preview.jpg`, `event.ics`, `README.md`, then **Settings → Pages → Branch: main / (root) → Save**.
The site appears at `https://<your-username>.github.io/gender-reveal/` within a minute.
