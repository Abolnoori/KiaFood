const products = [
  {
    id: 1,
    name: "چلو جوجه زعفرانی",
    category: "iranian",
    tag: "پرفروش",
    price: 285000,
    desc: "جوجه زعفرانی، برنج ایرانی، گوجه کبابی و کره.",
    img: "assets/images/joje.avif",
  },
  {
    id: 2,
    name: "چلو کباب کوبیده",
    category: "iranian",
    tag: "ویژه",
    price: 325000,
    desc: "دو سیخ کباب کوبیده با برنج ایرانی و دورچین.",
    img: "assets/images/kabab.avif",
  },
  {
    id: 3,
    name: "سمبوسه",
    category: "iranian",
    tag: "اصیل",
    price: 260000,
    desc: "سمبوسه جاافتاده ایرانی.",
    img: "assets/images/sambose.avif",
  },
  {
    id: 4,
    name: "برگر مخصوص کیا",
    category: "fastfood",
    tag: "محبوب",
    price: 295000,
    desc: "برگر گوشت، پنیر، سس اختصاصی و سبزیجات تازه.",
    img: "assets/images/berger.avif",
  },
  {
    id: 5,
    name: "پیتزا پپرونی",
    category: "fastfood",
    tag: "تند",
    price: 340000,
    desc: "خمیر دست‌ساز، پپرونی، پنیر موزارلا و سس مخصوص.",
    img: "assets/images/pitza.avif",
  },
  {
    id: 6,
    name: "چیکن برگر",
    category: "fastfood",
    tag: "تازه",
    price: 275000,
    desc: "فیله مرغ سوخاری، کاهو، پنیر و سس سیر.",
    img: "assets/images/chekenberger.avif",
  },
  {
    id: 7,
    name: "لیموناد تازه",
    category: "drink",
    tag: "خنک",
    price: 85000,
    desc: "لیموناد تازه با لیموی طبیعی و نعناع.",
    img: "assets/images/limonad.avif",
  },
  {
    id: 8,
    name: "موهیتو کیافود",
    category: "drink",
    tag: "محبوب",
    price: 110000,
    desc: "نعناع تازه، لیمو و نوشیدنی گازدار.",
    img: "assets/images/mohito.avif",
  },
  {
    id: 9,
    name: "چیزکیک توت‌فرنگی",
    category: "dessert",
    tag: "دسر",
    price: 145000,
    desc: "چیزکیک نرم با سس توت‌فرنگی تازه.",
    img: "assets/images/kik.avif",
  },
  {
    id: 10,
    name: "براونی شکلاتی",
    category: "dessert",
    tag: "شیرین",
    price: 125000,
    desc: "براونی شکلاتی گرم با مغز گردو.",
    img: "assets/images/shokolaty.avif",
  },
  {
    id: 11,
    name: "سیب‌زمینی مخصوص",
    category: "fastfood",
    tag: "کنار غذا",
    price: 125000,
    desc: "سیب‌زمینی ترد با پنیر و سس مخصوص کیا.",
    img: "assets/images/sib.avif",
  },
  {
    id: 12,
    name: "آیس‌کافی",
    category: "drink",
    tag: "خنک",
    price: 135000,
    desc: "قهوه سرد، شیر و یخ با طعم متعادل.",
    img: "assets/images/ais.avif",
  },
];

let activeCategory = "all";
let searchTerm = "";
let cart = JSON.parse(localStorage.getItem("kiafood-cart") || "[]");

const $ = (s) => document.querySelector(s);
const money = (n) => n.toLocaleString("fa-IR") + " تومان";

function renderProducts() {
  const list = products.filter(
    (p) =>
      (activeCategory === "all" || p.category === activeCategory) &&
      (p.name + " " + p.desc).toLowerCase().includes(searchTerm.toLowerCase()),
  );
  $("#products").innerHTML = list
    .map(
      (p) => `
    <article class="product">
      <div class="product-image">
        <img src="${p.img}" alt="${p.name}" loading="lazy"
          onerror="this.onerror=null;this.src='${p.img}';">
        <span class="product-tag">${p.tag}</span>
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-bottom">
          <span class="price">${money(p.price).replace(" تومان", "")} <small>تومان</small></span>
          <button class="add-btn" data-add="${p.id}" aria-label="افزودن ${p.name}">+</button>
        </div>
      </div>
    </article>
  `,
    )
    .join("");
  $("#emptyState").style.display = list.length ? "none" : "block";
}

