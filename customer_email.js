// Google Apps Script Web App URL for email notifications
var CUSTOMER_EMAIL_API_URL = "https://script.google.com/macros/s/AKfycbxmGeVP0tq9V00EHwLW-32EdfD6fgMNGYBwKrkSY4pnzr7dXWVbr6sPfLOrj4au2F5i/exec";

// Dynamically generate a Coffee Shop Tax Invoice PDF and return it as a Base64 string
window.generateInvoicePDF = async function(orderData) {
    if (typeof html2pdf === 'undefined') {
        console.warn("html2pdf library is not loaded.");
        return null;
    }

    const { orderId, name, phone, email, city, address, orderType, tableOrCar, total, items, date, time, paymentMethod } = orderData;

    const invoiceDiv = document.createElement("div");
    invoiceDiv.style.padding = "30px";
    invoiceDiv.style.background = "#fff";
    invoiceDiv.style.color = "#0F2942";
    invoiceDiv.style.fontFamily = "'Tajawal', Arial, sans-serif";
    invoiceDiv.style.direction = "rtl";

    let itemsHtml = (items || []).map(i => {
        const details = [i.size, i.milk, i.sugar, ...(i.addons || []), i.note].filter(Boolean).join(' | ');
        const linePrice = ((parseFloat(i.price) || 0) * (parseInt(i.quantity) || 1)).toFixed(2);
        return `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <div style="display: flex; justify-content: space-between; font-weight: bold;">
                    <span>${i.name} (×${i.quantity || 1})</span>
                    <span>${linePrice} ر.س</span>
                </div>
                ${details ? `<div style="font-size: 0.82rem; color: #6E5D53; margin-top: 3px;">${details}</div>` : ''}
            </div>
        `;
    }).join('');

    const totalNum = parseFloat(total) || 0;
    const vatAmount = (totalNum - (totalNum / 1.15)).toFixed(2);
    const beforeVat = (totalNum / 1.15).toFixed(2);

    invoiceDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #2997D8; padding-bottom: 15px;">
            <h1 style="color: #2997D8; margin: 0;">☕ سما كافيه | SAMA CAFE</h1>
            <p style="color: #666; margin: 5px 0;">فاتورة ضريبية مبسطة - قهوة مختصة ومخبوزات</p>
            <small style="color: #888;">الرقم الضريبي: 310485920100003</small>
        </div>
        <div style="margin-bottom: 20px; background: #FAF7F2; padding: 15px; border-radius: 10px;">
            <p style="margin: 4px 0;"><strong>رقم الطلب:</strong> #${orderId}</p>
            <p style="margin: 4px 0;"><strong>التاريخ والوقت:</strong> ${date || new Date().toLocaleDateString('ar-SA')} ${time || ''}</p>
            <p style="margin: 4px 0;"><strong>نوع الطلب:</strong> ${orderType || 'استلام من الفرع'} ${tableOrCar ? `(${tableOrCar})` : ''}</p>
            <p style="margin: 4px 0;"><strong>العميل:</strong> ${name || 'عميل سما'}</p>
            <p style="margin: 4px 0;"><strong>رقم الجوال:</strong> ${phone || ''}</p>
            <p style="margin: 4px 0;"><strong>العنوان / التفاصيل:</strong> ${city || 'الرياض'} - ${address || ''}</p>
            <p style="margin: 4px 0;"><strong>طريقة الدفع:</strong> ${paymentMethod || 'الدفع الإلكتروني'}</p>
        </div>
        <div style="padding-top: 10px;">
            <h3 style="color: #2997D8; margin-bottom: 12px;">تفاصيل المشروبات والمنتجات:</h3>
            ${itemsHtml}
            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ccc; font-size: 0.9rem; color: #555;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span>المجموع غير شامل الضريبة:</span>
                    <span>${beforeVat} ر.س</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>ضريبة القيمة المضافة (15%):</span>
                    <span>${vatAmount} ر.س</span>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 1.25rem; font-weight: bold; color: #2997D8;">
                <span>الإجمالي الشامل للضريبة:</span>
                <span>${totalNum.toFixed(2)} ر.س</span>
            </div>
        </div>
        <div style="text-align: center; margin-top: 35px; font-size: 0.9rem; color: #888;">
            شكراً لزيارتكم سما كافيه للقهوة المختصة! نتمنى لكم يوماً سعيداً ☕✨
        </div>
    `;

    const wrapperDiv = document.createElement("div");
    wrapperDiv.style.position = "absolute";
    wrapperDiv.style.top = "-9999px";
    wrapperDiv.style.left = "-9999px";
    wrapperDiv.style.width = "800px";
    wrapperDiv.style.height = "auto";
    wrapperDiv.style.overflow = "visible";
    wrapperDiv.style.opacity = "1";
    wrapperDiv.style.pointerEvents = "none";
    wrapperDiv.appendChild(invoiceDiv);
    document.body.appendChild(wrapperDiv);

    const opt = {
        margin:       10,
        filename:     `SAMA_Invoice_${orderId}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        const pdfBlob = await html2pdf().from(invoiceDiv).set(opt).output('blob');
        if (document.body.contains(wrapperDiv)) document.body.removeChild(wrapperDiv);

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(pdfBlob);
        });
    } catch (e) {
        console.error("Error generating PDF:", e);
        if (document.body.contains(wrapperDiv)) document.body.removeChild(wrapperDiv);
        return null;
    }
};

window.sendCustomerEmail = async function(toEmail, subject, bodyHtml, pdfBase64 = null, pdfName = "Invoice.pdf") {
    if (!toEmail || toEmail.trim() === "") return false;

    let cleanBase64 = pdfBase64;
    if (pdfBase64 && pdfBase64.includes(',')) {
        cleanBase64 = pdfBase64.split(',')[1];
    }

    const payload = {
        to: toEmail,
        subject: subject,
        body: bodyHtml,
        pdfBase64: cleanBase64,
        pdfName: pdfName
    };

    try {
        const response = await fetch(CUSTOMER_EMAIL_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error("Email API Error:", error);
        return false;
    }
};

window.fireCustomerOrderEmail = async function(orderData) {
    if (!orderData.email) return;

    let pdfBase64 = await generateInvoicePDF(orderData);
    let itemsText = (orderData.items || []).map(i => `<li>${i.name} (الكمية: ${i.quantity || 1})</li>`).join('');

    let bodyHtml = `
        <div style="direction: rtl; font-family: Arial, sans-serif;">
            <h2 style="color: #2997D8;">☕ شكراً لطلبك من سما كافيه!</h2>
            <p>مرحباً ${orderData.name}،</p>
            <p>لقد استلمنا طلبك رقم <strong>#${orderData.orderId}</strong> وجاري تحضير قهوتك بكل حب وإتقان.</p>
            <p>تفاصيل الطلب:</p>
            <ul>
                ${itemsText}
            </ul>
            <p><strong>الإجمالي:</strong> ${parseFloat(orderData.total).toFixed(2)} ر.س</p>
            <p>مرفق مع هذه الرسالة الفاتورة الضريبية الخاصة بطلبك بصيغة PDF.</p>
            <p>نسعد بخدمتكم دائماً في سما للقهوة المختصة.</p>
        </div>
    `;

    await sendCustomerEmail(orderData.email, "تأكيد طلبك من سما كافيه #" + orderData.orderId, bodyHtml, pdfBase64, "Invoice_" + orderData.orderId + ".pdf");
};

