# Categories — pvt-assistant

## Categories — Static Const (not in DB)

Categories are defined as a static constant in `src/constants/categories.ts` with parent/sub hierarchy.
No DB table needed — the `category` column in expenses stores the sub-category name as a string.
User-custom categories can be added later via MMKV or a DB table.

**Structure**: `{ name, icon, sub: [{ name, icon }] }[]`
Parent appears as first sub-entry (selecting "Food" maps to itself).
`CATEGORY_ICON_BY_NAME` map provides O(1) icon lookup.

| Parent            | Sub-categories                                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 🍔 Food           | 🛒 Groceries, 🍽️ Restaurants, 🍟 Fast Food, 🛵 Delivery Apps, ☕️ Coffee, 🍺 Alcohol / Bars, 🍫 Snacks                                  |
| 🏠 Housing        | 🏡 Rent / Mortgage, ⚡️ Electricity, 💧 Water / Gas, 🌐 Internet / Wifi, 🛠️ Maintenance, 🛋️ Furniture, 🧹 Home Services                 |
| 🚗 Transportation | ⛽ Fuel, 📄 Car Insurance, 🔧 Car Maintenance, 🚌 Public Transit, 🚕 Taxi / Ride Share, 🅿️ Parking / Tolls                             |
| 📱 Tech & Subs    | 💻 Electronics, 📞 Mobile Phone, 🎬 Streaming (Video), 🎵 Music / Audio, ☁️ Software / Cloud, 🎮 Gaming Services, 🔁 App Subscriptions |
| ✨ Personal       | 🛍️ Shopping, 👕 Clothing, ✂️ Haircut / Beauty, 🧴 Personal Care, 🎨 Hobbies, 🎁 Gifts                                                  |
| 🏥 Medical        | 🩺 Doctor / Visits, 💊 Pharmacy / Meds, 🩹 Health Insurance, 🦷 Dental, 👓 Eye Care, 🧠 Therapy                                        |
| 💪 Fitness        | 🏋️ Gym Membership, 🏸 Sports Equipment, 🍎 Vitamins / Supps, 🧘 Wellness / Spa, 🏟️ Sports Events                                       |
| 🎉 Entertainment  | 🍿 Movies / Cinema, 🎫 Concerts / Events, 🥂 Night Out, 🎲 Hobbies, 🎳 Bowling                                                         |
| ✈️ Travel         | 🛫 Flights, ⛺️ Hotels / Airbnb, 🚙 Car Rental, 🥘 Vacation Food, 📸 Sightseeing, 🛡️ Travel Insurance, 🏝️ Tours & Attractions           |
| 💰 Financial      | 📈 Investments, 💳 Debt Repayment, 🏛️ Taxes, 💸 Bank Fees, 🤝 Donations, ⚖️ Legal Services                                             |
| 🐾 Family & Pets  | 👶 Childcare, 🎒 Tuition / School, 🦴 Pet Food, 🐕 Vet / Pet Meds, 🧸 Toys / Supplies                                                  |
| 📦 Other          | (no sub-categories)                                                                                                                    |

The LLM extraction prompt will include this category list so it can classify expenses accurately.
