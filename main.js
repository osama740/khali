document.addEventListener("DOMContentLoaded", function() {

  const cartButton = document.getElementById("cartButton");
  const sideCart = document.getElementById("sideCart");
  const closeCart = document.getElementById("closeCart");
  const cartCount = document.getElementById("cartCount");
  const sideCartItems = document.getElementById("sideCartItems");
  const sideTotalPrice = document.getElementById("sideTotalPrice");
  const clearCartBtn = document.getElementById("clearCart");

  let cart = [];

  // منع الضغط على select من إضافة الطلب
  document.querySelectorAll(".no-order").forEach(el => {
    ["click", "mousedown", "mouseup", "change"].forEach(evt => {
      el.addEventListener(evt, e => e.stopPropagation());
    });
  });

  // فتح / إغلاق السلة
  cartButton.addEventListener("click", () => sideCart.classList.add("open"));
  closeCart.addEventListener("click", () => sideCart.classList.remove("open"));

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

      if (!nameEl) return;

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
      } else if (priceEl) {
        price = parseInt(priceEl.innerText.replace(/[^0-9]/g, ""));
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

    cart.push({
      name: finalName,
      price: selectedItem.price
    });

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

    cart.forEach((item, index) => {
      total += item.price;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <span>${item.name}</span>
        <span>${item.price.toLocaleString()} L.L
          <button class="remove" data-index="${index}">✖</button>
        </span>
      `;
      sideCartItems.appendChild(div);
    });

    cartCount.innerText = cart.length;
    sideTotalPrice.innerText = total.toLocaleString() + " L.L";

    sideCartItems.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = parseInt(e.target.dataset.index);
        cart.splice(idx, 1);
        updateCart();
      });
    });
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      cart = [];
      updateCart();
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".item");

  function showItems() {
    const triggerBottom = window.innerHeight * 0.85;
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
  const sendOrderBtn = document.getElementById("sendOrder");
  if (!sendOrderBtn) return;

  const phoneNumber = "96170693041";

  sendOrderBtn.addEventListener("click", () => {
    const cartItems = document.querySelectorAll("#sideCartItems .cart-item");

    if (cartItems.length === 0) {
      alert("السلة فارغة");
      return;
    }

    let message = "🛒 طلب جديد:\n\n";

    cartItems.forEach(item => {
      const name = item.querySelector("span").innerText;
      message += `- ${name}\n`;
    });

    const totalPrice = document.getElementById("sideTotalPrice").innerText;
    message += `\n💰 الإجمالي: ${totalPrice}`;

    const whatsappURL =
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
  });
});

