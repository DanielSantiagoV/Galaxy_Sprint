/**
 * GestorCarrera.js
 * 
 * Clase responsable de manejar el sistema original de carrera espacial.
 * Este archivo es un remanente del sistema original y se mantiene para
 * compatibilidad, aunque el sistema principal ahora usa GestorBatalla.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

// Importaciones de librerías externas
import inquirer from 'inquirer'; // Para menús interactivos
import { elegirAccionAleatoria } from './GeneradorAcciones.js'; // Función de IA simple

/**
 * Clase GestorCarrera - Maneja el sistema de carrera espacial original
 * 
 * Aplica principios SOLID:
 * - SRP: Solo maneja carreras espaciales
 * - DIP: Depende de abstracciones (notificador)
 * - LSP: Usa exploradores de forma intercambiable
 */
export class GestorCarrera {
    /**
     * Constructor de la clase GestorCarrera
     * 
     * @param {Object} params - Parámetros de inicialización
     * @param {Explorador} params.jugador - Personaje del jugador
     * @param {Explorador} params.ia - Personaje de la IA
     * @param {INotificador} params.notificador - Servicio de notificaciones
     * @param {number} params.maxPlaneta - Planeta objetivo (default: 5)
     */
    constructor({ jugador, ia, notificador, maxPlaneta = 5 }) {
        this.jugador = jugador;           // Almacena referencia al jugador
        this.ia = ia;                     // Almacena referencia a la IA
        this.notificador = notificador;   // Servicio de notificaciones (DIP)
        this.maxPlaneta = maxPlaneta;     // Planeta objetivo de la carrera
    }

    /**
     * Inicia el flujo principal de la carrera espacial
     * 
     * Coordina el bucle de turnos hasta que alguien llegue al planeta objetivo.
     * Aplica el principio SRP al manejar únicamente la coordinación de la carrera.
     * 
     * @returns {Object} Objeto con información del ganador
     */
    async iniciar() {
        // Mostrar mensaje de inicio
        this.notificador.info('Iniciando Galaxy Sprint — Carrera interplanetaria 🚀\n');
        
        let ganador = null; // Variable para almacenar el ganador
        let turno = 1;      // Contador de turnos
        
        // Bucle principal de la carrera
        while (!ganador) {
            // Mostrar información del turno actual
            this.notificador.info(`--- Turno ${turno} ---`);
            
            // Mostrar estado actual de ambos exploradores
            this.notificador.mostrarEstado(this.jugador.estado(), this.ia.estado());

            // Turno del jugador - solicitar acción
            const { accion } = await inquirer.prompt([{
                type: 'list',                    // Tipo de menú: lista desplegable
                name: 'accion',                  // Nombre del campo de respuesta
                message: `Elige acción (ener. ${this.jugador.getEnergia()})`, // Mensaje con energía actual
                choices: [
                    { name: 'Avanzar (avanza 1, -2 energía)', value: 'Avanzar' },
                    { name: 'Descansar (recupera 3 energía)', value: 'Descansar' },
                    { name: 'Sprint (avanza 2, -4 energía)', value: 'Sprint' },
                ]
            }]);

            // Ejecutar acción del jugador
            const resJugador = this._ejecutarAccion(this.jugador, accion);
            if (!resJugador.success) {
                this.notificador.warn(`Jugador: ${resJugador.reason}`);
            }

            // Verificar si el jugador ganó
            if (this.jugador.getPosicion() >= this.maxPlaneta) {
                ganador = { tipo: 'Jugador', nombre: this.jugador.getNombre() };
                break; // Salir del bucle
            }

            // Turno de la IA - selección automática
            const accionIA = elegirAccionAleatoria(); // IA elige acción aleatoria
            const resIA = this._ejecutarAccion(this.ia, accionIA);
            this.notificador.info(`IA (${this.ia.getNombre()}) eligió: ${accionIA}`);
            if (!resIA.success) {
                this.notificador.warn(`IA: ${resIA.reason}`);
            }

            // Verificar si la IA ganó
            if (this.ia.getPosicion() >= this.maxPlaneta) {
                ganador = { tipo: 'IA', nombre: this.ia.getNombre() };
                break; // Salir del bucle
            }

            turno++; // Incrementar contador de turnos
        }

        // Mostrar resultado de la carrera
        if (ganador.tipo === 'Jugador') {
            this.notificador.success(`¡Ganaste! ${ganador.nombre} llegó al planeta ${this.maxPlaneta} primero 🚀`);
        } else {
            this.notificador.error(`Perdiste. ${ganador.nombre} (IA) llegó al planeta ${this.maxPlaneta} primero.`);
        }

        // Mostrar resumen final de la carrera
        this.notificador.info('\n--- Resumen final ---');
        this.notificador.info(`${this.jugador.getNombre()} — Planeta: ${this.jugador.getPosicion()} | Energía: ${this.jugador.getEnergia()}`);
        this.notificador.info(`${this.ia.getNombre()} — Planeta: ${this.ia.getPosicion()} | Energía: ${this.ia.getEnergia()}`);
        
        return ganador; // Retornar información del ganador
    }

    /**
     * Ejecuta una acción específica del explorador
     * 
     * Método privado que maneja la ejecución de acciones del sistema de carrera.
     * Aplica los principios LSP y DIP al usar la interfaz pública de los exploradores.
     * 
     * @private
     * @param {Explorador} expl - El explorador que ejecuta la acción
     * @param {string} accion - El nombre de la acción a ejecutar
     * @returns {Object} Resultado de la acción ejecutada
     */
    _ejecutarAccion(expl, accion) {
        // Switch para ejecutar la acción correspondiente
        // Respetamos la interfaz públicamente disponible (LSP, DIP)
        switch (accion) {
            case 'Avanzar': 
                return expl.avanzar();    // Ejecutar acción avanzar
            case 'Sprint': 
                return expl.sprint();     // Ejecutar acción sprint
            case 'Descansar': 
                return expl.descansar();  // Ejecutar acción descansar
            default: 
                // Acción no reconocida
                return { success: false, reason: 'Acción desconocida' };
        }
    }
}
