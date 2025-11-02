import { activityModel } from "../models/activityModel";

export const activityLogger = {
  // Log file upload
  logUpload: (userId: number, fileId: string, fileName: string) => {
    activityModel.create(userId, fileId, "upload", `Uploaded file "${fileName}"`);
  },

  // Log folder creation
  logCreateFolder: (userId: number, folderId: string, folderName: string) => {
    activityModel.create(userId, folderId, "create", `Created folder "${folderName}"`);
  },

  // Log file deletion
  logDelete: (userId: number, fileId: string, fileName: string) => {
    activityModel.create(userId, fileId, "delete", `Moved "${fileName}" to trash`);
  },

  // Log file restoration
  logRestore: (userId: number, fileId: string, fileName: string) => {
    activityModel.create(userId, fileId, "restore", `Restored "${fileName}" from trash`);
  },

  // Log file rename
  logRename: (userId: number, fileId: string, oldName: string, newName: string) => {
    activityModel.create(
      userId,
      fileId,
      "rename",
      `Renamed "${oldName}" to "${newName}"`
    );
  },

  // Log file move
  logMove: (userId: number, fileId: string, fileName: string, targetFolder: string) => {
    activityModel.create(
      userId,
      fileId,
      "move",
      `Moved "${fileName}" to "${targetFolder}"`
    );
  },

  // Log file star
  logStar: (userId: number, fileId: string, fileName: string) => {
    activityModel.create(userId, fileId, "star", `Starred "${fileName}"`);
  },

  // Log file unstar
  logUnstar: (userId: number, fileId: string, fileName: string) => {
    activityModel.create(userId, fileId, "unstar", `Unstarred "${fileName}"`);
  },

  // Log file download
  logDownload: (userId: number, fileId: string, fileName: string) => {
    activityModel.create(userId, fileId, "download", `Downloaded "${fileName}"`);
  },

  // Log file share
  logShare: (userId: number, fileId: string, fileName: string, sharedWith: string) => {
    activityModel.create(
      userId,
      fileId,
      "share",
      `Shared "${fileName}" with ${sharedWith}`
    );
  },

  // Log comment
  logComment: (userId: number, fileId: string, fileName: string) => {
    activityModel.create(userId, fileId, "comment", `Commented on "${fileName}"`);
  },
};

export default activityLogger;
