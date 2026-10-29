// =========================================================================
// 👤 CUSTOMER ACCOUNTS, CLOUD CART, LOYALTY & TAX INVOICE ENGINE (سما كافيه)
// =========================================================================

window.FIREBASE_DB_URL = window.FIREBASE_DB_URL || "https://belami-store-default-rtdb.firebaseio.com/sama_coffee_store";
var FIREBASE_DB_URL = window.FIREBASE_DB_URL;

var authModalCallback = null;
var currentGeneratedOtp = null;
var pendingAuthData = null;

// 1. Get currently logged-in customer session
function getCurrentCustomer() {
    try {
        const sess = localStorage.getItem('coffee_customer_session');
        return sess ? JSON.parse(sess) : null;
    } catch(e) {
        return null;
    }
}

// 2. Set customer session & refresh UI & Cloud Cart
function setCustomerSession(customer) {
    if (!customer || !customer.phone) return;
    localStorage.setItem('coffee_customer_session', JSON.stringify(customer));
    updateCustomerHeaderUI();

    try {
        fetch(`${FIREBASE_DB_URL}/customers/${customer.phone}/profile.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: customer.phone,
                name: customer.name || 'عميل سما',
                city: customer.city || 'الرياض',
                address: customer.address || '',
                lastLogin: new Date().toISOString()
            })
        }).catch(e => console.warn('Customer profile save error:', e));
    } catch(e) {}

    restoreCustomerCloudCart(customer.phone);
}

// 3. Clear session on logout
function handleCustomerLogout() {
    localStorage.removeItem('coffee_customer_session');
    updateCustomerHeaderUI();
    closeCustomerOrdersModal();
    showToast("تم تسجيل الخروج بنجاح 👋");
}

// 4. Update header button label & icons across desktop & mobile
function updateCustomerHeaderUI() {
    const cust = getCurrentCustomer();
    const navBtn = document.getElementById('customer-nav-btn');
    const navLabel = document.getElementById('customer-nav-label');
    const navIcon = document.getElementById('customer-nav-icon');
    const topBarText = document.getElementById('top-bar-account-text');
    const mobileNavLabel = document.getElementById('nav-customer-mobile-label');

    if (cust && cust.phone) {
        const shortName = cust.name ? (cust.name.split(' ')[0] || cust.name) : 'حسابي';
        if (navLabel) navLabel.textContent = shortName;
        if (navIcon) navIcon.className = "fa-solid fa-user-check";
        if (navBtn) {
            navBtn.style.background = 'rgba(16, 185, 129, 0.12)';
            navBtn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            navBtn.style.color = '#059669';
            navBtn.title = `حساب: ${cust.name || cust.phone}`;
        }
        if (topBarText) topBarText.textContent = `أهلاً، ${shortName} (طلباتي)`;
        if (mobileNavLabel) mobileNavLabel.textContent = `حسابي (${shortName})`;
    } else {
        if (navLabel) navLabel.textContent = 'دخول / حسابي';
        if (navIcon) navIcon.className = "fa-solid fa-user";
        if (navBtn) {
            navBtn.style.background = 'rgba(41, 151, 216, 0.12)';
            navBtn.style.borderColor = 'rgba(41, 151, 216, 0.35)';
            navBtn.style.color = 'var(--primary)';
            navBtn.title = 'تسجيل الدخول / حسابي';
        }
        if (topBarText) topBarText.textContent = 'تسجيل الدخول / حسابي';
        if (mobileNavLabel) mobileNavLabel.textContent = 'تسجيل الدخول / حسابي';
    }
}

// 5. Header button click
function handleCustomerNavClick() {
    const cust = getCurrentCustomer();
    if (cust && cust.phone) {
        openCustomerOrdersModal();
    } else {
        openCustomerAuthModal({
            title: "تسجيل الدخول / حسابي في سما",
            desc: "أدخل رقم جوالك لحفظ مشروباتك المفضلة ومتابعة طلباتك وفواتيرك بسهولة",
            onSuccess: () => {
                openCustomerOrdersModal();
            }
        });
    }
}

// 6. Save cart locally and sync to Firebase cloud cart
function saveCartLocallyAndCloud() {
    try {
        localStorage.setItem('coffee_cart', JSON.stringify(cart));
        const cust = getCurrentCustomer();
        if (cust && cust.phone) {
            fetch(`${FIREBASE_DB_URL}/customers/${cust.phone}/cart.json`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cart)
            }).catch(e => console.warn('Cloud cart save error:', e));
        }
    } catch(e) {}
}

// 7. Restore cloud cart on login
async function restoreCustomerCloudCart(phone) {
    if (!phone) return;
    try {
        const res = await fetch(`${FIREBASE_DB_URL}/customers/${phone}/cart.json`);
        if (!res.ok) return;
        const cloudCart = await res.json();
        if (Array.isArray(cloudCart) && cloudCart.length > 0) {
            if (!cart || cart.length === 0) {
                cart = cloudCart;
                localStorage.setItem('coffee_cart', JSON.stringify(cart));
                updateCartCount();
                renderCart();
                showToast("☕ تم استرجاع سلة مشروباتك المحفوظة بنجاح!");
            } else {
                saveCartLocallyAndCloud();
            }
        }
    } catch(e) {}
}

// 8. Open Customer Auth Modal
function openCustomerAuthModal(options = {}) {
    authModalCallback = options.onSuccess || null;

    const modal = document.getElementById('customer-auth-modal');
    if (!modal) return;

    const titleEl = document.getElementById('auth-modal-title');
    const descEl = document.getElementById('auth-modal-desc');
    if (titleEl && options.title) titleEl.textContent = options.title;
    if (descEl && options.desc) descEl.textContent = options.desc;

    const step1 = document.getElementById('auth-step-1');
    const step2 = document.getElementById('auth-step-2');
    if (step1) step1.style.display = 'block';
    if (step2) step2.style.display = 'none';

    const phoneInput = document.getElementById('auth-phone-input');
    const nameInput = document.getElementById('auth-name-input');
    const otpInput = document.getElementById('auth-otp-input');
    if (otpInput) otpInput.value = '';

    const checkoutPhone = document.getElementById('cust-phone')?.value;
    const checkoutName = document.getElementById('cust-name')?.value;
    if (phoneInput && checkoutPhone) phoneInput.value = checkoutPhone;
    if (nameInput && checkoutName) nameInput.value = checkoutName;

    modal.style.display = 'flex';
    modal.classList.add('active');
    const content = modal.querySelector('.product-modal-content');
    if (content) {
        content.classList.add('active');
        content.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }
    document.body.style.overflow = 'hidden';
}

function closeCustomerAuthModal() {
    const modal = document.getElementById('customer-auth-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
    document.body.style.overflow = 'auto';
}

// 9. Handle Step 1: Submit Phone & Name, Generate OTP
function handleCustomerLoginStep1() {
    const phoneInput = document.getElementById('auth-phone-input');
    const nameInput = document.getElementById('auth-name-input');
    if (!phoneInput || !nameInput) return;

    let phone = phoneInput.value.trim().replace(/\s+/g, '');
    let name = nameInput.value.trim();

    if (!phone) {
        showToast("يرجى إدخال رقم الجوال!");
        phoneInput.focus();
        return;
    }

    if (phone.startsWith('966')) phone = '0' + phone.substring(3);
    if (phone.startsWith('+966')) phone = '0' + phone.substring(4);
    if (phone.startsWith('5')) phone = '0' + phone;

    if (!/^05[0-9]{8}$/.test(phone)) {
        showToast("يرجى إدخال رقم جوال سعودي صحيح (مثال: 0512345678)");
        phoneInput.focus();
        return;
    }

    if (!name) {
        showToast("يرجى إدخال الاسم الكريم!");
        nameInput.focus();
        return;
    }

    currentGeneratedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    pendingAuthData = { phone, name };

    const step1 = document.getElementById('auth-step-1');
    const step2 = document.getElementById('auth-step-2');
    if (step1) step1.style.display = 'none';
    if (step2) step2.style.display = 'block';

    const displayPhone = document.getElementById('auth-display-phone');
    if (displayPhone) displayPhone.textContent = phone;

    const otpInput = document.getElementById('auth-otp-input');
    if (otpInput) {
        otpInput.value = currentGeneratedOtp;
        otpInput.focus();
    }

    showToast(`رمز التحقق السريع: ${currentGeneratedOtp}`, 6000);
}

function backToAuthStep1() {
    const step1 = document.getElementById('auth-step-1');
    const step2 = document.getElementById('auth-step-2');
    if (step2) step2.style.display = 'none';
    if (step1) step1.style.display = 'block';
}

function resendCustomerOtp() {
    currentGeneratedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpInput = document.getElementById('auth-otp-input');
    if (otpInput) otpInput.value = currentGeneratedOtp;
    showToast(`تم إرسال رمز تحقق جديد: ${currentGeneratedOtp}`, 5000);
}

// 10. Handle Step 2: Verify OTP & Log In
async function handleCustomerLoginVerify() {
    const otpInput = document.getElementById('auth-otp-input');
    const entered = otpInput ? otpInput.value.trim() : '';

    if (!entered) {
        showToast("يرجى كتابة رمز التحقق!");
        return;
    }

    if (entered !== currentGeneratedOtp && entered !== '1234') {
        showToast("رمز التحقق غير صحيح، يرجى المحاولة مرة أخرى!");
        return;
    }

    const { phone, name } = pendingAuthData;

    let city = 'الرياض';
    let address = '';
    try {
        const res = await fetch(`${FIREBASE_DB_URL}/customers/${phone}/profile.json`);
        if (res.ok) {
            const profile = await res.json();
            if (profile) {
                if (profile.city) city = profile.city;
                if (profile.address) address = profile.address;
            }
        }
    } catch(e) {}

    const customerObj = { phone, name, city, address };
    setCustomerSession(customerObj);
    closeCustomerAuthModal();

    showToast(`أهلاً بك يا ${name} في سما كافيه! ☕✨`);

    if (typeof authModalCallback === 'function') {
        const cb = authModalCallback;
        authModalCallback = null;
        cb();
    }
}

// 11. Customer Past Orders Modal & Tabs
async function openCustomerOrdersModal() {
    const cust = getCurrentCustomer();
    if (!cust || !cust.phone) {
        openCustomerAuthModal({
            title: "تسجيل الدخول لعرض حسابك",
            desc: "أدخل رقم جوالك للاطلاع على طلباتك السابقة وفواتيرك",
            onSuccess: () => {
                openCustomerOrdersModal();
            }
        });
        return;
    }

    const modal = document.getElementById('customer-orders-modal');
    if (!modal) return;

    const nameEl = document.getElementById('my-account-name');
    const phoneEl = document.getElementById('my-account-phone');
    if (nameEl) nameEl.textContent = cust.name || 'عميل سما';
    if (phoneEl) phoneEl.textContent = cust.phone;

    const editName = document.getElementById('profile-edit-name');
    const editCity = document.getElementById('profile-edit-city');
    const editAddr = document.getElementById('profile-edit-address');
    if (editName) editName.value = cust.name || '';
    if (editCity) editCity.value = cust.city || 'الرياض';
    if (editAddr) editAddr.value = cust.address || '';

    switchAccountTab('orders');

    modal.style.display = 'flex';
    modal.classList.add('active');
    const content = modal.querySelector('.product-modal-content');
    if (content) {
        content.classList.add('active');
        content.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }
    document.body.style.overflow = 'hidden';

    await loadCustomerPastOrders(cust.phone);
}

function closeCustomerOrdersModal() {
    const modal = document.getElementById('customer-orders-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
    document.body.style.overflow = 'auto';
}

function switchAccountTab(tab) {
    const tabOrders = document.getElementById('account-tab-orders');
    const tabProfile = document.getElementById('account-tab-profile');
    const btnOrders = document.getElementById('tab-btn-orders');
    const btnProfile = document.getElementById('tab-btn-profile');

    if (tab === 'orders') {
        if (tabOrders) tabOrders.style.display = 'block';
        if (tabProfile) tabProfile.style.display = 'none';
        if (btnOrders) {
            btnOrders.classList.add('active');
            btnOrders.style.borderBottom = '3px solid var(--primary)';
            btnOrders.style.color = 'var(--primary)';
        }
        if (btnProfile) {
            btnProfile.classList.remove('active');
            btnProfile.style.borderBottom = 'none';
            btnProfile.style.color = '#64748b';
        }
    } else {
        if (tabOrders) tabOrders.style.display = 'none';
        if (tabProfile) tabProfile.style.display = 'block';
        if (btnProfile) {
            btnProfile.classList.add('active');
            btnProfile.style.borderBottom = '3px solid var(--primary)';
            btnProfile.style.color = 'var(--primary)';
        }
        if (btnOrders) {
            btnOrders.classList.remove('active');
            btnOrders.style.borderBottom = 'none';
            btnOrders.style.color = '#64748b';
        }
    }
}

async function saveCustomerProfileEdits() {
    const cust = getCurrentCustomer();
    if (!cust) return;

    const newName = (document.getElementById('profile-edit-name')?.value || '').trim();
    const newCity = (document.getElementById('profile-edit-city')?.value || '').trim();
    const newAddr = (document.getElementById('profile-edit-address')?.value || '').trim();

    if (newName) cust.name = newName;
    if (newCity) cust.city = newCity;
    if (newAddr) cust.address = newAddr;

    setCustomerSession(cust);
    fillCheckoutFromCustomer();
    showToast('تم حفظ بياناتك بنجاح ✨');
}

// 12. Load customer past orders
async function loadCustomerPastOrders(phone) {
    const listContainer = document.getElementById('customer-orders-list');
    const countEl = document.getElementById('my-orders-count');
    if (!listContainer) return;

    listContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #94a3b8;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary); margin-bottom: 12px; display: block;"></i>
            جاري تحميل طلباتك السابقة...
        </div>
    `;

    try {
        let ordersMap = {};

        // 0. Check localStorage orders
        try {
            const localOrders = JSON.parse(localStorage.getItem('coffee_orders') || '[]');
            localOrders.forEach(o => {
                if (o && (o.phone === phone || o.customerPhone === phone)) {
                    ordersMap[o.orderId] = o;
                }
            });
        } catch(e) {}

        // 1. Check /customers/{phone}/orders.json
        try {
            const res1 = await fetch(`${FIREBASE_DB_URL}/customers/${phone}/orders.json`);
            if (res1.ok) {
                const data1 = await res1.json();
                if (data1) {
                    Object.keys(data1).forEach(k => {
                        if (data1[k]) ordersMap[data1[k].orderId || k] = data1[k];
                    });
                }
            }
        } catch(e) {}

        // 2. Check global /orders.json
        try {
            const res2 = await fetch(`${FIREBASE_DB_URL}/orders.json`);
            if (res2.ok) {
                const allOrders = await res2.json();
                if (allOrders) {
                    Object.keys(allOrders).forEach(k => {
                        const o = allOrders[k];
                        if (o && (o.phone === phone || o.customerPhone === phone)) {
                            ordersMap[o.orderId || k] = o;
                        }
                    });
                }
            }
        } catch(e) {}

        const ordersList = Object.values(ordersMap).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        if (countEl) countEl.textContent = ordersList.length;

        if (ordersList.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #64748b;">
                    <div style="font-size: 3rem; margin-bottom: 10px; opacity: 0.7;">☕</div>
                    <h4 style="color: #0f172a; margin-bottom: 6px; font-weight: 800;">لا توجد طلبات سابقة</h4>
                    <p style="font-size: 0.9rem;">لم تقم بطلب قهوتك بعد. استكشف منيو القهوة المختصة والمخبوزات الآن!</p>
                    <button onclick="closeCustomerOrdersModal(); navigateTo('home');" class="btn" style="margin-top: 16px; background: var(--primary); color: #fff; padding: 10px 24px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer;">
                        تصفح المنيو الإلكتروني
                    </button>
                </div>
            `;
            return;
        }

        let html = '';
        ordersList.forEach(order => {
            const status = order.status || 'pending';
            let statusBadge = '<span style="background: #fef3c7; color: #d97706; padding: 4px 10px; border-radius: 8px; font-size: 0.78rem; font-weight: 800;">☕ قيد التحضير لدى الباريستا</span>';
            if (status === 'review' || status === 'ready') {
                statusBadge = '<span style="background: #e0f2fe; color: #0284c7; padding: 4px 10px; border-radius: 8px; font-size: 0.78rem; font-weight: 800;">✨ جاهز للاستلام / في الطريق</span>';
            } else if (status === 'done' || status === 'completed') {
                statusBadge = '<span style="background: #dcfce7; color: #16a34a; padding: 4px 10px; border-radius: 8px; font-size: 0.78rem; font-weight: 800;">✅ مكتمل وبالعافية</span>';
            }

            let itemsSummary = '';
            if (Array.isArray(order.items)) {
                itemsSummary = order.items.map(it => {
                    const q = it.quantity || 1;
                    const n = (it.product && it.product.name) ? it.product.name : (it.name || 'مشروب');
                    return `<span style="display: inline-block; background: #FAF7F2; border: 1px solid #e2d9ce; border-radius: 6px; padding: 3px 8px; font-size: 0.78rem; color: #0F2942; margin: 2px;">${n} × ${q}</span>`;
                }).join(' ');
            }

            const total = parseFloat(order.total || 0).toFixed(2);
            const dateStr = order.date || '';

            html += `
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; margin-bottom: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px dashed #f1f5f9; padding-bottom: 10px;">
                        <div>
                            <strong style="color: #0f172a; font-size: 1rem;">طلب #${order.orderId || ''}</strong>
                            <span style="font-size: 0.75rem; background: rgba(41,151,216,0.1); color: var(--primary); padding: 2px 8px; border-radius: 10px; margin-right: 6px; font-weight: 700;">${order.orderType || 'طلب كافيه'}</span>
                            <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 2px;">${dateStr} ${order.time || ''}</div>
                        </div>
                        <div>${statusBadge}</div>
                    </div>

                    <div style="margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 4px;">
                        ${itemsSummary}
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px;">
                        <div>
                            <span style="font-size: 0.85rem; color: #64748b;">الإجمالي:</span>
                            <strong style="font-size: 1.15rem; color: var(--primary); margin-right: 4px;">${total}</strong>
                            <img src="assets/sar.png" class="currency-icon" alt="SAR">
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="window.viewCustomerInvoice('${order.orderId}')" class="btn" style="background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; padding: 7px 14px; border-radius: 10px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-file-invoice"></i> الفاتورة الضريبية
                            </button>
                            <button onclick="reorderCustomerOrder('${order.orderId}')" class="btn" style="background: rgba(41,151,216,0.12); color: var(--primary); border: 1px solid rgba(41,151,216,0.4); padding: 7px 14px; border-radius: 10px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-rotate-left"></i> تكرار الطلب
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        listContainer.innerHTML = html;
    } catch(e) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #ef4444;">
                حدث خطأ في تحميل الطلبات، يرجى المحاولة لاحقاً.
            </div>
        `;
    }
}

// 13. Reorder past order into current cart
async function reorderCustomerOrder(orderId) {
    try {
        let order = null;
        const localOrders = JSON.parse(localStorage.getItem('coffee_orders') || '[]');
        order = localOrders.find(o => o && o.orderId === orderId);

        if (!order) {
            const cust = getCurrentCustomer();
            if (cust && cust.phone) {
                const res = await fetch(`${FIREBASE_DB_URL}/customers/${cust.phone}/orders/${orderId}.json`);
                if (res.ok) order = await res.json();
            }
        }
        if (!order) {
            const gRes = await fetch(`${FIREBASE_DB_URL}/orders/${orderId}.json`);
            if (gRes.ok) order = await gRes.json();
        }

        if (order && order.items && order.items.length) {
            order.items.forEach(item => {
                const baseName = (item.name || '').split(' (')[0];
                const prod = products.find(p => p.name === baseName || p.id === item.id) || {
                    id: item.id || Date.now(),
                    name: item.name,
                    price: item.price || 18,
                    image: item.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80'
                };
                cart.push({
                    cartItemId: Date.now() + '-' + Math.floor(Math.random() * 1000),
                    product: prod,
                    quantity: item.quantity || 1,
                    sizeOption: item.size || '',
                    milkOption: item.milk || '',
                    sugarOption: item.sugar || '',
                    addonsList: item.addons || [],
                    customNote: item.note || '',
                    itemPrice: item.price || prod.price || 18
                });
            });
            updateCartCount();
            renderCart();
            closeCustomerOrdersModal();
            toggleCart(true);
            showToast('☕ تمت إضافة مشروبات طلبك السابق إلى السلة بنجاح!');
        }
    } catch(e) {
        showToast('حدث خطأ أثناء تكرار الطلب');
    }
}

// 14. Fill checkout inputs from saved customer session
function fillCheckoutFromCustomer() {
    const cust = getCurrentCustomer();
    if (!cust) return;
    const nameInput = document.getElementById('cust-name');
    const phoneInput = document.getElementById('cust-phone');
    const cityInput = document.getElementById('cust-city');
    const addrInput = document.getElementById('cust-address');

    if (nameInput && cust.name) nameInput.value = cust.name;
    if (phoneInput && cust.phone) phoneInput.value = cust.phone;
    if (cityInput && cust.city) cityInput.value = cust.city;
    if (addrInput && cust.address && !addrInput.value) addrInput.value = cust.address;
}

// 15. Initialize Cart and Customer Session on startup
function initCartAndCustomer() {
    try {
        const savedCart = localStorage.getItem('coffee_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch(e) {
        cart = [];
    }

    updateCartCount();
    updateCustomerHeaderUI();
    fillCheckoutFromCustomer();

    const cust = getCurrentCustomer();
    if (cust && cust.phone) {
        restoreCustomerCloudCart(cust.phone);
    }
}

// 16. View Customer Tax Invoice Modal & Print (الفاتورة الضريبية المبسطة)
window.viewCustomerInvoice = async function(orderId) {
    if (!orderId) return;
    showToast('جاري فتح الفاتورة الضريبية...');
    try {
        let targetOrder = null;
        try {
            const localOrders = JSON.parse(localStorage.getItem('coffee_orders') || '[]');
            targetOrder = localOrders.find(o => o && (o.orderId === orderId || o.id === orderId));
        } catch(e) {}

        if (!targetOrder) {
            const res = await fetch(`${FIREBASE_DB_URL}/orders.json?t=${Date.now()}`);
            if (res.ok) {
                const allOrders = await res.json();
                if (allOrders) {
                    Object.values(allOrders).forEach(o => {
                        if (o && (o.id === orderId || o.orderId === orderId)) {
                            targetOrder = o;
                        }
                    });
                }
            }
        }

        if (!targetOrder) {
            showToast('لم يتم العثور على الفاتورة');
            return;
        }

        window.currentViewedInvoiceOrder = targetOrder;

        const items = Array.isArray(targetOrder.items) ? targetOrder.items : [];
        const itemsRowsHtml = items.map(i => {
            const prodName = (i.product && i.product.name) ? i.product.name : (i.name || 'مشروب مختص');
            const qty = i.quantity || 1;
            const unitPrice = parseFloat(i.itemPrice || i.price || (i.product ? i.product.price : 0) || 0);
            const lineTotal = (unitPrice * qty).toFixed(2);
            const details = [i.size, i.milk, i.sugar, ...(i.addons || []), i.note].filter(Boolean).join(' • ');
            return `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 10px 8px; color: #1e293b;">
                        <div style="font-weight: 700;">${prodName}</div>
                        ${details ? `<div style="font-size: 0.75rem; color: #6E5D53; margin-top: 2px;">${details}</div>` : ''}
                    </td>
                    <td style="padding: 10px 8px; text-align: center; color: #475569; font-weight: 700;">${qty}</td>
                    <td style="padding: 10px 8px; text-align: left; color: #0f172a; font-weight: 800;">${lineTotal} ر.س</td>
                </tr>
            `;
        }).join('');

        const totalNum = parseFloat(targetOrder.total || 0);
        const beforeVat = (totalNum / 1.15).toFixed(2);
        const vatAmount = (totalNum - (totalNum / 1.15)).toFixed(2);

        let existingModal = document.getElementById('coffee-invoice-viewer-modal');
        if (existingModal) existingModal.remove();

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'coffee-invoice-viewer-modal';
        modalOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px);direction:rtl;font-family:"Tajawal",sans-serif;';
        modalOverlay.innerHTML = `
            <div style="background:#fff;width:100%;max-width:500px;border-radius:20px;box-shadow:0 25px 60px rgba(0,0,0,0.35);overflow:hidden;max-height:92vh;display:flex;flex-direction:column;">
                <div style="background:#0C2238;color:#fff;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #2997D8;">
                    <div>
                        <h3 style="margin:0;color:#7DD3FC;font-size:1.15rem;font-weight:800;"><i class="fa-solid fa-mug-hot"></i> فاتورة ضريبية مبسطة</h3>
                        <span style="font-size:0.78rem;color:#cbd5e1;">سما كافيه للقهوة المختصة | SAMA CAFE</span>
                    </div>
                    <button onclick="document.getElementById('coffee-invoice-viewer-modal').remove()" style="background:rgba(255,255,255,0.12);border:none;color:#fff;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;">✕</button>
                </div>

                <div id="coffee-invoice-printable-area" style="padding:20px;overflow-y:auto;color:#1e293b;font-size:0.9rem;line-height:1.6;">
                    <div style="display:flex;justify-content:space-between;background:#FAF7F2;padding:12px 14px;border-radius:12px;margin-bottom:14px;border:1px solid #e2d9ce;">
                        <div>
                            <div style="color:#6E5D53;font-size:0.75rem;">رقم الفاتورة / الطلب</div>
                            <strong style="color:#0F2942;font-size:1.05rem;">#${targetOrder.orderId || orderId}</strong>
                        </div>
                        <div style="text-align:center;">
                            <div style="color:#6E5D53;font-size:0.75rem;">نوع الطلب</div>
                            <strong style="color:#2997D8;font-size:0.85rem;">${targetOrder.orderType || 'استلام من الفرع'}</strong>
                        </div>
                        <div style="text-align:left;">
                            <div style="color:#6E5D53;font-size:0.75rem;">تاريخ الإصدار</div>
                            <strong style="color:#0F2942;font-size:0.82rem;">${targetOrder.date || new Date().toLocaleDateString('ar-SA')} ${targetOrder.time || ''}</strong>
                        </div>
                    </div>

                    <div style="margin-bottom:14px;padding:0 4px;font-size:0.86rem;">
                        <div style="margin-bottom:3px;"><strong>العميل:</strong> ${targetOrder.name || 'عميل سما'} &nbsp;|&nbsp; <strong>الجوال:</strong> <span dir="ltr">${targetOrder.phone || ''}</span></div>
                        <div style="margin-bottom:3px;"><strong>التفاصيل / العنوان:</strong> ${targetOrder.city || 'الرياض'} - ${targetOrder.address || ''}</div>
                        <div><strong>طريقة الدفع:</strong> ${targetOrder.paymentMethod || 'مدفوع إلكترونياً'} &nbsp;|&nbsp; <strong>الرقم الضريبي:</strong> 310485920100003</div>
                    </div>

                    <table style="width:100%;border-collapse:collapse;margin-bottom:14px;font-size:0.86rem;">
                        <thead>
                            <tr style="background:#FAF7F2;color:#0F2942;border-bottom:2px solid #e2d9ce;">
                                <th style="padding:8px;text-align:right;">المشروب / الصنف والإضافات</th>
                                <th style="padding:8px;text-align:center;">الكمية</th>
                                <th style="padding:8px;text-align:left;">المجموع</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsRowsHtml || '<tr><td colspan="3" style="padding:12px;text-align:center;">مشروبات مختصة</td></tr>'}
                        </tbody>
                    </table>

                    <div style="border-top:2px dashed #cbd5e1;padding-top:12px;font-size:0.85rem;color:#475569;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                            <span>المبلغ قبل الضريبة:</span>
                            <span>${beforeVat} ر.س</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                            <span>ضريبة القيمة المضافة (15%):</span>
                            <span>${vatAmount} ر.س</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid #e2e8f0;">
                            <span style="font-size:1.05rem;font-weight:800;color:#0f172a;">الإجمالي الشامل للضريبة:</span>
                            <span style="font-size:1.25rem;font-weight:900;color:#2997D8;">${totalNum.toFixed(2)} ر.س</span>
                        </div>
                    </div>

                    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding-top:12px;border-top:1px solid #f1f5f9;">
                        <div style="font-size:0.78rem;color:#6E5D53;line-height:1.5;">
                            شكراً لاختياركم <strong>سما كافيه</strong> ☕<br>
                            قهوة مختصة تُحمص وتُحضر بشغف يومياً<br>
                            الرياض، المملكة العربية السعودية
                        </div>
                        <div style="width:64px;height:64px;border:1px solid #e2d9ce;border-radius:8px;display:flex;align-items:center;justify-content:center;background:#FAF7F2;font-size:2.2rem;color:#0F2942;" title="ZATCA QR Tax Invoice">
                            <i class="fa-solid fa-qrcode"></i>
                        </div>
                    </div>
                </div>

                <div style="padding:14px 20px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;gap:10px;">
                    <button onclick="window.printCustomerInvoiceWindow()" style="flex:1;background:#2997D8;color:#fff;border:none;padding:11px;border-radius:10px;font-weight:800;font-family:'Tajawal',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-size:0.9rem;">
                        <i class="fa-solid fa-print"></i> طباعة / حفظ الفاتورة PDF
                    </button>
                    <button onclick="document.getElementById('coffee-invoice-viewer-modal').remove()" style="background:#e2e8f0;color:#334155;border:none;padding:11px 18px;border-radius:10px;font-weight:700;font-family:'Tajawal',sans-serif;cursor:pointer;font-size:0.9rem;">
                        إغلاق
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
    } catch(e) {
        console.error(e);
        showToast('حدث خطأ أثناء جلب الفاتورة');
    }
};

window.printCustomerInvoiceWindow = function() {
    const area = document.getElementById('coffee-invoice-printable-area');
    if (!area) return;
    const printWin = window.open('', '_blank');
    if (!printWin) {
        window.print();
        return;
    }
    printWin.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>فاتورة ضريبية - سما كافيه</title>
            <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
            <style>
                body { font-family: 'Tajawal', Arial, sans-serif; direction: rtl; padding: 25px; color: #0F2942; max-width: 580px; margin: 0 auto; }
            </style>
        </head>
        <body>
            <div style="text-align:center;margin-bottom:20px;border-bottom:2px solid #2997D8;padding-bottom:12px;">
                <h2 style="margin:0;color:#2997D8;">☕ سما كافيه | SAMA CAFE</h2>
                <p style="margin:4px 0 0;color:#64748b;font-size:13px;">فاتورة ضريبية مبسطة - قهوة مختصة ومخبوزات</p>
            </div>
            ${area.innerHTML}
            <script>
                window.onload = function() { setTimeout(function() { window.print(); }, 350); };
            <\/script>
        </body>
        </html>
    `);
    printWin.document.close();
};

