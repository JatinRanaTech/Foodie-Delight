const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsList = document.getElementById('cartItems');
const cartCountElement = cartBtn.querySelector('.cart-count');
const cartTotalElement = document.getElementById('cartTotal');
const placeOrderBtn = document.getElementById('placeOrderBtn');

let cart = [];

cartBtn.addEventListener('click', () => {
  if (cartSidebar.style.right === '0px') {
    cartSidebar.style.right = '-350px';
  } else {
    cartSidebar.style.right = '0px';
  }
});
closeCartBtn.addEventListener('click', () => {
  cartSidebar.style.right = '-350px';
});

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const menuItem = button.closest('.menu-item');
    const title = menuItem.querySelector('.menu-title').textContent;
    const priceText = menuItem.querySelector('.price').textContent;
    const price = parseFloat(priceText.replace(/[^0-9.-]+/g,""));

    const existingItem = cart.find(item => item.title === title);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ title, price, quantity: 1 });
    }

    updateCartUI();
    cartSidebar.style.right = '0px';
  });
});

function updateCartUI() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.textContent = totalQuantity;

  if (cart.length === 0) {
    cartItemsList.innerHTML = '<li style="color: #777; text-align: center; margin-top: 2rem;">Your cart is empty.</li>';
    cartTotalElement.textContent = '₹0.00';
    placeOrderBtn.disabled = true;
    placeOrderBtn.style.cursor = 'not-allowed';
    placeOrderBtn.style.background = '#ccc';
    return;
  }

  cartItemsList.innerHTML = '';
  let totalPrice = 0;

  cart.forEach((item, index) => {
    totalPrice += item.price * item.quantity;

    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.marginBottom = '1rem';

    li.innerHTML = `
      <div>
        <strong>${item.title}</strong><br>
        <small>₹${item.price.toFixed(2)} x ${item.quantity}</small>
      </div>
      <div>
        <button data-index="${index}" class="decrease" style="background:none; border:none; font-size:1.2rem; cursor:pointer; margin-right:8px;">-</button>
        <button data-index="${index}" class="increase" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">+</button>
        <button data-index="${index}" class="remove" title="Remove" style="background:none; border:none; color:#ff4d4f; font-size:1.2rem; cursor:pointer; margin-left:10px;">&times;</button>
      </div>
    `;

    cartItemsList.appendChild(li);
  });

  cartTotalElement.textContent = `₹${totalPrice.toFixed(2)}`;

  placeOrderBtn.disabled = false;
  placeOrderBtn.style.cursor = 'pointer';
  placeOrderBtn.style.background = 'var(--primary)';

  cartItemsList.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      cart[idx].quantity++;
      updateCartUI();
    });
  });

  cartItemsList.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      if (cart[idx].quantity > 1) {
        cart[idx].quantity--;
      } else {
        cart.splice(idx, 1);
      }
      updateCartUI();
    });
  });

  cartItemsList.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      cart.splice(idx, 1);
      updateCartUI();
    });
  });
}

placeOrderBtn.addEventListener('click', () => {
  if (cart.length === 0) return;

  alert('Your order has been placed! Thank you for ordering.');

  cart = [];
  updateCartUI();
  cartSidebar.style.right = '-350px';
});

updateCartUI();