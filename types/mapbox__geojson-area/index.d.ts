/* eslint-disable @definitelytyped/no-declare-current-package */
// tslint:disable-next-line no-single-declare-module
declare module "@mapbox/geojson-area" {
  import { Geometry, Position } from 'geojson';

  function geometry(geo: Geometry): number;
  function ring(coordinates: Position[]): number;
}
