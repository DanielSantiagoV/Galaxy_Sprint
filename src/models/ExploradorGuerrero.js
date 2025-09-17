import { Explorador } from './Explorador.js';

export class ExploradorGuerrero extends Explorador {
    constructor(opts) { 
        super({
            ...opts,
            clase: 'Guerrero',
            vida: 150,
            maxVida: 150,
            energia: 40,
            maxEnergia: 40,
            ataque: 18,
            defensa: 12,
            velocidad: 5
        });
    }

    // Habilidad especial: Golpe devastador
    golpeDevastador(enemigo) {
        if (this.getEnergia() < 10) return { success: false, reason: 'No energy' };
        
        const daño = Math.max(1, (this.getAtaque() * 2) - enemigo.getDefensa() + Math.floor(Math.random() * 10));
        enemigo.recibirDaño(daño);
        
        this._setEnergia(this.getEnergia() - 10);
        
        return { 
            success: true, 
            accion: 'Golpe Devastador', 
            daño,
            energiaUsada: 10 
        };
    }

    // Método privado para modificar energía
    _setEnergia(valor) {
        this.energia = Math.min(this.getMaxEnergia(), Math.max(0, valor));
    }
}
