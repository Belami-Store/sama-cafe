/**
 * SAMA SPECIALTY COFFEE (سما كافيه للقهوة المختصة)
 * Complete Electronic Menu, Sizes & Add-ons Customizer, Order Reception (Dine-in/Pickup/Delivery),
 * Cloud Sync Cart, Checkout, and Simplified Tax Invoice Generator.
 */

const CLOUD_DB_URL = "https://belami-store-default-rtdb.firebaseio.com/sama_coffee_store";

// Currency Helper
function formatSAR(amount) {
    const num = Number(amount) || 0;
    return `${num.toFixed(2)} <img src="assets/sar.png" class="currency-icon" alt="SAR">`;
}

// Category Labels
const CATEGORY_META = {
    all: { title: 'كل المنيو الإلكتروني', desc: 'تصفح جميع المشروبات الساخنة والباردة والمقطرة والحلى وبوكسات الجمعات مع السعرات الحرارية' },
    hot: { title: 'القهوة الساخنة | Hot Coffee', desc: 'إسبريسو، فلات وايت، كابتشينو، وسبانيش لاتيه ساخن بحمصتنا المختصة' },
    cold: { title: 'القهوة الباردة | Iced Coffee', desc: 'مشروبات باردة منعشة محضرة بأجود محاصيل القهوة المختصة والحليب الطازج' },
    drip: { title: 'القهوة المقطرة V60 | Manual Brew', desc: 'تقطير يدوي متقن يبرز الإيحاءات الفاكهية والعطرية للمحاصيل الفاخرة' },
    mojito: { title: 'الموهيتو والماتشا | Mojito & Matcha', desc: 'ماتشا يابانية فاخرة وموهيتو فواكه طبيعية منعشة' },
    desserts: { title: 'الحلى والمخبوزات | Bakery & Desserts', desc: 'مخبوزات فرنسية طازجة وحلى يُحضر يومياً في مطبخ سما كافيه' },
    boxes: { title: 'بوكسات الجمعات | Gathering Boxes', desc: 'بوكسات قهوة وحلى متكاملة للجمعات العائلية والاجتماعات والمكاتب' },
    beans: { title: 'محاصيل وبن القهوة | Specialty Beans', desc: 'محاصيل قهوة مختصة محمصة بعناية مع خيار الطحن حسب أداة التحضير' }
};

// Default Milk, Sugar & Add-on Presets for Drinks
const DEFAULT_MILK_OPTIONS = [
    { name: 'حليب طازج كامل الدسم', price: 0 },
    { name: 'حليب قليل الدسم', price: 0 },
    { name: 'حليب خالي من اللاكتوز', price: 2 },
    { name: 'حليب الشوفان (Oat Milk)', price: 4 },
    { name: 'حليب اللوز (Almond Milk)', price: 4 },
    { name: 'حليب جوز الهند (Coconut)', price: 4 }
];

const DEFAULT_SUGAR_OPTIONS = [
    'معتدل (Standard)',
    'بدون سكر',
    'سكر خفيف (Less Sweet)',
    'حلا إضافي (Extra Sweet)',
    'محلى ستيفيا دايت'
];

const DEFAULT_DRINK_ADDONS = [
    { name: 'شوت إسبريسو إضافي (Extra Shot)', price: 4 },
    { name: 'فوم بارد كريمي (Cold Foam)', price: 4 },
    { name: 'صوص كراميل مملح', price: 3 },
    { name: 'صوص بستاشيو فستق', price: 4 },
    { name: 'نكهة فانيلا مدغشقر', price: 3 },
    { name: 'كريمة مخفوقة', price: 3 }
];

const DEFAULT_DESSERT_ADDONS = [
    { name: 'صوص شوكولاتة بلجيكية دافئ', price: 4 },
    { name: 'صوص بستاشيو فستق', price: 5 },
    { name: 'صوص كراميل مملح', price: 3 },
    { name: 'سكوب آيسكريم فانيلا', price: 5 }
];

