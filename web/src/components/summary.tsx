import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { InOrbitIcon } from "./in-orbit-icon";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { OutlineButton } from "./ui/outline-button";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../http/get-summary";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";

dayjs.locale(ptBR);

export function Summary() {
	const { data } = useQuery({
		queryFn: getSummary,
		queryKey: ["summary"],
		staleTime: 1000 * 60,
	});

	if (!data || data.total === undefined || data.completed === undefined) {
		return <h1>Dados indisponíveis</h1>;
	}

	const firstDayOfWeek = dayjs().startOf("week").format("D MMM");
	const lastDayOfWeek = dayjs().endOf("week").format("D MMM");

	const completedPercentage = Math.round(data.completed * 100) / data.total;

	return (
		<Dialog>
			<div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
				<div className="flex items-center justify-between ">
					<div className="flex items-center gap-3">
						<InOrbitIcon />
						<span className="text-lg font-semibold capitalize">
							{firstDayOfWeek} - {lastDayOfWeek}
						</span>
					</div>
					<DialogTrigger asChild>
						<Button size="sm">
							<Plus className=" size-4" />
							Cadastrar meta
						</Button>
					</DialogTrigger>
				</div>
				<div className=" flex flex-col gap-3">
					<Progress value={8} max={15}>
						<ProgressIndicator
							style={{
								width: `${completedPercentage}%`,
							}}
						/>
					</Progress>
					<div className=" flex items-center justify-between text-xs text-zinc-400">
						<span>
							Você completou{" "}
							<span className="text-zinc-100">{data.completed}</span> de{" "}
							<span className="text-zinc-100">{data.total}</span> metas nessa
							semana
						</span>
						<span>{completedPercentage}%</span>
					</div>
				</div>
				<Separator />
				<div className="flex flex-wrap gap-3">
					<OutlineButton>
						<Plus className="size-4 text-zinc-600" />
						Meditar
					</OutlineButton>
					<OutlineButton>
						<Plus className="size-4 text-zinc-600" />
						Nadar
					</OutlineButton>
					<OutlineButton>
						<Plus className="size-4 text-zinc-600" />
						Estudar
					</OutlineButton>
					<OutlineButton>
						<Plus className="size-4 text-zinc-600" />
						Passear com o Cachorro
					</OutlineButton>
				</div>
				<div className="flex flex-col gap-6">
					<h2 className="text-xl font-medium">Sua semana</h2>

					{data.goalsPerDay &&
						Object.entries(data.goalsPerDay).map(([date, goals]) => {
							return (
								<div key={date} className="flex flex-col gap-4">
									<h3 className="font-medium">
										{date}
										<span className="text-zinc-400 text-xs">
											({dayjs(date).format("D MMMM")})
										</span>
									</h3>
									<ul className="flex flex-col gap-3">
										{goals.map((goal) => (
											<li key={goal.id} className="flex items-center gap-2">
												<CheckCircle2 className="size-4 text-pink-500" />
												<span className="text-sm text-zinc-400">
													Você completou{" "}
													<span className="text-zinc-100">{goal.title}</span> às{" "}
													<span className="text-zinc-100">
														{goal.completedAt}
													</span>
												</span>
											</li>
										))}
									</ul>
								</div>
							);
						})}
				</div>
			</div>
		</Dialog>
	);
}
