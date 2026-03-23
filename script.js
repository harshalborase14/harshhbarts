document.addEventListener('DOMContentLoaded', () => {
    
    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => revealObserver.observe(el));
    }


    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }


    // --- Gallery Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (galleryItems.length > 0) {
        const initialCategory = 'portraits';
        galleryItems.forEach(item => {
            if (item.getAttribute('data-category') === initialCategory) {
                item.style.display = 'flex';
                item.style.opacity = '1';
            } else {
                item.style.display = 'none';
                item.style.opacity = '0';
            }
        });

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.getAttribute('data-category');
                galleryItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'flex';
                        setTimeout(() => item.style.opacity = '1', 10);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                });
            });
        });
    }


    // --- Lightbox Functionality ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (lightbox && galleryItems.length > 0) {
        let currentIndex = 0;
        const visibleImages = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');

        galleryItems.forEach((item) => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightbox.style.display = 'flex';
                    document.body.classList.add('modal-open');
                    currentIndex = visibleImages().indexOf(item);
                    window.history.pushState({ lightbox: true }, "");
                }
            });
        });

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.classList.remove('modal-open');
            if (window.history.state && window.history.state.lightbox) {
                window.history.back();
            }
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        window.addEventListener('popstate', (e) => {
            if (lightbox.style.display === 'flex') {
                lightbox.style.display = 'none';
                document.body.classList.remove('modal-open');
            }
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const images = visibleImages();
                currentIndex = (currentIndex + 1) % images.length;
                updateLightbox(images[currentIndex]);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const images = visibleImages();
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateLightbox(images[currentIndex]);
            });
        }

        function updateLightbox(item) {
            const img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
            }
        }
    }


    // --- Contact Form Logic ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            submitBtn.innerText = "Sending Message...";
            submitBtn.disabled = true;

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const messageText = document.getElementById('message').value.trim();
            
            const templateParams = {
                from_name: name,
                from_email: email || 'Not provided',
                message: messageText,
                inquiry_date: new Date().toLocaleString()
            };

            emailjs.send('service_8ry8q0g', 'template_nmcxa66', templateParams)
                .then(() => {
                    alert(`Thank you, ${name}! Your message has been sent. Harshal will get back to you shortly via email or phone.`);
                    contactForm.reset();
                }, (error) => {
                    console.error('EmailJS Error:', error);
                    alert("Oops! Something went wrong. Please try again or contact me directly on Instagram.");
                })
                .finally(() => {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }


    // --- Order Modal Logic ---
    const orderModal = document.getElementById('orderModal');
    const bookButtons = document.querySelectorAll('.book-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const selectedSizeSpan = document.getElementById('selectedSize');
    const finalTotalPriceSpan = document.getElementById('finalTotalPrice');
    const orderForm = document.getElementById('orderForm');
    
    const countryCurrency = document.getElementById('countryCurrency');
    const countryCodeInput = document.getElementById('countryCode');
    const indianState = document.getElementById('indianState');
    const stateGroup = document.getElementById('stateGroup');
    const portraitCategory = document.getElementById('portraitCategory');
    const framingOption = document.getElementById('framingOption');
    const shippingMethodInput = document.getElementById('shippingMethod'); 

    let basePrice = 0;
    let currentSize = '';

    const countryData = {
        'IN': { code: '+91', symbol: 'Rs.', rate: 1, shipping: 100 },
        'US': { code: '+1', symbol: '$', rate: 0.0106, shipping: 2500 },
        'GB': { code: '+44', symbol: '£', rate: 0.008, shipping: 2800 },
        'CA': { code: '+1', symbol: 'C$', rate: 0.0145, shipping: 2000 },
        'AU': { code: '+61', symbol: 'A$', rate: 0.0153, shipping: 2000 },
        'AE': { code: '+971', symbol: 'AED', rate: 0.039, shipping: 1800 },
        'DE': { code: '+49', symbol: '€', rate: 0.0092, shipping: 2200 },
        'FR': { code: '+33', symbol: '€', rate: 0.0092, shipping: 2200 },
        'JP': { code: '+81', symbol: 'JPY', rate: 1.72, shipping: 1500 },
        'SG': { code: '+65', symbol: 'S$', rate: 0.0143, shipping: 1800 },
        'SA': { code: '+966', symbol: 'SR', rate: 0.04, shipping: 1800 },
        'KW': { code: '+965', symbol: 'KWD', rate: 0.0033, shipping: 1800 },
        'QA': { code: '+974', symbol: 'QR', rate: 0.038, shipping: 1800 },
        'OM': { code: '+968', symbol: 'OMR', rate: 0.0041, shipping: 1800 },
        'BH': { code: '+973', symbol: 'BHD', rate: 0.004, shipping: 1800 },
        'MY': { code: '+60', symbol: 'RM', rate: 0.045, shipping: 1800 },
        'TH': { code: '+66', symbol: 'THB', rate: 0.39, shipping: 1500 },
        'ID': { code: '+62', symbol: 'Rp', rate: 184, shipping: 1500 },
        'KR': { code: '+82', symbol: 'KRW', rate: 16, shipping: 1800 },
        'RU': { code: '+7', symbol: 'RUB', rate: 0.98, shipping: 2500 },
        'BR': { code: '+55', symbol: 'R$', rate: 0.056, shipping: 3000 },
        'ZA': { code: '+27', symbol: 'R', rate: 0.20, shipping: 3000 },
        'MX': { code: '+52', symbol: '$', rate: 0.18, shipping: 3000 },
        'IT': { code: '+39', symbol: '€', rate: 0.0092, shipping: 2200 },
        'ES': { code: '+34', symbol: '€', rate: 0.0092, shipping: 2200 },
        'CH': { code: '+41', symbol: 'CHF', rate: 0.0083, shipping: 2500 },
        'NL': { code: '+31', symbol: '€', rate: 0.0092, shipping: 2200 },
        'SE': { code: '+46', symbol: 'kr', rate: 0.11, shipping: 2500 },
        'NO': { code: '+47', symbol: 'kr', rate: 0.11, shipping: 2500 },
        'DK': { code: '+45', symbol: 'kr', rate: 0.069, shipping: 2500 },
        'NZ': { code: '+64', symbol: 'NZ$', rate: 0.018, shipping: 2000 },
        'IE': { code: '+353', symbol: '€', rate: 0.0092, shipping: 2800 },
        'AT': { code: '+43', symbol: '€', rate: 0.0092, shipping: 2200 },
        'BE': { code: '+32', symbol: '€', rate: 0.0092, shipping: 2200 },
        'PT': { code: '+351', symbol: '€', rate: 0.0092, shipping: 2200 },
        'PL': { code: '+48', symbol: 'PLN', rate: 0.04, shipping: 2200 },
        'TR': { code: '+90', symbol: 'TRY', rate: 0.35, shipping: 2000 },
        'IL': { code: '+972', symbol: 'ILS', rate: 0.039, shipping: 2500 },
        'EG': { code: '+20', symbol: 'E£', rate: 0.51, shipping: 2500 },
        'VN': { code: '+84', symbol: 'VND', rate: 263, shipping: 1500 },
        'PH': { code: '+63', symbol: 'PHP', rate: 0.59, shipping: 1500 },
        'LK': { code: '+94', symbol: 'Rs.', rate: 3.5, shipping: 1200 },
        'PK': { code: '+92', symbol: 'Rs.', rate: 2.9, shipping: 1200 },
        'BD': { code: '+880', symbol: 'BDT', rate: 1.35, shipping: 1200 },
        'NP': { code: '+977', symbol: 'Rs.', rate: 1.6, shipping: 800 },
        'BT': { code: '+975', symbol: 'Nu.', rate: 1, shipping: 800 },
        'OT': { code: '+', symbol: '$', rate: 0.011, shipping: 3500 }
    };

    if (orderModal && bookButtons.length > 0) {
        function calculateTotal() {
            const countryID = countryCurrency.value;
            const isIndia = countryID === 'IN';
            const data = countryData[countryID] || countryData['OT'];
            
            if (stateGroup) {
                stateGroup.style.display = isIndia ? 'block' : 'none';
            }

            let baseAmountINR = isIndia ? basePrice : (basePrice * 1.6);
            let totalINR = baseAmountINR;

            let categoryAddon = 0;
            const category = portraitCategory.value;
            if (category === 'couple') categoryAddon = 500;
            if (category === 'group') {
                const groupBase = (currentSize === 'A4') ? 3000 : 5000;
                const adjustedGroupBase = isIndia ? groupBase : (groupBase * 1.6);
                categoryAddon = adjustedGroupBase - baseAmountINR;
            }
            if (category === 'babygod') categoryAddon = -500;
            
            totalINR += categoryAddon;

            let framingAddon = 0;
            const framing = framingOption.value;
            if (framing === 'yes') {
                framingAddon = (currentSize === 'A4') ? 250 : 500;
            }
            totalINR += framingAddon;

            let shippingCost = 0;
            let shippingText = "";

            if (isIndia) {
                const state = indianState.value;
                if (state === 'MH') {
                    shippingCost = 100;
                    if (currentSize === 'A3' && framing === 'yes') shippingCost += 150;
                    shippingText = "Domestic (Maharashtra)";
                } else {
                    shippingCost = 300;
                    if (currentSize === 'A3' && framing === 'yes') shippingCost += 300;
                    shippingText = "Domestic (Rest of India)";
                }
            } else {
                shippingCost = data.shipping;
                if (currentSize === 'A3' && framing === 'yes') {
                    if (countryID === 'US' || countryID === 'CA' || countryID === 'AU') shippingCost += 1600;
                    else if (countryID === 'GB' || countryID.startsWith('EU') || countryID === 'DE' || countryID === 'FR') shippingCost += 1200;
                    else shippingCost += 1000;
                }
                shippingText = "International Priority Shipping";
            }
            
            totalINR += shippingCost;
            if (shippingMethodInput) shippingMethodInput.value = shippingText;

            const symbol = data.symbol;
            const code = data.code;
            const rate = data.rate;

            const convertedTotal = (totalINR * rate).toFixed(2);
            
            if (finalTotalPriceSpan) finalTotalPriceSpan.innerText = `${symbol}${convertedTotal}`;
            if (countryCodeInput) countryCodeInput.value = code;

            return { 
                inr: totalINR, 
                converted: convertedTotal, 
                symbol: symbol, 
                shippingText: shippingText,
                basePrice: (baseAmountINR * rate).toFixed(2),
                categoryAddon: (categoryAddon * rate).toFixed(2),
                framingAddon: (framingAddon * rate).toFixed(2),
                shippingCost: (shippingCost * rate).toFixed(2),
                rate: rate
            };
        }

        function generateReceiptPDF(name, phone, address, pricing, size, category, framing) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const date = new Date().toLocaleString();
            
            const goldColor = [212, 175, 55]; 
            const darkColor = [30, 30, 30];

            doc.setFillColor(...darkColor);
            doc.rect(0, 0, 210, 40, 'F');
            
            doc.setTextColor(...goldColor);
            doc.setFontSize(24);
            doc.text("harshh_b_arts", 105, 20, { align: "center" });
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.text("Professional Sketch Artist Portfolio | Harshal Borase", 105, 30, { align: "center" });

            doc.setTextColor(...darkColor);
            doc.setFontSize(18);
            doc.text("ORDER RECEIPT", 20, 55);
            
            doc.setDrawColor(...goldColor);
            doc.setLineWidth(0.5);
            doc.line(20, 58, 190, 58);

            doc.setFontSize(11);
            doc.setTextColor(50, 50, 50);
            doc.text(`Date: ${date}`, 140, 55);
            
            doc.text("Customer Details:", 20, 70);
            doc.text(`Name: ${name}`, 20, 78);
            doc.text(`Phone: ${phone}`, 20, 85);
            doc.text(`Address: ${address}`, 20, 92, { maxWidth: 170 });

            let tableY = 110;
            doc.setFillColor(240, 240, 240);
            doc.rect(20, tableY, 170, 10, 'F');
            doc.text("Description", 25, tableY + 7);
            doc.text("Amount", 160, tableY + 7);

            tableY += 18;
            doc.text(`${size} Size Sketch (${category})`, 25, tableY);
            doc.text(`${pricing.symbol}${pricing.basePrice}`, 160, tableY);

            if (parseFloat(pricing.categoryAddon) !== 0) {
                tableY += 10;
                const label = parseFloat(pricing.categoryAddon) > 0 ? "Category Add-on" : "Category Discount";
                doc.text(label, 25, tableY);
                doc.text(`${pricing.symbol}${pricing.categoryAddon}`, 160, tableY);
            }

            if (parseFloat(pricing.framingAddon) > 0) {
                tableY += 10;
                doc.text(`Framing (${framing})`, 25, tableY);
                doc.text(`${pricing.symbol}${pricing.framingAddon}`, 160, tableY);
            }

            tableY += 10;
            doc.text(`Shipping (${pricing.shippingText})`, 25, tableY);
            doc.text(`${pricing.symbol}${pricing.shippingCost}`, 160, tableY);

            tableY += 15;
            doc.setDrawColor(200, 200, 200);
            doc.line(20, tableY - 5, 190, tableY - 5);
            
            doc.setFontSize(14);
            doc.setTextColor(...goldColor);
            doc.text("Total Payable Amount:", 20, tableY + 5);
            doc.text(`${pricing.symbol}${pricing.converted}`, 160, tableY + 5);

            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text("Note: This is a system-generated receipt. Harshal will contact you on WhatsApp", 105, 180, { align: "center" });
            doc.text("to confirm the reference photo and delivery timeline.", 105, 185, { align: "center" });
            
            doc.setTextColor(...darkColor);
            doc.text("Instagram: @harshh_b_arts | Email: artbyharshal14@gmail.com", 105, 200, { align: "center" });

            doc.save(`Receipt_harshh_b_arts_${name.replace(/\s+/g, '_')}.pdf`);
        }

        const inputs = [countryCurrency, indianState, portraitCategory, framingOption];
        inputs.forEach(el => {
            if (el) el.addEventListener('change', calculateTotal);
        });

        bookButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                currentSize = btn.getAttribute('data-size');
                basePrice = parseInt(btn.getAttribute('data-price'));
                
                if (selectedSizeSpan) selectedSizeSpan.innerText = currentSize;
                
                if (countryCurrency) countryCurrency.value = 'IN';
                if (indianState) indianState.value = 'MH';
                if (portraitCategory) portraitCategory.value = 'single';
                if (framingOption) framingOption.value = 'no';
                
                calculateTotal();
                orderModal.style.display = 'flex';
                document.body.classList.add('modal-open');
            });
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                orderModal.style.display = 'none';
                document.body.classList.remove('modal-open');
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === orderModal) {
                orderModal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }
        });

        if (orderForm) {
            orderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = orderForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerText;
                
                submitBtn.innerText = "Processing...";
                submitBtn.disabled = true;

                const name = document.getElementById('orderName').value;
                const phone = document.getElementById('orderPhone').value;
                const address = document.getElementById('orderAddress').value;
                const fullPhone = countryCodeInput.value + " " + phone;
                
                const pricing = calculateTotal();
                
                const catText = portraitCategory.options[portraitCategory.selectedIndex].text;
                const frameText = framingOption.options[framingOption.selectedIndex].text;
                const countryText = countryCurrency.options[countryCurrency.selectedIndex].text;

                try {
                    generateReceiptPDF(name, fullPhone, address, pricing, currentSize, catText, frameText);
                } catch (pdfError) {
                    console.error("PDF Generation Error:", pdfError);
                }

                const templateParams = {
                    from_name: name,
                    customer_phone: fullPhone,
                    customer_address: address,
                    art_size: currentSize,
                    art_category: catText,
                    framing: frameText,
                    shipping: pricing.shippingText,
                    total_price: `${pricing.symbol}${pricing.converted} (${countryText})`,
                    order_date: new Date().toLocaleString()
                };

                emailjs.send('service_8ry8q0g', 'template_nahrc5o', templateParams)
                    .then(() => {
                        alert(`Thank you, ${name}! Your order has been submitted and your receipt is downloading. Harshal will contact you shortly on WhatsApp.`);
                        
                        const waMessage = `Hello Harshal, I just placed an order!\n\n*Order Details:*\n- Name: ${name}\n- Size: ${currentSize}\n- Category: ${catText}\n- Framing: ${frameText}\n- Total: ${pricing.symbol}${pricing.converted}\n\nI have also downloaded the receipt. Please let me know the next steps.`;
                        const waUrl = `https://wa.me/919307563143?text=${encodeURIComponent(waMessage)}`;
                        
                        setTimeout(() => {
                            window.open(waUrl, '_blank');
                        }, 2000);

                        orderModal.style.display = 'none';
                        document.body.classList.remove('modal-open');
                        orderForm.reset();
                    }, (error) => {
                        console.error('EmailJS Error:', error);
                        alert("Oops! Something went wrong with the email. But your receipt should be downloaded. Please contact Harshal on Instagram.");
                    })
                    .finally(() => {
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                    });
            });
        }
    }
});
