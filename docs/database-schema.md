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

Chat is ephemeral (useState in chat modal). Clears when modal is dismissed.
Messages are `{ id, role, content, extractedType?, extractedId?, createdAt }` in chat modal component.
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

## Categories — Static Const (not in DB)

Defined in `src/constants/categories.ts` with parent/sub hierarchy.
The `category` column in expenses stores the sub-category name as a string.
User-custom categories can be added later via a DB table.

**Structure**: `{ name, icon, sub: [{ name, icon }] }[]`
Parent appears as first sub-entry (selecting "Food" maps to itself).
`CATEGORY_ICON_BY_NAME` map provides O(1) icon lookup.

| Parent         | Sub-categories                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| Food           | Groceries, Restaurants, Fast Food, Delivery Apps, Coffee, Alcohol / Bars, Snacks                                  |
| Housing        | Rent / Mortgage, Electricity, Water / Gas, Internet / Wifi, Maintenance, Furniture, Home Services                 |
| Transportation | Fuel, Car Insurance, Car Maintenance, Public Transit, Taxi / Ride Share, Parking / Tolls                          |
| Tech & Subs    | Electronics, Mobile Phone, Streaming (Video), Music / Audio, Software / Cloud, Gaming Services, App Subscriptions |
| Personal       | Shopping, Clothing, Haircut / Beauty, Personal Care, Hobbies, Gifts                                               |
| Medical        | Doctor / Visits, Pharmacy / Meds, Health Insurance, Dental, Eye Care, Therapy                                     |
| Fitness        | Gym Membership, Sports Equipment, Vitamins / Supps, Wellness / Spa, Sports Events                                 |
| Entertainment  | Movies / Cinema, Concerts / Events, Night Out, Hobbies, Bowling                                                   |
| Travel         | Flights, Hotels / Airbnb, Car Rental, Vacation Food, Sightseeing, Travel Insurance, Tours & Attractions           |
| Financial      | Investments, Debt Repayment, Taxes, Bank Fees, Donations, Legal Services                                          |
| Family & Pets  | Childcare, Tuition / School, Pet Food, Vet / Pet Meds, Toys / Supplies                                            |
| Other          | (no sub-categories)                                                                                               |

The LLM extraction prompt includes this category list for accurate classification.
