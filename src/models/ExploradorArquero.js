/**
 * ExploradorArquero.js
 * 
 * Clase que representa un explorador arquero con estadísticas de velocidad.
 * Extiende la clase base Explorador aplicando el principio OCP (Open/Closed Principle)
 * al permitir nuevas funcionalidades sin modificar la clase base.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

// Importación de la clase base
import { Explorador } from './Explorador.js';

/**
 * Clase ExploradorArquero - Representa un explorador de clase Arquero
 * 
 * Aplica principios SOLID:
 * - SRP: Encapsula funcionalidades específicas del arquero
 * - OCP: Extiende Explorador sin modificar la clase base
 * - LSP: Es completamente sustituible por Explorador
 * - ISP: Implementa interfaz específica para arqueros
 */
export class ExploradorArquero extends Explorador {
    /**
     * Constructor de la clase ExploradorArquero
     * 
     * Inicializa un explorador arquero con estadísticas de velocidad.
     * Los arqueros tienen alta velocidad, buen ataque y estadísticas equilibradas.
     * 
     * @param {Object} opts - Opciones de inicialización del explorador
     */
    constructor(opts) { 
        // Llamar al constructor padre con estadísticas específicas del arquero
        super({
            ...opts,                    // Pasar todas las opciones recibidas
            clase: 'Arquero',           // Establecer clase como Arquero
            vida: 100,                  // Vida moderada
            maxVida: 100,               // Vida máxima
            energia: 60,                // Energía moderada
            maxEnergia: 60,             // Energía máxima
            ataque: 14,                 // Ataque moderado-alto
            defensa: 6,                 // Defensa moderada
            velocidad: 12               // Velocidad muy alta
        });
    }

    /**
     * Habilidad especial: Lluvia de Flechas
     * 
     * Permite al arquero realizar tres ataques consecutivos en un solo turno.
     * Cada flecha causa daño individual, pero el daño total es considerable.
     * 
     * @param {Explorador} enemigo - El enemigo a atacar
     * @returns {Object} Resultado de la lluvia de flechas
     */
    lluviaFlechas(enemigo) {
        // Verificar si tiene suficiente energía para la habilidad especial
        if (this.getEnergia() < 9) {
            return { success: false, reason: 'No energy' };
        }
        
        // Calcular daño de la primera flecha
        const daño1 = Math.max(1, this.getAtaque() - enemigo.getDefensa() + Math.floor(Math.random() * 4));
        
        // Calcular daño de la segunda flecha
        const daño2 = Math.max(1, this.getAtaque() - enemigo.getDefensa() + Math.floor(Math.random() * 4));
        
        // Calcular daño de la tercera flecha
        const daño3 = Math.max(1, this.getAtaque() - enemigo.getDefensa() + Math.floor(Math.random() * 4));
        
        // Aplicar los tres ataques al enemigo
        enemigo.recibirDaño(daño1);
        enemigo.recibirDaño(daño2);
        enemigo.recibirDaño(daño3);
        
        // Consumir energía de la habilidad especial
        this._setEnergia(this.getEnergia() - 9);
        
        // Retornar resultado de la lluvia de flechas
        return { 
            success: true, 
            accion: 'Lluvia de Flechas', 
            daño: daño1 + daño2 + daño3,    // Daño total combinado
            energiaUsada: 9 
        };
    }

    /**
     * Habilidad especial: Flecha Penetrante
     * 
     * Permite al arquero lanzar una flecha que ignora parcialmente
     * la defensa del enemigo y causa daño penetrante.
     * 
     * @param {Explorador} enemigo - El enemigo a atacar
     * @returns {Object} Resultado de la flecha penetrante
     */
    flechaPenetrante(enemigo) {
        // Verificar si tiene suficiente energía para la habilidad especial
        if (this.getEnergia() < 7) {
            return { success: false, reason: 'No energy' };
        }
        
        // Calcular daño penetrante con multiplicador (1.5x) y defensa reducida
        const daño = Math.max(1, (this.getAtaque() * 1.5) - Math.floor(enemigo.getDefensa() * 0.3) + Math.floor(Math.random() * 6));
        
        // Aplicar daño al enemigo
        enemigo.recibirDaño(daño);
        
        // Consumir energía de la habilidad especial
        this._setEnergia(this.getEnergia() - 7);
        
        // Retornar resultado de la flecha penetrante
        return { 
            success: true, 
            accion: 'Flecha Penetrante', 
            daño,
            energiaUsada: 7 
        };
    }

    /**
     * Método privado para modificar energía
     * 
     * Método auxiliar necesario para las habilidades especiales ya que
     * la energía es una propiedad privada de la clase base.
     * 
     * @private
     * @param {number} valor - Nuevo valor de energía
     */
    _setEnergia(valor) {
        // Establecer energía respetando los límites mínimo y máximo
        this.energia = Math.min(this.getMaxEnergia(), Math.max(0, valor));
    }
}
