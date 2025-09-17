/**
 * Item.js
 * 
 * Clase base abstracta para todos los items del inventario.
 * Aplica el principio SRP (Single Responsibility Principle) al encapsular
 * las propiedades comunes de todos los items del juego.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

/**
 * Clase Item - Clase base abstracta para todos los items del inventario
 * 
 * Aplica principios SOLID:
 * - SRP: Encapsula propiedades comunes de items
 * - OCP: Extensible mediante herencia para nuevos tipos de items
 * - LSP: Todas las subclases son sustituibles por Item
 * - ISP: Interfaz cohesiva y específica para items
 * - DIP: Define contrato que deben implementar las subclases
 */
export class Item {
    // Propiedades privadas (encapsulación)
    #id;           // Identificador único del item
    #nombre;       // Nombre del item
    #descripcion;  // Descripción del item
    #tipo;         // Tipo de item (poción, arma, armadura, etc.)
    #valor;        // Valor monetario del item

    /**
     * Constructor de la clase Item
     * 
     * Inicializa las propiedades básicas de un item del inventario.
     * Aplica el principio de encapsulación con propiedades privadas.
     * 
     * @param {Object} params - Parámetros de inicialización
     * @param {string} params.id - ID único del item
     * @param {string} params.nombre - Nombre del item
     * @param {string} params.descripcion - Descripción del item
     * @param {string} params.tipo - Tipo de item
     * @param {number} params.valor - Valor monetario (default: 0)
     */
    constructor({ id, nombre, descripcion, tipo, valor = 0 }) {
        this.#id = id;                    // ID único del item
        this.#nombre = nombre;            // Nombre del item
        this.#descripcion = descripcion;  // Descripción del item
        this.#tipo = tipo;                // Tipo de item
        this.#valor = valor;              // Valor monetario
    }

    // ==================== GETTERS PÚBLICOS ====================
    // Métodos de acceso que respetan el principio LSP (Liskov Substitution Principle)
    // Permiten acceso controlado a las propiedades privadas

    /**
     * Obtiene el ID único del item
     * @returns {string} ID del item
     */
    getId() { return this.#id; }

    /**
     * Obtiene el nombre del item
     * @returns {string} Nombre del item
     */
    getNombre() { return this.#nombre; }

    /**
     * Obtiene la descripción del item
     * @returns {string} Descripción del item
     */
    getDescripcion() { return this.#descripcion; }

    /**
     * Obtiene el tipo del item
     * @returns {string} Tipo del item
     */
    getTipo() { return this.#tipo; }

    /**
     * Obtiene el valor monetario del item
     * @returns {number} Valor del item
     */
    getValor() { return this.#valor; }

    // ==================== MÉTODO ABSTRACTO ====================
    // Método que debe ser implementado por todas las subclases

    /**
     * Método abstracto que debe ser implementado por las subclases
     * 
     * Define el contrato que todas las subclases deben cumplir.
     * Aplica el principio DIP (Dependency Inversion Principle) al definir
     * una abstracción que las implementaciones concretas deben seguir.
     * 
     * @param {Explorador} explorador - El explorador que usa el item
     * @throws {Error} Si no es implementado por la subclase
     */
    usar(explorador) {
        throw new Error('Método usar() debe ser implementado por las subclases');
    }

    // ==================== SERIALIZACIÓN ====================
    // Métodos para guardar y cargar el estado del item

    /**
     * Convierte el item a formato JSON para guardado
     * 
     * @returns {Object} Representación JSON del item
     */
    toJSON() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            descripcion: this.#descripcion,
            tipo: this.#tipo,
            valor: this.#valor
        };
    }

    /**
     * Crea un nuevo item desde datos JSON
     * 
     * @param {Object} data - Datos JSON del item
     * @returns {Item} Nueva instancia del item
     */
    static fromJSON(data) {
        return new Item(data);
    }
}
