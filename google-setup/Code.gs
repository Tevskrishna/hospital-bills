/**
 * MALLAREDDY HOSPITAL BILLS — Google Setup (run once)
 *
 * HOW TO USE:
 * 1. Go to https://sheets.google.com → New blank spreadsheet
 * 2. Extensions → Apps Script → delete default code → paste ALL of this file
 * 3. Run function: setupEverything (authorize when asked)
 * 4. Check your email / spreadsheet — Form link + Web App URL are in sheet "README"
 * 5. Copy Web App URL + Form embed URL into hospital-bills.html CONFIG
 * 6. Host HTML (see SETUP-COMBINED.md) and share link on WhatsApp
 */

function setupEverything() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename('Mallareddy Hospital — Venkateswara Rao 2026');

  setupBillsSheet_(ss);
  setupAdvancesSheet_(ss);
  setupFormResponsesSheet_(ss);
  setupSummarySheet_(ss);

  const form = createFamilyForm_(ss);
  const readme = getOrCreateSheet_(ss, 'README');
  readme.clear();
  readme.getRange('A1').setValue('SETUP COMPLETE — copy these links');
  readme.getRange('A3').setValue('Google Form (share with Deepa, Kalyan, family):');
  readme.getRange('B3').setValue(form.getPublishedUrl());
  readme.getRange('A4').setValue('Form edit link (Venky only):');
  readme.getRange('B4').setValue(form.getEditUrl());
  readme.getRange('A6').setValue('Web App URL (paste in hospital-bills.html CONFIG.apiUrl):');
  readme.getRange('B6').setValue('Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone → copy URL');
  readme.getRange('A8').setValue('Form embed URL (paste in CONFIG.formEmbedUrl):');
  readme.getRange('B8').setValue(form.getPublishedUrl() + '?embedded=true');

  importSeedData_(ss);
  updateSummary_(ss);

  SpreadsheetApp.getUi().alert(
    'Setup done!\n\n1. Deploy Web App (see README sheet)\n2. Copy links into hospital-bills.html\n3. Host HTML and share on WhatsApp'
  );
}

function getOrCreateSheet_(ss, name) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

function setupBillsSheet_(ss) {
  const sh = getOrCreateSheet_(ss, 'Bills');
  sh.clear();
  sh.getRange(1, 1, 1, 6).setValues([['Date', 'Paid By', 'Amount', 'Payment Mode', 'Notes', 'Source']]);
  sh.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#1b4965').setFontColor('#ffffff');
  sh.setFrozenRows(1);
}

function setupAdvancesSheet_(ss) {
  const sh = getOrCreateSheet_(ss, 'Advances');
  sh.clear();
  sh.getRange(1, 1, 1, 4).setValues([['Date', 'From', 'To', 'Amount']]);
  sh.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#1b4965').setFontColor('#ffffff');
  sh.setFrozenRows(1);
}

function setupFormResponsesSheet_(ss) {
  const sh = getOrCreateSheet_(ss, 'FormResponses');
  sh.clear();
  sh.getRange(1, 1, 1, 1).setValue('Form submissions appear on separate tab created by Google Form');
}

function setupSummarySheet_(ss) {
  const sh = getOrCreateSheet_(ss, 'Summary');
  sh.clear();
  sh.getRange('A1').setValue('DAILY REPORT / రోజువారీ నివేదిక').setFontSize(14).setFontWeight('bold');
  sh.getRange('A3').setValue('Total Spend / మొత్తం ఖర్చు');
  sh.getRange('B3').setFormula('=SUM(Bills!C:C)');
  sh.getRange('A4').setValue('Venky paid / వెంకీ');
  sh.getRange('B4').setFormula('=SUMIF(Bills!B:B,"Venky",Bills!C:C)');
  sh.getRange('A5').setValue('Deepa paid / దీప');
  sh.getRange('B5').setFormula('=SUMIF(Bills!B:B,"Deepa",Bills!C:C)');
  sh.getRange('A6').setValue('Kalyan paid / కల్యాణ్');
  sh.getRange('B6').setFormula('=SUMIF(Bills!B:B,"Kalyan",Bills!C:C)');
  sh.getRange('A7').setValue('Shivaji → Venky');
  sh.getRange('B7').setFormula('=SUM(Advances!D:D)');
  sh.getRange('A8').setValue('Venky balance');
  sh.getRange('B8').setFormula('=B7-B4');
  sh.getRange('B3:B8').setNumberFormat('₹#,##0.00');
  sh.getRange('A3:A8').setFontWeight('bold');
}

