import { count } from "drizzle-orm";
import { db } from "./client";
import { categories } from "./schema";

type SeedCategory = {
  name: string;
  icon: string;
  color: string;
  children: { name: string; icon: string }[];
};

const SEED: SeedCategory[] = [
  {
    name: "Food",
    icon: "🍔",
    color: "#fb923c",
    children: [
      { name: "Groceries", icon: "🛒" },
      { name: "Restaurants", icon: "🍽️" },
      { name: "Fast Food", icon: "🍟" },
      { name: "Delivery Apps", icon: "📱" },
      { name: "Coffee", icon: "☕" },
      { name: "Alcohol / Bars", icon: "🍺" },
      { name: "Snacks", icon: "🍪" },
    ],
  },
  {
    name: "Housing",
    icon: "🏠",
    color: "#60a5fa",
    children: [
      { name: "Rent / Mortgage", icon: "🏢" },
      { name: "Electricity", icon: "⚡" },
      { name: "Water / Gas", icon: "💧" },
      { name: "Internet / Wifi", icon: "📶" },
      { name: "Maintenance", icon: "🔧" },
      { name: "Furniture", icon: "🪑" },
      { name: "Home Services", icon: "🧹" },
    ],
  },
  {
    name: "Transportation",
    icon: "🚗",
    color: "#22d3ee",
    children: [
      { name: "Fuel", icon: "⛽" },
      { name: "Car Insurance", icon: "📋" },
      { name: "Car Maintenance", icon: "🛠️" },
      { name: "Public Transit", icon: "🚌" },
      { name: "Taxi / Ride Share", icon: "🚖" },
      { name: "Parking / Tolls", icon: "🅿️" },
    ],
  },
  {
    name: "Tech & Subs",
    icon: "💻",
    color: "#a78bfa",
    children: [
      { name: "Electronics", icon: "🔌" },
      { name: "Mobile Phone", icon: "📱" },
      { name: "Streaming (Video)", icon: "🎬" },
      { name: "Music / Audio", icon: "🎵" },
      { name: "Software / Cloud", icon: "☁️" },
      { name: "Gaming Services", icon: "🎮" },
      { name: "App Subscriptions", icon: "📲" },
    ],
  },
  {
    name: "Personal",
    icon: "🛍️",
    color: "#f472b6",
    children: [
      { name: "Shopping", icon: "🛒" },
      { name: "Clothing", icon: "👕" },
      { name: "Haircut / Beauty", icon: "💇" },
      { name: "Personal Care", icon: "🧴" },
      { name: "Hobbies", icon: "🎨" },
      { name: "Gifts", icon: "🎁" },
    ],
  },
  {
    name: "Medical",
    icon: "🩺",
    color: "#f87171",
    children: [
      { name: "Doctor / Visits", icon: "👨‍⚕️" },
      { name: "Pharmacy / Meds", icon: "💊" },
      { name: "Health Insurance", icon: "🛡️" },
      { name: "Dental", icon: "🦷" },
      { name: "Eye Care", icon: "👓" },
      { name: "Therapy", icon: "🧠" },
    ],
  },
  {
    name: "Fitness",
    icon: "🏋️",
    color: "#4ade80",
    children: [
      { name: "Gym Membership", icon: "💪" },
      { name: "Sports Equipment", icon: "🎾" },
      { name: "Vitamins / Supps", icon: "💊" },
      { name: "Wellness / Spa", icon: "🧖" },
      { name: "Sports Events", icon: "🏟️" },
    ],
  },
  {
    name: "Entertainment",
    icon: "🎭",
    color: "#fbbf24",
    children: [
      { name: "Movies / Cinema", icon: "🎬" },
      { name: "Concerts / Events", icon: "🎶" },
      { name: "Night Out", icon: "🍸" },
      { name: "Hobbies", icon: "🎲" },
      { name: "Bowling", icon: "🎳" },
    ],
  },
  {
    name: "Travel",
    icon: "✈️",
    color: "#38bdf8",
    children: [
      { name: "Flights", icon: "🛫" },
      { name: "Hotels / Airbnb", icon: "🏨" },
      { name: "Car Rental", icon: "🚗" },
      { name: "Vacation Food", icon: "🍴" },
      { name: "Sightseeing", icon: "📷" },
      { name: "Travel Insurance", icon: "📄" },
      { name: "Tours & Attractions", icon: "🏰" },
    ],
  },
  {
    name: "Financial",
    icon: "💰",
    color: "#34d399",
    children: [
      { name: "Investments", icon: "📈" },
      { name: "Debt Repayment", icon: "💳" },
      { name: "Taxes", icon: "📃" },
      { name: "Bank Fees", icon: "🏦" },
      { name: "Donations", icon: "💝" },
      { name: "Legal Services", icon: "⚖️" },
    ],
  },
  {
    name: "Family & Pets",
    icon: "👪",
    color: "#fb7185",
    children: [
      { name: "Childcare", icon: "👶" },
      { name: "Tuition / School", icon: "🎓" },
      { name: "Pet Food", icon: "🐶" },
      { name: "Vet / Pet Meds", icon: "🩺" },
      { name: "Toys / Supplies", icon: "🧸" },
    ],
  },
  {
    name: "Other",
    icon: "📦",
    color: "#a1a1aa",
    children: [],
  },
];

export const seedCategories = async () => {
  const [{ total }] = await db.select({ total: count() }).from(categories);
  if (total > 0) return;

  for (const parent of SEED) {
    const [{ id: parentId }] = await db
      .insert(categories)
      .values({ name: parent.name, icon: parent.icon, color: parent.color })
      .returning({ id: categories.id });

    if (parent.children.length > 0) {
      await db.insert(categories).values(
        parent.children.map((child) => ({
          name: child.name,
          icon: child.icon,
          parentId,
        })),
      );
    }
  }
};
