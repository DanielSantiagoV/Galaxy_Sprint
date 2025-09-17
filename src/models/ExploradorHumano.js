/**
 * ExploradorHumano.js
 * 
 * Clase que representa un explorador humano con estadísticas equilibradas.
 * Extiende la clase base Explorador aplicando el principio OCP (Open/Closed Principle)
 * al permitir nuevas funcionalidades sin modificar la clase base.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

// Importación de la clase base
import { Explorador } from './Explorador.js';

/**
 * Clase ExploradorHumano - Representa un explorador de clase Humano
 * 
 * Aplica principios SOLID:
 * - SRP: Encapsula funcionalidades específicas del humano
 * - OCP: Extiende Explorador sin modificar la clase base
 * - LSP: Es completamente sustituible por Explorador
 * - ISP: Implementa interfaz específica para humanos
 */
export class ExploradorHumano extends Explorador {
    /**
     * Constructor de la clase ExploradorHumano
     * 
     * Inicializa un explorador humano con estadísticas equilibradas.
     * Los humanos son versátiles con buenas estadísticas en todos los aspectos.
     * 
     * @param {Object} opts - Opciones de inicialización del explorador
     */
    constructor(opts) { 
        // Llamar al constructor padre con estadísticas específicas del humano
        super({
            ...opts,                    // Pasar todas las opciones recibidas
            clase: 'Humano',            // Establecer clase como Humano
            vida: 120,                  // Vida moderada-alta
            maxVida: 120,               // Vida máxima
            energia: 60,                // Energía moderada
            maxEnergia: 60,             // Energía máxima
            ataque: 12,                 // Ataque moderado-alto
            defensa: 8,                 // Defensa moderada
            velocidad: 7                // Velocidad moderada
        });
    }

    /**
     * Habilidad especial: Ataque Doble
     * 
     * Permite al humano realizar dos ataques consecutivos en un solo turno.
     * Cada ataque tiene un daño ligeramente reducido pero el daño total es mayor.
     * 
     * @param {Explorador} enemigo - El enemigo a atacar
     * @returns {Object} Resultado del ataque doble
     */
    ataqueDoble(enemigo) {
        // Verificar si tiene suficiente energía para la habilidad especial
        if (this.getEnergia() < 8) {
            return { success: false, reason: 'No energy' };
        }
        
        // Calcular daño del primer ataque (con factor aleatorio reducido)
        const daño1 = Math.max(1, this.getAtaque() - enemigo.getDefensa() + Math.floor(Math.random() * 3));
        
        // Calcular daño del segundo ataque (con factor aleatorio reducido)
        const daño2 = Math.max(1, this.getAtaque() - enemigo.getDefensa() + Math.floor(Math.random() * 3));
        
        // Aplicar ambos ataques al enemigo
        enemigo.recibirDaño(daño1);
        enemigo.recibirDaño(daño2);
        
        // Consumir energía de la habilidad especial
        this._setEnergia(this.getEnergia() - 8);
        
        // Retornar resultado del ataque doble
        return { 
            success: true, 
            accion: 'Ataque Doble', 
            daño: daño1 + daño2,        // Daño total combinado
            energiaUsada: 8 
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
