# Diagrama UML - Galaxy Sprint Batallas Espaciales

## Diagrama de Clases

```mermaid
classDiagram
    %% Clase base
    class Explorador {
        -#id: string
        -#nombre: string
        -#clase: string
        -#nivel: number
        -#experiencia: number
        -#vida: number
        -#maxVida: number
        -#energia: number
        -#maxEnergia: number
        -#ataque: number
        -#defensa: number
        -#velocidad: number
        -#inventario: Item[]
        +getId(): string
        +getNombre(): string
        +getClase(): string
        +getNivel(): number
        +getVida(): number
        +getEnergia(): number
        +atacar(enemigo): object
        +recibirDaño(daño): number
        +curar(cantidad): number
        +descansar(): object
        +ganarExperiencia(cantidad): boolean
        +subirNivel(): object
        +agregarItem(item): boolean
        +usarItem(indice): object
        +estaVivo(): boolean
        +estado(): object
        +toJSON(): object
        +fromJSON(data): Explorador
    }

    %% Clases especializadas
    class ExploradorHumano {
        +ataqueDoble(enemigo): object
    }

    class ExploradorIA {
        +ataquePrecision(enemigo): object
    }

    class ExploradorGuerrero {
        +golpeDevastador(enemigo): object
    }

    class ExploradorMago {
        +bolaFuego(enemigo): object
        +curar(): object
    }

    class ExploradorArquero {
        +lluviaFlechas(enemigo): object
        +flechaPenetrante(enemigo): object
    }

    %% Sistema de Items
    class Item {
        -#id: string
        -#nombre: string
        -#descripcion: string
        -#tipo: string
        -#valor: number
        +getId(): string
        +getNombre(): string
        +usar(explorador): object
        +toJSON(): object
        +fromJSON(data): Item
    }

    class Pocion {
        -#curacion: number
        +getCuracion(): number
        +usar(explorador): object
    }

    class Arma {
        -#bonusAtaque: number
        -#bonusVelocidad: number
        +getBonusAtaque(): number
        +equipar(explorador): object
    }

    class Armadura {
        -#bonusDefensa: number
        -#bonusVida: number
        +getBonusDefensa(): number
        +equipar(explorador): object
    }

    class Energia {
        -#bonusEnergia: number
        +getBonusEnergia(): number
        +usar(explorador): object
    }

    %% Interfaces (Principios SOLID)
    class IAtaque {
        +atacar(enemigo): object
    }

    class ICurable {
        +curar(cantidad): number
        +recibirDaño(daño): number
    }

    class INotificador {
        +info(mensaje): void
        +success(mensaje): void
        +warn(mensaje): void
        +error(mensaje): void
        +mostrarEstado(estadoJugador, estadoEnemigo): void
    }

    class IGestorBatalla {
        +iniciar(): object
        +ejecutarTurno(): void
        +verificarGanador(): void
    }

    %% Servicios
    class GestorBatalla {
        -jugador: Explorador
        -enemigo: Explorador
        -notificador: INotificador
        -turno: number
        -ganador: object
        -ordenTurnos: Explorador[]
        +iniciar(): object
        +determinarOrdenTurnos(): Explorador[]
        +turnoJugador(): void
        +turnoEnemigo(): void
        +obtenerAccionesDisponibles(combatiente): object[]
        +elegirAccionIA(acciones): object
        +ejecutarAccion(atacante, objetivo, accion): void
        +usarItem(combatiente): object
        +verificarGanador(): void
        +mostrarEstado(): void
        +mostrarResultado(): void
    }

    class GestorGuardado {
        -directorioGuardado: string
        -archivoPersonajes: string
        -archivoPartidas: string
        +inicializar(): void
        +guardarPersonaje(personaje): boolean
        +cargarPersonajes(): Explorador[]
        +eliminarPersonaje(idPersonaje): boolean
        +guardarPartida(datosPartida): boolean
        +cargarPartidas(): object[]
        +serializarPersonaje(personaje): object
        +deserializarPersonaje(datos): Explorador
        +deserializarItem(datos): Item
        +obtenerEstadisticas(): object
    }

    class GeneradorEnemigos {
        -nombresEnemigos: string[]
        -tiposEnemigos: object[]
        +generarEnemigo(nivelJugador): Explorador
        +generarEnemigoBoss(nivelJugador): Explorador
        +seleccionarTipoEnemigo(): string
        +generarNombreEnemigo(): string
        +obtenerStatsBase(tipo): object
        +escalarStats(statsBase, multiplicador): object
        +crearEnemigo(tipo, datos): Explorador
    }

    class NotificadorCLI {
        +info(text): void
        +success(text): void
        +warn(text): void
        +error(text): void
        +mostrarEstado(estadoJugador, estadoEnemigo): void
    }

    %% Relaciones de Herencia
    Explorador <|-- ExploradorHumano
    Explorador <|-- ExploradorIA
    Explorador <|-- ExploradorGuerrero
    Explorador <|-- ExploradorMago
    Explorador <|-- ExploradorArquero

    Item <|-- Pocion
    Item <|-- Arma
    Item <|-- Armadura
    Item <|-- Energia

    INotificador <|-- NotificadorCLI
    IGestorBatalla <|-- GestorBatalla

    %% Relaciones de Composición
    Explorador *-- Item : inventario
    GestorBatalla *-- Explorador : jugador, enemigo
    GestorBatalla *-- INotificador : notificador

    %% Relaciones de Dependencia
    GestorBatalla ..> IAtaque : usa
    GestorBatalla ..> ICurable : usa
    GestorGuardado ..> Explorador : maneja
    GestorGuardado ..> Item : serializa
    GeneradorEnemigos ..> Explorador : crea
```

