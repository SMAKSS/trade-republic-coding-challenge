<script lang="ts">
import { defineComponent } from "vue";

import store from "../store";
import Card from "../components/Card.vue";
import Button from "../components/Button.vue";
import TextField from "../components/TextField.vue";
import ErrorBanner from "../components/ErrorBanner.vue";

const Errors = [
  {
    id: "invalid",
    message: "The ISIN format is not valid!",
  },
  {
    id: "duplicate",
    message:
      "You were already watching this ISIN! Try another ISIN to add to your watchlist.",
  },
] as { id: string; message: string }[];

export default defineComponent({
  name: "Subscribe",
  components: {
    Card,
    Button,
    TextField,
    ErrorBanner,
  },
  /**
   * @description The data property is an object that returns a JavaScript object literal with the following properties:
   * ISIN is a string that's initialized as an empty string.
   * errors is an array of objects, where each object has two properties: id and message, both of type string. The array is initialized as an empty array.
   * added is an object with two properties, name and status. name is a string initialized as an empty string and status is a boolean initialized as false.
   * timeout is of type ReturnType<typeof setTimeout> | undefined and is initialized as undefined.
   */
  data: () => ({
    ISIN: "" as String,
    errors: [] as { id: string; message: string }[],
    added: { name: "", status: false } as { name: string; status: boolean },
    timeout: undefined as ReturnType<typeof setTimeout> | undefined,
  }),
  /**
   * @description The ISIN property in watch sets the value of the
   * reactive property ISIN to the new value value. Then it invokes
   * the validateISIN function and passes the new value as an argument.
   * This means that whenever the value of ISIN changes, the validateISIN
   * function will be executed and passed the new value.
   */
  watch: {
    ISIN(value) {
      this.ISIN = value;
      this.validateISIN(value);
    },
  },
  /**
   * @description The disabledButton computed property is used to determine
   * whether the submit button should be disabled or not. It returns true if
   * either of the following conditions is met:
   * There is an error with the ID "invalid" in the errors array.
   * The ISIN property is empty (i.e., there is no value for the ISIN code).
   * If either of these conditions is met, the submit button will be disabled.
   */
  computed: {
    disabledButton(): Boolean {
      return this.errors.some((error) => error.id === "invalid") || !this.ISIN;
    },
  },
  methods: {
    /**
     * Checks if an error with the given key already exists in the errors array. If the error with the given key exists and is not in the errors array, it will be added to the errors array.
     * @param {string} key - The key of the error to check for and add.
     *
     * @returns {void}
     */
    checkForDuplicateError(key: string): void {
      const currentError = Errors.find((error) => error.id === key);

      const alreadyExists = this.errors.some(
        (error) => error.id === currentError?.id
      );

      if (currentError && !alreadyExists) this.errors.push(currentError);
    },
    /**
     * Adds a new ISIN to the store if it does not already exist.
     * @function
     */
    addToStore(): void {
      this.added.status = false;

      const alreadyExists = store.state.ISINs.some(
        (ISIN) => ISIN === this.ISIN
      );

      if (!alreadyExists) {
        store.dispatch("addISIN", this.ISIN);

        this.added.name = `${this.ISIN}`;
        this.added.status = true;
        this.ISIN = "";
      } else this.checkForDuplicateError("duplicate");
    },
    /**
     * Validate the ISIN input.
     * @param {string} value - The value of the ISIN input.
     */
    validateISIN(value: string): void {
      this.errors = [];

      if (!value) {
        return;
      }

      const regex = new RegExp(
        /\b[a-zA-Z]{2}\s*[0-9a-zA-Z]{9}[0-9](?![0-9a-zA-Z-])/,
        "gm"
      );

      const isValid = regex.test(value);

      if (!isValid) this.checkForDuplicateError("invalid");
    },
  },
  /**
   * Clears the timeout before updating the component.
   * @function
   * @returns {void}
   */
  beforeUpdate(): void {
    clearTimeout(this.timeout);
  },
  /**
   * @function updated
   * @description This lifecycle hook is called after a component's data and
   * DOM have been updated. If the `added.status` property is `true`, it sets
   * a timeout of 2000ms and then sets `added.status` to `false` after that time.
   */
  updated(): void {
    if (this.added.status) {
      this.timeout = setTimeout(() => {
        this.added.status = false;
      }, 2000);
    }
  },
});
</script>

<template>
  <h1 class="heading1">Add ISIN to your watch list</h1>
  <!-- 
    This is a form for subscribing to an ISIN (International Securities 
    Identification Number). The user enters a valid ISIN in a TextField component, 
    which is bound to the ISIN data property through v-model. When the form is 
    submitted, the addToStore method is triggered to add the entered ISIN to the watchlist.
    The form displays a success message when the ISIN is successfully added, as determined by the added.status computed property.
    There is also an array of errors, errors, which can be displayed as ErrorBanner 
    components if the error.message property is present. The disabledButton computed 
    property determines whether the "Add to Watchlist" button is disabled or not, 
    based on the presence of an "invalid" error or if the ISIN property is empty.
   -->
  <form @submit.prevent="addToStore">
    <fieldset class="container__fieldset">
      <legend>Please complete the form below to subscribe to an ISIN.</legend>
      <span class="success" v-if="added.status"
        >✅ {{ added.name }} successfully added to the watchlist.</span
      >
      <TextField
        placeholder="Enter a valid ISIN"
        id="isin"
        label="ISIN"
        v-model="ISIN"
      />
      <template v-for="error in errors" :key="error.id">
        <ErrorBanner v-if="error.message" id="isin">
          {{ error.message }}
        </ErrorBanner>
      </template>
      <Button :disabled="disabledButton">Add to Watchlist</Button>
    </fieldset>
  </form>
</template>

<style lang="scss">
.container__fieldset {
  @include flex($dir: column, $justify: flex-start, $gap: var(--space-12));

  width: 50%;

  border-radius: var(--border-radius-8);

  @media (max-width: $responsive-width) {
    width: revert;
  }

  .success {
    color: var(--color-primary-green4);
  }
}
</style>
