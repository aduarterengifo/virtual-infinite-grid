import { GridColor } from "./grid-color";

export const InfiniteGridColors = () => {
	return (
		<>
			{Array.from({ length: 10000 }, (_, i) => {
				return <GridColor key={i} />;
			})}
		</>
	);
};
