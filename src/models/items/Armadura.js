import { Item } from './Item.js';

export class Armadura extends Item {
    #bonusDefensa;
    #bonusVida;

    constructor({ id, nombre, descripcion, bonusDefensa, bonusVida = 0, valor = 0 }) {
        super({ id, nombre, descripcion, tipo: 'armadura', valor });
        this.#bonusDefensa = bonusDefensa;
        this.#bonusVida = bonusVida;
    }

    getBonusDefensa() { return this.#bonusDefensa; }
    getBonusVida() { return this.#bonusVida; }

    usar(explorador) {
        // Las armaduras se equipan permanentemente, no se consumen
        return {
            success: false,
            mensaje: 'Las armaduras se equipan automáticamente al obtenerlas',
            tipo: 'equipable'
        };
    }

    // Método para equipar la armadura
    equipar(explorador) {
        return {
            bonusDefensa: this.#bonusDefensa,
            bonusVida: this.#bonusVida
        };
    }

    toJSON() {
        return {
            ...super.toJSON(),
            bonusDefensa: this.#bonusDefensa,
            bonusVida: this.#bonusVida
        };
    }

    static fromJSON(data) {
        return new Armadura(data);
    }
}
