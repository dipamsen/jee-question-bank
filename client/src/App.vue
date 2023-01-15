<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useChaptersStore } from "./stores/chapter";

const store = useChaptersStore();

store.loadChapters();

const theme = ref("dark");

const items = [
  { title: "Home", icon: "mdi-home", to: "/" },
  { title: "Completion Status", icon: "mdi-check-circle", to: "/status" },
];

const drawer = ref(false);
</script>

<template>
  <v-app :theme="theme">
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer">
        <v-avatar>
          <v-img src="/favicon.png"></v-img>
        </v-avatar>
      </v-app-bar-nav-icon>
      <v-toolbar-title>JEE Question Bank</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer :model-value="drawer">
      <v-list nav>
        <v-list-item
          v-for="item in items"
          :title="item.title"
          :prepend-icon="item.icon"
          :key="item.title"
          active-color="primary"
          :to="item.to"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <RouterView v-if="store.loaded" />
    <v-main v-else>
      <v-progress-linear indeterminate></v-progress-linear>
    </v-main>
  </v-app>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
