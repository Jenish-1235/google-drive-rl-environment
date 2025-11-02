import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  callback: (event: KeyboardEvent) => void;
  description?: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[], enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatches = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault();
          shortcut.callback(event);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
};

// Common keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  SELECT_ALL: { key: 'a', ctrl: true, description: 'Select all' },
  ESCAPE: { key: 'Escape', description: 'Cancel/Close' },
  DELETE: { key: 'Delete', description: 'Move to trash' },
  BACKSPACE: { key: 'Backspace', description: 'Move to trash' },
  ENTER: { key: 'Enter', description: 'Open file' },
  ARROW_UP: { key: 'ArrowUp', description: 'Navigate up' },
  ARROW_DOWN: { key: 'ArrowDown', description: 'Navigate down' },
  ARROW_LEFT: { key: 'ArrowLeft', description: 'Navigate left' },
  ARROW_RIGHT: { key: 'ArrowRight', description: 'Navigate right' },
  RENAME: { key: 'F2', description: 'Rename file' },
  SEARCH: { key: '/', description: 'Focus search' },
  NEW_FOLDER: { key: 'n', shift: true, description: 'New folder' },
  UPLOAD: { key: 'u', ctrl: true, description: 'Upload files' },
  SHARE: { key: '.', description: 'Share' },
};
