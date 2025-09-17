/**
 * GestorBatalla.js
 * 
 * Clase responsable de manejar el flujo completo de las batallas espaciales.
 * Aplica el principio SRP (Single Responsibility Principle) al tener una única
 * responsabilidad: coordinar y ejecutar batallas por turnos.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

// Importación de librerías externas
import inquirer from 'inquirer';                    // Para menús interactivos durante la batalla
import { INotificador } from '../interfaces/INotificador.js'; // Interfaz para notificaciones (DIP)

/**
 * Clase GestorBatalla - Maneja el sistema de batallas por turnos
 * 
 * Aplica principios SOLID:
 * - SRP: Solo maneja batallas
 * - DIP: Depende de abstracciones (INotificador)
 * - OCP: Extensible para nuevas acciones sin modificar código existente
 */
export class GestorBatalla {
    /**
     * Constructor de la clase GestorBatalla
     * 
     * @param {Object} params - Parámetros de inicialización
     * @param {Explorador} params.jugador - Personaje del jugador
     * @param {Explorador} params.enemigo - Personaje enemigo
     * @param {INotificador} params.notificador - Servicio de notificaciones
     */
    constructor({ jugador, enemigo, notificador }) {
        this.jugador = jugador;           // Almacena referencia al personaje del jugador
        this.enemigo = enemigo;           // Almacena referencia al personaje enemigo
        this.notificador = notificador;   // Servicio para mostrar mensajes (DIP)
        this.turno = 1;                   // Contador de turnos, inicia en 1
        this.ganador = null;              // Almacena el ganador cuando se determine
    }

    /**
     * Inicia el flujo principal de la batalla
     * 
     * Coordina todo el proceso de batalla desde el inicio hasta determinar un ganador.
     * Aplica el principio SRP al manejar únicamente la coordinación de la batalla.
     * 
     * @returns {Object} Objeto con información del ganador
     */
    async iniciar() {
        // Mostrar mensaje de inicio de batalla
        this.notificador.info('🚀 Iniciando batalla espacial! 🚀\n');
        
        // Determinar el orden de turnos basado en la velocidad de los combatientes
        this.ordenTurnos = this.determinarOrdenTurnos();
        
        // Bucle principal de la batalla - continúa hasta que haya un ganador
        while (!this.ganador) {
            // Mostrar información del turno actual
            this.notificador.info(`--- Turno ${this.turno} ---`);
            this.mostrarEstado(); // Mostrar estado actual de ambos combatientes
            
            // Ejecutar turnos en orden de velocidad (el más rápido actúa primero)
            for (const combatiente of this.ordenTurnos) {
                // Salir del bucle si ya hay un ganador
                if (this.ganador) break;
                
                // Determinar si es turno del jugador o del enemigo
                if (combatiente === this.jugador) {
                    await this.turnoJugador(); // Turno interactivo del jugador
                } else {
                    this.turnoEnemigo(); // Turno automático del enemigo
                }
                
                // Verificar si alguien murió después de cada acción
                this.verificarGanador();
            }
            
            // Incrementar contador de turnos
            this.turno++;
        }
        
        // Mostrar resultado final de la batalla
        this.mostrarResultado();
        return this.ganador; // Retornar información del ganador
    }

    /**
     * Determina el orden de turnos basado en la velocidad de los combatientes
     * 
     * El combatiente con mayor velocidad actúa primero. En caso de empate,
     * el jugador tiene prioridad.
     * 
     * @returns {Array} Array con el orden de turnos [primero, segundo]
     */
    determinarOrdenTurnos() {
        // Comparar velocidades para determinar quién actúa primero
        if (this.jugador.getVelocidad() >= this.enemigo.getVelocidad()) {
            return [this.jugador, this.enemigo]; // Jugador primero
        } else {
            return [this.enemigo, this.jugador]; // Enemigo primero
        }
    }

