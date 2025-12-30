self.addEventListener("install", function (event) {
  console.log("installed")
  self.skipWaiting()
})
self.addEventListener("activate", function (event) {
  console.log("activated")
  event.waitUntil(self.clients.claim())
})
self.addEventListener("push", function(event){
  const { title, body } = event.data.json()

  console.log('title:', title)

  const options = {
    body,
    icon: "./image/favicon-32x32.png",
    badge: "./image/favicon-16x16.png",
  }

  event.waitUntil(self.registration.showNotification(title, options))
})
