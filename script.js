const form = document.getElementById('order-form');
const totalSalesE1 = document.getElementById('total-sales');
const totalProfitE1 = document.getElementById('total-profit');
const payoutBtn = document.getElementById('payout-button'); // Fixed ID here

let totalSales = 0;
let totalProfit = 0;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const basePrice = parseFloat(document.getElementById('base-price').value);
    const markup = parseFloat(document.getElementById('markup').value);

    const salesAmount = basePrice + markup;
    totalSales += salesAmount;
    totalProfit += markup;

    totalSalesE1.textContent = totalSales.toFixed(2);
    totalProfitE1.textContent = totalProfit.toFixed(2);

    if (totalProfit >= 100) {
        payoutBtn.disabled = false;
    }

    updateProgressWheel();
    form.reset();
});

payoutBtn.addEventListener('click', () => {
    if (totalProfit >= 100) {
        alert('Payout requested!');
        totalProfit = 0;
        totalSalesE1.textContent = '0.00';
        payoutBtn.disabled = true;
        updateProgressWheel();
    }
});

function updateProgressWheel() {
    const canvas = document.getElementById('progressWheel'); // Fixed here
    const ctx = canvas.getContext('2d');
    const percentage = Math.min(totalProfit / 100, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background draw circle
    ctx.beginPath();
    ctx.arc(75, 75, 60, 0, 2 * Math.PI);
    ctx.strokeStyle = "#C19A6B";
    ctx.lineWidth = 10;
    ctx.stroke();

    // Draw Progress Arc
    ctx.beginPath();
    ctx.arc(75, 75, 60, -Math.PI / 2, (2 * Math.PI * percentage) - Math.PI / 2); // Fixed typo here
    ctx.strokeStyle = '#A5B79A';
    ctx.lineWidth = 10;
    ctx.stroke();
}

if (!localStorage.getItem('affiliateEmail')) {
    window.location.href = 'index.html';
}

/* Login page */
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    /* Fake Users */
    const users = {
        'affiliate@luxesuds.com': 'pass123',
        'admin@luxesuds.com': 'admin123'
    };

    if (users[email] && users[email] === password) {
        if (email === 'admin@luxesuds.com') {
            window.location.href = 'admin.html';
        } else {
            localStorage.setItem('affiliateEmail', email);
            window.location.href = 'dashboard.html';
        }
    } else {
        document.getElementById('login-message').textContent = 'Invalid Login Credentials';
    }
});
// Mark the current page as active in the menu
document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('.menu-bar nav ul li a');

    // Loop through each link and highlight the active one
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
});

/* Modified index-page */
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    /* Admin login (hardcoded) */
    if (email === 'admin@luxesuds.com' && password === 'admin123') {
        window.location.href = 'admin.html';
        return;
    }

    const users = JSON.parse(localStorage.getItem('affiliates')) || [];

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem('affiliateEmail', user.email);
        localStorage.setItem('affiliateName', user.name);  // Use 'user.name' instead of 'Name'
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('login-message').textContent = 'Invalid credentials';
    }
});

/* Dashboard modified */
 const name = localStorage.getItem('affiliateName');
 document.getElementById('affiliate-name').textContent = name || 'Affiliate';

 /* Products page */
const addCartButtons = document.querySelectorAll('.add-cart');
const markupInputs = document.querySelectorAll('.markup');

addCartButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const name = button.dataset.name;
        const base = parseFloat(button.dataset.base);
        const markup = parseFloat(markupInputs[index].value) || 0;

        if (markup > base) {
            alert('Markup can\'t be more than base price (100%).');
            return;
        }

        const finalPrice = base - 5 + markup;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        cart.push({ name, base, markup, finalPrice });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${name} added to cart at R${finalPrice.toFixed(2)}.`);
    });
});

/* Checkout page */

const cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartList = document.getElementById('cart-items');
const totalEl = document.getElementById('total');

let total = 0;

if (cart.length === 0) {
  cartList.innerHTML = "<li>Your cart is empty.</li>";
} else {
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name}: R${item.finalPrice.toFixed(2)} (Base R${item.base} + Markup R${item.markup})`;
    cartList.appendChild(li);
    total += item.finalPrice;
  });
}

totalEl.textContent = total.toFixed(2);