// Default Products Database for SAMA Cafe (with Calories, Sizes, Add-ons)
const defaultProducts = [
    {
        id: 101,
        name: 'آيس سبانيش لاتيه سما | SAMA Iced Spanish Latte',
        category: 'cold',
        price: 19,
        calories: 210,
        caffeine: '150 ملجم كافيين',
        roast: 'إسبريسو سما المختص',
        hasMilk: true,
        hasSugar: true,
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=85',
        description: 'المشروب الأكثر طلباً في سما كافيه! مزيج غني من دبل شوت الإسبريسو المختص مع الحليب البارد والخلطة الإسبانية الكريمية الموزونة.',
        options: [
            { name: 'صغير (8 oz)', price: 17, calories: 170 },
            { name: 'وسط (12 oz)', price: 19, calories: 210 },
            { name: 'كبير (16 oz)', price: 22, calories: 260 }
        ],
        addons: DEFAULT_DRINK_ADDONS
    },
    {
        id: 102,
        name: 'قهوة مقطرة V60 إثيوبي ييرغاشيف | V60 Ethiopian',
        category: 'drip',
        price: 21,
        calories: 5,
        caffeine: '180 ملجم كافيين',
        roast: 'حمص فاتح - متوسط',
        hasMilk: false,
        hasSugar: false,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=85',
        description: 'قهوة مقطرة يدوياً بأداة V60 من محصول إثيوبي ييرغاشيف مجفف، بإيحاءات الياسمين، التوت الأزرق، والخوخ مع قوام حريري صافي.',
        options: [
            { name: 'V60 ساخن (Hot)', price: 21, calories: 5 },
            { name: 'V60 بارد على الثلج (Iced)', price: 22, calories: 5 },
            { name: 'كيمكس لشخصين (Chemex 500ml)', price: 36, calories: 10 }
        ],
        addons: [
            { name: 'محصول كولومبي سوبريمو', price: 0 },
            { name: 'محصول إثيوبي قوجي فاخر', price: 3 },
            { name: 'كوب ثلج جانبي إضافي', price: 0 }
        ]
    },
    {
        id: 103,
        name: 'فلات وايت مختص | Specialty Flat White',
        category: 'hot',
        price: 16,
        calories: 120,
        caffeine: '140 ملجم كافيين',
        roast: 'بلند البرازيل وكولومبيا',
        hasMilk: true,
        hasSugar: true,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85',
        description: 'دبل شوت ريستريتو مركّز مع حليب مبخر ناعم بطبقة مايكروفوم حريرية ورسمة لاتيه آرت متقنة.',
        options: [
            { name: 'الحجم الكلاسيكي (6 oz)', price: 16, calories: 120 },
            { name: 'حجم وسط (8 oz)', price: 18, calories: 145 }
        ],
        addons: DEFAULT_DRINK_ADDONS
    },
    {
        id: 104,
        name: 'كابتشينو كريمي | Classic Cappuccino',
        category: 'hot',
        price: 17,
        calories: 135,
        caffeine: '140 ملجم كافيين',
        roast: 'حمص متوسط',
        hasMilk: true,
        hasSugar: true,
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=85',
        description: 'تناغم مثالي بين الإسبريسو الغني والحليب المبخر مع رغوة كثيفة وناعمة ورشة كاكاو اختيارية.',
        options: [
            { name: 'صغير (8 oz)', price: 17, calories: 135 },
            { name: 'وسط (12 oz)', price: 19, calories: 175 },
            { name: 'كبير (16 oz)', price: 21, calories: 215 }
        ],
        addons: DEFAULT_DRINK_ADDONS
    },
    {
        id: 105,
        name: 'آيس ماتشا لاتيه ياباني | Iced Ceremonial Matcha',
        category: 'mojito',
        price: 22,
        calories: 165,
        caffeine: '75 ملجم كافيين طبيعي',
        roast: 'ماتشا أوجي اليابانية درجة احتفالية',
        hasMilk: true,
        hasSugar: true,
        image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=85',
        description: 'ماتشا يابانية أصلية (Ceremonial Grade) مخفوقة يدوياً مع الحليب البارد والثلج، غنية بمضادات الأكسدة بطعم كريمي ناعم.',
        options: [
            { name: 'وسط (12 oz)', price: 22, calories: 165 },
            { name: 'كبير (16 oz)', price: 25, calories: 210 },
            { name: 'ماتشا بالفراولة الطازجة (14 oz)', price: 26, calories: 230 }
        ],
        addons: [
            { name: 'فوم فانيلا بارد (Vanilla Cold Foam)', price: 4 },
            { name: 'بيوريه فراولة طبيعي', price: 4 },
            { name: 'دبل شوت ماتشا', price: 5 }
        ]
    },
    {
        id: 106,
        name: 'موهيتو سما بلوبيري وباشن فروت | SAMA Sky Mojito',
        category: 'mojito',
        price: 19,
        calories: 140,
        caffeine: 'خالي من الكافيين',
        roast: 'منعش طبيعي',
        hasMilk: false,
        hasSugar: true,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85',
        description: 'انتعاش سماوي بلون السماء! مزيج التوت الأزرق والباشن فروت مع أوراق النعناع الطازجة وشرائح الليمون والمياه الغازية الفوارة.',
        options: [
            { name: 'وسط (12 oz)', price: 19, calories: 140 },
            { name: 'كبير (16 oz)', price: 22, calories: 180 }
        ],
        addons: [
            { name: 'مشروب طاقة (بدل السفن/الصودا)', price: 5 },
            { name: 'إضافة توت طازج إضافي', price: 3 },
            { name: 'نعناع وليمون إضافي', price: 0 }
        ]
    },
    {
        id: 107,
        name: 'آيس سولتد كراميل ماكياتو | Iced Salted Caramel',
        category: 'cold',
        price: 20,
        calories: 230,
        caffeine: '150 ملجم كافيين',
        roast: 'إسبريسو مختص',
        hasMilk: true,
        hasSugar: true,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=85',
        description: 'طبقات من الحليب البارد الممزوج بالفانيلا مع شوت الإسبريسو وخطوط صوص الكراميل المملح الفاخر.',
        options: [
            { name: 'صغير (8 oz)', price: 18, calories: 185 },
            { name: 'وسط (12 oz)', price: 20, calories: 230 },
            { name: 'كبير (16 oz)', price: 23, calories: 280 }
        ],
        addons: DEFAULT_DRINK_ADDONS
    },
    {
        id: 108,
        name: 'قهوة اليوم المقطرة | Brew of the Day',
        category: 'drip',
        price: 12,
        calories: 5,
        caffeine: '160 ملجم كافيين',
        roast: 'محصول متجدد يومياً',
        hasMilk: false,
        hasSugar: false,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=85',
        description: 'قهوة سوداء مقطرة طازجة من محصول اليوم المختص، خيارك المثالي للصباح والتركيز بأقل سعرات حرارية.',
        options: [
            { name: 'صغير ساخن (8 oz)', price: 10, calories: 5 },
            { name: 'وسط ساخن (12 oz)', price: 12, calories: 5 },
            { name: 'بارد على الثلج (12 oz)', price: 13, calories: 5 }
        ],
        addons: [
            { name: 'إضافة حليب جانبي', price: 2 },
            { name: 'شوت إسبريسو إضافي (Red Eye)', price: 4 }
        ]
    },
    {
        id: 109,
        name: 'تشيزكيك سان سيباستيان بالشوكلت | San Sebastian Cheesecake',
        category: 'desserts',
        price: 24,
        calories: 410,
        caffeine: 'مخبوز يومياً',
        roast: 'شوكولاتة بلجيكية دافئة',
        hasMilk: false,
        hasSugar: false,
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=85',
        description: 'تشيزكيك سان سيباستيان الإسباني بقوامه الكريمي الذائب ووجهه المكرمل، يُقدم مع صوص الشوكولاتة البلجيكية الدافئة.',
        options: [
            { name: 'قطعة مع صوص شوكولاتة بالحليب', price: 24, calories: 410 },
            { name: 'قطعة مع صوص بستاشيو فستق', price: 26, calories: 440 },
            { name: 'قطعة سادة (بدون صوص)', price: 21, calories: 320 }
        ],
        addons: DEFAULT_DESSERT_ADDONS
    },
    {
        id: 110,
        name: 'كرواسون الزبدة الفرنسي باللوز أو الزعتر | French Croissant',
        category: 'desserts',
        price: 15,
        calories: 310,
        caffeine: 'طازج من الفرن',
        roast: 'زبدة فرنسية طبيعية 100%',
        hasMilk: false,
        hasSugar: false,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=85',
        description: 'كرواسون فرنسي مورّق وهش محضر بالزبدة الفرنسية الفاخرة، يخبز طازجاً كل صباح ليكمل كوب قهوتك.',
        options: [
            { name: 'كرواسون زبدة كلاسيك', price: 13, calories: 270 },
            { name: 'كرواسون اللوز المحمص', price: 16, calories: 350 },
            { name: 'كرواسون الجبن والزعتر البري', price: 15, calories: 310 },
            { name: 'كرواسون الشوكولاتة البلجيكية', price: 16, calories: 340 }
        ],
        addons: [
            { name: 'تسخين إضافي عند التقديم', price: 0 },
            { name: 'مربى وزبدة جانبية', price: 3 }
        ]
    },
    {
        id: 111,
        name: 'فرنش توست سما بالكراميل المملح والبيكان | SAMA French Toast',
        category: 'desserts',
        price: 25,
        calories: 450,
        caffeine: 'يُحضر طازجاً عند الطلب',
        roast: 'خبز بريوش فرنسي',
        hasMilk: false,
        hasSugar: false,
        image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=85',
        description: 'خبز البريوش الفرنسي المحمص بالزبدة والقرفة، مغطى بصوص الكراميل المملح وجوز البيكان المكرمل مع التوت الطازج.',
        options: [
            { name: 'كراميل مملح وبيكان', price: 25, calories: 450 },
            { name: 'شوكولاتة بلجيكية وفراولة', price: 26, calories: 470 },
            { name: 'مع سكوب آيسكريم فانيلا', price: 29, calories: 530 }
        ],
        addons: DEFAULT_DESSERT_ADDONS
    },
    {
        id: 112,
        name: 'بوكس قهوة اليوم للجمعات (1.5 لتر - 8 أكواب) | Gathering Coffee Box',
        category: 'boxes',
        price: 59,
        calories: 40,
        caffeine: 'يكفي 7 - 8 أشخاص',
        roast: 'يحفظ الحرارة 4 ساعات',
        hasMilk: false,
        hasSugar: false,
        image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=85',
        description: 'بوكس قهوة اليوم المقطرة الفاخرة بحافظة حرارية أنيقة، يأتي متكاملاً مع 8 أكواب ورقية ومغلفات السكر والمحليات.',
        options: [
            { name: 'بوكس 1.5 لتر (8 أكواب)', price: 59, calories: 40 },
            { name: 'بوكس 2.5 لتر كبير (14 كوب)', price: 89, calories: 70 }
        ],
        addons: [
            { name: 'بوكس ميني كرواسون مشكل (8 قطع)', price: 39 },
            { name: 'بوكس ميني حلى وكوكيز (12 قطعة)', price: 49 },
            { name: 'عبوة حليب طازج جانبية', price: 8 }
        ]
    },
    {
        id: 113,
        name: 'بوكس مشروبات سما الباردة (6 قوارير مشكلة) | Iced Drinks Box',
        category: 'boxes',
        price: 95,
        calories: 1150,
        caffeine: '6 قوارير زجاجية مع الثلج',
        roast: 'تشكيلة المشروبات الأكثر مبيعاً',
        hasMilk: true,
        hasSugar: true,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=85',
        description: 'بوكس الثلج الفاخر للجمعات والطلعات! يضم 6 قوارير زجاجية (2 سبانيش لاتيه، 2 سولتد كراميل، 1 ماتشا، 1 موهيتو بلوبيري أو V60 بارد) مع الأكواب والثلج.',
        options: [
            { name: 'بوكس 6 قوارير مشكلة (الأكثر طلباً)', price: 95, calories: 1150 },
            { name: 'بوكس 10 قوارير كبير للجمعات', price: 149, calories: 1900 }
        ],
        addons: [
            { name: 'بوكس ميني كرواسون (8 قطع)', price: 39 },
            { name: 'أكواب وثلج إضافي', price: 5 }
        ]
    },
    {
        id: 114,
        name: 'محصول إثيوبيا قوجي هامبيلا (مجفف) | Ethiopia Guji Beans',
        category: 'beans',
        price: 54,
        calories: 0,
        caffeine: 'سلالة هيرلوم • ارتفاع 2100م',
        roast: 'إيحاءات: توت، ياسمين، شوكولاتة',
        hasMilk: false,
        hasSugar: false,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=85',
        description: 'بن قهوة مختصة محمص طازجاً في محمصة سما، مناسب للتقطير (V60 / كيمكس) وللإسبريسو ومشروبات الحليب.',
        options: [
            { name: 'عبوة 250 جرام', price: 54, calories: 0 },
            { name: 'عبوة 500 جرام (وفر 10 ريال)', price: 98, calories: 0 },
            { name: 'عبوة 1 كيلو كاملة', price: 179, calories: 0 }
        ],
        addons: [
            { name: 'حبوب كاملة (بدون طحن)', price: 0 },
            { name: 'طحنة تقطير V60 / كيمكس', price: 0 },
            { name: 'طحنة إسبريسو ناعمة', price: 0 },
            { name: 'فلاتر V60 ورقية (40 فلتر)', price: 18 }
        ]
    },
    {
        id: 115,
        name: 'كورتادو مختص | Specialty Cortado',
        category: 'hot',
        price: 15,
        calories: 90,
        caffeine: '140 ملجم كافيين',
        roast: 'توازن القهوة والحليب 1:1',
        hasMilk: true,
        hasSugar: true,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85',
        description: 'توازن مثالي بنسبة متساوية بين دبل شوت الإسبريسو الغني والحليب المبخر الدافئ لعشاق نكهة القهوة الواضحة.',
        options: [
            { name: 'حجم كلاسيك (4.5 oz)', price: 15, calories: 90 }
        ],
        addons: DEFAULT_DRINK_ADDONS
    },
    {
        id: 116,
        name: 'آيس كركديه سما بالتوت والرمان | Iced Hibiscus Berry',
        category: 'mojito',
        price: 18,
        calories: 85,
        caffeine: 'خالي من الكافيين • منخفض السعرات',
        roast: 'طبيعي 100%',
        hasMilk: false,
        hasSugar: true,
        image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=85',
        description: 'مشروب الكركديه البارد المنقوع مع التوت البري والرمان والنعناع الطازج، منعش وخفيف بالسعرات الحرارية.',
        options: [
            { name: 'وسط (12 oz)', price: 18, calories: 85 },
            { name: 'كبير (16 oz)', price: 21, calories: 110 }
        ],
        addons: [
            { name: 'شرائح ليمون ونعناع إضافي', price: 0 },
            { name: 'إضافة توت طازج', price: 3 }
        ]
    }
];

