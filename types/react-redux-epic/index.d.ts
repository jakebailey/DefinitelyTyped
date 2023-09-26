import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { Epic } from 'redux-observable';

export interface Action {
    type: string;
}

export function wrapRootEpic<T extends Action, S, D, O extends T>(
    epic: Epic<T, S, D, O>
): Epic<T, S, D, O>;

export function renderToString(
    element: React.ReactElement,
    wrappedEpic: Epic<any, any>
): Observable<{ markup: string }>;
