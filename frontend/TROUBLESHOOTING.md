# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Module Export Error
**Error:** `The requested module does not provide an export named 'AuthState'`

**Cause:** Vite HMR (Hot Module Replacement) cache issue

**Solution:**
1. Stop the dev server (Ctrl+C)
2. Clear browser cache
3. Restart dev server: `npm run dev`
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Issue 2: Custom Element Already Defined
**Error:** `A custom element with name 'mce-autosize-textarea' has already been defined`

**Cause:** Browser extension conflict (likely a text editor extension)

**Solution:**
- This error is from a browser extension and doesn't affect the app
- Can be safely ignored
- If bothersome, try disabling browser extensions temporarily

### Issue 3: Node Version Warning
**Warning:** `Vite requires Node.js version 20.19+ or 22.12+`

**Current:** Node.js 20.18.1

**Solution:**
- This is just a warning and doesn't prevent the app from running
- App runs fine with Node 20.18.1
- To upgrade Node (optional):
  ```bash
  # Using nvm
  nvm install 22
  nvm use 22

  # Or update current version
  nvm install 20.19.0
  nvm use 20.19.0
  ```

### Issue 4: Port Already in Use
**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Issue 5: Module Not Found
**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or install specific missing module
npm install xyz
```

### Issue 6: TypeScript Errors
**Error:** Various TypeScript type errors

**Solution:**
1. Check tsconfig.json is properly configured
2. Restart TypeScript server in your IDE
3. Clear TypeScript cache:
   ```bash
   rm -rf node_modules/.vite
   ```
4. Restart dev server

### Issue 7: Build Failures
**Error:** Build fails with various errors

**Solution:**
```bash
# Clear build cache
rm -rf dist
rm -rf node_modules/.vite

# Rebuild
npm run build
```

### Issue 8: Styles Not Applying
**Problem:** MUI styles not showing correctly

**Solution:**
1. Check ThemeProvider is wrapping the app in main.tsx
2. Verify CssBaseline is included
3. Clear browser cache
4. Check Material UI imports are correct

### Issue 9: Routes Not Working
**Problem:** Navigation not working, 404 errors

**Solution:**
1. Verify React Router is configured in main.tsx
2. Check router.tsx has correct routes
3. Ensure BrowserRouter is used (not HashRouter)
4. For production, configure server for SPA routing

### Issue 10: State Not Persisting
**Problem:** Zustand state resets on refresh

**Solution:**
1. Verify persist middleware is properly configured
2. Check browser's localStorage (DevTools > Application > Local Storage)
3. Clear localStorage if corrupted:
   ```javascript
   localStorage.clear()
   ```

---

## Quick Fixes

### Full Reset
```bash
# Stop dev server
# Delete cache and dependencies
rm -rf node_modules package-lock.json dist
rm -rf node_modules/.vite

# Reinstall
npm install

# Restart
npm run dev
```

### Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Restart TypeScript in VS Code
1. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
2. Type "TypeScript: Restart TS Server"
3. Press Enter

---

## Debugging Tips

### Check Console
Always check browser console (F12) for errors and warnings

### Check Network Tab
Monitor network requests in DevTools to see if API calls are working

### Check React DevTools
Install React DevTools extension to inspect component state

### Check Vite DevTools
Use `/__inspect/` route to see Vite's module graph

### Enable Verbose Logging
Add to vite.config.ts:
```typescript
export default defineConfig({
  logLevel: 'info',
  // ...
})
```

---

## Getting Help

### Check Documentation
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Material UI Docs](https://mui.com/)
- [Zustand Docs](https://docs.pmnd.rs/zustand/)

### Report Issues
If you encounter a bug in the app:
1. Note the error message
2. Note steps to reproduce
3. Check browser console for errors
4. Create an issue with details

---

## Performance Issues

### Slow HMR
```bash
# Reduce file watching
# Add to vite.config.ts
export default defineConfig({
  server: {
    watch: {
      usePolling: false,
    },
  },
})
```

### Slow Build
```bash
# Enable build cache
npm install vite-plugin-compression -D
```

### Large Bundle Size
```bash
# Analyze bundle
npm install vite-bundle-visualizer -D
npm run build
npx vite-bundle-visualizer
```

---

**Last Updated:** November 1, 2025
