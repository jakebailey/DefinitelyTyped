import { Transform } from 'readable-stream';
import { Quad_Graph, DataFactory, BaseQuad, Quad, Stream } from 'rdf-js';

export interface TripleToQuadTransformOptions {
    factory: DataFactory;
}

export default class TripleToQuadTransform<Q extends BaseQuad = Quad> extends Transform implements Stream<Q> {
    constructor(graph?: Quad_Graph | string, options?: TripleToQuadTransformOptions);
}
