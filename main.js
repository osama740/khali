document.addEventListener("DOMContentLoaded", function() {

  const cartButton = document.getElementById("cartButton");
  const sideCart = document.getElementById("sideCart");
  const closeCart = document.getElementById("closeCart");
  const cartCount = document.getElementById("cartCount");
  const sideCartItems = document.getElementById("sideCartItems");
  const sideTotalPrice = document.getElementById("sideTotalPrice");
const clearCartBtn = document.getElementById('clearCart');


  let cart = [];


// Touch-friendly hover effect
document.querySelectorAll('.item').forEach(el => {
  el.addEventListener('touchstart', () => {
    el.classList.add('touch-active');
    // إزالة التأثير بعد 300ms
    setTimeout(() => {
      el.classList.remove('touch-active');
    }, 300);
  });
});





  // فتح/غلق السلة
  cartButton.addEventListener("click", () => {
    sideCart.classList.add("open");
  });

  closeCart.addEventListener("click", () => {
    sideCart.classList.remove("open");
  });

  // إضافة عنصر عند الضغط على أي .item
// يمنع أي حدث على الـ select من الانتقال للكرت
document.querySelectorAll(".no-order").forEach(el => {
  ["click", "mousedown", "mouseup", "change"].forEach(evt => {
    el.addEventListener(evt, e => e.stopPropagation());
  });
});

// كود إضافة الطلب للكرت نفسه
document.querySelectorAll(".item").forEach(el => {
  el.addEventListener("click", () => {
    const nameEl = el.querySelector("h3");
    const selectEl = el.querySelector(".price-select");
    const priceEl = el.querySelector(".price");
    if(!nameEl || !priceEl) return;

    const selectedPrice = selectEl ? parseInt(selectEl.value) : parseInt(priceEl.innerText.replace(/[^0-9]/g,''));
    const selectedOptionText = selectEl ? selectEl.options[selectEl.selectedIndex].text : "";

    const name = selectedOptionText ? `${nameEl.innerText} (${selectedOptionText.split(" - ")[0]})` : nameEl.innerText;
    const price = selectedPrice;

    // أضف إلى السلة
    cart.push({name, price});
    updateCart();
    // بعد إضافة عنصر للسلة
el.classList.add('highlight');
setTimeout(() => {
  el.classList.remove('highlight');
}, 1000);

  });
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

    // إزالة عنصر
    sideCartItems.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = parseInt(e.target.dataset.index);
        cart.splice(idx,1);
        updateCart();
      });
    });
  }

  // زر تفريغ السلة
  if(clearCartBtn){
    clearCartBtn.addEventListener("click", () => {
      cart = [];
      updateCart();
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
  const sendOrderBtn = document.getElementById("sendOrder");
  const sideCartItems = document.getElementById("sideCartItems");

  // رقم صاحب المحل
  const phoneNumber = "96170693041";

  sendOrderBtn.addEventListener("click", () => {
    const items = sideCartItems.querySelectorAll(".cart-item");
    if (items.length === 0) {
      alert("السلة فارغة");
      return;
    }

    let message = "🛒 طلب جديد:\n\n";
    items.forEach(item => {
      const name = item.querySelector("span").innerText;
      message += `- ${name}\n`;
    });

    // إذا بدك، ممكن تضيف إجمالي السعر هنا
    const totalPrice = document.getElementById("sideTotalPrice").innerText;
    message += `\n💰 الإجمالي: ${totalPrice}`;

    // رابط واتساب
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // فتح واتساب
    window.open(whatsappURL, "_blank");
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".item");

  function showItems() {
    const triggerBottom = window.innerHeight * 0.85; // متى نبدأ العرض
    items.forEach(item => {
      const itemTop = item.getBoundingClientRect().top;
      if(itemTop < triggerBottom) {
        item.classList.add("show");
      }
    });
  }

  window.addEventListener("scroll", showItems);
  showItems(); // لتفعيل اللي ظاهر من البداية
});


document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('touchstart', () => {
    item.classList.add('touch-active');
  });
  item.addEventListener('touchend', () => {
    setTimeout(() => item.classList.remove('touch-active'), 500);
  });
});

// تأثير hover للموبايل
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('touchstart', () => {
    // أضف التأثير
    item.style.transform = 'scale(1.07)';
    item.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.6)';

    // أرجع الحجم الطبيعي بعد 300ms
    setTimeout(() => {
      item.style.transform = '';
      item.style.boxShadow = '';
    }, 300);
  });
});