// Global State
let products = [];
let cart = [];
let currentCategoryFilter = 'all';
let currentSearchQuery = '';
let globalOrderMode = 'pickup'; // 'pickup' | 'dinein' | 'delivery'
let quickTableOrCarNote = '';

// Modal Customization State
let currentModalProduct = null;
let modalSelectedOptionIndex = 0;
let modalSelectedMilkIndex = 0;
let modalSelectedSugarIndex = 0;
let modalSelectedAddons = new Set();
let modalQty = 1;

// Checkout State
let currentShippingType = 'pickup';
let currentShippingCost = 0;
let currentPaymentMethod = 'card';
let appliedCoupon = null;
let discountPercentage = 0;
let pendingLastOrder = null;

// Initialize Products from LocalStorage or Defaults
function loadProductsData() {
    try {
        const stored = localStorage.getItem('coffee_products');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                products = parsed;
                return;
            }
        }
    } catch (e) {
        console.warn('Error loading local products:', e);
    }
    products = JSON.parse(JSON.stringify(defaultProducts));
    localStorage.setItem('coffee_products', JSON.stringify(products));
}

// Sync from Cloud Firebase RTDB if available
async function syncFromCloudDB() {
    try {
        const res = await fetch(`${CLOUD_DB_URL}/products.json`);
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                products = data.filter(Boolean);
                localStorage.setItem('coffee_products', JSON.stringify(products));
                renderElectronicMenu();
            }
        }
    } catch (e) {
        // Offline or local demo mode
    }
    try {
        const setRes = await fetch(`${CLOUD_DB_URL}/settings.json`);
        if (setRes.ok) {
            const settings = await setRes.json();
            if (settings && typeof settings === 'object') {
                localStorage.setItem('coffee_store_settings', JSON.stringify(settings));
                applyDynamicStoreSettings(settings);
            }
        }
    } catch (e) {}
}

function getStoreSettings() {
    try {
        return JSON.parse(localStorage.getItem('coffee_store_settings')) || {};
    } catch (e) {
        return {};
    }
}

function applyDynamicStoreSettings(settings) {
    if (!settings) settings = getStoreSettings();
    const feeLabel = document.getElementById('checkout-delivery-fee-label');
    const delivFee = settings.deliveryFee !== undefined ? Number(settings.deliveryFee) : 15;
    if (feeLabel) feeLabel.innerHTML = formatSAR(delivFee);

    if (settings.googleMapsUrl) {
        const mapBtn = document.getElementById('cafe-google-map-btn');
        const recMapBtn = document.getElementById('receipt-map-btn');
        if (mapBtn) mapBtn.href = settings.googleMapsUrl;
        if (recMapBtn) recMapBtn.href = settings.googleMapsUrl;
    }
    if (settings.directPaymentLink) {
        const payBtn1 = document.getElementById('direct-paylink-contact-btn');
        const payBtn2 = document.getElementById('receipt-paylink-btn');
        if (payBtn1) payBtn1.href = settings.directPaymentLink;
        if (payBtn2) payBtn2.href = settings.directPaymentLink;
    }
}

// Order Reception Mode Selector (Top Bar on Home)
function selectGlobalOrderMode(mode) {
    globalOrderMode = mode;
    ['pickup', 'dinein', 'delivery'].forEach(m => {
        const btn = document.getElementById(`mode-btn-${m}`);
        if (btn) btn.classList.toggle('active', m === mode);
    });

    const statusText = document.getElementById('order-mode-status-text');
    const quickInput = document.getElementById('quick-table-or-car');

    if (mode === 'pickup') {
        if (statusText) statusText.innerHTML = '<strong>الوضع الحالي:</strong> استلام فوري من الفرع أو تقديم للسيارة (مجاناً بدون رسوم توصيل)';
        if (quickInput) {
            quickInput.style.display = 'inline-block';
            quickInput.placeholder = 'نوع ولون السيارة / رقم اللوحة (اختياري)';
        }
    } else if (mode === 'dinein') {
        if (statusText) statusText.innerHTML = '<strong>الوضع الحالي:</strong> طلب محلي داخل الكافيه — يُقدم مباشرة لطاولتك (مجاناً)';
        if (quickInput) {
            quickInput.style.display = 'inline-block';
            quickInput.placeholder = 'أدخل رقم الطاولة (مثال: طاولة 5)';
        }
    } else if (mode === 'delivery') {
        const settings = getStoreSettings();
        const fee = settings.deliveryFee !== undefined ? Number(settings.deliveryFee) : 15;
        if (statusText) statusText.innerHTML = `<strong>الوضع الحالي:</strong> توصيل سريع لموقعك (${fee} ر.س — ومجاناً للطلبات فوق 120 ر.س)`;
        if (quickInput) {
            quickInput.style.display = 'inline-block';
            quickInput.placeholder = 'اسم الحي أو الموقع (اختياري)';
        }
    }

    // Also sync checkout shipping radio
    updateShippingMethod(mode, true);
}

function syncQuickTableOrCar(val) {
    quickTableOrCarNote = val;
    const checkoutField = document.getElementById('cust-table-car');
    if (checkoutField && val.trim()) {
        checkoutField.value = val.trim();
    }
}

