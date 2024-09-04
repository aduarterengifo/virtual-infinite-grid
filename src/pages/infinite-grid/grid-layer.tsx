import { JSX, ParentComponent} from 'solid-js';
import { Properties } from 'solid-js/web';

export const InfiniteGridLayer: ParentComponent = (props) => {
    return (
        <div class="overflow-hidden relative w-full h-full">
            {props.children}
        </div>
    )
}