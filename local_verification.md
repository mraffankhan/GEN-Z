# Local Verification Commands

Run these commands in your terminal to verify the project state.

## 1. Install Dependencies (if not already)
```bash
npm install
```

## 2. Run Development Server
```bash
npm run dev
```
Open http://localhost:5173 to test the UI.

## 3. Run Migration Script (Dry Run)
```bash
node src/scripts/migratePendingUsers.js
```
Check the output to see which users would be processed.

## 4. Run Cleanup Script
```bash
node src/scripts/clearExpiredChats.js
```
Check the output for connection success.
