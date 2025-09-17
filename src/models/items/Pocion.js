/**
 * Pocion.js
 * 
 * Clase que representa una poción de curación en el inventario.
 * Extiende la clase base Item aplicando el principio OCP (Open/Closed Principle)
 * al permitir nuevas funcionalidades sin modificar la clase base.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

// Importación de la clase base
import { Item } from './Item.js';

/**
 * Clase Pocion - Representa una poción de curación
 * 
 * Aplica principios SOLID:
 * - SRP: Encapsula funcionalidades específicas de pociones
 * - OCP: Extiende Item sin modificar la clase base
 * - LSP: Es completamente sustituible por Item
 * - ISP: Implementa interfaz específica para pociones
 */
export class Pocion extends Item {
    // Propiedad privada específica de las pociones
    #curacion;  // Cantidad de vida que restaura la poción

    /**
     * Constructor de la clase Pocion
     * 
     * Inicializa una poción con sus propiedades específicas.
     * Las pociones restauran vida al explorador que las usa.
     * 
     * @param {Object} params - Parámetros de inicialización
     * @param {string} params.id - ID único de la poción
     * @param {string} params.nombre - Nombre de la poción
     * @param {string} params.descripcion - Descripción de la poción
     * @param {number} params.curacion - Cantidad de vida que restaura
     * @param {number} params.valor - Valor monetario (default: 0)
     */
    constructor({ id, nombre, descripcion, curacion, valor = 0 }) {
        // Llamar al constructor padre con tipo específico de poción
        super({ id, nombre, descripcion, tipo: 'pocion', valor });
        this.#curacion = curacion;  // Establecer cantidad de curación
    }

    /**
     * Obtiene la cantidad de curación de la poción
     * 
     * @returns {number} Cantidad de vida que restaura la poción
     */
    getCuracion() { 
        return this.#curacion; 
    }

    /**
     * Usa la poción para curar al explorador
     * 
     * Implementa el método abstracto de la clase base.
     * Restaura vida al explorador y retorna el resultado de la acción.
     * 
     * @param {Explorador} explorador - El explorador que usa la poción
     * @returns {Object} Resultado del uso de la poción
     */
    usar(explorador) {
        // Usar el método curar del explorador con la cantidad de curación de la poción
        const curacionReal = explorador.curar(this.#curacion);
        
        // Retornar resultado exitoso con información detallada
        return {
            success: true,
            mensaje: `${explorador.getNombre()} usó ${this.getNombre()} y recuperó ${curacionReal} puntos de vida`,
            curacion: curacionReal  // Cantidad real de vida curada
        };
    }

    /**
     * Convierte la poción a formato JSON para guardado
     * 
     * Extiende el método toJSON de la clase base para incluir
     * la propiedad específica de curación.
     * 
     * @returns {Object} Representación JSON de la poción
     */
    toJSON() {
        return {
            ...super.toJSON(),        // Incluir propiedades de la clase base
            curacion: this.#curacion  // Añadir propiedad específica de la poción
        };
    }

    /**
     * Crea una nueva poción desde datos JSON
     * 
     * @param {Object} data - Datos JSON de la poción
     * @returns {Pocion} Nueva instancia de la poción
     */
    static fromJSON(data) {
        return new Pocion(data);
    }
}
