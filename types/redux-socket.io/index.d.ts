/// <reference types="socket.io-client" />

import { Middleware, Action, Dispatch } from 'redux';

export interface MiddlewareOptions {
    eventName?: string | undefined;
    execute?: (<S>(action: Action, emitBound: SocketIOClient.Socket, next: Dispatch<S>, dispatch: Dispatch<S>) => any) | undefined;
}

export default function createSocketIoMiddleware(
    socket: SocketIOClient.Socket,
    criteria: (string | ReadonlyArray<string> | ((type: string, action: Action) => boolean)),
    options?: MiddlewareOptions
): Middleware;
