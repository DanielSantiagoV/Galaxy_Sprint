// GestorCarrera: controla el bucle principal de la carrera (SRP: única responsabilidad)
import inquirer from 'inquirer';
import { elegirAccionAleatoria } from './GeneradorAcciones.js';

export class GestorCarrera {
    constructor({ jugador, ia, notificador, maxPlaneta = 5 }) {
        this.jugador = jugador;
        this.ia = ia;
        this.notificador = notificador;
        this.maxPlaneta = maxPlaneta;
    }

    async iniciar() {
        this.notificador.info('Iniciando Galaxy Sprint — Carrera interplanetaria 🚀\n');
        let ganador = null;
        let turno = 1;
        while (!ganador) {
            this.notificador.info(`--- Turno ${turno} ---`);
            // Mostrar estado
            this.notificador.mostrarEstado(this.jugador.estado(), this.ia.estado());

            // Turno del jugador - pedir acción
            const { accion } = await inquirer.prompt([{
                type: 'list',
                name: 'accion',
                message: `Elige acción (ener. ${this.jugador.getEnergia()})`,
                choices: [
                    { name: 'Avanzar (avanza 1, -2 energía)', value: 'Avanzar' },
                    { name: 'Descansar (recupera 3 energía)', value: 'Descansar' },
                    { name: 'Sprint (avanza 2, -4 energía)', value: 'Sprint' },
                ]
            }]);

            // Ejecutar acción del jugador
            const resJugador = this._ejecutarAccion(this.jugador, accion);
            if (!resJugador.success) this.notificador.warn(`Jugador: ${resJugador.reason}`);

            // Chequear ganador
            if (this.jugador.getPosicion() >= this.maxPlaneta) {
                ganador = { tipo: 'Jugador', nombre: this.jugador.getNombre() };
                break;
            }

            // Turno IA
            const accionIA = elegirAccionAleatoria();
            const resIA = this._ejecutarAccion(this.ia, accionIA);
            this.notificador.info(`IA (${this.ia.getNombre()}) eligió: ${accionIA}`);
            if (!resIA.success) this.notificador.warn(`IA: ${resIA.reason}`);

            // Chequear ganador IA
            if (this.ia.getPosicion() >= this.maxPlaneta) {
                ganador = { tipo: 'IA', nombre: this.ia.getNombre() };
                break;
            }

            turno++;
        }

        // Resultado
        if (ganador.tipo === 'Jugador') {
            this.notificador.success(`¡Ganaste! ${ganador.nombre} llegó al planeta ${this.maxPlaneta} primero 🚀`);
        } else {
            this.notificador.error(`Perdiste. ${ganador.nombre} (IA) llegó al planeta ${this.maxPlaneta} primero.`);
        }

        // Resumen final
        this.notificador.info('\n--- Resumen final ---');
        this.notificador.info(`${this.jugador.getNombre()} — Planeta: ${this.jugador.getPosicion()} | Energía: ${this.jugador.getEnergia()}`);
        this.notificador.info(`${this.ia.getNombre()} — Planeta: ${this.ia.getPosicion()} | Energía: ${this.ia.getEnergia()}`);
        return ganador;
    }

    _ejecutarAccion(expl, accion) {
        // Respetamos la interfaz públicamente disponible (LSP, DIP)
        switch (accion) {
            case 'Avanzar': return expl.avanzar();
            case 'Sprint': return expl.sprint();
            case 'Descansar': return expl.descansar();
            default: return { success: false, reason: 'Acción desconocida' };
        }
    }
}
