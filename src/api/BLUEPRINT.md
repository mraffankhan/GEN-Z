# Gen-Z API Blueprint 🗺️

This document outlines the API structure for the Gen-Z social network MVP.

## 📂 Folder Structure
- `/src/api/auth/` - Authentication logic
- `/src/api/verification/` - ID verification (Velvet Rope)
- `/src/api/confessions/` - Anonymous confessions
- `/src/api/polls/` - Positive polls
- `/src/api/utils/` - Shared helpers

---

## 🔌 API Endpoints

### A) Authentication 🔐

#### 1. `POST /auth/signup`
- **Purpose:** Register a new user.
- **Input:** `{ email, password, college_name }`
- **Returns:** `{ user_id, session_token }`
- **Supabase Table:** `auth.users` (managed by Supabase Auth) & `public.profiles`
- **Logic:** Creates auth user -> Triggers creation of profile entry.

#### 2. `POST /auth/login`
- **Purpose:** Log in an existing user.
- **Input:** `{ email, password }`
- **Returns:** `{ session_token, user_profile }`
- **Supabase Table:** `auth.users`
- **Logic:** Authenticates credentials -> Returns session.

---

### B) Verification (The Velvet Rope) 🎟️

#### 3. `POST /verification/upload-id`
- **Purpose:** Upload college ID for OCR verification.
- **Input:** `{ image_file, user_id }`
- **Returns:** `{ success, ocr_text_detected }`
- **Supabase Table:** `profiles` (updates `verified` status later)
- **Logic:** Uploads to Storage -> Calls Gemini API for OCR -> Returns result.

#### 4. `POST /verification/confirm`
- **Purpose:** Finalize verification if OCR matches.
- **Input:** `{ user_id, is_match }`
- **Returns:** `{ success, new_status }`
- **Supabase Table:** `profiles`
- **Logic:** Updates `verified = true` in `profiles` table.

---

### C) Confessions 🤫

#### 5. `POST /confessions/create`
- **Purpose:** Post a new anonymous confession.
- **Input:** `{ content, college_id }`
- **Returns:** `{ confession_id, created_at }`
- **Supabase Table:** `confessions`
- **Logic:** Checks toxicity (Gemini) -> Inserts into `confessions`.

#### 6. `GET /confessions/list`
- **Purpose:** Get latest confessions for the feed.
- **Input:** `{ page, college_id }`
- **Returns:** `[ { id, content, created_at } ]`
- **Supabase Table:** `confessions`
- **Logic:** Selects from `confessions` ordered by `created_at` desc.

---

### D) Polls 📊

#### 7. `POST /polls/vote`
- **Purpose:** Cast a vote on a poll.
- **Input:** `{ poll_id, option_index }`
- **Returns:** `{ success, updated_counts }`
- **Supabase Table:** `polls` (or a separate `votes` table later)
- **Logic:** Increments vote count for the option.

#### 8. `GET /polls/questions`
- **Purpose:** Get active polls.
- **Input:** `{ college_id }`
- **Returns:** `[ { id, question, options } ]`
- **Supabase Table:** `polls`
- **Logic:** Fetches active polls.
