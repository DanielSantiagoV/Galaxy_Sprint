import inquirer from 'inquirer';
import { INotificador } from '../interfaces/INotificador.js';

// Gestor de batallas espaciales (SRP - Single Responsibility Principle)
export class GestorBatalla {
    constructor({ jugador, enemigo, notificador }) {
        this.jugador = jugador;
        this.enemigo = enemigo;
        this.notificador = notificador;
        this.turno = 1;
        this.ganador = null;
    }

    async iniciar() {
        this.notificador.info('🚀 Iniciando batalla espacial! 🚀\n');
        
        // Determinar orden de turnos por velocidad
        this.ordenTurnos = this.determinarOrdenTurnos();
        
        while (!this.ganador) {
            this.notificador.info(`--- Turno ${this.turno} ---`);
            this.mostrarEstado();
            
            // Ejecutar turnos en orden de velocidad
            for (const combatiente of this.ordenTurnos) {
                if (this.ganador) break;
                
                if (combatiente === this.jugador) {
                    await this.turnoJugador();
                } else {
                    this.turnoEnemigo();
                }
                
                // Verificar si alguien murió
                this.verificarGanador();
            }
            
            this.turno++;
        }
        
        this.mostrarResultado();
        return this.ganador;
    }

    determinarOrdenTurnos() {
        if (this.jugador.getVelocidad() >= this.enemigo.getVelocidad()) {
            return [this.jugador, this.enemigo];
        } else {
            return [this.enemigo, this.jugador];
        }
    }

    async turnoJugador() {
        const acciones = this.obtenerAccionesDisponibles(this.jugador);
        
        const { accion } = await inquirer.prompt([{
            type: 'list',
            name: 'accion',
            message: `Elige tu acción (Vida: ${this.jugador.getVida()}/${this.jugador.getMaxVida()}, Energía: ${this.jugador.getEnergia()}/${this.jugador.getMaxEnergia()})`,
            choices: acciones
        }]);

        await this.ejecutarAccion(this.jugador, this.enemigo, accion);
    }

    turnoEnemigo() {
        const acciones = this.obtenerAccionesDisponibles(this.enemigo);
        const accion = this.elegirAccionIA(acciones);
        
        this.notificador.info(`${this.enemigo.getNombre()} eligió: ${accion.name}`);
        this.ejecutarAccion(this.enemigo, this.jugador, accion.value);
    }

    obtenerAccionesDisponibles(combatiente) {
        const acciones = [
            { name: 'Atacar (5 energía)', value: 'atacar' },
            { name: 'Descansar (recupera 15 energía)', value: 'descansar' }
        ];

        // Añadir habilidades especiales según la clase
        if (combatiente.getClase() === 'Humano' && combatiente.getEnergia() >= 8) {
            acciones.push({ name: 'Ataque Doble (8 energía)', value: 'ataqueDoble' });
        }
        
        if (combatiente.getClase() === 'IA' && combatiente.getEnergia() >= 6) {
            acciones.push({ name: 'Ataque de Precisión (6 energía)', value: 'ataquePrecision' });
        }
        
        if (combatiente.getClase() === 'Guerrero' && combatiente.getEnergia() >= 10) {
            acciones.push({ name: 'Golpe Devastador (10 energía)', value: 'golpeDevastador' });
        }
        
        if (combatiente.getClase() === 'Mago') {
            if (combatiente.getEnergia() >= 12) {
                acciones.push({ name: 'Bola de Fuego (12 energía)', value: 'bolaFuego' });
            }
            if (combatiente.getEnergia() >= 8) {
                acciones.push({ name: 'Curar (8 energía)', value: 'curar' });
            }
        }
        
        if (combatiente.getClase() === 'Arquero') {
            if (combatiente.getEnergia() >= 9) {
                acciones.push({ name: 'Lluvia de Flechas (9 energía)', value: 'lluviaFlechas' });
            }
            if (combatiente.getEnergia() >= 7) {
                acciones.push({ name: 'Flecha Penetrante (7 energía)', value: 'flechaPenetrante' });
            }
        }

        // Añadir opciones de inventario si tiene items
        if (combatiente.getInventario().length > 0) {
            acciones.push({ name: 'Usar item del inventario', value: 'usarItem' });
        }

        return acciones;
    }

