import { createEffect, createMemo } from "solid-js";

const MINIMAP_SIZE = 150; // Size of the minimap
const PADDING = 10; // Padding around the minimap

export const MiniMap = (props: {
	viewportPixelDimensions: () => { width: number; height: number };
	viewportDimensions: () => {
		minX: number;
		maxX: number;
		minY: number;
		maxY: number;
		dimX: number;
		dimY: number;
	};
	exploredDimensions: () => {
		minX: number;
		maxX: number;
		minY: number;
		maxY: number;
		dimX: number;
		dimY: number;
	};
	pixelOffset: () => { x: number; y: number };
	cartesianOffset: () => { x: number; y: number };
	cellSize: number;
}) => {
	const scale = createMemo(
		() =>
			(MINIMAP_SIZE - 2 * PADDING) /
			Math.max(
				props.exploredDimensions().dimX,
				props.exploredDimensions().dimY,
			),
	);

	return (
		<>
			<div
				class="absolute grid place-items-center right-4 bottom-4 bg-amber-50 overflow-hidden z-20 border border-black"
				style={{
					width: `${MINIMAP_SIZE}px`,
					height: `${MINIMAP_SIZE}px`,
				}}
			>
				<div
					class="bg-red-500/20 relative"
					style={{
						width: `${props.exploredDimensions().dimX * scale()}px`,
						height: `${props.exploredDimensions().dimY * scale()}px`,
					}}
				>
					<div
						class="absolute bg-blue-500/20"
						style={{
							left: `${(props.viewportDimensions().minX - props.exploredDimensions().minX) * scale()}px`,
							top: `${(props.viewportDimensions().minY - props.exploredDimensions().minY) * scale()}px`,
							width: `${props.viewportDimensions().dimX * scale()}px`,
							height: `${props.viewportDimensions().dimY * scale()}px`,
						}}
					/>
				</div>
			</div>
		</>
	);
};
