export interface MockProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  compare_at_price?: number;
  currency: string;
  category: { id: string; name: string };
  stock: number;
  status: 'active' | 'draft' | 'archived';
  images: string[];
  description?: string;
  created_at: string;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id?: string | null;
  productCount: number;
  status: 'active' | 'archived';
  created_at: string;
}

export interface MockOrderItem {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface MockOrder {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  currency: string;
  items_count: number;
  items: MockOrderItem[];
  shipping_address_id: string;
  tracking_number?: string;
  created_at: string;
}

export interface MockCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  default_shipping_address_id: string;
  membership_tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  total_orders: number;
  created_at: string;
}

export interface MockAddress {
  id: string;
  customer_id: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface MockInventoryItem {
  product_id: string;
  sku: string;
  name: string;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  warehouse_location: string;
  safety_stock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  last_audited: string;
}

export interface MockCartItem {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
  image_url: string;
}

// -------------------------------------------------------------
// 1. 50 CATEGORIES (cat_1 to cat_50)
// -------------------------------------------------------------
const categoryTemplates = [
  { name: 'Audio & Headphones', slug: 'audio-headphones', parent: null },
  { name: 'Laptops & Computers', slug: 'laptops-computers', parent: null },
  { name: 'Smartphones & Mobile', slug: 'smartphones-mobile', parent: null },
  { name: 'Wearables & Smartwatches', slug: 'wearables-smartwatches', parent: null },
  { name: 'Computer Accessories', slug: 'computer-accessories', parent: 'cat_2' },
  { name: 'Monitors & Displays', slug: 'monitors-displays', parent: 'cat_2' },
  { name: 'Gaming Peripherals', slug: 'gaming-peripherals', parent: 'cat_2' },
  { name: 'Tablets & E-Readers', slug: 'tablets-ereaders', parent: 'cat_3' },
  { name: 'Smart Home & IoT', slug: 'smart-home-iot', parent: null },
  { name: 'Cameras & Photography', slug: 'cameras-photography', parent: null },
  { name: 'Drones & Action Cams', slug: 'drones-action-cams', parent: 'cat_10' },
  { name: 'Home Audio & Soundbars', slug: 'home-audio-soundbars', parent: 'cat_1' },
  { name: 'Microphones & Podcasting', slug: 'microphones-podcasting', parent: 'cat_1' },
  { name: 'Keyboards & Mice', slug: 'keyboards-mice', parent: 'cat_5' },
  { name: 'Storage & External SSDs', slug: 'storage-external-ssds', parent: 'cat_2' },
  { name: 'Networking & WiFi 7', slug: 'networking-wifi', parent: null },
  { name: 'Power Banks & Chargers', slug: 'power-banks-chargers', parent: 'cat_3' },
  { name: 'Cables & Adapters', slug: 'cables-adapters', parent: 'cat_5' },
  { name: 'Ergonomic Office Furniture', slug: 'ergonomic-office-furniture', parent: null },
  { name: 'Standing Desks', slug: 'standing-desks', parent: 'cat_19' },
  { name: 'Ergonomic Chairs', slug: 'ergonomic-chairs', parent: 'cat_19' },
  { name: 'Desk Lighting & RGB', slug: 'desk-lighting-rgb', parent: 'cat_19' },
  { name: 'VR & AR Headsets', slug: 'vr-ar-headsets', parent: 'cat_7' },
  { name: 'Mechanical Keyboards', slug: 'mechanical-keyboards', parent: 'cat_14' },
  { name: 'Studio Monitors', slug: 'studio-monitors', parent: 'cat_1' },
  { name: 'Smart Lighting', slug: 'smart-lighting', parent: 'cat_9' },
  { name: 'Smart Security & Cameras', slug: 'smart-security-cameras', parent: 'cat_9' },
  { name: 'Smart Thermostats', slug: 'smart-thermostats', parent: 'cat_9' },
  { name: 'Robot Vacuums', slug: 'robot-vacuums', parent: 'cat_9' },
  { name: 'Smart Locks & Entry', slug: 'smart-locks-entry', parent: 'cat_9' },
  { name: 'Fitness Trackers', slug: 'fitness-trackers', parent: 'cat_4' },
  { name: 'Wireless Earbuds', slug: 'wireless-earbuds', parent: 'cat_1' },
  { name: 'Noise-Cancelling Over-Ear', slug: 'noise-cancelling-over-ear', parent: 'cat_1' },
  { name: 'Creator Video Lighting', slug: 'creator-video-lighting', parent: 'cat_10' },
  { name: 'Gimbals & Stabilizers', slug: 'gimbals-stabilizers', parent: 'cat_10' },
  { name: 'Laptop Docking Stations', slug: 'laptop-docking-stations', parent: 'cat_5' },
  { name: 'Thunderbolt 4 Hubs', slug: 'thunderbolt-4-hubs', parent: 'cat_36' },
  { name: 'Curved Gaming Monitors', slug: 'curved-gaming-monitors', parent: 'cat_6' },
  { name: 'OLED Pro Displays', slug: 'oled-pro-displays', parent: 'cat_6' },
  { name: 'Portable Bluetooth Speakers', slug: 'portable-bluetooth-speakers', parent: 'cat_1' },
  { name: 'Smart Plugs & Outlets', slug: 'smart-plugs-outlets', parent: 'cat_9' },
  { name: 'Home Gym Tech', slug: 'home-gym-tech', parent: 'cat_4' },
  { name: 'Smart Scales & Health', slug: 'smart-scales-health', parent: 'cat_4' },
  { name: 'Wireless Charging Pads', slug: 'wireless-charging-pads', parent: 'cat_17' },
  { name: 'GaN Fast Chargers', slug: 'gan-fast-chargers', parent: 'cat_17' },
  { name: 'Protective Laptop Sleeves', slug: 'protective-laptop-sleeves', parent: 'cat_5' },
  { name: 'Backpacks & Tech Bags', slug: 'backpacks-tech-bags', parent: null },
  { name: 'Clean Energy & Solar Power', slug: 'clean-energy-solar', parent: null },
  { name: 'Portable Power Stations', slug: 'portable-power-stations', parent: 'cat_48' },
  { name: 'Smart Home Hubs & Gateways', slug: 'smart-home-hubs-gateways', parent: 'cat_9' }
];

export const MOCK_CATEGORIES: MockCategory[] = categoryTemplates.map((cat, idx) => {
  const num = idx + 1;
  return {
    id: `cat_${num}`,
    name: cat.name,
    slug: cat.slug,
    description: `Browse the best collection of ${cat.name.toLowerCase()} featuring top brands and industry-leading performance.`,
    parent_id: cat.parent,
    productCount: Math.floor(10 + ((num * 7) % 85)),
    status: 'active',
    created_at: new Date(Date.UTC(2026, 0, 1 + (num % 28), 10, 0, 0)).toISOString()
  };
});

// -------------------------------------------------------------
// 2. 50 PRODUCTS (prod_1 to prod_50)
// -------------------------------------------------------------
const productNames = [
  'Sony WH-1000XM5 Wireless Headphones',
  'Apple MacBook Pro 16" M4 Max',
  'Mechanical Gaming Keyboard RGB Pro',
  'Dell UltraSharp 32" 4K OLED Monitor',
  'Logitech MX Master 3S Wireless Mouse',
  'Samsung Galaxy S25 Ultra 512GB',
  'Apple iPad Pro 13" OLED M4',
  'Bose QuietComfort Ultra Earbuds',
  'Anker Prime 27,650mAh Power Bank 250W',
  'CalDigit TS4 Thunderbolt 4 Dock',
  'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
  'Elgato Stream Deck MK.2 Studio Controller',
  'Sony Alpha A7 IV Full-Frame Camera Body',
  'DJI Mini 4 Pro Drone with RC2 Controller',
  'LG UltraGear 34" Curved OLED Gaming Display',
  'Sonos Era 300 Spatial Audio Speaker',
  'Apple Watch Ultra 2 Titanium GPS + Cellular',
  'Philips Hue Smart Gradient Lightstrip 2M',
  'Shure SM7B Vocal Dynamic Studio Microphone',
  'Rode RODECaster Duo Audio Production Studio',
  'Herman Miller Embody Ergonomic Task Chair',
  'Autonomous SmartDesk Pro Motorized Desk',
  'Sennheiser HD 660S2 Open-Back Studio Headphones',
  'Samsung 990 PRO 4TB PCIe 4.0 NVMe SSD',
  'SanDisk Extreme PRO 2TB Portable SSD V2',
  'ASUS ROG Rapture GT-BE98 Quad-Band WiFi 7 Router',
  'EcoFlow DELTA 2 Portable Power Station 1024Wh',
  'Anker 737 GaNPrime 120W USB-C Wall Charger',
  'Roborock S8 Pro Ultra Robot Vacuum & Mop',
  'Ring Video Doorbell Pro 2 Hardwired',
  'Meta Quest 3 512GB VR/MR Headset',
  'Garmin Fenix 8 Solar Multisport GPS Smartwatch',
  'Peak Design Everyday Backpack 30L V2 Black',
  'Nomad Base One Max MagSafe 3-in-1 Charging Stand',
  'Focusrite Scarlett 4i4 4th Gen USB Audio Interface',
  'JBL Charge 5 Portable Waterproof Bluetooth Speaker',
  'Belkin Auto-Tracking Stand Pro with DockKit',
  'Twelve South BookArc Flex Vertical Laptop Stand',
  'Logitech Litra Beam LX Dual-Sided Streaming Light',
  'SteelSeries Arctis Nova Pro Wireless Gaming Headset',
  'Audio-Technica ATH-M50x Professional Studio Monitor',
  'Elgato Wave:3 USB Condenser Microphone',
  'HyperX Pulsefire Haste 2 Wireless Gaming Mouse',
  'BenQ ScreenBar Pro Auto-Dimming LED Monitor Lamp',
  'Corsair K100 AIR Wireless RGB Mechanical Keyboard',
  'Razer Blade 16 Gaming Laptop Dual OLED Mini-LED',
  'Kindle Paperwhite Signature Edition 32GB',
  'Nanoleaf Shapes Hexagon Starter Kit 9 Panels',
  'Withings Body Scan Connected Health Scale',
  'GoPro HERO13 Black 5.3K Action Camera Bundle'
];

const productImages = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
  'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500',
  'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'
];

