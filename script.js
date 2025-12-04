// Pricing configuration - Price per unit
const PRICES = {
    followers: 220, // per 1,000
    likes: 60,      // per 1,000
    views: 40,      // per 1,000
    comments: 150   // per 100
};

// Quantity in actual numbers
let followersQty = 0; // actual number
let likesQty = 0;     // actual number
let viewsQty = 0;     // actual number
let commentsQty = 0;  // actual number

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all quantities to 0
    document.getElementById('followers-qty').value = 0;
    document.getElementById('likes-qty').value = 0;
    document.getElementById('views-qty').value = 0;
    document.getElementById('comments-qty').value = 0;
    
    calculateTotal();
    
    // Add input validation
    document.getElementById('followers-qty').addEventListener('blur', validateInput);
    document.getElementById('likes-qty').addEventListener('blur', validateInput);
    document.getElementById('views-qty').addEventListener('blur', validateInput);
    document.getElementById('comments-qty').addEventListener('blur', validateInput);
    
    // Add logo animation effects
    addLogoEffects();
    
    // Add preset button styling
    addPresetButtonEffects();
});

// Add interactive effects to logos
function addLogoEffects() {
    const logos = document.querySelectorAll('img[src*="ak_logo"]');
    
    logos.forEach(logo => {
        // Add hover effect
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.transition = 'all 0.3s ease';
            this.style.boxShadow = '0 10px 25px rgba(106, 17, 203, 0.3)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = '';
        });
        
        // Add click effect
        logo.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Scroll to top on logo click
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            showToast('Welcome to SocialBoost!', 'success');
        });
    });
}

// Add effects to preset buttons
function addPresetButtonEffects() {
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    presetBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('highlight')) {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('highlight')) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
        
        btn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = this.classList.contains('highlight') ? 'scale(1.05)' : 'scale(1)';
            }, 150);
        });
    });
}

// Adjust quantity with buttons
function adjustQty(type, change) {
    let inputElement;
    let currentQty;
    let minChange = 100; // Default for followers/likes/views
    let maxQty = 50000; // Default max
    
    if (type === 'followers') {
        currentQty = followersQty;
        inputElement = document.getElementById('followers-qty');
    } else if (type === 'likes') {
        currentQty = likesQty;
        inputElement = document.getElementById('likes-qty');
    } else if (type === 'views') {
        currentQty = viewsQty;
        inputElement = document.getElementById('views-qty');
    } else if (type === 'comments') {
        currentQty = commentsQty;
        inputElement = document.getElementById('comments-qty');
        minChange = 10; // Comments change by 10
        maxQty = 1000; // Max 1000 comments
    }
    
    // Calculate new quantity
    let newQty = parseInt(currentQty) + change;
    
    // Validate range
    if (newQty < 0) newQty = 0;
    if (newQty > maxQty) newQty = maxQty;
    
    // Update variables
    if (type === 'followers') {
        followersQty = newQty;
    } else if (type === 'likes') {
        likesQty = newQty;
    } else if (type === 'views') {
        viewsQty = newQty;
    } else if (type === 'comments') {
        commentsQty = newQty;
    }
    
    inputElement.value = newQty;
    calculateTotal();
    
    // Show appropriate message
    if (newQty === 0) {
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} quantity set to 0`);
    } else {
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} quantity updated to ${formatNumber(newQty)}`);
    }
    
    // Add visual feedback to the card
    const card = document.getElementById(`${type}-card`);
    card.style.transform = 'translateY(-5px)';
    card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    
    setTimeout(() => {
        card.style.transform = '';
        card.style.boxShadow = '';
    }, 300);
}

// Set quantity using preset buttons
function setQuantity(type, quantity) {
    let inputElement;
    let maxQty = 50000;
    
    if (type === 'followers') {
        followersQty = quantity;
        inputElement = document.getElementById('followers-qty');
    } else if (type === 'likes') {
        likesQty = quantity;
        inputElement = document.getElementById('likes-qty');
    } else if (type === 'views') {
        viewsQty = quantity;
        inputElement = document.getElementById('views-qty');
    } else if (type === 'comments') {
        commentsQty = quantity;
        inputElement = document.getElementById('comments-qty');
        maxQty = 1000;
    }
    
    // Validate max
    if (quantity > maxQty) quantity = maxQty;
    
    inputElement.value = quantity;
    calculateTotal();
    
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} set to ${formatNumber(quantity)}`);
    
    // Highlight the preset button
    const presetBtns = document.querySelectorAll(`#${type}-card .preset-btn`);
    presetBtns.forEach(btn => {
        btn.classList.remove('highlight');
        if (parseInt(btn.textContent.replace('K', '000').replace(',', '')) === quantity || 
            btn.textContent === quantity.toString()) {
            btn.classList.add('highlight');
        }
    });
}

