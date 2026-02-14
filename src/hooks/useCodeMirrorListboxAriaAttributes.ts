import { useCallback, useId, useLayoutEffect, useMemo } from "react";
import type { RefObject } from "react";
import { Compartment, type Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";

interface UseCodeMirrorListboxAriaAttributesProps {
	editorRef: RefObject<ReactCodeMirrorRef | null>;
	open: boolean;
	activeOptionIndex?: number;
}

interface UseCodeMirrorListboxAriaAttributesResult {
	extension: Extension;
	listboxId: string;
	getOptionId: (index: number) => string;
}

export function useCodeMirrorListboxAriaAttributes({
	editorRef,
	open,
	activeOptionIndex,
}: UseCodeMirrorListboxAriaAttributesProps): UseCodeMirrorListboxAriaAttributesResult {
	const baseId = useId();
	const listboxId = `${baseId}-listbox`;
	const getOptionId = useCallback(
		(index: number) => `${baseId}-opt-${index}`,
		[baseId],
	);
	const ariaCompartment = useMemo(() => new Compartment(), []);
	const extension = useMemo(
		() =>
			ariaCompartment.of(
				EditorView.contentAttributes.of({
					"aria-haspopup": "listbox",
					"aria-expanded": "false",
				}),
			),
		[ariaCompartment],
	);

	// useLayoutEffect ensures CodeMirror ARIA attrs update before paint.
	useLayoutEffect(() => {
		const view = editorRef.current?.view;
		if (!view) return;

		const attributes: Record<string, string> = {
			"aria-haspopup": "listbox",
			"aria-expanded": String(open),
		};

		if (open) {
			attributes["aria-controls"] = listboxId;
			// Listbox is rendered outside CodeMirror's DOM subtree.
			attributes["aria-owns"] = listboxId;

			if (activeOptionIndex !== undefined) {
				attributes["aria-activedescendant"] = getOptionId(activeOptionIndex);
			}
		}

		view.dispatch({
			effects: ariaCompartment.reconfigure(
				EditorView.contentAttributes.of(attributes),
			),
		});
	}, [activeOptionIndex, ariaCompartment, editorRef, getOptionId, listboxId, open]);

	return {
		extension,
		listboxId,
		getOptionId,
	};
}