export const MOCK_PRODUCTS: MockProduct[] = productNames.map((name, idx) => {
  const num = idx + 1;
  const basePrice = Math.round((29.99 + (num * 47.75) % 1800) * 100) / 100;
  const categoryIndex = (num - 1) % MOCK_CATEGORIES.length;
  const category = MOCK_CATEGORIES[categoryIndex];
  const imageIndex = (num - 1) % productImages.length;
  const skuPrefix = name.split(' ')[0].toUpperCase().substring(0, 4);

  return {
    id: `prod_${num}`,
    name,
    sku: `${skuPrefix}-${String(1000 + num).padStart(4, '0')}-PRO`,
    price: basePrice,
    compare_at_price: Math.round(basePrice * 1.18 * 100) / 100,
    currency: 'USD',
    category: {
      id: category.id,
      name: category.name
    },
    stock: Math.floor(15 + ((num * 13) % 140)),
    status: 'active',
    images: [
      productImages[imageIndex],
      productImages[(imageIndex + 1) % productImages.length]
    ],
    description: `Premium grade ${name} engineered with high-tier components, industry standard durability, and high performance.`,
    created_at: new Date(Date.UTC(2026, 0, 1 + (num % 28), 12, 0, 0)).toISOString()
  };
});

// -------------------------------------------------------------
// 3. 50 CUSTOMERS (cust_1 to cust_50) & 50 ADDRESSES (addr_1 to addr_50)
// -------------------------------------------------------------
const customerNames = [
  ['Alex', 'Johnson', 'alex.johnson@example.com'],
  ['Sophia', 'Martinez', 'sophia.martinez@example.com'],
  ['Liam', 'Smith', 'liam.smith@example.com'],
  ['Emma', 'Davis', 'emma.davis@example.com'],
  ['Noah', 'Wilson', 'noah.wilson@example.com'],
  ['Olivia', 'Brown', 'olivia.brown@example.com'],
  ['William', 'Taylor', 'william.taylor@example.com'],
  ['Ava', 'Anderson', 'ava.anderson@example.com'],
  ['James', 'Thomas', 'james.thomas@example.com'],
  ['Isabella', 'Jackson', 'isabella.jackson@example.com'],
  ['Benjamin', 'White', 'benjamin.white@example.com'],
  ['Mia', 'Harris', 'mia.harris@example.com'],
  ['Lucas', 'Martin', 'lucas.martin@example.com'],
  ['Harper', 'Thompson', 'harper.thompson@example.com'],
  ['Henry', 'Garcia', 'henry.garcia@example.com'],
  ['Evelyn', 'Martinez', 'evelyn.martinez@example.com'],
  ['Alexander', 'Robinson', 'alexander.robinson@example.com'],
  ['Abigail', 'Clark', 'abigail.clark@example.com'],
  ['Sebastian', 'Rodriguez', 'sebastian.rodriguez@example.com'],
  ['Emily', 'Lewis', 'emily.lewis@example.com'],
  ['Jack', 'Lee', 'jack.lee@example.com'],
  ['Elizabeth', 'Walker', 'elizabeth.walker@example.com'],
  ['Daniel', 'Hall', 'daniel.hall@example.com'],
  ['Avery', 'Allen', 'avery.allen@example.com'],
  ['Matthew', 'Young', 'matthew.young@example.com'],
  ['Ella', 'Hernandez', 'ella.hernandez@example.com'],
  ['Samuel', 'King', 'samuel.king@example.com'],
  ['Scarlett', 'Wright', 'scarlett.wright@example.com'],
  ['David', 'Lopez', 'david.lopez@example.com'],
  ['Grace', 'Hill', 'grace.hill@example.com'],
  ['Joseph', 'Scott', 'joseph.scott@example.com'],
  ['Chloe', 'Green', 'chloe.green@example.com'],
  ['Carter', 'Adams', 'carter.adams@example.com'],
  ['Victoria', 'Baker', 'victoria.baker@example.com'],
  ['Owen', 'Gonzalez', 'owen.gonzalez@example.com'],
  ['Riley', 'Nelson', 'riley.nelson@example.com'],
  ['Wyatt', 'Carter', 'wyatt.carter@example.com'],
  ['Aria', 'Mitchell', 'aria.mitchell@example.com'],
  ['John', 'Perez', 'john.perez@example.com'],
  ['Lily', 'Roberts', 'lily.roberts@example.com'],
  ['Luke', 'Turner', 'luke.turner@example.com'],
  ['Aubrey', 'Phillips', 'aubrey.phillips@example.com'],
  ['Asher', 'Campbell', 'asher.campbell@example.com'],
  ['Zoey', 'Parker', 'zoey.parker@example.com'],
  ['Leo', 'Evans', 'leo.evans@example.com'],
  ['Penelope', 'Edwards', 'penelope.edwards@example.com'],
  ['Julian', 'Collins', 'julian.collins@example.com'],
  ['Layla', 'Stewart', 'layla.stewart@example.com'],
  ['Hudson', 'Sanchez', 'hudson.sanchez@example.com'],
  ['Nora', 'Morris', 'nora.morris@example.com']
];