    /**
     * Maneja el turno del jugador (interactivo)
     * 
     * Permite al jugador seleccionar una acción de las disponibles
     * y la ejecuta contra el enemigo.
     */
    async turnoJugador() {
        // Obtener todas las acciones disponibles para el jugador
        const acciones = this.obtenerAccionesDisponibles(this.jugador);
        
        // Mostrar menú interactivo para que el jugador elija su acción
        const { accion } = await inquirer.prompt([{
            type: 'list',                    // Tipo de menú: lista desplegable
            name: 'accion',                  // Nombre del campo de respuesta
            message: `Elige tu acción (Vida: ${this.jugador.getVida()}/${this.jugador.getMaxVida()}, Energía: ${this.jugador.getEnergia()}/${this.jugador.getMaxEnergia()})`, // Mensaje con estado actual
            choices: acciones                // Opciones disponibles
        }]);

        // Ejecutar la acción seleccionada por el jugador
        await this.ejecutarAccion(this.jugador, this.enemigo, accion);
    }

    /**
     * Maneja el turno del enemigo (automático)
     * 
     * La IA selecciona automáticamente una acción basada en su algoritmo
     * y la ejecuta contra el jugador.
     */
    turnoEnemigo() {
        // Obtener todas las acciones disponibles para el enemigo
        const acciones = this.obtenerAccionesDisponibles(this.enemigo);
        
        // La IA elige una acción automáticamente
        const accion = this.elegirAccionIA(acciones);
        
        // Informar al jugador qué acción eligió el enemigo
        this.notificador.info(`${this.enemigo.getNombre()} eligió: ${accion.name}`);
        
        // Ejecutar la acción del enemigo contra el jugador
        this.ejecutarAccion(this.enemigo, this.jugador, accion.value);
    }

    /**
     * Obtiene todas las acciones disponibles para un combatiente
     * 
     * Aplica el principio OCP (Open/Closed Principle) al permitir añadir
     * nuevas clases y habilidades sin modificar esta función.
     * 
     * @param {Explorador} combatiente - El personaje para el cual obtener acciones
     * @returns {Array} Array de objetos con las acciones disponibles
     */
    obtenerAccionesDisponibles(combatiente) {
        // Acciones básicas disponibles para todos los combatientes
        const acciones = [
            { name: 'Atacar (5 energía)', value: 'atacar' },           // Ataque básico
            { name: 'Descansar (recupera 15 energía)', value: 'descansar' } // Recuperar energía
        ];

        // Añadir habilidades especiales según la clase del combatiente
        // Humano: Ataque Doble (requiere 8 energía)
        if (combatiente.getClase() === 'Humano' && combatiente.getEnergia() >= 8) {
            acciones.push({ name: 'Ataque Doble (8 energía)', value: 'ataqueDoble' });
        }
        
        // IA: Ataque de Precisión (requiere 6 energía)
        if (combatiente.getClase() === 'IA' && combatiente.getEnergia() >= 6) {
            acciones.push({ name: 'Ataque de Precisión (6 energía)', value: 'ataquePrecision' });
        }
        
        // Guerrero: Golpe Devastador (requiere 10 energía)
        if (combatiente.getClase() === 'Guerrero' && combatiente.getEnergia() >= 10) {
            acciones.push({ name: 'Golpe Devastador (10 energía)', value: 'golpeDevastador' });
        }
        
        // Mago: Bola de Fuego y Curar (requieren diferentes cantidades de energía)
        if (combatiente.getClase() === 'Mago') {
            if (combatiente.getEnergia() >= 12) {
                acciones.push({ name: 'Bola de Fuego (12 energía)', value: 'bolaFuego' });
            }
            if (combatiente.getEnergia() >= 8) {
                acciones.push({ name: 'Curar (8 energía)', value: 'curar' });
            }
        }
        
        // Arquero: Lluvia de Flechas y Flecha Penetrante
        if (combatiente.getClase() === 'Arquero') {
            if (combatiente.getEnergia() >= 9) {
                acciones.push({ name: 'Lluvia de Flechas (9 energía)', value: 'lluviaFlechas' });
            }
            if (combatiente.getEnergia() >= 7) {
                acciones.push({ name: 'Flecha Penetrante (7 energía)', value: 'flechaPenetrante' });
            }
        }

        // Añadir opción de usar items si el combatiente tiene inventario
        if (combatiente.getInventario().length > 0) {
            acciones.push({ name: 'Usar item del inventario', value: 'usarItem' });
        }

        return acciones; // Retornar lista completa de acciones disponibles
    }

