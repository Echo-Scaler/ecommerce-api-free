import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'my';

export interface Translations {
  // Header
  brandTitle: string;
  brandHighlight: string;
  brandSubtitle: string;
  liveSandbox: string;
  tokenActive: string;
  authorize: string;
  github: string;

  // Overview Page
  platformTag: string;
  platformTitle: string;
  platformDesc: string;
  exploreProductsBtn: string;
  apiModulesHeading: string;
  endpointsCount: string;
  highlight1Title: string;
  highlight1Desc: string;
  highlight2Title: string;
  highlight2Desc: string;
  highlight3Title: string;
  highlight3Desc: string;
  highlight4Title: string;
  highlight4Desc: string;

  // Sidebar
  overviewNav: string;
  searchPlaceholder: string;
  noEndpointsFound: string;
  matchingEndpoints: string;

  // Documentation View
  documentationTab: string;
  testerTab: string;
  codeSnippetsTab: string;
  authRequired: string;
  publicAccess: string;
  adminOnly: string;
  parametersHeading: string;
  requestBodyHeading: string;
  responseExamplesHeading: string;
  requiredBadge: string;
  optionalBadge: string;

  // Tester Form
  sendRequestBtn: string;
  sendingRequestBtn: string;
  headersTab: string;
  queryParamsTab: string;
  bodyTab: string;
  resetBtn: string;
  responseHeading: string;
  latencyLabel: string;
  statusLabel: string;
  copyJsonBtn: string;
  copiedBtn: string;
  downloadJsonBtn: string;

  // Auth Modal
  authModalTitle: string;
  authModalDesc: string;
  bearerTokenLabel: string;
  presetTokensTitle: string;
  adminPreset: string;
  customerPreset: string;
  guestPreset: string;
  clearTokenBtn: string;
  saveCloseBtn: string;
}

