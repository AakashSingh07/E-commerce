let cart = [];

function loadCartFromStorage() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }
}

function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function handleAddToCartButtons() {
  const buttons = document.querySelectorAll(".add-to-cart");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const price = parseInt(button.getAttribute("data-price"));
      const image = button.getAttribute("data-image");

      const existingItem = cart.find(item => item.name === name);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, image, quantity: 1 });
      }

      saveCartToStorage();
      alert(`${name} added to cart!`);
      updateCartUI();
    });
  });
}

function removeFromCart(index) {
  if (index >= 0 && index < cart.length) {
    const removed = cart.splice(index, 1)[0];
    alert(`${removed.name} removed from cart.`);
    saveCartToStorage();
    updateCartUI();
  }
}

function updateCartUI() {
  const cartTable = document.getElementById("cart-table");
  const totalBox = document.getElementById("total-price");

  if (!cartTable || !totalBox) return;

  cartTable.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const row = `
      <tr>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td>${item.quantity}</td>
        <td>₹${itemTotal}</td>
        <td><button onclick="removeFromCart(${index})">Remove</button></td>
      </tr>
    `;
    cartTable.innerHTML += row;
  });

  totalBox.innerText = `Grand Total: ₹${total}`;
}

function setupCheckoutButton() {
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty! Add items before checkout.");
      } else {
        window.location.href = "checkout.html";
      }
    });
  }
}

function handleNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("newsletter-email");
  const messageBox = document.getElementById("newsletter-message");

  if (form && emailInput && messageBox) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (email && email.includes("@") && email.includes(".")) {
        messageBox.textContent = "🎉 Thank you for subscribing!";
        messageBox.style.color = "green";

        let subscriptions = JSON.parse(localStorage.getItem("subscriptions") || "[]");
        subscriptions.push(email);
        localStorage.setItem("subscriptions", JSON.stringify(subscriptions));

        form.reset();
      } else {
        messageBox.textContent = "Please enter a valid email address.";
        messageBox.style.color = "red";
      }
    });
  }
}

function handleContactForm() {
  const form = document.getElementById("contact-form");
  const name = document.getElementById("contact-name");
  const email = document.getElementById("contact-email");
  const message = document.getElementById("contact-message");

  if (form && name && email && message) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameVal = name.value.trim();
      const emailVal = email.value.trim();
      const messageVal = message.value.trim();

      if (!nameVal || !emailVal || !messageVal || !emailVal.includes("@")) {
        alert("Please enter valid details in all fields.");
        return;
      }

      let messages = JSON.parse(localStorage.getItem("messages") || "[]");
      messages.push({ name: nameVal, email: emailVal, message: messageVal });
      localStorage.setItem("messages", JSON.stringify(messages));

      const confirmationHTML = `
        <html>
        <head>
          <title>Message Sent</title>
          <style>
            body {
              font-family: 'Poppins', sans-serif;
              text-align: center;
              padding-top: 100px;
              background-color: #fdfde0;
              color: #2e7d32;
            }
            h1 {
              font-size: 28px;
              margin-bottom: 20px;
            }
            .emoji {
              font-size: 48px;
            }
          </style>
        </head>
        <body>
          <div class="emoji">✅</div>
          <h1>Your message has been sent!</h1>
          <p>Thank you for contacting us. We'll respond soon.</p>
        </body>
        </html>
      `;

      const newTab = window.open();
      newTab.document.write(confirmationHTML);
      newTab.document.close();

      form.reset();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();
  updateCartUI();
  handleAddToCartButtons();
  setupCheckoutButton();
  handleNewsletterForm();
  handleContactForm();
});
