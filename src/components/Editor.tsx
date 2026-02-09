import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { githubLight } from '@uiw/codemirror-theme-github';
import { EditorView } from '@codemirror/view';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  return (
    <div className="h-full w-full overflow-auto bg-white">
      <CodeMirror
        value={value}
        minHeight="100%"
        theme={githubLight}
        extensions={[
          markdown({ codeLanguages: languages }),
          EditorView.lineWrapping,
        ]}
        onChange={onChange}
        className="cm-ia-editor text-lg"
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
        }}
        placeholder="Start typing..."
      />
    </div>
  );
}
