/**
 * @file FamilyCare configuration & shared constants (v25 LTS)
 * @description Frozen constants for the long-term support release. Bugfix-only changes.
 */
(function (global) {
  const FC = global.FC || (global.FC = {});
  const ls = typeof localStorage !== "undefined" ? localStorage : { getItem: () => null };

  /** @type {string} Build identifier shown in UI and version.json */
  FC.PAGE_VERSION = "2026-07-03-v25-lts";
  FC.LS_KEY = "hospitalBillsLocal";
  FC.FC_METRICS_KEY = "fc_metrics_v1";
  FC.FETCH_TIMEOUT_MS = 15000;
  FC.SYNC_RETRY_DELAY_MS = 2000;
  FC.FILTER_DEBOUNCE_MS = 200;

  FC.CONFIG = {
    apiUrl: ls.getItem("hb_apiUrl") || "",
    githubToken: ls.getItem("hb_github_token") || "",
    githubRepo: "Tevskrishna/hospital-bills",
    githubPath: "data/bills.json",
    syncPin: "0000",
  };

  FC.SONS = [
    { branch: "Shivaji", payer: "Venky", te: "శివాజీ", color: "#0d9488", icon: "🙏" },
    { branch: "Rajini", payer: "Deepa", te: "రజినీ · దీప", color: "#e11d48", icon: "💛" },
    { branch: "Kalyan", payer: "Kalyan", te: "కల్యాణ్", color: "#1d4ed8", icon: "💙" },
  ];

  FC.PAYERS = ["Venky", "Deepa", "Kalyan"];
  FC.SETTLEMENT_EPSILON = 0.01;

  FC.CHAT_CHIPS = [
    "ఎప్పుడు డిశ్చార్జ్?",
    "నాన్నగారి స్థితి ఏమిటి?",
    "How much spent so far?",
    "Who paid how much?",
  ];

  FC.DEFAULT_META = {
    patient: "Sri Venkateswara Rao",
    hospital: "Mallareddy Hospital",
    startDate: "2026-06-28",
  };

  FC.DEFAULT_CARE_STATUS = {
    ward: "General Ward",
    condition: "Stable, under observation",
    conditionTe: "స్థిరంగా ఉన్నారు, పర్యవేక్షణలో",
    expectedDischarge: "2026-07-03",
    dischargeNote: "Doctor will confirm after reports",
    dischargeNoteTe: "రిపోర్ట్స్ వచ్చాక డాక్టర్ నిర్ణయిస్తారు",
    lastUpdate: "2026-06-30",
    lastUpdateBy: "Venky",
  };

  FC.state = {
    meta: { ...FC.DEFAULT_META },
    data: { bills: [], advances: [] },
    careStatus: { ...FC.DEFAULT_CARE_STATUS },
    billFilterWho: "all",
    billSearchQuery: "",
    chatOpen: false,
    tesseractReady: null,
    deferredInstall: null,
    filterDebounce: null,
    revealObserver: null,
  };

  global.PAGE_VERSION = FC.PAGE_VERSION;
  global.CONFIG = FC.CONFIG;
  global.SONS = FC.SONS;
  global.meta = FC.state.meta;
  global.data = FC.state.data;
  global.careStatus = FC.state.careStatus;
  global.billFilterWho = FC.state.billFilterWho;
  global.billSearchQuery = FC.state.billSearchQuery;
  global.chatOpen = FC.state.chatOpen;
  global.tesseractReady = FC.state.tesseractReady;
})(typeof window !== "undefined" ? window : global);
