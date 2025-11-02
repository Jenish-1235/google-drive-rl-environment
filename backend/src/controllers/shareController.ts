import { Request, Response } from "express";
import { shareModel } from "../models/shareModel";
import { fileModel } from "../models/fileModel";
import { userModel } from "../models/userModel";
import { activityModel } from "../models/activityModel";

// Get all shares for a file
export const getSharesForFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const userId = req.user!.userId;

    // Check if file exists and user is the owner
    const file = fileModel.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Only owner can view shares
    if (file.owner_id !== userId) {
      return res.status(403).json({ error: "Not authorized to view shares for this file" });
    }

    const shares = shareModel.getSharesWithDetailsForFile(fileId);
    res.json({ shares });
  } catch (error: any) {
    console.error("Error getting shares:", error);
    res.status(500).json({ error: "Failed to get shares" });
  }
};

// Create a new share
export const createShare = async (req: Request, res: Response) => {
  try {
    const {
      file_id,
      shared_with_user_id,
      permission = "viewer",
    } = req.body;
    const userId = req.user!.userId;

    // Validate input
    if (!file_id) {
      return res.status(400).json({ error: "file_id is required" });
    }

    if (!["viewer", "commenter", "editor"].includes(permission)) {
      return res.status(400).json({ error: "Invalid permission level" });
    }

    // Check if file exists
    const file = fileModel.findById(file_id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Only owner can share
    if (file.owner_id !== userId) {
      return res.status(403).json({ error: "Not authorized to share this file" });
    }

    // If sharing with specific user, check if user exists
    if (shared_with_user_id) {
      const targetUser = userModel.findById(shared_with_user_id);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if already shared
      const existingShare = shareModel.findByFileAndUser(
        file_id,
        shared_with_user_id
      );
      if (existingShare) {
        return res.status(400).json({ error: "File already shared with this user" });
      }

      // Don't allow sharing with self
      if (shared_with_user_id === userId) {
        return res.status(400).json({ error: "Cannot share file with yourself" });
      }
    }

    // Create share
    const share = shareModel.create(
      file_id,
      userId,
      shared_with_user_id || null,
      permission,
      null
    );

    // Log activity
    activityModel.create(
      userId,
      file_id,
      "share",
      shared_with_user_id
        ? `Shared "${file.name}" with user ID ${shared_with_user_id} as ${permission}`
        : `Created public share link for "${file.name}"`
    );

    res.status(201).json({ share });
  } catch (error: any) {
    console.error("Error creating share:", error);
    res.status(500).json({ error: "Failed to create share" });
  }
};

// Update share permission
export const updateSharePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { permission } = req.body;
    const userId = req.user!.userId;

    if (!["viewer", "commenter", "editor"].includes(permission)) {
      return res.status(400).json({ error: "Invalid permission level" });
    }

    // Check if share exists
    const share = shareModel.findById(parseInt(id));
    if (!share) {
      return res.status(404).json({ error: "Share not found" });
    }

    // Check if file exists and user is owner
    const file = fileModel.findById(share.file_id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (file.owner_id !== userId) {
      return res.status(403).json({ error: "Not authorized to update this share" });
    }

    // Update permission
    const updatedShare = shareModel.updatePermission(parseInt(id), permission);

    // Log activity
    activityModel.create(
      userId,
      file.id,
      "update_share",
      `Changed share permission to ${permission} for "${file.name}"`
    );

    res.json({ share: updatedShare });
  } catch (error: any) {
    console.error("Error updating share:", error);
    res.status(500).json({ error: "Failed to update share" });
  }
};

// Revoke share access
export const revokeShare = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    // Check if share exists
    const share = shareModel.findById(parseInt(id));
    if (!share) {
      return res.status(404).json({ error: "Share not found" });
    }

    // Check if file exists and user is owner
    const file = fileModel.findById(share.file_id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (file.owner_id !== userId) {
      return res.status(403).json({ error: "Not authorized to revoke this share" });
    }

    // Delete share
    shareModel.delete(parseInt(id));

    // Log activity
    activityModel.create(
      userId,
      file.id,
      "revoke_share",
      `Revoked share access for "${file.name}"`
    );

    res.json({ message: "Share revoked successfully" });
  } catch (error: any) {
    console.error("Error revoking share:", error);
    res.status(500).json({ error: "Failed to revoke share" });
  }
};

// Generate shareable link
export const generateShareLink = async (req: Request, res: Response) => {
  try {
    const { file_id, permission = "viewer" } = req.body;
    const userId = req.user!.userId;

    // Validate input
    if (!file_id) {
      return res.status(400).json({ error: "file_id is required" });
    }

    if (!["viewer", "commenter", "editor"].includes(permission)) {
      return res.status(400).json({ error: "Invalid permission level" });
    }

    // Check if file exists
    const file = fileModel.findById(file_id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Only owner can generate link
    if (file.owner_id !== userId) {
      return res.status(403).json({ error: "Not authorized to share this file" });
    }

    // Check if link already exists for this file
    const existingShares = shareModel.findByFileId(file_id);
    const linkShare = existingShares.find((s) => s.share_link !== null);

    if (linkShare) {
      // Return existing link
      return res.json({
        share_link: linkShare.share_link,
        permission: linkShare.permission,
        share_id: linkShare.id,
      });
    }

    // Generate unique share link token
    const shareLink = shareModel.generateShareLink();

    // Create share with link
    const share = shareModel.create(
      file_id,
      userId,
      null, // No specific user
      permission,
      shareLink
    );

    // Log activity
    activityModel.create(
      userId,
      file_id,
      "create_link",
      `Generated shareable link for "${file.name}"`
    );

    res.status(201).json({
      share_link: share.share_link,
      permission: share.permission,
      share_id: share.id,
    });
  } catch (error: any) {
    console.error("Error generating share link:", error);
    res.status(500).json({ error: "Failed to generate share link" });
  }
};

// Access file via shareable link
export const accessViaShareLink = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    // Find share by token
    const share = shareModel.findByShareLink(token);
    if (!share) {
      return res.status(404).json({ error: "Invalid or expired share link" });
    }

    // Get file details
    const file = fileModel.findById(share.file_id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Check if file is trashed
    if (file.is_trashed === 1) {
      return res.status(410).json({ error: "File has been deleted" });
    }

    // Get owner details
    const owner = userModel.findById(file.owner_id);

    res.json({
      file: {
        id: file.id,
        name: file.name,
        type: file.type,
        mime_type: file.mime_type,
        size: file.size,
        created_at: file.created_at,
        updated_at: file.updated_at,
      },
      permission: share.permission,
      owner: owner ? userModel.toResponse(owner) : null,
    });
  } catch (error: any) {
    console.error("Error accessing via share link:", error);
    res.status(500).json({ error: "Failed to access file" });
  }
};

// Get files shared with me
export const getSharedWithMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Get all shares for this user
    const shares = shareModel.findBySharedWithUserId(userId);

    // Get file details for each share
    const sharedFiles = shares
      .map((share) => {
        const file = fileModel.findById(share.file_id);
        if (!file || file.is_trashed === 1) {
          return null;
        }

        const owner = userModel.findById(file.owner_id);

        return {
          ...file,
          permission: share.permission,
          shared_by: owner ? userModel.toResponse(owner) : null,
          shared_at: share.created_at,
        };
      })
      .filter((file) => file !== null);

    res.json({ files: sharedFiles });
  } catch (error: any) {
    console.error("Error getting shared files:", error);
    res.status(500).json({ error: "Failed to get shared files" });
  }
};
