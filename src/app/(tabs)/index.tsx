import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { Card, Screen, Skeleton, Text } from "~/components";
import { useTodayTotal } from "~/features/expenses/use-expenses";
import { usePrivacy } from "~/features/security";
import { TaskCard } from "~/features/tasks/components/task-card";
import { usePendingCount, useUpcomingTasks } from "~/features/tasks/use-tasks";
import { useFilteredData } from "~/hooks/use-filtered-data";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const TODAY = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export default function HomeScreen() {
  const router = useRouter();
  const { formatAmount } = usePrivacy();
  const [muted] = useCSSVariable(["--color-muted"]) as string[];
  const { data: todayTotal, isLoading: loadingTotal } = useTodayTotal();
  const { data: pendingCount, isLoading: loadingCount } = usePendingCount();
  const { data: rawUpcoming, isLoading: loadingUpcoming } = useUpcomingTasks(5);
  const upcoming = useFilteredData(rawUpcoming ?? []);

  return (
    <Screen scroll edges={["top"]}>
      <View className="mt-md mb-lg">
        <Text variant="heading">{getGreeting()}</Text>
        <Text variant="body" color="muted">
          {TODAY}
        </Text>
      </View>

      <Card pressable onPress={() => router.navigate("/expenses")} className="mb-md">
        <View className="flex-row items-center justify-between">
          <View>
            <Text variant="caption" color="muted">
              Today&apos;s spending
            </Text>
            {loadingTotal ? (
              <Skeleton width={120} height={32} className="mt-xs" />
            ) : (
              <Text variant="display">{formatAmount(todayTotal ?? 0)}</Text>
            )}
          </View>
          <ChevronRight size={20} color={muted} />
        </View>
      </Card>

      <Card pressable onPress={() => router.navigate("/tasks")} className="mb-lg">
        <View className="flex-row items-center justify-between">
          <View>
            <Text variant="caption" color="muted">
              Pending tasks
            </Text>
            {loadingCount ? (
              <Skeleton width={60} height={32} className="mt-xs" />
            ) : (
              <Text variant="display">{pendingCount ?? 0}</Text>
            )}
          </View>
          <ChevronRight size={20} color={muted} />
        </View>
      </Card>

      <View className="flex-row items-center justify-between mb-md">
        <Text variant="title">Upcoming</Text>
        <Pressable onPress={() => router.navigate("/tasks")} hitSlop={8}>
          <Text variant="caption" color="accent">
            See all
          </Text>
        </Pressable>
      </View>

      {loadingUpcoming ? (
        <View className="gap-sm">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width={320} height={64} radius={24} />
          ))}
        </View>
      ) : upcoming.length === 0 ? (
        <Text color="muted" className="py-md">
          No upcoming tasks
        </Text>
      ) : (
        <View className="gap-sm pb-xl">
          {upcoming.map((task: any) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </View>
      )}
    </Screen>
  );
}
