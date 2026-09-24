 # CloudOps AWS Dashboard

 Panel interactivo en React + TypeScript para explorar una arquitectura AWS, consultar servicios, comparar regiones, estimar costos y crear propuestas de solución.

 ## Inicio rápido

 Requisitos: Node.js 20 o superior.

 ```bash
 npm install
 npm run dev
 ```

 Comandos disponibles:

 ```bash
 npm run build   # typecheck y build de producción
 npm run lint    # revisión ESLint
 npm run preview # sirve el build generado
 ```

 ## Módulos

 - **Dashboard:** resumen de recursos, costo estimado, región activa y actividad reciente.
 - **Servicios AWS:** búsqueda y filtros por categoría. Cada tarjeta abre un detalle con función, rol arquitectónico, casos de uso, capacidades, modelo de precios y enlace a la documentación oficial.
 - **Infraestructura global:** mapa interactivo y catálogo de regiones. La selección actualiza el contexto compartido; cada región muestra zonas de disponibilidad, servicios desplegados, latencia, cumplimiento, capacidad y recomendación de uso.
 - **Costos y economía cloud:** crea escenarios por servicio y cantidad. La calculadora usa `tarifa por unidad/hora x unidades x horas activas al mes`; incluye presets de 24, 160 y 730 horas, proyección anual, presupuesto, gráfico y exportación JSON.
 - **Planificación:** genera propuestas según tipo de aplicación, disponibilidad, objetivo, usuarios, región y servicios seleccionados.
 - **Seguridad y red:** consulta controles de seguridad y una vista de la arquitectura de red.

 ## Interacciones y estado

 Las acciones relevantes muestran notificaciones temporales y quedan disponibles en la bandeja del encabezado con hora y opción para limpiar el historial. El tema claro/oscuro, la región de trabajo, propuestas, actividad y estimaciones se guardan en `localStorage`. El reporte general y las estimaciones de costos se pueden exportar como JSON.

 La interfaz incluye transiciones de navegación, aparición de paneles, elevación de tarjetas y animaciones de notificaciones. Respeta `prefers-reduced-motion` para reducir movimiento cuando el sistema lo solicita.

 ## Estructura principal

 - `src/pages`: vistas de cada módulo.
 - `src/components`: layout y componentes reutilizables.
 - `src/context/CloudDataContext.tsx`: estado compartido, persistencia y notificaciones.
 - `src/data`: catálogo, regiones, costos y datos de la demo.
 - `src/types/cloud.ts`: contratos TypeScript del dominio.

 ## Alcance

 Los precios, métricas, estados y despliegues son datos simulados para demostración. No representan una cuenta AWS real ni sustituyen AWS Pricing Calculator, la documentación oficial o controles de seguridad de producción.