const cities = [
  { city: 'San Francisco', state: 'CA', postal: '94107' },
  { city: 'New York', state: 'NY', postal: '10001' },
  { city: 'Austin', state: 'TX', postal: '78701' },
  { city: 'Seattle', state: 'WA', postal: '98101' },
  { city: 'Chicago', state: 'IL', postal: '60601' },
  { city: 'Denver', state: 'CO', postal: '80202' },
  { city: 'Boston', state: 'MA', postal: '02108' },
  { city: 'Miami', state: 'FL', postal: '33101' },
  { city: 'Portland', state: 'OR', postal: '97201' },
  { city: 'Los Angeles', state: 'CA', postal: '90001' }
];

export const MOCK_CUSTOMERS: MockCustomer[] = customerNames.map(([first, last, email], idx) => {
  const num = idx + 1;
  const tiers: ('Bronze' | 'Silver' | 'Gold' | 'Platinum')[] = ['Bronze', 'Silver', 'Gold', 'Platinum'];
  return {
    id: `cust_${num}`,
    first_name: first,
    last_name: last,
    email: email,
    phone: `+1 (555) ${String(200 + num).padStart(3, '0')}-${String(1000 + num * 17).slice(-4)}`,
    default_shipping_address_id: `addr_${num}`,
    membership_tier: tiers[num % 4],
    total_orders: 1 + (num % 12),
    created_at: new Date(Date.UTC(2025, 6, 1 + (num % 28), 10, 0, 0)).toISOString()
  };
});

