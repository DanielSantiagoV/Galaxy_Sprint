import { Explorador } from './Explorador.js';
export class ExploradorIA extends Explorador {
    constructor(opts) { super(opts); }
    // La "IA" es simplemente la elección aleatoria de acciones, implementada en GeneradorAcciones
}
