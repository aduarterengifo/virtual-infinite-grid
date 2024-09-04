import { Component } from "solid-js";
import { InfiniteGridWrapper } from "./grid-wrapper";
import { InfiniteGridContent } from "./grid-content";
import { InfiniteGridLayer } from "./grid-layer";
import { InfiniteGridColors } from "./grid-colors";

export const InfiniteGrid: Component = () => {
    return (
        <InfiniteGridWrapper>
            <InfiniteGridLayer>
                <InfiniteGridContent>
                    <InfiniteGridColors />
                </InfiniteGridContent>
            </InfiniteGridLayer>
        </InfiniteGridWrapper>
    )
}