/**
 * Gender Reveal RSVP — Google Apps Script backend.
 *
 * Lives inside the Google Sheet (Extensions → Apps Script). The website POSTs
 * a JSON body here; each RSVP becomes one row in the "RSVPs" tab.
 *
 * Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone.
 * Paste the resulting /exec URL into CONFIG.SCRIPT_URL in index.html.
 */

const SHEET_NAME = 'RSVPs';
const HEADERS = ['Timestamp', 'Name', 'Email', 'Attending', 'Adults', 'Kids', 'Guess', 'Diet', 'Allergies', 'Note', 'User Agent'];

// Set to true to get an email for every RSVP (sent to the account that deployed the script).
const EMAIL_ON_RSVP = false;

function doGet() {
  return json({ ok: true, service: 'gender-reveal-rsvp', version: 2 });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const d = parseBody(e);
    const sheet = getSheet();
    sheet.appendRow([
      new Date(),
      d.name || '', d.email || '', d.attending || '',
      d.adults || d.guests || '', d.kids || '',
      d.guess || '', d.diet || '', d.allergies || '', d.note || '', d.userAgent || ''
    ]);
    if (EMAIL_ON_RSVP) {
      MailApp.sendEmail(
        Session.getEffectiveUser().getEmail(),
        'New RSVP: ' + (d.name || 'Someone') + ' — ' + (d.attending || '?'),
        JSON.stringify(d, null, 2)
      );
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function parseBody(e) {
  if (e && e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (_) { /* fall through */ }
  }
  return (e && e.parameter) || {};
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(10, 320);
  } else {
    migrateHeaders(sheet);
  }
  return sheet;
}

/** One-time upgrade: the first layout had a single "Guests" column where Adults / Kids now live. */
function migrateHeaders(sheet) {
  const first = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (first[4] === 'Guests') {
    sheet.insertColumnAfter(5);
    sheet.getRange(1, 5, 1, 2).setValues([['Adults', 'Kids']]).setFontWeight('bold');
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to create the tab + headers (or upgrade them) and grant permissions. */
function setup() {
  getSheet();
}
