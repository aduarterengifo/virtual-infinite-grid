import type { ParentComponent } from "solid-js";
import { CELL_SIZE } from "../infinite-grid-2/grid-3";

interface GridColorProps {
	key?: string | number;
	left: number;
	top: number;
	color: string;
}

export const GridColor: ParentComponent<GridColorProps> = (props) => {
	return (
		<div
			class="grid place-items-center bg-amber-50 aspect-square select-none absolute cursor-pointer"
			style={{
				left: `${props.left}px`,
				top: `${props.top}px`,
				width: `${CELL_SIZE}px`,
				height: `${CELL_SIZE}px`,
			}}
		>
			{props.children}
			<div
				class="w-6 h-6 rounded-full inline-block aspect-square"
				style={{
					"background-color": props.color,
				}}
			/>
		</div>
	);
};
