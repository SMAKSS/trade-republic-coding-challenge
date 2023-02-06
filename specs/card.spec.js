import { shallowMount } from "@vue/test-utils";

import Card from "../src/components/Card.vue";

describe("Card", () => {
  it('renders a div with class "card"', () => {
    const wrapper = shallowMount(Card);
    expect(wrapper.find(".card").exists()).toBe(true);
  });
});
