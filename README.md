# 🚀 Galaxy Sprint - Batallas Espaciales

Un juego de consola interactivo desarrollado en JavaScript con Node.js que simula batallas entre exploradores espaciales de diferentes clases, aplicando programación orientada a objetos y principios SOLID.

## 🎮 Características

### Sistema de Personajes
- **4 clases de exploradores**: Humano, Guerrero, Mago, Arquero
- **Sistema de niveles**: Los personajes ganan experiencia y suben de nivel
- **Estadísticas únicas**: Cada clase tiene atributos y habilidades distintas
- **Habilidades especiales**: Cada clase tiene ataques únicos

### Sistema de Batallas
- **Batallas por turnos**: Sistema estratégico basado en velocidad
- **IA inteligente**: Enemigos con comportamiento táctico
- **Enemigos escalables**: Dificultad adaptada al nivel del jugador
- **Bosses especiales**: Enemigos más poderosos para mayor desafío

### Sistema de Inventario
- **Items consumibles**: Pociones de vida y bebidas energéticas
- **Equipamiento**: Armas y armaduras que mejoran estadísticas
- **Gestión automática**: Items se usan y equipan automáticamente

### Persistencia de Datos
- **Guardado automático**: Progreso se mantiene entre sesiones
- **Múltiples personajes**: Crea y gestiona varios exploradores
- **Estadísticas**: Historial de partidas y progreso

## 🏗️ Arquitectura

### Principios SOLID Aplicados
- **SRP**: Cada clase tiene una única responsabilidad
- **OCP**: Extensible sin modificar código existente
- **LSP**: Subclases sustituibles por la clase base
- **ISP**: Interfaces específicas y cohesivas
- **DIP**: Dependencias de abstracciones, no implementaciones

### Programación Orientada a Objetos
- **Herencia**: Jerarquía de clases de exploradores
- **Polimorfismo**: Comportamientos específicos por clase
- **Encapsulamiento**: Propiedades privadas y métodos públicos
- **Relaciones**: Composición, agregación y dependencias

## 🚀 Instalación y Uso

### Requisitos
- Node.js 16.0.0 o superior
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/DanielSantiagoV/Galaxy_Sprint.git

# Instalar dependencias
npm install

# Ejecutar el juego
npm start
```

### Comandos Disponibles
```bash
npm start    # Ejecutar el juego
npm run dev  # Ejecutar en modo desarrollo (con watch)
```

## 🎯 Cómo Jugar

1. **Crear Personaje**: Elige nombre y clase de explorador
2. **Iniciar Batalla**: Selecciona tu personaje y tipo de enemigo
3. **Combatir**: Usa ataques, habilidades especiales e items
4. **Progresar**: Gana experiencia, sube de nivel y mejora

### Clases de Exploradores

| Clase | Vida | Ataque | Defensa | Velocidad | Habilidad Especial |
|-------|------|--------|---------|-----------|-------------------|
| **Humano** | 120 | 12 | 8 | 7 | Ataque Doble |
| **Guerrero** | 150 | 18 | 12 | 5 | Golpe Devastador |
| **Mago** | 80 | 15 | 4 | 6 | Bola de Fuego / Curar |
| **Arquero** | 100 | 14 | 6 | 12 | Lluvia de Flechas / Flecha Penetrante |

## 📁 Estructura del Proyecto

```
src/
├── models/                 # Entidades del juego
│   ├── Explorador.js      # Clase base de exploradores
│   ├── ExploradorHumano.js
│   ├── ExploradorGuerrero.js
│   ├── ExploradorMago.js
│   ├── ExploradorArquero.js
│   └── items/             # Sistema de inventario
│       ├── Item.js
│       ├── Pocion.js
│       ├── Arma.js
│       ├── Armadura.js
│       └── Energia.js
├── interfaces/            # Interfaces (Principios SOLID)
│   ├── IAtaque.js
│   ├── ICurable.js
│   ├── INotificador.js
│   └── IGestorBatalla.js
├── services/              # Lógica de negocio
│   ├── GestorBatalla.js
│   ├── GestorGuardado.js
│   ├── GeneradorEnemigos.js
│   └── NotificadorCLI.js
├── main.js               # Punto de entrada principal
└── app.js               # Archivo de aplicación

docs/
└── diagrama-uml.md      # Documentación UML

data/                    # Datos persistentes (se crea automáticamente)
├── personajes.json
└── partidas.json
```

## 🛠️ Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Inquirer.js**: Interfaz de consola interactiva
- **Chalk**: Colores en la terminal
- **UUID**: Generación de identificadores únicos
- **ES6 Modules**: Sistema de módulos moderno

## 📊 Características Técnicas

- **Modularidad**: Código organizado en módulos independientes
- **Extensibilidad**: Fácil añadir nuevas clases y funcionalidades
- **Mantenibilidad**: Código limpio y bien documentado
- **Escalabilidad**: Arquitectura preparada para crecer
- **Testabilidad**: Estructura que facilita las pruebas

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Daniel Santiago** - [GitHub](https://github.com/DanielSantiagoV)

---

¡Disfruta explorando la galaxia! 🌌✨