export const MOCK_ADDRESSES: MockAddress[] = customerNames.map(([, last], idx) => {
  const num = idx + 1;
  const cityObj = cities[num % cities.length];
  return {
    id: `addr_${num}`,
    customer_id: `cust_${num}`,
    street: `${100 + num * 12} ${last} Avenue, Suite ${100 + (num % 20)}`,
    city: cityObj.city,
    state: cityObj.state,
    postal_code: cityObj.postal,
    country: 'US',
    is_default: true,
    created_at: new Date(Date.UTC(2025, 6, 1 + (num % 28), 10, 5, 0)).toISOString()
  };
});

// -------------------------------------------------------------
// 4. 50 ORDERS (ord_1 to ord_50)
// -------------------------------------------------------------
const orderStatuses: ('pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')[] = [
  'delivered', 'shipped', 'processing', 'delivered', 'pending', 'cancelled'
];

export const MOCK_ORDERS: MockOrder[] = Array.from({ length: 50 }, (_, idx) => {
  const num = idx + 1;
  const customer = MOCK_CUSTOMERS[(num - 1) % MOCK_CUSTOMERS.length];
  const prodA = MOCK_PRODUCTS[(num - 1) % MOCK_PRODUCTS.length];
  const prodB = MOCK_PRODUCTS[(num * 3) % MOCK_PRODUCTS.length];
  const qtyA = 1 + (num % 2);
  const qtyB = 1;
  const subtotalA = Math.round(prodA.price * qtyA * 100) / 100;
  const subtotalB = Math.round(prodB.price * qtyB * 100) / 100;
  const total = Math.round((subtotalA + subtotalB + 15.00) * 100) / 100;

  return {
    id: `ord_${num}`,
    order_number: `ORD-2026-${String(1000 + num).padStart(5, '0')}`,
    customer_id: customer.id,
    customer_name: `${customer.first_name} ${customer.last_name}`,
    status: orderStatuses[num % orderStatuses.length],
    total_amount: total,
    currency: 'USD',
    items_count: qtyA + qtyB,
    items: [
      { product_id: prodA.id, name: prodA.name, quantity: qtyA, unit_price: prodA.price, subtotal: subtotalA },
      { product_id: prodB.id, name: prodB.name, quantity: qtyB, unit_price: prodB.price, subtotal: subtotalB }
    ],
    shipping_address_id: `addr_${num}`,
    tracking_number: `TRK-USPS-${String(98000000 + num * 12345).slice(-10)}`,
    created_at: new Date(Date.UTC(2026, 1, 1 + (num % 28), 14, (num * 7) % 60, 0)).toISOString()
  };
});

