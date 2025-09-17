import { Item } from './Item.js';

export class Arma extends Item {
    #bonusAtaque;
    #bonusVelocidad;

    constructor({ id, nombre, descripcion, bonusAtaque, bonusVelocidad = 0, valor = 0 }) {
        super({ id, nombre, descripcion, tipo: 'arma', valor });
        this.#bonusAtaque = bonusAtaque;
        this.#bonusVelocidad = bonusVelocidad;
    }

    getBonusAtaque() { return this.#bonusAtaque; }
    getBonusVelocidad() { return this.#bonusVelocidad; }

    usar(explorador) {
        // Las armas se equipan permanentemente, no se consumen
        return {
            success: false,
            mensaje: 'Las armas se equipan automáticamente al obtenerlas',
            tipo: 'equipable'
        };
    }

    // Método para equipar el arma (modifica las estadísticas del explorador)
    equipar(explorador) {
        // Este método sería llamado por el sistema de inventario
        // para aplicar los bonificadores al explorador
        return {
            bonusAtaque: this.#bonusAtaque,
            bonusVelocidad: this.#bonusVelocidad
        };
    }

    toJSON() {
        return {
            ...super.toJSON(),
            bonusAtaque: this.#bonusAtaque,
            bonusVelocidad: this.#bonusVelocidad
        };
    }

    static fromJSON(data) {
        return new Arma(data);
    }
}
