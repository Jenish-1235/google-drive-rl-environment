import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useFileStore } from "../../store/fileStore";
import { useUIStore } from "../../store/uiStore";
import { FileToolbar } from "../../components/files/FileToolbar";
import { FileList } from "../../components/files/FileList";
import { FileGrid } from "../../components/files/FileGrid";
import { FileListSkeleton } from "../../components/loading/FileListSkeleton";
import { FileGridSkeleton } from "../../components/loading/FileGridSkeleton";
import { FilePreviewModal } from "../../components/modals/FilePreviewModal";
import { ContextMenu } from "../../components/common/ContextMenu";
import { RenameModal } from "../../components/modals/RenameModal";
import { DeleteModal } from "../../components/modals/DeleteModal";
import { ShareModal } from "../../components/modals/ShareModal";
import { CreateFolderModal } from "../../components/modals/CreateFolderModal";
import type { DriveItem } from "../../types/file.types";
import type {
  SharePermission,
  GeneralAccess,
} from "../../components/modals/ShareModal";

export const HomePage = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const viewMode = useFileStore((state) => state.viewMode);
  const isLoading = useFileStore((state) => state.isLoading);
  const currentFolderId = useFileStore((state) => state.currentFolderId);
  const setCurrentFolder = useFileStore((state) => state.setCurrentFolder);
  const getCurrentFolderFiles = useFileStore(
    (state) => state.getCurrentFolderFiles
  );

  // API methods
  const fetchFiles = useFileStore((state) => state.fetchFiles);
  const createFolder = useFileStore((state) => state.createFolder);
  const renameFileAPI = useFileStore((state) => state.renameFile);
  const toggleStar = useFileStore((state) => state.toggleStar);
  const moveToTrash = useFileStore((state) => state.moveToTrash);

  const selectAll = useFileStore((state) => state.selectAll);
  const clearSelection = useFileStore((state) => state.clearSelection);
  const selectedFiles = useFileStore((state) => state.selectedFiles);
  const showSnackbar = useUIStore((state) => state.showSnackbar);
  const modal = useUIStore((state) => state.modal);
  const closeModal = useUIStore((state) => state.closeModal);

  // Subscribe to filter changes to trigger re-render when filters change
  // These variables are intentionally "unused" - they exist to make the component
  // reactive to filter state changes in Zustand store
  useFileStore((state) => state.typeFilter);
  useFileStore((state) => state.peopleFilter);
  useFileStore((state) => state.modifiedFilter);

  // Update current folder when route changes
  useEffect(() => {
    setCurrentFolder(folderId || null);
  }, [folderId, setCurrentFolder]);

  const [previewFile, setPreviewFile] = useState<DriveItem | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    position: { top: number; left: number } | null;
    file: DriveItem | null;
  }>({ position: null, file: null });
  const [renameFile, setRenameFile] = useState<DriveItem | null>(null);
  const [deleteFiles, setDeleteFiles] = useState<DriveItem[]>([]);
  const [shareFile, setShareFile] = useState<DriveItem | null>(null);
  // Fetch files on mount and when folder changes
  useEffect(() => {
    fetchFiles(currentFolderId).catch((error) => {
      showSnackbar(error.message || "Failed to load files", "error");
    });
  }, [currentFolderId, fetchFiles, showSnackbar]);

  // Add context menu handler
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // This will be handled by individual file items
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  const currentFiles = getCurrentFolderFiles();

  const handleFilePreview = (file: DriveItem) => {
    if (file.type !== "folder") {
      setPreviewFile(file);
    }
  };

  const handleContextMenuOpen = (event: React.MouseEvent, file: DriveItem) => {
    event.preventDefault();
    setContextMenu({
      position: { top: event.clientY, left: event.clientX },
      file,
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu({ position: null, file: null });
  };

  const handleRename = (file: DriveItem) => {
    setRenameFile(file);
  };

  const handleRenameSubmit = async (newName: string) => {
    if (renameFile) {
      try {
        await renameFileAPI(renameFile.id, newName);
        showSnackbar(`Renamed to "${newName}"`, "success");
        setRenameFile(null);
      } catch (error: any) {
        showSnackbar(error.message || "Failed to rename", "error");
      }
    }
  };

  const handleDelete = (filesToDelete: DriveItem[]) => {
    setDeleteFiles(filesToDelete);
  };

  const handleDeleteConfirm = async () => {
    try {
      await Promise.all(deleteFiles.map((file) => moveToTrash(file.id)));
      showSnackbar(
        `Moved ${deleteFiles.length} item${
          deleteFiles.length > 1 ? "s" : ""
        } to trash`,
        "success"
      );
      setDeleteFiles([]);
    } catch (error: any) {
      showSnackbar(error.message || "Failed to move to trash", "error");
    }
  };

  const handleToggleStar = async (file: DriveItem) => {
    try {
      await toggleStar(file.id);
      showSnackbar(
        file.isStarred ? "Removed from starred" : "Added to starred",
        "success"
      );
    } catch (error: any) {
      showSnackbar(error.message || "Failed to toggle star", "error");
    }
  };

  const handleCreateFolder = async (folderName: string) => {
    try {
      await createFolder(folderName, currentFolderId);
      showSnackbar(`Created folder "${folderName}"`, "success");
      closeModal();
    } catch (error: any) {
      showSnackbar(error.message || "Failed to create folder", "error");
    }
  };

  const handleNextPreview = () => {
    if (!previewFile) return;
    const currentIndex = currentFiles.findIndex((f) => f.id === previewFile.id);
    if (currentIndex < currentFiles.length - 1) {
      setPreviewFile(currentFiles[currentIndex + 1]);
    }
  };

  const handlePreviousPreview = () => {
    if (!previewFile) return;
    const currentIndex = currentFiles.findIndex((f) => f.id === previewFile.id);
    if (currentIndex > 0) {
      setPreviewFile(currentFiles[currentIndex - 1]);
    }
  };

  const handleShare = (file: DriveItem) => {
    setShareFile(file);
  };

  const handleShareSubmit = (emails: string[], permission: SharePermission) => {
    showSnackbar(
      `Shared with ${emails.length} ${
        emails.length === 1 ? "person" : "people"
      } as ${permission}`,
      "success"
    );
  };

  const handleUpdatePermission = (
    collaboratorId: string,
    permission: SharePermission
  ) => {
    showSnackbar(`Updated permission to ${permission}`, "success");
  };

  const handleRemoveAccess = (collaboratorId: string) => {
    showSnackbar("Removed access", "success");
  };

  const handleCopyLink = () => {
    // In real app, this would generate and copy the actual share link
    navigator.clipboard.writeText(
      `https://drive.google.com/file/${shareFile?.id}`
    );
    showSnackbar("Link copied to clipboard", "success");
  };

  const handleChangeGeneralAccess = (
    access: GeneralAccess,
    permission?: SharePermission
  ) => {
    showSnackbar(
      access === "restricted"
        ? "Changed to restricted access"
        : `Anyone with the link can ${permission || "view"}`,
      "success"
    );
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "a",
      ctrl: true,
      callback: (e) => {
        e.preventDefault();
        selectAll();
        showSnackbar("All files selected", "info");
      },
      description: "Select all files",
    },
    {
      key: "Escape",
      callback: () => {
        if (previewFile) {
          setPreviewFile(null);
        } else if (selectedFiles.length > 0) {
          clearSelection();
          showSnackbar("Selection cleared", "info");
        }
      },
      description: "Close preview or clear selection",
    },
    {
      key: "Delete",
      callback: () => {
        if (selectedFiles.length > 0 && !previewFile) {
          const filesToDelete = currentFiles.filter((f) =>
            selectedFiles.includes(f.id)
          );
          handleDelete(filesToDelete);
        }
      },
      description: "Delete selected files",
    },
  ]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        py: 3,
        px: 3,
        backgroundColor: "#f9fafb",
      }}
    >
      <FileToolbar />

      {/* File Views */}
      {isLoading ? (
        viewMode === "list" ? (
          <FileListSkeleton />
        ) : (
          <FileGridSkeleton />
        )
      ) : viewMode === "list" ? (
        <FileList
          files={currentFiles}
          onContextMenu={handleContextMenuOpen}
          onFileClick={handleFilePreview}
        />
      ) : (
        <FileGrid
          files={currentFiles}
          onContextMenu={handleContextMenuOpen}
          onFileClick={handleFilePreview}
        />
      )}

      {/* Modals */}
      <FilePreviewModal
        open={!!previewFile}
        file={previewFile}
        files={currentFiles}
        onClose={() => setPreviewFile(null)}
        onNext={handleNextPreview}
        onPrevious={handlePreviousPreview}
        onShare={() => previewFile && handleShare(previewFile)}
      />

      <ContextMenu
        anchorPosition={contextMenu.position}
        file={contextMenu.file}
        open={!!contextMenu.file}
        onClose={handleContextMenuClose}
        onOpen={() => contextMenu.file && handleFilePreview(contextMenu.file)}
        onShare={() => contextMenu.file && handleShare(contextMenu.file)}
        onDownload={() => showSnackbar("Download feature coming soon", "info")}
        onMove={() => showSnackbar("Move feature coming soon", "info")}
        onRename={() => contextMenu.file && handleRename(contextMenu.file)}
        onCopy={() => showSnackbar("Copy feature coming soon", "info")}
        onToggleStar={() =>
          contextMenu.file && handleToggleStar(contextMenu.file)
        }
        onDelete={() => contextMenu.file && handleDelete([contextMenu.file])}
        onDetails={() => showSnackbar("Details feature coming soon", "info")}
        onOrganize={() => showSnackbar("Organize feature coming soon", "info")}
        onMakeOffline={() => showSnackbar("Make offline feature coming soon", "info")}
        onSummarize={() => showSnackbar("AI summarization coming soon", "info")}
      />

      <RenameModal
        open={!!renameFile}
        file={renameFile}
        onClose={() => setRenameFile(null)}
        onRename={handleRenameSubmit}
      />

      <DeleteModal
        open={deleteFiles.length > 0}
        files={deleteFiles}
        onClose={() => setDeleteFiles([])}
        onDelete={handleDeleteConfirm}
      />

      <ShareModal
        open={!!shareFile}
        file={shareFile}
        onClose={() => setShareFile(null)}
        onShare={handleShareSubmit}
        onUpdatePermission={handleUpdatePermission}
        onRemoveAccess={handleRemoveAccess}
        onCopyLink={handleCopyLink}
        onChangeGeneralAccess={handleChangeGeneralAccess}
      />

      <CreateFolderModal
        open={modal.type === "createFolder"}
        onClose={closeModal}
        onCreate={handleCreateFolder}
      />
    </Box>
  );
};
