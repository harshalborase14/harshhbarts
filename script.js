document.addEventListener('DOMContentLoaded', () => {
    
    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));


    // --- Gallery Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            galleryItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });


    // --- Lightbox Functionality ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentIndex = 0;
    const visibleImages = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const placeholder = item.querySelector('.placeholder-img');
            // In a real app, you'd use item.querySelector('img').src
            // Since we use placeholders, we'll just show the text or a color
            lightboxImg.style.background = placeholder.style.background;
            lightboxImg.alt = placeholder.innerText;
            
            lightbox.style.display = 'flex';
            currentIndex = visibleImages().indexOf(item);
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.style.display = 'none';
    });

    nextBtn.addEventListener('click', () => {
        const images = visibleImages();
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox(images[currentIndex]);
    });

    prevBtn.addEventListener('click', () => {
        const images = visibleImages();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox(images[currentIndex]);
    });

    function updateLightbox(item) {
        const placeholder = item.querySelector('.placeholder-img');
        lightboxImg.style.background = placeholder.style.background;
        lightboxImg.alt = placeholder.innerText;
    }


    // --- Contact Form to WhatsApp ---
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const messageText = document.getElementById('message').value.trim();
        
        if (name === "" || messageText === "") {
            alert("Please fill in both Name and Message fields.");
            return;
        }
        
        // Construct WhatsApp Message for General Inquiry
        const fullMessage = `Hi Harshal! My name is ${name}.%0A%0A*General Inquiry:*%0A${messageText}%0A%0A*My Email:* ${email || 'Not provided'}`;
        
        const whatsappUrl = `https://wa.me/919881413638?text=${fullMessage}`;
        
        window.open(whatsappUrl, '_blank');
        contactForm.reset();
    });


    // --- Order Modal Logic ---
    const orderModal = document.getElementById('orderModal');
    const bookButtons = document.querySelectorAll('.book-btn');
    const closeModal = document.querySelector('.close-modal');
    const selectedSizeSpan = document.getElementById('selectedSize');
    const selectedPriceSpan = document.getElementById('selectedPrice');
    const orderForm = document.getElementById('orderForm');

    bookButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const size = btn.getAttribute('data-size');
            const price = btn.getAttribute('data-price');
            
            selectedSizeSpan.innerText = size;
            selectedPriceSpan.innerText = `₹${price}`;
            
            orderModal.style.display = 'flex';
        });
    });

    closeModal.addEventListener('click', () => {
        orderModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === orderModal) orderModal.style.display = 'none';
    });

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('orderName').value;
        const phone = document.getElementById('orderPhone').value;
        const note = document.getElementById('orderNote').value;
        const size = selectedSizeSpan.innerText;
        const price = selectedPriceSpan.innerText;

        // Construct WhatsApp Message
        const message = `Hi Harshal! I'd like to place a commission order.%0A%0A*Order Details:*%0A- *Size:* ${size}%0A- *Price:* ${price}%0A- *Name:* ${name}%0A- *WhatsApp:* ${phone}%0A- *Note:* ${note || 'None'}%0A%0AI'm sending the reference photo now.`;
        
        const whatsappUrl = `https://wa.me/919881413638?text=${message}`;
        
        window.open(whatsappUrl, '_blank');
        orderModal.style.display = 'none';
        orderForm.reset();
    });

});