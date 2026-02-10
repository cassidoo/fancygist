import { useEffect, useRef } from 'react';

export interface SlashCommand {
  label: string;
  description: string;
  content: string;
}

export const slashCommands: SlashCommand[] = [
  {
    label: 'table',
    description: 'Insert a markdown table',
    content: `| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`,
  },
  {
    label: 'image',
    description: 'Insert an image',
    content: '![Alt text](https://example.com/image.jpg)',
  },
  {
    label: 'quote',
    description: 'Insert a blockquote',
    content: '> This is a quote\n> that spans multiple lines',
  },
  {
    label: 'todo',
    description: 'Insert a task list',
    content: `- [ ] First task
- [ ] Second task
- [ ] Third task`,
  },
  {
    label: 'code',
    description: 'Insert a code block',
    content: '```javascript\n// Your code here\nconsole.log("Hello, world!");\n```',
  },
  {
    label: 'list',
    description: 'Insert a bullet list',
    content: `- First item
- Second item
- Third item`,
  },
  {
    label: 'numbered',
    description: 'Insert a numbered list',
    content: `1. First item
2. Second item
3. Third item`,
  },
  {
    label: 'heading1',
    description: 'Insert a heading level 1',
    content: '# Heading 1',
  },
  {
    label: 'heading2',
    description: 'Insert a heading level 2',
    content: '## Heading 2',
  },
  {
    label: 'heading3',
    description: 'Insert a heading level 3',
    content: '### Heading 3',
  },
  {
    label: 'divider',
    description: 'Insert a horizontal divider',
    content: '---',
  },
  {
    label: 'dummytext',
    description: 'Insert lorem ipsum text',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  },
  {
    label: 'link',
    description: 'Insert a link',
    content: '[Link text](https://example.com)',
  },
  {
    label: 'bold',
    description: 'Insert bold text',
    content: '**bold text**',
  },
  {
    label: 'italic',
    description: 'Insert italic text',
    content: '*italic text*',
  },
];

interface SlashCommandMenuProps {
  commands: SlashCommand[];
  selectedIndex: number;
  position: { top: number; left: number };
  onSelect: (command: SlashCommand) => void;
  onClose: () => void;
}

export default function SlashCommandMenu({
  commands,
  selectedIndex,
  position,
  onSelect,
  onClose,
}: SlashCommandMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    // Scroll selected item into view
    if (menuRef.current) {
      const selectedElement = menuRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (commands.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className="absolute bg-white border border-gray-200 rounded-lg shadow-lg py-2 max-h-64 overflow-y-auto z-50"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: '240px',
      }}
    >
      {commands.map((command, index) => (
        <button
          key={command.label}
          onClick={() => onSelect(command)}
          className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
            index === selectedIndex ? 'bg-blue-50 border-l-2 border-blue-500' : ''
          }`}
        >
          <div className="font-medium text-sm text-gray-900">/{command.label}</div>
          <div className="text-xs text-gray-500">{command.description}</div>
        </button>
      ))}
    </div>
  );
}
