import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { InOrbitIcon } from "./in-orbit-icon";
import { Progress, ProgressIndicator } from "./ui/progress-bar";

export function Summary() {
	return (
		<Dialog>
			<div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
				<div className="flex items-center justify-between ">
					<div className="flex items-center gap-3">
						<InOrbitIcon />
						<span className="text-lg font-semibold">5 a 10 de agosto</span>
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
								width: 200,
							}}
						/>
					</Progress>
					<div className=" flex items-center justify-between text-xs text-zinc-400">
						<span>
							Você completou <span className="text-zinc-100">8</span> de{" "}
							<span className="text-zinc-100">15</span> metas nessa semana
						</span>
						<span>58%</span>
					</div>
				</div>
			</div>
		</Dialog>
	);
}
