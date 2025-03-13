import type { Meta, StoryObj } from "@storybook/react";
import { useDisclosure } from "./use-disclosure";

const meta = {
  title: "useDisclosure",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: function Render() {
    const [opened, handlers] = useDisclosure(false, {
      onOpen: () => console.log("Opened"),
      onClose: () => console.log("Closed"),
    });

    return (
      <div>
        <p>Opened: {`${opened}`}</p>
        <button onClick={handlers.open}>Open</button>
        <button onClick={handlers.close}>Close</button>
        <button onClick={handlers.toggle}>Toggle</button>
      </div>
    );
  },
};
