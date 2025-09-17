// Interface para objetos que pueden atacar (ISP - Interface Segregation Principle)
export class IAtaque {
    atacar(enemigo) {
        throw new Error('Método atacar() debe ser implementado');
    }
}