## Principios SOLID Aplicados

### 1. Single Responsibility Principle (SRP)
- **Explorador**: Responsable únicamente de representar un personaje
- **GestorBatalla**: Solo maneja la lógica de batallas
- **GestorGuardado**: Solo se encarga del guardado/carga
- **GeneradorEnemigos**: Solo genera enemigos aleatorios
- **NotificadorCLI**: Solo maneja la salida por consola

### 2. Open/Closed Principle (OCP)
- Se pueden añadir nuevas clases de exploradores sin modificar las existentes
- Se pueden añadir nuevos tipos de items sin cambiar la clase base
- El sistema de batallas es extensible para nuevas habilidades

### 3. Liskov Substitution Principle (LSP)
- Todas las subclases de Explorador pueden usarse como instancias de la clase base
- Todas las subclases de Item implementan correctamente el método usar()
- NotificadorCLI puede sustituir a INotificador

### 4. Interface Segregation Principle (ISP)
- **IAtaque**: Solo para objetos que pueden atacar
- **ICurable**: Solo para objetos que pueden ser curados
- **INotificador**: Solo para sistemas de notificación
- **IGestorBatalla**: Solo para gestores de batalla

### 5. Dependency Inversion Principle (DIP)
- GestorBatalla depende de INotificador, no de NotificadorCLI directamente
- Las clases dependen de abstracciones (interfaces) no de implementaciones concretas
- El sistema es fácilmente extensible con nuevos tipos de notificadores

## Características de POO Implementadas

### Herencia
- Explorador como clase base con subclases especializadas
- Item como clase base para diferentes tipos de objetos

### Polimorfismo
- Métodos sobrescritos en las subclases (ataqueDoble, bolaFuego, etc.)
- Diferentes comportamientos según el tipo de explorador

### Encapsulamiento
- Propiedades privadas con # en las clases
- Métodos públicos para acceder a la información
- Métodos privados para funcionalidad interna

### Relaciones entre Clases
- **Composición**: Explorador contiene Items en su inventario
- **Agregación**: GestorBatalla usa Exploradores
- **Dependencia**: Servicios dependen de interfaces
