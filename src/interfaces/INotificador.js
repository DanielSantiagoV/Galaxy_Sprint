// Interface para notificaciones (DIP - Dependency Inversion Principle)
export class INotificador {
    info(mensaje) {
        throw new Error('Método info() debe ser implementado');
    }
    
    success(mensaje) {
        throw new Error('Método success() debe ser implementado');
    }
    
    warn(mensaje) {
        throw new Error('Método warn() debe ser implementado');
    }
    
    error(mensaje) {
        throw new Error('Método error() debe ser implementado');
    }
    
    mostrarEstado(estadoJugador, estadoEnemigo) {
        throw new Error('Método mostrarEstado() debe ser implementado');
    }
}
