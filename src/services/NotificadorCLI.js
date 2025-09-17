/**
 * NotificadorCLI.js
 * 
 * Implementación concreta del sistema de notificaciones para consola.
 * Aplica el principio SRP (Single Responsibility Principle) al tener una única
 * responsabilidad: mostrar mensajes formateados en la consola.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

// Importaciones de librerías externas
import chalk from 'chalk'; // Para colorear texto en la consola
import { INotificador } from '../interfaces/INotificador.js'; // Interfaz base (DIP)

/**
 * Clase NotificadorCLI - Implementa notificaciones para consola
 * 
 * Aplica principios SOLID:
 * - SRP: Solo maneja notificaciones de consola
 * - LSP: Implementa correctamente INotificador
 * - DIP: Depende de abstracción (INotificador)
 */
export class NotificadorCLI extends INotificador {
    /**
     * Muestra un mensaje informativo en la consola
     * 
     * @param {string} text - Texto a mostrar
     */
    info(text) { 
        console.log(text); // Mostrar texto normal
    }

    /**
     * Muestra un mensaje de éxito en verde
     * 
     * @param {string} text - Texto a mostrar
     */
    success(text) { 
        console.log(chalk.green(text)); // Mostrar texto en verde
    }

    /**
     * Muestra un mensaje de advertencia en amarillo
     * 
     * @param {string} text - Texto a mostrar
     */
    warn(text) { 
        console.log(chalk.yellow(text)); // Mostrar texto en amarillo
    }

    /**
     * Muestra un mensaje de error en rojo
     * 
     * @param {string} text - Texto a mostrar
     */
    error(text) { 
        console.log(chalk.red(text)); // Mostrar texto en rojo
    }

    /**
     * Muestra el estado detallado de ambos combatientes
     * 
     * Formatea y muestra información completa del estado de la batalla
     * incluyendo estadísticas de ambos combatientes.
     * 
     * @param {Object} estadoJugador - Estado del personaje del jugador
     * @param {Object} estadoEnemigo - Estado del personaje enemigo
     */
    mostrarEstado(estadoJugador, estadoEnemigo) {
        // Mostrar encabezado del estado
        console.log('--- Estado de la batalla ---');
        
        // Mostrar información del jugador
        console.log(`${estadoJugador.nombre} (${estadoJugador.clase} Nv.${estadoJugador.nivel})`);
        console.log(`  Vida: ${estadoJugador.vida}/${estadoJugador.maxVida} | Energía: ${estadoJugador.energia}/${estadoJugador.maxEnergia}`);
        console.log(`  Ataque: ${estadoJugador.ataque} | Defensa: ${estadoJugador.defensa} | Velocidad: ${estadoJugador.velocidad}`);
        console.log(`  Experiencia: ${estadoJugador.experiencia}/${estadoJugador.nivel * 100} | Items: ${estadoJugador.inventario}`);
        
        // Mostrar información del enemigo
        console.log(`\n${estadoEnemigo.nombre} (${estadoEnemigo.clase} Nv.${estadoEnemigo.nivel})`);
        console.log(`  Vida: ${estadoEnemigo.vida}/${estadoEnemigo.maxVida} | Energía: ${estadoEnemigo.energia}/${estadoEnemigo.maxEnergia}`);
        console.log(`  Ataque: ${estadoEnemigo.ataque} | Defensa: ${estadoEnemigo.defensa} | Velocidad: ${estadoEnemigo.velocidad}`);
        
        // Mostrar pie del estado
        console.log('-----------------------------\n');
    }
}
