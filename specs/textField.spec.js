import { shallowMount } from "@vue/test-utils";

import TextField from "../src/components/TextField.vue";

describe("TextField", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TextField, {
      propsData: {
        id: "input-1",
        placeholder: "Enter value",
        label: "Label",
        modelValue: "",
      },
    });
  });

  it("renders the label", () => {
    const label = wrapper.find("label");
    expect(label.text()).toBe("Label");
  });

  it("renders the input with the specified props", () => {
    const input = wrapper.find("input");
    expect(input.attributes().id).toBe("input-1");
    expect(input.attributes().placeholder).toBe("Enter value");
    expect(input.element.value).toBe("");
  });

  it("emits an event when the input value changes", async () => {
    const input = wrapper.find("input");
    input.setValue("new value");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted()["update:modelValue"]).toBeTruthy();
  });
});
