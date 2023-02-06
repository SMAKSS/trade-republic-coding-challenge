<script lang="ts">
import { defineComponent } from "vue";

/**
 * @typedef {Object} Props
 * @property {String} id - The unique identifier of the error banner.
 */

export default defineComponent({
  /**
   * The name of the Vue component.
   */
  name: "ErrorBanner",

  /**
   * The properties that the component accepts.
   * @type {Props}
   */
  props: {
    /**
     * The unique identifier of the error banner.
     * @type {String}
     */
    id: { type: String },
  },
});
</script>

<template>
  <label :for="id" class="container__banner">
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11C19 15.4183 15.4183 19 11 19ZM10 9.9996C10 10.5519 10.4477 10.9996 11 10.9996C11.5523 10.9996 12 10.5519 12 9.9996V7.9996C12 7.44732 11.5523 6.9996 11 6.9996C10.4477 6.9996 10 7.44732 10 7.9996V9.9996ZM10 13.9996C10 14.5519 10.4477 14.9996 11 14.9996C11.5523 14.9996 12 14.5519 12 13.9996C12 13.4473 11.5523 12.9996 11 12.9996C10.4477 12.9996 10 13.4473 10 13.9996Z"
      />
    </svg>
    <slot />
  </label>
</template>

<style lang="scss">
.container__banner {
  @include flex($align: center);

  color: var(--color-primary-red3);

  & path {
    fill: var(--color-primary-red3);
  }
}
</style>