    /**
     * Algoritmo de IA para elegir acciones automáticamente
     * 
     * Implementa una IA simple que prioriza ataques sobre habilidades defensivas.
     * Aplica el principio SRP al manejar únicamente la lógica de selección de IA.
     * 
     * @param {Array} acciones - Lista de acciones disponibles
     * @returns {Object} Acción seleccionada por la IA
     */
    elegirAccionIA(acciones) {
        // Categorizar acciones por tipo para la toma de decisiones
        // Filtrar acciones de ataque (incluye todas las variantes de ataque)
        const ataques = acciones.filter(a => 
            a.value.includes('atacar') || 
            a.value.includes('Ataque') || 
            a.value.includes('Golpe') || 
            a.value.includes('Bola') || 
            a.value.includes('Lluvia') || 
            a.value.includes('Flecha')
        );
        
        // Filtrar habilidades defensivas (como curar)
        const habilidades = acciones.filter(a => a.value === 'curar');
        
        // Filtrar acción de descansar
        const descansar = acciones.filter(a => a.value === 'descansar');
        
        // Lógica de decisión de la IA con probabilidades
        if (ataques.length > 0 && Math.random() < 0.7) {
            // 70% de probabilidad de elegir un ataque si hay ataques disponibles
            return ataques[Math.floor(Math.random() * ataques.length)];
        } else if (habilidades.length > 0 && Math.random() < 0.3) {
            // 30% de probabilidad de usar habilidades defensivas
            return habilidades[0];
        } else {
            // Fallback: descansar o cualquier acción disponible
            return descansar[0] || acciones[0];
        }
    }

    /**
     * Ejecuta una acción específica del combatiente
     * 
     * Aplica el principio OCP al permitir añadir nuevas acciones sin modificar
     * esta función, solo extendiendo el switch.
     * 
     * @param {Explorador} atacante - El personaje que ejecuta la acción
     * @param {Explorador} objetivo - El personaje objetivo de la acción
     * @param {string} accion - El nombre de la acción a ejecutar
     */
    async ejecutarAccion(atacante, objetivo, accion) {
        let resultado; // Variable para almacenar el resultado de la acción
        
        // Switch para ejecutar la acción correspondiente
        switch (accion) {
            case 'atacar':
                resultado = atacante.atacar(objetivo); // Ataque básico
                break;
            case 'descansar':
                resultado = atacante.descansar(); // Recuperar energía
                break;
            case 'ataqueDoble':
                resultado = atacante.ataqueDoble(objetivo); // Habilidad especial Humano
                break;
            case 'ataquePrecision':
                resultado = atacante.ataquePrecision(objetivo); // Habilidad especial IA
                break;
            case 'golpeDevastador':
                resultado = atacante.golpeDevastador(objetivo); // Habilidad especial Guerrero
                break;
            case 'bolaFuego':
                resultado = atacante.bolaFuego(objetivo); // Habilidad especial Mago
                break;
            case 'curar':
                resultado = atacante.curar(); // Habilidad de curación Mago
                break;
            case 'lluviaFlechas':
                resultado = atacante.lluviaFlechas(objetivo); // Habilidad especial Arquero
                break;
            case 'flechaPenetrante':
                resultado = atacante.flechaPenetrante(objetivo); // Habilidad especial Arquero
                break;
            case 'usarItem':
                resultado = await this.usarItem(atacante); // Usar item del inventario
                break;
            default:
                // Acción no reconocida
                resultado = { success: false, reason: 'Acción desconocida' };
        }

        // Manejar el resultado de la acción
        if (!resultado.success) {
            // Mostrar advertencia si la acción falló
            this.notificador.warn(`${atacante.getNombre()}: ${resultado.reason}`);
        } else {
            // Mostrar resultado exitoso de la acción
            this.mostrarResultadoAccion(atacante, objetivo, resultado);
        }
    }