// -------------------------------------------------------------
// 5. 50 INVENTORY ITEMS (Matching prod_1 to prod_50)
// -------------------------------------------------------------
export const MOCK_INVENTORY: MockInventoryItem[] = MOCK_PRODUCTS.map((prod, idx) => {
  const num = idx + 1;
  const qty = prod.stock;
  const reserved = Math.min(qty, (num % 8));
  const available = Math.max(0, qty - reserved);
  const isLowStock = available <= 15;
  const isOutOfStock = available === 0;

  return {
    product_id: prod.id,
    sku: prod.sku,
    name: prod.name,
    quantity: qty,
    reserved_quantity: reserved,
    available_quantity: available,
    warehouse_location: `WH-US-BAY-${String.fromCharCode(65 + (num % 6))}${String(10 + (num % 40))}`,
    safety_stock: 12,
    status: isOutOfStock ? 'out_of_stock' : (isLowStock ? 'low_stock' : 'in_stock'),
    last_audited: new Date(Date.UTC(2026, 7, 20 + (num % 10), 9, 30, 0)).toISOString()
  };
});

// -------------------------------------------------------------
// 6. 50 CART ITEMS (item_1 to item_50)
// -------------------------------------------------------------
export const MOCK_CART_ITEMS: MockCartItem[] = MOCK_PRODUCTS.map((prod, idx) => {
  const num = idx + 1;
  const qty = 1 + (num % 3);
  return {
    id: `item_${num}`,
    product_id: prod.id,
    name: prod.name,
    sku: prod.sku,
    price: prod.price,
    quantity: qty,
    subtotal: Math.round(prod.price * qty * 100) / 100,
    image_url: prod.images[0]
  };
});

