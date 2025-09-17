import { Explorador } from './Explorador.js';

export class ExploradorArquero extends Explorador {
    constructor(opts) { 
        super({
            ...opts,
            clase: 'Arquero',
            vida: 100,
            maxVida: 100,
            energia: 60,
            maxEnergia: 60,
            ataque: 14,
            defensa: 6,
            velocidad: 12
        });
    }

    // Habilidad especial: Lluvia de flechas
    lluviaFlechas(enemigo) {
        if (this.getEnergia() < 9) return { success: false, reason: 'No energy' };
        
        const daño1 = Math.max(1, this.getAtaque() - enemigo.getDefensa() + Math.floor(Math.random() * 4));
        const daño2 = Math.max(1, this.getAtaque() - enemigo.getDefensa() + Math.floor(Math.random() * 4));
        const daño3 = Math.max(1, this.getAtaque() - enemigo.getDefensa() + Math.floor(Math.random() * 4));
        
        enemigo.recibirDaño(daño1);
        enemigo.recibirDaño(daño2);
        enemigo.recibirDaño(daño3);
        
        this._setEnergia(this.getEnergia() - 9);
        
        return { 
            success: true, 
            accion: 'Lluvia de Flechas', 
            daño: daño1 + daño2 + daño3,
            energiaUsada: 9 
        };
    }

    // Habilidad especial: Flecha penetrante
    flechaPenetrante(enemigo) {
        if (this.getEnergia() < 7) return { success: false, reason: 'No energy' };
        
        const daño = Math.max(1, (this.getAtaque() * 1.5) - Math.floor(enemigo.getDefensa() * 0.3) + Math.floor(Math.random() * 6));
        enemigo.recibirDaño(daño);
        
        this._setEnergia(this.getEnergia() - 7);
        
        return { 
            success: true, 
            accion: 'Flecha Penetrante', 
            daño,
            energiaUsada: 7 
        };
    }

    // Método privado para modificar energía
    _setEnergia(valor) {
        this.energia = Math.min(this.getMaxEnergia(), Math.max(0, valor));
    }
}
