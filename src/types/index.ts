export interface User {
  login: string;
  avatar_url: string;
  name: string | null;
}

export interface Gist {
  id: string;
  description: string;
  public: boolean;
  owner: {
    login: string;
  };
  files: {
    [key: string]: {
      filename: string;
      type: string;
      language: string;
      raw_url: string;
      size: number;
      content?: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface EditorState {
  content: string;
  gistId: string | null;
  filename: string;
  description: string;
  isDirty: boolean;
  isOwner: boolean;
}
