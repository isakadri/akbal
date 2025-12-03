// Pricing configuration
const PRICES = {
    followers: 220, // per 1K
    likes: 60       // per 1K
};

// DOM Elements
let followersQty = 1; // in thousands
let likesQty = 1;     // in thousands

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    calculateTotal();
    updateSliders();
    
    // Add input validation
    document.getElementById('followers-qty').addEventListener('blur', validateInput);
    document.getElementById('likes-qty').addEventListener('blur', validateInput);
    
    // Add logo animation effects
    addLogoEffects();
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

// Adjust quantity with buttons
function adjustQty(type, change) {
    let inputElement, sliderElement;
    let currentQty;
    
    if (type === 'followers') {
        currentQty = followersQty;
        inputElement = document.getElementById('followers-qty');
        sliderElement = document.getElementById('followers-slider');
    } else {
        currentQty = likesQty;
        inputElement = document.getElementById('likes-qty');
        sliderElement = document.getElementById('likes-slider');
    }
    
    // Calculate new quantity
    let newQty = parseInt(currentQty) + change;
    
    // Validate range (1-100K)
    if (newQty < 1) newQty = 1;
    if (newQty > 100) newQty = 100;
    
    // Update variables and UI
    if (type === 'followers') {
        followersQty = newQty;
    } else {
        likesQty = newQty;
    }
    
    inputElement.value = newQty;
    sliderElement.value = newQty;
    
    calculateTotal();
    showToast('Quantity updated!');
    
    // Add visual feedback to the card
    const card = document.getElementById(`${type}-card`);
    card.style.transform = 'translateY(-5px)';
    card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    
    setTimeout(() => {
        card.style.transform = '';
        card.style.boxShadow = '';
    }, 300);
}

// Update from slider input
function updateFromSlider(type, value) {
    let inputElement;
    
    if (type === 'followers') {
        followersQty = parseInt(value);
        inputElement = document.getElementById('followers-qty');
    } else {
        likesQty = parseInt(value);
        inputElement = document.getElementById('likes-qty');
    }
    
    inputElement.value = value;
    calculateTotal();
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} quantity updated to ${value}K`);
}

// Update sliders from input fields
function updateSliders() {
    document.getElementById('followers-slider').value = followersQty;
    document.getElementById('likes-slider').value = likesQty;
}

// Validate input fields
function validateInput(event) {
    const input = event.target;
    let value = parseInt(input.value);
    let type = input.id.includes('followers') ? 'followers' : 'likes';
    
    if (isNaN(value) || value < 1) {
        value = 1;
    } else if (value > 100) {
        value = 100;
    }
    
    input.value = value;
    
    if (type === 'followers') {
        followersQty = value;
    } else {
        likesQty = value;
    }
    
    updateSliders();
    calculateTotal();
}

// Calculate total price
function calculateTotal() {
    // Calculate individual totals
    const followersTotal = followersQty * PRICES.followers;
    const likesTotal = likesQty * PRICES.likes;
    const grandTotal = followersTotal + likesTotal;
    
    // Update followers display
    document.getElementById('followers-price').textContent = formatNumber(followersTotal);
    document.getElementById('summary-followers').textContent = formatK(followersQty);
    document.getElementById('summary-followers-price').textContent = formatNumber(followersTotal);
    
    // Update likes display
    document.getElementById('likes-price').textContent = formatNumber(likesTotal);
    document.getElementById('summary-likes').textContent = formatK(likesQty);
    document.getElementById('summary-likes-price').textContent = formatNumber(likesTotal);
    
    // Update grand total
    document.getElementById('total-price').textContent = formatNumber(grandTotal);
    
    // Update unit prices
    document.getElementById('followers-unit-price').textContent = PRICES.followers;
    document.getElementById('likes-unit-price').textContent = PRICES.likes;
    
    // Animate total amount
    const totalElement = document.getElementById('total-price');
    totalElement.style.transform = 'scale(1.1)';
    totalElement.style.color = '#ff4d8d';
    
    setTimeout(() => {
        totalElement.style.transform = 'scale(1)';
        totalElement.style.color = '';
    }, 300);
}

// Send order to WhatsApp
function sendToWhatsApp() {
    // Get form values
    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const notes = document.getElementById('notes').value.trim();
    
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
    const followersTotal = followersQty * PRICES.followers;
    const likesTotal = likesQty * PRICES.likes;
    const grandTotal = followersTotal + likesTotal;
    
    // Format quantities
    const followersFormatted = followersQty === 1 ? '1,000' : `${followersQty},000`;
    const likesFormatted = likesQty === 1 ? '1,000' : `${likesQty},000`;
    
    // Create WhatsApp message
    let message = `*NEW ORDER - SocialBoost.pro*%0A%0A`;
    message += `*Instagram Username:* ${username}%0A`;
    
    if (phone) {
        message += `*WhatsApp:* ${phone}%0A`;
    }
    
    message += `%0A*Order Details:*%0A`;
    message += `✅ *Followers:* ${followersFormatted} - ₹${followersTotal}%0A`;
    message += `❤️ *Likes:* ${likesFormatted} - ₹${likesTotal}%0A`;
    message += `%0A*Total Amount:* *₹${grandTotal}*%0A`;
    
    if (notes) {
        message += `%0A*Notes:* ${notes}%0A`;
    }
    
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
        document.getElementById('notes').value = '';
    }, 3000);
}

// Reset order to default
function resetOrder() {
    followersQty = 1;
    likesQty = 1;
    
    document.getElementById('followers-qty').value = 1;
    document.getElementById('likes-qty').value = 1;
    
    updateSliders();
    calculateTotal();
    
    // Animate reset
    const summaryCard = document.querySelector('.summary-card');
    summaryCard.style.transform = 'scale(0.98)';
    summaryCard.style.boxShadow = '0 5px 15px rgba(255, 77, 141, 0.3)';
    
    setTimeout(() => {
        summaryCard.style.transform = '';
        summaryCard.style.boxShadow = '';
    }, 300);
    
    showToast('Order reset to default!');
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format K for display
function formatK(value) {
    return value === 1 ? '1K' : `${value}K`;
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
    } else {
        toastLogo.style.borderColor = 'var(--success)';
        toast.style.borderLeft = '5px solid var(--success)';
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
    
    // R to refresh prices (demo)
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        showToast('Prices refreshed!', 'success');
    }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});