import { get } from 'svelte/store';

// Recetas de combinaciones extendidas con iconos Lucide (Ampliadas a >200 elementos)
export const recipes = [
    // Fenómenos Básicos (1-13)
    { ingredients: [1, 2], result: { id: 5, name: 'Vapor', icon: 'Cloud', category: 'Fenómenos' } },
    { ingredients: [1, 3], result: { id: 6, name: 'Lava', icon: 'FlameKindling', category: 'Fenómenos' } },
    { ingredients: [2, 3], result: { id: 7, name: 'Barro', icon: 'Waves', category: 'Materiales' } },
    { ingredients: [1, 4], result: { id: 8, name: 'Energía', icon: 'Zap', category: 'Fenómenos' } },
    { ingredients: [2, 4], result: { id: 9, name: 'Lluvia', icon: 'CloudRain', category: 'Fenómenos' } },
    { ingredients: [3, 4], result: { id: 10, name: 'Polvo', icon: 'Wind', category: 'Materiales' } },
    { ingredients: [5, 3], result: { id: 11, name: 'Niebla', icon: 'CloudFog', category: 'Fenómenos' } },
    { ingredients: [6, 2], result: { id: 12, name: 'Piedra', icon: 'Gem', category: 'Materiales' } },
    { ingredients: [13, 13], result: { id: 26, name: 'Casa', icon: 'Home', category: 'Construcción' } },

    // Minerales, Metales y Materia (14-30)
    { ingredients: [12, 4], result: { id: 21, name: 'Arena', icon: 'Umbrella', category: 'Materiales' } },
    { ingredients: [21, 1], result: { id: 22, name: 'Vidrio', icon: 'Square', category: 'Materiales' } },
    { ingredients: [12, 1], result: { id: 23, name: 'Metal', icon: 'Component', category: 'Materiales' } },
    { ingredients: [23, 1], result: { id: 59, name: 'Acero', icon: 'Layers', category: 'Materiales' } },
    { ingredients: [23, 8], result: { id: 25, name: 'Electricidad', icon: 'BatteryCharging', category: 'Tecnología' } },
    { ingredients: [21, 22], result: { id: 27, name: 'Tiempo', icon: 'Hourglass', category: 'Conceptos' } },
    { ingredients: [22, 23], result: { id: 60, name: 'Reloj', icon: 'Clock', category: 'Tecnología' } },
    { ingredients: [12, 12], result: { id: 61, name: 'Montaña', icon: 'Mountain', category: 'Naturaleza' } },
    { ingredients: [61, 1], result: { id: 62, name: 'Volcán', icon: 'Activity', category: 'Naturaleza' } },

    // Naturaleza, Plantas y Vida (31-60)
    { ingredients: [8, 2], result: { id: 14, name: 'Vida', icon: 'Sprout', category: 'Vida' } },
    { ingredients: [9, 3], result: { id: 15, name: 'Planta', icon: 'Flower2', category: 'Vida' } },
    { ingredients: [14, 2], result: { id: 17, name: 'Océano', icon: 'Waves', category: 'Naturaleza' } },
    { ingredients: [14, 3], result: { id: 19, name: 'Árbol', icon: 'Trees', category: 'Vida' } },
    { ingredients: [15, 1], result: { id: 18, name: 'Ceniza', icon: 'Wind', category: 'Materiales' } },
    { ingredients: [19, 1], result: { id: 20, name: 'Carbón', icon: 'Square', category: 'Materiales' } },
    { ingredients: [15, 15], result: { id: 63, name: 'Jardín', icon: 'Trees', category: 'Naturaleza' } },
    { ingredients: [15, 2], result: { id: 64, name: 'Algas', icon: 'Leaf', category: 'Vida' } },
    { ingredients: [19, 19], result: { id: 65, name: 'Bosque', icon: 'TreePine', category: 'Naturaleza' } },
    { ingredients: [65, 1], result: { id: 66, name: 'Incendio', icon: 'Flame', category: 'Fenómenos' } },
    { ingredients: [15, 7], result: { id: 67, name: 'Pantano', icon: 'Waves', category: 'Naturaleza' } },
    { ingredients: [67, 14], result: { id: 68, name: 'Bacteria', icon: 'Microscope', category: 'Vida' } },
    { ingredients: [68, 14], result: { id: 69, name: 'Gusano', icon: 'Bug', category: 'Vida' } },
    { ingredients: [69, 7], result: { id: 70, name: 'Serpiente', icon: 'Bug', category: 'Vida' } },

    // Animales (61-90)
    { ingredients: [14, 10], result: { id: 71, name: 'Insecto', icon: 'Bug', category: 'Vida' } },
    { ingredients: [71, 15], result: { id: 72, name: 'Mariposa', icon: 'Butterfly', category: 'Vida' } },
    { ingredients: [71, 7], result: { id: 73, name: 'Escarabajo', icon: 'Bug', category: 'Vida' } },
    { ingredients: [14, 4], result: { id: 31, name: 'Pájaro', icon: 'Bird', category: 'Vida' } },
    { ingredients: [31, 2], result: { id: 74, name: 'Pato', icon: 'Bird', category: 'Vida' } },
    { ingredients: [14, 2], result: { id: 30, name: 'Pescado', icon: 'Fish', category: 'Vida' } },
    { ingredients: [30, 12], result: { id: 75, name: 'Tortuga', icon: 'Shell', category: 'Vida' } },
    { ingredients: [30, 30], result: { id: 76, name: 'Tiburón', icon: 'FishSymbol', category: 'Vida' } },
    { ingredients: [3, 14], result: { id: 29, name: 'Humano', icon: 'User', category: 'Vida' } },
    { ingredients: [29, 31], result: { id: 77, name: 'Ángel', icon: 'Microwave', category: 'Conceptos' } },
    { ingredients: [29, 1], result: { id: 78, name: 'Cocinero', icon: 'UtensilsCrossed', category: 'Vida' } },
    { ingredients: [29, 23], result: { id: 32, name: 'Herramienta', icon: 'Hammer', category: 'Tecnología' } },

    // Tecnología y Civilización (91-130)
    { ingredients: [32, 19], result: { id: 33, name: 'Madera', icon: 'Axe', category: 'Materiales' } },
    { ingredients: [33, 32], result: { id: 34, name: 'Rueda', icon: 'Settings', category: 'Tecnología' } },
    { ingredients: [34, 23], result: { id: 35, name: 'Coche', icon: 'Car', category: 'Tecnología' } },
    { ingredients: [33, 17], result: { id: 36, name: 'Barco', icon: 'Ship', category: 'Tecnología' } },
    { ingredients: [35, 4], result: { id: 37, name: 'Avión', icon: 'Plane', category: 'Tecnología' } },
    { ingredients: [25, 23], result: { id: 79, name: 'Cable', icon: 'Cable', category: 'Tecnología' } },
    { ingredients: [79, 22], result: { id: 80, name: 'Bombilla', icon: 'Lightbulb', category: 'Tecnología' } },
    { ingredients: [80, 25], result: { id: 81, name: 'Lámpara', icon: 'Lamp', category: 'Objetos' } },
    { ingredients: [25, 22], result: { id: 82, name: 'Pantalla', icon: 'Monitor', category: 'Tecnología' } },
    { ingredients: [82, 32], result: { id: 83, name: 'Ordenador', icon: 'Cpu', category: 'Tecnología' } },
    { ingredients: [83, 8], result: { id: 84, name: 'Internet', icon: 'Globe', category: 'Tecnología' } },
    { ingredients: [83, 29], result: { id: 85, name: 'Programador', icon: 'Code', category: 'Vida' } },
    { ingredients: [85, 84], result: { id: 86, name: 'IA', icon: 'Brain', category: 'Tecnología' } },

    // Espacio (131-160)
    { ingredients: [1, 8], result: { id: 40, name: 'Sol', icon: 'Sun', category: 'Espacio' } },
    { ingredients: [12, 40], result: { id: 41, name: 'Luna', icon: 'Moon', category: 'Espacio' } },
    { ingredients: [40, 4], result: { id: 42, name: 'Espacio', icon: 'Orbit', category: 'Espacio' } },
    { ingredients: [42, 40], result: { id: 43, name: 'Estrella', icon: 'Star', category: 'Espacio' } },
    { ingredients: [42, 14], result: { id: 44, name: 'Alien', icon: 'Ghost', category: 'Espacio' } },
    { ingredients: [43, 43], result: { id: 87, name: 'Galaxia', icon: 'MilkyWay', category: 'Espacio' } },
    { ingredients: [87, 87], result: { id: 88, name: 'Universo', icon: 'Dna', category: 'Espacio' } },
    { ingredients: [42, 23], result: { id: 89, name: 'Satélite', icon: 'Satellite', category: 'Espacio' } },
    { ingredients: [89, 37], result: { id: 90, name: 'Cohete', icon: 'Rocket', category: 'Espacio' } },
    { ingredients: [90, 29], result: { id: 91, name: 'Astronauta', icon: 'UserCircle', category: 'Vida' } },

    // Objetos Cotidianos y Materiales Avanzados (161-210)
    { ingredients: [33, 2], result: { id: 47, name: 'Papel', icon: 'FileText', category: 'Materiales' } },
    { ingredients: [47, 47], result: { id: 48, name: 'Libro', icon: 'Book', category: 'Objetos' } },
    { ingredients: [48, 48], result: { id: 49, name: 'Biblioteca', icon: 'Library', category: 'Construcción' } },
    { ingredients: [23, 40], result: { id: 50, name: 'Oro', icon: 'Coins', category: 'Materiales' } },
    { ingredients: [50, 47], result: { id: 51, name: 'Dinero', icon: 'Banknote', category: 'Objetos' } },
    { ingredients: [51, 49], result: { id: 92, name: 'Banco', icon: 'Landmark', category: 'Construcción' } },
    { ingredients: [3, 20], result: { id: 53, name: 'Diamante', icon: 'Gem', category: 'Materiales' } },
    { ingredients: [53, 50], result: { id: 54, name: 'Anillo', icon: 'Circle', category: 'Objetos' } },
    { ingredients: [29, 36], result: { id: 55, name: 'Marinero', icon: 'Anchor', category: 'Vida' } },
    { ingredients: [55, 30], result: { id: 56, name: 'Sushi', icon: 'Utensils', category: 'Naturaleza' } },
    { ingredients: [8, 10], result: { id: 57, name: 'Pólvora', icon: 'Bomb', category: 'Materiales' } },
    { ingredients: [57, 23], result: { id: 58, name: 'Arma', icon: 'Sword', category: 'Tecnología' } },
    { ingredients: [33, 1], result: { id: 93, name: 'Antorcha', icon: 'Flame', category: 'Objetos' } },
    { ingredients: [33, 33], result: { id: 94, name: 'Mesa', icon: 'Table', category: 'Objetos' } },
    { ingredients: [94, 29], result: { id: 95, name: 'Carpintero', icon: 'Wrench', category: 'Vida' } },
    { ingredients: [47, 32], result: { id: 96, name: 'Lápiz', icon: 'Pencil', category: 'Objetos' } },
    { ingredients: [96, 47], result: { id: 97, name: 'Dibujo', icon: 'Palette', category: 'Conceptos' } },
    { ingredients: [97, 25], result: { id: 98, name: 'Cine', icon: 'Film', category: 'Tecnología' } },
    { ingredients: [98, 29], result: { id: 99, name: 'Actor', icon: 'Drama', category: 'Vida' } },

    // Comida y Bebida (211-250)
    { ingredients: [2, 11], result: { id: 100, name: 'Hielo', icon: 'Snowflake', category: 'Fenómenos' } },
    { ingredients: [100, 39], result: { id: 101, name: 'Helado', icon: 'IceCream', category: 'Objetos' } },
    { ingredients: [39, 1], result: { id: 102, name: 'Carne', icon: 'Beef', category: 'Naturaleza' } },
    { ingredients: [102, 1], result: { id: 103, name: 'Barbacoa', icon: 'Flame', category: 'Conceptos' } },
    { ingredients: [33, 39], result: { id: 104, name: 'Fruta', icon: 'Apple', category: 'Naturaleza' } },
    { ingredients: [104, 2], result: { id: 105, name: 'Zumo', icon: 'CupSoda', category: 'Objetos' } },
    { ingredients: [105, 1], result: { id: 106, name: 'Vino', icon: 'Wine', category: 'Objetos' } },
    { ingredients: [2, 15], result: { id: 107, name: 'Té', icon: 'Coffee', category: 'Objetos' } },
    { ingredients: [107, 1], result: { id: 108, name: 'Café', icon: 'Coffee', category: 'Objetos' } },
    { ingredients: [39, 22], result: { id: 109, name: 'Caramelo', icon: 'Candy', category: 'Objetos' } },

    // Edificios y Monumentos (251-280)
    { ingredients: [26, 26], result: { id: 110, name: 'Pueblo', icon: 'Map', category: 'Construcción' } },
    { ingredients: [110, 110], result: { id: 111, name: 'Ciudad', icon: 'Building2', category: 'Construcción' } },
    { ingredients: [111, 23], result: { id: 112, name: 'Rascacielos', icon: 'Building', category: 'Construcción' } },
    { ingredients: [26, 50], result: { id: 113, name: 'Palacio', icon: 'Castle', category: 'Construcción' } },
    { ingredients: [26, 12], result: { id: 114, name: 'Castillo', icon: 'Castle', category: 'Construcción' } },
    { ingredients: [114, 29], result: { id: 115, name: 'Rey', icon: 'Crown', category: 'Vida' } },
    { ingredients: [115, 54], result: { id: 116, name: 'Reina', icon: 'Crown', category: 'Vida' } },

    // Conceptos Abstractos (281-310)
    { ingredients: [29, 14], result: { id: 117, name: 'Amor', icon: 'Heart', category: 'Conceptos' } },
    { ingredients: [117, 117], result: { id: 118, name: 'Matrimonio', icon: 'Handshake', category: 'Conceptos' } },
    { ingredients: [29, 29], result: { id: 119, name: 'Familia', icon: 'Users', category: 'Vida' } },
    { ingredients: [119, 26], result: { id: 120, name: 'Hogar', icon: 'Home', category: 'Conceptos' } },
    { ingredients: [29, 8], result: { id: 121, name: 'Pensamiento', icon: 'Lightbulb', category: 'Conceptos' } },
    { ingredients: [121, 121], result: { id: 122, name: 'Idea', icon: 'Sparkles', category: 'Conceptos' } },
    { ingredients: [122, 47], result: { id: 123, name: 'Poema', icon: 'PenTool', category: 'Conceptos' } },
    { ingredients: [123, 29], result: { id: 124, name: 'Poeta', icon: 'User', category: 'Vida' } },

    // Fantasía y Magia (311-340)
    { ingredients: [1, 14], result: { id: 125, name: 'Fénix', icon: 'Bird', category: 'Vida' } },
    { ingredients: [6, 14], result: { id: 126, name: 'Dragón', icon: 'VenetianMask', category: 'Vida' } },
    { ingredients: [126, 1], result: { id: 127, name: 'Fuego de Dragón', icon: 'Flame', category: 'Fenómenos' } },
    { ingredients: [29, 126], result: { id: 128, name: 'Caballero', icon: 'Shield', category: 'Vida' } },
    { ingredients: [128, 58], result: { id: 129, name: 'Héroe', icon: 'Trophy', category: 'Vida' } },
    { ingredients: [14, 22], result: { id: 130, name: 'Espejo Mágico', icon: 'Sparkles', category: 'Objetos' } },
    { ingredients: [8, 122], result: { id: 131, name: 'Magia', icon: 'Wand2', category: 'Conceptos' } },
    { ingredients: [131, 29], result: { id: 132, name: 'Mago', icon: 'Hat', category: 'Vida' } },

    // Clima y Desastres (341-370)
    { ingredients: [9, 4], result: { id: 133, name: 'Tormenta', icon: 'CloudLightning', category: 'Fenómenos' } },
    { ingredients: [133, 100], result: { id: 134, name: 'Ventisca', icon: 'Wind', category: 'Fenómenos' } },
    { ingredients: [1, 61], result: { id: 135, name: 'Erupción', icon: 'Flame', category: 'Fenómenos' } },
    { ingredients: [2, 61], result: { id: 136, name: 'Tsunami', icon: 'Waves', category: 'Fenómenos' } },
    { ingredients: [4, 61], result: { id: 137, name: 'Terremoto', icon: 'Activity', category: 'Fenómenos' } },
    { ingredients: [133, 133], result: { id: 138, name: 'Huracán', icon: 'Tornado', category: 'Fenómenos' } },
    { ingredients: [4, 4], result: { id: 139, name: 'Tornado', icon: 'Wind', category: 'Fenómenos' } },

    // Música y Arte (371-400)
    { ingredients: [4, 122], result: { id: 140, name: 'Sonido', icon: 'Volume2', category: 'Conceptos' } },
    { ingredients: [140, 140], result: { id: 141, name: 'Música', icon: 'Music', category: 'Conceptos' } },
    { ingredients: [141, 19], result: { id: 142, name: 'Guitarra', icon: 'Music', category: 'Objetos' } },
    { ingredients: [141, 23], result: { id: 143, name: 'Trompeta', icon: 'Music', category: 'Objetos' } },
    { ingredients: [141, 29], result: { id: 144, name: 'Músico', icon: 'User', category: 'Vida' } },
    { ingredients: [144, 142], result: { id: 145, name: 'Rock', icon: 'Zap', category: 'Conceptos' } },
    { ingredients: [97, 1], result: { id: 146, name: 'Escultura', icon: 'Gem', category: 'Objetos' } },

    // Salud y Ciencia (401-430)
    { ingredients: [14, 68], result: { id: 147, name: 'Medicina', icon: 'Pill', category: 'Tecnología' } },
    { ingredients: [147, 29], result: { id: 148, name: 'Médico', icon: 'UserPlus', category: 'Vida' } },
    { ingredients: [148, 26], result: { id: 149, name: 'Hospital', icon: 'Building2', category: 'Construcción' } },
    { ingredients: [68, 22], result: { id: 150, name: 'Microscopio', icon: 'Microscope', category: 'Tecnología' } },
    { ingredients: [8, 68], result: { id: 151, name: 'ADN', icon: 'Dna', category: 'Ciencia' } },
    { ingredients: [151, 151], result: { id: 152, name: 'Clon', icon: 'Users', category: 'Ciencia' } },

    // Deportes y Ocio (431-460)
    { ingredients: [34, 14], result: { id: 153, name: 'Pelota', icon: 'Circle', category: 'Objetos' } },
    { ingredients: [153, 29], result: { id: 154, name: 'Deportista', icon: 'Run', category: 'Vida' } },
    { ingredients: [154, 153], result: { id: 155, name: 'Fútbol', icon: 'Trophy', category: 'Conceptos' } },
    { ingredients: [35, 154], result: { id: 156, name: 'Carreras', icon: 'Timer', category: 'Conceptos' } },
    { ingredients: [156, 156], result: { id: 157, name: 'Fórmula 1', icon: 'FastForward', category: 'Conceptos' } },

    // Ropa y Moda (461-490)
    { ingredients: [15, 32], result: { id: 158, name: 'Algodón', icon: 'Cloud', category: 'Materiales' } },
    { ingredients: [158, 32], result: { id: 159, name: 'Tela', icon: 'Layers', category: 'Materiales' } },
    { ingredients: [159, 159], result: { id: 160, name: 'Ropa', icon: 'Shirt', category: 'Objetos' } },
    { ingredients: [160, 50], result: { id: 161, name: 'Vestido Caro', icon: 'Gem', category: 'Objetos' } },
    { ingredients: [160, 23], result: { id: 162, name: 'Armadura', icon: 'Shield', category: 'Objetos' } },

    // Justicia y Política (491-520)
    { ingredients: [29, 115], result: { id: 163, name: 'Ley', icon: 'Gavel', category: 'Conceptos' } },
    { ingredients: [163, 163], result: { id: 164, name: 'Justicia', icon: 'Scale', category: 'Conceptos' } },
    { ingredients: [164, 29], result: { id: 165, name: 'Juez', icon: 'User', category: 'Vida' } },
    { ingredients: [163, 26], result: { id: 166, name: 'Prisión', icon: 'Lock', category: 'Construcción' } },

    // Viajes y Transporte (521-550)
    { ingredients: [3, 21], result: { id: 167, name: 'Desierto', icon: 'Sun', category: 'Naturaleza' } },
    { ingredients: [167, 2], result: { id: 168, name: 'Oasis', icon: 'Palmtree', category: 'Naturaleza' } },
    { ingredients: [111, 37], result: { id: 169, name: 'Aeropuerto', icon: 'PlaneLanding', category: 'Construcción' } },
    { ingredients: [36, 17], result: { id: 170, name: 'Puerto', icon: 'Anchor', category: 'Construcción' } },
    { ingredients: [4, 33], result: { id: 171, name: 'Cometa', icon: 'Wind', category: 'Objetos' } },

    // Nuevas Combinaciones Extra (Asegurando >200)
    { ingredients: [25, 34], result: { id: 172, name: 'Motor', icon: 'Zap', category: 'Tecnología' } },
    { ingredients: [172, 36], result: { id: 173, name: 'Lancha', icon: 'Ship', category: 'Tecnología' } },
    { ingredients: [172, 35], result: { id: 174, name: 'Camión', icon: 'Truck', category: 'Tecnología' } },
    { ingredients: [174, 174], result: { id: 175, name: 'Convoy', icon: 'Truck', category: 'Tecnología' } },
    { ingredients: [23, 12], result: { id: 176, name: 'Imán', icon: 'Magnet', category: 'Objetos' } },
    { ingredients: [176, 176], result: { id: 177, name: 'Magnetismo', icon: 'Activity', category: 'Fenómenos' } },
    { ingredients: [22, 176], result: { id: 178, name: 'Brújula', icon: 'Compass', category: 'Objetos' } },
    { ingredients: [178, 55], result: { id: 179, name: 'Explorador', icon: 'Map', category: 'Vida' } },
    { ingredients: [179, 111], result: { id: 180, name: 'Turista', icon: 'Camera', category: 'Vida' } },
    { ingredients: [180, 180], result: { id: 181, name: 'Turismo', icon: 'Plane', category: 'Conceptos' } },
    { ingredients: [1, 10], result: { id: 182, name: 'Humo', icon: 'Wind', category: 'Fenómenos' } },
    { ingredients: [182, 182], result: { id: 183, name: 'Nube', icon: 'Cloud', category: 'Fenómenos' } },
    { ingredients: [183, 1], result: { id: 184, name: 'Rayo', icon: 'Zap', category: 'Fenómenos' } },
    { ingredients: [184, 184], result: { id: 185, name: 'Trueno', icon: 'Volume2', category: 'Fenómenos' } },
    { ingredients: [15, 61], result: { id: 186, name: 'Flor de Loto', icon: 'Flower', category: 'Vida' } },
    { ingredients: [186, 119], result: { id: 187, name: 'Paz', icon: 'Bird', category: 'Conceptos' } },
    { ingredients: [187, 187], result: { id: 188, name: 'Nirvana', icon: 'Sparkles', category: 'Conceptos' } },
    { ingredients: [12, 131], result: { id: 189, name: 'Piedra Filosofal', icon: 'Gem', category: 'Objetos' } },
    { ingredients: [189, 23], result: { id: 190, name: 'Oro Alquímico', icon: 'Coins', category: 'Materiales' } },
    { ingredients: [190, 51], result: { id: 191, name: 'Riqueza', icon: 'Banknote', category: 'Conceptos' } },
    { ingredients: [191, 191], result: { id: 192, name: 'Imperio', icon: 'Crown', category: 'Construcción' } },
    { ingredients: [192, 115], result: { id: 193, name: 'Emperador', icon: 'UserCircle', category: 'Vida' } },
    { ingredients: [193, 193], result: { id: 194, name: 'Dinastía', icon: 'Users', category: 'Conceptos' } },
    { ingredients: [12, 5], result: { id: 195, name: 'Géiser', icon: 'Cloud', category: 'Fenómenos' } },
    { ingredients: [195, 100], result: { id: 196, name: 'Glaciar', icon: 'Snowflake', category: 'Naturaleza' } },
    { ingredients: [196, 196], result: { id: 197, name: 'Edad de Hielo', icon: 'History', category: 'Conceptos' } },
    { ingredients: [12, 33], result: { id: 198, name: 'Cabaña', icon: 'Home', category: 'Construcción' } },
    { ingredients: [198, 198], result: { id: 199, name: 'Campamento', icon: 'Tent', category: 'Construcción' } },
    { ingredients: [199, 1], result: { id: 200, name: 'Hoguera', icon: 'Flame', category: 'Objetos' } },
    { ingredients: [200, 29], result: { id: 201, name: 'Superviviente', icon: 'UserCheck', category: 'Vida' } },
    { ingredients: [201, 201], result: { id: 202, name: 'Tribu', icon: 'Users', category: 'Vida' } },
    { ingredients: [202, 202], result: { id: 203, name: 'Cultura', icon: 'Palette', category: 'Conceptos' } },
    { ingredients: [203, 48], result: { id: 204, name: 'Historia', icon: 'Scroll', category: 'Conceptos' } },
    { ingredients: [204, 204], result: { id: 205, name: 'Museo', icon: 'Landmark', category: 'Construcción' } },
    { ingredients: [205, 50], result: { id: 206, name: 'Tesoro', icon: 'Box', category: 'Objetos' } },
    { ingredients: [206, 206], result: { id: 207, name: 'Leyenda', icon: 'Star', category: 'Conceptos' } },
    { ingredients: [207, 207], result: { id: 208, name: 'Mito', icon: 'Ghost', category: 'Conceptos' } },
    { ingredients: [208, 132], result: { id: 209, name: 'Dios', icon: 'Sun', category: 'Vida' } },
    { ingredients: [209, 209], result: { id: 210, name: 'Mitología', icon: 'BookOpen', category: 'Conceptos' } },
];

