import { Plus } from "lucide-react";
import { OutlineButton } from "./ui/outline-button";
import { getPendingGoals } from "../http/get-pending-goals";
import { useQuery } from "@tanstack/react-query";
import { createGoalCompletion } from "../http/crete-goal-completion";

export function PendingGoals() {
	const { data } = useQuery({
		queryFn: getPendingGoals,
		queryKey: ["pending-goals"],
		staleTime: 1000 * 60,
	});

	if (!data) {
		return <h1>Dados indisponíveis</h1>;
	}
	async function handleCompleteGoal(goalId: string) {
		await createGoalCompletion(goalId);
	}

	return (
		<div className="flex flex-wrap gap-3">
			{data.map((goal) => {
				return (
					<OutlineButton
						key={goal.id}
						disabled={goal.completionCount >= goal.desiredWeeklyFrequency}
						onClick={() => handleCompleteGoal(goal.id)}
					>
						<Plus className="size-4 text-zinc-600" />
						{goal.title}
					</OutlineButton>
				);
			})}
		</div>
	);
}
