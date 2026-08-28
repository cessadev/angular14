# Car Credit Front

Frontend que consume la [Car Credit API](https://github.com/cessadev/dotnet) para la gestión de créditos de adquisición de vehículos de carga, construido con **Angular 14**, **Angular Material** y **RxJS**.

Proyecto de práctica orientado a demostrar arquitectura modular escalable, manejo reactivo de estado y formularios, y una capa de UI cuidada (temas, feedback visual, estados de carga) sobre un dominio financiero real.

---

## Stack técnico

| Categoría | Tecnología |
|---|---|
| Framework | Angular 14 |
| Reactividad | RxJS |
| Estilos | SCSS |
| Testing | Jasmine / Karma |
| Contenedores | Docker + Nginx |

---

## Arquitectura

El proyecto sigue una organización por **feature modules** con carga diferida (*lazy loading*), separando responsabilidades transversales de las específicas de cada dominio:

```
src/app/
├── core/
│   ├── interceptors/     → Manejo centralizado de errores HTTP
│   ├── models/           → Interfaces y enums que reflejan los DTOs de la API
│   └── services/         → Un servicio HTTP por recurso (Customer, Loan, Vehicle...)
├── features/
│   ├── dashboard/
│   ├── customers/
│   ├── vehicles/
│   ├── loans/
│   ├── installments/
│   └── payments/
└── shared/
    ├── components/       → Diálogos, spinners, skeletons reutilizables
    ├── directives/       → Formato numérico, tooltip, animaciones táctiles
    └── pipes/            → Formato de moneda (COP)
```

**Regla de dependencia:** cada `feature` es un `NgModule` independiente con su propio enrutamiento (`loadChildren`), sin dependencias entre sí; `core` y `shared` son las únicas capas transversales.

---

## Funcionalidades principales

- **Dashboard** con KPIs agregados (créditos activos, cartera vencida, recaudo) consumidos desde el endpoint de reportes de la API.
- **Gestión de clientes, vehículos, créditos, cuotas y pagos**: listados, creación, edición y detalle, reflejando uno a uno los recursos expuestos por el backend.
- **Simulación de créditos** antes de su creación, contra el endpoint `POST /api/loan/simulate`.
- **Registro de pagos de cuotas** con actualización reactiva del estado del crédito.
- **Consulta de cuotas vencidas**, tanto global como por crédito.

**Decisiones de diseño destacadas:**

- **Interceptor HTTP centralizado** (`ErrorInterceptor`): normaliza los errores de la API (validaciones, 404, fallas de conexión) en un mensaje legible único, evitando manejo de errores repetido en cada componente.
- **Modelos alineados al contrato de la API**: los `enums` de TypeScript usan como valor el mismo string que serializa el backend (`"CC"`, `"Months12"`), eliminando mapeos manuales entre frontend y backend.
- **Formularios reactivos con `ControlValueAccessor` personalizado**: la directiva `NumericFormatDirective` formatea valores monetarios en los inputs sin romper la integración con `ReactiveFormsModule`.
- **Pipe de moneda localizado** (`copCurrency`): formatea todos los valores monetarios en pesos colombianos de forma consistente en toda la aplicación.
- **Estados de carga con shimmer skeletons**: componentes dedicados (`table-skeleton`, `kpi-skeleton`, `detail-card-skeleton`) sustituyen a los spinners genéricos en vistas de tabla y dashboard.
- **Tema claro/oscuro persistente**: `ThemeService` gestiona el tema vía `localStorage` y clase en `<html>`, con un script inline en `index.html` para evitar parpadeos (*flash of unstyled theme*) al cargar.
- **Diseño responsive**: breakpoints consistentes en `700px` para colapsar el sidenav y adaptar el header de créditos en pantallas móviles.

---

## Cómo levantar el proyecto

### Prerrequisitos
- Node.js 18+ y npm
- La [Car Credit API](https://github.com/cessadev/dotnet) corriendo en `http://localhost:5099` (o la URL configurada en `environments/`)

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el servidor de desarrollo
ng serve
```

La aplicación queda disponible en `http://localhost:4200`, con recarga automática ante cambios.

### Pruebas unitarias

```bash
ng test
```

### Build de producción

```bash
ng build --configuration production
```

---

## Despliegue

La imagen de producción se construye en dos etapas (`Dockerfile`): compilación con Node 18 y servido estático con **Nginx**, configurado para *fallback* a `index.html` (soporte de rutas de Angular Router en recarga directa).

En el entorno de despliegue, el contenedor Nginx del frontend queda detrás de un Nginx del host actuando como reverse proxy, junto a la API y SQL Server orquestados con Docker Compose.

---

## Autor

César Urbiña
