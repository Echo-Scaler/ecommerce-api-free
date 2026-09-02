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
  navConsole: string;
  navDocs: string;
  navLearn: string;

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

  // Docs Page
  docsHeroBadge: string;
  docsHeroTitle: string;
  docsHeroSubtitle: string;
  docsIndexTitle: string;
  docsLiveTesterTitle: string;
  docsLiveTesterDesc: string;
  docsLaunchConsoleBtn: string;
  docsSecOverview: string;
  docsSecAuth: string;
  docsSecEndpoints: string;
  docsSecQueryParams: string;
  docsSecSdks: string;
  docsSecStatusCodes: string;
  docsSecRateLimit: string;
  docsSecBestPractices: string;

  // Learn Page
  learnHeroBadge: string;
  learnHeroTitle: string;
  learnHeroSubtitle: string;
  learnProgressLabel: string;
  learnCurriculumTitle: string;
  learnTabTheory: string;
  learnTabExercise: string;
  learnTabQuiz: string;
  learnBtnReadyExercise: string;
  learnBtnReadyQuiz: string;
  learnBtnPrevLesson: string;
  learnBtnNextLesson: string;
  learnBtnMarkComplete: string;
  learnBtnCompletedDone: string;
  learnChallengeTitle: string;
  learnGoalLabel: string;
  learnRunLiveBtn: string;
  learnRunningBtn: string;
  learnOpenFullConsoleBtn: string;
  learnAssessmentTitle: string;
  learnAssessmentDesc: string;
  learnCheckAnswersBtn: string;
  learnRetryQuizBtn: string;

  // Documentation Components
  parametersLabel: string;
  pathParametersLabel: string;
  queryParametersLabel: string;
  headerParametersLabel: string;
  fieldColLabel: string;
  typeColLabel: string;
  requiredColLabel: string;
  descriptionColLabel: string;
  exampleColLabel: string;
  codeExamplesHeading: string;
  includeActiveTokenLabel: string;
  conditionLabel: string;
  responseViewerReadyTitle: string;
  responseViewerReadyDesc: string;
  executingApiRequestTitle: string;
  executingApiRequestSub: string;

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
    navConsole: 'Console',
    navDocs: 'Documentation',
    navLearn: 'Learn',

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
    searchPlaceholder: 'Search endpoints (⌘K)...',
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

    // Docs Page
    docsHeroBadge: 'Developer Reference Guide',
    docsHeroTitle: 'E-Commerce REST API Documentation',
    docsHeroSubtitle: 'Complete technical specification for 8 e-commerce REST modules, 30 endpoints, Bearer authorization, 50-item mock datasets, query pagination, and rate limit quotas.',
    docsIndexTitle: 'Documentation Index',
    docsLiveTesterTitle: 'Live Interactive Tester',
    docsLiveTesterDesc: 'Send real requests and inspect headers directly in the browser.',
    docsLaunchConsoleBtn: 'Launch API Console',
    docsSecOverview: '1. API Overview & Architecture',
    docsSecAuth: '2. Authentication & Authorization',
    docsSecEndpoints: '3. Complete Endpoint Reference',
    docsSecQueryParams: '4. Query Options & Filters',
    docsSecSdks: '5. Integration & Code SDKs',
    docsSecStatusCodes: '6. HTTP Status & Error Codes',
    docsSecRateLimit: '7. Rate Limiting Guide',
    docsSecBestPractices: '8. Best Practices & Security',

    // Learn Page
    learnHeroBadge: 'Interactive REST Academy',
    learnHeroTitle: 'REST API Learning Center',
    learnHeroSubtitle: 'Master professional e-commerce API design, authentication, state machines, and rate limiting with hands-on live exercises and quizzes.',
    learnProgressLabel: 'Course Progress',
    learnCurriculumTitle: 'Curriculum Modules',
    learnTabTheory: '📖 Theory & Architecture',
    learnTabExercise: '✏️ Live Hands-on Exercise',
    learnTabQuiz: '🧠 Knowledge Quiz',
    learnBtnReadyExercise: 'Ready for Live Exercise',
    learnBtnReadyQuiz: 'Test Your Knowledge in Quiz',
    learnBtnPrevLesson: 'Previous Lesson',
    learnBtnNextLesson: 'Next Lesson',
    learnBtnMarkComplete: 'Mark as Complete',
    learnBtnCompletedDone: 'Completed ✓',
    learnChallengeTitle: 'Hands-on Challenge',
    learnGoalLabel: 'Goal:',
    learnRunLiveBtn: 'Run Live Request',
    learnRunningBtn: 'Executing against API...',
    learnOpenFullConsoleBtn: 'Open in Full Tester Console',
    learnAssessmentTitle: 'Module Assessment',
    learnAssessmentDesc: 'Answer all questions correctly to test your understanding of this module.',
    learnCheckAnswersBtn: 'Check My Answers',
    learnRetryQuizBtn: 'Retry Quiz',

    // Documentation Components
    parametersLabel: 'Parameters',
    pathParametersLabel: 'Path Parameters',
    queryParametersLabel: 'Query Parameters',
    headerParametersLabel: 'Header Parameters',
    fieldColLabel: 'Field',
    typeColLabel: 'Type',
    requiredColLabel: 'Required',
    descriptionColLabel: 'Description',
    exampleColLabel: 'Example',
    codeExamplesHeading: 'Code Examples',
    includeActiveTokenLabel: 'Include Active Token',
    conditionLabel: 'Condition:',
    responseViewerReadyTitle: 'Response Viewer Ready',
    responseViewerReadyDesc: 'Click "Send Request" above to execute this endpoint and inspect live HTTP responses, status codes, latency, and payload headers.',
    executingApiRequestTitle: 'Executing API Request...',
    executingApiRequestSub: 'Connecting to server and awaiting response payload',

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
    brandHighlight: 'API',
    brandSubtitle: 'ဆော့ဖ်ဝဲ ပလက်ဖောင်း',
    liveSandbox: 'တိုက်ရိုက် စမ်းသပ်ခန်း',
    tokenActive: 'တိုကင် အသက်ဝင်သည်',
    authorize: 'ခွင့်ပြုချက်',
    github: 'GitHub',
    navConsole: 'ကွန်ဆိုးလ်',
    navDocs: 'စာရွက်စာတမ်း',
    navLearn: 'လေ့လာရန်',

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

    overviewNav: 'စနစ် အကျဉ်းချုပ်',
    searchPlaceholder: 'API ရှာဖွေရန် (⌘K)...',
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

    // Docs Page
    docsHeroBadge: 'ဆော့ဖ်ဝဲ ရေးသားသူများအတွက် လမ်းညွှန်',
    docsHeroTitle: 'အီးကောမတ်စ် REST API စာရွက်စာတမ်း အပြည့်အစုံ',
    docsHeroSubtitle: 'အီးကောမတ်စ် REST မော်ဂျူး ၈ ခု၊ Endpoints ၃၀၊ Bearer စစ်မှန်ကြောင်း အတည်ပြုချက်၊ ပစ္စည်း ၅၀ စီပါဝင်သော ဒေတာများ၊ စာမျက်နှာခွဲခြားမှုနှင့် ကန့်သတ်ချက်များဆိုင်ရာ အသေးစိတ် နည်းပညာ သတ်မှတ်ချက်များ။',
    docsIndexTitle: 'စာရွက်စာတမ်း အညွှန်း',
    docsLiveTesterTitle: 'တိုက်ရိုက် စမ်းသပ်စနစ်',
    docsLiveTesterDesc: 'ဘရောက်ဆာထဲတွင် တိုက်ရိုက် Request များ ပို့ဆောင်ပြီး Headers များကို စစ်ဆေးပါ။',
    docsLaunchConsoleBtn: 'ကွန်ဆိုးလ်ကို ဖွင့်မည်',
    docsSecOverview: '၁။ API အနှစ်ချုပ်နှင့် တည်ဆောက်ပုံ',
    docsSecAuth: '၂။ စစ်မှန်ကြောင်း အတည်ပြုချက်နှင့် အခန်းကဏ္ဍများ',
    docsSecEndpoints: '၃။ ပြည့်စုံသော Endpoint လမ်းညွှန်',
    docsSecQueryParams: '၄။ Query စစ်ထုတ်မှုနှင့် ရှာဖွေနည်းများ',
    docsSecSdks: '၅။ စနစ်ချိတ်ဆက်မှုနှင့် SDK ကုဒ်နမူနာများ',
    docsSecStatusCodes: '၆။ HTTP Status နှင့် အမှားကုဒ်များ',
    docsSecRateLimit: '၇။ API အသုံးပြုမှု ကန့်သတ်ချက် (Rate Limit) လမ်းညွှန်',
    docsSecBestPractices: '၈။ အကောင်းဆုံး လိုက်နာရန် အချက်များနှင့် လုံခြုံရေး',

    // Learn Page
    learnHeroBadge: 'လက်တွေ့ စမ်းသပ်လေ့လာနိုင်သော REST သင်တန်း',
    learnHeroTitle: 'REST API လေ့လာရေး စင်တာ',
    learnHeroSubtitle: 'အဆင့်မြင့် အီးကောမတ်စ် API ဒီဇိုင်း၊ စစ်မှန်ကြောင်း အတည်ပြုချက်၊ အခြေအနေ ထိန်းချုပ်မှုများနှင့် Rate Limiting များကို လက်တွေ့ စမ်းသပ်မှုများနှင့် ဉာဏ်စမ်းမေးခွန်းများဖြင့် ကျွမ်းကျင်စွာ လေ့လာလိုက်ပါ။',
    learnProgressLabel: 'သင်ခန်းစာ တိုးတက်မှု',
    learnCurriculumTitle: 'သင်ရိုးညွှန်းတမ်း မော်ဂျူးများ',
    learnTabTheory: '📖 သီအိုရီနှင့် တည်ဆောက်ပုံ',
    learnTabExercise: '✏️ လက်တွေ့ စမ်းသပ်မှု',
    learnTabQuiz: '🧠 ဉာဏ်စမ်း စစ်ဆေးမှု',
    learnBtnReadyExercise: 'လက်တွေ့ စမ်းသပ်မှု စတင်မည်',
    learnBtnReadyQuiz: 'ဉာဏ်စမ်း မေးခွန်းများ စစ်ဆေးမည်',
    learnBtnPrevLesson: 'ယခင် သင်ခန်းစာ',
    learnBtnNextLesson: 'နောက် သင်ခန်းစာ',
    learnBtnMarkComplete: 'ပြီးစီးကြောင်း သတ်မှတ်မည်',
    learnBtnCompletedDone: 'ပြီးစီးပြီးပါပြီ ✓',
    learnChallengeTitle: 'လက်တွေ့ စိန်ခေါ်မှု',
    learnGoalLabel: 'ရည်မှန်းချက်:',
    learnRunLiveBtn: 'တိုက်ရိုက် Request ပို့မည်',
    learnRunningBtn: 'API သို့ ပို့ဆောင်နေပါသည်...',
    learnOpenFullConsoleBtn: 'ကွန်ဆိုးလ်အပြည့်တွင် ဖွင့်မည်',
    learnAssessmentTitle: 'မော်ဂျူး အကဲဖြတ်စစ်ဆေးခြင်း',
    learnAssessmentDesc: 'ဤမော်ဂျူးကို သေချာစွာ နားလည်သဘောပေါက်စေရန် မေးခွန်းအားလုံးကို ဖြေဆိုပါ။',
    learnCheckAnswersBtn: 'အဖြေများ စစ်ဆေးမည်',
    learnRetryQuizBtn: 'ဉာဏ်စမ်း ပြန်လည်ဖြေဆိုမည်',

    // Documentation Components
    parametersLabel: 'ပါရာမီတာများ',
    pathParametersLabel: 'Path ပါရာမီတာများ',
    queryParametersLabel: 'Query ပါရာမီတာများ',
    headerParametersLabel: 'Header ပါရာမီတာများ',
    fieldColLabel: 'အကွက် (Field)',
    typeColLabel: 'အမျိုးအစား (Type)',
    requiredColLabel: 'မဖြစ်မနေ (Required)',
    descriptionColLabel: 'ဖော်ပြချက် (Description)',
    exampleColLabel: 'နမူနာ (Example)',
    codeExamplesHeading: 'ကုဒ်ဖြင့် ချိတ်ဆက်မှု နမူနာများ',
    includeActiveTokenLabel: 'လက်ရှိ တိုကင်ကို ထည့်သွင်းမည်',
    conditionLabel: 'အခြေအနေ သတ်မှတ်ချက်:',
    responseViewerReadyTitle: 'တုံ့ပြန်မှု စောင့်ကြည့်စနစ် အသင့်ဖြစ်ပါပြီ',
    responseViewerReadyDesc: 'ဤ Endpoint ကို စမ်းသပ်ရန် အပေါ်ရှိ "Request ပို့မည်" ခလုတ်ကို နှိပ်၍ HTTP တုံ့ပြန်မှု၊ Status ကုဒ်၊ ကြာချိန်နှင့် Headers များကို ကြည့်ရှုပါ။',
    executingApiRequestTitle: 'API Request ပို့ဆောင်နေပါသည်...',
    executingApiRequestSub: 'ဆာဗာသို့ ချိတ်ဆက်၍ တုံ့ပြန်မှုရလဒ်ကို စောင့်ဆိုင်းနေပါသည်',

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
    document.documentElement.classList.toggle('lang-my', language === 'my');
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.toggle('lang-my', language === 'my');
    }
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
