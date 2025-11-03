import api from "./api";

export interface Comment {
  id: number;
  file_id: string;
  user_id: number;
  comment_text: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
  };
}

export const commentService = {
  // Get all comments for a file
  getComments: async (fileId: string): Promise<{ comments: Comment[]; count: number }> => {
    const response = await api.get(`/comments/${fileId}`);
    return response.data;
  },

  // Get recent comments by current user
  getRecentComments: async (limit: number = 10): Promise<{ comments: Comment[] }> => {
    const response = await api.get("/comments/user/recent", {
      params: { limit },
    });
    return response.data;
  },

  // Create a new comment
  createComment: async (
    fileId: string,
    commentText: string
  ): Promise<{ comment: Comment }> => {
    const response = await api.post("/comments", {
      file_id: fileId,
      comment_text: commentText,
    });
    return response.data;
  },

  // Update a comment
  updateComment: async (
    commentId: number,
    commentText: string
  ): Promise<{ comment: Comment }> => {
    const response = await api.patch(`/comments/${commentId}`, {
      comment_text: commentText,
    });
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};

export default commentService;
