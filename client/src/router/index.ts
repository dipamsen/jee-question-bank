import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import StatusView from "../views/StatusView.vue";
import ChapterView from "../views/ChapterView.vue";
import QuestionListView from "../views/QuestionListView.vue";
import QuestionView from "../views/QuestionView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/status",
      name: "status",
      component: StatusView,
    },
    {
      path: "/chapter/:chapterId",
      name: "chapter",
      component: QuestionListView,
    },
    {
      path: "/question/:qId",
      name: "question",
      component: QuestionView,
    },
  ],
});

export default router;
