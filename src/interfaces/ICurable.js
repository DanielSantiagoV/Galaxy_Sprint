// Interface para objetos que pueden ser curados (ISP - Interface Segregation Principle)
export class ICurable {
    curar(cantidad) {
        throw new Error('Método curar() debe ser implementado');
    }
    
    recibirDaño(daño) {
        throw new Error('Método recibirDaño() debe ser implementado');
    }
}
