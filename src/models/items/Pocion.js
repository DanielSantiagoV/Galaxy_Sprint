import { Item } from './Item.js';

export class Pocion extends Item {
    #curacion;

    constructor({ id, nombre, descripcion, curacion, valor = 0 }) {
        super({ id, nombre, descripcion, tipo: 'pocion', valor });
        this.#curacion = curacion;
    }

    getCuracion() { return this.#curacion; }

    usar(explorador) {
        const curacionReal = explorador.curar(this.#curacion);
        return {
            success: true,
            mensaje: `${explorador.getNombre()} usó ${this.getNombre()} y recuperó ${curacionReal} puntos de vida`,
            curacion: curacionReal
        };
    }

    toJSON() {
        return {
            ...super.toJSON(),
            curacion: this.#curacion
        };
    }

    static fromJSON(data) {
        return new Pocion(data);
    }
}