const translations: Record<Language, Translations> = {
  en: {
    brandTitle: 'E-Commerce',
    brandHighlight: 'API Docs',
    brandSubtitle: 'Interactive Developer Platform',
    liveSandbox: 'Live Sandbox',
    tokenActive: 'Token Active',
    authorize: 'Authorize',
    github: 'GitHub',

    platformTag: 'RESTful Developer Platform',
    platformTitle: 'E-Commerce API Documentation & Interactive Testing',
    platformDesc: 'Select an endpoint from the left navigation to explore comprehensive documentation, schema parameters, JSON payloads, and response structures.',
    exploreProductsBtn: 'Explore Products API',
    apiModulesHeading: 'API Modules',
    endpointsCount: 'Endpoints',
    highlight1Title: '35 REST Endpoints',
    highlight1Desc: 'Complete coverage across all e-commerce domains and catalog flows.',
    highlight2Title: 'Bearer Auth & Roles',
    highlight2Desc: 'Admin and customer permission guard indicators with preset tokens.',
    highlight3Title: 'Interactive Tester',
    highlight3Desc: 'In-browser request execution, live latency timer, and status validation.',
    highlight4Title: '50-Item Mock Datasets',
    highlight4Desc: '50 structured records per resource for realistic API simulations.',

    overviewNav: 'Platform Overview',
    searchPlaceholder: 'Search endpoints, paths, verbs (⌘K)...',
    noEndpointsFound: 'No matching endpoints found',
    matchingEndpoints: 'Matching Endpoints',

    documentationTab: 'Documentation',
    testerTab: 'Interactive Tester',
    codeSnippetsTab: 'Code Snippets',
    authRequired: 'Bearer Auth Required',
    publicAccess: 'Public Access',
    adminOnly: 'Admin Role Required',
    parametersHeading: 'Request Parameters',
    requestBodyHeading: 'Request Body Schema',
    responseExamplesHeading: 'Response Examples',
    requiredBadge: 'Required',
    optionalBadge: 'Optional',

    sendRequestBtn: 'Send Request',
    sendingRequestBtn: 'Executing Request...',
    headersTab: 'Headers',
    queryParamsTab: 'Query Params',
    bodyTab: 'Body (JSON)',
    resetBtn: 'Reset',
    responseHeading: 'Response Payload',
    latencyLabel: 'Duration',
    statusLabel: 'Status',
    copyJsonBtn: 'Copy JSON',
    copiedBtn: 'Copied!',
    downloadJsonBtn: 'Download',

    authModalTitle: 'API Authentication Manager',
    authModalDesc: 'Configure your Bearer authentication token for testing protected endpoints.',
    bearerTokenLabel: 'Bearer Token (JWT)',
    presetTokensTitle: 'Quick Preset Roles',
    adminPreset: 'Admin Role (Full Access)',
    customerPreset: 'Customer Role (Shopping & Cart)',
    guestPreset: 'Guest (Public Endpoints Only)',
    clearTokenBtn: 'Clear Token',
    saveCloseBtn: 'Save & Apply Token'
  },
  my: {
    brandTitle: 'အီးကောမတ်စ်',
    brandHighlight: 'API စာရွက်စာတမ်းများ',
    brandSubtitle: 'ဆော့ဖ်ဝဲရေးသားသူများအတွက် အပြန်အလှန်သုံး ပလက်ဖောင်း',
    liveSandbox: 'တိုက်ရိုက် စမ်းသပ်ခန်း',
    tokenActive: 'တိုကင် အသက်ဝင်နေသည်',
    authorize: 'ခွင့်ပြုချက် ရယူရန်',
    github: 'ဂစ်ဟပ်ဘ် (GitHub)',

    platformTag: 'RESTful API ပလက်ဖောင်း',
    platformTitle: 'အီးကောမတ်စ် API စာရွက်စာတမ်းများနှင့် တိုက်ရိုက် စမ်းသပ်မှုစနစ်',
    platformDesc: 'ဘယ်ဘက်ရှိ မီနူးမှ API endpoint များကို ရွေးချယ်၍ အသေးစိတ် အချက်အလက်များ၊ ပါရာမီတာများနှင့် JSON တုံ့ပြန်မှုများကို စမ်းသပ်ကြည့်ရှုနိုင်ပါသည်။',
    exploreProductsBtn: 'ကုန်ပစ္စည်း API ကို ကြည့်ရှုရန်',
    apiModulesHeading: 'API ကဏ္ဍများ',
    endpointsCount: 'Endpoints အရေအတွက်',
    highlight1Title: 'REST Endpoints ၃၅ ခု',
    highlight1Desc: 'အီးကောမတ်စ် လုပ်ငန်းစဉ်တစ်ခုလုံးအတွက် လိုအပ်သော အပြည့်စုံဆုံး API များ။',
    highlight2Title: 'Bearer အတည်ပြုချက်နှင့် အခန်းကဏ္ဍများ',
    highlight2Desc: 'Admin နှင့် Customer လုံခြုံရေး အဆင့်အတန်းများကို ကြိုတင်သတ်မှတ် တိုကင်များဖြင့် စမ်းသပ်နိုင်ခြင်း။',
    highlight3Title: 'တိုက်ရိုက် စမ်းသပ်မှု စနစ်',
    highlight3Desc: 'ဘရောက်ဆာထဲတွင် တိုက်ရိုက် Request ပို့ခြင်း၊ ကြာချိန်နှင့် Status စစ်ဆေးနိုင်ခြင်း။',
    highlight4Title: 'နမူနာ ဒေတာ ၅၀ စီ ပါဝင်မှု',
    highlight4Desc: 'ကဏ္ဍတိုင်းအတွက် တကယ့်လက်တွေ့နှင့် တူညီသော ဒေတာ ပစ္စည်း ၅၀ စီ ပါဝင်ခြင်း။',

    overviewNav: 'အနှစ်ချုပ် အကျဉ်း',
    searchPlaceholder: 'API အမည်၊ လမ်းကြောင်း သို့မဟုတ် နည်းလမ်း ရှာရန် (⌘K)...',
    noEndpointsFound: 'ရှာဖွေမှုနှင့် ကိုက်ညီသော API မရှိပါ',
    matchingEndpoints: 'ကိုက်ညီသော Endpoints များ',

    documentationTab: 'စာရွက်စာတမ်း',
    testerTab: 'တိုက်ရိုက် စမ်းသပ်စနစ်',
    codeSnippetsTab: 'ကုဒ်နမူနာများ',
    authRequired: 'Bearer တိုကင် လိုအပ်သည်',
    publicAccess: 'အများသုံး ခွင့်ပြုထားသည်',
    adminOnly: 'အက်ဒမင် (Admin) သာ ခွင့်ပြုသည်',
    parametersHeading: 'တောင်းဆိုချက် ပါရာမီတာများ',
    requestBodyHeading: 'ပေးပို့ရမည့် အချက်အလက်ပုံစံ (Request Body)',
    responseExamplesHeading: 'ပြန်လည်ရရှိမည့် တုံ့ပြန်မှု ပုံစံများ (Responses)',
    requiredBadge: 'မဖြစ်မနေ လိုအပ်သည်',
    optionalBadge: 'ရွေးချယ်နိုင်သည်',

    sendRequestBtn: 'Request ပို့မည်',
    sendingRequestBtn: 'ပို့ဆောင်နေပါသည်...',
    headersTab: 'Headers',
    queryParamsTab: 'Query Params',
    bodyTab: 'Body (JSON)',
    resetBtn: 'ပြန်စမည်',
    responseHeading: 'ရရှိလာသော အချက်အလက် (Response)',
    latencyLabel: 'ကြာချိန်',
    statusLabel: 'အခြေအနေ (Status)',
    copyJsonBtn: 'JSON ကူးယူမည်',
    copiedBtn: 'ကူးယူပြီးပါပြီ!',
    downloadJsonBtn: 'ဒေါင်းလုဒ်',

    authModalTitle: 'API စစ်မှန်ကြောင်း အတည်ပြုစနစ်',
    authModalDesc: 'လုံခြုံရေးတပ်ထားသော API များကို စမ်းသပ်ရန် သင်၏ Bearer Token ကို သတ်မှတ်ပါ။',
    bearerTokenLabel: 'Bearer Token (JWT)',
    presetTokensTitle: 'ကြိုတင်သတ်မှတ်ထားသော တိုကင်များ',
    adminPreset: 'အက်ဒမင် အဆင့် (Admin Role - အပြည့်အဝ သုံးနိုင်သည်)',
    customerPreset: 'ဝယ်ယူသူ အဆင့် (Customer Role - ဝယ်ယူမှုနှင့် ခြင်းတောင်း)',
    guestPreset: 'ဧည့်သည် အဆင့် (Guest - အများသုံး API များသာ)',
    clearTokenBtn: 'တိုကင် ရှင်းလင်းမည်',
    saveCloseBtn: 'သိမ်းဆည်းပြီး ပိတ်မည်'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
  isMyanmar: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'ecommerce_api_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === 'my' || saved === 'en' ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: keyof Translations): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isMyanmar: language === 'my' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
