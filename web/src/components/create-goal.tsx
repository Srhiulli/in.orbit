import { RadioGroup } from "@radix-ui/react-radio-group";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroupIndicator, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createGoalForm = z.object({
	title: z.string().min(1, "informe a atividade que deseja realizar"),
	desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
});

type createGoalFrom= z.infer<typeof createGoalForm> 

export function CreateGoal() {
	const { register, control, handleSubmit, formState } = useForm<createGoalFrom>({
		resolver: zodResolver(createGoalForm),
	});

	function hendleCreateGoal(data: createGoalFrom) {
		console.log(data);
	}



	return (
		<DialogContent>
			<div className="flex flex-col gap-6 h-full">
				<div className="flex flex-col gap-3">
					<div className=" flex items-center justify-between">
						<DialogTitle>Cadastrar meta</DialogTitle>
						<DialogClose>
							<X className="size-5 text-zinc-600" />
						</DialogClose>
					</div>
					<DialogDescription>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
					</DialogDescription>
				</div>
				<form
					onSubmit={handleSubmit(hendleCreateGoal)}
					className="flex flex-col justify-between flex-1"
				>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-2">
							<Label htmlFor="title">Qual a ativividade?</Label>
							<Input
								id="title"
								placeholder="Praticar exercícios, meditar, etc..."
								autoFocus
								{...register("title")}
							/>
							{formState.errors.title && (
								<p className="text-red-400 text-sm">
									{formState.errors.title.message}
									</p>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="title">Quantas vezes na semana?</Label>
							<Controller
								control={control}
								name="desiredWeeklyFrequency"
								defaultValue={7}
								render={({ field }) => {
									return (
										<RadioGroup
											onValueChange={field.onChange}
											value={String(field.value)}
										>
											<RadioGroupItem value="1">
												<RadioGroupIndicator />
												<span className="text-zinc-300 text-sm font-medium leading-none">
													1x na semana
												</span>
												<span className="text-lg leading-none">🥱</span>
											</RadioGroupItem>
											<RadioGroupItem value="2">
												<RadioGroupIndicator />
												<span className="text-zinc-300 text-sm font-medium leading-none">
													2x na semana
												</span>
												<span className="text-lg leading-none">🙂</span>
											</RadioGroupItem>
											<RadioGroupItem value="3">
												<RadioGroupIndicator />
												<span className="text-zinc-300 text-sm font-medium leading-none">
													3x na semana
												</span>
												<span className="text-lg leading-none">😎</span>
											</RadioGroupItem>
											<RadioGroupItem value="4">
												<RadioGroupIndicator />
												<span className="text-zinc-300 text-sm font-medium leading-none">
													4x na semana
												</span>
												<span className="text-lg leading-none">😜</span>
											</RadioGroupItem>
											<RadioGroupItem value="5">
												<RadioGroupIndicator />
												<span className="text-zinc-300 text-sm font-medium leading-none">
													5x na semana
												</span>
												<span className="text-lg leading-none">🤨</span>
											</RadioGroupItem>
											<RadioGroupItem value="6">
												<RadioGroupIndicator />
												<span className="text-zinc-300 text-sm font-medium leading-none">
													6x na semana
												</span>
												<span className="text-lg leading-none">🤯</span>
											</RadioGroupItem>
											<RadioGroupItem value="7">
												<RadioGroupIndicator />
												<span className="text-zinc-300 text-sm font-medium leading-none">
													7x na semana
												</span>
												<span className="text-lg leading-none">🔥</span>
											</RadioGroupItem>
										</RadioGroup>
									);
								}}
							/>
						</div>
					</div>
					<div className=" flex  items-center gap-3">
						<DialogClose asChild>
							<Button className="flex-1" variant="secondary">
								Fechar
							</Button>
						</DialogClose>
						<Button className="flex-1">Salvar</Button>
					</div>
				</form>
			</div>
		</DialogContent>
	);
}
