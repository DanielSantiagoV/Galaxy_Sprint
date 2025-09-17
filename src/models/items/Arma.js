/**
 * Arma.js
 * 
 * Clase que representa un arma equipable en el inventario.
 * Extiende la clase base Item aplicando el principio OCP (Open/Closed Principle)
 * al permitir nuevas funcionalidades sin modificar la clase base.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

// Importación de la clase base
import { Item } from './Item.js';

/**
 * Clase Arma - Representa un arma equipable
 * 
 * Aplica principios SOLID:
 * - SRP: Encapsula funcionalidades específicas de armas
 * - OCP: Extiende Item sin modificar la clase base
 * - LSP: Es completamente sustituible por Item
 * - ISP: Implementa interfaz específica para armas
 */
export class Arma extends Item {
    // Propiedades privadas específicas de las armas
    #bonusAtaque;     // Bonus de ataque que proporciona el arma
    #bonusVelocidad;  // Bonus de velocidad que proporciona el arma

    /**
     * Constructor de la clase Arma
     * 
     * Inicializa un arma con sus propiedades específicas.
     * Las armas proporcionan bonificadores permanentes a las estadísticas del explorador.
     * 
     * @param {Object} params - Parámetros de inicialización
     * @param {string} params.id - ID único del arma
     * @param {string} params.nombre - Nombre del arma
     * @param {string} params.descripcion - Descripción del arma
     * @param {number} params.bonusAtaque - Bonus de ataque que proporciona
     * @param {number} params.bonusVelocidad - Bonus de velocidad (default: 0)
     * @param {number} params.valor - Valor monetario (default: 0)
     */
    constructor({ id, nombre, descripcion, bonusAtaque, bonusVelocidad = 0, valor = 0 }) {
        // Llamar al constructor padre con tipo específico de arma
        super({ id, nombre, descripcion, tipo: 'arma', valor });
        this.#bonusAtaque = bonusAtaque;        // Establecer bonus de ataque
        this.#bonusVelocidad = bonusVelocidad;  // Establecer bonus de velocidad
    }

    /**
     * Obtiene el bonus de ataque del arma
     * 
     * @returns {number} Bonus de ataque que proporciona el arma
     */
    getBonusAtaque() { 
        return this.#bonusAtaque; 
    }

    /**
     * Obtiene el bonus de velocidad del arma
     * 
     * @returns {number} Bonus de velocidad que proporciona el arma
     */
    getBonusVelocidad() { 
        return this.#bonusVelocidad; 
    }

    /**
     * Intenta usar el arma (no se puede usar directamente)
     * 
     * Implementa el método abstracto de la clase base.
     * Las armas no se "usan" como consumibles, sino que se equipan.
     * 
     * @param {Explorador} explorador - El explorador que intenta usar el arma
     * @returns {Object} Resultado indicando que no se puede usar directamente
     */
    usar(explorador) {
        // Las armas se equipan permanentemente, no se consumen
        return {
            success: false,
            mensaje: 'Las armas se equipan automáticamente al obtenerlas',
            tipo: 'equipable'  // Indicar que es un item equipable
        };
    }

    /**
     * Método para equipar el arma
     * 
     * Este método sería llamado por el sistema de inventario
     * para aplicar los bonificadores al explorador. Las armas
     * modifican permanentemente las estadísticas del explorador.
     * 
     * @param {Explorador} explorador - El explorador que equipa el arma
     * @returns {Object} Bonificadores que proporciona el arma
     */
    equipar(explorador) {
        // Este método sería llamado por el sistema de inventario
        // para aplicar los bonificadores al explorador
        return {
            bonusAtaque: this.#bonusAtaque,      // Bonus de ataque a aplicar
            bonusVelocidad: this.#bonusVelocidad // Bonus de velocidad a aplicar
        };
    }

    /**
     * Convierte el arma a formato JSON para guardado
     * 
     * Extiende el método toJSON de la clase base para incluir
     * las propiedades específicas de bonificadores.
     * 
     * @returns {Object} Representación JSON del arma
     */
    toJSON() {
        return {
            ...super.toJSON(),              // Incluir propiedades de la clase base
            bonusAtaque: this.#bonusAtaque, // Añadir bonus de ataque
            bonusVelocidad: this.#bonusVelocidad // Añadir bonus de velocidad
        };
    }

    /**
     * Crea una nueva arma desde datos JSON
     * 
     * @param {Object} data - Datos JSON del arma
     * @returns {Arma} Nueva instancia del arma
     */
    static fromJSON(data) {
        return new Arma(data);
    }
}
