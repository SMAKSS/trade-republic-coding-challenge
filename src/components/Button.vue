<script lang="ts">
import { defineComponent } from "vue";

/**
 * @typedef ButtonProps
 * @type {object}
 * @property {string} type - The type of the button (default, primary, success, etc.).
 * @default "default"
 */

/**
 * A component that represents a button.
 *
 * @vue-component
 * @example <caption>A simple button with default type</caption>
 * <template>
 *   <Button>Click me</Button>
 * </template>
 *
 * @example <caption>A button with a custom type</caption>
 * <template>
 *   <Button type="delete">Click me</Button>
 * </template>
 */
export default defineComponent({
  name: "Button",
  props: {
    type: { type: String, default: "default" },
  },
});
</script>

<template>
  <button class="button" :data-type="type">
    <span class="button-content">
      <slot />
    </span>
  </button>
</template>

<style lang="scss">
.button {
  padding: 4px 12px;
  border: none;
  border-radius: 2px;
  background: var(--color-primary-blue2);
  color: var(--color-foreground3);
  font-family: inherit;

  &:hover {
    background: var(--color-primary-blue3);
  }

  &:active {
    background: var(--color-primary-blue1);
  }

  &:disabled {
    background: var(--color-primary-blue1);

    .button-content {
      color: var(--app-foreground1);
      cursor: not-allowed;
    }
  }

  &[data-type="delete"] {
    background: var(--color-primary-red2);

    &:hover {
      background: var(--color-primary-red1);
    }
  }
}
</style>
