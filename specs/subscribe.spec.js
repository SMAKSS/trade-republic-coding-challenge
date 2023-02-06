import Vuex from "vuex";
import { mount, createLocalVue } from "@vue/test-utils";

import Subscribe from "../src/views/Subscribe.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Subscribe.vue", () => {
  let store;
  let wrapper;

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        ISINs: [],
      },
      mutations: {
        addISIN(state, ISIN) {
          state.ISINs.push(ISIN);
        },
      },
    });
    wrapper = mount(Subscribe, { store, localVue });
  });

  it("should render the form and its components correctly", () => {
    expect(wrapper.find(".heading1").text()).toBe(
      "Add ISIN to your watch list"
    );
    expect(wrapper.find("form").exists()).toBe(true);
    expect(wrapper.find("fieldset").exists()).toBe(true);
    expect(wrapper.find("legend").text()).toBe(
      "Please complete the form below to subscribe to an ISIN."
    );
    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.find("button").text()).toBe("Add to Watchlist");
  });

  it("should correctly add the ISIN to the watchlist", async () => {
    wrapper.find("input").setValue("GB00B03MLX29");
    wrapper.find("form").trigger("submit");

    await wrapper.vm.$nextTick();

    expect(store.state.ISINs).toEqual(["GB00B03MLX29"]);
    expect(wrapper.find(".success").text()).toBe(
      "✅ GB00B03MLX29 successfully added to the watchlist."
    );
    expect(wrapper.find("input").element.value).toBe("");
  });

  it("should correctly display an error message for invalid ISIN format", async () => {
    wrapper.find("input").setValue("GB00B03MLX2");
    wrapper.find("form").trigger("submit");

    await wrapper.vm.$nextTick();

    expect(store.state.ISINs).toEqual([]);
    expect(wrapper.find(".error-banner").text()).toBe(
      "The ISIN format is not valid!"
    );
  });

  it("should correctly display an error message for a duplicate ISIN", async () => {
    wrapper.find("input").setValue("GB00B03MLX29");
    wrapper.find("form").trigger("submit");

    await wrapper.vm.$nextTick();

    wrapper.find("input").setValue("GB00B03MLX29");
    wrapper.find("form").trigger("submit");

    await wrapper.vm.$nextTick();

    expect(store.state.ISINs).toEqual(["GB00B03MLX29"]);
    expect(wrapper.find(".error-banner").text()).toBe(
      "You were already watching this ISIN! Try another ISIN to add to your watchlist."
    );
  });
});