// Usamos clases de Svelte 5 para el estado reactivo global
class GameState {
    elements = $state([
        { id: 1, name: 'Fuego', icon: 'Flame', discovered: true, category: 'Origen' },
        { id: 2, name: 'Agua', icon: 'Droplets', discovered: true, category: 'Origen' },
        { id: 3, name: 'Tierra', icon: 'Mountain', discovered: true, category: 'Origen' },
        { id: 4, name: 'Aire', icon: 'Wind', discovered: true, category: 'Origen' },
    ]);

    discoveredElements = $state([1, 2, 3, 4]);

    // Persist board state across views
    canvasElements = $state([]);
    nextCanvasId = $state(1);

    // Persistent UI states
    sidebarOpen = $state(false);
    currentView = $state("elements");

    infoPanel = $state({
        isOpen: false,
        element: null,
        parents: [],
        combinationsLeft: 0,
        complexity: 0
    });

    // Reference to GameArea's notification function
    showNotification = null;

    constructor() {
        this.loadGame();

        // Auto-save effect: runs whenever tracked state changes
        $effect.root(() => {
            $effect(() => {
                this.saveGame();
            });
        });
    }

    saveGame() {
        const data = {
            discoveredElements: Array.from(this.discoveredElements),
            canvasElements: this.canvasElements,
            nextCanvasId: this.nextCanvasId,
            sidebarOpen: this.sidebarOpen,
            currentView: this.currentView,
            infoPanelOpen: this.infoPanel.isOpen
        };
        localStorage.setItem('alchemy_save', JSON.stringify(data));
    }

