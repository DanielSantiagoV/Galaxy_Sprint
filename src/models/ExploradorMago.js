/**
 * ExploradorMago.js
 * 
 * Clase que representa un explorador mago con estadísticas de hechicero.
 * Extiende la clase base Explorador aplicando el principio OCP (Open/Closed Principle)
 * al permitir nuevas funcionalidades sin modificar la clase base.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

// Importación de la clase base
import { Explorador } from './Explorador.js';

/**
 * Clase ExploradorMago - Representa un explorador de clase Mago
 * 
 * Aplica principios SOLID:
 * - SRP: Encapsula funcionalidades específicas del mago
 * - OCP: Extiende Explorador sin modificar la clase base
 * - LSP: Es completamente sustituible por Explorador
 * - ISP: Implementa interfaz específica para magos
 */
export class ExploradorMago extends Explorador {
    /**
     * Constructor de la clase ExploradorMago
     * 
     * Inicializa un explorador mago con estadísticas de hechicero.
     * Los magos tienen poca vida y defensa, pero mucha energía y ataque mágico.
     * 
     * @param {Object} opts - Opciones de inicialización del explorador
     */
    constructor(opts) { 
        // Llamar al constructor padre con estadísticas específicas del mago
        super({
            ...opts,                    // Pasar todas las opciones recibidas
            clase: 'Mago',              // Establecer clase como Mago
            vida: 80,                   // Vida baja (frágil)
            maxVida: 80,                // Vida máxima
            energia: 100,               // Energía muy alta
            maxEnergia: 100,            // Energía máxima
            ataque: 15,                 // Ataque alto (mágico)
            defensa: 4,                 // Defensa muy baja
            velocidad: 6                // Velocidad moderada
        });
    }

    /**
     * Habilidad especial: Bola de Fuego
     * 
     * Permite al mago lanzar una bola de fuego mágica que ignora parcialmente
     * la defensa del enemigo y causa daño mágico alto.
     * 
     * @param {Explorador} enemigo - El enemigo a atacar
     * @returns {Object} Resultado de la bola de fuego
     */
    bolaFuego(enemigo) {
        // Verificar si tiene suficiente energía para la habilidad especial
        if (this.getEnergia() < 12) {
            return { success: false, reason: 'No energy' };
        }
        
        // Calcular daño mágico con multiplicador alto (1.8x) y defensa reducida
        const daño = Math.max(1, (this.getAtaque() * 1.8) - Math.floor(enemigo.getDefensa() * 0.5) + Math.floor(Math.random() * 12));
        
        // Aplicar daño al enemigo
        enemigo.recibirDaño(daño);
        
        // Consumir energía de la habilidad especial
        this._setEnergia(this.getEnergia() - 12);
        
        // Retornar resultado de la bola de fuego
        return { 
            success: true, 
            accion: 'Bola de Fuego', 
            daño,
            energiaUsada: 12 
        };
    }

    /**
     * Habilidad especial: Curar
     * 
     * Permite al mago curarse a sí mismo usando energía mágica.
     * Restaura un porcentaje de la vida máxima del mago.
     * 
     * @returns {Object} Resultado de la curación
     */
    curar() {
        // Verificar si tiene suficiente energía para la habilidad especial
        if (this.getEnergia() < 8) {
            return { success: false, reason: 'No energy' };
        }
        
        // Calcular cantidad de curación (30% de la vida máxima)
        const curacion = Math.floor(this.getMaxVida() * 0.3);
        
        // Aplicar curación usando el método heredado
        const curacionReal = this.curar(curacion);
        
        // Consumir energía de la habilidad especial
        this._setEnergia(this.getEnergia() - 8);
        
        // Retornar resultado de la curación
        return { 
            success: true, 
            accion: 'Curar', 
            curacion: curacionReal,
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
