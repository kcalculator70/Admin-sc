const CACHE_NAME = 'spy-master-v3';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json'
];

// ১. ইন্সটল হওয়ার সময় ফাইলগুলো ক্যাশ (Save) করে রাখা
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('🔥 System Files Cached');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// ২. অফলাইন বা স্লো নেটে অ্যাপ ফাস্ট লোড করা
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// ৩. নতুন আপডেট আসলে পুরনো ক্যাশ ডিলিট করা
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('🗑 Removing Old System Files', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});