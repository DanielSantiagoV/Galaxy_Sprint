import { Item } from './Item.js';

export class Energia extends Item {
    #bonusEnergia;

    constructor({ id, nombre, descripcion, bonusEnergia, valor = 0 }) {
        super({ id, nombre, descripcion, tipo: 'energia', valor });
        this.#bonusEnergia = bonusEnergia;
    }

    getBonusEnergia() { return this.#bonusEnergia; }

    usar(explorador) {
        const energiaAnterior = explorador.getEnergia();
        const energiaMaxima = explorador.getMaxEnergia();
        const energiaRecuperada = Math.min(this.#bonusEnergia, energiaMaxima - energiaAnterior);
        
        // Usar método privado para modificar energía
        explorador._setEnergia(energiaAnterior + energiaRecuperada);
        
        return {
            success: true,
            mensaje: `${explorador.getNombre()} usó ${this.getNombre()} y recuperó ${energiaRecuperada} puntos de energía`,
            energiaRecuperada
        };
    }

    toJSON() {
        return {
            ...super.toJSON(),
            bonusEnergia: this.#bonusEnergia
        };
    }

    static fromJSON(data) {
        return new Energia(data);
    }
}
