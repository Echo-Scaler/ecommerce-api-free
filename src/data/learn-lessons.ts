export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearnLesson {
  id: string;
  moduleNum: number;
  title: string;
  subtitle: string;
  icon: string;
  durationMin: number;
  theory: {
    summary: string;
    sections: {
      heading: string;
      content: string;
      codeSnippet?: {
        language: string;
        code: string;
      };
      bulletPoints?: string[];
      callout?: {
        type: 'info' | 'tip' | 'warning';
        text: string;
      };
    }[];
  };
  exercise: {
    title: string;
    goal: string;
    description: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    authRequired: boolean;
    defaultHeaders?: Record<string, string>;
    defaultQueryParams?: Record<string, string>;
    defaultBody?: Record<string, any>;
    explanationNote: string;
  };
  quiz: {
    title: string;
    questions: QuizQuestion[];
  };
}

export const LEARN_LESSONS: LearnLesson[] = [
  {
    id: 'intro-rest-http',
    moduleNum: 1,
    title: 'Introduction to REST & HTTP Methods',
    subtitle: 'Master REST architectural constraints, resource URIs, and standard HTTP verbs.',
    icon: '📡',
    durationMin: 10,
    theory: {
      summary: 'REST (Representational State Transfer) is a stateless software architecture designed for distributed hypermedia systems. Clients and servers communicate using standard HTTP protocols and structured data payloads.',
      sections: [
        {
          heading: 'Core Principles of RESTful APIs',
          content: 'In a RESTful design, every entity is treated as a distinct "Resource" identified by a clean, deterministic URI (Uniform Resource Identifier).',
          bulletPoints: [
            'Resource-Oriented: Plural nouns are used for collections (e.g. /api/v1/products, /api/v1/orders).',
            'Statelessness: Every client request must contain all credentials and context needed for processing.',
            'Uniform Interface: Standardized HTTP verbs define the intended action on the resource.',
            'JSON Payloads: Structured JSON is the modern standard for request and response payloads.'
          ]
        },
        {
          heading: 'Standard HTTP Verbs & Idempotency',
          content: 'HTTP methods convey the exact operation performed on the resource:',
          bulletPoints: [
            'GET: Safe & Idempotent. Retrieves a resource or collection without modifying server state.',
            'POST: Non-Idempotent. Creates a new resource or triggers an action (e.g. placing an order).',
            'PUT: Idempotent. Replaces an existing resource entirely with the provided payload.',
            'PATCH: Idempotent. Partially updates specific fields of an existing resource.',
            'DELETE: Idempotent. Removes a resource from the server catalog.'
          ],
          callout: {
            type: 'tip',
            text: 'An idempotent operation produces the exact same result on the server whether executed once or ten times.'
          }
        }
      ]
    },
    exercise: {
      title: 'Fetch Public Catalog Products',
      goal: 'Execute a GET request to list products with a limit parameter',
      description: 'Send a GET request to the public /api/v1/products endpoint to retrieve products from the catalog. Observe the JSON structure and response latency.',
      method: 'GET',
      path: '/api/v1/products',
      authRequired: false,
      defaultQueryParams: {
        page: '1',
        limit: '10'
      },
      explanationNote: 'Notice that GET requests do not require a request body and return HTTP 200 OK along with pagination metadata.'
    },
    quiz: {
      title: 'REST Fundamentals Quiz',
      questions: [
        {
          id: 'q1-1',
          question: 'Which HTTP method should be used to retrieve data without altering server state?',
          options: ['POST', 'GET', 'DELETE', 'PATCH'],
          correctIndex: 1,
          explanation: 'GET is a safe, read-only method designed strictly for fetching resources.'
        },
        {
          id: 'q1-2',
          question: 'What does "Idempotency" mean in REST APIs?',
          options: [
            'The request will always run in under 50ms',
            'Making multiple identical requests produces the same server state as a single request',
            'The request requires an SSL certificate',
            'The API endpoint only accepts JSON data'
          ],
          correctIndex: 1,
          explanation: 'Idempotent methods (GET, PUT, DELETE) guarantee that repeated identical executions leave the server in the same state.'
        },
        {
          id: 'q1-3',
          question: 'Which of the following is a RESTful resource URI pattern for accessing an order with ID 42?',
          options: [
            '/api/v1/getOrder?id=42',
            '/api/v1/orders/42',
            '/api/v1/execute_order_read/42',
            '/api/v1/query/orders?action=fetch&id=42'
          ],
          correctIndex: 1,
          explanation: 'REST uses clean noun-based paths (/orders/:id) rather than RPC-style action verbs in the URI.'
        }
      ]
    }
  },
  {
    id: 'auth-bearer-tokens',
    moduleNum: 2,
    title: 'Bearer Token Authentication & Roles',
    subtitle: 'Learn JSON Web Token (JWT) authorization headers and role-based access control.',
    icon: '🔐',
    durationMin: 12,
    theory: {
      summary: 'Securing API endpoints requires authenticating the client identity and authorizing privileges. In REST APIs, the Bearer Token scheme is the industry standard for transmitting JWTs in the HTTP Authorization header.',
      sections: [
        {
          heading: 'The Authorization Header Format',
          content: 'Bearer authentication involves passing a cryptographically signed token in the HTTP request headers:',
          codeSnippet: {
            language: 'http',
            code: `GET /api/v1/orders HTTP/1.1\nHost: api.ecommerce.example.com\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\nAccept: application/json`
          }
        },
        {
          heading: '401 Unauthorized vs. 403 Forbidden',
          content: 'Distinguishing between authentication and authorization is critical for proper API client design:',
          bulletPoints: [
            '401 Unauthorized: The request lacks valid authentication credentials. The client is anonymous or the token has expired.',
            '403 Forbidden: The client is successfully authenticated, but lacks sufficient permissions (e.g. a Customer attempting an Admin-only inventory update).'
          ],
          callout: {
            type: 'warning',
            text: 'Never expose API secret keys or user passwords in URL query parameters. Always transmit credentials via headers over HTTPS.'
          }
        }
      ]
    },
    exercise: {
      title: 'Verify Authenticated Session Identity',
      goal: 'Inspect user session and permissions using a Bearer token',
      description: 'Execute GET /api/v1/auth/me with an active Bearer token to decode token claims, user roles, and verified identity.',
      method: 'GET',
      path: '/api/v1/auth/me',
      authRequired: true,
      defaultHeaders: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.customer-token'
      },
      explanationNote: 'When an Authorization header is included, the API server decodes the JWT and returns the authenticated user context.'
    },
    quiz: {
      title: 'Authentication & Security Quiz',
      questions: [
        {
          id: 'q2-1',
          question: 'In which HTTP header should Bearer JWT tokens be sent?',
          options: ['X-Auth-Token', 'Authentication', 'Authorization', 'Bearer-Key'],
          correctIndex: 2,
          explanation: 'Standard HTTP authorization uses the "Authorization" header formatted as "Bearer <token>".'
        },
        {
          id: 'q2-2',
          question: 'What HTTP status code should an API return when an authenticated Customer tries to delete an Admin-only resource?',
          options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found'],
          correctIndex: 2,
          explanation: '403 Forbidden indicates the server understands who you are, but refuses to grant access due to insufficient privileges.'
        },
        {
          id: 'q2-3',
          question: 'Why are Bearer tokens preferred over sending raw usernames and passwords with every request?',
          options: [
            'Bearer tokens are shorter than passwords',
            'Tokens are stateless, time-limited, and prevent storing raw passwords in client memory',
            'Servers cannot read passwords over HTTP',
            'Tokens make requests 10x faster'
          ],
          correctIndex: 1,
          explanation: 'JWT tokens encapsulate claims, expiry dates, and signature verification without exposing credentials.'
        }
      ]
    }
  },
  {
    id: 'query-params-pagination',
    moduleNum: 3,
    title: 'Query Parameters, Sorting & Pagination',
    subtitle: 'Filter large catalog datasets and paginate responses efficiently.',
    icon: '📊',
    durationMin: 15,
    theory: {
      summary: 'When API collections grow into thousands of items, pagination and sorting are mandatory to avoid network bottlenecks and server memory exhaustion.',
      sections: [
        {
          heading: 'Pagination Models in REST',
          content: 'Common pagination techniques include Offset-based and Cursor-based pagination:',
          bulletPoints: [
            'Offset/Page-based: Using page and limit query parameters (e.g. ?page=2&limit=20). Easy to navigate directly to arbitrary pages.',
            'Cursor-based: Using an opaque pointer (e.g. ?cursor=prod_901a8f&limit=20). High performance for real-time appending streams.'
          ]
        },
        {
          heading: 'Multi-Parameter Filtering & Sorting Syntax',
          content: 'Query parameters allow clients to tailor results precisely without server schema alterations:',
          codeSnippet: {
            language: 'http',
            code: `GET /api/v1/products?category_id=cat_1&sort=price:asc&page=1&limit=10 HTTP/1.1\nAccept: application/json`
          },
          callout: {
            type: 'info',
            text: 'Always provide sensible server defaults (e.g. page=1, limit=20, maxLimit=50) to safeguard server performance.'
          }
        }
      ]
    },
    exercise: {
      title: 'Paginate & Sort Catalog by Price',
      goal: 'Retrieve 10 products sorted in ascending price order',
      description: 'Send a GET request to /api/v1/products with page=1, limit=10, and sort=price:asc to verify sorting and pagination metadata.',
      method: 'GET',
      path: '/api/v1/products',
      authRequired: false,
      defaultQueryParams: {
        page: '1',
        limit: '10',
        sort: 'price:asc'
      },
      explanationNote: 'Observe the response pagination object containing total items, current page, limit, and totalPages.'
    },
    quiz: {
      title: 'Pagination & Querying Quiz',
      questions: [
        {
          id: 'q3-1',
          question: 'If an API has 50 total products and the client requests limit=10, how many totalPages are available?',
          options: ['1', '5', '10', '50'],
          correctIndex: 1,
          explanation: 'Math.ceil(50 / 10) = 5 total pages.'
        },
        {
          id: 'q3-2',
          question: 'Which query string correctly requests the 3rd page with 20 items per page?',
          options: ['?offset=3&page=20', '?page=3&limit=20', '?page_size=3&items=20', '?limit=3&page=20'],
          correctIndex: 1,
          explanation: '?page=3&limit=20 specifies page number 3 and a window size of 20 items.'
        },
        {
          id: 'q3-3',
          question: 'Why should an API enforce a maximum limit on pagination parameters?',
          options: [
            'To prevent denial-of-service and extreme database memory allocation',
            'Because JSON cannot format more than 50 items',
            'To force clients to write more code',
            'Browsers do not support large responses'
          ],
          correctIndex: 0,
          explanation: 'Uncapped pagination limits allow clients to request millions of records at once, causing severe database and memory strain.'
        }
      ]
    }
  },
  {
    id: 'status-codes-errors',
    moduleNum: 4,
    title: 'HTTP Status Codes & Error Diagnostics',
    subtitle: 'Understand 2xx, 4xx, and 5xx response codes and structured error handling.',
    icon: '🛠',
    durationMin: 12,
    theory: {
      summary: 'HTTP response status codes indicate whether an HTTP request has been successfully completed. Standardized status codes allow client applications to react predictably to failures.',
      sections: [
        {
          heading: 'HTTP Status Code Classes',
          content: 'Codes are categorized into 5 numerical ranges:',
          bulletPoints: [
            '2xx (Success): 200 OK (Standard success), 201 Created (New resource created), 204 No Content (Successful deletion).',
            '4xx (Client Errors): 400 Bad Request (Malformed body), 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable Entity (Schema validation failed).',
            '5xx (Server Errors): 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout.'
          ]
        },
        {
          heading: 'Structured RFC 7807 Error Responses',
          content: 'Modern APIs return uniform JSON error objects so frontend apps can display meaningful user messages:',
          codeSnippet: {
            language: 'json',
            code: `{\n  "success": false,\n  "statusCode": 404,\n  "error": "Not Found",\n  "message": "Product with ID prod_unknown not found in catalog.",\n  "timestamp": "2026-09-02T14:30:00.000Z"\n}`
          }
        }
      ]
    },
    exercise: {
      title: 'Diagnose 404 Resource Not Found',
      goal: 'Observe how the API handles a non-existent resource ID',
      description: 'Send a GET request for an invalid product ID (/api/v1/products/prod_not_found) and inspect the structured 404 error payload.',
      method: 'GET',
      path: '/api/v1/products/not_found',
      authRequired: false,
      explanationNote: 'The server returns HTTP 404 with a structured error message rather than crashing or returning an empty 200 OK.'
    },
    quiz: {
      title: 'Status Codes Quiz',
      questions: [
        {
          id: 'q4-1',
          question: 'Which status code indicates a new resource was successfully created on the server?',
          options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
          correctIndex: 1,
          explanation: '201 Created is the standard response for successful POST creation operations.'
        },
        {
          id: 'q4-2',
          question: 'What status code should be returned when a request payload fails schema validation (e.g. price is negative)?',
          options: ['404 Not Found', '422 Unprocessable Entity / 400 Bad Request', '500 Internal Error', '401 Unauthorized'],
          correctIndex: 1,
          explanation: '422 or 400 communicates that the request syntax was valid JSON, but the semantic data failed validation.'
        },
        {
          id: 'q4-3',
          question: 'What is the primary difference between a 4xx code and a 5xx code?',
          options: [
            '4xx means the client made an error; 5xx means the server encountered a failure',
            '4xx codes are faster than 5xx codes',
            '5xx codes only occur in mobile apps',
            '4xx codes are deprecated'
          ],
          correctIndex: 0,
          explanation: '4xx errors are client-side (bad params, auth missing, not found), while 5xx errors represent unhandled server or infrastructure crashes.'
        }
      ]
    }
  },
  {
    id: 'cart-checkout-workflow',
    moduleNum: 5,
    title: 'E-Commerce State: Cart to Order Checkout',
    subtitle: 'Trace the complete transaction pipeline from active cart to order state transitions.',
    icon: '🛒',
    durationMin: 15,
    theory: {
      summary: 'In an e-commerce platform, complex multi-step transactions require maintaining active shopping cart state and executing atomic order checkouts.',
      sections: [
        {
          heading: 'Shopping Cart Lifecycle',
          content: 'The shopping cart represents dynamic, short-lived client state before committing to a purchase:',
          bulletPoints: [
            'GET /api/v1/cart: Retrieves active line items, item counts, subtotal, taxes, and shipping.',
            'POST /api/v1/cart/items: Appends a product to the cart with quantity.',
            'PUT /api/v1/cart/items/:itemId: Adjusts item quantities or removes item if quantity reaches 0.',
            'DELETE /api/v1/cart: Empties the cart upon checkout or user clear.'
          ]
        },
        {
          heading: 'Order State Machine Transitions',
          content: 'Once placed, an order transitions through deterministic states: pending ➔ processing ➔ shipped ➔ delivered (or cancelled).',
          codeSnippet: {
            language: 'json',
            code: `{\n  "order_number": "ORD-2026-01001",\n  "status": "processing",\n  "total_amount": 349.99,\n  "shipping_address_id": "addr_1"\n}`
          }
        }
      ]
    },
    exercise: {
      title: 'Inspect Active Shopping Cart State',
      goal: 'Retrieve the active customer cart with computed line subtotals and tax',
      description: 'Execute GET /api/v1/cart to view the current cart contents, total items count, subtotal, and computed grand total.',
      method: 'GET',
      path: '/api/v1/cart',
      authRequired: true,
      defaultHeaders: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.customer-token'
      },
      explanationNote: 'Notice how the server calculates line item subtotals, tax rate (8.25%), flat shipping ($15.00), and grand total.'
    },
    quiz: {
      title: 'Cart & Checkout Quiz',
      questions: [
        {
          id: 'q5-1',
          question: 'What typically happens to the active shopping cart after a successful order checkout?',
          options: [
            'The cart is locked and converted or cleared for the next shopping session',
            'All products are deleted from the database',
            'The customer account is deleted',
            'The cart is duplicated 5 times'
          ],
          correctIndex: 0,
          explanation: 'Checkout finalizes the order into an immutable record and resets the active cart.'
        },
        {
          id: 'q5-2',
          question: 'Which HTTP method is most appropriate for updating an existing line item quantity in a cart?',
          options: ['GET', 'PUT or PATCH', 'POST', 'OPTIONS'],
          correctIndex: 1,
          explanation: 'PUT (or PATCH) is used to update existing resource state on the server.'
        },
        {
          id: 'q5-3',
          question: 'Why must financial calculations (subtotal, tax, discount) be computed on the server rather than trusted from the frontend?',
          options: [
            'To prevent malicious price manipulation and ensure accurate accounting',
            'Because JavaScript cannot do math',
            'To reduce CSS file size',
            'Browsers do not support currency formatting'
          ],
          correctIndex: 0,
          explanation: 'Never trust client-supplied prices or discounts. Servers must recalculate totals against official database prices.'
        }
      ]
    }
  },
  {
    id: 'rate-limiting-caching',
    moduleNum: 6,
    title: 'Rate Limiting, Caching & Best Practices',
    subtitle: 'Build resilient client apps that respect rate limit quotas and optimize API consumption.',
    icon: '⚡',
    durationMin: 12,
    theory: {
      summary: 'High-availability REST APIs enforce rate limits to protect infrastructure from abuse and ensure consistent latency for all clients.',
      sections: [
        {
          heading: 'Standard Rate Limit Response Headers',
          content: 'APIs broadcast quota status with every HTTP response:',
          bulletPoints: [
            'X-RateLimit-Limit: Total requests allowed within the sliding time window (e.g. 100).',
            'X-RateLimit-Remaining: Requests left in the current window before throttling.',
            'Retry-After: Seconds the client must wait before making another request when throttled (HTTP 429).'
          ]
        },
        {
          heading: 'Handling HTTP 429 with Exponential Backoff',
          content: 'Resilient clients should automatically retry failed requests with progressive jitter:',
          codeSnippet: {
            language: 'javascript',
            code: `async function fetchWithRetry(url, retries = 3) {\n  for (let i = 0; i < retries; i++) {\n    const res = await fetch(url);\n    if (res.status === 429) {\n      const wait = parseInt(res.headers.get('Retry-After') || '2', 10);\n      await new Promise(r => setTimeout(r, wait * 1000));\n      continue;\n    }\n    return res.json();\n  }\n}`
          }
        }
      ]
    },
    exercise: {
      title: 'Perform Full-Text Search with Latency Inspection',
      goal: 'Execute a fast catalog search and check response duration and rate headers',
      description: 'Execute GET /api/v1/search?q=sony to test full-text product matching and view execution latency metrics.',
      method: 'GET',
      path: '/api/v1/search',
      authRequired: false,
      defaultQueryParams: {
        q: 'sony'
      },
      explanationNote: 'Search queries leverage cached indexes to return ultra-fast sub-50ms responses.'
    },
    quiz: {
      title: 'Rate Limiting Quiz',
      questions: [
        {
          id: 'q6-1',
          question: 'What HTTP status code is returned when a client exceeds the allowed request quota?',
          options: ['400 Bad Request', '404 Not Found', '429 Too Many Requests', '503 Unavailable'],
          correctIndex: 2,
          explanation: 'HTTP 429 Too Many Requests indicates the rate limit window has been saturated.'
        },
        {
          id: 'q6-2',
          question: 'Which HTTP header tells the client how many seconds to wait before retrying after a 429 error?',
          options: ['Retry-After', 'X-Wait-Time', 'X-Cooldown', 'RateLimit-Delay'],
          correctIndex: 0,
          explanation: 'The standard "Retry-After" header specifies the wait duration in seconds.'
        },
        {
          id: 'q6-3',
          question: 'What is the most effective client-side practice to reduce unnecessary API requests for static catalog data?',
          options: [
            'Client-side caching in localStorage / memory cache',
            'Sending 5 requests at the same time',
            'Disabling browser cookies',
            'Using HTTP POST instead of GET'
          ],
          correctIndex: 0,
          explanation: 'Caching static resources (categories, country lists, product metadata) dramatically cuts down redundant API traffic.'
        }
      ]
    }
  }
];
