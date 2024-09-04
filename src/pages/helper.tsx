import {
	type Accessor,
	type Component,
	type Setter,
	createEffect,
	createSignal,
	onCleanup,
} from "solid-js";
import { CELL_SIZE } from "./infinite-grid-2/grid-3";

type HelperProps = {
	dimensions: Accessor<{
		width: number;
		height: number;
	}>;
	setOffset: Setter<{
		x: number;
		y: number;
	}>;
	debugMode: Accessor<boolean>;
	setDebugMode: Setter<boolean>;
	offset: Accessor<{ x: number; y: number }>;
};

const MINIMAP_SCALE = 0.1;
const MINIMAP_SIZE = 200;

export const Helper: Component<HelperProps> = (props) => {
	let minimapRef: HTMLDivElement | undefined;

	const centerGrid = () => {
		const { width, height } = props.dimensions();
		const centerX = Math.floor(width / (2 * CELL_SIZE)) * CELL_SIZE;
		const centerY = Math.floor(height / (2 * CELL_SIZE)) * CELL_SIZE;
		props.setOffset({ x: centerX, y: centerY });
	};

	// createEffect(() => {
	// 	const updateMinimap = () => {
	// 		if (minimapRef) {
	// 			const { width, height } = props.dimensions();
	// 			const { x, y } = props.offset();

	// 			const viewportRect = minimapRef.querySelector(".viewport-rect");

	// 			if (viewportRect) {
	// 				// Calculate the scale to fit the larger dimension
	// 				const scale = MINIMAP_SIZE / Math.max(width, height);

	// 				// Update the SVG viewBox to maintain aspect ratio
	// 				const svgElement = minimapRef.querySelector("svg");
	// 				if (svgElement) {
	// 					svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
	// 					svgElement.style.width = `${width * scale}px`;
	// 					svgElement.style.height = `${height * scale}px`;
	// 				}

	// 				// Viewport rect (red) - represents the visible area
	// 				viewportRect.setAttribute("width", `${width}`);
	// 				viewportRect.setAttribute("height", `${height}`);
	// 				viewportRect.setAttribute("x", `${-x}`);
	// 				viewportRect.setAttribute("y", `${-y}`);
	// 			}
	// 		}
	// 	};

	// 	updateMinimap();
	// 	window.addEventListener("resize", updateMinimap);
	// 	onCleanup(() => window.removeEventListener("resize", updateMinimap));
	// });

	return (
		<div class="absolute top-4 left-4 flex gap-4 z-10">
			<div class="flex gap-4">
				<button
					type="button"
					class="bg-black text-white px-4 py-2 h-10"
					onClick={centerGrid}
				>
					Center Grid
				</button>
				<button
					type="button"
					class=" bg-black text-white px-4 py-2 h-10"
					onClick={() => props.setDebugMode(!props.debugMode())}
				>
					{props.debugMode() ? "Disable Debug" : "Enable Debug"}
				</button>
			</div>
			{/* <div ref={minimapRef} class="bg-gray-200 p-2">
				<svg width={MINIMAP_SIZE} height={MINIMAP_SIZE}>
					<title>mini-map</title>
					<rect class="viewport-rect" fill="red" opacity="0.3" />
				</svg>
			</div> */}
		</div>
	);
};
