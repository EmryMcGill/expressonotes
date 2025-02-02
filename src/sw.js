import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, Route, NavigationRoute } from 'workbox-routing';
import { NetworkFirst, NetworkOnly } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// cache API calls

const getNotesRoute = new Route(({ request }) => {
    return request.url.includes(import.meta.env.VITE_PB_URI + '/api/collections/notes/records');
},
new NetworkFirst({
    cacheName: "api/getNotes",
}));
registerRoute(getNotesRoute);

// cache navigations
const navigationRoute = new NavigationRoute(
    new NetworkFirst({
        cacheName: "navigation",
        networkTimeoutSeconds: 3,
    })
);
  
registerRoute(navigationRoute);
  
// background sync

const bgSyncPlugin = new BackgroundSyncPlugin("backgroundSyncQueue", {
    maxRetentionTime: 24 * 60,
});
  
const noteSubmitRoute = new Route(
({ request }) => {
    return request.url.includes(import.meta.env.VITE_PB_URI + '/api/collections/notes/records');
},
new NetworkOnly({
    plugins: [bgSyncPlugin],
}),
"POST"
);
registerRoute(noteSubmitRoute);

const editNoteRoute = new Route(
    ({ request }) => {
      return request.url.includes(import.meta.env.VITE_PB_URI + "/api/collections/notes/records");
    },
    new NetworkOnly({
      plugins: [bgSyncPlugin],
    }),
    "PATCH"
);
registerRoute(editNoteRoute);

const deleteNoteRoute = new Route(
    ({ request }) => {
      return request.url.includes(import.meta.env.VITE_PB_URI + "/api/collections/notes/records");
    },
    new NetworkOnly({
      plugins: [bgSyncPlugin],
    }),
    "DELETE"
);
registerRoute(deleteNoteRoute);
