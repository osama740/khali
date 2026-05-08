const APP_VERSION = "1.0.3";

document.addEventListener("DOMContentLoaded", function() {

  function buildBbqVariantOptions() {
    const bbqSelects = document.querySelectorAll(".bbq-variant-select");

    bbqSelects.forEach((selectEl) => {
      const basePrice = parseInt(selectEl.dataset.basePrice || "0", 10);
      if (!basePrice) return;

      const friesExtra = parseInt(selectEl.dataset.friesExtra || "0", 10);
      const explicitDoublePrice = parseInt(
        selectEl.dataset.doublePrice || "0",
        10
      );
      const doubleMultiplier = parseInt(
        selectEl.dataset.doubleMultiplier || "2",
        10
      );
      const doublePrice = explicitDoublePrice || basePrice * doubleMultiplier;

      const variants = [
        {
          label: "عادي",
          price: basePrice,
          optionText: "عادي"
        },
        {
          label: "عادي + زيادة بطاطا",
          price: basePrice + friesExtra,
          optionText: "عادي + زيادة بطاطا"
        },
        {
          label: "دوبل",
          price: doublePrice,
          optionText: "دوبل"
        },
        {
          label: "دوبل + زيادة بطاطا",
          price: doublePrice + friesExtra,
          optionText: "دوبل + زيادة بطاطا"
        }
      ];

      selectEl.innerHTML = variants
        .map(
          (variant) =>
            `<option value="${variant.price}" data-option="${variant.optionText}">${variant.label} - ${variant.price.toLocaleString()} L.L</option>`
        )
        .join("");
    });
  }

  buildBbqVariantOptions();

  const cartButton = document.getElementById("cartButton");
  const sideCart = document.getElementById("sideCart");
  const closeCart = document.getElementById("closeCart");
  const cartCount = document.getElementById("cartCount");
  const sideCartItems = document.getElementById("sideCartItems");
  const sideTotalPrice = document.getElementById("sideTotalPrice");
  const clearCartBtn = document.getElementById("clearCart");
  const cartHint = document.getElementById("cartHint");

  let cart = [];

  // منع الضغط على select من إضافة الطلب
  document.querySelectorAll(".no-order").forEach(el => {
    ["click", "mousedown", "mouseup", "change"].forEach(evt => {
      el.addEventListener(evt, e => e.stopPropagation());
    });
  });

  // فتح / إغلاق السلة
  cartButton.addEventListener("click", () => {
    sideCart.classList.add("open");
    document.body.classList.add("cart-open");
  });
  closeCart.addEventListener("click", () => {
    sideCart.classList.remove("open");
    document.body.classList.remove("cart-open");
  });

  if (cartHint) {
    const showCartHint = () => {
      if (document.body.classList.contains("cart-open")) return;
      cartHint.classList.add("show");
      setTimeout(() => {
        cartHint.classList.remove("show");
      }, 3000);
    };

    showCartHint();
    setInterval(showCartHint, 8000);

    cartButton.addEventListener("click", () => {
      cartHint.classList.remove("show");
    });
  }

  let selectedItem = null;

  const noteModal = document.getElementById("noteModal");
  const noteItemName = document.getElementById("noteItemName");
  const itemNote = document.getElementById("itemNote");
  const addWithNote = document.getElementById("addWithNote");
  const cancelNote = document.getElementById("cancelNote");

  // عند الضغط على الصنف
  document.querySelectorAll(".item").forEach(el => {
    el.addEventListener("click", () => {

      const nameEl = el.querySelector("h3");
      const selectEl = el.querySelector(".price-select");
      const priceEl = el.querySelector(".price");
      const breadOption = el.querySelector(".bread-option input[type='radio']:checked");
      const isBreakfastItem = el.classList.contains("breakfast-item");

      if (!nameEl) return;

      if (isBreakfastItem && !breadOption) {
        return;
      }

      let baseName = nameEl.innerText;
      let finalName = baseName;
      let price = 0;

      if (selectEl) {
        const option = selectEl.options[selectEl.selectedIndex];
        const optionText = option.dataset.option || "";

        price = parseInt(option.value);

        if (optionText && optionText !== "عادي") {
          finalName = `${baseName} - ${optionText}`;
        }
      } else if (breadOption) {
        const breadText = breadOption.value || breadOption.closest("label")?.innerText.trim() || "";
        const priceText = priceEl?.dataset.price || priceEl?.innerText || "0";
        price = parseInt(String(priceText).replace(/[^0-9]/g, ""), 10) || 0;

        if (breadText) {
          finalName = `${baseName} - ${breadText}`;
        }
      } else if (priceEl) {
        const priceText = priceEl.dataset.price || priceEl.innerText || "0";
        price = parseInt(String(priceText).replace(/[^0-9]/g, ""), 10) || 0;
      }

      selectedItem = {
        name: finalName,
        price: price,
        element: el
      };

      noteItemName.innerText = finalName;
      itemNote.value = "";
      noteModal.style.display = "flex";
    });
  });

  // إضافة للسلة مع الملاحظة
  addWithNote.addEventListener("click", () => {
    if (!selectedItem) return;

    let finalName = selectedItem.name;
    const note = itemNote.value.trim();

    if (note) {
      finalName += ` (ملاحظة: ${note})`;
    }

    const existing = cart.find(
      (item) => item.name === finalName && item.price === selectedItem.price
    );
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        name: finalName,
        price: selectedItem.price,
        qty: 1
      });
    }

    updateCart();

    selectedItem.element.classList.add("highlight");
    setTimeout(() => {
      selectedItem.element.classList.remove("highlight");
    }, 800);

    noteModal.style.display = "none";
    selectedItem = null;
  });

  cancelNote.addEventListener("click", () => {
    noteModal.style.display = "none";
    selectedItem = null;
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
    // إضافة عنصر عند الضغط على أي .item
    document.querySelectorAll(".item").forEach(el => {
      el.addEventListener("click", () => {
        const nameEl = el.querySelector("h3");
        const priceEl = el.querySelector(".price");
        if (!nameEl || !priceEl) return;

        const breadOption = el.querySelector(".bread-option input[type='radio']:checked");
        const name = breadOption
          ? `${nameEl.innerText} - ${breadOption.value || ""}`.trim()
          : nameEl.innerText;

        const priceText = priceEl.dataset.price || priceEl.innerText || "0";
        const price = parseInt(String(priceText).replace(/[^0-9]/g, ""), 10) || 0;

        openOrderNoteModal(name, price);
      });
    });
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
      });

      const totalPrice = sideTotalPrice.innerText;
      message += `\n الإجمالي: ${totalPrice}`;

      const whatsappURL =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappURL, "_blank");
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".item");

  function showItems() {
    const triggerBottom = window.innerHeight * 0.96;
    items.forEach(item => {
      const itemTop = item.getBoundingClientRect().top;
      if (itemTop < triggerBottom) {
        item.classList.add("show");
      }
    });
  }

  window.addEventListener("scroll", showItems);
  showItems(); // لإظهار العناصر مباشرة
});
document.addEventListener("DOMContentLoaded", function () {
  const backToTop = document.getElementById("backToTop");
  if (!backToTop) return;

  function checkScroll() {
    if (window.scrollY > 300) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  window.addEventListener("scroll", checkScroll);
  window.addEventListener("resize", checkScroll);
  checkScroll();

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

