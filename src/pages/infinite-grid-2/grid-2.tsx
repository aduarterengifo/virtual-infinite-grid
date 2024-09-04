import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

const CELL_SIZE = 200; // Grid cell size in pixels
const BUFFER = 2; // Number of extra rows/columns to render beyond the viewport

export const Grid2 = () => {
	const [grid, setGrid] = createSignal<
		{ row: number; col: number; imageUrl: any }[]
	>([]);
	const [viewportDimensions, setViewportDimensions] = createStore({
		width: 0,
		height: 0,
	});
	const [scrollPosition, setScrollPosition] = createStore({ x: 0, y: 0 });
	let gridRef: HTMLDivElement | undefined;
	let observerRef: IntersectionObserver | undefined;

	const generateImageUrl = (row: number, col: number) => {
		return `/api/placeholder/${CELL_SIZE}/${CELL_SIZE}?text=${row},${col}`;
	};

	createEffect(() => {
		const updateViewportDimensions = () => {
			if (gridRef) {
				setViewportDimensions({
					width: gridRef.clientWidth,
					height: gridRef.clientHeight,
				});
			}
		};

		updateViewportDimensions();
		window.addEventListener("resize", updateViewportDimensions);

		onCleanup(() =>
			window.removeEventListener("resize", updateViewportDimensions),
		);
	});

	createEffect(() => {
		const handleScroll = (e) => {
			setScrollPosition({
				x: e.target.scrollLeft,
				y: e.target.scrollTop,
			});
		};

		if (gridRef) {
			gridRef.addEventListener("scroll", handleScroll);
		}

		onCleanup(() => {
			if (gridRef) {
				gridRef.removeEventListener("scroll", handleScroll);
			}
		});
	});

	createEffect(() => {
		const generateGrid = () => {
			const startCol = Math.floor(scrollPosition.x / CELL_SIZE) - BUFFER;
			const endCol =
				startCol + Math.ceil(viewportDimensions.width / CELL_SIZE) + BUFFER * 2;
			const startRow = Math.floor(scrollPosition.y / CELL_SIZE) - BUFFER;
			const endRow =
				startRow +
				Math.ceil(viewportDimensions.height / CELL_SIZE) +
				BUFFER * 2;

			const newGrid = [];
			for (let row = startRow; row <= endRow; row++) {
				for (let col = startCol; col <= endCol; col++) {
					newGrid.push({ row, col, imageUrl: generateImageUrl(row, col) });
				}
			}
			setGrid(newGrid);
		};

		generateGrid();
	});

	createEffect(() => {
		if ("IntersectionObserver" in window) {
			observerRef = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const img = entry.target as HTMLImageElement;
							img.src = img.dataset.src;
							img.classList.remove("lazy");
							observerRef.unobserve(img);
						}
					});
				},
				{ rootMargin: "200px" },
			);
		}

		onCleanup(() => {
			if (observerRef) {
				observerRef.disconnect();
			}
		});
	});

	createEffect(() => {
		const lazyImages = document.querySelectorAll("img.lazy");
		lazyImages.forEach((img) => {
			if (observerRef) {
				observerRef.observe(img);
			}
		});
	});

	return (
		<div class="h-screen w-screen overflow-auto relative">
			<div class="absolute left-1/2 top-1/2 translate-x-1/2 translate-y-1/2">
				<For each={grid()}>
					{({ row, col, imageUrl }) => (
						<div
							class="absolute flex items-center justify-center bg-gray-100 border border-gray-300"
							style={{
								left: `${col * CELL_SIZE}px`,
								top: `${row * CELL_SIZE}px`,
								width: `${CELL_SIZE}px`,
								height: `${CELL_SIZE}px`,
							}}
						>
							<img
								class="lazy object-cover w-full h-full"
								data-src={imageUrl}
								alt={`Cell ${row},${col}`}
							/>
						</div>
					)}
				</For>
			</div>
		</div>
	);
};
