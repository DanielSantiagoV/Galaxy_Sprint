import { Explorador } from './Explorador.js';

export class ExploradorHumano extends Explorador {
    constructor(opts) { 
        super({
            ...opts,
            clase: 'Humano',
            vida: 120,
            maxVida: 120,
            energia: 60,
            maxEnergia: 60,
            ataque: 12,
            defensa: 8,
            velocidad: 7
        });
    }

    // Habilidad especial: Ataque doble
    ataqueDoble(enemigo) {
        if (this.getEnergia() < 8) return { success: false, reason: 'No energy' };
        
        const daño1 = Math.max(1, this.getAtaque() - enemigo.getDefensa() + Math.floor(Math.random() * 3));
        const daño2 = Math.max(1, this.getAtaque() - enemigo.getDefensa() + Math.floor(Math.random() * 3));
        
        enemigo.recibirDaño(daño1);
        enemigo.recibirDaño(daño2);
        
        this._setEnergia(this.getEnergia() - 8);
        
        return { 
            success: true, 
            accion: 'Ataque Doble', 
            daño: daño1 + daño2,
            energiaUsada: 8 
        };
    }

    // Método privado para modificar energía (necesario para habilidades)
    _setEnergia(valor) {
        this.energia = Math.min(this.getMaxEnergia(), Math.max(0, valor));
    }
}