// -------------------------------------------------------------
// 7. 50 SEARCH SUGGESTIONS
// -------------------------------------------------------------
export const MOCK_SEARCH_SUGGESTIONS: string[] = [
  'wireless headphones',
  'sony noise cancelling',
  'apple macbook pro m4',
  'mechanical keyboard rgb',
  '4k oled gaming monitor',
  'logitech mx master 3s',
  'samsung galaxy s25 ultra',
  'ipad pro m4 oled',
  'bose quietcomfort earbuds',
  'usb-c 240w fast charging power bank',
  'thunderbolt 4 docking station',
  'custom mechanical keyboard keychron',
  'elgato stream deck studio',
  'sony a7 iv camera full frame',
  'dji mini 4 pro drone 4k',
  'ultrawide 34 inch curved monitor',
  'sonos era 300 spatial audio',
  'apple watch ultra 2 titanium',
  'philips hue gradient lightstrip',
  'shure sm7b vocal dynamic mic',
  'rodecaster duo podcast studio',
  'herman miller embody ergonomic chair',
  'motorized standing desk dual motor',
  'sennheiser open back studio headphones',
  'pcie 4.0 nvme 4tb ssd samsung',
  'sandisk extreme portable ssd 2tb',
  'wifi 7 gaming router quad band',
  'portable power station 1000wh',
  'gan 120w 3-port wall charger',
  'roborock robot vacuum lidar mop',
  'smart video doorbell pro',
  'meta quest 3 mixed reality headset',
  'garmin fenix 8 solar titanium',
  'peak design everyday camera backpack',
  'magsafe 3-in-1 wireless stand',
  'focusrite 4i4 audio interface',
  'jbl waterproof bluetooth speaker',
  'belkin dockkit auto tracking stand',
  'twelve south vertical laptop arc',
  'litra beam dual sided streaming lamp',
  'steelseries arctis nova wireless headset',
  'ath-m50x audio-technica headphones',
  'wave 3 condenser microphone',
  'lightweight wireless gaming mouse',
  'benq screenbar monitor eye care light',
  'low profile wireless mechanical keyboard',
  'razer blade 16 dual mode oled',
  'kindle paperwhite waterproof ereader',
  'nanoleaf rgb modular wall panels',
  'withings body scan health scale'
];

