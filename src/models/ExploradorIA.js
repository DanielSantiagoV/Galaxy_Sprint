import { Explorador } from './Explorador.js';

export class ExploradorIA extends Explorador {
    constructor(opts) { 
        super({
            ...opts,
            clase: 'IA',
            vida: 100,
            maxVida: 100,
            energia: 70,
            maxEnergia: 70,
            ataque: 10,
            defensa: 6,
            velocidad: 9
        });
    }

    // Habilidad especial: Ataque de precisión
    ataquePrecision(enemigo) {
        if (this.getEnergia() < 6) return { success: false, reason: 'No energy' };
        
        const daño = Math.max(1, (this.getAtaque() * 1.5) - enemigo.getDefensa() + Math.floor(Math.random() * 8));
        enemigo.recibirDaño(daño);
        
        this._setEnergia(this.getEnergia() - 6);
        
        return { 
            success: true, 
            accion: 'Ataque de Precisión', 
            daño,
            energiaUsada: 6 
        };
    }

    // Método privado para modificar energía (necesario para habilidades)
    _setEnergia(valor) {
        this.energia = Math.min(this.getMaxEnergia(), Math.max(0, valor));
    }
}
