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
    const selectedPriceSpan = document.getElementById('selectedPrice');
    const orderForm = document.getElementById('orderForm');

    if (orderModal && bookButtons.length > 0) {
        bookButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const size = btn.getAttribute('data-size');
                const price = btn.getAttribute('data-price');
                
                if (selectedSizeSpan) selectedSizeSpan.innerText = size;
                if (selectedPriceSpan) selectedPriceSpan.innerText = `₹${price}`;
                
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
                const note = document.getElementById('orderNote').value;
                const size = selectedSizeSpan ? selectedSizeSpan.innerText : 'Unknown';
                const price = selectedPriceSpan ? selectedPriceSpan.innerText : 'Unknown';

                const message = `Hi Harshal! I'd like to place a commission order.%0A%0A*Order Details:*%0A- *Size:* ${size}%0A- *Price:* ${price}%0A- *Name:* ${name}%0A- *WhatsApp:* ${phone}%0A- *Note:* ${note || 'None'}%0A%0AI'm sending the reference photo now.`;
                const whatsappUrl = `https://wa.me/919881413638?text=${message}`;
                window.open(whatsappUrl, '_blank');
                orderModal.style.display = 'none';
                document.body.classList.remove('modal-open');
                orderForm.reset();
            });
        }
    }

});
