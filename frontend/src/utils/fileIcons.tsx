import {
  Folder as FolderIcon,
  Description as DocumentIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  PictureAsPdf as PdfIcon,
  TableChart as SpreadsheetIcon,
  Slideshow as PresentationIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import type { FileType } from '../types/file.types';
import { colors } from '../theme/theme';

export const getFileIcon = (fileType: FileType) => {
  const iconProps = { sx: { fontSize: 24 } };

  switch (fileType) {
    case 'folder':
      return <FolderIcon {...iconProps} sx={{ ...iconProps.sx, color: colors.fileTypes.folder }} />;
    case 'document':
      return <DocumentIcon {...iconProps} sx={{ ...iconProps.sx, color: colors.fileTypes.document }} />;
    case 'spreadsheet':
      return <SpreadsheetIcon {...iconProps} sx={{ ...iconProps.sx, color: colors.fileTypes.spreadsheet }} />;
    case 'presentation':
      return <PresentationIcon {...iconProps} sx={{ ...iconProps.sx, color: colors.fileTypes.presentation }} />;
    case 'pdf':
      return <PdfIcon {...iconProps} sx={{ ...iconProps.sx, color: colors.fileTypes.pdf }} />;
    case 'image':
      return <ImageIcon {...iconProps} sx={{ ...iconProps.sx, color: colors.fileTypes.image }} />;
    case 'video':
      return <VideoIcon {...iconProps} sx={{ ...iconProps.sx, color: colors.fileTypes.video }} />;
    case 'audio':
      return <AudioIcon {...iconProps} sx={{ ...iconProps.sx, color: colors.fileTypes.audio }} />;
    case 'archive':
      return <ArchiveIcon {...iconProps} sx={{ ...iconProps.sx, color: colors.fileTypes.archive }} />;
    default:
      return <FileIcon {...iconProps} sx={{ ...iconProps.sx, color: colors.fileTypes.other }} />;
  }
};

export const getFileThumbnail = (_fileType: FileType, thumbnailUrl?: string) => {
  if (thumbnailUrl) {
    return thumbnailUrl;
  }
  // Return default placeholder based on type
  return null;
};
