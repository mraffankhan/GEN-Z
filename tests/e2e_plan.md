# Manual E2E Test Plan

Since no automated testing framework is configured, please perform the following manual tests to verify the system.

## 1. User Profile & Cosmetics
- [ ] **Login**: Log in with a test user.
- [ ] **Profile Page**: Navigate to `/profile`. Verify that your avatar, name, and cosmetics (glow, border, badge) are displayed correctly using the new `AvatarRenderer`.
- [ ] **Edit Profile**: Change your display name and bio. Verify updates.
- [ ] **Public Profile**: Navigate to another user's profile (e.g., `/profile/<some-id>`). Verify their cosmetics are visible.

## 2. Direct Messages (DMs)
- [ ] **DM List**: Go to `/dms`. Verify the list of conversations is displayed with correct avatars and last messages.
- [ ] **Start DM**: Go to a public profile and click "Message". Verify it redirects to the DM room.
- [ ] **Send Message**: In a DM room, send a text message. Verify it appears immediately (optimistic update) and persists after refresh.
- [ ] **Receive Message**: Open two browsers/incognito windows with different users. Send a message from one and verify it appears in the other in real-time.
- [ ] **Scroll**: Send enough messages to fill the screen. Scroll up and verify older messages load (virtualization).

## 3. Category Rooms (Ephemeral Chat)
- [ ] **Enter Room**: Go to "Youth Connect" and enter a room (e.g., "Tech Talk").
- [ ] **Send Message**: Send a message. Verify it appears.
- [ ] **Expiration**: (Hard to test manually instantly) Verify that new messages are inserted. The system is configured to expire them in 24h.
- [ ] **Avatars**: Verify all users in the chat have their correct avatars and cosmetics.

## 4. Home Page
- [ ] **Header**: Verify your avatar is shown in the top right.
- [ ] **Navigation**: Click all shortcut links (Jobs, Connect, Messages) and verify they work.

## 5. Scripts (Admin)
- [ ] **Migration**: Run `node src/scripts/migratePendingUsers.js` (Dry Run). Verify it lists users to be processed without errors.
- [ ] **Cleanup**: Run `node src/scripts/clearExpiredChats.js`. Verify it connects and runs (even if 0 deleted).
