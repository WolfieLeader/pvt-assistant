# Tasks Screen

## Layout

- Filter chips at top: All, Today, Upcoming, Done
- Flat list sorted by due date (FlashList)

## Data

- **Reads**: `tasks` table filtered by status/due date based on active chip
- **Writes**: via React Query mutations (mark done, edit, delete)