// Render Electronic Menu Cards (with Calories Badge!)
function createProductCardHTML(product) {
    const basePrice = (product.options && product.options.length > 0)
        ? Number(product.options[0].price)
        : Number(product.price || 0);

    const calValue = (product.options && product.options.length > 0 && product.options[0].calories !== undefined)
        ? product.options[0].calories
        : product.calories;

    const hasCalories = calValue !== undefined && calValue !== null && calValue !== '';

    const catNames = {
        hot: 'قهوة ساخنة',
        cold: 'قهوة باردة',
        drip: 'مقطرة V60',
        mojito: 'موهيتو وماتشا',
        desserts: 'حلى ومخبوزات',
        boxes: 'بوكسات الجمعات',
        beans: 'محاصيل القهوة'
    };

    return `
        <div class="product-card" onclick="openProductModal(${product.id})" style="cursor:pointer;">
            <div class="product-img-wrapper">
                <img src="${product.image}" class="product-img" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80'">
                <span class="product-badge" style="border-radius:20px; padding:4px 12px; font-size:0.75rem;">${catNames[product.category] || 'سما كافيه'}</span>
                ${hasCalories ? `<span style="position:absolute; bottom:12px; left:12px; z-index:5; background:rgba(15,41,66,0.86); color:#7DD3FC; backdrop-filter:blur(6px); padding:4px 11px; border-radius:20px; font-size:0.75rem; font-weight:800; display:inline-flex; align-items:center; gap:5px; box-shadow:0 4px 10px rgba(0,0,0,0.18);"><i class="fa-solid fa-fire-flame-curved" style="color:#38BDF8;"></i> ${calValue} سعرة</span>` : ''}
            </div>
            <div class="product-info">
                <div class="coffee-meta-tags">
                    ${hasCalories ? `<span class="coffee-tag cal-tag"><i class="fa-solid fa-fire-flame-curved"></i> ${calValue} سعرة حرارية</span>` : ''}
                    ${product.caffeine ? `<span class="coffee-tag"><i class="fa-solid fa-bolt"></i> ${product.caffeine}</span>` : ''}
                </div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description || ''}</p>
                <div class="product-footer">
                    <div class="product-price">
                        <span style="font-size:0.72rem; color:var(--text-muted); font-weight:600; display:block; margin:0;">يبدأ من</span>
                        ${formatSAR(basePrice)}
                    </div>
                    <button type="button" class="add-to-cart-btn" onclick="event.stopPropagation(); openProductModal(${product.id})" title="تخصيص الحجم والإضافات">
                        <i class="fa-solid fa-sliders" style="margin-left:5px;"></i> اختر الحجم
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderElectronicMenu() {
    const grid = document.getElementById('home-products-grid');
    if (!grid) return;

    let filtered = products.filter(p => !p.hidden);

    if (currentCategoryFilter && currentCategoryFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategoryFilter);
    }

    if (currentSearchQuery.trim() !== '') {
        const q = currentSearchQuery.trim().toLowerCase();
        filtered = filtered.filter(p =>
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            (p.roast && p.roast.toLowerCase().includes(q))
        );
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align:center; padding: 50px 20px; background:#fff; border-radius:16px; border:1px dashed var(--glass-border);">
                <i class="fa-solid fa-mug-hot" style="font-size:2.5rem; color:var(--primary); margin-bottom:12px;"></i>
                <h3 style="color:var(--text-dark); margin-bottom:6px;">لا توجد مشروبات مطابقة لبحثك</h3>
                <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:16px;">جرب البحث بكلمة أخرى أو استعرض جميع أقسام المنيو</p>
                <button class="btn" onclick="filterElectronicMenu('all'); document.getElementById('menu-search-input').value=''; handleMenuSearch('');" style="padding:10px 24px; border-radius:25px;">عرض كل المنيو</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(p => createProductCardHTML(p)).join('');
}

function filterElectronicMenu(cat) {
    currentCategoryFilter = cat;
    const pills = document.querySelectorAll('#electronic-menu-pills .menu-pill-btn');
    pills.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-cat') === cat);
    });
    const topCats = document.querySelectorAll('#top-visual-cats .top-cat-item');
    topCats.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-cat') === cat);
    });
    renderElectronicMenu();
}

function handleMenuSearch(val) {
    currentSearchQuery = val || '';
    renderElectronicMenu();
}

function openCategoryView(cat) {
    const storeGrid = document.getElementById('products-grid');
    const titleEl = document.getElementById('store-view-title');
    const descEl = document.getElementById('store-view-desc');
    const meta = CATEGORY_META[cat] || CATEGORY_META.all;

    if (titleEl) titleEl.textContent = meta.title;
    if (descEl) descEl.textContent = meta.desc;

    const list = cat === 'all' ? products.filter(p => !p.hidden) : products.filter(p => !p.hidden && p.category === cat);
    if (storeGrid) {
        storeGrid.innerHTML = list.map(p => createProductCardHTML(p)).join('');
    }
    navigateTo('store');
}

// PRODUCT CUSTOMIZATION MODAL (Sizes, Milk, Sugar, Add-ons, Calories)
function openProductModal(productId) {
    const product = products.find(p => Number(p.id) === Number(productId));
    if (!product) return;

    currentModalProduct = product;
    modalSelectedOptionIndex = 0;
    modalSelectedMilkIndex = 0;
    modalSelectedSugarIndex = 0;
    modalSelectedAddons = new Set();
    modalQty = 1;

    document.getElementById('modal-product-img').src = product.image;
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-desc').textContent = product.description || '';
    document.getElementById('modal-qty').textContent = '1';
    const noteEl = document.getElementById('modal-custom-note');
    if (noteEl) noteEl.value = '';

    const catMeta = CATEGORY_META[product.category] || { title: 'سما كافيه' };
    document.getElementById('modal-product-cat').textContent = catMeta.title;

    // Render Sizes / Options
    const sizesContainer = document.getElementById('modal-sizes-container');
    const sizeCardsEl = document.getElementById('modal-size-cards');
    const optionsList = (Array.isArray(product.options) && product.options.length > 0)
        ? product.options
        : [{ name: 'الحجم القياسي', price: Number(product.price || 0), calories: product.calories }];

    sizesContainer.style.display = 'block';
    sizeCardsEl.innerHTML = optionsList.map((opt, idx) => {
        const optCal = opt.calories !== undefined ? opt.calories : product.calories;
        return `
            <div class="size-option-card ${idx === 0 ? 'active' : ''}" onclick="selectModalSize(${idx})">
                <span class="size-option-title">${opt.name}</span>
                <span class="size-option-price">${formatSAR(opt.price)}</span>
                ${optCal !== undefined && optCal !== '' ? `<small style="display:block; font-size:0.7rem; color:#0284c7; margin-top:3px; font-weight:700;"><i class="fa-solid fa-fire-flame-curved"></i> ${optCal} سعرة</small>` : ''}
            </div>
        `;
    }).join('');

    // Render Milk Options (if applicable)
    const milkContainer = document.getElementById('modal-milk-container');
    const milkPillsEl = document.getElementById('modal-milk-pills');
    const showMilk = product.hasMilk !== undefined ? product.hasMilk : (product.category === 'hot' || product.category === 'cold');
    if (showMilk) {
        milkContainer.style.display = 'block';
        milkPillsEl.innerHTML = DEFAULT_MILK_OPTIONS.map((m, idx) => `
            <button type="button" class="custom-pill-choice ${idx === 0 ? 'active' : ''}" onclick="selectModalMilk(${idx})">
                ${m.name} ${m.price > 0 ? `(+${m.price} ر.س)` : ''}
            </button>
        `).join('');
    } else {
        milkContainer.style.display = 'none';
    }

    // Render Sugar / Sweetness Options
    const sugarContainer = document.getElementById('modal-sugar-container');
    const sugarPillsEl = document.getElementById('modal-sugar-pills');
    const showSugar = product.hasSugar !== undefined ? product.hasSugar : (product.category === 'hot' || product.category === 'cold' || product.category === 'mojito');
    if (showSugar) {
        sugarContainer.style.display = 'block';
        sugarPillsEl.innerHTML = DEFAULT_SUGAR_OPTIONS.map((s, idx) => `
            <button type="button" class="custom-pill-choice ${idx === 0 ? 'active' : ''}" onclick="selectModalSugar(${idx})">
                ${s}
            </button>
        `).join('');
    } else {
        sugarContainer.style.display = 'none';
    }

    // Render Extra Add-ons
    const addonsContainer = document.getElementById('modal-addons-container');
    const addonsGridEl = document.getElementById('modal-addons-grid');
    const addonsList = Array.isArray(product.addons) ? product.addons : (product.category === 'desserts' ? DEFAULT_DESSERT_ADDONS : DEFAULT_DRINK_ADDONS);

    if (addonsList && addonsList.length > 0) {
        addonsContainer.style.display = 'block';
        addonsGridEl.innerHTML = addonsList.map((addon, idx) => `
            <div class="addon-item-label" id="addon-card-${idx}" onclick="toggleModalAddon(${idx})">
                <div class="addon-item-left">
                    <i class="fa-regular fa-square" id="addon-icon-${idx}" style="color:var(--primary);"></i>
                    <span>${addon.name}</span>
                </div>
                <span class="addon-item-price">${addon.price > 0 ? `+${addon.price} ر.س` : 'مجاناً'}</span>
            </div>
        `).join('');
    } else {
        addonsContainer.style.display = 'none';
    }

    updateModalPriceAndMeta();

    const overlay = document.getElementById('product-modal');
    const modal = document.getElementById('product-modal-content');
    if (overlay && modal) {
        overlay.classList.add('active');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeProductModal() {
    const overlay = document.getElementById('product-modal');
    const modal = document.getElementById('product-modal-content');
    if (overlay && modal) {
        overlay.classList.remove('active');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function selectModalSize(idx) {
    modalSelectedOptionIndex = idx;
    const cards = document.querySelectorAll('#modal-size-cards .size-option-card');
    cards.forEach((c, i) => c.classList.toggle('active', i === idx));
    updateModalPriceAndMeta();
}

function selectModalMilk(idx) {
    modalSelectedMilkIndex = idx;
    const pills = document.querySelectorAll('#modal-milk-pills .custom-pill-choice');
    pills.forEach((p, i) => p.classList.toggle('active', i === idx));
    updateModalPriceAndMeta();
}

function selectModalSugar(idx) {
    modalSelectedSugarIndex = idx;
    const pills = document.querySelectorAll('#modal-sugar-pills .custom-pill-choice');
    pills.forEach((p, i) => p.classList.toggle('active', i === idx));
}

function toggleModalAddon(idx) {
    if (modalSelectedAddons.has(idx)) {
        modalSelectedAddons.delete(idx);
    } else {
        modalSelectedAddons.add(idx);
    }
    const card = document.getElementById(`addon-card-${idx}`);
    const icon = document.getElementById(`addon-icon-${idx}`);
    if (card) card.classList.toggle('checked', modalSelectedAddons.has(idx));
    if (icon) {
        icon.className = modalSelectedAddons.has(idx) ? 'fa-solid fa-square-check' : 'fa-regular fa-square';
    }
    updateModalPriceAndMeta();
}

function adjustModalQty(delta) {
    modalQty = Math.max(1, modalQty + delta);
    document.getElementById('modal-qty').textContent = modalQty;
    updateModalPriceAndMeta();
}

function calculateCurrentModalUnitPrice() {
    if (!currentModalProduct) return 0;
    const optionsList = (Array.isArray(currentModalProduct.options) && currentModalProduct.options.length > 0)
        ? currentModalProduct.options
        : [{ name: 'الحجم القياسي', price: Number(currentModalProduct.price || 0) }];

    const selectedOpt = optionsList[modalSelectedOptionIndex] || optionsList[0];
    let unitPrice = Number(selectedOpt.price || currentModalProduct.price || 0);

    const showMilk = currentModalProduct.hasMilk !== undefined
        ? currentModalProduct.hasMilk
        : (currentModalProduct.category === 'hot' || currentModalProduct.category === 'cold');

    if (showMilk && DEFAULT_MILK_OPTIONS[modalSelectedMilkIndex]) {
        unitPrice += Number(DEFAULT_MILK_OPTIONS[modalSelectedMilkIndex].price || 0);
    }

    const addonsList = Array.isArray(currentModalProduct.addons)
        ? currentModalProduct.addons
        : (currentModalProduct.category === 'desserts' ? DEFAULT_DESSERT_ADDONS : DEFAULT_DRINK_ADDONS);

    modalSelectedAddons.forEach(idx => {
        if (addonsList && addonsList[idx]) {
            unitPrice += Number(addonsList[idx].price || 0);
        }
    });

    return unitPrice;
}

function updateModalPriceAndMeta() {
    if (!currentModalProduct) return;
    const unitPrice = calculateCurrentModalUnitPrice();
    const totalPrice = unitPrice * modalQty;

    const priceEl = document.getElementById('modal-product-price');
    if (priceEl) {
        priceEl.innerHTML = `${formatSAR(totalPrice)} <small style="font-size:0.78rem; color:var(--text-muted); font-weight:600;">(شامل الضريبة)</small>`;
    }

    // Update Meta Badges (Calories, Caffeine, Roast)
    const optionsList = (Array.isArray(currentModalProduct.options) && currentModalProduct.options.length > 0)
        ? currentModalProduct.options
        : [{ name: 'قياسي', price: currentModalProduct.price, calories: currentModalProduct.calories }];
    const selectedOpt = optionsList[modalSelectedOptionIndex] || optionsList[0];
    const cal = selectedOpt.calories !== undefined ? selectedOpt.calories : currentModalProduct.calories;

    const badgesEl = document.getElementById('modal-meta-badges');
    if (badgesEl) {
        let html = '';
        if (cal !== undefined && cal !== null && cal !== '') {
            html += `<span class="coffee-tag cal-tag" style="padding:5px 12px; font-size:0.8rem;"><i class="fa-solid fa-fire-flame-curved"></i> السعرات الحرارية: ${cal} سعرة</span>`;
        }
        if (currentModalProduct.caffeine) {
            html += `<span class="coffee-tag" style="padding:5px 12px; font-size:0.8rem;"><i class="fa-solid fa-bolt"></i> ${currentModalProduct.caffeine}</span>`;
        }
        if (currentModalProduct.roast) {
            html += `<span class="coffee-tag" style="padding:5px 12px; font-size:0.8rem;"><i class="fa-solid fa-seedling"></i> ${currentModalProduct.roast}</span>`;
        }
        badgesEl.innerHTML = html;
    }
}

function addModalProductToCart() {
    if (!currentModalProduct) return;

    const optionsList = (Array.isArray(currentModalProduct.options) && currentModalProduct.options.length > 0)
        ? currentModalProduct.options
        : [{ name: 'الحجم القياسي', price: Number(currentModalProduct.price || 0), calories: currentModalProduct.calories }];

    const selectedOpt = optionsList[modalSelectedOptionIndex] || optionsList[0];
    const unitPrice = calculateCurrentModalUnitPrice();

    const customDetails = [];
    if (selectedOpt && selectedOpt.name) {
        customDetails.push(`الحجم: ${selectedOpt.name}`);
    }

    const showMilk = currentModalProduct.hasMilk !== undefined
        ? currentModalProduct.hasMilk
        : (currentModalProduct.category === 'hot' || currentModalProduct.category === 'cold');
    if (showMilk && DEFAULT_MILK_OPTIONS[modalSelectedMilkIndex]) {
        customDetails.push(DEFAULT_MILK_OPTIONS[modalSelectedMilkIndex].name);
    }

    const showSugar = currentModalProduct.hasSugar !== undefined
        ? currentModalProduct.hasSugar
        : (currentModalProduct.category === 'hot' || currentModalProduct.category === 'cold' || currentModalProduct.category === 'mojito');
    if (showSugar && DEFAULT_SUGAR_OPTIONS[modalSelectedSugarIndex]) {
        customDetails.push(`السكر: ${DEFAULT_SUGAR_OPTIONS[modalSelectedSugarIndex]}`);
    }

    const addonsList = Array.isArray(currentModalProduct.addons)
        ? currentModalProduct.addons
        : (currentModalProduct.category === 'desserts' ? DEFAULT_DESSERT_ADDONS : DEFAULT_DRINK_ADDONS);

    const chosenAddons = [];
    modalSelectedAddons.forEach(idx => {
        if (addonsList && addonsList[idx]) {
            chosenAddons.push(addonsList[idx].name);
        }
    });
    if (chosenAddons.length > 0) {
        customDetails.push(`إضافات: ${chosenAddons.join(' + ')}`);
    }

    const baristaNote = (document.getElementById('modal-custom-note')?.value || '').trim();
    const selectedOptionLabel = customDetails.join(' | ');
    const cal = selectedOpt.calories !== undefined ? selectedOpt.calories : currentModalProduct.calories;

    const cartKey = `${currentModalProduct.id}_${selectedOptionLabel}_${baristaNote}`;
    const existingItem = cart.find(item => item.cartKey === cartKey);

    if (existingItem) {
        existingItem.quantity += modalQty;
    } else {
        cart.push({
            cartKey,
            id: currentModalProduct.id,
            name: currentModalProduct.name,
            price: unitPrice,
            image: currentModalProduct.image,
            calories: cal,
            selectedOption: selectedOptionLabel,
            customText: baristaNote,
            quantity: modalQty
        });
    }

    saveCart();
    updateCartUI();
    closeProductModal();
    showToast(`تمت إضافة "${currentModalProduct.name}" إلى سلة طلبك ☕`, 'success');
    toggleCart(true);
}

// CART MANAGEMENT
function loadCart() {
    try {
        const saved = localStorage.getItem('coffee_cart');
        if (saved) cart = JSON.parse(saved) || [];
    } catch (e) {
        cart = [];
    }
}

function saveCart() {
    localStorage.setItem('coffee_cart', JSON.stringify(cart));
    if (typeof window.syncCustomerSessionToCloud === 'function') {
        window.syncCustomerSessionToCloud();
    }
}

function toggleCart(open) {
    const overlay = document.getElementById('cart-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (!overlay || !drawer) return;
    if (open) {
        overlay.classList.add('open', 'active');
        drawer.classList.add('open', 'active');
    } else {
        overlay.classList.remove('open', 'active');
        drawer.classList.remove('open', 'active');
    }
}

function updateCartItemQty(index, delta) {
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
    if (document.getElementById('checkout-view')?.classList.contains('active')) {
        renderCheckoutSummary();
    }
}

function removeCartItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    if (document.getElementById('checkout-view')?.classList.contains('active')) {
        renderCheckoutSummary();
    }
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge-count');
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-value');

    const totalCount = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    const totalPrice = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity || 1)), 0);

    if (badge) badge.textContent = totalCount;
    if (totalEl) totalEl.innerHTML = formatSAR(totalPrice);

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 60px 20px; color: var(--text-muted);">
                <i class="fa-solid fa-mug-hot" style="font-size: 3rem; color: var(--primary); opacity: 0.4; margin-bottom: 15px;"></i>
                <p style="font-weight:700; font-size:1.05rem; color:var(--text-dark);">سلة مشروباتك فارغة حالياً</p>
                <p style="font-size:0.85rem; margin-top:6px;">اختر قهوتك المفضلة من المنيو الإلكتروني وخصص حجمها وإضافاتها</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map((item, idx) => `
        <div class="cart-item" style="display:flex; gap:12px; padding:12px; border-bottom:1px solid rgba(41,151,216,0.12); align-items:flex-start;">
            <img src="${item.image}" alt="${item.name}" style="width:64px; height:64px; border-radius:12px; object-fit:cover; flex-shrink:0;">
            <div style="flex:1; min-width:0;">
                <h4 style="font-size:0.92rem; color:var(--text-dark); margin-bottom:3px; font-weight:800;">${item.name}</h4>
                ${item.selectedOption ? `<div style="font-size:0.76rem; color:var(--primary); font-weight:700; line-height:1.4;">${item.selectedOption}</div>` : ''}
                ${item.calories !== undefined && item.calories !== '' ? `<div style="font-size:0.72rem; color:#0284c7;"><i class="fa-solid fa-fire-flame-curved"></i> ${item.calories} سعرة</div>` : ''}
                ${item.customText ? `<div style="font-size:0.74rem; color:var(--text-muted); background:#F0F9FF; padding:3px 7px; border-radius:6px; margin-top:3px;">ملاحظة: ${item.customText}</div>` : ''}
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                    <span style="font-weight:800; color:var(--text-dark); font-size:0.9rem;">${formatSAR(item.price * item.quantity)}</span>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <button type="button" onclick="updateCartItemQty(${idx}, -1)" style="width:26px; height:26px; border-radius:6px; border:1px solid var(--glass-border); background:#fff; cursor:pointer; font-weight:bold;">-</button>
                        <span style="font-weight:800; font-size:0.88rem;">${item.quantity}</span>
                        <button type="button" onclick="updateCartItemQty(${idx}, 1)" style="width:26px; height:26px; border-radius:6px; border:1px solid var(--glass-border); background:#fff; cursor:pointer; font-weight:bold;">+</button>
                        <button type="button" onclick="removeCartItem(${idx})" style="background:none; border:none; color:#ef4444; cursor:pointer; margin-right:4px;" title="حذف"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// NAVIGATION & CHECKOUT
function navigateTo(viewName) {
    document.querySelectorAll('.view-panel').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(`${viewName}-view`);
    if (target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'checkout') {
        updateShippingMethod(globalOrderMode, true);
        renderCheckoutSummary();
    }
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('open');
        navMenu.classList.toggle('active');
    }
}

