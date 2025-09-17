/**
 * Explorador.js
 * 
 * Clase base que representa un explorador espacial con sistema de batallas.
 * Aplica el principio SRP (Single Responsibility Principle) al encapsular
 * todas las funcionalidades básicas de un personaje del juego.
 * 
 * @author Daniel Santiago
 * @version 2.0.0
 */

/**
 * Clase Explorador - Clase base para todos los personajes del juego
 * 
 * Aplica principios SOLID:
 * - SRP: Encapsula funcionalidades de personaje
 * - OCP: Extensible mediante herencia
 * - LSP: Todas las subclases son sustituibles
 * - ISP: Interfaz cohesiva y específica
 * - DIP: Depende de abstracciones (items)
 */
export class Explorador {
    // Propiedades privadas (encapsulación)
    #id;           // Identificador único del personaje
    #nombre;       // Nombre del personaje
    #clase;        // Clase del personaje (Humano, Guerrero, etc.)
    #nivel;        // Nivel actual del personaje
    #experiencia;  // Experiencia acumulada
    #vida;         // Vida actual
    #maxVida;      // Vida máxima
    #energia;      // Energía actual
    #maxEnergia;   // Energía máxima
    #ataque;       // Poder de ataque
    #defensa;      // Poder de defensa
    #velocidad;    // Velocidad de acción
    #inventario;   // Array de items del personaje

    /**
     * Constructor de la clase Explorador
     * 
     * Inicializa todas las propiedades del personaje con valores por defecto
     * o valores proporcionados. Aplica el principio de encapsulación.
     * 
     * @param {Object} params - Parámetros de inicialización
     * @param {string} params.id - ID único del personaje
     * @param {string} params.nombre - Nombre del personaje
     * @param {string} params.clase - Clase del personaje (default: 'Explorador')
     * @param {number} params.nivel - Nivel inicial (default: 1)
     * @param {number} params.experiencia - Experiencia inicial (default: 0)
     * @param {number} params.vida - Vida inicial (default: 100)
     * @param {number} params.maxVida - Vida máxima (default: 100)
     * @param {number} params.energia - Energía inicial (default: 50)
     * @param {number} params.maxEnergia - Energía máxima (default: 50)
     * @param {number} params.ataque - Ataque base (default: 10)
     * @param {number} params.defensa - Defensa base (default: 5)
     * @param {number} params.velocidad - Velocidad base (default: 8)
     */
    constructor({ 
        id, 
        nombre, 
        clase = 'Explorador',
        nivel = 1,
        experiencia = 0,
        vida = 100, 
        maxVida = 100,
        energia = 50, 
        maxEnergia = 50,
        ataque = 10,
        defensa = 5,
        velocidad = 8
    }) {
        // Inicializar propiedades privadas con valores proporcionados o por defecto
        this.#id = id;                    // ID único del personaje
        this.#nombre = nombre;            // Nombre del personaje
        this.#clase = clase;              // Clase del personaje
        this.#nivel = nivel;              // Nivel actual
        this.#experiencia = experiencia;  // Experiencia acumulada
        this.#vida = vida;                // Vida actual
        this.#maxVida = maxVida;          // Vida máxima
        this.#energia = energia;          // Energía actual
        this.#maxEnergia = maxEnergia;    // Energía máxima
        this.#ataque = ataque;            // Poder de ataque
        this.#defensa = defensa;          // Poder de defensa
        this.#velocidad = velocidad;      // Velocidad de acción
        this.#inventario = [];            // Inventario vacío inicialmente
    }

    // ==================== GETTERS PÚBLICOS ====================
    // Métodos de acceso que respetan el principio LSP (Liskov Substitution Principle)
    // Permiten acceso controlado a las propiedades privadas

