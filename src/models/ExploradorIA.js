/**
 * ExploradorIA.js
 * 
 * Clase que representa un explorador controlado por IA con estadísticas equilibradas.
 * Extiende la clase base Explorador aplicando el principio OCP (Open/Closed Principle)
 * al permitir nuevas funcionalidades sin modificar la clase base.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

// Importación de la clase base
import { Explorador } from './Explorador.js';

/**
 * Clase ExploradorIA - Representa un explorador de clase IA
 * 
 * Aplica principios SOLID:
 * - SRP: Encapsula funcionalidades específicas de la IA
 * - OCP: Extiende Explorador sin modificar la clase base
 * - LSP: Es completamente sustituible por Explorador
 * - ISP: Implementa interfaz específica para IA
 */
export class ExploradorIA extends Explorador {
    /**
     * Constructor de la clase ExploradorIA
     * 
     * Inicializa un explorador IA con estadísticas equilibradas.
     * Las IA son versátiles con buena energía y velocidad.
     * 
     * @param {Object} opts - Opciones de inicialización del explorador
     */
    constructor(opts) { 
        // Llamar al constructor padre con estadísticas específicas de la IA
        super({
            ...opts,                    // Pasar todas las opciones recibidas
            clase: 'IA',                // Establecer clase como IA
            vida: 100,                  // Vida moderada
            maxVida: 100,               // Vida máxima
            energia: 70,                // Energía alta
            maxEnergia: 70,             // Energía máxima
            ataque: 10,                 // Ataque equilibrado
            defensa: 6,                 // Defensa moderada
            velocidad: 9                // Velocidad alta
        });
    }

    /**
     * Habilidad especial: Ataque de Precisión
     * 
     * Permite a la IA realizar un ataque con mayor precisión y daño.
     * El ataque tiene un multiplicador de daño y mayor variabilidad.
     * 
     * @param {Explorador} enemigo - El enemigo a atacar
     * @returns {Object} Resultado del ataque de precisión
     */
    ataquePrecision(enemigo) {
        // Verificar si tiene suficiente energía para la habilidad especial
        if (this.getEnergia() < 6) {
            return { success: false, reason: 'No energy' };
        }
        
        // Calcular daño con multiplicador de precisión (1.5x) y mayor variabilidad
        const daño = Math.max(1, (this.getAtaque() * 1.5) - enemigo.getDefensa() + Math.floor(Math.random() * 8));
        
        // Aplicar daño al enemigo
        enemigo.recibirDaño(daño);
        
        // Consumir energía de la habilidad especial
        this._setEnergia(this.getEnergia() - 6);
        
        // Retornar resultado del ataque de precisión
        return { 
            success: true, 
            accion: 'Ataque de Precisión', 
            daño,
            energiaUsada: 6 
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
