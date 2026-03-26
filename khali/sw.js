const CACHE_NAME = "khali-sub-cache-v5";
const PRECACHE_URLS = [
  "./",
  "index.html",
  "style.css",
  "main.js",
  "manifest.json",
  "IMG-20251013-WA0084-removebg-preview.png",
  "kinza-removebg-preview.png",
  "water-removebg-preview.png",
  "برغر-removebg-preview.png",
  "تشكن_ساب-removebg-preview.png",
  "تورتيلا_برغر-removebg-preview.png",
  "تورتيلا_طاووق-removebg-preview.png",
  "تورتيلا_كرسبي-removebg-preview.png",
  "خالك_لحالك-removebg-preview.png",
  "خالك_لحالك_وجبة-removebg-preview.png",
  "دجاج_بالكاري-removebg-preview.png",
  "دوبل_برغر-removebg-preview.png",
  "روستو-removebg-preview.png",
  "سجق_بالفرنجي-removebg-preview.png",
  "فاهيتا_كومبو-removebg-preview.png",
  "فاهيتاع-removebg-preview.png",
  "كرسبي كومبو.png",
  "كفتة_مد-removebg-preview.png",
  "كلاسيك_بيف-removebg-preview.png",
  "كلاسيك_تشكن-removebg-preview.png",
  "لبن_صغير-removebg-preview.png",
  "لبن_كبير-removebg-preview.png",
  "لبنن-removebg-preview.png",
  "مشروم-removebg-preview.png",
  "مشروم_برغر-removebg-preview.png",
  "مكسيكان-removebg-preview.png"
];

const ASSETS = PRECACHE_URLS.map((url) => encodeURI(url));

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(
      caches.match(encodeURI("index.html")).then((cached) => cached || fetch(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});
