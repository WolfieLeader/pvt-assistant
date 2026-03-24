import { Plus } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Chip, Screen, SearchBar, Skeleton, Text } from "~/components";
import { TaskCard } from "~/features/tasks/components/task-card";
import { useTaskForm } from "~/features/tasks/components/task-form-context";
import { useTasks } from "~/features/tasks/use-tasks";
import { useFilteredData } from "~/hooks/use-filtered-data";

type Filter = "all" | "today" | "upcoming" | "done";

const EMPTY_MESSAGES: Record<Filter, string> = {
  all: "No tasks yet",
  today: "Nothing due today",
  upcoming: "No upcoming tasks",
  done: "No completed tasks",
};

export default function TasksScreen() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { presentAdd } = useTaskForm();

  const { data: rawTasks, isLoading } = useTasks(filter);
  const filtered = useFilteredData(rawTasks ?? []);

  const tasks = useMemo(
    () =>
      debouncedSearch
        ? filtered.filter((t: any) => t.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
        : filtered,
    [filtered, debouncedSearch],
  );

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(text), 300);
  }, []);

  return (
    <Screen edges={["top"]}>
      <View className="flex-row items-center justify-between mb-md mt-sm">
        <Text variant="heading">Tasks</Text>
        <Button icon={Plus} size="sm" variant="ghost" onPress={presentAdd} />
      </View>

      <View className="flex-row gap-sm mb-md flex-wrap">
        {(["all", "today", "upcoming", "done"] as const).map((f) => (
          <Chip
            key={f}
            label={f.charAt(0).toUpperCase() + f.slice(1)}
            selected={filter === f}
            onPress={() => setFilter(f)}
          />
        ))}
      </View>

      <SearchBar value={search} onChangeText={handleSearch} placeholder="Search tasks..." className="mb-md" />

      {isLoading ? (
        <View className="gap-md">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width={320} height={64} radius={24} />
          ))}
        </View>
      ) : tasks.length === 0 ? (
        <View className="flex-1 items-center justify-center py-xl">
          <Text color="muted">{EMPTY_MESSAGES[filter]}</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => <TaskCard task={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}
