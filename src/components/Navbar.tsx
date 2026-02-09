import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onNew: () => void;
  onSave: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  isPreview: boolean;
  onTogglePreview: () => void;
  showEditButton: boolean;
  isOwner: boolean;
  gistUrl: string | null;
}

export default function Navbar({
  onNew,
  onSave,
  isSaving,
  hasUnsavedChanges,
  isPreview,
  onTogglePreview,
  showEditButton,
  gistUrl,
}: NavbarProps) {
  const { user, login, logout } = useAuth();

  const copyShareLink = () => {
    if (gistUrl) {
      const url = `${window.location.origin}${gistUrl}`;
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="text-xl font-semibold text-gray-900">
            FancyGist
          </a>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onNew}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
            >
              New
            </button>
            
            {user && !isPreview && (
              <button
                onClick={onSave}
                disabled={isSaving}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
                {hasUnsavedChanges && !isSaving && ' *'}
              </button>
            )}

            {showEditButton && (
              <button
                onClick={onTogglePreview}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
              >
                {isPreview ? 'Edit' : 'Preview'}
              </button>
            )}

            {gistUrl && (
              <button
                onClick={copyShareLink}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
              >
                Copy Link
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-700">@{user.login}</span>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={login}
              className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded"
            >
              Login with GitHub
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
