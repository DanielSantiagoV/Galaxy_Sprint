// Explorador.js (clase base)
// Representa un explorador espacial con sistema de batallas
export class Explorador {
    #id;
    #nombre;
    #clase;
    #nivel;
    #experiencia;
    #vida;
    #maxVida;
    #energia;
    #maxEnergia;
    #ataque;
    #defensa;
    #velocidad;
    #inventario;

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
        this.#id = id;
        this.#nombre = nombre;
        this.#clase = clase;
        this.#nivel = nivel;
        this.#experiencia = experiencia;
        this.#vida = vida;
        this.#maxVida = maxVida;
        this.#energia = energia;
        this.#maxEnergia = maxEnergia;
        this.#ataque = ataque;
        this.#defensa = defensa;
        this.#velocidad = velocidad;
        this.#inventario = [];
    }

    // Getters públicos (Liskov-friendly)
    getId() { return this.#id; }
    getNombre() { return this.#nombre; }
    getClase() { return this.#clase; }
    getNivel() { return this.#nivel; }
    getExperiencia() { return this.#experiencia; }
    getVida() { return this.#vida; }
    getMaxVida() { return this.#maxVida; }
    getEnergia() { return this.#energia; }
    getMaxEnergia() { return this.#maxEnergia; }
    getAtaque() { return this.#ataque; }
    getDefensa() { return this.#defensa; }
    getVelocidad() { return this.#velocidad; }
    getInventario() { return [...this.#inventario]; }

    // Métodos de batalla
    atacar(enemigo) {
        if (this.#energia < 5) return { success: false, reason: 'No energy' };
        
        const daño = Math.max(1, this.#ataque - enemigo.getDefensa() + Math.floor(Math.random() * 5));
        enemigo.recibirDaño(daño);
        this.#energia -= 5;
        
        return { 
            success: true, 
            accion: 'Atacar', 
            daño,
            energiaUsada: 5 
        };
    }

    recibirDaño(daño) {
        this.#vida = Math.max(0, this.#vida - daño);
        return this.#vida;
    }

    curar(cantidad) {
        const curacion = Math.min(cantidad, this.#maxVida - this.#vida);
        this.#vida += curacion;
        return curacion;
    }

    descansar() {
        const recupera = 15;
        this.#energia = Math.min(this.#maxEnergia, this.#energia + recupera);
        return { success: true, accion: 'Descansar', recupera };
    }

    // Sistema de experiencia y niveles
    ganarExperiencia(cantidad) {
        this.#experiencia += cantidad;
        const experienciaNecesaria = this.#nivel * 100;
        
        if (this.#experiencia >= experienciaNecesaria) {
            this.subirNivel();
            return true; // Subió de nivel
        }
        return false;
    }

    subirNivel() {
        this.#nivel++;
        this.#experiencia = 0;
        
        // Mejoras por nivel
        const mejoraVida = Math.floor(this.#maxVida * 0.1);
        const mejoraAtaque = Math.floor(this.#ataque * 0.1);
        const mejoraDefensa = Math.floor(this.#defensa * 0.1);
        
        this.#maxVida += mejoraVida;
        this.#vida = this.#maxVida; // Curar completamente al subir nivel
        this.#ataque += mejoraAtaque;
        this.#defensa += mejoraDefensa;
        
        return {
            nivel: this.#nivel,
            mejoras: {
                vida: mejoraVida,
                ataque: mejoraAtaque,
                defensa: mejoraDefensa
            }
        };
    }

    // Sistema de inventario
    agregarItem(item) {
        this.#inventario.push(item);
        return true;
    }

    usarItem(indice) {
        if (indice < 0 || indice >= this.#inventario.length) {
            return { success: false, reason: 'Item no encontrado' };
        }
        
        const item = this.#inventario[indice];
        const resultado = item.usar(this);
        
        if (resultado.success) {
            this.#inventario.splice(indice, 1);
        }
        
        return resultado;
    }

    // Estado del personaje
    estaVivo() {
        return this.#vida > 0;
    }

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

    // Métodos para serialización (guardar/cargar)
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
            inventario: this.#inventario.map(item => item.toJSON ? item.toJSON() : item)
        };
    }

    static fromJSON(data) {
        const explorador = new Explorador(data);
        return explorador;
    }
}
