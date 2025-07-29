// Cart functionality
let cart = [];
let cartTotal = 0;

// Search functionality
let searchResults = [];
let allProducts = [
    { name: 'Gulab Jamun', price: 120, description: 'Soft and spongy milk solids soaked in rose-flavored sugar syrup', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
    { name: 'Rasgulla', price: 140, description: 'Soft cottage cheese balls soaked in light sugar syrup', image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
    { name: 'Jalebi', price: 100, description: 'Crispy spiral-shaped sweet made from refined flour and soaked in sugar syrup', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
    { name: 'Ladoo', price: 160, description: 'Round sweet balls made from gram flour, semolina, or coconut', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
    { name: 'Barfi', price: 180, description: 'Dense milk-based sweet with various flavors and garnishes', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
    { name: 'Kheer', price: 200, description: 'Rice pudding made with milk, sugar, and aromatic spices', image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' }
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load cart from localStorage if available
    loadCart();
    updateCartCount();
    
    // Initialize search functionality
    initializeSearch();
    
    // Ensure cart count is visible if there are items
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
            cartCount.style.visibility = 'visible';
            cartCount.style.opacity = '1';
        }
    }
});

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-expand-input');
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const query = searchInput.value.toLowerCase().trim();
                if (query.length > 0) {
                    const match = allProducts.find(product => product.name.toLowerCase().includes(query));
                    if (match) {
                        openProductModal(match.name, match.price, match.description, match.image);
                        searchInput.value = '';
                    }
                }
            }
        });
    }
}

// Handle search input
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    // Filter product cards in the menu section
    const menuCards = document.querySelectorAll('#menu .menu-item');
    if (menuCards.length) {
        if (query.length === 0) {
            menuCards.forEach(card => card.style.display = '');
        } else {
            menuCards.forEach(card => {
                const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
                if (name.includes(query)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    }
}

// Add item to cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Save to localStorage
    saveCart();
    
    // Update UI
    updateCartCount();
    updateCartDisplay();
    
    // Debug: Log cart state
    console.log('Cart updated:', cart);
    console.log('Total items:', cart.reduce((total, item) => total + item.quantity, 0));
    
    // Show success message
    showNotification(`${name} added to cart!`);
}

// Remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
    
    showNotification(`${name} removed from cart!`);
}

// Update item quantity
function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(name);
            return;
        }
        
        cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        saveCart();
        updateCartCount();
        updateCartDisplay();
    }
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    console.log('Updating cart count. Total items:', totalItems);
    console.log('Cart count element found:', !!cartCount);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        
        // Show/hide cart count based on items
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
            cartCount.style.visibility = 'visible';
            cartCount.style.opacity = '1';
            cartCount.style.zIndex = '10';
            // Add pulse animation when items are added
            cartCount.classList.add('pulse');
            setTimeout(() => cartCount.classList.remove('pulse'), 1000);
        } else {
            cartCount.style.display = 'none';
            cartCount.style.visibility = 'hidden';
            cartCount.style.opacity = '0';
        }
        
        console.log('Cart count updated to:', cartCount.textContent);
        console.log('Cart count display:', cartCount.style.display);
    } else {
        console.error('Cart count element not found!');
    }
}

// Update cart display in modal
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">Rs.${item.price}/kg</div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    cartTotalElement.textContent = cartTotal;
}

// Open cart modal
function openCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.add('active');
    updateCartDisplay();
}

// Close cart modal
function closeCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.remove('active');
}

// Clear cart
function clearCart() {
    cart = [];
    cartTotal = 0;
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Cart cleared!');
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Show checkout message
    const message = `Order Summary:\n${cart.map(item => `${item.name} x${item.quantity} = Rs.${item.price * item.quantity}`).join('\n')}\n\nTotal: Rs.${cartTotal}\n\nPlease call 021 111 376 376 to complete your order!`;
    alert(message);
    
    // Clear cart after checkout
    clearCart();
    closeCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('maroofCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('maroofCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #e74c3c;
        color: white;
        padding: 0.6rem 1.2rem;
        border-radius: 6px;
        font-size: 1rem;
        min-width: 120px;
        max-width: 80vw;
        text-align: center;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.18);
        z-index: 1001;
        animation: slideInDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInDown 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Add slideInDown keyframes to the page if not present
(function addNotificationKeyframes() {
    if (!document.getElementById('notification-slideInDown')) {
        const style = document.createElement('style');
        style.id = 'notification-slideInDown';
        style.innerHTML = `
        @keyframes slideInDown {
            from { opacity: 0; transform: translateY(-30px) translateX(-50%); }
            to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        `;
        document.head.appendChild(style);
    }
})();

// Close cart modal when clicking outside
document.addEventListener('click', (e) => {
    const cartModal = document.getElementById('cartModal');
    if (e.target === cartModal) {
        closeCart();
    }
});

// Close cart modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCart();
    }
});

