/**
 * MALLAREDDY HOSPITAL BILLS — Google Setup (run once)
 * Paste into Extensions → Apps Script → Run setupEverything
 */

function setupEverything() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename('Mallareddy Hospital — Venkateswara Rao 2026');

  setupBillsSheet_(ss);
  setupAdvancesSheet_(ss);
  setupSummarySheet_(ss);
  setupHistorySheet_(ss);

  const form = createFamilyForm_(ss);
  const readme = getOrCreateSheet_(ss, 'README');
  readme.clear();
  const webAppHint = 'Deploy → New deployment → Web app → Me → Anyone';
  readme.getRange('A1').setValue('LINKS — copy to hospital-bills.html CONFIG on GitHub');
  readme.getRange('A3').setValue('1. Form link (WhatsApp to family):');
  readme.getRange('B3').setValue(form.getPublishedUrl());
  readme.getRange('A4').setValue('2. Form embed (CONFIG.formEmbedUrl):');
  readme.getRange('B4').setValue(form.getPublishedUrl() + '?embedded=true');
  readme.getRange('A6').setValue('3. Web App JSON (CONFIG.apiUrl):');
  readme.getRange('B6').setValue(webAppHint);
  readme.getRange('A7').setValue('4. Download CSV (full history):');
  readme.getRange('B7').setValue('YOUR_WEB_APP_URL?format=csv');
  readme.getRange('A9').setValue('Patient start date:');
  readme.getRange('B9').setValue('2026-06-28');

  importSeedData_(ss);
  rebuildHistorySheet_(ss);

  SpreadsheetApp.getUi().alert(
    'Done!\n\n1. Deploy Web App (Anyone)\n2. Copy 3 links from README tab\n3. Paste into index.html CONFIG on GitHub'
  );
}

