import { useCallback, useState } from "react";

/**
 * A React hook that manages disclosure state (open/closed) for components like modals,
 * drawers, dialogs, etc.
 *
 * @param initialState - Initial open state (default: false)
 * @param callbacks - Optional callbacks for open and close events
 * @returns Tuple containing current state and control functions (open, close, toggle)
 *
 * @example
 * const [isOpen, { open, close, toggle }] = useDisclosure(false);
 */
export function useDisclosure(
  initialState = false,
  callbacks?: { onOpen?: () => void; onClose?: () => void }
) {
  const { onOpen, onClose } = callbacks || {};
  const [opened, setOpened] = useState(initialState);

  const open = useCallback(() => {
    setOpened((isOpened) => {
      if (!isOpened) {
        onOpen?.();
        return true;
      }
      return isOpened;
    });
  }, [onOpen]);

  const close = useCallback(() => {
    setOpened((isOpened) => {
      if (isOpened) {
        onClose?.();
        return false;
      }
      return isOpened;
    });
  }, [onClose]);

  const toggle = useCallback(() => {
    if (opened) {
      close();
    } else {
      open();
    }
  }, [close, open, opened]);

  return [opened, { open, close, toggle }] as const;
}