// Mobile Navigation
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Form submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.menu-item, .feature, .gallery-item, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Gallery lightbox effect (optional enhancement)
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', function() {
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            cursor: pointer;
        `;
        
        const lightboxImg = document.createElement('img');
        lightboxImg.src = this.src;
        lightboxImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 10px;
        `;
        
        lightbox.appendChild(lightboxImg);
        document.body.appendChild(lightbox);
        
        // Close lightbox on click
        lightbox.addEventListener('click', () => {
            document.body.removeChild(lightbox);
        });
        
        // Close lightbox on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (document.body.contains(lightbox)) {
                    document.body.removeChild(lightbox);
                }
            }
        });
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add hover effects for menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Product Modal Variables
let currentProduct = {
    name: '',
    price: 0,
    description: '',
    image: ''
};

// Open Product Modal
function openProductModal(name, price, description, image) {
    currentProduct = {
        name: name,
        price: price,
        description: description,
        image: image
    };
    
    // Set modal content
    document.getElementById('modalProductName').textContent = name;
    document.getElementById('modalProductPrice').textContent = price;
    document.getElementById('modalProductDescription').textContent = description;
    document.getElementById('modalProductImage').src = image;
    
    // Calculate prices for different gram options
    const price250 = Math.round((price * 250) / 1000);
    const price500 = Math.round((price * 500) / 1000);
    const price1000 = price;
    
    document.getElementById('price250').textContent = price250;
    document.getElementById('price500').textContent = price500;
    document.getElementById('price1000').textContent = price1000;
    
    // Reset quantity and update total
    document.getElementById('modalQuantity').textContent = 1;
    updateModalTotal();
    
    // Show modal
    const productModal = document.getElementById('productModal');
    productModal.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close Product Modal
function closeProductModal() {
    const productModal = document.getElementById('productModal');
    productModal.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Change quantity in modal
function changeQuantity(change) {
    const quantityDisplay = document.getElementById('modalQuantity');
    let currentQty = parseInt(quantityDisplay.textContent) || 1;
    
    currentQty += change;
    
    // Ensure quantity is between 1 and 10
    if (currentQty < 1) currentQty = 1;
    if (currentQty > 10) currentQty = 10;
    
    quantityDisplay.textContent = currentQty;
    updateModalTotal();
}

// Update modal total price
function updateModalTotal() {
    const selectedSize = document.querySelector('.new-size-option.active').dataset.size;
    const quantity = parseInt(document.getElementById('modalQuantity').textContent) || 1;
    
    let unitPrice;
    switch(selectedSize) {
        case '250':
            unitPrice = Math.round((currentProduct.price * 250) / 1000);
            break;
        case '500':
            unitPrice = Math.round((currentProduct.price * 500) / 1000);
            break;
        case '1000':
            unitPrice = currentProduct.price;
            break;
        default:
            unitPrice = currentProduct.price;
    }
    
    const total = unitPrice * quantity;
    document.getElementById('modalTotalPrice').textContent = total;
}

// Add to cart from modal
function addToCartFromModal() {
    const selectedSize = document.querySelector('.new-size-option.active').dataset.size;
    const quantity = parseInt(document.getElementById('modalQuantity').textContent) || 1;
    
    let unitPrice;
    let gramText;
    
    switch(selectedSize) {
        case '250':
            unitPrice = Math.round((currentProduct.price * 250) / 1000);
            gramText = '250g';
            break;
        case '500':
            unitPrice = Math.round((currentProduct.price * 500) / 1000);
            gramText = '500g';
            break;
        case '1000':
            unitPrice = currentProduct.price;
            gramText = '1kg';
            break;
        default:
            unitPrice = currentProduct.price;
            gramText = '1kg';
    }
    
    const itemName = `${currentProduct.name} (${gramText})`;
    const totalPrice = unitPrice * quantity;
    
    // Add to cart
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: itemName,
            price: unitPrice,
            quantity: quantity
        });
    }
    
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Save to localStorage
    saveCart();
    
    // Update UI
    updateCartCount();
    updateCartDisplay();
    
    // Show success message
    showNotification(`${quantity}x ${itemName} added to cart!`);
    
    // Close modal
    closeProductModal();
}

