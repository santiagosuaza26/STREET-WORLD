# Catálogo - Guía de Uso de Filtros

## ✅ Funcionalidades Implementadas

### 1. 🔍 **Búsqueda por Nombre**
- Busca productos por: nombre, resumen y categoría
- Input de texto en tiempo real
- Campo: "Buscar por nombre o categoría"

### 2. 🏷️ **Filtrado por Categoría**
- Botones interactivos (chips)
- Default: "Todo" (muestra todos los productos)
- Categorías disponibles: Hoodies, Pantalones, Accesorios, Camisetas, Chaquetas
- Solo una categoría activa a la vez
- Selección visual con color rojo para estado activo

### 3. 📊 **Ordenamiento**
Opciones disponibles:
- **Destacados** - Orden original (default)
- **Precio: menor a mayor** - Ascendente por precio
- **Precio: mayor a menor** - Descendente por precio
- **Nombre: A-Z** - Alfabético

### 4. 🎯 **Contador de Resultados**
- Muestra cantidad de productos filtrados en tiempo real
- Se actualiza al cambiar búsqueda, filtro u ordenamiento

---

## 🎮 Cómo Usar

### Escenario 1: Filtrar por Categoría
```
1. Ir a /catalogo
2. Click en botón "Hoodies" (o cualquier categoría)
3. Grid se actualiza mostrando solo productos de esa categoría
4. Click en "Todo" para resetear
```

### Escenario 2: Buscar Producto
```
1. Ir a /catalogo
2. Escribir en input "Buscar por nombre o categoría"
3. Ejemplos:
   - "Hoodie" → Busca en nombre
   - "Felpa" → Busca en descripción
   - "Pantalones" → Busca por categoría
```

### Escenario 3: Ordenar por Precio
```
1. Ir a /catalogo
2. Abrir select "Ordenar"
3. Seleccionar "Precio: menor a mayor" o "Precio: mayor a menor"
4. Grid se reordena automáticamente
```

### Escenario 4: Combinado
```
1. Ir a /catalogo
2. Click en categoría "Chaquetas"
3. Select "Precio: mayor a menor"
4. Grid muestra solo chaquetas ordenadas de más caro a más barato
```

---

## 📁 Archivos Relevantes

| Archivo | Propósito |
|---------|-----------|
| `app/catalogo/page.tsx` | Página principal del catálogo (ahora usa CatalogFilters) |
| `app/_components/CatalogFilters.tsx` | Componente con toda la lógica de filtrado |
| `app/_data/products.ts` | Datos de productos (nombre, precio, categoría, etc.) |
| `app/_lib/price.ts` | Funciones para parsear y formatear precios |

---

## 🎨 Estilos CSS

Clases principales:
- `.catalog-toolbar` - Área de búsqueda y ordenamiento
- `.chip-row` - Fila de botones de categoría
- `.chip.active` - Estado activo de categoría (fondo rojo)
- `.catalog-grid` - Grid de productos (responsive)
- `.catalog-count` - Contador de resultados

---

## 🔧 Estados de Los Filtros

| Campo | Estado | Comportamiento |
|-------|--------|----------------|
| Búsqueda | Vacío | Muestra todos |
| Búsqueda | Con texto | Filtra en tiempo real |
| Categoría | "Todo" | Muestra todas las categorías |
| Categoría | Específica | Solo esa categoría |
| Ordenamiento | Destac. | Orden original |
| Ordenamiento | Precio ↑ | Mayor a menor |
| Ordenamiento | Precio ↓ | Menor a mayor |
| Ordenamiento | A-Z | Alfabético |

---

## 📝 Notas

- Los filtros son **independientes y combinables**
- El orden de aplicación no importa (búsqueda + categoría + ordenamiento se aplican simultáneamente gracias a `useMemo`)
- Los cambios son **instantáneos** (sin necesidad de botón "Buscar")
- El contador se actualiza automáticamente
- La URL no cambia (todo es estado local del componente)

---

**Versión**: 1.0  
**Última actualización**: 27 de febrero de 2026
