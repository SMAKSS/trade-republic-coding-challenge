import Vuex from "vuex";
import { shallowMount } from "@vue/test-utils";

import Watchlist from "../src/views/Watchlist.vue";
import ErrorBanner from "../src/components/ErrorBanner.vue";
import Card from "../src/components/Card.vue";
import Button from "../src/components/Button.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Watchlist component", () => {
  let wrapper;

  beforeEach(() => {
    store.state.ISINs = ["US", "UK", "IN"];
    wrapper = shallowMount(Watchlist);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("is a Vue instance", () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("has the correct components", () => {
    const cards = wrapper.findAllComponents(Card);
    const errorBanner = wrapper.findComponent(ErrorBanner);
    const buttons = wrapper.findAllComponents(Button);

    expect(cards.length).toBe(3);
    expect(errorBanner.exists()).toBe(false);
    expect(buttons.length).toBe(3);
  });

  it("handles WebSocket error correctly", () => {
    wrapper.vm.error = true;
    expect(wrapper.findComponent(ErrorBanner).exists()).toBe(true);
  });

  it("unsubscribes from the stream correctly", () => {
    const unsubscribeSpy = jest.spyOn(wrapper.vm, "unsubscribe");
    const stream = {
      isin: "US",
      socket: new WebSocket("ws://localhost:8425/"),
    };
    wrapper.vm.streams = [stream];
    wrapper.vm.unsubscribe(stream);
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
