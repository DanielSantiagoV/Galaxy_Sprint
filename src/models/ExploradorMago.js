import { Explorador } from './Explorador.js';

export class ExploradorMago extends Explorador {
    constructor(opts) { 
        super({
            ...opts,
            clase: 'Mago',
            vida: 80,
            maxVida: 80,
            energia: 100,
            maxEnergia: 100,
            ataque: 15,
            defensa: 4,
            velocidad: 6
        });
    }

    // Habilidad especial: Bola de fuego
    bolaFuego(enemigo) {
        if (this.getEnergia() < 12) return { success: false, reason: 'No energy' };
        
        const daño = Math.max(1, (this.getAtaque() * 1.8) - Math.floor(enemigo.getDefensa() * 0.5) + Math.floor(Math.random() * 12));
        enemigo.recibirDaño(daño);
        
        this._setEnergia(this.getEnergia() - 12);
        
        return { 
            success: true, 
            accion: 'Bola de Fuego', 
            daño,
            energiaUsada: 12 
        };
    }

    // Habilidad especial: Curar
    curar() {
        if (this.getEnergia() < 8) return { success: false, reason: 'No energy' };
        
        const curacion = Math.floor(this.getMaxVida() * 0.3);
        const curacionReal = this.curar(curacion);
        
        this._setEnergia(this.getEnergia() - 8);
        
        return { 
            success: true, 
            accion: 'Curar', 
            curacion: curacionReal,
            energiaUsada: 8 
        };
    }

    // Método privado para modificar energía
    _setEnergia(valor) {
        this.energia = Math.min(this.getMaxEnergia(), Math.max(0, valor));
    }
}
