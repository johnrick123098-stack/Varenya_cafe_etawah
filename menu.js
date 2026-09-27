/* ============================================================================
   ★★★  VARENYA CAFE & BAKERY — MENU EDIT KARNE KE LIYE YAHIN BADLO  ★★★
   ----------------------------------------------------------------------------
   NON-TECH GUIDE (2 minute mein samjho):

   1. NAYA ITEM ADD karna hai?
      Kisi category mein jaao, ek { ... } line COPY karo, PASTE karo,
      naam / price / photo badal do. Bas!

   2. ITEM HATANA hai?
      Us item ki poori { ... }, line DELETE kar do.

   3. PHOTO BADALNI hai? (3 tarike — jo easy lage)
      a) Apni photo isi folder mein rakho, jaise "momo.jpg",
         phir likho:   image: "momo.jpg"
      b) Internet photo ka link paste kar do:
         image: "https://..."
      c) Cloudinary photo: neeche CLOUDINARY_CLOUD_NAME mein apna
         cloud naam likho, phir sirf public_id likho:
         image: "menu/veg-momo"     (bina https, bina .jpg)
         Photos ki list: cloudinary-images.json file mein hai.
         Nayi photo upload karo to  node fetch-images.js  dobara chalao.

   4. PRICE / NAAM badalna hai?
      Sirf  name: "..."  ya  price: 99  wali value badlo.
      (₹ lagane ki zaroorat nahi — wo automatic lagta hai.)

   5. PIZZA jaise SMALL / LARGE price hon to:
      { name: "Onion Pizza", small: 0, large: 129, ... }
      Jis size mein item NAHI hai wahan 0 likh do (wo button nahi dikhega).

   NORMAL FORMAT (copy-paste karo):
   { name: "Item Name", price: 99, desc: "1 line tasty description",
     image: "photo-link", best: false },

   PIZZA FORMAT (2 price wala):
   { name: "Paneer Pizza", small: 0, large: 199,
     desc: "1 line tasty description", image: "photo-link", best: true },

   best: true = "⭐ Bestseller" tag dikhega. Sab kuch 100% VEG hai.
   ============================================================================ */


/* ---- STEP 1: Cloudinary (agar Cloudinary photos use karni hon) ----
   Apna cloud naam yahan likho, jaise: "dxy123abc"
   Naam khaali ("") rakha to normal photo links wali line use hogi.
   NOTE: api_secret website mein KABHI mat likho — wo sirf
   fetch-images.js (computer wali script) mein lagta hai. */
const CLOUDINARY_CLOUD_NAME = "deepak0011";

/* ---- STEP 2: Categories (left-to-right order mein dikhengi) ---- */
const CATEGORIES = [
  { id: "tea",     label: "☕ Tea" },
  { id: "coffee",  label: "☕ Coffee" },
  { id: "sandwich",label: "🥪 Sandwich" },
  { id: "burger",  label: "🍔 Burger" },
  { id: "addon",   label: "🧀 Add-ons" },
  { id: "maggi",   label: "🍜 Maggi" },
  { id: "pasta",   label: "🍝 Pasta" },
  { id: "fries",   label: "🍟 Fries" },
  { id: "noodles", label: "🍜 Noodles" },
  { id: "rice",    label: "🍚 Fried Rice" },
  { id: "potato",  label: "🥔 Chilli Potato" },
  { id: "pizza",   label: "🍕 Pizza" },
  { id: "shake",   label: "🥤 Shakes" },
  { id: "mojito",  label: "🍹 Mojito" },
  { id: "chaat",   label: "😋 Fun With Us" },
  { id: "combo",   label: "🎁 Combos" },
  { id: "momos",   label: "🥟 Momos" },
  { id: "kurkure", label: "🥟 Kurkure Momo" },
];


/* ---- STEP 3: Photos ----
   U("...") = free tasty photo (jinki asli photo Cloudinary mein
   nahi hai, un items mein yahi lagi hai).
   Baad mein image: "..." badal kar apni / Cloudinary photo lagao. */
const U = (id) => `https://images.unsplash.com/${id}?w=600&q=80&auto=format&fit=crop`;
const FALLBACK = U("photo-1546069901-ba9599a7e63c");