    loadGame() {
        const saved = localStorage.getItem('alchemy_save');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.discoveredElements = data.discoveredElements || [1, 2, 3, 4];
                this.canvasElements = data.canvasElements || [];
                this.nextCanvasId = data.nextCanvasId || 1;
                this.sidebarOpen = data.sidebarOpen !== undefined ? data.sidebarOpen : false;
                this.currentView = data.currentView || "elements";
                this.infoPanel.isOpen = data.infoPanelOpen || false;

                // Sync elements array with discovered elements
                this.discoveredElements.forEach(id => {
                    const recipe = recipes.find(r => r.result.id === id);
                    if (recipe && !this.elements.some(e => e.id === id)) {
                        this.elements.push({ ...recipe.result, discovered: true });
                    }
                });
            } catch (e) {
                console.error("Error loading save:", e);
            }
        }
    }

    combineElements(elem1Id, elem2Id) {
        const recipe = recipes.find(r =>
            (r.ingredients.includes(elem1Id) && r.ingredients.includes(elem2Id)) &&
            (r.ingredients[0] === elem1Id && r.ingredients[1] === elem2Id ||
                r.ingredients[0] === elem2Id && r.ingredients[1] === elem1Id)
        );

        if (recipe) {
            if (!this.discoveredElements.includes(recipe.result.id)) {
                this.discoveredElements.push(recipe.result.id);
                if (!this.elements.some(e => e.id === recipe.result.id)) {
                    this.elements.push({ ...recipe.result, discovered: true });
                }
            }
            return recipe.result;
        }
        return null;
    }

    getElementComplexity(elementId) {
        const baseIds = [1, 2, 3, 4];
        if (baseIds.includes(elementId)) return 0;

        const recipe = recipes.find(r => r.result.id === elementId);
        if (!recipe) return 0;

        const tiers = recipe.ingredients.map(ingId => this.getElementComplexity(ingId));
        return Math.max(...tiers) + 1;
    }

    selectInfoElement(targetElement) {
        if (!targetElement) return;

        const typeId = targetElement.id;
        const creationRecipe = recipes.find(r => r.result.id === typeId);

        let parents = [];
        if (creationRecipe) {
            parents = creationRecipe.ingredients.map(id =>
                this.elements.find(e => e.id === id) ||
                { name: '?', icon: 'HelpCircle' }
            );
        }

        const complexity = this.getElementComplexity(typeId);

        const remaining = recipes.filter(r =>
            r.ingredients.includes(typeId) &&
            !this.discoveredElements.includes(r.result.id)
        ).length;

        this.infoPanel.element = targetElement;
        this.infoPanel.parents = parents;
        this.infoPanel.combinationsLeft = remaining;
        this.infoPanel.complexity = complexity;
        // El panel ya no se abre automáticamente aquí
    }

    findFreePosition(startX, startY) {
        const spacing = 90;
        const dirs = [
            { x: -0.5 * spacing, y: 0.866 * spacing },
            { x: -1 * spacing, y: 0 },
            { x: -0.5 * spacing, y: -0.866 * spacing },
            { x: 0.5 * spacing, y: -0.866 * spacing },
            { x: 1 * spacing, y: 0 },
            { x: 0.5 * spacing, y: 0.866 * spacing },
        ];

        let ring = 1;
        const isFree = (x, y) =>
            !this.canvasElements.some(
                (el) =>
                    Math.sqrt(Math.pow(el.x - x, 2) + Math.pow(el.y - y, 2)) <
                    75,
            );

        if (isFree(startX, startY)) return { x: startX, y: startY };

        while (ring < 40) {
            let currentX = startX + ring * spacing;
            let currentY = startY;
            if (isFree(currentX, currentY)) return { x: currentX, y: currentY };
            for (let side = 0; side < 6; side++) {
                const dir = dirs[side];
                for (let step = 0; step < ring; step++) {
                    if (side === 5 && step === ring - 1) continue;
                    currentX += dir.x;
                    currentY += dir.y;
                    if (isFree(currentX, currentY))
                        return { x: currentX, y: currentY };
                }
            }
            ring++;
        }
        return { x: startX + 50, y: startY + 50 };
    }

    addElementToCanvas(element, x, y) {
        // If x, y are not provided, use default center-ish position
        const targetX = x !== undefined ? x : window.innerWidth / 2 - 50;
        const targetY = y !== undefined ? y : window.innerHeight / 2 - 50;

        const pos = this.findFreePosition(targetX, targetY);

        const newElement = {
            ...element,
            canvasId: this.nextCanvasId++,
            x: pos.x,
            y: pos.y,
            isNew: true
        };

        this.canvasElements.push(newElement);

        // Show toast notification if possible
        if (this.showNotification) {
            this.showNotification(`🧪 ${element.name} añadido`, "success", "element-added");
        }

        setTimeout(() => {
            this.canvasElements = this.canvasElements.map(el =>
                el.canvasId === newElement.canvasId ? { ...el, isNew: false } : el
            );
        }, 600);

        return newElement;
    }

    toggleInfoPanel() {
        this.infoPanel.isOpen = !this.infoPanel.isOpen;
    }

    closeInfoPanel() {
        this.infoPanel.isOpen = false;
    }
}

export const gameState = new GameState();
