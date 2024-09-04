import { ParentComponent } from "solid-js"
import { createDraggable } from '@neodrag/solid';


export const InfiniteGridContent: ParentComponent = (props) => {
    const { draggable } = createDraggable();
    return (
        <div class="flex flex-wrap gap-1" draggable={false} use:draggable>{props.children}</div>
    )
}