# Changelog

## [Unreleased] - 2025-02-23

### Added
- **Direct Messages**: New `DMsPage.jsx` and `DMRoom.jsx` for 1-on-1 chatting.
- **Scripts**: `clearExpiredChats.js` for cleaning up ephemeral messages.
- **Components**: `AvatarRenderer.jsx` for unified avatar display.
- **Tests**: `tests/e2e_plan.md` for manual verification.

### Changed
- **Home Page**: Refactored to use `AvatarRenderer` and fixed layout.
- **Profile Page**: Refactored to use `AvatarRenderer`.
- **Category Room**: Refactored to use `AvatarRenderer` and enforced 24h message expiration.
- **Migration Script**: Updated to use `gemini-1.5-flash` and added dry-run mode.
- **Database**: Added `direct_messages` table definition in `database_setup.sql`.

### Fixed
- **Syntax Errors**: Fixed JSX syntax errors in multiple files (`Home`, `Profile`, `CategoryRoom`, `DMsPage`, `DMRoom`, `CosmeticPreview`).
- **Performance**: Added virtualization and memoization to chat components.