// Share product function
function shareProduct() {
    if (navigator.share) {
        navigator.share({
            title: currentProduct.name,
            text: `Check out this delicious ${currentProduct.name} from Maroof Sweets!`,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const text = `Check out this delicious ${currentProduct.name} from Maroof Sweets!`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Product link copied to clipboard!');
            });
        } else {
            showNotification('Share feature not available in this browser');
        }
    }
}

// Event listeners for modal
document.addEventListener('DOMContentLoaded', () => {
    // Listen for size selection changes
    document.querySelectorAll('.new-size-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            document.querySelectorAll('.new-size-option').forEach(opt => {
                opt.classList.remove('active');
            });
            // Add active class to clicked option
            this.classList.add('active');
            updateModalTotal();
        });
    });
    
    // Close modal when clicking outside
    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                closeProductModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
        }
    });
});

// Buy Now function
function buyNow() {
    addToCartFromModal();
    // Redirect to checkout or show checkout modal
    setTimeout(() => {
        openCart();
    }, 500);
}









// Animated Search Bar functionality
const searchIconBtn = document.getElementById('search-icon-btn');
const searchExpandContainer = document.getElementById('search-expand-container');
const searchExpandInput = document.getElementById('search-expand-input');
const searchCloseBtn = document.getElementById('search-close-btn');

if (searchIconBtn && searchExpandContainer) {
    let isSearchExpanded = false;

    // Open search when icon is clicked
    searchIconBtn.addEventListener('click', () => {
        if (!isSearchExpanded) {
            searchExpandContainer.classList.add('active');
            document.querySelector('.nav-menu').classList.add('search-expanded');
            isSearchExpanded = true;
            
            // Focus input after animation
            setTimeout(() => {
                searchExpandInput.focus();
            }, 200);
        }
    });

    // Close search function
    function closeSearch() {
        searchExpandContainer.classList.remove('active');
        document.querySelector('.nav-menu').classList.remove('search-expanded');
        searchExpandInput.value = '';
        isSearchExpanded = false;
    }

    // Close search with close button
    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', () => {
            closeSearch();
        });
    }

    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isSearchExpanded) {
            closeSearch();
        }
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (isSearchExpanded && 
            !searchIconBtn.contains(e.target) && 
            !searchExpandContainer.contains(e.target)) {
            closeSearch();
        }
    });

    // Search functionality
    searchExpandInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        console.log('Searching for:', searchTerm);
        
        // Add search animation
        searchExpandInput.style.transform = 'scale(1.02)';
        setTimeout(() => {
            searchExpandInput.style.transform = 'scale(1)';
        }, 150);
        
        // Here you can add actual search logic
        if (searchTerm.length > 2) {
            // showNotification(`Searching for: ${searchTerm}`); // Removed searching notification
        }
    });

    // Handle enter key
    searchExpandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.trim();
            if (searchTerm) {
                // showNotification(`Searching for: ${searchTerm}`); // Removed searching notification
                // Add your search logic here
            }
        }
    });
}

// User icon functionality
const userBtn = document.querySelector('.user-btn');
if (userBtn) {
    userBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // You can add user/login logic here
        console.log('User icon clicked');
    });
}

// Add counter animation for features
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Initialize counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const count = parseInt(target.getAttribute('data-count'));
            if (count) {
                animateCounter(target, count);
                counterObserver.unobserve(target);
            }
        }
    });
}, { threshold: 0.5 });

// Add this to your HTML if you want counter animations
// <span data-count="100">0</span> customers served
// <span data-count="50">0</span> years of experience
// <span data-count="1000">0</span> happy customers



 

// Hero Carousel Functionality
(function() {
    const slides = document.querySelectorAll('.carousel-slide');
    // Removed prevBtn and nextBtn
    const dotsContainer = document.getElementById('carouselDots');
    let current = 0;
    let interval;

    function showSlide(idx) {
        // Remove all classes from previous slides
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev');
        });
        
        // Add appropriate classes for animation
        slides.forEach((slide, i) => {
            if (i === idx) {
                slide.classList.add('active');
            } else if (i === current) {
                slide.classList.add('prev');
            }
        });
        
        updateDots(idx);
        current = idx;
    }

    function nextSlide() {
        showSlide((current + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((current - 1 + slides.length) % slides.length);
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => showSlide(i));
            dotsContainer.appendChild(dot);
        });
    }

    function updateDots(idx) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
        });
    }

    function startAutoSlide() {
        interval = setInterval(nextSlide, 10000);
    }

    function stopAutoSlide() {
        clearInterval(interval);
    }

    // Init
    if (slides.length > 0) {
        createDots();
        showSlide(0);
        startAutoSlide();
        // Removed arrow button event listeners
        dotsContainer.addEventListener('click', () => { stopAutoSlide(); startAutoSlide(); });
    }
})(); 