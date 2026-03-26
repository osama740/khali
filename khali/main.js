const APP_VERSION = "1.0.2";

document.addEventListener("DOMContentLoaded", function() {

  const cartButton = document.getElementById("cartButton");
  const sideCart = document.getElementById("sideCart");
  const closeCart = document.getElementById("closeCart");
  const cartCount = document.getElementById("cartCount");
  const sideCartItems = document.getElementById("sideCartItems");
  const sideTotalPrice = document.getElementById("sideTotalPrice");
  const clearCartBtn = document.getElementById("clearCart");
  const cartHint = document.getElementById("cartHint");
  const orderNoteModal = document.getElementById("orderNoteModal");
  const orderNoteInput = document.getElementById("orderNoteInput");
  const orderNoteSubmit = document.getElementById("orderNoteSubmit");
  const orderNoteCancel = document.getElementById("orderNoteCancel");


  let cart = [];
  let pendingOrder = null;

  function addItemToCart(name, price, note) {
    const normalizedNote = (note || "").trim();
    const existing = cart.find(
      (item) => item.name === name && item.price === price && item.note === normalizedNote
    );

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1, note: normalizedNote });
    }

    updateCart();
  }

  function openOrderNoteModal(name, price) {
    if (!orderNoteModal || !orderNoteInput) {
      addItemToCart(name, price, "");
      return;
    }

    pendingOrder = { name, price };
    orderNoteInput.value = "";
    orderNoteModal.classList.add("open");
    orderNoteModal.setAttribute("aria-hidden", "false");
    orderNoteInput.focus();
  }

  function closeOrderNoteModal() {
    if (!orderNoteModal) return;
    orderNoteModal.classList.remove("open");
    orderNoteModal.setAttribute("aria-hidden", "true");
    pendingOrder = null;
  }

  // فتح/غلق السلة
  cartButton.addEventListener("click", () => {
    sideCart.classList.add("open");
    document.body.classList.add("cart-open");
  });

  closeCart.addEventListener("click", () => {
    sideCart.classList.remove("open");
    document.body.classList.remove("cart-open");
  });

  if (cartHint) {
    const positionCartHint = () => {
      const cartRect = cartButton.getBoundingClientRect();
      const hintHeight = cartHint.offsetHeight || 32;
      const spacing = 10;

      const top = Math.max(8, cartRect.top - hintHeight - spacing);
      const left = cartRect.left + cartRect.width / 2;

      cartHint.style.top = `${Math.round(top)}px`;
      cartHint.style.left = `${Math.round(left)}px`;
      cartHint.style.right = "auto";
      cartHint.style.bottom = "auto";
    };

    const showCartHint = () => {
      if (document.body.classList.contains("cart-open")) return;
      positionCartHint();
      cartHint.classList.add("show");
      setTimeout(() => {
        cartHint.classList.remove("show");
      }, 3000);
    };

    positionCartHint();
    showCartHint();
    setInterval(showCartHint, 8000);

    window.addEventListener("scroll", positionCartHint, { passive: true });
    window.addEventListener("resize", positionCartHint);

    cartButton.addEventListener("click", () => {
      cartHint.classList.remove("show");
    });
  }

  // إضافة عنصر عند الضغط على أي .item
  document.querySelectorAll(".item").forEach(el => {
    el.addEventListener("click", () => {
      const nameEl = el.querySelector("h3");
      const priceEl = el.querySelector(".price");
      if (!nameEl || !priceEl) return;

      const name = nameEl.innerText;
      const price = parseInt(priceEl.innerText.replace(/[^0-9]/g, ""), 10);
      if (Number.isNaN(price)) return;

      openOrderNoteModal(name, price);
    });
  });

  if (orderNoteSubmit) {
    orderNoteSubmit.addEventListener("click", () => {
      if (!pendingOrder) {
        closeOrderNoteModal();
        return;
      }

      const note = orderNoteInput ? orderNoteInput.value : "";
      addItemToCart(pendingOrder.name, pendingOrder.price, note);
      closeOrderNoteModal();
    });
  }

  if (orderNoteCancel) {
    orderNoteCancel.addEventListener("click", () => {
      closeOrderNoteModal();
    });
  }

  if (orderNoteModal) {
    orderNoteModal.addEventListener("click", (event) => {
      if (event.target === orderNoteModal) {
        closeOrderNoteModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && orderNoteModal && orderNoteModal.classList.contains("open")) {
      closeOrderNoteModal();
    }
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
      const noteHtml = item.note
        ? `<span class="cart-item-meta">ملاحظة: ${item.note}</span>`
        : "";
      div.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-meta">${item.price.toLocaleString()} L.L</span>
          ${noteHtml}
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
  if (clearCartBtn) {
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

      let message = "طلب جديد:\n\n";
      cart.forEach(item => {
        const lineTotal = item.price * item.qty;
        message += `- ${item.name} x${item.qty} = ${lineTotal.toLocaleString()} L.L\n`;
        if (item.note) {
          message += `  ملاحظة: ${item.note}\n`;
        }
      });

      const totalPrice = document.getElementById("sideTotalPrice").innerText;
      message += `\n الإجمالي: ${totalPrice}`;

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