function goToCheckout() {
    if (cart.length === 0) {
        showToast('السلة فارغة! أضف مشروبك المفضل أولاً ☕', 'error');
        return;
    }
    toggleCart(false);
    navigateTo('checkout');
}

function updateShippingMethod(type, syncRadio = false) {
    currentShippingType = type;
    globalOrderMode = type;

    if (syncRadio) {
        const r = document.getElementById(`ship-${type}`);
        if (r) r.checked = true;
    }

    ['pickup', 'dinein', 'delivery'].forEach(m => {
        const lbl = document.getElementById(`label-ship-${m}`);
        if (lbl) {
            lbl.style.border = (m === type) ? '2px solid var(--primary)' : '1px solid rgba(41, 151, 216, 0.2)';
            lbl.style.background = (m === type) ? 'rgba(41, 151, 216, 0.06)' : '#fff';
        }
    });

    const tableCarGroup = document.getElementById('table-or-car-group');
    const tableCarLabel = document.getElementById('table-or-car-label');
    const tableCarInput = document.getElementById('cust-table-car');
    const addrGroup = document.getElementById('address-form-group');

    const settings = getStoreSettings();
    const baseDeliveryFee = settings.deliveryFee !== undefined ? Number(settings.deliveryFee) : 15;

    if (type === 'pickup') {
        currentShippingCost = 0;
        if (tableCarGroup) tableCarGroup.style.display = 'block';
        if (addrGroup) addrGroup.style.display = 'none';
        if (tableCarLabel) tableCarLabel.textContent = 'تفاصيل الاستلام (نوع ولون السيارة / رقم اللوحة - أو استلام من الكاونتر) *';
        if (tableCarInput && (!tableCarInput.value || tableCarInput.value.includes('طاولة'))) {
            tableCarInput.value = quickTableOrCarNote || 'استلام من الفرع / السيارة';
        }
    } else if (type === 'dinein') {
        currentShippingCost = 0;
        if (tableCarGroup) tableCarGroup.style.display = 'block';
        if (addrGroup) addrGroup.style.display = 'none';
        if (tableCarLabel) tableCarLabel.textContent = 'رقم الطاولة داخل الكافيه *';
        if (tableCarInput) {
            tableCarInput.placeholder = 'مثال: طاولة رقم 4 (أو جلسة خارجية)';
            if (!quickTableOrCarNote) tableCarInput.value = 'طاولة رقم 1 - محلي';
        }
    } else if (type === 'delivery') {
        currentShippingCost = baseDeliveryFee;
        if (tableCarGroup) tableCarGroup.style.display = 'none';
        if (addrGroup) addrGroup.style.display = 'block';
    }

    renderCheckoutSummary();
}

