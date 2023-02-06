import { shallowMount } from "@vue/test-utils";

import Header from "../src/components/Header.vue";

describe("Header", () => {
  it("renders elements correctly", () => {
    const wrapper = shallowMount(Header);
    expect(wrapper.vm.elements).toEqual([
      { id: "subscribe", text: "Subscribe", link: "/" },
      { id: "watchlist", text: "Watchlist", link: "/watchlist" },
    ]);
  });
});
