/**
 * Armadura.js
 * 
 * Clase que representa una armadura equipable en el inventario.
 * Extiende la clase base Item aplicando el principio OCP (Open/Closed Principle)
 * al permitir nuevas funcionalidades sin modificar la clase base.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

// Importación de la clase base
import { Item } from './Item.js';

/**
 * Clase Armadura - Representa una armadura equipable
 * 
 * Aplica principios SOLID:
 * - SRP: Encapsula funcionalidades específicas de armaduras
 * - OCP: Extiende Item sin modificar la clase base
 * - LSP: Es completamente sustituible por Item
 * - ISP: Implementa interfaz específica para armaduras
 */
export class Armadura extends Item {
    // Propiedades privadas específicas de las armaduras
    #bonusDefensa;  // Bonus de defensa que proporciona la armadura
    #bonusVida;     // Bonus de vida que proporciona la armadura

    /**
     * Constructor de la clase Armadura
     * 
     * Inicializa una armadura con sus propiedades específicas.
     * Las armaduras proporcionan bonificadores permanentes a las estadísticas del explorador.
     * 
     * @param {Object} params - Parámetros de inicialización
     * @param {string} params.id - ID único de la armadura
     * @param {string} params.nombre - Nombre de la armadura
     * @param {string} params.descripcion - Descripción de la armadura
     * @param {number} params.bonusDefensa - Bonus de defensa que proporciona
     * @param {number} params.bonusVida - Bonus de vida (default: 0)
     * @param {number} params.valor - Valor monetario (default: 0)
     */
    constructor({ id, nombre, descripcion, bonusDefensa, bonusVida = 0, valor = 0 }) {
        // Llamar al constructor padre con tipo específico de armadura
        super({ id, nombre, descripcion, tipo: 'armadura', valor });
        this.#bonusDefensa = bonusDefensa;  // Establecer bonus de defensa
        this.#bonusVida = bonusVida;        // Establecer bonus de vida
    }

    /**
     * Obtiene el bonus de defensa de la armadura
     * 
     * @returns {number} Bonus de defensa que proporciona la armadura
     */
    getBonusDefensa() { 
        return this.#bonusDefensa; 
    }

    /**
     * Obtiene el bonus de vida de la armadura
     * 
     * @returns {number} Bonus de vida que proporciona la armadura
     */
    getBonusVida() { 
        return this.#bonusVida; 
    }

    /**
     * Intenta usar la armadura (no se puede usar directamente)
     * 
     * Implementa el método abstracto de la clase base.
     * Las armaduras no se "usan" como consumibles, sino que se equipan.
     * 
     * @param {Explorador} explorador - El explorador que intenta usar la armadura
     * @returns {Object} Resultado indicando que no se puede usar directamente
     */
    usar(explorador) {
        // Las armaduras se equipan permanentemente, no se consumen
        return {
            success: false,
            mensaje: 'Las armaduras se equipan automáticamente al obtenerlas',
            tipo: 'equipable'  // Indicar que es un item equipable
        };
    }

    /**
     * Método para equipar la armadura
     * 
     * Este método sería llamado por el sistema de inventario
     * para aplicar los bonificadores al explorador. Las armaduras
     * modifican permanentemente las estadísticas del explorador.
     * 
     * @param {Explorador} explorador - El explorador que equipa la armadura
     * @returns {Object} Bonificadores que proporciona la armadura
     */
    equipar(explorador) {
        return {
            bonusDefensa: this.#bonusDefensa,  // Bonus de defensa a aplicar
            bonusVida: this.#bonusVida         // Bonus de vida a aplicar
        };
    }

    /**
     * Convierte la armadura a formato JSON para guardado
     * 
     * Extiende el método toJSON de la clase base para incluir
     * las propiedades específicas de bonificadores.
     * 
     * @returns {Object} Representación JSON de la armadura
     */
    toJSON() {
        return {
            ...super.toJSON(),              // Incluir propiedades de la clase base
            bonusDefensa: this.#bonusDefensa, // Añadir bonus de defensa
            bonusVida: this.#bonusVida       // Añadir bonus de vida
        };
    }

    /**
     * Crea una nueva armadura desde datos JSON
     * 
     * @param {Object} data - Datos JSON de la armadura
     * @returns {Armadura} Nueva instancia de la armadura
     */
    static fromJSON(data) {
        return new Armadura(data);
    }
}
