// Because this is a scoped package, without this line Typescript doesn't associate the
// types with the right package.
/* eslint-disable @definitelytyped/no-declare-current-package */
// tslint:disable-next-line:no-single-declare-module
declare module "@keystonejs/logger" {
    function logger(name: string): void;
}
