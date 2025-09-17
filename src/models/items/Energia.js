/**
 * Energia.js
 * 
 * Clase que representa un item de energía en el inventario.
 * Extiende la clase base Item aplicando el principio OCP (Open/Closed Principle)
 * al permitir nuevas funcionalidades sin modificar la clase base.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

// Importación de la clase base
import { Item } from './Item.js';

/**
 * Clase Energia - Representa un item de energía
 * 
 * Aplica principios SOLID:
 * - SRP: Encapsula funcionalidades específicas de items de energía
 * - OCP: Extiende Item sin modificar la clase base
 * - LSP: Es completamente sustituible por Item
 * - ISP: Implementa interfaz específica para items de energía
 */
export class Energia extends Item {
    // Propiedad privada específica de los items de energía
    #bonusEnergia;  // Cantidad de energía que restaura el item

    /**
     * Constructor de la clase Energia
     * 
     * Inicializa un item de energía con sus propiedades específicas.
     * Los items de energía restauran energía al explorador que los usa.
     * 
     * @param {Object} params - Parámetros de inicialización
     * @param {string} params.id - ID único del item de energía
     * @param {string} params.nombre - Nombre del item de energía
     * @param {string} params.descripcion - Descripción del item de energía
     * @param {number} params.bonusEnergia - Cantidad de energía que restaura
     * @param {number} params.valor - Valor monetario (default: 0)
     */
    constructor({ id, nombre, descripcion, bonusEnergia, valor = 0 }) {
        // Llamar al constructor padre con tipo específico de energía
        super({ id, nombre, descripcion, tipo: 'energia', valor });
        this.#bonusEnergia = bonusEnergia;  // Establecer cantidad de energía
    }

    /**
     * Obtiene la cantidad de energía que restaura el item
     * 
     * @returns {number} Cantidad de energía que restaura el item
     */
    getBonusEnergia() { 
        return this.#bonusEnergia; 
    }

    /**
     * Usa el item de energía para restaurar energía al explorador
     * 
     * Implementa el método abstracto de la clase base.
     * Restaura energía al explorador respetando el límite máximo.
     * 
     * @param {Explorador} explorador - El explorador que usa el item de energía
     * @returns {Object} Resultado del uso del item de energía
     */
    usar(explorador) {
        // Obtener energía actual y máxima del explorador
        const energiaAnterior = explorador.getEnergia();
        const energiaMaxima = explorador.getMaxEnergia();
        
        // Calcular cuánta energía se puede recuperar sin exceder el máximo
        const energiaRecuperada = Math.min(this.#bonusEnergia, energiaMaxima - energiaAnterior);
        
        // Usar método privado para modificar energía del explorador
        explorador._setEnergia(energiaAnterior + energiaRecuperada);
        
        // Retornar resultado exitoso con información detallada
        return {
            success: true,
            mensaje: `${explorador.getNombre()} usó ${this.getNombre()} y recuperó ${energiaRecuperada} puntos de energía`,
            energiaRecuperada  // Cantidad real de energía recuperada
        };
    }

    /**
     * Convierte el item de energía a formato JSON para guardado
     * 
     * Extiende el método toJSON de la clase base para incluir
     * la propiedad específica de bonus de energía.
     * 
     * @returns {Object} Representación JSON del item de energía
     */
    toJSON() {
        return {
            ...super.toJSON(),        // Incluir propiedades de la clase base
            bonusEnergia: this.#bonusEnergia  // Añadir propiedad específica de energía
        };
    }

    /**
     * Crea un nuevo item de energía desde datos JSON
     * 
     * @param {Object} data - Datos JSON del item de energía
     * @returns {Energia} Nueva instancia del item de energía
     */
    static fromJSON(data) {
        return new Energia(data);
    }
}