    elegirAccionIA(acciones) {
        // IA simple: prioriza ataques, luego habilidades especiales, luego descansar
        const ataques = acciones.filter(a => a.value.includes('atacar') || a.value.includes('Ataque') || a.value.includes('Golpe') || a.value.includes('Bola') || a.value.includes('Lluvia') || a.value.includes('Flecha'));
        const habilidades = acciones.filter(a => a.value === 'curar');
        const descansar = acciones.filter(a => a.value === 'descansar');
        
        if (ataques.length > 0 && Math.random() < 0.7) {
            return ataques[Math.floor(Math.random() * ataques.length)];
        } else if (habilidades.length > 0 && Math.random() < 0.3) {
            return habilidades[0];
        } else {
            return descansar[0] || acciones[0];
        }
    }

    async ejecutarAccion(atacante, objetivo, accion) {
        let resultado;
        
        switch (accion) {
            case 'atacar':
                resultado = atacante.atacar(objetivo);
                break;
            case 'descansar':
                resultado = atacante.descansar();
                break;
            case 'ataqueDoble':
                resultado = atacante.ataqueDoble(objetivo);
                break;
            case 'ataquePrecision':
                resultado = atacante.ataquePrecision(objetivo);
                break;
            case 'golpeDevastador':
                resultado = atacante.golpeDevastador(objetivo);
                break;
            case 'bolaFuego':
                resultado = atacante.bolaFuego(objetivo);
                break;
            case 'curar':
                resultado = atacante.curar();
                break;
            case 'lluviaFlechas':
                resultado = atacante.lluviaFlechas(objetivo);
                break;
            case 'flechaPenetrante':
                resultado = atacante.flechaPenetrante(objetivo);
                break;
            case 'usarItem':
                resultado = await this.usarItem(atacante);
                break;
            default:
                resultado = { success: false, reason: 'Acción desconocida' };
        }

        if (!resultado.success) {
            this.notificador.warn(`${atacante.getNombre()}: ${resultado.reason}`);
        } else {
            this.mostrarResultadoAccion(atacante, objetivo, resultado);
        }
    }

    async usarItem(combatiente) {
        const inventario = combatiente.getInventario();
        if (inventario.length === 0) {
            return { success: false, reason: 'No tienes items en el inventario' };
        }

        const opciones = inventario.map((item, index) => ({
            name: `${item.getNombre()} - ${item.getDescripcion()}`,
            value: index
        }));

        const { itemIndex } = await inquirer.prompt([{
            type: 'list',
            name: 'itemIndex',
            message: 'Selecciona un item para usar:',
            choices: opciones
        }]);

        return combatiente.usarItem(parseInt(itemIndex));
    }

    mostrarResultadoAccion(atacante, objetivo, resultado) {
        if (resultado.daño) {
            this.notificador.info(`${atacante.getNombre()} usó ${resultado.accion} y causó ${resultado.daño} de daño a ${objetivo.getNombre()}`);
        } else if (resultado.curacion) {
            this.notificador.success(`${atacante.getNombre()} se curó ${resultado.curacion} puntos de vida`);
        } else if (resultado.recupera) {
            this.notificador.info(`${atacante.getNombre()} descansó y recuperó ${resultado.recupera} energía`);
        } else if (resultado.mensaje) {
            this.notificador.info(resultado.mensaje);
        }
    }

    verificarGanador() {
        if (!this.jugador.estaVivo()) {
            this.ganador = { tipo: 'Enemigo', nombre: this.enemigo.getNombre() };
        } else if (!this.enemigo.estaVivo()) {
            this.ganador = { tipo: 'Jugador', nombre: this.jugador.getNombre() };
            // El jugador gana experiencia al derrotar enemigos
            const subioNivel = this.jugador.ganarExperiencia(50);
            if (subioNivel) {
                this.notificador.success(`¡${this.jugador.getNombre()} subió al nivel ${this.jugador.getNivel()}!`);
            }
        }
    }

    mostrarEstado() {
        this.notificador.mostrarEstado(this.jugador.estado(), this.enemigo.estado());
    }

    mostrarResultado() {
        if (this.ganador.tipo === 'Jugador') {
            this.notificador.success(`🎉 ¡Victoria! ${this.ganador.nombre} derrotó a ${this.enemigo.getNombre()}! 🎉`);
        } else {
            this.notificador.error(`💀 Derrota. ${this.ganador.nombre} te derrotó. 💀`);
        }
        
        this.notificador.info('\n--- Resumen de la batalla ---');
        this.mostrarEstado();
    }
}
