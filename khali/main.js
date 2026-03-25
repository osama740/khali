const APP_VERSION = "1.0.0";

document.addEventListener("DOMContentLoaded", function() {

  const cartButton = document.getElementById("cartButton");
  const sideCart = document.getElementById("sideCart");
  const closeCart = document.getElementById("closeCart");
  const cartCount = document.getElementById("cartCount");
  const sideCartItems = document.getElementById("sideCartItems");
  const sideTotalPrice = document.getElementById("sideTotalPrice");
const clearCartBtn = document.getElementById('clearCart');


  let cart = [];

  // فتح/غلق السلة
  cartButton.addEventListener("click", () => {
    sideCart.classList.add("open");
    document.body.classList.add("cart-open");
  });

  closeCart.addEventListener("click", () => {
    sideCart.classList.remove("open");
    document.body.classList.remove("cart-open");
  });

  // إضافة عنصر عند الضغط على أي .item
  document.querySelectorAll(".item").forEach(el => {
    el.addEventListener("click", () => {
      const nameEl = el.querySelector("h3");
      const priceEl = el.querySelector(".price");
      if(!nameEl || !priceEl) return;

      const name = nameEl.innerText;
      const price = parseInt(priceEl.innerText.replace(/[^0-9]/g,''));

      // أضف إلى السلة
      const existing = cart.find(
        (item) => item.name === name && item.price === price
      );
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }
      updateCart();
    });
  });

  // تحديث السلة
  function updateCart() {
    sideCartItems.innerHTML = "";
    let total = 0;
    let totalQty = 0;

    cart.forEach((item, index) => {
      const lineTotal = item.price * item.qty;
      total += lineTotal;
      totalQty += item.qty;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-meta">${item.price.toLocaleString()} L.L</span>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="dec" data-index="${index}">-</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-index="${index}">+</button>
          <span class="cart-item-total">${lineTotal.toLocaleString()} L.L</span>
          <button class="cart-item-remove" data-action="remove" data-index="${index}">✖</button>
        </div>
      `;
      sideCartItems.appendChild(div);
    });

    cartCount.innerText = totalQty;
    sideTotalPrice.innerText = total.toLocaleString() + " L.L";
  }

  sideCartItems.addEventListener("click", (event) => {
    const actionBtn = event.target.closest("[data-action]");
    if (!actionBtn) return;

    const idx = parseInt(actionBtn.dataset.index, 10);
    if (Number.isNaN(idx) || !cart[idx]) return;

    switch (actionBtn.dataset.action) {
      case "inc":
        cart[idx].qty += 1;
        break;
      case "dec":
        cart[idx].qty -= 1;
        if (cart[idx].qty <= 0) {
          cart.splice(idx, 1);
        }
        break;
      case "remove":
        cart.splice(idx, 1);
        break;
      default:
        break;
    }

    updateCart();
  });

  // زر تفريغ السلة
  if(clearCartBtn){
    clearCartBtn.addEventListener("click", () => {
      cart = [];
      updateCart();
    });
  }

    const welcomeScreen = document.getElementById("welcomeScreen");
    if (welcomeScreen) {
      document.body.classList.add("welcome-open");
      setTimeout(() => {
        welcomeScreen.classList.add("hide");
        document.body.classList.remove("welcome-open");
        setTimeout(() => {
          welcomeScreen.remove();
        }, 500);
      }, 2000);
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js?v=" + APP_VERSION);
    }

  const sendOrderBtn = document.getElementById("sendOrder");
  if (sendOrderBtn) {
    const phoneNumber = "96170693041";

    sendOrderBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("السلة فارغة");
        return;
      }

      let message = "🛒 طلب جديد:\n\n";
      cart.forEach(item => {
        const lineTotal = item.price * item.qty;
        message += `- ${item.name} x${item.qty} = ${lineTotal.toLocaleString()} L.L\n`;
      });

      const totalPrice = document.getElementById("sideTotalPrice").innerText;
      message += `\n💰 الإجمالي: ${totalPrice}`;

      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, "_blank");
    });
  }

});
document.addEventListener('DOMContentLoaded', function () {
  const backToTop = document.getElementById('backToTop');

  function checkScroll() {
    if (window.scrollY > 300) { // يظهر بعد النزول 300px
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }

  window.addEventListener('scroll', checkScroll);
  window.addEventListener('resize', checkScroll); // لو غيّر المستخدم حجم الشاشة
  checkScroll();

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".main-nav");
  const navLinks = Array.from(
    document.querySelectorAll(".main-nav a[href^='#']")
  );
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if (!nav || navLinks.length === 0 || sections.length === 0) return;

  const setActiveLink = () => {
    const navHeight = nav.offsetHeight || 0;
    const scrollY = window.scrollY + navHeight + 20;

    let currentSection = sections[0];
    sections.forEach((section) => {
      if (scrollY >= section.offsetTop) {
        currentSection = section;
      }
    });

    navLinks.forEach((link) => {
      const id = link.getAttribute("href").slice(1);
      link.classList.toggle("active-link", currentSection.id === id);
    });
  };

  window.addEventListener("scroll", setActiveLink, { passive: true });
  window.addEventListener("resize", setActiveLink);
  navLinks.forEach((link) => link.addEventListener("click", setActiveLink));
  setActiveLink();
});
