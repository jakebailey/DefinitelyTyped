import * as Koa from 'koa';
import { BusboyConfig } from 'busboy';

declare module 'koa' {
    interface Request {
        body: any;
    }
}

declare function multy(opts?: BusboyConfig): Koa.Middleware;

export = multy;
