# Infinite Loop Fix

## Problem

Calling `getCurrentFolderFiles()` inside a Zustand selector caused an infinite re-render loop:

```typescript
// ❌ CAUSES INFINITE LOOP!
const currentFiles = useFileStore((state) => state.getCurrentFolderFiles());
```

**Why this creates infinite loop:**
1. `getCurrentFolderFiles()` returns a **new array** every time it's called
2. Zustand sees the new array reference as a state change
3. Component re-renders
4. Selector runs again, creating another new array
5. Repeat forever → Maximum update depth exceeded

---

## Solution

**Use `useMemo` with explicit dependencies:**

```typescript
// ✅ CORRECT - No infinite loop!

// 1. Subscribe to all state values that affect the result
const files = useFileStore((state) => state.files);
const currentFolderId = useFileStore((state) => state.currentFolderId);
const typeFilter = useFileStore((state) => state.typeFilter);
const peopleFilter = useFileStore((state) => state.peopleFilter);
const modifiedFilter = useFileStore((state) => state.modifiedFilter);
const sortField = useFileStore((state) => state.sortField);
const sortOrder = useFileStore((state) => state.sortOrder);
const searchQuery = useFileStore((state) => state.searchQuery);
const getCurrentFolderFiles = useFileStore((state) => state.getCurrentFolderFiles);

// 2. Use useMemo to compute filtered files only when dependencies change
const currentFiles = useMemo(() => {
  return getCurrentFolderFiles();
}, [files, currentFolderId, typeFilter, peopleFilter, modifiedFilter, sortField, sortOrder, searchQuery, getCurrentFolderFiles]);
```

**Why this works:**
1. Component subscribes to each state value individually
2. When any value changes, component re-renders
3. `useMemo` only recalculates if its dependencies actually changed
4. No new array created unnecessarily
5. No infinite loop! ✅

---

## File Modified

**`frontend/src/pages/HomePage/HomePage.tsx`**

**Added:**
- `import { useMemo }` from React
- Individual subscriptions to all file-related state
- `useMemo` to compute `currentFiles`

**Result:**
- ✅ No infinite loop
- ✅ Component still re-renders when state changes
- ✅ Automatic UI updates work correctly
- ✅ Performance optimized (only recomputes when needed)

---

## Key Takeaway

**When working with computed/derived state in Zustand:**

1. **Subscribe to primitive values** (strings, numbers, booleans)
2. **Don't call functions that return new objects/arrays inside selectors**
3. **Use `useMemo`** for derived computations
4. **List all dependencies** explicitly in useMemo

This pattern gives you:
- ✅ Reactivity (component re-renders on changes)
- ✅ No infinite loops (memoization prevents unnecessary recalculation)
- ✅ Performance (only recomputes when dependencies change)
