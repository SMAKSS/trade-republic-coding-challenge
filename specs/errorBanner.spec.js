import { mount } from "@vue/test-utils";

import ErrorBanner from "../src/components/ErrorBanner.vue";

describe("ErrorBanner", () => {
  it("renders the correct markup", () => {
    const wrapper = mount(ErrorBanner);
    expect(wrapper.html()).toContain('<label class="container__banner">');
    expect(wrapper.html()).toContain('<svg width="22" height="22"');
    expect(wrapper.html()).toContain("</label>");
  });

  it("renders a slot", () => {
    const wrapper = mount(ErrorBanner, {
      slots: {
        default: "<p>Error message</p>",
      },
    });
    expect(wrapper.html()).toContain("<p>Error message</p>");
  });

  it("sets the id prop to the label", () => {
    const wrapper = mount(ErrorBanner, {
      propsData: {
        id: "error-id",
      },
    });
    expect(wrapper.find("label").attributes().for).toBe("error-id");
  });
});