function selectPaymentMethod(method) {
    currentPaymentMethod = method;
    const radios = { card: 'pay-card', applepay: 'pay-applepay', paylink: 'pay-paylink', pos: 'pay-pos' };
    const r = document.getElementById(radios[method]);
    if (r) r.checked = true;

    const cards = document.querySelectorAll('.payment-method-card');
    const order = ['card', 'applepay', 'paylink', 'pos'];
    cards.forEach((c, idx) => {
        const isSelected = order[idx] === method;
        c.classList.toggle('active', isSelected);
        c.style.border = isSelected ? '1.5px solid var(--primary)' : '1px solid rgba(41,151,216,0.2)';
        c.style.background = isSelected ? 'rgba(41,151,216,0.06)' : '#fff';
    });
}

function applyCoupon() {
    const codeInput = document.getElementById('coupon-code');
    const msgEl = document.getElementById('coupon-message');
    if (!codeInput || !msgEl) return;

    const code = codeInput.value.trim().toUpperCase();
    const coupons = {
        'SAMA10': 10,
        'COFFEE10': 10,
        'SAMA5': 5,
        'VIP15': 15
    };

    if (coupons[code]) {
        appliedCoupon = code;
        discountPercentage = coupons[code];
        msgEl.style.display = 'block';
        msgEl.style.color = '#10b981';
        msgEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> تم تفعيل كود الخصم (${code}) بنجاح — خصم ${discountPercentage}%!`;
        renderCheckoutSummary();
    } else {
        appliedCoupon = null;
        discountPercentage = 0;
        msgEl.style.display = 'block';
        msgEl.style.color = '#ef4444';
        msgEl.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> كود الخصم غير صحيح. جرب الكود: SAMA10`;
        renderCheckoutSummary();
    }
}

function getOrderTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity || 1)), 0);
    const discountAmount = discountPercentage > 0 ? (subtotal * (discountPercentage / 100)) : 0;
    const afterDiscount = Math.max(0, subtotal - discountAmount);
    const shipping = (currentShippingType === 'delivery' && afterDiscount < 120) ? currentShippingCost : 0;
    const total = afterDiscount + shipping;
    return { subtotal, discountAmount, shipping, total };
}

function renderCheckoutSummary() {
    const summaryContainer = document.getElementById('checkout-summary-items');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = cart.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed rgba(41,151,216,0.15); font-size:0.88rem;">
            <div>
                <div style="font-weight:800; color:var(--text-dark);">${item.quantity}x ${item.name}</div>
                ${item.selectedOption ? `<div style="font-size:0.75rem; color:var(--primary);">${item.selectedOption}</div>` : ''}
                ${item.calories !== undefined && item.calories !== '' ? `<div style="font-size:0.72rem; color:#0284c7;">🔥 ${item.calories} سعرة</div>` : ''}
            </div>
            <div style="font-weight:800; color:var(--text-dark); white-space:nowrap;">${formatSAR(item.price * item.quantity)}</div>
        </div>
    `).join('');

    const { subtotal, discountAmount, shipping, total } = getOrderTotals();

    const subEl = document.getElementById('checkout-subtotal');
    const discRow = document.getElementById('coupon-discount-row');
    const discEl = document.getElementById('checkout-discount');
    const shipEl = document.getElementById('checkout-shipping');
    const totEl = document.getElementById('checkout-total');

    if (subEl) subEl.innerHTML = formatSAR(subtotal);
    if (discRow && discEl) {
        if (discountAmount > 0) {
            discRow.style.display = 'table-row';
            discEl.innerHTML = `-${formatSAR(discountAmount)}`;
        } else {
            discRow.style.display = 'none';
        }
    }
    if (shipEl) {
        shipEl.innerHTML = shipping === 0 ? '<span style="color:#10b981; font-weight:800;">مجاناً</span>' : formatSAR(shipping);
    }
    if (totEl) totEl.innerHTML = formatSAR(total);
}

// GPS Location Helper for Delivery
function getCurrentLocation() {
    const gpsText = document.getElementById('gps-text');
    const gpsStatus = document.getElementById('gps-status');
    const addrInput = document.getElementById('cust-address');

    if (!navigator.geolocation) {
        showToast('المتصفح لا يدعم تحديد الموقع الجغرافي', 'error');
        return;
    }

    if (gpsText) gpsText.textContent = 'جاري تحديد موقعك...';
    navigator.geolocation.getCurrentPosition(
        pos => {
            const lat = pos.coords.latitude.toFixed(6);
            const lng = pos.coords.longitude.toFixed(6);
            const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
            if (addrInput) addrInput.value = `موقعي عبر GPS: ${mapsUrl}`;
            if (gpsText) gpsText.textContent = 'تم تحديد الموقع';
            if (gpsStatus) gpsStatus.style.display = 'flex';
        },
        () => {
            if (gpsText) gpsText.textContent = 'تحديد موقعي';
            showToast('تعذر الوصول للموقع، يرجى كتابة العنوان يدوياً', 'error');
        }
    );
}

// SUBMIT CHECKOUT & GENERATE ORDER + INVOICE
async function handleCheckoutSubmit(e) {
    e.preventDefault();
    if (cart.length === 0) {
        showToast('السلة فارغة!', 'error');
        return;
    }

    const name = document.getElementById('cust-name')?.value.trim() || 'عميل سما كافيه';
    const phone = document.getElementById('cust-phone')?.value.trim() || '0500000000';
    const email = document.getElementById('cust-email')?.value.trim() || '';
    const city = document.getElementById('cust-city')?.value.trim() || 'الرياض';

    let receptionDetail = '';
    let orderTypeLabel = 'استلام من الفرع / السيارة';
    if (currentShippingType === 'pickup') {
        orderTypeLabel = 'استلام من الفرع / السيارة';
        receptionDetail = document.getElementById('cust-table-car')?.value.trim() || 'استلام من الفرع';
    } else if (currentShippingType === 'dinein') {
        orderTypeLabel = 'طلب محلي (للطاولة)';
        receptionDetail = document.getElementById('cust-table-car')?.value.trim() || 'محلي - داخل الكافيه';
    } else {
        orderTypeLabel = 'توصيل للموقع';
        receptionDetail = document.getElementById('cust-address')?.value.trim() || city;
    }

    const { subtotal, discountAmount, shipping, total } = getOrderTotals();

    const payLabels = {
        card: 'مدفوع إلكترونياً (بطاقة مدى / فيزا)',
        applepay: 'مدفوع عبر Apple Pay',
        paylink: 'رابط دفع مباشر / STC Pay',
        pos: 'الدفع عند الاستلام / الكاشير'
    };

    const orderId = `#SAMA-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
        id: orderId,
        date: new Date().toLocaleString('ar-SA'),
        timestamp: Date.now(),
        customer: {
            name,
            phone,
            email,
            city,
            address: `${orderTypeLabel} — ${receptionDetail}`
        },
        orderMode: currentShippingType,
        orderModeLabel: orderTypeLabel,
        receptionDetail,
        paymentMethod: payLabels[currentPaymentMethod] || 'مدفوع إلكترونياً',
        paymentCode: currentPaymentMethod,
        items: JSON.parse(JSON.stringify(cart)),
        subtotal: subtotal.toFixed(2),
        discount: discountAmount.toFixed(2),
        shipping: shipping === 0 ? 'مجاناً' : shipping.toFixed(2),
        total: `${total.toFixed(2)} ر.س`,
        totalNumeric: total,
        status: 'جديد - بانتظار التحضير'
    };

    pendingLastOrder = newOrder;

    if (currentPaymentMethod === 'applepay') {
        openApplePaySimulation(newOrder);
        return;
    }

    await finalizeCoffeeOrder(newOrder);
}