function saveCart() {
  localStorage.setItem("kiafood-cart", JSON.stringify(cart));
}

function renderCart() {
  const items = cart.map((item) => ({
    ...products.find((p) => p.id === item.id),
    qty: item.qty,
  }));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  $("#cartCount").textContent = items.reduce((s, i) => s + i.qty, 0);
  $("#cartTotal").textContent = money(total);
  $("#cartEmpty").style.display = items.length ? "none" : "block";
  $("#cartItems").innerHTML = items
    .map(
      (i) => `
    <div class="cart-row">
      <img src="${i.img}" alt="${i.name}">
      <div>
        <h4>${i.name}</h4>
        <p>${money(i.price)}</p>
        <div class="qty">
          <button data-minus="${i.id}">−</button><span>${i.qty}</span><button data-plus="${i.id}">+</button>
        </div>
      </div>
      <button class="remove" data-remove="${i.id}" aria-label="حذف">×</button>
    </div>
  `,
    )
    .join("");
}

function addToCart(id) {
  const item = cart.find((x) => x.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  saveCart();
  renderCart();
  toast("غذا به سبد خرید اضافه شد 🍽️");
}
function changeQty(id, delta) {
  const item = cart.find((x) => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((x) => x.id !== id);
  saveCart();
  renderCart();
}
function toast(text) {
  const el = $("#toast");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(window.toastT);
  window.toastT = setTimeout(() => el.classList.remove("show"), 2200);
}

$("#products").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (btn) addToCart(Number(btn.dataset.add));
});
$("#categories").addEventListener("click", (e) => {
  const btn = e.target.closest(".cat");
  if (!btn) return;
  document
    .querySelectorAll(".cat")
    .forEach((x) => x.classList.remove("active"));
  btn.classList.add("active");
  activeCategory = btn.dataset.category;
  renderProducts();
});
$("#searchInput").addEventListener("input", (e) => {
  searchTerm = e.target.value;
  renderProducts();
});

$("#cartItems").addEventListener("click", (e) => {
  if (e.target.dataset.plus) changeQty(Number(e.target.dataset.plus), 1);
  if (e.target.dataset.minus) changeQty(Number(e.target.dataset.minus), -1);
  if (e.target.dataset.remove) {
    cart = cart.filter((x) => x.id !== Number(e.target.dataset.remove));
    saveCart();
    renderCart();
  }
});
function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#cartOverlay").classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartOverlay").classList.remove("show");
  document.body.style.overflow = "";
}
$("#cartOpen").onclick = openCart;
$("#cartClose").onclick = closeCart;
$("#cartOverlay").onclick = closeCart;

$("#checkout").onclick = () => {
  if (!cart.length) {
    toast("سبد خرید خالی است");
    return;
  }
  toast("این بخش آماده اتصال به درگاه سفارش است 🚀");
};

$("#menuToggle").onclick = () => $("#nav").classList.toggle("open");
document
  .querySelectorAll(".nav a")
  .forEach((a) => (a.onclick = () => $("#nav").classList.remove("open")));

$("#reviewForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("#formSuccess").style.display = "block";
  e.target.reset();
  setTimeout(() => ($("#formSuccess").style.display = "none"), 3500);
});

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((x) => {
      if (x.isIntersecting) x.target.classList.add("visible");
    }),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const sections = [...document.querySelectorAll("main section[id]")];
window.addEventListener("scroll", () => {
  const y = scrollY + 120;
  let current = "home";
  sections.forEach((s) => {
    if (y >= s.offsetTop) current = s.id;
  });
  document
    .querySelectorAll(".nav a")
    .forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + current),
    );
});

renderProducts();
renderCart();
