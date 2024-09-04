import { ParentComponent } from "solid-js"

export const InfiniteGridWrapper: ParentComponent = (props) => {
    return (
        <div class="absolute top-0 left-0 h-screen w-screen">{props.children}</div>
    )
}