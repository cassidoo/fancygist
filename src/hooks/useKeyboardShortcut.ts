import { useEffect, useCallback, useRef } from "react";

function toLetterCode(key: string) {
	if (key.length === 1 && /[a-z]/i.test(key)) {
		return `Key${key.toUpperCase()}`;
	}
	return null;
}

export function useKeyboardShortcut(
	key: string,
	callback: () => void,
	options: {
		ctrl?: boolean;
		meta?: boolean;
		shift?: boolean;
		alt?: boolean;
	} = {},
) {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const { ctrl = false, meta = false, shift = false, alt = false } = options;
	const expectedCode = toLetterCode(key);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const isCtrlOrMeta = ctrl || meta;
			const ctrlOrMetaPressed = event.ctrlKey || event.metaKey;
			const codeMatches = expectedCode ? event.code === expectedCode : false;
			const keyMatches = event.key.toLowerCase() === key.toLowerCase();

			if (
				(keyMatches || codeMatches) &&
				(!isCtrlOrMeta || ctrlOrMetaPressed) &&
				(!shift || event.shiftKey) &&
				(!alt || event.altKey)
			) {
				event.preventDefault();
				callbackRef.current();
			}
		},
		[key, expectedCode, ctrl, meta, shift, alt],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown, { capture: true });
		return () =>
			window.removeEventListener("keydown", handleKeyDown, { capture: true });
	}, [handleKeyDown]);
}
