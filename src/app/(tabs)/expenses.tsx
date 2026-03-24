import { Eye, EyeOff, Plus } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { Button, Card, Chip, Screen, SearchBar, Skeleton, Text } from "~/components";
import { ExpenseCard } from "~/features/expenses/components/expense-card";
import { useExpenseForm } from "~/features/expenses/components/expense-form-context";
import { useExpenses, useExpenseStats } from "~/features/expenses/use-expenses";
import { usePrivacy } from "~/features/security";
import { useFilteredData } from "~/hooks/use-filtered-data";

type Period = "day" | "week" | "month";

function formatRelativeDate(dateStr: string): string {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function dateRange(period: Period) {
  const now = new Date();
  const today = now.toISOString().split("T")[0]!;
  if (period === "day") return { startDate: today, endDate: today };
  if (period === "week") {
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    return { startDate: monday.toISOString().split("T")[0]!, endDate: today };
  }
  return { startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]!, endDate: today };
}

export default function ExpensesScreen() {
  const [period, setPeriod] = useState<Period>("week");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { presentAdd } = useExpenseForm();
  const { formatAmount, privacyMode, togglePrivacyMode } = usePrivacy();
  const [muted] = useCSSVariable(["--color-muted"]) as string[];

  const range = useMemo(() => dateRange(period), [period]);
  const filters = useMemo(() => ({ ...range, search: debouncedSearch || undefined }), [range, debouncedSearch]);

  const { data: rawExpenses, isLoading } = useExpenses(filters);
  const expenses = useFilteredData(rawExpenses ?? []);
  const { data: stats } = useExpenseStats(period);

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(text), 300);
  }, []);

  type GroupedItem = { type: "header"; date: string } | { type: "item"; expense: any };

  const grouped = useMemo<GroupedItem[]>(() => {
    const items: GroupedItem[] = [];
    let lastDate = "";
    for (const expense of expenses) {
      if (expense.date !== lastDate) {
        lastDate = expense.date!;
        items.push({ type: "header", date: lastDate });
      }
      items.push({ type: "item", expense });
    }
    return items;
  }, [expenses]);

  return (
    <Screen edges={["top"]}>
      <View className="flex-row items-center justify-between mb-md mt-sm">
        <Text variant="heading">Expenses</Text>
        <Button icon={Plus} size="sm" variant="ghost" onPress={presentAdd} />
      </View>

      <Card className="mb-md">
        <View className="flex-row items-center justify-between mb-sm">
          <Text variant="caption" color="muted">
            {period === "day" ? "Today" : period === "week" ? "This week" : "This month"}
          </Text>
          <Pressable onPress={togglePrivacyMode} hitSlop={8}>
            {privacyMode ? <EyeOff size={18} color={muted} /> : <Eye size={18} color={muted} />}
          </Pressable>
        </View>
        {stats ? (
          <>
            <Text variant="display">{formatAmount(stats.total)}</Text>
            <Text variant="caption" color="muted">
              {stats.count} expense{stats.count !== 1 ? "s" : ""}
            </Text>
          </>
        ) : (
          <>
            <Skeleton width={160} height={36} />
            <Skeleton width={80} height={16} className="mt-xs" />
          </>
        )}
      </Card>

      <View className="flex-row gap-sm mb-md">
        {(["day", "week", "month"] as const).map((p) => (
          <Chip
            key={p}
            label={p === "day" ? "Day" : p === "week" ? "Week" : "Month"}
            selected={period === p}
            onPress={() => setPeriod(p)}
          />
        ))}
      </View>

      <SearchBar value={search} onChangeText={handleSearch} placeholder="Search expenses..." className="mb-md" />

      {isLoading ? (
        <View className="gap-md">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width={320} height={72} radius={24} />
          ))}
        </View>
      ) : grouped.length === 0 ? (
        <View className="flex-1 items-center justify-center py-xl">
          <Text color="muted">No expenses found</Text>
        </View>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(item, i) => (item.type === "header" ? `h-${item.date}` : `e-${item.expense.id}`)}
          renderItem={({ item }) => {
            if (item.type === "header") {
              return (
                <Text variant="caption" color="muted" className="mt-md mb-xs">
                  {formatRelativeDate(item.date)}
                </Text>
              );
            }
            return <ExpenseCard expense={item.expense} />;
          }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}