function getOrCreateSheet_(ss, name) {
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

function setupBillsSheet_(ss) {
  var sh = getOrCreateSheet_(ss, 'Bills');
  sh.clear();
  sh.getRange(1, 1, 1, 6).setValues([['Date', 'Paid By', 'Amount', 'Payment Mode', 'Notes', 'Source']]);
  sh.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#1b4965').setFontColor('#ffffff');
  sh.setFrozenRows(1);
}

function setupAdvancesSheet_(ss) {
  var sh = getOrCreateSheet_(ss, 'Advances');
  sh.clear();
  sh.getRange(1, 1, 1, 4).setValues([['Date', 'From', 'To', 'Amount']]);
  sh.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#1b4965').setFontColor('#ffffff');
  sh.setFrozenRows(1);
}

function setupSummarySheet_(ss) {
  var sh = getOrCreateSheet_(ss, 'Summary');
  sh.clear();
  sh.getRange('A1').setValue('DAILY REPORT / రోజువారీ నివేదిక').setFontSize(14).setFontWeight('bold');
  sh.getRange('A3').setValue('Total Spend / మొత్తం');
  sh.getRange('B3').setFormula('=SUM(Bills!C:C)');
  sh.getRange('A4').setValue('Venky / వెంకీ');
  sh.getRange('B4').setFormula('=SUMIF(Bills!B:B,"Venky",Bills!C:C)');
  sh.getRange('A5').setValue('Deepa / దీప');
  sh.getRange('B5').setFormula('=SUMIF(Bills!B:B,"Deepa",Bills!C:C)');
  sh.getRange('A6').setValue('Kalyan / కల్యాణ్');
  sh.getRange('B6').setFormula('=SUMIF(Bills!B:B,"Kalyan",Bills!C:C)');
  sh.getRange('A7').setValue('Shivaji → Venky');
  sh.getRange('B7').setFormula('=SUM(Advances!D:D)');
  sh.getRange('A8').setValue('Venky balance');
  sh.getRange('B8').setFormula('=B7-B4');
  sh.getRange('B3:B8').setNumberFormat('₹#,##0.00');
}

function setupHistorySheet_(ss) {
  var sh = getOrCreateSheet_(ss, 'FullHistory');
  sh.clear();
  sh.getRange('A1').setValue('Complete history — auto-updated. File → Download this tab as CSV');
  sh.getRange('A1').setFontWeight('bold');
}

function rebuildHistorySheet_(ss) {
  var sh = ss.getSheetByName('FullHistory');
  var bills = ss.getSheetByName('Bills');
  var adv = ss.getSheetByName('Advances');
  if (!sh || !bills) return;

  sh.clear();
  sh.getRange(1, 1, 1, 5).setValues([['Date', 'Type', 'Paid By', 'Amount', 'Payment Mode / Notes']]);
  sh.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#1b4965').setFontColor('#ffffff');

  var rows = [];
  if (bills.getLastRow() > 1) {
    var billData = bills.getRange(2, 1, bills.getLastRow(), 6).getValues();
    billData.forEach(function (r) {
      if (!r[2]) return;
      rows.push([formatDate_(r[0]), 'Hospital bill', r[1], r[2], (r[3] || '') + (r[4] ? ' — ' + r[4] : '')]);
    });
  }
  if (adv && adv.getLastRow() > 1) {
    var advData = adv.getRange(2, 1, adv.getLastRow(), 4).getValues();
    advData.forEach(function (r) {
      if (!r[3]) return;
      rows.push([formatDate_(r[0]), 'Shivaji → Venky', r[1], r[3], 'Advance for bills']);
    });
  }
  rows.sort(function (a, b) { return String(a[0]).localeCompare(String(b[0])); });

  if (rows.length) {
    sh.getRange(2, 1, 1 + rows.length, 5).setValues(rows);
  }
  var totalRow = 2 + rows.length + 1;
  sh.getRange(totalRow, 1).setValue('TOTAL HOSPITAL SPEND');
  sh.getRange(totalRow, 4).setFormula('=SUMIF(B2:B' + (1 + rows.length) + ',"Hospital bill",D2:D' + (1 + rows.length) + ')');
  sh.getRange(totalRow, 4).setNumberFormat('₹#,##0.00');
  sh.setFrozenRows(1);
}

function createFamilyForm_(ss) {
  var form = FormApp.create('మల్లారెడ్డి హాస్పిటల్ బిల్ / Hospital Bill');
  form.setDescription(
    'ఒక్క చెల్లింపు = ఒక్క సారి submit\n' +
    'One payment = submit once\n' +
    'Patient: Venkateswara Rao'
  );
  form.setCollectEmail(false);
  form.setConfirmationMessage('ధన్యవాదాలు! Venky verify చేస్తాడు. Thank you!');

  form.addDateItem().setTitle('తేదీ / Date').setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('ఎవరు చెల్లించారు? / Who paid?')
    .setChoiceValues(['Venky', 'Deepa', 'Kalyan'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('మొత్తం ₹ / Amount')
    .setHelpText('numbers only e.g. 500')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('ఎలా చెల్లించారు? / How paid?')
    .setChoiceValues(['Cash', 'UPI', 'Credit Card', 'Other'])
    .setRequired(true);

  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (t) {
    if (t.getHandlerFunction() === 'onFormSubmit') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('onFormSubmit').forSpreadsheet(ss).onFormSubmit().create();

  return form;
}

function onFormSubmit(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var bills = ss.getSheetByName('Bills');
  if (!bills || !e || !e.namedValues) return;

  var nv = e.namedValues;
  var dateKey = findKey_(nv, 'తేదీ');
  var whoKey = findKey_(nv, 'ఎవరు');
  var amtKey = findKey_(nv, 'మొత్తం');
  var modeKey = findKey_(nv, 'ఎలా');

  var dateVal = parseFormDate_(dateKey ? nv[dateKey][0] : '');
  var whoRaw = whoKey ? nv[whoKey][0] : 'Venky';
  var who = whoRaw.indexOf('Deepa') >= 0 ? 'Deepa' : whoRaw.indexOf('Kalyan') >= 0 ? 'Kalyan' : 'Venky';
  var amt = parseFloat(String(amtKey ? nv[amtKey][0] : '0').replace(/[^\d.]/g, '')) || 0;
  var mode = modeKey ? nv[modeKey][0] : '';

  if (amt > 0) {
    bills.appendRow([dateVal, who, amt, mode, '', 'Form']);
    rebuildHistorySheet_(ss);
  }
}

function findKey_(nv, part) {
  var keys = Object.keys(nv);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].indexOf(part) >= 0) return keys[i];
  }
  return null;
}

function parseFormDate_(s) {
  if (!s) return new Date();
  try { return new Date(s); } catch (err) { return new Date(); }
}

function importSeedData_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var bills = ss.getSheetByName('Bills');
  var adv = ss.getSheetByName('Advances');
  if (bills.getLastRow() > 1) return;

  var billRows = [
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
    ['2026-06-28', 'Deepa', 1100, '', '', 'Seed'],
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
  bills.getRange(2, 1, 1 + billRows.length, 6).setValues(billRows);

  var advRows = [
    ['2026-06-28', 'Shivaji', 'Venky', 3009],
    ['2026-06-29', 'Shivaji', 'Venky', 2000],
    ['2026-06-30', 'Shivaji', 'Venky', 1000],
    ['2026-06-30', 'Shivaji', 'Venky', 1000],
    ['2026-06-30', 'Shivaji', 'Venky', 500],
  ];
  adv.getRange(2, 1, 1 + advRows.length, 4).setValues(advRows);
}

function doGet(e) {
  e = e || {};
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (e.parameter && e.parameter.format === 'csv') {
    return exportCsv_(ss);
  }
  return exportJson_(ss);
}

function exportJson_(ss) {
  var billsSh = ss.getSheetByName('Bills');
  var advSh = ss.getSheetByName('Advances');
  var bills = [];
  var advances = [];

  if (billsSh && billsSh.getLastRow() > 1) {
    billsSh.getRange(2, 1, billsSh.getLastRow(), 6).getValues().forEach(function (r) {
      if (!r[2]) return;
      bills.push({
        d: formatDate_(r[0]), who: String(r[1]), amt: Number(r[2]),
        mode: String(r[3] || ''), note: String(r[4] || ''),
      });
    });
  }
  if (advSh && advSh.getLastRow() > 1) {
    advSh.getRange(2, 1, advSh.getLastRow(), 4).getValues().forEach(function (r) {
      if (!r[3]) return;
      advances.push({ d: formatDate_(r[0]), amt: Number(r[3]) });
    });
  }

  return ContentService.createTextOutput(JSON.stringify({
    updated: new Date().toISOString(),
    patient: 'Sri Venkateswara Rao',
    hospital: 'Mallareddy Hospital',
    startDate: '2026-06-28',
    bills: bills,
    advances: advances,
    careStatus: getCareStatus_(),
  })).setMimeType(ContentService.MimeType.JSON);
}

function exportCsv_(ss) {
  rebuildHistorySheet_(ss);
  var sh = ss.getSheetByName('FullHistory');
  var lines = [];
  lines.push('Mallareddy Hospital — Venkateswara Rao — Full history from 2026-06-28');
  lines.push('Generated,' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm'));
  lines.push('');
  lines.push('Date,Type,Paid By,Amount,Payment Mode / Notes');

  if (sh && sh.getLastRow() > 1) {
    var data = sh.getRange(2, 1, sh.getLastRow(), 5).getValues();
    data.forEach(function (r) {
      if (!r[0]) return;
      lines.push([r[0], r[1], r[2], r[3], csvCell_(r[4])].join(','));
    });
  }

  return ContentService.createTextOutput(lines.join('\n'))
    .setMimeType(ContentService.MimeType.CSV);
}

function csvCell_(v) {
  var s = String(v == null ? '' : v);
  if (s.indexOf(',') >= 0 || s.indexOf('"') >= 0) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function formatDate_(v) {
  if (!v) return '';
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(v).slice(0, 10);
}

/** PIN for mobile add-bill from the website. Change SYNC_PIN below. */
var SYNC_PIN = '7582';

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.pin !== SYNC_PIN) {
      return jsonOut_({ ok: false, error: 'Wrong PIN' });
    }
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = body.action;

    if (action === 'addBill') {
      var b = body.bill;
      if (!b || !b.d || !b.who || !b.amt) {
        return jsonOut_({ ok: false, error: 'Missing bill fields' });
      }
      var bills = ss.getSheetByName('Bills');
      bills.appendRow([b.d, b.who, Number(b.amt), b.mode || '', b.note || '', 'Mobile']);
      rebuildHistorySheet_(ss);
      return jsonOut_({ ok: true });
    }

    if (action === 'addAdvance') {
      var a = body.advance;
      if (!a || !a.d || !a.amt) {
        return jsonOut_({ ok: false, error: 'Missing advance fields' });
      }
      var adv = ss.getSheetByName('Advances');
      adv.appendRow([a.d, 'Shivaji', 'Venky', Number(a.amt)]);
      rebuildHistorySheet_(ss);
      return jsonOut_({ ok: true });
    }

    if (action === 'updateCareStatus') {
      if (!body.careStatus) {
        return jsonOut_({ ok: false, error: 'Missing careStatus' });
      }
      PropertiesService.getScriptProperties().setProperty('careStatus', JSON.stringify(body.careStatus));
      return jsonOut_({ ok: true });
    }

    if (action === 'importAll') {
      importAllFromJson_(ss, body);
      return jsonOut_({ ok: true });
    }

    return jsonOut_({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getCareStatus_() {
  try {
    var raw = PropertiesService.getScriptProperties().getProperty('careStatus');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    ward: 'General Ward',
    condition: 'Stable, under observation',
    conditionTe: 'స్థిరంగా ఉన్నారు, పర్యవేక్షణలో',
    expectedDischarge: '2026-07-03',
    dischargeNote: 'Doctor will confirm after reports',
    dischargeNoteTe: 'రిపోర్ట్స్ వచ్చాక డాక్టర్ నిర్ణయిస్తారు',
    lastUpdate: '2026-07-02',
    lastUpdateBy: 'Venky'
  };
}

function importAllFromJson_(ss, body) {
  var billsSh = ss.getSheetByName('Bills');
  var advSh = ss.getSheetByName('Advances');
  billsSh.getRange(2, 1, billsSh.getMaxRows(), 6).clearContent();
  advSh.getRange(2, 1, advSh.getMaxRows(), 4).clearContent();

  var billRows = (body.bills || []).map(function (b) {
    return [b.d, b.who, b.amt, b.mode || '', b.note || '', 'Import'];
  });
  if (billRows.length) {
    billsSh.getRange(2, 1, 1 + billRows.length, 6).setValues(billRows);
  }

  var advRows = (body.advances || []).map(function (a) {
    return [a.d, 'Shivaji', 'Venky', a.amt];
  });
  if (advRows.length) {
    advSh.getRange(2, 1, 1 + advRows.length, 4).setValues(advRows);
  }

  if (body.careStatus) {
    PropertiesService.getScriptProperties().setProperty('careStatus', JSON.stringify(body.careStatus));
  }
  rebuildHistorySheet_(ss);
}