// Validate input fields
function validateInput(event) {
    const input = event.target;
    let value = parseInt(input.value);
    let type = input.id.includes('followers') ? 'followers' : 
               input.id.includes('likes') ? 'likes' : 
               input.id.includes('views') ? 'views' : 'comments';
    
    let maxQty = 50000;
    let step = 100;
    
    if (type === 'comments') {
        maxQty = 1000;
        step = 10;
    }
    
    if (isNaN(value)) {
        value = 0;
    } else if (value < 0) {
        value = 0;
    } else if (value > maxQty) {
        value = maxQty;
        showToast(`Maximum quantity for ${type} is ${formatNumber(maxQty)}`, 'error');
    }
    
    // Round to nearest step
    value = Math.round(value / step) * step;
    
    input.value = value;
    
    if (type === 'followers') {
        followersQty = value;
    } else if (type === 'likes') {
        likesQty = value;
    } else if (type === 'views') {
        viewsQty = value;
    } else if (type === 'comments') {
        commentsQty = value;
    }
    
    calculateTotal();
    
    if (value > 0) {
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} updated to ${formatNumber(value)}`);
    }
}

// Calculate total price
function calculateTotal() {
    // Calculate individual totals
    const followersTotal = Math.round((followersQty / 1000) * PRICES.followers);
    const likesTotal = Math.round((likesQty / 1000) * PRICES.likes);
    const viewsTotal = Math.round((viewsQty / 1000) * PRICES.views);
    const commentsTotal = Math.round((commentsQty / 100) * PRICES.comments);
    const grandTotal = followersTotal + likesTotal + viewsTotal + commentsTotal;
    
    // Update followers display
    document.getElementById('followers-price').textContent = formatNumber(followersTotal);
    document.getElementById('summary-followers').textContent = formatNumber(followersQty);
    document.getElementById('summary-followers-price').textContent = formatNumber(followersTotal);
    
    // Update likes display
    document.getElementById('likes-price').textContent = formatNumber(likesTotal);
    document.getElementById('summary-likes').textContent = formatNumber(likesQty);
    document.getElementById('summary-likes-price').textContent = formatNumber(likesTotal);
    
    // Update views display
    document.getElementById('views-price').textContent = formatNumber(viewsTotal);
    document.getElementById('summary-views').textContent = formatNumber(viewsQty);
    document.getElementById('summary-views-price').textContent = formatNumber(viewsTotal);
    
    // Update comments display
    document.getElementById('comments-price').textContent = formatNumber(commentsTotal);
    document.getElementById('summary-comments').textContent = formatNumber(commentsQty);
    document.getElementById('summary-comments-price').textContent = formatNumber(commentsTotal);
    
    // Update unit prices
    document.getElementById('followers-unit-price').textContent = PRICES.followers;
    document.getElementById('likes-unit-price').textContent = PRICES.likes;
    document.getElementById('views-unit-price').textContent = PRICES.views;
    document.getElementById('comments-unit-price').textContent = PRICES.comments;
    
    // Update grand total
    document.getElementById('total-price').textContent = formatNumber(grandTotal);
    
    // Add zero-state styling
    const zeroItems = [
        {id: 'followers-price', qty: followersQty},
        {id: 'likes-price', qty: likesQty},
        {id: 'views-price', qty: viewsQty},
        {id: 'comments-price', qty: commentsQty},
        {id: 'total-price', qty: grandTotal}
    ];
    
    zeroItems.forEach(item => {
        const element = document.getElementById(item.id);
        if (item.qty === 0) {
            element.classList.add('zero-state');
            element.textContent = '0';
        } else {
            element.classList.remove('zero-state');
        }
    });
    
    // Animate total amount if changed
    if (grandTotal > 0) {
        const totalElement = document.getElementById('total-price');
        totalElement.style.transform = 'scale(1.1)';
        totalElement.style.color = '#ff4d8d';
        
        setTimeout(() => {
            totalElement.style.transform = 'scale(1)';
            totalElement.style.color = '';
        }, 300);
    }
}

// Send order to WhatsApp
function sendToWhatsApp() {
    // Get form values
    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // Check if any service is selected
    if (followersQty === 0 && likesQty === 0 && viewsQty === 0 && commentsQty === 0) {
        showToast('Please select at least one service!', 'error');
        
        // Add shake animation to all service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.style.animation = 'shake 0.5s';
            setTimeout(() => {
                card.style.animation = '';
            }, 500);
        });
        
        return;
    }
    
    // Validate required field
    if (!username) {
        showToast('Please enter your Instagram username!', 'error');
        document.getElementById('username').focus();
        
        // Add shake animation to input
        const usernameInput = document.getElementById('username');
        usernameInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            usernameInput.style.animation = '';
        }, 500);
        
        return;
    }
    
    // Calculate totals
    const followersTotal = Math.round((followersQty / 1000) * PRICES.followers);
    const likesTotal = Math.round((likesQty / 1000) * PRICES.likes);
    const viewsTotal = Math.round((viewsQty / 1000) * PRICES.views);
    const commentsTotal = Math.round((commentsQty / 100) * PRICES.comments);
    const grandTotal = followersTotal + likesTotal + viewsTotal + commentsTotal;
    
    // Create WhatsApp message
    let message = `*NEW ORDER - A.K.Exporter.in*%0A%0A`;
    message += `*Instagram Username/Post:* ${username}%0A`;
    
    if (phone) {
        message += `*WhatsApp:* ${phone}%0A`;
    }
    
    message += `%0A*Order Details:*%0A`;
    
    if (followersQty > 0) {
        message += `✅ *Followers:* ${formatNumber(followersQty)} - ₹${followersTotal}%0A`;
    }
    
    if (likesQty > 0) {
        message += `❤️ *Likes:* ${formatNumber(likesQty)} - ₹${likesTotal}%0A`;
    }
    
    if (viewsQty > 0) {
        message += `👁️ *Views:* ${formatNumber(viewsQty)} - ₹${viewsTotal}%0A`;
    }
    
    if (commentsQty > 0) {
        message += `💬 *Comments:* ${formatNumber(commentsQty)} - ₹${commentsTotal}%0A`;
    }
    
    message += `%0A*Total Amount:* *₹${grandTotal}*%0A`;
    message += `%0A_Please provide payment details and expected delivery time._`;
    message += `%0A%0A*Powered by AK Media* 🚀`;
    
    // WhatsApp phone number (you can change this to your number)
    const whatsappNumber = "919822446249"; // Replace with your number
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Animate the WhatsApp button before redirecting
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    whatsappBtn.style.transform = 'scale(0.95)';
    whatsappBtn.style.background = 'linear-gradient(135deg, #128C7E, #25D366)';
    
    showToast('Opening WhatsApp...', 'success');
    
    // Open WhatsApp in new tab after a short delay
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        
        // Reset button animation
        setTimeout(() => {
            whatsappBtn.style.transform = '';
            whatsappBtn.style.background = '';
        }, 1000);
    }, 500);
    
    // Optional: Reset form after a delay
    setTimeout(() => {
        document.getElementById('username').value = '';
        document.getElementById('phone').value = '';
    }, 3000);
}

// Reset order to default (all 0)
function resetOrder() {
    followersQty = 0;
    likesQty = 0;
    viewsQty = 0;
    commentsQty = 0;
    
    document.getElementById('followers-qty').value = 0;
    document.getElementById('likes-qty').value = 0;
    document.getElementById('views-qty').value = 0;
    document.getElementById('comments-qty').value = 0;
    
    // Reset preset button highlights
    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
        btn.classList.remove('highlight');
    });
    
    calculateTotal();
    
    // Animate reset
    const summaryCard = document.querySelector('.summary-card');
    summaryCard.style.transform = 'scale(0.98)';
    summaryCard.style.boxShadow = '0 5px 15px rgba(255, 77, 141, 0.3)';
    
    setTimeout(() => {
        summaryCard.style.transform = '';
        summaryCard.style.boxShadow = '';
    }, 300);
    
    showToast('All services reset to 0!');
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('confirmation-toast');
    const toastContent = toast.querySelector('.toast-content');
    
    // Update message
    toastContent.children[1].textContent = message;
    
    // Update logo based on type
    const toastLogo = toastContent.querySelector('.toast-logo-img');
    if (type === 'error') {
        toastLogo.style.borderColor = 'var(--danger)';
        toast.style.borderLeft = '5px solid var(--danger)';
        toast.style.background = 'linear-gradient(to right, #fff, #ffeaea)';
    } else {
        toastLogo.style.borderColor = 'var(--views-color)';
        toast.style.borderLeft = '5px solid var(--views-color)';
        toast.style.background = 'white';
    }
    
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Add shake animation for errors
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .zero-state {
        color: #999 !important;
        font-weight: 400 !important;
    }
`;
document.head.appendChild(style);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+Enter to submit order
    if (e.ctrlKey && e.key === 'Enter') {
        sendToWhatsApp();
    }
    
    // Escape to reset
    if (e.key === 'Escape') {
        resetOrder();
    }
    
    // R to refresh (demo)
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        showToast('All prices refreshed!', 'success');
    }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
