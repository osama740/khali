const CACHE_NAME = "khali-sub-cache-v6";
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

  const isNavigationRequest = request.mode === "navigate";
  const isCoreAsset = ["script", "style", "manifest"].includes(request.destination);

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      if (isNavigationRequest || isCoreAsset) {
        try {
          const freshResponse = await fetch(request, { cache: "no-store" });
          cache.put(request, freshResponse.clone());
          return freshResponse;
        } catch (error) {
          const cached = await cache.match(request);
          if (cached) return cached;
          if (isNavigationRequest) {
            return cache.match(encodeURI("index.html"));
          }
          throw error;
        }
      }

      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      cache.put(request, response.clone());
      return response;
    })()
  );
});
