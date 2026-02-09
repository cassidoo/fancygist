import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '../components/Editor';
import MarkdownPreview from '../components/MarkdownPreview';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import type { Gist } from '../types';

export default function EditorPage() {
  const { username, gistId } = useParams();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [filename, setFilename] = useState('untitled.md');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentGistId, setCurrentGistId] = useState<string | null>(gistId || null);
  const [originalOwner, setOriginalOwner] = useState<string | null>(username || null);
  const { hasUnsavedChanges, markDirty, markClean, setupBeforeUnload } = useUnsavedChanges();

  // Load gist if URL has gist ID
  useEffect(() => {
    if (gistId) {
      loadGist(gistId);
      setIsPreview(true); // Start in preview mode for shared links
    }
  }, [gistId]);

  // Setup beforeunload listener
  useEffect(() => {
    return setupBeforeUnload();
  }, [setupBeforeUnload]);

  const loadGist = async (id: string) => {
    try {
      const response = await fetch(`/api/gists/${id}`);
      if (!response.ok) throw new Error('Failed to load gist');
      
      const gist: Gist = await response.json();
      const mdFile = Object.values(gist.files).find(f => 
        f.filename.endsWith('.md') || f.filename.endsWith('.markdown')
      );

      if (mdFile && mdFile.content) {
        setContent(mdFile.content);
        setFilename(mdFile.filename);
        setDescription(gist.description || '');
        setOriginalOwner(gist.owner.login);
        setCurrentGistId(id);
        markClean();
      }
    } catch (error) {
      console.error('Error loading gist:', error);
      alert('Failed to load gist');
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert('Please log in to save');
      return;
    }

    setIsSaving(true);
    try {
      const isOwner = originalOwner === user.login;
      const endpoint = currentGistId && isOwner
        ? `/api/gists/${currentGistId}`
        : '/api/gists';
      
      const method = currentGistId && isOwner ? 'PATCH' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          description,
          files: {
            [filename]: { content }
          },
          public: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to save gist');
      
      const savedGist: Gist = await response.json();
      setCurrentGistId(savedGist.id);
      setOriginalOwner(user.login);
      markClean();

      // Update URL without reload
      window.history.pushState(
        {},
        '',
        `/@${user.login}/${savedGist.id}`
      );
    } catch (error) {
      console.error('Error saving gist:', error);
      alert('Failed to save gist');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNew = () => {
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Continue?')) {
      return;
    }
    setContent('');
    setDescription('');
    setFilename('untitled.md');
    setCurrentGistId(null);
    setOriginalOwner(null);
    setIsPreview(false);
    markClean();
    window.history.pushState({}, '', '/');
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    markDirty();
  };

  // Keyboard shortcuts
  useKeyboardShortcut('s', handleSave, { ctrl: true });
  useKeyboardShortcut('n', handleNew, { ctrl: true });

  const isOwner = user && originalOwner === user.login;
  const showEditButton = !!(isPreview && currentGistId);

  return (
    <div className="h-screen flex flex-col">
      <Navbar
        onNew={handleNew}
        onSave={handleSave}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        isPreview={isPreview}
        onTogglePreview={() => setIsPreview(!isPreview)}
        showEditButton={showEditButton}
        isOwner={isOwner || false}
        gistUrl={currentGistId && originalOwner ? `/@${originalOwner}/${currentGistId}` : null}
      />
      
      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          <MarkdownPreview content={content} />
        ) : (
          <Editor
            value={content}
            onChange={handleContentChange}
          />
        )}
      </div>
    </div>
  );
}
