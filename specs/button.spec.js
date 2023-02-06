import { mount } from "@vue/test-utils";
import Button from "../src/components/Button.vue";

describe("Button", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Button, {
      slots: {
        default: "Button Text",
      },
    });
  });

  it("renders the correct markup", () => {
    expect(wrapper.html()).toContain(
      '<button class="button" data-type="default">'
    );
    expect(wrapper.html()).toContain(
      '<span class="button-content">Button Text</span>'
    );
  });

  it("renders the correct type", () => {
    expect(wrapper.attributes()["data-type"]).toBe("default");
  });

  it("renders the correct text", () => {
    expect(wrapper.text()).toBe("Button Text");
  });
});