const IMG = {
  tea:      U("photo-1544787219-7f47ccb76574"),
  coffee:   U("photo-1509042239860-f550ce710b93"),
  coldcof:  U("photo-1572442388796-11668a67e53d"),
  sandwich: U("photo-1528735602780-2552fd46c7af"),
  burger:   U("photo-1568901346375-23c9450c58cd"),
  cheese:   U("photo-1486297678162-eb2a19b0a32d"),
  maggi:    U("photo-1585032226651-759b368d7246"),
  pasta:    U("photo-1621996346565-e3dbc646d9a9"),
  fries:    U("photo-1573080496219-bb080dd4f877"),
  rice:     U("photo-1512058564366-18510be2db19"),
  potato:   U("photo-1630384060421-cb20d0e0649d"),
  pizza:    U("photo-1565299624946-b28f40a0ae38"),
  pizza2:   U("photo-1513104890138-7c749659a591"),
  shake:    U("photo-1572490122747-3968b75cc699"),
  shake2:   U("photo-1626200419199-391ae4be7a41"),
  mojito:   U("photo-1556679343-c7306c1976bc"),
  chaat:    U("photo-1601050690597-df0568f70950"),
  combo:    U("photo-1571091718767-18b5b1457add"),
  momos:    U("photo-1534422298391-e4f8c172dddb"),
  kurkure:  U("photo-1567188040759-fb8a883dc6d6"),
};


/* ---- STEP 4: Asli MENU (yahi edit karo) ----
   image: "Kuch_Naam" (bina link) = Cloudinary photo (upar cloud naam set hai)
   image: IMG.xxx         = free wali photo (asli photo milte hi badal dena) */
