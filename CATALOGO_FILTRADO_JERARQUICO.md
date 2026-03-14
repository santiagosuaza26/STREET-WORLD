# Catálogo - Sistema de Filtrado Jerárquico

## ✨ Nuevo: Filtrado por Género y Tipo de Prenda

Tu catálogo ahora tiene un sistema **jerárquico de dos niveles**:

### Nivel 1: Género
- 👨 **Hombre**
- 👩 **Mujer**
- 👶 **Niños**

### Nivel 2: Tipo de Prenda (dinámico por género)

Cuando seleccionas un género, **automáticamente se muestran solo las categorías disponibles para ese género**:

**Ejemplo:**
- Selecciona "Hombre" → Ves: Camisetas, Pantalones, Hoodies, Chaquetas, Accesorios
- Selecciona "Mujer" → Ves: Camisetas, Pantalones, Hoodies, Chaquetas
- Selecciona "Niños" → Ves: Camisetas, Hoodies, Pantalones, Accesorios

---

## 🎮 Cómo Funciona

### Paso 1: Selecciona un Género
```
1. Ve a /catalogo
2. En la sección "Género" (con emojis), click en:
   - 👨 Hombre
   - 👩 Mujer
   - 👶 Niños
   - o "Todo" para ver todo
3. Los botones se resaltan en rojo cuando están activos
```

### Paso 2: Selecciona Tipo de Prenda (solo si elegiste género específico)
```
1. La sección "Tipo de Prenda" aparece SOLO si:
   - Seleccionaste un género específico (no "Todo")
2. Haz click en la prenda que quieres:
   - Camisetas
   - Pantalones
   - Hoodies
   - Chaquetas
   - Accesorios
   - o "Todo" para ver todas las prendas del género
```

### Paso 3: Bonus - Combina con Búsqueda y Ordenamiento
```
1. Selecciona género: "Mujer"
2. Selecciona prenda: "Pantalones"
3. Escribe en búsqueda: "Negro"
4. Ordena por: "Precio: menor a mayor"
5. Resultado: Pantalones negros para mujer, ordenados por precio
```

---

## 📊 Flujo Visual

```
Mi catálogo
├─ GÉNERO
│  ├─ [Todo]  (muestra todos los géneros)
│  ├─ [👨 Hombre]  → Muestra categorías de hombre
│  ├─ [👩 Mujer]   → Muestra categorías de mujer
│  └─ [👶 Niños]   → Muestra categorías de niños
│
└─ TIPO DE PRENDA (aparece solo si elegiste género)
   ├─ [Todo]
   ├─ [Camisetas]
   ├─ [Pantalones]
   ├─ [Hoodies]
   ├─ [Chaquetas]
   └─ [Accesorios]  (si existe para ese género)
```

---

## 🏷️ Filtros Disponibles

| Nivel | Opciones | Comportamiento |
|-------|----------|----------------|
| **Género** | Todo, Hombre, Mujer, Niños | Selecciona uno o "Todo" |
| **Prenda** | Depende del género | Solo aparece si género ≠ "Todo" |
| **Búsqueda** | Cualquier texto | Filtra por nombre, resumen, categoría |
| **Ordenamiento** | Destacados, Precio ↑/↓, A-Z | Ordena resultados |
| **Resultados** | Contador | Muestra cantidad de productos |

---

## 💡 Ejemplos de Uso

### Escenario 1: Comprar un regalo para un niño
```
1. Click: [👶 Niños]
2. Click: [Hoodies]
3. Click: [Precio: menor a mayor]
4. ✅ Ves hoodies para niños ordenados de más barato a más caro
```

### Escenario 2: Buscar chaqueta para mujer de color denim
```
1. Click: [👩 Mujer]
2. Click: [Chaquetas]
3. Escribe: "denim"
4. ✅ Ves solo chaquetas de denim para mujer
```

### Escenario 3: Ver TODO el catálogo
```
1. Click: [Todo] (bajo Género)
2. (La sección "Tipo de Prenda" desaparece)
3. ✅ Ves todos los productos de todos los géneros y categorías
```

---

## 📱 Diseño Responsivo

✅ Los filtros son **100% responsive**:
- Desktop: Todos los botones visibles en fila
- Tablet: Se adaptan con wrapping
- Mobile: Los botones se organizan en múltiples filas

---

## 🔧 Datos

Actualmente tienes **12 productos**:
- **Hombre**: 3 productos (Hoodies, Pantalones, Accesorios, Chaquetas)
- **Mujer**: 4 productos (Camisetas, Pantalones, Hoodies, Chaquetas)
- **Niños**: 5 productos (Camisetas, Hoodies, Pantalones, Accesorios)

---

## 📁 Archivos Clave

| Archivo | Descripción |
|---------|------------|
| `app/_data/products.ts` | Datos de productos con campo `gender: Gender` |
| `app/_components/CatalogFilters.tsx` | Lógica de filtrado jerárquico |
| `app/catalogo/page.tsx` | Página principal del catálogo |
| `app/globals.css` | Estilos (`.gender-filters`, `.filter-group`) |

---

## 🎨 Estilos CSS

Nuevas clases:
- `.gender-filters` - Contenedor con fondo oscuro y borde
- `.filter-group` - Grupo individual de filtros (Género o Prenda)
- `.filter-label` - Etiqueta de cada filtro (texto gris pequeño)

---

**Versión**: 2.0  
**Fecha**: 27 de febrero de 2026  
**Cambios últimos**: Sistema jerárquico de género + categorías dinámicas
