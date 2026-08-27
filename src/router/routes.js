// router/routes.js
const routes = [
  {
    path: "",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "",
        name: "login",
        component: () => import("pages/LoginPage.vue"),
        meta: { requiresAuth: false },
      },
    ],
  },

  {
    path: "/admin",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("pages/DashboardPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "events",
        name: "events",
        component: () => import("pages/EventsPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "create-events",
        name: "create events",
        component: () => import("pages/CreateEventPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "view-events",
        name: "view events",
        component: () => import("pages/EventViewPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "bpm",
        name: "bpm",
        component: () => import("pages/BpmPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "assessment",
        name: "assessment",
        component: () => import("pages/AssessmentPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "certification",
        name: "certification",
        component: () => import("pages/CertificationPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "library",
        name: "library",
        component: () => import("pages/LibraryPage.vue"),
        meta: { requiresAuth: true },
      },
        {
        path: "title",
        name: "title",
        component: () => import("pages/library/event/TitlePage.vue"),
        meta: { requiresAuth: true },
      },
          {
        path: "mode",
        name: "mode",
        component: () => import("pages/library/event/ModePage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "venue",
        name: "venue",
        component: () => import("pages/library/event/VenuePage.vue"),
        meta: { requiresAuth: true },
      },
        {
        path: "category",
        name: "category",
        component: () => import("pages/library/event/CategoryPage.vue"),
        meta: { requiresAuth: true },
      },

        {
        path: "speaker",
        name: "speaker",
        component: () => import("pages/library/event/SpeakerPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "reports",
        name: "reports",
        component: () => import("pages/ReportsPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "users",
        name: "users",
        component: () => import("pages/UserPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "",
        redirect: "dashboard",
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
    meta: { requiresAuth: false },
  },
];

export default routes;
