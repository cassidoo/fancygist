import { useState, useRef, useMemo, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { githubLight } from "@uiw/codemirror-theme-github";
import { EditorView, keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import SlashCommandMenu, {
	slashCommands,
	type SlashCommand,
} from "./SlashCommandMenu";

interface EditorProps {
	value: string;
	onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
	const editorRef = useRef<ReactCodeMirrorRef>(null);
	const [showMenu, setShowMenu] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const slashStartPosRef = useRef(0);
	const [isInlineTrigger, setIsInlineTrigger] = useState(false);

	// Refs so the keymap always sees current state
	const showMenuRef = useRef(false);
	const selectedIndexRef = useRef(0);
	const filteredCommandsRef = useRef<SlashCommand[]>([]);

	const filteredCommands = slashCommands.filter((cmd) => {
		const matchesQuery = cmd.label
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		if (isInlineTrigger) {
			return matchesQuery && cmd.inline;
		}
		return matchesQuery;
	});

	useEffect(() => {
		showMenuRef.current = showMenu;
	}, [showMenu]);
	useEffect(() => {
		selectedIndexRef.current = selectedIndex;
	}, [selectedIndex]);
	useEffect(() => {
		filteredCommandsRef.current = filteredCommands;
	});

	// Auto-focus editor on mount
	useEffect(() => {
		const timer = setTimeout(() => {
			editorRef.current?.view?.focus();
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	const doInsert = (command: SlashCommand) => {
		const view = editorRef.current?.view;
		if (!view) return;
		const cursorPos = view.state.selection.main.head;
		const from = slashStartPosRef.current;
		view.dispatch(
			view.state.update({
				changes: { from, to: cursorPos, insert: command.content },
				selection: { anchor: from + command.content.length },
			}),
		);
		setShowMenu(false);
		view.focus();
	};

	// Stable ref so the keymap closure can always call the latest version
	const doInsertRef = useRef(doInsert);
	useEffect(() => {
		doInsertRef.current = doInsert;
	});

	// Single keymap created once, uses refs for all mutable state
	const slashCommandKeymap = useMemo(() => {
		return Prec.highest(
			keymap.of([
				{
					key: "Enter",
					run: () => {
						if (!showMenuRef.current) return false;
						const cmds = filteredCommandsRef.current;
						if (cmds.length > 0) {
							doInsertRef.current(cmds[selectedIndexRef.current]);
						}
						return true;
					},
				},
				{
					key: "ArrowDown",
					run: () => {
						if (!showMenuRef.current) return false;
						const len = filteredCommandsRef.current.length;
						if (len > 0) setSelectedIndex((i) => (i + 1) % len);
						return true;
					},
				},
				{
					key: "ArrowUp",
					run: () => {
						if (!showMenuRef.current) return false;
						const len = filteredCommandsRef.current.length;
						if (len > 0) setSelectedIndex((i) => (i === 0 ? len - 1 : i - 1));
						return true;
					},
				},
				{
					key: "ArrowRight",
					run: () => {
						if (!showMenuRef.current) return false;
						setShowMenu(false);
						return false; // let the cursor still move right
					},
				},
				{
					key: "Escape",
					run: () => {
						if (!showMenuRef.current) return false;
						setShowMenu(false);
						return true;
					},
				},
			]),
		);
	}, []);

	const handleChange = (val: string, viewUpdate: any) => {
		onChange(val);

		const view = viewUpdate.view;
		const state = view.state;
		const cursorPos = state.selection.main.head;
		const line = state.doc.lineAt(cursorPos);
		const lineText = line.text;
		const lineStart = line.from;
		const cursorPosInLine = cursorPos - lineStart;

		const beforeCursor = lineText.slice(0, cursorPosInLine);
		const slashMatch = beforeCursor.match(/(?:^|\s)\/(\w*)$/);

		if (slashMatch) {
			const isInline = slashMatch.index !== undefined && slashMatch.index > 0;
			setIsInlineTrigger(isInline);
			setSearchQuery(slashMatch[1]);
			const slashOffset = isInline
				? slashMatch.index + 1
				: slashMatch.index ?? 0;
			slashStartPosRef.current = lineStart + slashOffset;
			setSelectedIndex(0);
			setShowMenu(true);
		} else {
			setShowMenu(false);
		}
	};

	return (
		<div className="h-full w-full overflow-auto bg-white relative">
			<CodeMirror
				ref={editorRef}
				value={value}
				minHeight="100%"
				theme={githubLight}
				extensions={[
					slashCommandKeymap,
					markdown({ codeLanguages: languages }),
					EditorView.lineWrapping,
				]}
				onChange={handleChange}
				className="cm-ia-editor text-lg"
				basicSetup={{
					lineNumbers: true,
					foldGutter: false,
					highlightActiveLineGutter: true,
					highlightActiveLine: true,
				}}
				placeholder="Start typing... (try typing / at the start of a line)"
			/>

			{showMenu && (
				<SlashCommandMenu
					commands={filteredCommands}
					selectedIndex={selectedIndex}
					onSelect={(cmd) => doInsert(cmd)}
					onClose={() => setShowMenu(false)}
				/>
			)}
		</div>
	);
}
