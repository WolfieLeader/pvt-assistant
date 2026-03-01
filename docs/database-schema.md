# Database Schema — pvt-assistant

## Database Schema (Drizzle + SQLite)

### expenses

| Column                | Type                | Notes                                     |
| --------------------- | ------------------- | ----------------------------------------- |
| id                    | text PK             | nanoid                                    |
| amount                | real                | NOT NULL                                  |
| currency              | text                | default from user_settings                |
| category              | text                | sub-category name from CATEGORIES const   |
| note                  | text                | optional                                  |
| payment_method        | text                | 'cash' \| card name                       |
| is_subscription       | boolean             | default false                             |
| subscription_interval | text                | 'weekly' \| 'monthly' \| 'yearly' \| null |
| date                  | text                | ISO date string                           |
| created_at            | integer (timestamp) |                                           |
| updated_at            | integer (timestamp) |                                           |

### tasks

| Column      | Type                | Notes                       |
| ----------- | ------------------- | --------------------------- |
| id          | text PK             | nanoid                      |
| title       | text                | NOT NULL                    |
| is_done     | boolean             | default false               |
| priority    | text                | 'low' \| 'medium' \| 'high' |
| category    | text                | optional tag                |
| due_date    | text                | ISO date or null            |
| reminder_at | integer (timestamp) | for expo-notifications      |
| created_at  | integer (timestamp) |                             |
| updated_at  | integer (timestamp) |                             |

### chat messages — NO DB TABLE

Chat is ephemeral (Zustand in-memory). Clears when user exits chat screen.
Messages are `{ id, role, content, extractedType?, extractedId?, createdAt }` in `chat-store.ts`.
Extracted expenses/tasks persist in their own DB tables independently.

### attachments

| Column     | Type                | Notes                       |
| ---------- | ------------------- | --------------------------- |
| id         | text PK             | nanoid                      |
| expense_id | text FK             | references expenses.id      |
| file_path  | text                | local expo-file-system path |
| mime_type  | text                |                             |
| file_name  | text                |                             |
| created_at | integer (timestamp) |                             |

### active model — MMKV (not DB)

Only one model on device at a time. Swap = delete old + download new.
Stored in MMKV: `{ name, fileName, filePath, sizeBytes, sourceUrl, downloadedAt }`
No DB table needed — just a single MMKV key `active_model`.

### user_settings

| Column | Type    | Notes                             |
| ------ | ------- | --------------------------------- |
| key    | text PK | 'currency', 'default_model', etc. |
| value  | text    | JSON string                       |