const MENU = {

  tea: [
    { name: "Tea", price: 20, desc: "Kadak desi chai, ghar wali feeling", image: "Tea", best: true },
    { name: "Masala Tea", price: 25, desc: "Adrak-elaichi masala, full fresh", image: "masala_tea", best: false },
    { name: "Green Tea", price: 30, desc: "Light & healthy, calming sip", image: "Green_tea", best: false },
  ],

  coffee: [
    { name: "Hot Plain Coffee", price: 40, desc: "Classic hot coffee, rich aroma", image: "Hot_Coffee", best: false },
    { name: "Americano Coffee", price: 49, desc: "Bold & black, coffee lovers pick", image: "americano_coffee", best: false },
    { name: "Amul Butter Coffee", price: 59, desc: "Creamy-buttery, desi twist", image: "amul_butter_coffee", best: false },
    { name: "Cold Coffee", price: 89, desc: "Chilled, frothy, chocolate hint", image: "Cold_Coffee", best: true },
    { name: "Cold Coffee with Ice Cream", price: 109, desc: "Extra thick, vanilla scoop on top", image: "cold_coffee_with_ice_creame", focus: "top", best: true },
  ],

  sandwich: [
    { name: "Veg Sandwich", price: 99, desc: "Fresh veggies, green chutney", image: "Veg_Sandwich", best: true },
    { name: "Paneer Makhani Sandwich", price: 129, desc: "Creamy makhani paneer filling", image: "Classic_Paneer_Sandwich", best: true },
    { name: "Tandoori Paneer Sandwich", price: 119, desc: "Smoky tandoori paneer, mint mayo", image: "Tandoori_Paneer_Tikka_sandwich", best: false },
    { name: "Cheese & Corn Sandwich", price: 109, desc: "Melty cheese, sweet corn crunch", image: "Cheese_Corn_Sandwich", best: false },
    { name: "Plain Gem Sandwich", price: 89, desc: "Simple, soft & tasty classic", image: IMG.sandwich, best: false },
  ],

  burger: [
    { name: "Veg Aloo Tikki Burger", price: 79, desc: "Crispy tikki, tangy mayo, soft bun", image: "Aloo_Tikki_Burger", best: true },
    { name: "Paneer Burger", price: 99, desc: "Crunchy paneer patty, full paisa-vasool", image: "Paneer_Burger", best: false },
    { name: "Mint Chutni Burger", price: 89, desc: "Desi mint chutney twist", image: "Mint_Chutney_Veggie_Burger", best: false },
  ],

  addon: [
    { name: "Add-on Cheese Slice", price: 10, desc: "Kisi bhi item mein extra cheese", image: IMG.cheese, best: false },
  ],

  maggi: [
    { name: "Veg Maggi", price: 59, desc: "Masala maggi, veggies ke saath", image: "Veg_Maggi", best: true },
    { name: "Paneer Maggi", price: 79, desc: "Soft paneer cubes, extra masala", image: "Paneer_Maggi", best: false },
    { name: "Plain Butter Maggi", price: 90, desc: "Buttery-smooth, simple & tasty", image: "Plain_Maggi", best: false },
  ],

  pasta: [
    { name: "Alfredo Pasta", price: 129, desc: "Creamy white sauce, cheesy & rich", image: "White_Sauce_Pasta_veg", best: true },
    { name: "Arrabbiata Pasta", price: 129, desc: "Tangy red sauce, thoda spicy", image: "Red_Sauce_Pasta_veg", best: false },
    { name: "Mix Sauce Pasta", price: 139, desc: "Pink sauce — best of both worlds", image: "Mix_Sauce_Pasta_veg", best: false },
    { name: "Spaghetti Aglio-Olio", price: 139, desc: "Garlic-olive oil, Italian classic", image: IMG.pasta, best: false },
  ],

  fries: [
    { name: "Salted Fries", price: 89, desc: "Golden crispy, perfect salt", image: "Salted_French_Fries", best: false },
    { name: "Peri-Peri Fries", price: 99, desc: "Spicy peri-peri masala dust", image: "Piri-Piri_French_Fries", best: true },
    { name: "Cheese Fries", price: 119, desc: "Loaded cheese sauce on top", image: "Cheese_Loaded_French_Fries", best: false },
  ],

  noodles: [
    { name: "Hakka Noodles", price: 119, desc: "Smoky wok tossed, street style", image: "Hakka_Noodles", best: true },
    { name: "Veg Noodles", price: 89, desc: "Simple, crunchy veggies", image: "Veg_Noodles", best: false },
    { name: "Singapore Noodles", price: 99, desc: "Exotic curry flavour twist", image: "Singapuri_Noodles", best: false },
    { name: "Schezwan Noodles", price: 109, desc: "Spicy schezwan kick", image: "Schezwan_Noodles", best: false },
  ],

  rice: [
    { name: "Veg Fried Rice", price: 89, desc: "Smoky wok rice, spring onion", image: "Veg_Fried_Rice", best: false },
    { name: "Schezwan Fried Rice", price: 99, desc: "Spicy-garlicky, full flavour", image: "Schezwan_Fried_Rice", best: true },
    { name: "Singapore Fried Rice", price: 99, desc: "Mild curry aroma, exotic taste", image: "Singapore_Fried_Rice", best: false },
    { name: "Mexican Rice", price: 119, desc: "Beans-corn salsa rice bowl", image: IMG.rice, best: false },
  ],

  potato: [
    { name: "Chilli Potato", price: 89, desc: "Crispy fingers, spicy chilli toss", image: "Chilli_Potato", best: false },
    { name: "Honey Chilli Potato", price: 99, desc: "Sweet-spicy glaze, sesame sprinkle", image: "Honey_Chilli_Potato", best: true },
  ],

  pizza: [
    { name: "Margherita Pizza", small: 59, large: 0, desc: "Classic cheese & tomato, kids favourite", image: "Margherita_pizza", best: true },
    { name: "Sweet Corn Pizza", small: 69, large: 0, desc: "Golden corn, extra cheese", image: "Sweet_Corn_pizza", best: false },
    { name: "Onion Pizza", small: 0, large: 129, desc: "Crunchy onion, cheesy base", image: "Onion_pizza", best: false },
    { name: "Paneer Pizza", small: 0, large: 199, desc: "Soft paneer tikka topping", image: "Paneer_pizza", best: true },
    { name: "Makhani Paneer Pizza", small: 0, large: 209, desc: "Creamy makhani gravy base", image: "Makhani_Paneer_Pizza", best: false },
    { name: "Farm House Pizza", small: 0, large: 229, desc: "Loaded garden veggies, full cheese", image: "Farm_House_Pizza", best: true },
  ],

  shake: [
    { name: "Vanilla Shake", price: 99, desc: "Thick & creamy classic", image: IMG.shake, best: false },
    { name: "Oreo Shake", price: 110, desc: "Crunchy oreo, chocolate blend", image: "Oreo_Shake", best: true },
    { name: "Kit Kat Shake", price: 110, desc: "Chocolaty wafer crunch", image: "Kit-Kat_Shake", best: false },
    { name: "Strawberry Shake", price: 120, desc: "Fresh berry, pink & yummy", image: "Strawberry_Shake", best: false },
    { name: "Pineapple Shake", price: 120, desc: "Tangy-sweet tropical sip", image: "Pineapple_Shake", best: false },
  ],

  mojito: [
    { name: "Virgin Mojito", price: 99, desc: "Mint-lime cooler, super fresh", image: "Mint_Mojito", best: true },
    { name: "Green Apple Mojito", price: 110, desc: "Tangy apple fizz", image: "Green_Apple_Mojito", best: false },
    { name: "Blue Ocean", price: 110, desc: "Cool blue lagoon cooler", image: "Blue_Ocean_Mojito", best: false },
    { name: "Blue Berry", price: 120, desc: "Berry blast, sweet & fizzy", image: "Blue_Berry_Mojito", best: false },
    { name: "Kiwi Punch", price: 120, desc: "Fresh kiwi, mint punch", image: "Kiwi_Punch_Mojito", best: false },
  ],

  chaat: [
    { name: "Sweet Corn Chaat", price: 129, desc: "Buttery corn, chaat masala", image: "Corn_Chaat", best: false },
    { name: "Dahi Papdi Chaat", price: 139, desc: "Crispy papdi, dahi & chutneys", image: "Dahi_Papdi_Chaat", best: true },
    { name: "Cheese Garlic Toast", price: 99, desc: "Golden toast, garlic-cheese spread", image: "Cheesy_Garlic_Toast", best: false },
  ],

  combo: [
    { name: "Burger + Fries + Coke", price: 99, desc: "Mini meal deal, full happy", image: "Burger_Fries_Coke", best: true },
    { name: "French Fries + Coke", price: 99, desc: "Crispy fries, chilled coke", image: "French_Fries_Coke", best: false },
    { name: "Pizza (Margherita / Sweet Corn) + Burger + French Fries + 1L Coke", price: 269, desc: "Family party pack — sab kuch ek saath", image: "Pizza_Margherita_Sweet_Corn_Burger_French_Fries_1L_Coke", best: true },
  ],

  momos: [
    { name: "Veg Momo", price: 89, desc: "Steamed soft, spicy red chutney", image: "Veg_Momos", best: true },
    { name: "Paneer Momo", price: 109, desc: "Paneer stuffing, juicy bite", image: "Paneer_Momos", best: false },
    { name: "Cheese Momo", price: 119, desc: "Melty cheese inside, yumm", image: "Cheese_Momo", best: false },
    { name: "Dragon Momo", price: 129, desc: "Spicy dragon Schezwan style", image: "Spicy_Dragon_Momos", best: false },
  ],

  kurkure: [
    { name: "Veg Kurkure Momo", price: 99, desc: "Extra crunchy coating, chatpata", image: "Crispy_Veg_Kurkure_Momos", best: false },
    { name: "Paneer Kurkure Momo", price: 119, desc: "Crunchy outside, paneer inside", image: "Paneer_Kurkure_Momos", best: true },
    { name: "Cheese Kurkure Momo", price: 129, desc: "Crunch + cheese burst combo", image: "Paneer_Kurkure_Momos", best: false },
  ],
};