function createFamilyForm_(ss) {
  const form = FormApp.create('ఆసుపత్రి బిల్ — Hospital Payment (Venkateswara Rao)');
  form.setDescription(
    'మల్లారెడ్డి ఆసుపత్రి ఖర్చులు చేర్చండి\n' +
    'Add a payment for Mallareddy Hospital\n\n' +
    'దయచేసి ఒక్కొక్క చెల్లింపును వేరుగా submit చేయండి / Submit each payment separately'
  );
  form.setCollectEmail(false);
  form.setConfirmationMessage('ధన్యవాదాలు! Thank you! Venky will verify. / వెంకీ చూస్తాడు.');

  form.addDateItem()
    .setTitle('తేదీ / Date of payment')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('ఎవరు చెల్లించారు? / Who paid?')
    .setChoiceValues(['Venky / వెంకీ', 'Deepa / దీప (Rajini wife)', 'Kalyan / కల్యాణ్'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('మొత్తం (రూపాయలు) / Amount in ₹')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('ఎలా చెల్లించారు? / Payment type')
    .setChoiceValues(['Cash / నగదు', 'UPI / GPay / PhonePe', 'Credit Card', 'Debit Card', 'Other / ఇతర'])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('గమనిక / Note (optional)')
    .setHelpText('e.g. pharmacy, room, lab');

  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // Trigger to copy form rows into Bills sheet
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();

  return form;
}

function onFormSubmit(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const bills = ss.getSheetByName('Bills');
  if (!bills || !e || !e.namedValues) return;

  const nv = e.namedValues;
  const dateVal = parseFormDate_(nv['తేదీ / Date of payment'] ? nv['తేదీ / Date of payment'][0] : '');
  const whoRaw = (nv['ఎవరు చెల్లించారు? / Who paid?'] || [''])[0];
  const who = whoRaw.includes('Deepa') ? 'Deepa' : whoRaw.includes('Kalyan') ? 'Kalyan' : 'Venky';
  const amt = parseFloat(String((nv['మొత్తం (రూపాయలు) / Amount in ₹'] || ['0'])[0]).replace(/[^\d.]/g, '')) || 0;
  const modeRaw = (nv['ఎలా చెల్లించారు? / Payment type'] || [''])[0];
  const mode = modeRaw.split('/')[0].trim();
  const note = (nv['గమనిక / Note (optional)'] || [''])[0];

  if (amt > 0) {
    bills.appendRow([dateVal, who, amt, mode, note, 'Google Form']);
    updateSummary_(ss);
  }
}

function parseFormDate_(s) {
  if (!s) return new Date();
  try {
    return new Date(s);
  } catch (e) {
    return new Date();
  }
}

function importSeedData_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const bills = ss.getSheetByName('Bills');
  const adv = ss.getSheetByName('Advances');
  if (bills.getLastRow() > 1) return;

  const billRows = [
    ['2026-06-28', 'Venky', 50, '', '', 'Seed'],
    ['2026-06-28', 'Venky', 733, '', '', 'Seed'],
    ['2026-06-28', 'Venky', 300, '', '', 'Seed'],
    ['2026-06-29', 'Venky', 500, '', '', 'Seed'],
    ['2026-06-29', 'Venky', 68.16, '', '', 'Seed'],
    ['2026-06-29', 'Venky', 250, '', '', 'Seed'],
    ['2026-06-29', 'Venky', 888, '', '', 'Seed'],
    ['2026-06-29', 'Venky', 1300, '', '', 'Seed'],
    ['2026-06-30', 'Venky', 95, '', '', 'Seed'],
    ['2026-06-30', 'Venky', 888, '', '', 'Seed'],
    ['2026-06-30', 'Venky', 908.28, '', '', 'Seed'],
    ['2026-06-28', 'Deepa', 1100, '', 'Rajini wife', 'Seed'],
    ['2026-06-28', 'Deepa', 110.66, '', '', 'Seed'],
    ['2026-06-28', 'Deepa', 550, '', '', 'Seed'],
    ['2026-06-28', 'Deepa', 22.86, '', '', 'Seed'],
    ['2026-06-28', 'Deepa', 500, '', '', 'Seed'],
    ['2026-06-28', 'Deepa', 58, '', '', 'Seed'],
    ['2026-06-28', 'Deepa', 800, '', '', 'Seed'],
    ['2026-06-28', 'Deepa', 1500, '', '', 'Seed'],
    ['2026-06-28', 'Deepa', 800, '', '', 'Seed'],
    ['2026-06-29', 'Deepa', 1051.85, '', '', 'Seed'],
    ['2026-06-29', 'Deepa', 990, '', '', 'Seed'],
    ['2026-06-29', 'Deepa', 500, '', '', 'Seed'],
    ['2026-06-29', 'Deepa', 2500, '', '', 'Seed'],
    ['2026-06-29', 'Deepa', 60, '', '', 'Seed'],
    ['2026-06-30', 'Deepa', 800, '', '', 'Seed'],
    ['2026-06-30', 'Deepa', 90.66, '', '', 'Seed'],
    ['2026-06-30', 'Deepa', 1334.54, '', '', 'Seed'],
    ['2026-06-30', 'Deepa', 1850, 'Cash', 'Paid in cash', 'Seed'],
    ['2026-06-30', 'Kalyan', 3600, 'Credit Card', 'Credit card', 'Seed'],
  ];
  bills.getRange(2, 1, billRows.length, 6).setValues(billRows);

  const advRows = [
    ['2026-06-28', 'Shivaji', 'Venky', 3009],
    ['2026-06-29', 'Shivaji', 'Venky', 2000],
    ['2026-06-30', 'Shivaji', 'Venky', 1000],
    ['2026-06-30', 'Shivaji', 'Venky', 1000],
    ['2026-06-30', 'Shivaji', 'Venky', 500],
  ];
  adv.getRange(2, 1, advRows.length, 4).setValues(advRows);
}

function updateSummary_(ss) {
  const sh = ss.getSheetByName('Summary');
  if (sh) sh.getRange('B3:B8').setFormula(sh.getRange('B3').getFormula() || '=SUM(Bills!C:C)');
}

/** Web App — hospital-bills.html fetches this JSON */
function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const billsSh = ss.getSheetByName('Bills');
  const advSh = ss.getSheetByName('Advances');

  const bills = [];
  if (billsSh && billsSh.getLastRow() > 1) {
    const rows = billsSh.getRange(2, 1, billsSh.getLastRow() - 1, 6).getValues();
    rows.forEach(function (r) {
      if (!r[2]) return;
      bills.push({
        d: formatDate_(r[0]),
        who: String(r[1]),
        amt: Number(r[2]),
        mode: String(r[3] || ''),
        note: String(r[4] || ''),
      });
    });
  }

  const advances = [];
  if (advSh && advSh.getLastRow() > 1) {
    const rows = advSh.getRange(2, 1, advSh.getLastRow() - 1, 4).getValues();
    rows.forEach(function (r) {
      if (!r[3]) return;
      advances.push({ d: formatDate_(r[0]), amt: Number(r[3]) });
    });
  }

  const payload = {
    updated: new Date().toISOString(),
    patient: 'Sri Venkateswara Rao',
    hospital: 'Mallareddy Hospital',
    bills: bills,
    advances: advances,
  };

  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function formatDate_(v) {
  if (!v) return '';
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(v).slice(0, 10);
}

/** Manual: run after editing sheet directly */
function refreshFromSheet() {
  updateSummary_(SpreadsheetApp.getActiveSpreadsheet());
}
