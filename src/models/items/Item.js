// Clase base para todos los items del inventario
export class Item {
    #id;
    #nombre;
    #descripcion;
    #tipo;
    #valor;

    constructor({ id, nombre, descripcion, tipo, valor = 0 }) {
        this.#id = id;
        this.#nombre = nombre;
        this.#descripcion = descripcion;
        this.#tipo = tipo;
        this.#valor = valor;
    }

    // Getters
    getId() { return this.#id; }
    getNombre() { return this.#nombre; }
    getDescripcion() { return this.#descripcion; }
    getTipo() { return this.#tipo; }
    getValor() { return this.#valor; }

    // Método abstracto que debe ser implementado por las subclases
    usar(explorador) {
        throw new Error('Método usar() debe ser implementado por las subclases');
    }

    // Método para serialización
    toJSON() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            descripcion: this.#descripcion,
            tipo: this.#tipo,
            valor: this.#valor
        };
    }

    static fromJSON(data) {
        return new Item(data);
    }
}
