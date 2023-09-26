import { Plugin } from 'unified';
import { Root } from 'mdast';

declare const remarkHint: Plugin<[], Root, Root>;
export = remarkHint;
