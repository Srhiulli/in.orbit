// import { EmptyGoals } from "./components/empty-goals";
import { CreateGoal } from "./components/create-goal";
import { Summary } from "./components/summary";
import { Dialog } from "./components/ui/dialog";
import { EmptyGoals } from "./components/empty-goals";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "./http/get-summary";

export function App() {
	const { data } = useQuery({
		queryFn: getSummary,
		queryKey: ["summary"],
		staleTime: 1000 * 60,
	});

	return (
		<Dialog>
			{data?.total && data.total > 0 ? <Summary /> : <EmptyGoals />}
			<CreateGoal />
		</Dialog>
	);
}
