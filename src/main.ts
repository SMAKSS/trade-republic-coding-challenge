import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";

const Subscribe = () => import("./views/Subscribe.vue");
const Watchlist = () => import("./views/Watchlist.vue");

/**
 * Create a Vue Router instance for the application.
 * @constant
 * @type {import("vue-router").Router}
 *
 * @property {import("vue-router").RouterHistory} history - Specifies the history
 * mode of the router (in this case, createWebHistory() which uses the browser's history API)
 * @property {Array<import("vue-router").RouteConfig>} routes - An array of route
 * configuration objects, which define the different paths of the application and
 * the components that should be displayed for each.
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "Subscribe", component: Subscribe },
    { path: "/watchlist", name: "Watchlist", component: Watchlist },
  ],
});

createApp(App).use(router).mount("#app");
