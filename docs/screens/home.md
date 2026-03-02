# Home Screen

## Layout

Glanceable dashboard:

- Greeting header
- Today's spend total card
- Pending task count card
- Upcoming tasks list

Entry point for the app.

## Data Reads

- **Expenses**: today's sum from `expenses` table (filtered by `date = today`)
- **Tasks**: pending count (`is_done = false`) + upcoming sorted by `due_date`
