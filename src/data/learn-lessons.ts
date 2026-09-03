export interface QuizQuestion {
  id: string;
  question: string;
  question_my: string;
  options: string[];
  options_my: string[];
  correctIndex: number;
  explanation: string;
  explanation_my: string;
}

export interface LearnLesson {
  id: string;
  moduleNum: number;
  title: string;
  title_my: string;
  subtitle: string;
  subtitle_my: string;
  icon: string;
  durationMin: number;
  theory: {
    summary: string;
    summary_my: string;
    sections: {
      heading: string;
      heading_my: string;
      content: string;
      content_my: string;
      codeSnippet?: {
        language: string;
        code: string;
      };
      bulletPoints?: string[];
      bulletPoints_my?: string[];
      callout?: {
        type: 'info' | 'tip' | 'warning';
        text: string;
        text_my: string;
      };
    }[];
  };
  exercise: {
    title: string;
    title_my: string;
    goal: string;
    goal_my: string;
    description: string;
    description_my: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    authRequired: boolean;
    defaultHeaders?: Record<string, string>;
    defaultQueryParams?: Record<string, string>;
    defaultBody?: Record<string, any>;
    explanationNote: string;
    explanationNote_my: string;
  };
  quiz: {
    title: string;
    title_my: string;
    questions: QuizQuestion[];
  };
}

