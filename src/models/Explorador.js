// Explorador.js (clase base)
// Representa un explorador en la carrera (humano o IA)
export class Explorador {
    #id;
    #nombre;
    #posicion; // 1..5
    #energia;  // entero
    #maxEnergia;

    constructor({ id, nombre, posicion = 1, energia = 10, maxEnergia = 10 }) {
        this.#id = id;
        this.#nombre = nombre;
        this.#posicion = posicion;
        this.#energia = energia;
        this.#maxEnergia = maxEnergia;
    }

    // Getters públicos (Liskov-friendly)
    getId() { return this.#id; }
    getNombre() { return this.#nombre; }
    getPosicion() { return this.#posicion; }
    getEnergia() { return this.#energia; }

    // Acciones estándar: avanzar(1), sprint(2), descansar
    avanzar() {
        if (this.#energia < 2) return { success: false, reason: 'No energy' };
        this.#posicion = Math.min(5, this.#posicion + 1);
        this.#energia -= 2;
        return { success: true, accion: 'Avanzar', avance: 1 };
    }

    sprint() {
        if (this.#energia < 4) return { success: false, reason: 'No energy' };
        this.#posicion = Math.min(5, this.#posicion + 2);
        this.#energia -= 4;
        return { success: true, accion: 'Sprint', avance: 2 };
    }

    descansar() {
        const recupera = 3;
        this.#energia = Math.min(this.#maxEnergia, this.#energia + recupera);
        return { success: true, accion: 'Descansar', recupera };
    }

    // Utilitario para forzar posición (tests / restaurar)
    _setPosicion(n) { this.#posicion = n; }
    _setEnergia(e) { this.#energia = Math.min(this.#maxEnergia, e); }

    // Estado textual
    estado() {
        return { nombre: this.#nombre, posicion: this.#posicion, energia: this.#energia };
    }
}
