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
        // Initialize gallery to show only portraits on load (if buttons exist)
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
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const messageText = document.getElementById('message').value.trim();
            
            if (name === "" || messageText === "") {
                alert("Please fill in both Name and Message fields.");
                return;
            }
            
            const fullMessage = `Hi Harshal! My name is ${name}.%0A%0A*General Inquiry:*%0A${messageText}%0A%0A*My Email:* ${email || 'Not provided'}`;
            const whatsappUrl = `https://wa.me/919881413638?text=${fullMessage}`;
            window.open(whatsappUrl, '_blank');
            contactForm.reset();
        });
    }


    // --- Order Modal Logic ---
    const orderModal = document.getElementById('orderModal');
    const bookButtons = document.querySelectorAll('.book-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const selectedSizeSpan = document.getElementById('selectedSize');
    const finalTotalPriceSpan = document.getElementById('finalTotalPrice');
    const orderForm = document.getElementById('orderForm');
    
    // Calculator Inputs
    const portraitCategory = document.getElementById('portraitCategory');
    const framingOption = document.getElementById('framingOption');
    const shippingOption = document.getElementById('shippingOption');

    let basePrice = 0;
    let currentSize = '';

    if (orderModal && bookButtons.length > 0) {
        function calculateTotal() {
            let total = basePrice;
            const category = portraitCategory.value;
            const framing = framingOption.value;
            const shipping = shippingOption.value;

            // Portrait Category Logic
            if (category === 'couple') total += 500;
            if (category === 'group') {
                total = (currentSize === 'A4') ? 3000 : 5000;
            }
            if (category === 'babygod') total -= 500;

            // Framing Logic
            if (framing === 'yes') {
                total += (currentSize === 'A4') ? 250 : 500;
            }

            // Shipping Logic
            if (shipping === 'mh') total += 100;
            if (shipping === 'outside') total += 200;

            if (finalTotalPriceSpan) finalTotalPriceSpan.innerText = `₹${total}`;
            return total;
        }

        // Add listeners for real-time calculation
        [portraitCategory, framingOption, shippingOption].forEach(el => {
            if (el) el.addEventListener('change', calculateTotal);
        });

        bookButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                currentSize = btn.getAttribute('data-size');
                basePrice = parseInt(btn.getAttribute('data-price'));
                
                if (selectedSizeSpan) selectedSizeSpan.innerText = currentSize;
                
                // Reset form to defaults
                if (portraitCategory) portraitCategory.value = 'single';
                if (framingOption) framingOption.value = 'no';
                if (shippingOption) shippingOption.value = 'pickup';
                
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
                const name = document.getElementById('orderName').value;
                const phone = document.getElementById('orderPhone').value;
                const address = document.getElementById('orderAddress').value;
                const total = calculateTotal();
                
                const catText = portraitCategory.options[portraitCategory.selectedIndex].text;
                const frameText = framingOption.options[framingOption.selectedIndex].text;
                const shipText = shippingOption.options[shippingOption.selectedIndex].text;

                const message = `Hi Harshal! I'd like to place a commission order.%0A%0A*Order Details:*%0A- *Size:* ${currentSize}%0A- *Category:* ${catText}%0A- *Framing:* ${frameText}%0A- *Delivery:* ${shipText}%0A- *Total Price:* ₹${total}%0A%0A*Customer Info:*%0A- *Name:* ${name}%0A- *WhatsApp:* ${phone}%0A- *Address:* ${address}%0A%0AI'm sending the reference photo now.`;
                
                const whatsappUrl = `https://wa.me/919881413638?text=${message}`;
                window.open(whatsappUrl, '_blank');
                orderModal.style.display = 'none';
                document.body.classList.remove('modal-open');
                orderForm.reset();
            });
        }
    }

});
