export interface User {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  avatar_url: string | null;
  storage_used: number;
  storage_limit: number;
  created_at: string;
  updated_at: string;
}

export interface File {
  id: string;
  name: string;
  type: "file" | "folder";
  mime_type: string | null;
  size: number;
  parent_id: string | null;
  owner_id: number;
  file_path: string | null;
  thumbnail_path: string | null;
  is_starred: 0 | 1;
  is_trashed: 0 | 1;
  trashed_at: string | null;
  created_at: string;
  updated_at: string;
  last_opened_at: string | null;
}

export interface Share {
  id: number;
  file_id: string;
  shared_with_user_id: number | null;
  shared_by_user_id: number;
  permission: "viewer" | "commenter" | "editor";
  share_link: string | null;
  created_at: string;
}

export interface Activity {
  id: number;
  user_id: number;
  file_id: string | null;
  action: string;
  details: string | null;
  created_at: string;
}

export interface FileVersion {
  id: number;
  file_id: string;
  version_number: number;
  file_path: string;
  size: number;
  uploaded_by: number;
  created_at: string;
}

export interface Comment {
  id: number;
  file_id: string;
  user_id: number;
  comment_text: string;
  created_at: string;
  updated_at: string;
}

// Response types (without sensitive data)
export interface UserResponse {
  id: number;
  email: string;
  name: string;
  avatar_url: string | null;
  storage_used: number;
  storage_limit: number;
  created_at: string;
}

export interface FileResponse extends Omit<File, "file_path"> {
  owner?: UserResponse;
  shared_users?: UserResponse[];
  can_edit?: boolean;
}
