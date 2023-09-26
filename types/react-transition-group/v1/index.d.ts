import { HTMLAttributes, ReactElement, ElementType } from "react";

export interface HTMLTransitionGroupProps<T> extends HTMLAttributes<T> {
    component?: ElementType | undefined;
    childFactory?(child: ReactElement): ReactElement;
}

import TransitionGroup = require("./TransitionGroup");
export {
    TransitionGroupProps,
    TransitionGroupChildLifecycle
} from "./TransitionGroup";

import CSSTransitionGroup = require("./CSSTransitionGroup");
export {
    CSSTransitionGroupProps,
    CSSTransitionGroupTransitionName
} from "./CSSTransitionGroup";

export {
    TransitionGroup,
    CSSTransitionGroup
};
