import { createStore } from "vuex";

/**
 * @interface State
 * @desc The state interface for holding the list of ISINs.
 * @property {string[]} ISINs - The array of ISIN values.
 */
export interface State {
  ISINs: string[];
}

/**
 * Creates a store instance that manages the state of the ISINs.
 * @typedef {Object} State
 * @property {string[]} ISINs - An array of ISINs in the store.
 *
 * @exports
 * @default
 * @returns {Store} store - A Vuex store instance.
 */
export default createStore<State>({
  state: {
    ISINs: [],
  },
  mutations: {
    ADD_ISIN(state, ISIN: string) {
      state.ISINs.push(ISIN);
    },
  },
  actions: {
    addISIN({ commit }, ISIN: string) {
      commit("ADD_ISIN", ISIN);
    },
  },
});