/* ============================================================================
   ⛔  NEeche ka code MAT CHHEDO — yeh website ko chalata hai.
   Sirf upar wala MENU section edit karo.
   ============================================================================ */

const $ = (id) => document.getElementById(id);
const cart = new Map(); // key "name|||size" -> qty
let activeCat = "all";

function money(n) { return "₹" + n; }

/* Photo resolver: local file / full link / Cloudinary public_id / fallback */
function imgSrc(src) {
  if (!src) return FALLBACK;
  if (/^(https?:|data:|blob:)/i.test(src) || src.includes(".")) return src;
  if (CLOUDINARY_CLOUD_NAME)
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_600,q_auto,f_auto/${src}`;
  return FALLBACK;
}

/* Price variants: single price OR small/large (pizza) */
function variants(it) {
  const hasS = Number(it.small) > 0, hasL = Number(it.large) > 0;
  if (hasS || hasL) {
    const out = [];
    if (hasS) out.push({ label: "Small", short: "S", price: Number(it.small) });
    if (hasL) out.push({ label: "Large", short: "L", price: Number(it.large) });
    return out;
  }
  return [{ label: "", short: "", price: Number(it.price) }];
}
const keyOf = (name, v) => name + "|||" + v.label;

function allItems() {
  return Object.entries(MENU).flatMap(([cat, items]) => items.map(it => ({ ...it, cat })));
}
function catLabel(id) {
  const c = CATEGORIES.find(c => c.id === id);
  return c ? c.label : id;
}

// ---- Category pills ----
function renderCats() {
  const bar = $("catBar");
  const counts = {};
  allItems().forEach(i => counts[i.cat] = (counts[i.cat] || 0) + 1);
  const total = allItems().length;
  bar.innerHTML =
    `<button class="cat-btn ${activeCat === "all" ? "active" : ""}" data-cat="all">🍽️ All (${total})</button>` +
    CATEGORIES.map(c => `<button class="cat-btn ${activeCat === c.id ? "active" : ""}" data-cat="${c.id}">${c.label} (${counts[c.id] || 0})</button>`).join("");
  bar.querySelectorAll("button").forEach(b => b.onclick = () => {
    activeCat = b.dataset.cat;
    renderCats(); renderMenu();
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });
  const s = $("statItems"); if (s) s.textContent = total + "+";
}

// ---- Menu grid ----
function passesFilters(it) {
  const q = $("searchInput").value.trim().toLowerCase();
  if ($("bestOnly").checked && !it.best) return false;
  if (activeCat !== "all" && it.cat !== activeCat) return false;
  if (q && !(it.name.toLowerCase().includes(q) || (it.desc || "").toLowerCase().includes(q))) return false;
  return true;
}

function pricePills(it) {
  const vs = variants(it);
  if (vs.length === 1 && !vs[0].label) return `<span class="price">${money(vs[0].price)}</span>`;
  return `<span class="price-col">` + vs.map(v => `<span class="price">${v.short} ${money(v.price)}</span>`).join("") + `</span>`;
}

function controlsHTML(it) {
  return variants(it).map(v => {
    const k = keyOf(it.name, v);
    const qty = cart.get(k) || 0;
    const tag = v.label ? `<span class="size-tag">${v.short} • ${money(v.price)}</span>` : ``;
    const btn = qty === 0
      ? `<button class="add-btn" data-add="${it.name}" data-size="${v.label}">Add +</button>`
      : `<span class="qty"><button data-dec="${it.name}" data-size="${v.label}">−</button><strong>${qty}</strong><button data-inc="${it.name}" data-size="${v.label}">+</button></span>`;
    return `<div class="size-row">${tag}${btn}</div>`;
  }).join("");
}

function cardHTML(it) {
  const src = imgSrc(it.image);
  return `
  <article class="card">
    <div class="card-img">
      <img src="${src}" alt="${it.name}" loading="lazy" class="${it.focus === "top" ? "focus-top" : ""}" onerror="this.onerror=null;this.src='${FALLBACK}'" />
      ${it.best ? `<span class="badge">⭐ Bestseller</span>` : ``}
      <span class="veg-mark" title="Pure Veg">🟢</span>
    </div>
    <div class="card-body">
      <div class="card-top"><h4>${it.name}</h4>${pricePills(it)}</div>
      <p class="desc">${it.desc || ""}</p>
      <div class="card-sizes">${controlsHTML(it)}</div>
    </div>
  </article>`;
}

function renderMenu() {
  const box = $("menuSections");
  const items = allItems().filter(passesFilters);
  $("emptyState").hidden = items.length !== 0;
  $("resultLine").textContent = items.length
    ? `Showing ${items.length} dish${items.length > 1 ? "es" : ""}${activeCat !== "all" ? " in " + catLabel(activeCat) : ""} • Tap Add to build your order`
    : "";

  if (activeCat !== "all") {
    box.innerHTML = items.length
      ? `<div class="cat-title"><h3>${catLabel(activeCat)}</h3><span class="count">${items.length}</span></div><div class="grid">${items.map(cardHTML).join("")}</div>`
      : "";
  } else {
    box.innerHTML = CATEGORIES.map(c => c.id).map(id => {
      const list = (MENU[id] || []).map(it => ({ ...it, cat: id })).filter(passesFilters);
      if (!list.length) return "";
      return `<div class="cat-title"><h3>${catLabel(id)}</h3><span class="count">${list.length}</span></div><div class="grid">${list.map(cardHTML).join("")}</div>`;
    }).join("");
  }
  bindCardButtons(box);
  revealCards();
  updateCartUI();
}

// Bind + / Add buttons (size-aware)
function bindCardButtons(root) {
  root.querySelectorAll("[data-add]").forEach(b => b.onclick = () => { cart.set(keyOf(b.dataset.add, { label: b.dataset.size }), 1); renderMenu(); });
  root.querySelectorAll("[data-inc]").forEach(b => b.onclick = () => {
    const k = keyOf(b.dataset.inc, { label: b.dataset.size });
    cart.set(k, (cart.get(k) || 0) + 1); renderMenu();
  });
  root.querySelectorAll("[data-dec]").forEach(b => b.onclick = () => {
    const k = keyOf(b.dataset.dec, { label: b.dataset.size });
    const q = (cart.get(k) || 0) - 1;
    q <= 0 ? cart.delete(k) : cart.set(k, q);
    renderMenu();
  });
}

// Smooth fade-in on scroll
let observer;
function revealCards() {
  const cards = document.querySelectorAll(".card:not(.show)");
  if (!("IntersectionObserver" in window)) { cards.forEach(c => c.classList.add("show")); return; }
  observer && observer.disconnect();
  observer = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("show"); observer.unobserve(e.target); }
  }), { threshold: 0.08 });
  cards.forEach(c => observer.observe(c));
  document.querySelectorAll(".grid").forEach(g => [...g.children].slice(0, 4).forEach(c => c.classList.add("show")));
}

// ---- Cart drawer ----
function cartEntries() {
  const byKey = {};
  allItems().forEach(it => variants(it).forEach(v => { byKey[keyOf(it.name, v)] = { ...it, size: v.label, unit: v.price }; }));
  return [...cart.entries()].map(([key, qty]) => ({ ...byKey[key], qty, key })).filter(x => x && x.unit > 0);
}
function updateCartUI() {
  const entries = cartEntries();
  const n = entries.reduce((a, e) => a + e.qty, 0);
  const total = entries.reduce((a, e) => a + e.qty * e.unit, 0);
  $("cartCount").textContent = n;
  $("drawerCount").textContent = n ? `(${n} items)` : "";
  $("drawerTotal").textContent = money(total);
  $("drawerBody").innerHTML = entries.length ? entries.map(e => `
    <div class="drawer-item">
      <img src="${imgSrc(e.image)}" class="${e.focus === "top" ? "focus-top" : ""}" onerror="this.onerror=null;this.src='${FALLBACK}'" alt="" loading="lazy"/>
      <div class="info"><strong>${e.name}${e.size ? ` (${e.size})` : ""}</strong><span>${money(e.unit)} × ${e.qty} = <b>${money(e.unit * e.qty)}</b></span></div>
      <div class="qty"><button data-ddec="${e.key}">−</button><strong>${e.qty}</strong><button data-dinc="${e.key}">+</button></div>
    </div>`).join("")
    : `<div class="empty-cart">🧺<br><br>Your plate is empty.<br>Add something tasty from the menu!</div>`;
  $("drawerBody").querySelectorAll("[data-dinc]").forEach(b => b.onclick = () => { cart.set(b.dataset.dinc, cart.get(b.dataset.dinc) + 1); renderMenu(); });
  $("drawerBody").querySelectorAll("[data-ddec]").forEach(b => b.onclick = () => {
    const q = cart.get(b.dataset.ddec) - 1;
    q <= 0 ? cart.delete(b.dataset.ddec) : cart.set(b.dataset.ddec, q);
    renderMenu();
  });
}
function openDrawer(o) {
  $("drawer").classList.toggle("open", o);
  $("drawer").setAttribute("aria-hidden", !o);
  $("overlay").hidden = !o;
}

// ---- Events ----
$("searchInput").addEventListener("input", e => {
  $("clearSearch").hidden = !e.target.value;
  if (e.target.value.trim() && activeCat !== "all") { activeCat = "all"; renderCats(); }
  renderMenu();
});
$("clearSearch").onclick = () => { $("searchInput").value = ""; $("clearSearch").hidden = true; renderMenu(); };
$("bestOnly").onchange = renderMenu;
$("resetBtn").onclick = () => {
  $("searchInput").value = ""; $("bestOnly").checked = false;
  activeCat = "all"; renderCats(); renderMenu();
};
$("cartBtn").onclick = () => openDrawer(true);
$("closeDrawer").onclick = () => openDrawer(false);
$("overlay").onclick = () => openDrawer(false);
$("clearCart").onclick = () => { cart.clear(); renderMenu(); };
document.addEventListener("keydown", e => { if (e.key === "Escape") openDrawer(false); });

// ---- Go ----
renderCats();
renderMenu();