function openApplePaySimulation(order) {
    const overlay = document.getElementById('apple-pay-sheet-overlay');
    const sheet = document.getElementById('apple-pay-sheet');
    if (!overlay || !sheet) {
        finalizeCoffeeOrder(order);
        return;
    }
    document.getElementById('ap-shipping-address').textContent = order.orderModeLabel;
    document.getElementById('ap-contact').textContent = order.customer.phone;
    document.getElementById('ap-total-price').textContent = `${order.totalNumeric.toFixed(2)} SAR`;

    overlay.style.display = 'flex';
    setTimeout(() => {
        sheet.style.transform = 'translateY(0)';
    }, 30);
}

function closeApplePaySimulation() {
    const overlay = document.getElementById('apple-pay-sheet-overlay');
    const sheet = document.getElementById('apple-pay-sheet');
    if (sheet) sheet.style.transform = 'translateY(100%)';
    setTimeout(() => {
        if (overlay) overlay.style.display = 'none';
    }, 300);
}

function startApplePayBiometric() {
    const statusText = document.getElementById('ap-status-text');
    const icon = document.getElementById('ap-sensor-icon');
    if (statusText) statusText.textContent = 'جاري التحقق من Face ID...';
    if (icon) icon.style.color = '#10b981';

    setTimeout(() => {
        closeApplePaySimulation();
        if (pendingLastOrder) finalizeCoffeeOrder(pendingLastOrder);
    }, 900);
}

async function finalizeCoffeeOrder(order) {
    // 1. Save locally
    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem('coffee_orders')) || [];
    } catch (e) {
        orders = [];
    }
    orders.unshift(order);
    localStorage.setItem('coffee_orders', JSON.stringify(orders));

    // 2. Push to Cloud DB for Admin POS live receiver
    try {
        await fetch(`${CLOUD_DB_URL}/orders.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orders.slice(0, 150))
        });
    } catch (e) {}

    // 3. Clear cart
    cart = [];
    saveCart();
    updateCartUI();

    // 4. Populate Receipt Screen
    document.getElementById('receipt-order-id').textContent = order.id;
    document.getElementById('receipt-order-type').textContent = order.orderModeLabel;
    document.getElementById('receipt-name').textContent = order.customer.name;
    document.getElementById('receipt-phone').textContent = order.customer.phone;
    document.getElementById('receipt-address').textContent = order.receptionDetail;
    document.getElementById('receipt-payment').textContent = order.paymentMethod;
    document.getElementById('receipt-total').innerHTML = formatSAR(order.totalNumeric);

    const settings = getStoreSettings();
    const payLinkUrl = settings.directPaymentLink || 'https://paylink.sa';
    const mapUrl = settings.googleMapsUrl || 'https://maps.google.com/?q=24.8116,46.6128';

    const paylinkBtn = document.getElementById('receipt-paylink-btn');
    if (paylinkBtn) {
        paylinkBtn.href = payLinkUrl;
        paylinkBtn.style.display = (order.paymentCode === 'paylink') ? 'inline-flex' : 'none';
    }

    const printBtn = document.getElementById('success-print-btn');
    if (printBtn) {
        printBtn.onclick = () => printOrderUnified(order);
    }

    const waBtn = document.getElementById('whatsapp-confirm-btn');
    if (waBtn) {
        const itemsText = order.items.map(i => `• ${i.quantity}x ${i.name} (${i.selectedOption || ''})`).join('\n');
        const msg = encodeURIComponent(`مرحباً سما كافيه ☕💙\nتم إرسال طلبي رقم: ${order.id}\nالاسم: ${order.customer.name}\nنوع الطلب: ${order.orderModeLabel}\nالتفاصيل: ${order.receptionDetail}\nطريقة الدفع: ${order.paymentMethod}\n\nالمشروبات:\n${itemsText}\n\nالإجمالي: ${order.total}\n🔗 رابط الدفع: ${payLinkUrl}\n📍 موقع الفرع: ${mapUrl}`);
        waBtn.href = `https://wa.me/966535671116?text=${msg}`;
    }

    // Send automatic customer email invoice if email was provided
    if (order.customer.email && typeof window.sendAutomaticCustomerInvoiceEmail === 'function') {
        window.sendAutomaticCustomerInvoiceEmail(order);
    }

    navigateTo('success');
    showToast('تم إرسال طلبك لشاشة الباريستا بنجاح! ☕💙', 'success');
}