    /**
     * Obtiene el ID único del personaje
     * @returns {string} ID del personaje
     */
    getId() { return this.#id; }

    /**
     * Obtiene el nombre del personaje
     * @returns {string} Nombre del personaje
     */
    getNombre() { return this.#nombre; }

    /**
     * Obtiene la clase del personaje
     * @returns {string} Clase del personaje
     */
    getClase() { return this.#clase; }

    /**
     * Obtiene el nivel actual del personaje
     * @returns {number} Nivel del personaje
     */
    getNivel() { return this.#nivel; }

    /**
     * Obtiene la experiencia acumulada
     * @returns {number} Experiencia del personaje
     */
    getExperiencia() { return this.#experiencia; }

    /**
     * Obtiene la vida actual del personaje
     * @returns {number} Vida actual
     */
    getVida() { return this.#vida; }

    /**
     * Obtiene la vida máxima del personaje
     * @returns {number} Vida máxima
     */
    getMaxVida() { return this.#maxVida; }

    /**
     * Obtiene la energía actual del personaje
     * @returns {number} Energía actual
     */
    getEnergia() { return this.#energia; }

    /**
     * Obtiene la energía máxima del personaje
     * @returns {number} Energía máxima
     */
    getMaxEnergia() { return this.#maxEnergia; }

    /**
     * Obtiene el poder de ataque del personaje
     * @returns {number} Poder de ataque
     */
    getAtaque() { return this.#ataque; }

    /**
     * Obtiene el poder de defensa del personaje
     * @returns {number} Poder de defensa
     */
    getDefensa() { return this.#defensa; }

    /**
     * Obtiene la velocidad del personaje
     * @returns {number} Velocidad
     */
    getVelocidad() { return this.#velocidad; }

    /**
     * Obtiene una copia del inventario del personaje
     * @returns {Array} Copia del inventario (protección contra modificaciones externas)
     */
    getInventario() { return [...this.#inventario]; }

    // ==================== MÉTODOS DE BATALLA ====================
    // Métodos que manejan las acciones de combate del personaje

    /**
     * Realiza un ataque básico contra un enemigo
     * 
     * Calcula el daño basado en el ataque del personaje, la defensa del enemigo
     * y un factor aleatorio. Consume energía al atacar.
     * 
     * @param {Explorador} enemigo - El enemigo a atacar
     * @returns {Object} Resultado del ataque
     */
    atacar(enemigo) {
        // Verificar si tiene suficiente energía para atacar
        if (this.#energia < 5) {
            return { success: false, reason: 'No energy' };
        }
        
        // Calcular daño: ataque - defensa + factor aleatorio (0-4)
        const daño = Math.max(1, this.#ataque - enemigo.getDefensa() + Math.floor(Math.random() * 5));
        
        // Aplicar daño al enemigo
        enemigo.recibirDaño(daño);
        
        // Consumir energía del ataque
        this.#energia -= 5;
        
        // Retornar resultado del ataque
        return { 
            success: true, 
            accion: 'Atacar', 
            daño,
            energiaUsada: 5 
        };
    }

    /**
     * Recibe daño y reduce la vida del personaje
     * 
     * @param {number} daño - Cantidad de daño a recibir
     * @returns {number} Vida restante después del daño
     */
    recibirDaño(daño) {
        // Reducir vida, asegurando que no baje de 0
        this.#vida = Math.max(0, this.#vida - daño);
        return this.#vida;
    }

    /**
     * Cura al personaje una cantidad específica de vida
     * 
     * @param {number} cantidad - Cantidad de vida a curar
     * @returns {number} Cantidad de vida realmente curada
     */
    curar(cantidad) {
        // Calcular cuánto se puede curar sin exceder la vida máxima
        const curacion = Math.min(cantidad, this.#maxVida - this.#vida);
        
        // Aplicar curación
        this.#vida += curacion;
        
        return curacion;
    }

    /**
     * Descansa y recupera energía
     * 
     * Permite al personaje recuperar energía para continuar luchando.
     * 
     * @returns {Object} Resultado del descanso
     */
    descansar() {
        const recupera = 15; // Cantidad de energía a recuperar
        
        // Recuperar energía sin exceder el máximo
        this.#energia = Math.min(this.#maxEnergia, this.#energia + recupera);
        
        return { success: true, accion: 'Descansar', recupera };
    }

    // ==================== SISTEMA DE EXPERIENCIA Y NIVELES ====================
    // Métodos que manejan la progresión del personaje

    /**
     * Añade experiencia al personaje y verifica si sube de nivel
     * 
     * @param {number} cantidad - Cantidad de experiencia a ganar
     * @returns {boolean} True si subió de nivel, false en caso contrario
     */
    ganarExperiencia(cantidad) {
        // Añadir experiencia al total acumulado
        this.#experiencia += cantidad;
        
        // Calcular experiencia necesaria para el siguiente nivel
        const experienciaNecesaria = this.#nivel * 100;
        
        // Verificar si tiene suficiente experiencia para subir de nivel
        if (this.#experiencia >= experienciaNecesaria) {
            this.subirNivel();
            return true; // Subió de nivel
        }
        return false; // No subió de nivel
    }

    /**
     * Sube el nivel del personaje y aplica mejoras
     * 
     * Incrementa el nivel, resetea la experiencia y mejora las estadísticas
     * del personaje. También cura completamente al personaje.
     * 
     * @returns {Object} Información sobre las mejoras aplicadas
     */
    subirNivel() {
        // Incrementar nivel y resetear experiencia
        this.#nivel++;
        this.#experiencia = 0;
        
        // Calcular mejoras por nivel (10% de mejora en cada estadística)
        const mejoraVida = Math.floor(this.#maxVida * 0.1);
        const mejoraAtaque = Math.floor(this.#ataque * 0.1);
        const mejoraDefensa = Math.floor(this.#defensa * 0.1);
        
        // Aplicar mejoras a las estadísticas
        this.#maxVida += mejoraVida;
        this.#vida = this.#maxVida; // Curar completamente al subir nivel
        this.#ataque += mejoraAtaque;
        this.#defensa += mejoraDefensa;
        
        // Retornar información sobre las mejoras
        return {
            nivel: this.#nivel,
            mejoras: {
                vida: mejoraVida,
                ataque: mejoraAtaque,
                defensa: mejoraDefensa
            }
        };
    }

    // ==================== SISTEMA DE INVENTARIO ====================
    // Métodos que manejan los items del personaje

    /**
     * Añade un item al inventario del personaje
     * 
     * @param {Item} item - El item a añadir al inventario
     * @returns {boolean} True si se añadió correctamente
     */
    agregarItem(item) {
        // Añadir item al final del inventario
        this.#inventario.push(item);
        return true;
    }

    /**
     * Usa un item del inventario por su índice
     * 
     * @param {number} indice - Índice del item en el inventario
     * @returns {Object} Resultado del uso del item
     */
    usarItem(indice) {
        // Validar que el índice sea válido
        if (indice < 0 || indice >= this.#inventario.length) {
            return { success: false, reason: 'Item no encontrado' };
        }
        
        // Obtener el item del inventario
        const item = this.#inventario[indice];
        
        // Usar el item (aplicar sus efectos)
        const resultado = item.usar(this);
        
        // Si el uso fue exitoso, remover el item del inventario
        if (resultado.success) {
            this.#inventario.splice(indice, 1);
        }
        
        return resultado;
    }

    // ==================== ESTADO DEL PERSONAJE ====================
    // Métodos que proporcionan información sobre el estado actual

    /**
     * Verifica si el personaje está vivo
     * 
     * @returns {boolean} True si el personaje está vivo, false si está muerto
     */
    estaVivo() {
        return this.#vida > 0;
    }

    /**
     * Obtiene el estado completo del personaje
     * 
     * @returns {Object} Objeto con toda la información del estado del personaje
     */
    estado() {
        return { 
            nombre: this.#nombre, 
            clase: this.#clase,
            nivel: this.#nivel,
            vida: this.#vida,
            maxVida: this.#maxVida,
            energia: this.#energia,
            maxEnergia: this.#maxEnergia,
            ataque: this.#ataque,
            defensa: this.#defensa,
            velocidad: this.#velocidad,
            experiencia: this.#experiencia,
            inventario: this.#inventario.length
        };
    }

    // ==================== SERIALIZACIÓN ====================
    // Métodos para guardar y cargar el estado del personaje

    /**
     * Convierte el personaje a formato JSON para guardado
     * 
     * @returns {Object} Representación JSON del personaje
     */
    toJSON() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            clase: this.#clase,
            nivel: this.#nivel,
            experiencia: this.#experiencia,
            vida: this.#vida,
            maxVida: this.#maxVida,
            energia: this.#energia,
            maxEnergia: this.#maxEnergia,
            ataque: this.#ataque,
            defensa: this.#defensa,
            velocidad: this.#velocidad,
            // Serializar inventario (items que tengan método toJSON)
            inventario: this.#inventario.map(item => item.toJSON ? item.toJSON() : item)
        };
    }

    /**
     * Crea un nuevo explorador desde datos JSON
     * 
     * @param {Object} data - Datos JSON del explorador
     * @returns {Explorador} Nueva instancia del explorador
     */
    static fromJSON(data) {
        // Crear nueva instancia con los datos proporcionados
        const explorador = new Explorador(data);
        return explorador;
    }
}
