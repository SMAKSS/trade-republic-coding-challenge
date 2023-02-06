<script lang="ts">
import { defineComponent } from "vue";

import Header from "./components/Header.vue";

import "./index.css";

export default defineComponent({
  components: {
    Header,
  },
});
</script>

<template>
  <Header />
  <main class="main">
    <router-view />
  </main>
</template>

<style lang="scss">
#app {
  font-family: var(--font-regular);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: $max-width) {
    padding: 0 (var(--space-16));
  }
}

.main {
  max-width: var(--max-width);
  margin: 0 auto;
}
</style>
