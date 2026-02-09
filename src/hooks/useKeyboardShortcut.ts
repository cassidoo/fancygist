import { useEffect, useCallback, useRef } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { ctrl?: boolean; meta?: boolean; shift?: boolean } = {}
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { ctrl = false, meta = false, shift = false } = options;

      const isCtrlOrMeta = ctrl || meta;
      const ctrlOrMetaPressed = event.ctrlKey || event.metaKey;

      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        (!isCtrlOrMeta || ctrlOrMetaPressed) &&
        (!shift || event.shiftKey)
      ) {
        event.preventDefault();
        callbackRef.current();
      }
    },
    [key, options]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