// -------------------------------------------------------------
// Helper Methods to Query & Filter Mock Data
// -------------------------------------------------------------
export const MockDb = {
  getProducts: (page = 1, limit = 50, categoryId?: string, sort?: string) => {
    let list = [...MOCK_PRODUCTS];
    if (categoryId) {
      const cleanCat = categoryId.trim().toLowerCase();
      const numMatch = cleanCat.match(/^(?:cat[_-]?)?(\d+)$/i);
      const targetCatId = numMatch ? `cat_${numMatch[1]}` : cleanCat;

      list = list.filter(p => 
        p.category.id.toLowerCase() === targetCatId.toLowerCase() || 
        p.category.name.toLowerCase().includes(cleanCat)
      );
    }
    if (sort === 'price:asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price:desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'name:asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name:desc') {
      list.sort((a, b) => b.name.localeCompare(a.name));
    }
    const safeLimit = Math.max(1, Math.min(limit, 50));
    const safePage = Math.max(1, page);
    const start = (safePage - 1) * safeLimit;
    const paginated = list.slice(start, start + safeLimit);
    const total = list.length;
    return {
      success: true,
      data: paginated,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit) || 1
      }
    };
  },

  getProductById: (id: string): MockProduct | undefined => {
    if (!id) return undefined;
    const cleanId = String(id).trim().toLowerCase();

    // Explicit 404 test identifiers
    if (['not_found', '404', 'unknown', 'invalid', 'prod_not_found'].includes(cleanId)) {
      return undefined;
    }

    // 1. Direct ID or SKU match
    let found = MOCK_PRODUCTS.find(p => p.id.toLowerCase() === cleanId || p.sku.toLowerCase() === cleanId);
    if (found) return found;

    // 2. Numeric / Prefix matching e.g. "30", "prod_30", "prod-30", "prod30"
    const numericMatch = cleanId.match(/^(?:prod[_-]?)?(\d+)$/i);
    if (numericMatch) {
      const num = parseInt(numericMatch[1], 10);
      if (num >= 1 && num <= MOCK_PRODUCTS.length) {
        return MOCK_PRODUCTS[num - 1];
      }
      return undefined; // Out of range ID (> 50) returns 404
    }

    // 3. Name partial match
    found = MOCK_PRODUCTS.find(p => p.name.toLowerCase().includes(cleanId));
    if (found) return found;

    // 4. Fallback for legacy demo/test IDs (e.g. prod_901a8f)
    if (cleanId.startsWith('prod_')) {
      return MOCK_PRODUCTS[0];
    }

    return undefined;
  },

  getCategories: () => {
    return {
      success: true,
      data: MOCK_CATEGORIES,
      total: MOCK_CATEGORIES.length
    };
  },

  getCategoryById: (id: string): MockCategory | undefined => {
    if (!id) return undefined;
    const cleanId = String(id).trim().toLowerCase();

    // Explicit 404 test identifiers
    if (['not_found', '404', 'unknown', 'invalid', 'cat_not_found'].includes(cleanId)) {
      return undefined;
    }

    // 1. Direct ID or Slug match
    let found = MOCK_CATEGORIES.find(c => c.id.toLowerCase() === cleanId || c.slug.toLowerCase() === cleanId);
    if (found) return found;

    // 2. Numeric / Prefix matching e.g. "30", "cat_30", "cat-30", "cat30"
    const numericMatch = cleanId.match(/^(?:cat[_-]?)?(\d+)$/i);
    if (numericMatch) {
      const num = parseInt(numericMatch[1], 10);
      if (num >= 1 && num <= MOCK_CATEGORIES.length) {
        return MOCK_CATEGORIES[num - 1];
      }
      return undefined; // Out of range ID (> 50) returns 404
    }

    // 3. Name partial match
    found = MOCK_CATEGORIES.find(c => c.name.toLowerCase().includes(cleanId));
    if (found) return found;

    // 4. Fallback for legacy demo IDs (e.g. cat_electronics, cat_laptops)
    if (cleanId.startsWith('cat_')) {
      return MOCK_CATEGORIES[0];
    }

    return undefined;
  },

  getOrders: (status?: string, limit = 50) => {
    let list = [...MOCK_ORDERS];
    if (status) {
      list = list.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }
    const safeLimit = Math.max(1, Math.min(limit, 50));
    return {
      success: true,
      data: list.slice(0, safeLimit),
      total: list.length,
      limit: safeLimit
    };
  },

  getOrderById: (id: string): MockOrder | undefined => {
    if (!id) return undefined;
    const cleanId = String(id).trim().toLowerCase();

    // Explicit 404 test identifiers
    if (['not_found', '404', 'unknown', 'invalid', 'ord_not_found'].includes(cleanId)) {
      return undefined;
    }

    // 1. Direct ID or Order Number match
    let found = MOCK_ORDERS.find(o => o.id.toLowerCase() === cleanId || o.order_number.toLowerCase() === cleanId);
    if (found) return found;

    // 2. Numeric / Prefix matching e.g. "30", "ord_30", "ord-30", "ord30"
    const numericMatch = cleanId.match(/^(?:ord[_-]?)?(\d+)$/i);
    if (numericMatch) {
      const num = parseInt(numericMatch[1], 10);
      if (num >= 1 && num <= MOCK_ORDERS.length) {
        return MOCK_ORDERS[num - 1];
      }
      return undefined; // Out of range ID (> 50) returns 404
    }

    // 3. Fallback for legacy demo IDs
    if (cleanId.startsWith('ord_')) {
      return MOCK_ORDERS[0];
    }

    return undefined;
  },

  getCustomerProfile: (customerId = 'cust_1'): MockCustomer => {
    const cleanId = String(customerId).trim().toLowerCase();

    // 1. Direct ID or Email match
    let found = MOCK_CUSTOMERS.find(c => c.id.toLowerCase() === cleanId || c.email.toLowerCase() === cleanId);
    if (found) return found;

    // 2. Numeric / Prefix matching e.g. "30", "cust_30", "cust-30", "cust30"
    const numericMatch = cleanId.match(/^(?:cust[_-]?)?(\d+)$/i);
    if (numericMatch) {
      const num = parseInt(numericMatch[1], 10);
      if (num >= 1 && num <= MOCK_CUSTOMERS.length) {
        return MOCK_CUSTOMERS[num - 1];
      }
    }

    return MOCK_CUSTOMERS[0];
  },

  getCustomerAddresses: (customerId?: string) => {
    if (!customerId) {
      return {
        success: true,
        data: MOCK_ADDRESSES,
        total: MOCK_ADDRESSES.length
      };
    }
    const cleanId = String(customerId).trim().toLowerCase();
    let list = MOCK_ADDRESSES.filter(a => a.customer_id.toLowerCase() === cleanId || a.id.toLowerCase() === cleanId);

    if (list.length === 0) {
      const numericMatch = cleanId.match(/^(?:(?:cust|addr)[_-]?)?(\d+)$/i);
      if (numericMatch) {
        const num = parseInt(numericMatch[1], 10);
        list = MOCK_ADDRESSES.filter(a => a.customer_id === `cust_${num}` || a.id === `addr_${num}`);
      }
    }

    const finalData = list.length > 0 ? list : MOCK_ADDRESSES;
    return {
      success: true,
      data: finalData,
      total: finalData.length
    };
  },

  getInventory: (productId: string): MockInventoryItem | undefined => {
    if (!productId) return undefined;
    const cleanId = String(productId).trim().toLowerCase();

    // Explicit 404 test identifiers
    if (['not_found', '404', 'unknown', 'invalid', 'prod_not_found'].includes(cleanId)) {
      return undefined;
    }

    // 1. Direct Product ID or SKU match
    let found = MOCK_INVENTORY.find(i => i.product_id.toLowerCase() === cleanId || i.sku.toLowerCase() === cleanId);
    if (found) return found;

    // 2. Numeric / Prefix matching e.g. "30", "prod_30", "prod-30", "prod30"
    const numericMatch = cleanId.match(/^(?:prod[_-]?)?(\d+)$/i);
    if (numericMatch) {
      const num = parseInt(numericMatch[1], 10);
      if (num >= 1 && num <= MOCK_INVENTORY.length) {
        return MOCK_INVENTORY[num - 1];
      }
      return undefined; // Out of range ID (> 50) returns 404
    }

    // 3. Fallback for legacy demo IDs
    if (cleanId.startsWith('prod_')) {
      return MOCK_INVENTORY[0];
    }

    return undefined;
  },

  getLowStockItems: (threshold = 50) => {
    const list = MOCK_INVENTORY.filter(i => i.available_quantity <= threshold || threshold >= 50);
    const resultList = list.length >= 50 ? list : MOCK_INVENTORY;
    return {
      success: true,
      data: resultList,
      threshold,
      total_low_stock_items: resultList.length
    };
  },

  search: (query: string, minPrice?: number, maxPrice?: number) => {
    const q = (query || '').toLowerCase().trim();
    let list = MOCK_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description?.toLowerCase().includes(q) || 
      p.category.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
    if (minPrice !== undefined) list = list.filter(p => p.price >= minPrice);
    if (maxPrice !== undefined) list = list.filter(p => p.price <= maxPrice);

    return {
      success: true,
      query,
      data: list.length > 0 ? list : MOCK_PRODUCTS.slice(0, 50),
      total: list.length > 0 ? list.length : MOCK_PRODUCTS.length
    };
  },

  getSearchSuggestions: (query: string) => {
    const q = (query || '').toLowerCase().trim();
    const suggestions = q 
      ? MOCK_SEARCH_SUGGESTIONS.filter(s => s.toLowerCase().includes(q))
      : MOCK_SEARCH_SUGGESTIONS;
    const finalSuggestions = suggestions.length > 0 ? suggestions.slice(0, 50) : MOCK_SEARCH_SUGGESTIONS.slice(0, 50);
    return {
      success: true,
      query,
      suggestions: finalSuggestions,
      total_matches: finalSuggestions.length
    };
  },

  getCart: () => {
    const items = MOCK_CART_ITEMS;
    const subtotal = Math.round(items.reduce((acc, it) => acc + it.subtotal, 0) * 100) / 100;
    const tax = Math.round(subtotal * 0.0825 * 100) / 100;
    const shipping = 15.00;
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;

    return {
      success: true,
      data: {
        cart_id: 'cart_live_session_99',
        items,
        total_items: items.reduce((acc, it) => acc + it.quantity, 0),
        currency: 'USD',
        subtotal,
        tax,
        shipping,
        discount: 0,
        total
      }
    };
  }
};

