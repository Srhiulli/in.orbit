// import { EmptyGoals } from "./components/empty-goals";
import { useEffect, useState } from "react";
import { CreateGoal } from "./components/create-goal";
import { Summary } from "./components/summary";
import { Dialog } from "./components/ui/dialog";
import { EmptyGoals } from "./components/empty-goals";
import { UserSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type SummaryResponse = {
	completed: number;
	total: number;
	goalsPerDay: Record<
		string,
		{
			id: string;
			title: string;
			completedAt: string;
		}[]
	>;
};

export function App() {
	const { data } = useQuery<SummaryResponse>({
		queryFn: async () => {
			const response = await fetch("http://localhost:3333/summary");
			const data = await response.json();
			return data.summary;
		},
		queryKey: ["summary"],
	});

	return (
		<Dialog>
			{data?.total && data.total > 0 ? <Summary /> : <EmptyGoals />}
			<CreateGoal />
		</Dialog>
	);
}
