import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { githubLight } from '@uiw/codemirror-theme-github';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  return (
    <div className="h-full w-full">
      <CodeMirror
        value={value}
        height="100%"
        theme={githubLight}
        extensions={[markdown()]}
        onChange={onChange}
        className="h-full text-lg"
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLineGutter: false,
          highlightActiveLine: false,
        }}
        placeholder="Start typing..."
      />
    </div>
  );
}