export const LEARN_LESSONS: LearnLesson[] = [
  {
    id: 'intro-rest-http',
    moduleNum: 1,
    title: 'Introduction to REST & HTTP Methods',
    title_my: 'REST နှင့် HTTP Methods မိတ်ဆက်',
    subtitle: 'Master REST architectural constraints, resource URIs, and standard HTTP verbs.',
    subtitle_my: 'REST ဗိသုကာပုံစံ၊ Resource URI များနှင့် HTTP verb စံနှုန်းများကို ကျွမ်းကျင်စွာ လေ့လာပါ။',
    icon: '📡',
    durationMin: 10,
    theory: {
      summary: 'REST (Representational State Transfer) is a stateless software architecture designed for distributed hypermedia systems. Clients and servers communicate using standard HTTP protocols and structured data payloads.',
      summary_my: 'REST (Representational State Transfer) သည် ဖြန့်ဝေထားသော hypermedia စနစ်များအတွက် ဒီဇိုင်းပြုလုပ်ထားသည့် stateless ဆော့ဖ်ဝဲ ဗိသုကာပုံစံ ဖြစ်ပါသည်။ Client နှင့် Server များသည် HTTP protocol စံနှုန်းများနှင့် ပုံစံတကျ ဒေတာများဖြင့် ဆက်သွယ်ပါသည်။',
      sections: [
        {
          heading: 'Core Principles of RESTful APIs',
          heading_my: 'RESTful API များ၏ အဓိက အခြေခံမူများ',
          content: 'In a RESTful design, every entity is treated as a distinct "Resource" identified by a clean, deterministic URI (Uniform Resource Identifier).',
          content_my: 'RESTful ဒီဇိုင်းတွင် အရာဝတ္ထုတိုင်းကို သီးခြား "Resource" အဖြစ် သတ်မှတ်ပြီး ရှင်းလင်းသော URI (Uniform Resource Identifier) ဖြင့် ခွဲခြားသတ်မှတ်ပါသည်။',
          bulletPoints: [
            'Resource-Oriented: Plural nouns are used for collections (e.g. /api/v1/products, /api/v1/orders).',
            'Statelessness: Every client request must contain all credentials and context needed for processing.',
            'Uniform Interface: Standardized HTTP verbs define the intended action on the resource.',
            'JSON Payloads: Structured JSON is the modern standard for request and response payloads.'
          ],
          bulletPoints_my: [
            'Resource-Oriented: Collection များအတွက် အများကိန်း နာမ်များ အသုံးပြုပါသည် (ဥပမာ - /api/v1/products, /api/v1/orders)။',
            'Statelessness: Client Request တိုင်းတွင် လိုအပ်သော Credential များနှင့် Context အားလုံး ပါဝင်ရပါမည်။',
            'Uniform Interface: HTTP verb စံနှုန်းများဖြင့် Resource ပေါ်တွင် ပြုလုပ်လိုသော လုပ်ဆောင်ချက်ကို သတ်မှတ်ပါသည်။',
            'JSON Payloads: ပုံစံတကျ JSON သည် Request နှင့် Response ဒေတာများအတွက် ခေတ်မီ စံနှုန်း ဖြစ်ပါသည်။'
          ]
        },
        {
          heading: 'Standard HTTP Verbs & Idempotency',
          heading_my: 'HTTP Verb စံနှုန်းများနှင့် Idempotency',
          content: 'HTTP methods convey the exact operation performed on the resource:',
          content_my: 'HTTP method များသည် Resource ပေါ်တွင် ပြုလုပ်မည့် လုပ်ဆောင်ချက်ကို အတိအကျ ဖော်ပြပါသည်:',
          bulletPoints: [
            'GET: Safe & Idempotent. Retrieves a resource or collection without modifying server state.',
            'POST: Non-Idempotent. Creates a new resource or triggers an action (e.g. placing an order).',
            'PUT: Idempotent. Replaces an existing resource entirely with the provided payload.',
            'PATCH: Idempotent. Partially updates specific fields of an existing resource.',
            'DELETE: Idempotent. Removes a resource from the server catalog.'
          ],
          bulletPoints_my: [
            'GET: လုံခြုံပြီး Idempotent ဖြစ်သည်။ Server ၏ အခြေအနေကို မပြောင်းလဲဘဲ Resource သို့မဟုတ် Collection ကို ရယူပါသည်။',
            'POST: Non-Idempotent ဖြစ်သည်။ Resource အသစ် ဖန်တီးခြင်း သို့မဟုတ် လုပ်ဆောင်ချက်တစ်ခု စတင်ခြင်း (ဥပမာ - အမှာစာ တင်ခြင်း)။',
            'PUT: Idempotent ဖြစ်သည်။ ရှိပြီးသား Resource ကို ပေးပို့လာသော ဒေတာဖြင့် အလုံးစုံ အစားထိုးပါသည်။',
            'PATCH: Idempotent ဖြစ်သည်။ ရှိပြီးသား Resource ၏ အကွက်အချို့ကိုသာ ပြင်ဆင်ပါသည်။',
            'DELETE: Idempotent ဖြစ်သည်။ Server မှ Resource ကို ဖယ်ရှားပါသည်။'
          ],
          callout: {
            type: 'tip',
            text: 'An idempotent operation produces the exact same result on the server whether executed once or ten times.',
            text_my: 'Idempotent လုပ်ဆောင်ချက်သည် တစ်ကြိမ်ပြုလုပ်စေ ဆယ်ကြိမ်ပြုလုပ်စေ Server ပေါ်တွင် အတိအကျ တူညီသော ရလဒ်ကိုသာ ထုတ်ပေးပါသည်။'
          }
        }
      ]
    },
    exercise: {
      title: 'Fetch Public Catalog Products',
      title_my: 'အများသုံး ကုန်ပစ္စည်းစာရင်း ရယူခြင်း',
      goal: 'Execute a GET request to list products with a limit parameter',
      goal_my: 'Limit ပါရာမီတာဖြင့် ကုန်ပစ္စည်းစာရင်းကို GET Request ပို့၍ ရယူပါ',
      description: 'Send a GET request to the public /api/v1/products endpoint to retrieve products from the catalog. Observe the JSON structure and response latency.',
      description_my: 'အများသုံး /api/v1/products endpoint သို့ GET Request ပို့၍ ကုန်ပစ္စည်းစာရင်းကို ရယူပါ။ JSON ဖွဲ့စည်းပုံနှင့် တုံ့ပြန်မှု ကြာချိန်ကို လေ့လာကြည့်ပါ။',
      method: 'GET',
      path: '/api/v1/products',
      authRequired: false,
      defaultQueryParams: {
        page: '1',
        limit: '10'
      },
      explanationNote: 'Notice that GET requests do not require a request body and return HTTP 200 OK along with pagination metadata.',
      explanationNote_my: 'GET Request များတွင် Request Body မလိုအပ်ဘဲ HTTP 200 OK နှင့်အတူ စာမျက်နှာခွဲခြားမှု (Pagination) metadata ကို ပြန်လည်ပေးပို့သည်ကို သတိပြုပါ။'
    },
    quiz: {
      title: 'REST Fundamentals Quiz',
      title_my: 'REST အခြေခံ ဉာဏ်စမ်းစစ်ဆေးမှု',
      questions: [
        {
          id: 'q1-1',
          question: 'Which HTTP method should be used to retrieve data without altering server state?',
          question_my: 'Server ၏ အခြေအနေကို မပြောင်းလဲဘဲ ဒေတာရယူရန် မည်သည့် HTTP method ကို အသုံးပြုသင့်သနည်း?',
          options: ['POST', 'GET', 'DELETE', 'PATCH'],
          options_my: ['POST', 'GET', 'DELETE', 'PATCH'],
          correctIndex: 1,
          explanation: 'GET is a safe, read-only method designed strictly for fetching resources.',
          explanation_my: 'GET သည် Resource များကို ဖတ်ရှု ရယူရန်သာ ဒီဇိုင်းပြုလုပ်ထားသော လုံခြုံပြီး ဖတ်ရုံသာ ဖြစ်သည့် method ဖြစ်ပါသည်။'
        },
        {
          id: 'q1-2',
          question: 'What does "Idempotency" mean in REST APIs?',
          question_my: 'REST API များတွင် "Idempotency" ဆိုသည်မှာ အဘယ်ကို ဆိုလိုပါသနည်း?',
          options: [
            'The request will always run in under 50ms',
            'Making multiple identical requests produces the same server state as a single request',
            'The request requires an SSL certificate',
            'The API endpoint only accepts JSON data'
          ],
          options_my: [
            'Request သည် ၅၀ms အတွင်းတွင် အမြဲတမ်း ပြီးဆုံးမည်',
            'တူညီသော Request များကို အကြိမ်ကြိမ် ပို့ခြင်းသည် တစ်ကြိမ်သာ ပို့ခြင်းနှင့် Server အခြေအနေ တူညီမည်',
            'Request တွင် SSL certificate လိုအပ်သည်',
            'API endpoint သည် JSON ဒေတာကိုသာ လက်ခံသည်'
          ],
          correctIndex: 1,
          explanation: 'Idempotent methods (GET, PUT, DELETE) guarantee that repeated identical executions leave the server in the same state.',
          explanation_my: 'Idempotent method များ (GET, PUT, DELETE) သည် တူညီသော လုပ်ဆောင်ချက်ကို ထပ်ခါထပ်ခါ ပြုလုပ်သော်လည်း Server ကို တစ်ခုတည်းသော အခြေအနေတွင်သာ ထားရှိစေမည်ကို အာမခံပါသည်။'
        },
        {
          id: 'q1-3',
          question: 'Which of the following is a RESTful resource URI pattern for accessing an order with ID 42?',
          question_my: 'ID 42 ရှိသော အမှာစာကို ဝင်ရောက်ကြည့်ရှုရန် အောက်ပါ URI ပုံစံများအနက် မည်သည်က RESTful ဖြစ်ပါသနည်း?',
          options: [
            '/api/v1/getOrder?id=42',
            '/api/v1/orders/42',
            '/api/v1/execute_order_read/42',
            '/api/v1/query/orders?action=fetch&id=42'
          ],
          options_my: [
            '/api/v1/getOrder?id=42',
            '/api/v1/orders/42',
            '/api/v1/execute_order_read/42',
            '/api/v1/query/orders?action=fetch&id=42'
          ],
          correctIndex: 1,
          explanation: 'REST uses clean noun-based paths (/orders/:id) rather than RPC-style action verbs in the URI.',
          explanation_my: 'REST သည် URI တွင် RPC ပုံစံ action verb များ အစား ရှင်းလင်းသော နာမ်အခြေခံ လမ်းကြောင်းများ (/orders/:id) ကို အသုံးပြုပါသည်။'
        }
      ]
    }
  },
  {
    id: 'auth-bearer-tokens',
    moduleNum: 2,
    title: 'Bearer Token Authentication & Roles',
    title_my: 'Bearer Token စစ်မှန်ကြောင်း အတည်ပြုခြင်းနှင့် အခန်းကဏ္ဍများ',
    subtitle: 'Learn JSON Web Token (JWT) authorization headers and role-based access control.',
    subtitle_my: 'JSON Web Token (JWT) ခွင့်ပြုချက် Header များနှင့် အခန်းကဏ္ဍအလိုက် ဝင်ရောက်ထိန်းချုပ်မှုစနစ်ကို လေ့လာပါ။',
    icon: '🔐',
    durationMin: 12,
    theory: {
      summary: 'Securing API endpoints requires authenticating the client identity and authorizing privileges. In REST APIs, the Bearer Token scheme is the industry standard for transmitting JWTs in the HTTP Authorization header.',
      summary_my: 'API endpoint များကို လုံခြုံစေရန် Client ၏ အထောက်အထား စစ်ဆေးခြင်းနှင့် လုပ်ပိုင်ခွင့် အတည်ပြုခြင်း လိုအပ်ပါသည်။ REST API များတွင် Bearer Token စနစ်သည် HTTP Authorization header မှတစ်ဆင့် JWT များကို ပေးပို့ရာတွင် စက်မှုလုပ်ငန်း စံနှုန်း ဖြစ်ပါသည်။',
      sections: [
        {
          heading: 'The Authorization Header Format',
          heading_my: 'Authorization Header ပုံစံ',
          content: 'Bearer authentication involves passing a cryptographically signed token in the HTTP request headers:',
          content_my: 'Bearer စစ်မှန်ကြောင်း အတည်ပြုခြင်းတွင် လျှို့ဝှက်ကုဒ်ဖြင့် လက်မှတ်ထိုးထားသော တိုကင်ကို HTTP request header များတွင် ထည့်သွင်းပေးပို့ပါသည်:',
          codeSnippet: {
            language: 'http',
            code: `GET /api/v1/orders HTTP/1.1\nHost: api.ecommerce.example.com\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\nAccept: application/json`
          }
        },
        {
          heading: '401 Unauthorized vs. 403 Forbidden',
          heading_my: '401 Unauthorized နှင့် 403 Forbidden ကွာခြားချက်',
          content: 'Distinguishing between authentication and authorization is critical for proper API client design:',
          content_my: 'Authentication (စစ်မှန်ကြောင်း) နှင့် Authorization (ခွင့်ပြုချက်) ကို ခွဲခြားနားလည်ခြင်းသည် API Client ကို မှန်ကန်စွာ ဒီဇိုင်းပြုလုပ်ရန် အရေးကြီးပါသည်:',
          bulletPoints: [
            '401 Unauthorized: The request lacks valid authentication credentials. The client is anonymous or the token has expired.',
            '403 Forbidden: The client is successfully authenticated, but lacks sufficient permissions (e.g. a Customer attempting an Admin-only inventory update).'
          ],
          bulletPoints_my: [
            '401 Unauthorized: Request တွင် မှန်ကန်သော စစ်မှန်ကြောင်း အထောက်အထားများ မပါဝင်ပါ။ Client သည် အမည်မသိ ဖြစ်နေခြင်း သို့မဟုတ် တိုကင် သက်တမ်းကုန်ဆုံးနေခြင်း ဖြစ်ပါသည်။',
            '403 Forbidden: Client သည် စစ်မှန်ကြောင်း အတည်ပြုပြီး ဖြစ်သော်လည်း လုံလောက်သော ခွင့်ပြုချက် မရှိပါ (ဥပမာ - Customer တစ်ဦးက Admin သီးသန့် စတော့ချိန်ညှိမှုကို ကြိုးစားခြင်း)။'
          ],
          callout: {
            type: 'warning',
            text: 'Never expose API secret keys or user passwords in URL query parameters. Always transmit credentials via headers over HTTPS.',
            text_my: 'API လျှို့ဝှက်ကုဒ်များ သို့မဟုတ် အသုံးပြုသူ စကားဝှက်များကို URL query parameter များတွင် ဘယ်တော့မှ မထည့်ပါနှင့်။ HTTPS မှတစ်ဆင့် Header များဖြင့်သာ အထောက်အထားများကို ပေးပို့ပါ။'
          }
        }
      ]
    },
    exercise: {
      title: 'Verify Authenticated Session Identity',
      title_my: 'စစ်မှန်ကြောင်း အတည်ပြုထားသော Session ကို စစ်ဆေးခြင်း',
      goal: 'Inspect user session and permissions using a Bearer token',
      goal_my: 'Bearer Token ဖြင့် အသုံးပြုသူ Session နှင့် ခွင့်ပြုချက်များကို စစ်ဆေးပါ',
      description: 'Execute GET /api/v1/auth/me with an active Bearer token to decode token claims, user roles, and verified identity.',
      description_my: 'Bearer Token ဖြင့် GET /api/v1/auth/me ကို ခေါ်ဆို၍ Token ၏ claims များ၊ အသုံးပြုသူ အခန်းကဏ္ဍများနှင့် အတည်ပြုထားသော အထောက်အထားကို ကြည့်ရှုပါ။',
      method: 'GET',
      path: '/api/v1/auth/me',
      authRequired: true,
      defaultHeaders: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.customer-token'
      },
      explanationNote: 'When an Authorization header is included, the API server decodes the JWT and returns the authenticated user context.',
      explanationNote_my: 'Authorization header ပါဝင်သောအခါ API server သည် JWT ကို decode ပြုလုပ်ပြီး စစ်မှန်ကြောင်း အတည်ပြုထားသော အသုံးပြုသူ အချက်အလက်ကို ပြန်လည်ပေးပို့ပါသည်။'
    },
    quiz: {
      title: 'Authentication & Security Quiz',
      title_my: 'စစ်မှန်ကြောင်းအတည်ပြုခြင်းနှင့် လုံခြုံရေး ဉာဏ်စမ်း',
      questions: [
        {
          id: 'q2-1',
          question: 'In which HTTP header should Bearer JWT tokens be sent?',
          question_my: 'Bearer JWT Token များကို မည်သည့် HTTP header တွင် ပေးပို့သင့်ပါသနည်း?',
          options: ['X-Auth-Token', 'Authentication', 'Authorization', 'Bearer-Key'],
          options_my: ['X-Auth-Token', 'Authentication', 'Authorization', 'Bearer-Key'],
          correctIndex: 2,
          explanation: 'Standard HTTP authorization uses the "Authorization" header formatted as "Bearer <token>".',
          explanation_my: 'HTTP ခွင့်ပြုချက် စံနှုန်းသည် "Authorization" header ကို "Bearer <token>" ပုံစံဖြင့် အသုံးပြုပါသည်။'
        },
        {
          id: 'q2-2',
          question: 'What HTTP status code should an API return when an authenticated Customer tries to delete an Admin-only resource?',
          question_my: 'စစ်မှန်ကြောင်း အတည်ပြုပြီးသော Customer တစ်ဦးက Admin သီးသန့် Resource ကို ဖျက်ရန် ကြိုးစားသောအခါ API သည် မည်သည့် HTTP status code ကို ပြန်လည်ပေးပို့သင့်ပါသနည်း?',
          options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found'],
          options_my: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found'],
          correctIndex: 2,
          explanation: '403 Forbidden indicates the server understands who you are, but refuses to grant access due to insufficient privileges.',
          explanation_my: '403 Forbidden သည် Server က သင်ဘယ်သူလဲ သိပါသည်၊ သို့သော် ခွင့်ပြုချက် မလုံလောက်သောကြောင့် ဝင်ရောက်ခွင့် ငြင်းပယ်ကြောင်း ဖော်ပြပါသည်။'
        },
        {
          id: 'q2-3',
          question: 'Why are Bearer tokens preferred over sending raw usernames and passwords with every request?',
          question_my: 'Request တိုင်းတွင် အသုံးပြုသူအမည်နှင့် စကားဝှက်ကို တိုက်ရိုက် ပေးပို့ခြင်းထက် Bearer Token များကို အဘယ်ကြောင့် ပိုမိုနှစ်သက်ကြပါသနည်း?',
          options: [
            'Bearer tokens are shorter than passwords',
            'Tokens are stateless, time-limited, and prevent storing raw passwords in client memory',
            'Servers cannot read passwords over HTTP',
            'Tokens make requests 10x faster'
          ],
          options_my: [
            'Bearer Token များသည် စကားဝှက်များထက် တိုတောင်းသည်',
            'Token များသည် stateless ဖြစ်ပြီး သက်တမ်းသတ်မှတ်ထားကာ Client memory တွင် စကားဝှက်များ သိမ်းဆည်းခြင်းကို ရှောင်ကြဉ်စေပါသည်',
            'Server များသည် HTTP မှတစ်ဆင့် စကားဝှက်များကို မဖတ်နိုင်ပါ',
            'Token များက Request များကို ၁၀ ဆ ပိုမြန်စေပါသည်'
          ],
          correctIndex: 1,
          explanation: 'JWT tokens encapsulate claims, expiry dates, and signature verification without exposing credentials.',
          explanation_my: 'JWT Token များသည် အထောက်အထားများကို မဖော်ပြဘဲ claims များ၊ သက်တမ်းကုန်ဆုံးရက်များနှင့် လက်မှတ် စစ်ဆေးမှုတို့ကို ထုပ်ပိုးထားပါသည်။'
        }
      ]
    }
  },
  {
    id: 'query-params-pagination',
    moduleNum: 3,
    title: 'Query Parameters, Sorting & Pagination',
    title_my: 'Query ပါရာမီတာများ၊ စီစဉ်ခြင်းနှင့် စာမျက်နှာခွဲခြားခြင်း',
    subtitle: 'Filter large catalog datasets and paginate responses efficiently.',
    subtitle_my: 'ကြီးမားသော ကုန်ပစ္စည်း ဒေတာများကို စစ်ထုတ်ပြီး တုံ့ပြန်မှုများကို ထိရောက်စွာ စာမျက်နှာခွဲခြားပါ။',
    icon: '📊',
    durationMin: 15,
    theory: {
      summary: 'When API collections grow into thousands of items, pagination and sorting are mandatory to avoid network bottlenecks and server memory exhaustion.',
      summary_my: 'API Collection များတွင် ပစ္စည်း ထောင်ပေါင်းများစွာ ရှိလာသောအခါ ကွန်ရက် ပိတ်ဆို့မှုနှင့် Server Memory ပြည့်လျှံမှုကို ရှောင်ကြဉ်ရန် စာမျက်နှာခွဲခြားခြင်းနှင့် စီစဉ်ခြင်းသည် မဖြစ်မနေ လိုအပ်ပါသည်။',
      sections: [
        {
          heading: 'Pagination Models in REST',
          heading_my: 'REST တွင် စာမျက်နှာခွဲခြားခြင်း ပုံစံများ',
          content: 'Common pagination techniques include Offset-based and Cursor-based pagination:',
          content_my: 'အသုံးများသော စာမျက်နှာခွဲခြားမှု နည်းပညာများတွင် Offset-based နှင့် Cursor-based ပါဝင်ပါသည်:',
          bulletPoints: [
            'Offset/Page-based: Using page and limit query parameters (e.g. ?page=2&limit=20). Easy to navigate directly to arbitrary pages.',
            'Cursor-based: Using an opaque pointer (e.g. ?cursor=prod_901a8f&limit=20). High performance for real-time appending streams.'
          ],
          bulletPoints_my: [
            'Offset/Page-based: page နှင့် limit query ပါရာမီတာများ အသုံးပြုခြင်း (ဥပမာ - ?page=2&limit=20)။ မည်သည့် စာမျက်နှာသို့မဆို တိုက်ရိုက် ရောက်ရှိနိုင်ပါသည်။',
            'Cursor-based: Opaque pointer အသုံးပြုခြင်း (ဥပမာ - ?cursor=prod_901a8f&limit=20)။ အချိန်နှင့်တပြေးညီ ဒေတာစီးဆင်းမှုများအတွက် စွမ်းဆောင်ရည်မြင့်ပါသည်။'
          ]
        },
        {
          heading: 'Multi-Parameter Filtering & Sorting Syntax',
          heading_my: 'ပါရာမီတာများဖြင့် စစ်ထုတ်ခြင်းနှင့် စီစဉ်ခြင်း ရေးသားပုံ',
          content: 'Query parameters allow clients to tailor results precisely without server schema alterations:',
          content_my: 'Query ပါရာမီတာများဖြင့် Server ဖွဲ့စည်းပုံကို မပြောင်းလဲဘဲ ရလဒ်များကို အတိအကျ ချိန်ညှိနိုင်ပါသည်:',
          codeSnippet: {
            language: 'http',
            code: `GET /api/v1/products?category_id=cat_1&sort=price:asc&page=1&limit=10 HTTP/1.1\nAccept: application/json`
          },
          callout: {
            type: 'info',
            text: 'Always provide sensible server defaults (e.g. page=1, limit=20, maxLimit=50) to safeguard server performance.',
            text_my: 'Server စွမ်းဆောင်ရည်ကို ကာကွယ်ရန် သင့်လျော်သော Server မူလတန်ဖိုးများ (ဥပမာ - page=1, limit=20, maxLimit=50) ကို အမြဲ သတ်မှတ်ထားပါ။'
          }
        }
      ]
    },
    exercise: {
      title: 'Paginate & Sort Catalog by Price',
      title_my: 'ကုန်ပစ္စည်းစာရင်းကို ဈေးနှုန်းအလိုက် စီစဉ်ပြီး စာမျက်နှာခွဲခြားခြင်း',
      goal: 'Retrieve 10 products sorted in ascending price order',
      goal_my: 'ဈေးနှုန်း ငယ်စဉ်ကြီးလိုက် စီစဉ်ထားသော ကုန်ပစ္စည်း ၁၀ ခုကို ရယူပါ',
      description: 'Send a GET request to /api/v1/products with page=1, limit=10, and sort=price:asc to verify sorting and pagination metadata.',
      description_my: 'page=1, limit=10 နှင့် sort=price:asc တို့ဖြင့် /api/v1/products သို့ GET Request ပို့၍ စီစဉ်ခြင်းနှင့် စာမျက်နှာခွဲခြားမှု metadata ကို စစ်ဆေးပါ။',
      method: 'GET',
      path: '/api/v1/products',
      authRequired: false,
      defaultQueryParams: {
        page: '1',
        limit: '10',
        sort: 'price:asc'
      },
      explanationNote: 'Observe the response pagination object containing total items, current page, limit, and totalPages.',
      explanationNote_my: 'Response ၏ pagination object တွင် စုစုပေါင်း ပစ္စည်းအရေအတွက်၊ လက်ရှိ စာမျက်နှာ၊ limit နှင့် totalPages တို့ ပါဝင်သည်ကို လေ့လာပါ။'
    },
    quiz: {
      title: 'Pagination & Querying Quiz',
      title_my: 'စာမျက်နှာခွဲခြားခြင်းနှင့် Query ဉာဏ်စမ်း',
      questions: [
        {
          id: 'q3-1',
          question: 'If an API has 50 total products and the client requests limit=10, how many totalPages are available?',
          question_my: 'API တွင် ကုန်ပစ္စည်း စုစုပေါင်း ၅၀ ခု ရှိပြီး Client က limit=10 တောင်းဆိုပါက စာမျက်နှာ စုစုပေါင်း မည်မျှ ရှိမည်နည်း?',
          options: ['1', '5', '10', '50'],
          options_my: ['၁', '၅', '၁၀', '၅၀'],
          correctIndex: 1,
          explanation: 'Math.ceil(50 / 10) = 5 total pages.',
          explanation_my: 'Math.ceil(50 / 10) = စုစုပေါင်း စာမျက်နှာ ၅ ခု ဖြစ်ပါသည်။'
        },
        {
          id: 'q3-2',
          question: 'Which query string correctly requests the 3rd page with 20 items per page?',
          question_my: 'စာမျက်နှာတစ်ခုလျှင် ပစ္စည်း ၂၀ ခုဖြင့် စာမျက်နှာ ၃ ကို မှန်ကန်စွာ တောင်းဆိုသော query string မှာ မည်သည်ဖြစ်ပါသနည်း?',
          options: ['?offset=3&page=20', '?page=3&limit=20', '?page_size=3&items=20', '?limit=3&page=20'],
          options_my: ['?offset=3&page=20', '?page=3&limit=20', '?page_size=3&items=20', '?limit=3&page=20'],
          correctIndex: 1,
          explanation: '?page=3&limit=20 specifies page number 3 and a window size of 20 items.',
          explanation_my: '?page=3&limit=20 သည် စာမျက်နှာ ၃ နှင့် တစ်မျက်နှာလျှင် ပစ္စည်း ၂၀ ခု ပြသရန် သတ်မှတ်ပါသည်။'
        },
        {
          id: 'q3-3',
          question: 'Why should an API enforce a maximum limit on pagination parameters?',
          question_my: 'API သည် စာမျက်နှာခွဲခြားမှု ပါရာမီတာများတွင် အများဆုံး ကန့်သတ်ချက် အဘယ်ကြောင့် သတ်မှတ်ရပါသနည်း?',
          options: [
            'To prevent denial-of-service and extreme database memory allocation',
            'Because JSON cannot format more than 50 items',
            'To force clients to write more code',
            'Browsers do not support large responses'
          ],
          options_my: [
            'Denial-of-service တိုက်ခိုက်မှုနှင့် Database memory အလွန်အကျွံ သုံးစွဲခြင်းကို ကာကွယ်ရန်',
            'JSON သည် ပစ္စည်း ၅၀ ထက် ပိုမိုပုံစံချ၍ မရသောကြောင့်',
            'Client များကို ကုဒ် ပိုရေးခိုင်းရန်',
            'ဘရောက်ဆာများသည် ကြီးမားသော Response များကို ပံ့ပိုးမထောက်ပံ့သောကြောင့်'
          ],
          correctIndex: 0,
          explanation: 'Uncapped pagination limits allow clients to request millions of records at once, causing severe database and memory strain.',
          explanation_my: 'ကန့်သတ်ချက်မဲ့ စာမျက်နှာခွဲခြားမှုသည် Client များကို ဒေတာ သန်းပေါင်းများစွာ တစ်ကြိမ်တည်း တောင်းဆိုခွင့်ပေးပြီး Database နှင့် Memory ကို ပြင်းထန်စွာ ဖိအားပေးစေပါသည်။'
        }
      ]
    }
  },
  {
    id: 'status-codes-errors',
    moduleNum: 4,
    title: 'HTTP Status Codes & Error Diagnostics',
    title_my: 'HTTP Status Code များနှင့် အမှား ရှာဖွေခြင်း',
    subtitle: 'Understand 2xx, 4xx, and 5xx response codes and structured error handling.',
    subtitle_my: '2xx, 4xx နှင့် 5xx Response Code များနှင့် ပုံစံတကျ အမှား ကိုင်တွယ်ခြင်းကို နားလည်ပါ။',
    icon: '🛠',
    durationMin: 12,
    theory: {
      summary: 'HTTP response status codes indicate whether an HTTP request has been successfully completed. Standardized status codes allow client applications to react predictably to failures.',
      summary_my: 'HTTP Response Status Code များသည် HTTP Request တစ်ခု အောင်မြင်စွာ ပြီးစီးခြင်း ရှိ/မရှိ ဖော်ပြပါသည်။ စံသတ်မှတ်ထားသော Status Code များဖြင့် Client Application များသည် ချွတ်ယွင်းမှုများကို ခန့်မှန်းနိုင်သောပုံစံဖြင့် တုံ့ပြန်နိုင်ပါသည်။',
      sections: [
        {
          heading: 'HTTP Status Code Classes',
          heading_my: 'HTTP Status Code အမျိုးအစားများ',
          content: 'Codes are categorized into 5 numerical ranges:',
          content_my: 'Code များကို ဂဏန်းအပိုင်းအခြား ၅ ခုဖြင့် ခွဲခြားထားပါသည်:',
          bulletPoints: [
            '2xx (Success): 200 OK (Standard success), 201 Created (New resource created), 204 No Content (Successful deletion).',
            '4xx (Client Errors): 400 Bad Request (Malformed body), 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable Entity (Schema validation failed).',
            '5xx (Server Errors): 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout.'
          ],
          bulletPoints_my: [
            '2xx (အောင်မြင်): 200 OK (စံ အောင်မြင်မှု), 201 Created (Resource အသစ် ဖန်တီးပြီး), 204 No Content (ဖျက်ခြင်း အောင်မြင်)။',
            '4xx (Client အမှား): 400 Bad Request (ပုံစံမမှန်သော Body), 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable Entity (Schema စစ်ဆေးမှု မအောင်မြင်)။',
            '5xx (Server အမှား): 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout။'
          ]
        },
        {
          heading: 'Structured RFC 7807 Error Responses',
          heading_my: 'RFC 7807 ပုံစံတကျ အမှား တုံ့ပြန်မှုများ',
          content: 'Modern APIs return uniform JSON error objects so frontend apps can display meaningful user messages:',
          content_my: 'ခေတ်မီ API များသည် Frontend App များတွင် အသုံးပြုသူအတွက် အဓိပ္ပါယ်ရှိသော မက်ဆေ့ဂျ်များ ပြသနိုင်ရန် ပုံစံတကျ JSON Error object များကို ပြန်လည်ပေးပို့ပါသည်:',
          codeSnippet: {
            language: 'json',
            code: `{\n  "success": false,\n  "statusCode": 404,\n  "error": "Not Found",\n  "message": "Product with ID prod_unknown not found in catalog.",\n  "timestamp": "2026-09-02T14:30:00.000Z"\n}`
          }
        }
      ]
    },
    exercise: {
      title: 'Diagnose 404 Resource Not Found',
      title_my: '404 Resource ရှာမတွေ့ အမှားကို စစ်ဆေးခြင်း',
      goal: 'Observe how the API handles a non-existent resource ID',
      goal_my: 'API သည် မရှိသော Resource ID ကို မည်သို့ ကိုင်တွယ်သည်ကို လေ့လာပါ',
      description: 'Send a GET request for an invalid product ID (/api/v1/products/prod_not_found) and inspect the structured 404 error payload.',
      description_my: 'မှားယွင်းသော Product ID (/api/v1/products/prod_not_found) အတွက် GET Request ပို့ပြီး ပုံစံတကျ 404 Error ဒေတာကို စစ်ဆေးပါ။',
      method: 'GET',
      path: '/api/v1/products/not_found',
      authRequired: false,
      explanationNote: 'The server returns HTTP 404 with a structured error message rather than crashing or returning an empty 200 OK.',
      explanationNote_my: 'Server သည် ပျက်ကျခြင်း သို့မဟုတ် ဗလာ 200 OK ပြန်ပေးခြင်း အစား ပုံစံတကျ အမှား မက်ဆေ့ဂျ်နှင့်အတူ HTTP 404 ကို ပြန်လည်ပေးပို့ပါသည်။'
    },
    quiz: {
      title: 'Status Codes Quiz',
      title_my: 'Status Code ဉာဏ်စမ်း',
      questions: [
        {
          id: 'q4-1',
          question: 'Which status code indicates a new resource was successfully created on the server?',
          question_my: 'Server ပေါ်တွင် Resource အသစ်တစ်ခု အောင်မြင်စွာ ဖန်တီးပြီးကြောင်း မည်သည့် Status Code က ဖော်ပြပါသနည်း?',
          options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
          options_my: ['200 OK', '201 Created', '204 No Content', '302 Found'],
          correctIndex: 1,
          explanation: '201 Created is the standard response for successful POST creation operations.',
          explanation_my: '201 Created သည် POST ဖြင့် အောင်မြင်စွာ ဖန်တီးခြင်း လုပ်ဆောင်ချက်များအတွက် စံ Response ဖြစ်ပါသည်။'
        },
        {
          id: 'q4-2',
          question: 'What status code should be returned when a request payload fails schema validation (e.g. price is negative)?',
          question_my: 'Request ဒေတာသည် Schema စစ်ဆေးမှု မအောင်မြင်သောအခါ (ဥပမာ - ဈေးနှုန်း အနုတ်လက္ခဏာ ဖြစ်နေခြင်း) မည်သည့် Status Code ကို ပြန်ပေးပို့သင့်ပါသနည်း?',
          options: ['404 Not Found', '422 Unprocessable Entity / 400 Bad Request', '500 Internal Error', '401 Unauthorized'],
          options_my: ['404 Not Found', '422 Unprocessable Entity / 400 Bad Request', '500 Internal Error', '401 Unauthorized'],
          correctIndex: 1,
          explanation: '422 or 400 communicates that the request syntax was valid JSON, but the semantic data failed validation.',
          explanation_my: '422 သို့မဟုတ် 400 သည် Request ၏ JSON ပုံစံ မှန်ကန်သော်လည်း ဒေတာ၏ အဓိပ္ပါယ်ဆိုင်ရာ စစ်ဆေးမှု မအောင်မြင်ကြောင်း ဖော်ပြပါသည်။'
        },
        {
          id: 'q4-3',
          question: 'What is the primary difference between a 4xx code and a 5xx code?',
          question_my: '4xx Code နှင့် 5xx Code အကြား အဓိက ကွာခြားချက်မှာ အဘယ်နည်း?',
          options: [
            '4xx means the client made an error; 5xx means the server encountered a failure',
            '4xx codes are faster than 5xx codes',
            '5xx codes only occur in mobile apps',
            '4xx codes are deprecated'
          ],
          options_my: [
            '4xx သည် Client ဘက်မှ အမှားဖြစ်ခြင်း၊ 5xx သည် Server ဘက်မှ ချွတ်ယွင်းမှု ဖြစ်ခြင်း',
            '4xx Code များသည် 5xx Code များထက် ပိုမြန်သည်',
            '5xx Code များသည် မိုဘိုင်း App များတွင်သာ ဖြစ်ပေါ်သည်',
            '4xx Code များသည် ခေတ်မမီတော့ပါ (deprecated)'
          ],
          correctIndex: 0,
          explanation: '4xx errors are client-side (bad params, auth missing, not found), while 5xx errors represent unhandled server or infrastructure crashes.',
          explanation_my: '4xx အမှားများသည် Client ဘက်ကြောင့် ဖြစ်ပါသည် (ပါရာမီတာ မှား၊ Auth မပါ၊ ရှာမတွေ့)။ 5xx အမှားများသည် Server သို့မဟုတ် အခြေခံအဆောက်အအုံ ပျက်ကျခြင်းကို ကိုယ်စားပြုပါသည်။'
        }
      ]
    }
  },
  {
    id: 'cart-checkout-workflow',
    moduleNum: 5,
    title: 'E-Commerce State: Cart to Order Checkout',
    title_my: 'အီးကောမတ်စ် အခြေအနေ: ခြင်းတောင်းမှ အမှာစာ Checkout',
    subtitle: 'Trace the complete transaction pipeline from active cart to order state transitions.',
    subtitle_my: 'ခြင်းတောင်းမှ အမှာစာ အခြေအနေ ပြောင်းလဲခြင်းအထိ ပြည့်စုံသော ငွေပေးချေမှုလုပ်ငန်းစဉ်ကို အဆင့်ဆင့် လေ့လာပါ။',
    icon: '🛒',
    durationMin: 15,
    theory: {
      summary: 'In an e-commerce platform, complex multi-step transactions require maintaining active shopping cart state and executing atomic order checkouts.',
      summary_my: 'အီးကောမတ်စ် ပလက်ဖောင်းတစ်ခုတွင် ရှုပ်ထွေးသော အဆင့်များစွာပါဝင်သည့် ငွေပေးချေမှုလုပ်ငန်းစဉ်များအတွက် ခြင်းတောင်း အခြေအနေကို ထိန်းသိမ်းပြီး atomic order checkout များ ဆောင်ရွက်ရန် လိုအပ်ပါသည်။',
      sections: [
        {
          heading: 'Shopping Cart Lifecycle',
          heading_my: 'ခြင်းတောင်း၏ ဘဝသံသရာ',
          content: 'The shopping cart represents dynamic, short-lived client state before committing to a purchase:',
          content_my: 'ခြင်းတောင်းသည် ဝယ်ယူမှု အတည်ပြုခြင်း မပြုမီ Client ၏ ကာလတို ပြောင်းလဲနေသော အခြေအနေကို ကိုယ်စားပြုပါသည်:',
          bulletPoints: [
            'GET /api/v1/cart: Retrieves active line items, item counts, subtotal, taxes, and shipping.',
            'POST /api/v1/cart/items: Appends a product to the cart with quantity.',
            'PUT /api/v1/cart/items/:itemId: Adjusts item quantities or removes item if quantity reaches 0.',
            'DELETE /api/v1/cart: Empties the cart upon checkout or user clear.'
          ],
          bulletPoints_my: [
            'GET /api/v1/cart: ခြင်းတောင်းရှိ ပစ္စည်းများ၊ အရေအတွက်၊ ကြားစုစုပေါင်း၊ အခွန်နှင့် ပို့ဆောင်ခတို့ကို ရယူပါသည်။',
            'POST /api/v1/cart/items: ခြင်းတောင်းထဲသို့ ကုန်ပစ္စည်းကို အရေအတွက်နှင့်အတူ ထည့်သွင်းပါသည်။',
            'PUT /api/v1/cart/items/:itemId: ပစ္စည်း အရေအတွက်ကို ချိန်ညှိခြင်း သို့မဟုတ် အရေအတွက် ၀ ရောက်ပါက ဖယ်ရှားပါသည်။',
            'DELETE /api/v1/cart: Checkout ပြုလုပ်ခြင်း သို့မဟုတ် အသုံးပြုသူ ရှင်းလင်းခြင်းတွင် ခြင်းတောင်းကို အလုံးစုံ ရှင်းလင်းပါသည်။'
          ]
        },
        {
          heading: 'Order State Machine Transitions',
          heading_my: 'အမှာစာ အခြေအနေ ပြောင်းလဲမှု စက်ဝိုင်း',
          content: 'Once placed, an order transitions through deterministic states: pending ➔ processing ➔ shipped ➔ delivered (or cancelled).',
          content_my: 'အမှာစာ တင်ပြီးသည်နှင့် သတ်မှတ်ထားသော အခြေအနေများမှတစ်ဆင့် ပြောင်းလဲသွားပါသည်: pending (စောင့်ဆိုင်း) ➔ processing (လုပ်ဆောင်နေ) ➔ shipped (ပို့ဆောင်ပြီး) ➔ delivered (ပို့အပ်ပြီး) (သို့မဟုတ် cancelled ပယ်ဖျက်)။',
          codeSnippet: {
            language: 'json',
            code: `{\n  "order_number": "ORD-2026-01001",\n  "status": "processing",\n  "total_amount": 349.99,\n  "shipping_address_id": "addr_1"\n}`
          }
        }
      ]
    },
    exercise: {
      title: 'Inspect Active Shopping Cart State',
      title_my: 'ခြင်းတောင်း အခြေအနေကို စစ်ဆေးခြင်း',
      goal: 'Retrieve the active customer cart with computed line subtotals and tax',
      goal_my: 'ဝယ်ယူသူ၏ လက်ရှိ ခြင်းတောင်းကို ကြားစုစုပေါင်းနှင့် အခွန်တွက်ချက်မှုများနှင့်အတူ ရယူပါ',
      description: 'Execute GET /api/v1/cart to view the current cart contents, total items count, subtotal, and computed grand total.',
      description_my: 'GET /api/v1/cart ကို ခေါ်ဆို၍ လက်ရှိ ခြင်းတောင်းရှိ ပစ္စည်းများ၊ စုစုပေါင်း အရေအတွက်၊ ကြားစုစုပေါင်းနှင့် ပေါင်းချုပ် စုစုပေါင်း ငွေကြေးကို ကြည့်ရှုပါ။',
      method: 'GET',
      path: '/api/v1/cart',
      authRequired: true,
      defaultHeaders: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.customer-token'
      },
      explanationNote: 'Notice how the server calculates line item subtotals, tax rate (8.25%), flat shipping ($15.00), and grand total.',
      explanationNote_my: 'Server သည် ပစ္စည်းတစ်ခုချင်း ကြားစုစုပေါင်း၊ အခွန်နှုန်း (8.25%)၊ ပို့ဆောင်ခ ($15.00) နှင့် ပေါင်းချုပ် စုစုပေါင်းတို့ကို မည်သို့ တွက်ချက်သည်ကို သတိပြုပါ။'
    },
    quiz: {
      title: 'Cart & Checkout Quiz',
      title_my: 'ခြင်းတောင်းနှင့် Checkout ဉာဏ်စမ်း',
      questions: [
        {
          id: 'q5-1',
          question: 'What typically happens to the active shopping cart after a successful order checkout?',
          question_my: 'အမှာစာ Checkout အောင်မြင်ပြီးနောက် ခြင်းတောင်းတွင် ပုံမှန်အားဖြင့် အဘယ်သို့ ဖြစ်ပါသနည်း?',
          options: [
            'The cart is locked and converted or cleared for the next shopping session',
            'All products are deleted from the database',
            'The customer account is deleted',
            'The cart is duplicated 5 times'
          ],
          options_my: [
            'ခြင်းတောင်းကို လော့ခ်ပြုလုပ်ပြီး ပြောင်းလဲခြင်း သို့မဟုတ် နောက်ဝယ်ယူမှုအတွက် ရှင်းလင်းပါသည်',
            'ကုန်ပစ္စည်းအားလုံးကို Database မှ ဖျက်ပစ်ပါသည်',
            'ဝယ်ယူသူ အကောင့်ကို ဖျက်ပစ်ပါသည်',
            'ခြင်းတောင်းကို ၅ ကြိမ် ပွားပါသည်'
          ],
          correctIndex: 0,
          explanation: 'Checkout finalizes the order into an immutable record and resets the active cart.',
          explanation_my: 'Checkout သည် အမှာစာကို ပြင်ဆင်၍ မရသော မှတ်တမ်းအဖြစ် အတည်ပြုပြီး ခြင်းတောင်းကို ပြန်လည် သတ်မှတ်ပါသည်။'
        },
        {
          id: 'q5-2',
          question: 'Which HTTP method is most appropriate for updating an existing line item quantity in a cart?',
          question_my: 'ခြင်းတောင်းရှိ ပစ္စည်း အရေအတွက်ကို ပြင်ဆင်ရန် မည်သည့် HTTP method အသင့်လျော်ဆုံး ဖြစ်ပါသနည်း?',
          options: ['GET', 'PUT or PATCH', 'POST', 'OPTIONS'],
          options_my: ['GET', 'PUT သို့မဟုတ် PATCH', 'POST', 'OPTIONS'],
          correctIndex: 1,
          explanation: 'PUT (or PATCH) is used to update existing resource state on the server.',
          explanation_my: 'PUT (သို့မဟုတ် PATCH) သည် Server ပေါ်ရှိ ရှိပြီးသား Resource ၏ အခြေအနေကို ပြင်ဆင်ရန် အသုံးပြုပါသည်။'
        },
        {
          id: 'q5-3',
          question: 'Why must financial calculations (subtotal, tax, discount) be computed on the server rather than trusted from the frontend?',
          question_my: 'ငွေကြေးဆိုင်ရာ တွက်ချက်မှုများ (ကြားစုစုပေါင်း၊ အခွန်၊ လျှော့ဈေး) ကို Frontend မှ ယုံကြည်ခြင်းအစား Server တွင် တွက်ချက်ရခြင်းသည် အဘယ်ကြောင့်နည်း?',
          options: [
            'To prevent malicious price manipulation and ensure accurate accounting',
            'Because JavaScript cannot do math',
            'To reduce CSS file size',
            'Browsers do not support currency formatting'
          ],
          options_my: [
            'ဈေးနှုန်း မသမာစွာ ပြောင်းလဲခြင်းကို ကာကွယ်ပြီး ငွေစာရင်း တိကျမှန်ကန်မှုကို သေချာစေရန်',
            'JavaScript သည် ဂဏန်းတွက်ချက်မှု ပြုလုပ်၍ မရသောကြောင့်',
            'CSS ဖိုင် အရွယ်အစားကို လျှော့ချရန်',
            'ဘရောက်ဆာများသည် ငွေကြေး ပုံစံချမှုကို ပံ့ပိုးမထောက်ပံ့သောကြောင့်'
          ],
          correctIndex: 0,
          explanation: 'Never trust client-supplied prices or discounts. Servers must recalculate totals against official database prices.',
          explanation_my: 'Client မှ ပေးပို့လာသော ဈေးနှုန်းများ သို့မဟုတ် လျှော့ဈေးများကို ဘယ်တော့မှ ယုံကြည်မပါနှင့်။ Server သည် တရားဝင် Database ဈေးနှုန်းများဖြင့် စုစုပေါင်းကို ပြန်လည် တွက်ချက်ရပါမည်။'
        }
      ]
    }
  },
  {
    id: 'rate-limiting-caching',
    moduleNum: 6,
    title: 'Rate Limiting, Caching & Best Practices',
    title_my: 'အသုံးပြုမှု ကန့်သတ်ချက်၊ Cache သိမ်းဆည်းခြင်းနှင့် အကောင်းဆုံး အလေ့အကျင့်များ',
    subtitle: 'Build resilient client apps that respect rate limit quotas and optimize API consumption.',
    subtitle_my: 'Rate Limit ကန့်သတ်ချက်များကို လိုက်နာပြီး API အသုံးပြုမှုကို အကောင်းဆုံးဖြစ်အောင် ပြုလုပ်သော ခံနိုင်ရည်ရှိသည့် Client App များ တည်ဆောက်ပါ။',
    icon: '⚡',
    durationMin: 12,
    theory: {
      summary: 'High-availability REST APIs enforce rate limits to protect infrastructure from abuse and ensure consistent latency for all clients.',
      summary_my: 'High-availability REST API များသည် အခြေခံအဆောက်အအုံကို အလွဲသုံးစားမှုမှ ကာကွယ်ရန်နှင့် Client အားလုံးအတွက် တသမတ်တည်း ကြာချိန်ကို သေချာစေရန် Rate Limit များ သတ်မှတ်ထားပါသည်။',
      sections: [
        {
          heading: 'Standard Rate Limit Response Headers',
          heading_my: 'Rate Limit Response Header စံနှုန်းများ',
          content: 'APIs broadcast quota status with every HTTP response:',
          content_my: 'API များသည် HTTP Response တိုင်းတွင် Quota အခြေအနေကို ထုတ်လွှင့်ပြသပါသည်:',
          bulletPoints: [
            'X-RateLimit-Limit: Total requests allowed within the sliding time window (e.g. 100).',
            'X-RateLimit-Remaining: Requests left in the current window before throttling.',
            'Retry-After: Seconds the client must wait before making another request when throttled (HTTP 429).'
          ],
          bulletPoints_my: [
            'X-RateLimit-Limit: သတ်မှတ်ချိန် အပိုင်းအခြားအတွင်း ခွင့်ပြုထားသော စုစုပေါင်း Request အရေအတွက် (ဥပမာ - ၁၀၀)။',
            'X-RateLimit-Remaining: ကန့်သတ်ချက် မထိမီ လက်ရှိ အပိုင်းအခြားအတွင်း ကျန်ရှိနေသေးသော Request အရေအတွက်။',
            'Retry-After: ကန့်သတ်ခံရပါက (HTTP 429) ထပ်မံ Request မပို့မီ Client စောင့်ဆိုင်းရမည့် စက္ကန့်။'
          ]
        },
        {
          heading: 'Handling HTTP 429 with Exponential Backoff',
          heading_my: 'Exponential Backoff ဖြင့် HTTP 429 ကို ကိုင်တွယ်ခြင်း',
          content: 'Resilient clients should automatically retry failed requests with progressive jitter:',
          content_my: 'ခံနိုင်ရည်ရှိသော Client များသည် ချွတ်ယွင်းသော Request များကို တစ်ဖြည်းဖြည်း တိုးလာသော ကြာချိန်ဖြင့် အလိုအလျောက် ပြန်လည်ကြိုးစားသင့်ပါသည်:',
          codeSnippet: {
            language: 'javascript',
            code: `async function fetchWithRetry(url, retries = 3) {\n  for (let i = 0; i < retries; i++) {\n    const res = await fetch(url);\n    if (res.status === 429) {\n      const wait = parseInt(res.headers.get('Retry-After') || '2', 10);\n      await new Promise(r => setTimeout(r, wait * 1000));\n      continue;\n    }\n    return res.json();\n  }\n}`
          }
        }
      ]
    },
    exercise: {
      title: 'Perform Full-Text Search with Latency Inspection',
      title_my: 'စာသား အပြည့်အစုံ ရှာဖွေခြင်းနှင့် ကြာချိန် စစ်ဆေးခြင်း',
      goal: 'Execute a fast catalog search and check response duration and rate headers',
      goal_my: 'မြန်ဆန်သော ကုန်ပစ္စည်းရှာဖွေမှု ပြုလုပ်ပြီး Response ကြာချိန်နှင့် Rate Header များကို စစ်ဆေးပါ',
      description: 'Execute GET /api/v1/search?q=sony to test full-text product matching and view execution latency metrics.',
      description_my: 'GET /api/v1/search?q=sony ကို ခေါ်ဆို၍ စာသား အပြည့်အစုံ ကုန်ပစ္စည်း တိုက်ဆိုင်စစ်ဆေးမှုနှင့် ကြာချိန် မက်ထရစ်များကို ကြည့်ရှုပါ။',
      method: 'GET',
      path: '/api/v1/search',
      authRequired: false,
      defaultQueryParams: {
        q: 'sony'
      },
      explanationNote: 'Search queries leverage cached indexes to return ultra-fast sub-50ms responses.',
      explanationNote_my: 'ရှာဖွေမှု Query များသည် Cache သိမ်းထားသော Index များကို အသုံးပြု၍ ၅၀ms အောက် အလွန်မြန်ဆန်သော တုံ့ပြန်မှုများ ပြန်လည်ပေးပို့ပါသည်။'
    },
    quiz: {
      title: 'Rate Limiting Quiz',
      title_my: 'Rate Limiting ဉာဏ်စမ်း',
      questions: [
        {
          id: 'q6-1',
          question: 'What HTTP status code is returned when a client exceeds the allowed request quota?',
          question_my: 'Client တစ်ဦးသည် ခွင့်ပြုထားသော Request ကန့်သတ်ချက်ကို ကျော်လွန်သောအခါ မည်သည့် HTTP Status Code ကို ပြန်ပေးပို့ပါသနည်း?',
          options: ['400 Bad Request', '404 Not Found', '429 Too Many Requests', '503 Unavailable'],
          options_my: ['400 Bad Request', '404 Not Found', '429 Too Many Requests', '503 Unavailable'],
          correctIndex: 2,
          explanation: 'HTTP 429 Too Many Requests indicates the rate limit window has been saturated.',
          explanation_my: 'HTTP 429 Too Many Requests သည် Rate Limit အပိုင်းအခြားရှိ ကန့်သတ်ချက်ကို ပြည့်မီသွားပြီဖြစ်ကြောင်း ဖော်ပြပါသည်။'
        },
        {
          id: 'q6-2',
          question: 'Which HTTP header tells the client how many seconds to wait before retrying after a 429 error?',
          question_my: '429 Error ရရှိပြီးနောက် ပြန်လည်ကြိုးစားရန် မည်မျှ စောင့်ဆိုင်းရမည်ကို Client အား မည်သည့် HTTP Header က ပြောပြပါသနည်း?',
          options: ['Retry-After', 'X-Wait-Time', 'X-Cooldown', 'RateLimit-Delay'],
          options_my: ['Retry-After', 'X-Wait-Time', 'X-Cooldown', 'RateLimit-Delay'],
          correctIndex: 0,
          explanation: 'The standard "Retry-After" header specifies the wait duration in seconds.',
          explanation_my: '"Retry-After" Header စံနှုန်းသည် စောင့်ဆိုင်းရမည့် ကြာချိန်ကို စက္ကန့်ဖြင့် သတ်မှတ်ပေးပါသည်။'
        },
        {
          id: 'q6-3',
          question: 'What is the most effective client-side practice to reduce unnecessary API requests for static catalog data?',
          question_my: 'မပြောင်းလဲသော ကုန်ပစ္စည်းစာရင်း ဒေတာအတွက် မလိုအပ်သော API Request များကို လျှော့ချရန် အထိရောက်ဆုံး Client-side အလေ့အကျင့်မှာ အဘယ်နည်း?',
          options: [
            'Client-side caching in localStorage / memory cache',
            'Sending 5 requests at the same time',
            'Disabling browser cookies',
            'Using HTTP POST instead of GET'
          ],
          options_my: [
            'localStorage / Memory Cache တွင် Client-side Caching ပြုလုပ်ခြင်း',
            'Request ၅ ခုကို တစ်ပြိုင်နက်တည်း ပို့ခြင်း',
            'ဘရောက်ဆာ Cookie များ ပိတ်ခြင်း',
            'GET အစား HTTP POST အသုံးပြုခြင်း'
          ],
          correctIndex: 0,
          explanation: 'Caching static resources (categories, country lists, product metadata) dramatically cuts down redundant API traffic.',
          explanation_my: 'မပြောင်းလဲသော Resource များ (ကဏ္ဍများ၊ နိုင်ငံစာရင်းများ၊ ကုန်ပစ္စည်း metadata) ကို Cache သိမ်းဆည်းခြင်းသည် မလိုအပ်သော API Traffic ကို သိသိသာသာ လျှော့ချပေးပါသည်။'
        }
      ]
    }
  }
];
