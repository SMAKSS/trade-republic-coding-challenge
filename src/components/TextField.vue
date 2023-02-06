<script lang="ts">
import { defineComponent } from "vue";

/**
 * @typedef {object} Props
 * @property {string} id
 * @property {string} placeholder
 * @property {string} label
 * @property {string} modelValue
 */

/**
 * A component for creating a text field.
 *
 * @emits update:model-value - Emits an event with the current value of the text field.
 * @emits update:modelValue - Alias for `update:model-value` event.
 *
 * @export
 * @param {Props} props - The properties for the text field.
 * @returns {Vue.Component}
 */
export default defineComponent({
  name: "TextFiled",
  emits: ["update:model-value", "update:modelValue"],
  props: {
    id: { type: String },
    placeholder: { type: String },
    label: { type: String },
    modelValue: { type: String },
  },
});
</script>

<template>
  <div class="container__textfield">
    <label :for="id">{{ label }}</label>
    <input
      class="text-field"
      :id="id"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<style lang="scss">
:root {
  --space-4: 4px;
}

.container__textfield {
  @include flex($dir: column, $justify: flex-start, $gap: var(--space-4));

  .text-field {
    padding: 12px 0;
    border: none;
    border-bottom: 1px solid var(--color-foreground1);
    background: transparent;
    color: var(--color-foreground3);
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: var(--color-foreground3);
      color: var(--color-foreground3);
    }
  }
}
</style>
