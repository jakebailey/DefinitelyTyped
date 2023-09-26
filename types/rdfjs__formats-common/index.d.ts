import { SinkMap } from '@rdfjs/sink-map';
import { Stream } from 'rdf-js';
import { EventEmitter } from 'events';

export const parsers: SinkMap<EventEmitter, Stream>;
export const serializers: SinkMap<Stream, EventEmitter>;

export interface Formats {
    parsers: typeof parsers;
    serializers: typeof serializers;
}

declare const formats: Formats;

export default formats;

export { default as JsonLdParser } from '@rdfjs/parser-jsonld';
export { default as N3Parser } from '@rdfjs/parser-n3';
export { default as NTriplesSerializer } from '@rdfjs/serializer-ntriples';
export { default as JsonLdSerializer } from '@rdfjs/serializer-jsonld';
export { RdfXmlParser } from 'rdfxml-streaming-parser';