// PRINTABLE SIMPLIFIED TAX INVOICE (فاتورة ضريبية مبسطة)
function printOrderUnified(order) {
    if (!order) return;
    const totalNum = parseFloat(String(order.total).replace(/[^\d.]/g, '')) || 0;
    const preTax = (totalNum / 1.15).toFixed(2);
    const vatAmount = (totalNum - parseFloat(preTax)).toFixed(2);

    const itemsRows = (order.items || []).map((item, idx) => `
        <tr>
            <td style="padding:10px; border-bottom:1px solid #e2e8f0; text-align:center;">${idx + 1}</td>
            <td style="padding:10px; border-bottom:1px solid #e2e8f0; font-weight:700;">
                ${item.name}
                ${item.selectedOption ? `<div style="font-size:0.78rem; color:#2997D8;">${item.selectedOption}</div>` : ''}
                ${item.calories ? `<div style="font-size:0.72rem; color:#64748b;">السعرات: ${item.calories} سعرة</div>` : ''}
                ${item.customText ? `<div style="font-size:0.75rem; color:#475569;">ملاحظة: ${item.customText}</div>` : ''}
            </td>
            <td style="padding:10px; border-bottom:1px solid #e2e8f0; text-align:center;">${item.quantity}</td>
            <td style="padding:10px; border-bottom:1px solid #e2e8f0; text-align:center;">${Number(item.price).toFixed(2)} ر.س</td>
            <td style="padding:10px; border-bottom:1px solid #e2e8f0; text-align:center; font-weight:800;">${(Number(item.price) * Number(item.quantity)).toFixed(2)} ر.س</td>
        </tr>
    `).join('');

    const qrData = encodeURIComponent(`SAMA SPECIALTY COFFEE | Order:${order.id} | Total:${totalNum.toFixed(2)} SAR | VAT:${vatAmount} SAR`);
    const win = window.open('', '_blank', 'width=820,height=900');
    if (!win) {
        showToast('يرجى السماح بالنوافذ المنبثقة لطباعة الفاتورة', 'error');
        return;
    }

    win.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>فاتورة ضريبية مبسطة - ${order.id} - سما كافيه</title>
            <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Tajawal', sans-serif; background: #f0f7fc; color: #0F2942; padding: 24px; margin: 0; }
                .invoice-box { max-width: 720px; margin: 0 auto; background: #fff; border-radius: 18px; padding: 32px; box-shadow: 0 10px 30px rgba(15,41,66,0.08); border: 1px solid #d4e6f1; }
                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2997D8; padding-bottom: 18px; margin-bottom: 20px; }
                .brand h1 { margin: 0; color: #0F2942; font-size: 1.6rem; }
                .brand p { margin: 4px 0 0; color: #2997D8; font-weight: 700; font-size: 0.9rem; }
                .badge { background: #E0F2FE; color: #0369A1; padding: 6px 14px; border-radius: 20px; font-weight: 800; font-size: 0.85rem; }
                table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                th { background: #0F2942; color: #fff; padding: 10px; font-size: 0.88rem; }
                .totals { margin-top: 20px; width: 300px; margin-right: auto; background: #F4F9FC; padding: 16px; border-radius: 12px; border: 1px solid #d4e6f1; }
                .totals-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; }
                .totals-row.grand { font-size: 1.15rem; font-weight: 800; color: #2997D8; border-top: 1px solid #cbd5e1; padding-top: 8px; }
                @media print { .no-print { display: none !important; } body { background: #fff; padding: 0; } .invoice-box { box-shadow: none; border: none; } }
            </style>
        </head>
        <body>
            <div class="invoice-box">
                <div class="no-print" style="text-align:left; margin-bottom:15px;">
                    <button onclick="window.print()" style="background:#2997D8; color:#fff; border:none; padding:10px 22px; border-radius:8px; font-family:'Tajawal',sans-serif; font-weight:800; cursor:pointer;">🖨️ طباعة / حفظ PDF</button>
                </div>
                <div class="header">
                    <div class="brand">
                        <h1>سما كافيه | SAMA SPECIALTY COFFEE</h1>
                        <p>قهوة مختصة • محمصة • مخبوزات طازجة</p>
                        <div style="font-size:0.8rem; color:#64748b; margin-top:4px;">الرياض - الرقم الضريبي: 310123456700003</div>
                    </div>
                    <div style="text-align:left;">
                        <span class="badge">فاتورة ضريبية مبسطة</span>
                        <div style="font-weight:800; font-size:1.1rem; margin-top:8px;">${order.id}</div>
                        <div style="font-size:0.8rem; color:#64748b;">${order.date}</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; background:#F4F9FC; padding:14px; border-radius:12px; font-size:0.88rem;">
                    <div><strong>العميل:</strong> ${order.customer?.name || ''}</div>
                    <div><strong>الجوال:</strong> <span dir="ltr">${order.customer?.phone || ''}</span></div>
                    <div><strong>آلية الاستلام:</strong> ${order.orderModeLabel || order.customer?.address || ''}</div>
                    <div><strong>طريقة الدفع:</strong> ${order.paymentMethod || ''}</div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th style="text-align:right;">المشروب / الصنف والخيارات</th>
                            <th>الكمية</th>
                            <th>سعر الوحدة</th>
                            <th>الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>${itemsRows}</tbody>
                </table>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:24px; flex-wrap:wrap; gap:16px;">
                    <div style="text-align:center;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=115x115&data=${qrData}" alt="ZATCA QR" style="width:110px; height:110px; border:1px solid #e2e8f0; padding:4px; border-radius:8px;">
                        <div style="font-size:0.72rem; color:#64748b; margin-top:4px;">رمز الفاتورة الضريبية QR</div>
                    </div>
                    <div class="totals">
                        <div class="totals-row"><span>المجموع (غير شامل الضريبة):</span><strong>${preTax} ر.س</strong></div>
                        <div class="totals-row"><span>ضريبة القيمة المضافة (15%):</span><strong>${vatAmount} ر.س</strong></div>
                        <div class="totals-row"><span>رسوم التوصيل:</span><strong>${order.shipping || 'مجاناً'}</strong></div>
                        <div class="totals-row grand"><span>الإجمالي الشامل للضريبة:</span><strong>${totalNum.toFixed(2)} ر.س</strong></div>
                    </div>
                </div>
                <div style="text-align:center; margin-top:24px; font-size:0.82rem; color:#64748b; border-top:1px dashed #cbd5e1; padding-top:12px;">
                    شكراً لزيارتكم سما كافيه للقهوة المختصة 💙 نتمنى لكم يوماً رايقاً!
                </div>
            </div>
        </body>
        </html>
    `);
    win.document.close();
}

// REVIEWS & POLICIES
const defaultReviews = [
    { name: 'سارة القحطاني', stars: 5, text: 'تصميم الكوفي واللون السماوي يشرح الصدر، والسبانيش لاتيه عندهم موزون بشكل خيالي مع توضيح السعرات الحرارية لكل مشروب 💙☕' },
    { name: 'فهد العتيبي', stars: 5, text: 'طلبت من المنيو الإلكتروني استلام من السيارة، ما أخذ الطلب 6 دقائق إلا والباريستا طالع لي بالقهوة والكرواسون حار وطازج!' },
    { name: 'نورة السديري', stars: 5, text: 'محصول إثيوبيا قوجي للـ V60 من أجمل المحاصيل اللي جربتها بالرياض، وبوكس الجمعات البارد يواجه جداً.' }
];

function renderReviews() {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;
    let reviews = defaultReviews;
    try {
        const saved = JSON.parse(localStorage.getItem('coffee_reviews'));
        if (Array.isArray(saved) && saved.length > 0) reviews = saved;
    } catch (e) {}

    grid.innerHTML = reviews.map(r => `
        <div class="checkout-card" style="padding:22px; background:#fff; border-radius:16px; border:1px solid var(--glass-border);">
            <div style="color:#f59e0b; margin-bottom:8px; font-size:0.95rem;">
                ${'<i class="fa-solid fa-star"></i>'.repeat(Number(r.stars || 5))}
            </div>
            <p style="color:var(--text-dark); font-size:0.92rem; line-height:1.6; margin-bottom:12px;">"${r.text}"</p>
            <div style="font-weight:800; color:var(--primary); font-size:0.85rem;"><i class="fa-regular fa-user"></i> ${r.name}</div>
        </div>
    `).join('');
}

function openReviewModal() {
    const m = document.getElementById('review-modal');
    if (m) m.classList.add('active');
    setReviewStars(5);
}

function closeReviewModal() {
    const m = document.getElementById('review-modal');
    if (m) m.classList.remove('active');
}

function setReviewStars(count) {
    document.getElementById('review-stars-val').value = count;
    document.querySelectorAll('.star-rating-selector i').forEach(star => {
        const s = Number(star.getAttribute('data-star'));
        star.style.color = s <= count ? '#f59e0b' : '#cbd5e1';
    });
}

function submitStoreReview(e) {
    e.preventDefault();
    const name = document.getElementById('review-author-name').value.trim();
    const stars = Number(document.getElementById('review-stars-val').value || 5);
    const text = document.getElementById('review-author-text').value.trim();
    if (!name || !text) return;

    let reviews = [...defaultReviews];
    try {
        const saved = JSON.parse(localStorage.getItem('coffee_reviews'));
        if (Array.isArray(saved) && saved.length > 0) reviews = saved;
    } catch (err) {}

    reviews.unshift({ name, stars, text });
    localStorage.setItem('coffee_reviews', JSON.stringify(reviews));
    renderReviews();
    closeReviewModal();
    const promo = document.getElementById('promo-reward-modal');
    if (promo) promo.classList.add('active');
}

function closePromoRewardModal() {
    const promo = document.getElementById('promo-reward-modal');
    if (promo) promo.classList.remove('active');
}

function openPolicyModal(type) {
    const modal = document.getElementById('policy-modal');
    const title = document.getElementById('policy-modal-title');
    const body = document.getElementById('policy-modal-body');
    if (!modal || !title || !body) return;

    if (type === 'shipping') {
        title.innerHTML = '<i class="fa-solid fa-mug-saucer" style="color:var(--primary);"></i> آلية الطلب والاستلام من سما كافيه';
        body.innerHTML = `
            <p style="line-height:1.8; color:var(--text-dark); font-size:0.92rem;">
                <strong>1. الاستلام من الفرع أو السيارة (Curbside Pickup):</strong><br>
                اطلب مسبقاً عبر المنيو الإلكتروني وسنبدأ بتحضير طلبك فوراً ليكون جاهزاً خلال 5 إلى 10 دقائق. عند وصولك يمكنك استلامه من الكاونتر أو إدخال نوع ورقم لوحة سيارتك ليصلك الباريستا حتى نافذة سيارتك مجاناً.<br><br>
                <strong>2. الطلب المحلي للطاولة (Dine-in):</strong><br>
                امسح الباركود على طاولتك، اختر مشروبك والحلى المفضل، وأدخل رقم الطاولة ليتم تقديم الطلب مباشرة لطاولتك.<br><br>
                <strong>3. التوصيل السريع (Delivery):</strong><br>
                نوصل لجميع أحياء الرياض بحافظات حرارية وبوكسات تحفظ برودة وحرارة المشروبات.
            </p>
        `;
    } else if (type === 'terms') {
        title.innerHTML = '<i class="fa-solid fa-file-invoice-dollar" style="color:var(--primary);"></i> الشروط والأحكام وبيان السعرات';
        body.innerHTML = `
            <p style="line-height:1.8; color:var(--text-dark); font-size:0.92rem;">
                • جميع الأسعار المعروضة في منيو سما كافيه تشمل ضريبة القيمة المضافة (15%).<br>
                • يتم عرض السعرات الحرارية ومحتوى الكافيين لكل مشروب وحجم وفق اشتراطات هيئة الغذاء والدواء.<br>
                • في حال وجود أي ملاحظة على جودة المشروب، نسعد باستبداله لك فوراً بكل حب.
            </p>
        `;
    } else {
        title.innerHTML = '<i class="fa-solid fa-user-shield" style="color:var(--primary);"></i> سياسة الخصوصية';
        body.innerHTML = `
            <p style="line-height:1.8; color:var(--text-dark); font-size:0.92rem;">
                نلتزم في سما كافيه بحماية بيانات عملائنا (الاسم، رقم الجوال، البريد الإلكتروني) واستخدامها فقط لغرض تجهيز الطلبات وإرسال الفواتير الضريبية.
            </p>
        `;
    }
    modal.classList.add('active');
}

function closePolicyModal() {
    const modal = document.getElementById('policy-modal');
    if (modal) modal.classList.remove('active');
}

function shareProduct(productId) {
    const product = products.find(p => Number(p.id) === Number(productId));
    const url = window.location.href.split('#')[0];
    if (navigator.share && product) {
        navigator.share({ title: product.name, text: `${product.name} من سما كافيه`, url }).catch(() => {});
    } else {
        navigator.clipboard?.writeText(url);
        showToast('تم نسخ رابط المنيو للمشاركة 🔗', 'success');
    }
}

// Toast Notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.cssText = 'background:#0F2942; color:#fff; padding:12px 20px; border-radius:12px; margin-bottom:10px; box-shadow:0 8px 25px rgba(15,41,66,0.25); display:flex; align-items:center; gap:10px; font-weight:700; font-size:0.9rem; border-right:4px solid #2997D8;';
    toast.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-mug-hot'}" style="color:#7DD3FC;"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// Initialize App on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadProductsData();
    loadCart();
    applyDynamicStoreSettings();
    renderElectronicMenu();
    renderReviews();
    updateCartUI();
    syncFromCloudDB();
});
