// Service Worker لإشعارات Web Push — إنابة (Enaba). SPEC.md §9.
// ملف ثابت بسيط عمدًا: لا caching استراتيجي هنا، فقط استقبال ومعالجة الإشعارات.

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "إنابة", body: event.data.text(), url: "/board" };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || "إنابة", {
      body: payload.body || "",
      icon: "/icon.png",
      badge: "/icon.png",
      dir: "rtl",
      lang: "ar",
      data: { url: payload.url || "/board" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/board";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    }),
  );
});
