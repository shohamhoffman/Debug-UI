/**
 * ShopCart Checkout Logic
 * 
 * This file contains 2 FUNCTIONAL BUGS:
 * 
 * BUG #2: changeQty() has an off-by-one error
 * - Clicking +/- on item 0 changes item 1's quantity
 * - The bug: uses (index + 1) instead of index
 * 
 * BUG #3: removeItem() removes the wrong item  
 * - Clicking remove on item 0 removes item 1
 * - The bug: uses (index + 1) instead of index
 * 
 * Tests pass because they check:
 * - "Did the total change?" ✅ (yes, but wrong item changed!)
 * - "Was an item removed?" ✅ (yes, but wrong item removed!)
 */

// Cart state
let cartItems = [
    { name: 'Wireless Headphones', price: 149.99, qty: 1 },
    { name: 'Phone Case', price: 29.99, qty: 1 },
    { name: 'USB-C Cable', price: 79.99, qty: 1 }
];

/**
 * BUG #2: OFF-BY-ONE ERROR
 * When user clicks +/- on item at index, we modify index+1 instead!
 * 
 * User clicks "-" on Headphones (index 0)
 * Expected: Headphones qty goes from 1 to 0
 * Actual: Phone Case qty goes from 1 to 0 (wrong item!)
 */
function changeQty(index, delta) {
    // BUG: The developer accidentally wrote index + 1 instead of index
    // This causes clicking on item 0 to modify item 1!
    const wrongIndex = index + 1;  // BUG! Should be just: index
    
    if (wrongIndex >= cartItems.length) return;
    
    const newQty = cartItems[wrongIndex].qty + delta;
    if (newQty >= 1 && newQty <= 10) {
        cartItems[wrongIndex].qty = newQty;
        updateUI();
    }
}

/**
 * BUG #3: REMOVES WRONG ITEM
 * When user clicks remove on item at index, we remove index+1 instead!
 * 
 * User clicks "X" on Headphones (index 0)
 * Expected: Headphones is removed
 * Actual: Phone Case is removed (wrong item!)
 */
function removeItem(index) {
    // BUG: Same off-by-one error - removes the wrong item!
    const wrongIndex = index + 1;  // BUG! Should be just: index
    
    if (wrongIndex >= cartItems.length) return;
    
    cartItems.splice(wrongIndex, 1);
    updateUI();
}

function updateUI() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    
    cartItems.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.dataset.index = index;
        itemEl.dataset.price = item.price;
        itemEl.innerHTML = `
            <img src="https://via.placeholder.com/80" alt="Product">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="qty-controls">
                <button class="qty-btn minus" onclick="changeQty(${index}, -1)">−</button>
                <span class="item-qty" data-index="${index}">${item.qty}</span>
                <button class="qty-btn plus" onclick="changeQty(${index}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeItem(${index})">✕</button>
        `;
        container.appendChild(itemEl);
    });
    
    updateTotal();
}

function updateTotal() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = 9.99;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Update header cart count
    const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
    document.querySelector('.nav a:nth-child(2)').textContent = `Cart (${itemCount})`;
    
    // Update button
    document.getElementById('place-order-btn').textContent = `Place Order - $${total.toFixed(2)}`;
}

async function handleSubmit(event) {
    event.preventDefault();
    
    const button = document.getElementById('place-order-btn');
    const originalText = button.textContent;
    
    // Show loading state
    button.disabled = true;
    button.textContent = 'Processing...';
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message (BUG #1: appears behind header due to z-index!)
    const successMessage = document.getElementById('success-message');
    successMessage.classList.add('visible');
    
    // Reset button
    button.disabled = false;
    button.textContent = originalText;
    
    return false;
}

function closeSuccess() {
    const successMessage = document.getElementById('success-message');
    successMessage.classList.remove('visible');
}

// Initialize totals on load
document.addEventListener('DOMContentLoaded', updateTotal);