    /**
     * Maneja el uso de items del inventario durante la batalla
     * 
     * Permite al combatiente seleccionar y usar un item de su inventario.
     * Aplica el principio SRP al manejar únicamente la lógica de uso de items.
     * 
     * @param {Explorador} combatiente - El personaje que va a usar el item
     * @returns {Object} Resultado del uso del item
     */
    async usarItem(combatiente) {
        // Obtener el inventario del combatiente
        const inventario = combatiente.getInventario();
        
        // Validar que tenga items disponibles
        if (inventario.length === 0) {
            return { success: false, reason: 'No tienes items en el inventario' };
        }

        // Crear opciones para el menú de selección de items
        const opciones = inventario.map((item, index) => ({
            name: `${item.getNombre()} - ${item.getDescripcion()}`, // Mostrar nombre y descripción
            value: index // Usar índice como valor
        }));

        // Mostrar menú para seleccionar item
        const { itemIndex } = await inquirer.prompt([{
            type: 'list',                    // Tipo de menú: lista desplegable
            name: 'itemIndex',              // Nombre del campo de respuesta
            message: 'Selecciona un item para usar:', // Mensaje del menú
            choices: opciones               // Opciones disponibles
        }]);

        // Usar el item seleccionado y retornar el resultado
        return combatiente.usarItem(parseInt(itemIndex));
    }

    /**
     * Muestra el resultado de una acción ejecutada
     * 
     * Formatea y muestra el resultado de la acción de manera apropiada
     * según el tipo de resultado obtenido.
     * 
     * @param {Explorador} atacante - El personaje que ejecutó la acción
     * @param {Explorador} objetivo - El personaje objetivo (si aplica)
     * @param {Object} resultado - El resultado de la acción ejecutada
     */
    mostrarResultadoAccion(atacante, objetivo, resultado) {
        if (resultado.daño) {
            // Mostrar resultado de ataque con daño causado
            this.notificador.info(`${atacante.getNombre()} usó ${resultado.accion} y causó ${resultado.daño} de daño a ${objetivo.getNombre()}`);
        } else if (resultado.curacion) {
            // Mostrar resultado de curación
            this.notificador.success(`${atacante.getNombre()} se curó ${resultado.curacion} puntos de vida`);
        } else if (resultado.recupera) {
            // Mostrar resultado de descanso
            this.notificador.info(`${atacante.getNombre()} descansó y recuperó ${resultado.recupera} energía`);
        } else if (resultado.mensaje) {
            // Mostrar mensaje personalizado del resultado
            this.notificador.info(resultado.mensaje);
        }
    }

    /**
     * Verifica si hay un ganador en la batalla
     * 
     * Comprueba el estado de vida de ambos combatientes y determina
     * si alguno ha sido derrotado. Si el jugador gana, le otorga experiencia.
     */
    verificarGanador() {
        // Verificar si el jugador murió
        if (!this.jugador.estaVivo()) {
            this.ganador = { tipo: 'Enemigo', nombre: this.enemigo.getNombre() };
        } 
        // Verificar si el enemigo murió
        else if (!this.enemigo.estaVivo()) {
            this.ganador = { tipo: 'Jugador', nombre: this.jugador.getNombre() };
            
            // El jugador gana experiencia al derrotar enemigos
            const subioNivel = this.jugador.ganarExperiencia(50);
            if (subioNivel) {
                // Notificar si el jugador subió de nivel
                this.notificador.success(`¡${this.jugador.getNombre()} subió al nivel ${this.jugador.getNivel()}!`);
            }
        }
    }

    /**
     * Muestra el estado actual de ambos combatientes
     * 
     * Delega la responsabilidad de mostrar el estado al notificador,
     * aplicando el principio SRP.
     */
    mostrarEstado() {
        this.notificador.mostrarEstado(this.jugador.estado(), this.enemigo.estado());
    }

    /**
     * Muestra el resultado final de la batalla
     * 
     * Presenta el resultado de la batalla y un resumen final
     * del estado de ambos combatientes.
     */
    mostrarResultado() {
        if (this.ganador.tipo === 'Jugador') {
            // Mostrar mensaje de victoria
            this.notificador.success(`🎉 ¡Victoria! ${this.ganador.nombre} derrotó a ${this.enemigo.getNombre()}! 🎉`);
        } else {
            // Mostrar mensaje de derrota
            this.notificador.error(`💀 Derrota. ${this.ganador.nombre} te derrotó. 💀`);
        }
        
        // Mostrar resumen final de la batalla
        this.notificador.info('\n--- Resumen de la batalla ---');
        this.mostrarEstado(); // Mostrar estado final de ambos combatientes
    }
}
