import type { TranslationKey } from "./en";

export const es: Record<TranslationKey, string> = {
  "nav.docs": "Documentación",
  "nav.playground": "Playground",
  "nav.releases": "Versiones",
  "nav.packages": "Paquetes",
  "nav.home": "Inicio",
  "nav.overview": "Vista general",
  "nav.overviewHint": "Instalación, características y puntos de entrada",
  "nav.docsHint": "Guías generadas desde el README",
  "nav.playgroundHint": "Ejemplos en vivo del paquete publicado",
  "nav.releasesHint": "Cada versión y sus notas",

  "common.getStarted": "Comenzar",
  "common.viewGithub": "Ver en GitHub",
  "common.viewNpm": "Ver en npm",
  "common.install": "Instalar",
  "common.installWith": "Instala con tu gestor de paquetes",
  "common.copy": "Copiar",
  "common.copied": "Copiado",
  "common.version": "Versión",
  "common.prerelease": "Versión previa",
  "common.latest": "Última",
  "common.license": "Licencia MIT",
  "common.typescript": "TypeScript",

  "hub.eyebrow": "Librerías de código abierto para aplicaciones React",
  "hub.title": "Listas de datos y carga de archivos, resueltas una sola vez.",
  "hub.subtitle":
    "Dos kits en TypeScript para las partes de un producto que cada equipo vuelve a construir: una vista de lista configurable con búsqueda, filtros, paginación y exportación, y un contrato de carga de archivos que el navegador y el servidor validan en conjunto.",
  "hub.kitsTitle": "Los kits",
  "hub.kitsSubtitle":
    "Cada paquete se publica en npm bajo licencia MIT, incluye su propia capa de Tailwind v4 y está documentado en inglés y en español.",
  "hub.principlesTitle": "Lo que tienen en común",
  "hub.principle.contract.title": "Una definición, ambos lados",
  "hub.principle.contract.body":
    "Una lista es un único objeto de configuración; un scope de carga es una única declaración. El cliente y el servidor leen la misma fuente, así que nada se desalinea seis meses después.",
  "hub.principle.headless.title":
    "Con estilos por defecto, headless cuando lo necesitas",
  "hub.principle.headless.body":
    "Usa los componentes incluidos con un tema de Tailwind v4, o baja a los hooks y primitivas y aporta tu propio sistema de diseño.",
  "hub.principle.ssr.title": "Pensados para el App Router",
  "hub.principle.ssr.body":
    "El renderizado en servidor, los route handlers y los adaptadores para Next.js son de primera clase, no un añadido. Express está soportado donde interviene un servidor.",
  "hub.principle.i18n.title": "Cada texto es reemplazable",
  "hub.principle.i18n.body":
    "Ambos kits incluyen conjuntos de etiquetas en inglés y español y aceptan sobrescribir cualquier texto visible para el usuario.",
  "hub.howTitle": "Cómo funciona este sitio",
  "hub.how.readme.title": "El README es la fuente de verdad",
  "hub.how.readme.body":
    "Cada página de documentación se genera en tiempo de compilación a partir del README publicado del paquete, en ambos idiomas. npm, GitHub y este sitio no pueden contradecirse.",
  "hub.how.playground.title": "Los playgrounds ejecutan el paquete publicado",
  "hub.how.playground.body":
    "Cada demo importa la versión exacta disponible en npm, igual que lo haría tu aplicación. Lo que ves es lo que instalas.",
  "hub.how.releases.title": "Las versiones provienen de GitHub",
  "hub.how.releases.body":
    "Cada versión, con sus notas, directamente de los releases del repositorio. Nada se transcribe a mano.",

  "landing.installTitle": "Instalación",
  "landing.featuresTitle": "Características",
  "landing.featuresSubtitle":
    "Todo lo que incluye el paquete, según su propio README.",
  "landing.subpathsTitle": "Puntos de entrada",
  "landing.subpathsSubtitle":
    "Importa solo lo que usas; cada subpath se optimiza de forma independiente.",
  "docs.onThisPage": "En esta página",
  "docs.previous": "Anterior",
  "docs.next": "Siguiente",

  "playground.title": "Playground",
  "playground.subtitle":
    "Demostraciones en vivo del paquete publicado. Cada ejemplo importa la versión exacta disponible en npm.",
  "playground.source": "Código",
  "playground.preview": "Vista previa",
  "playground.case.hello.title": "Vista general",
  "playground.case.hello.description":
    "La lista completa: búsqueda, filtros, ordenamiento, paginación, tabla y tarjetas desde una sola configuración.",
  "playground.case.filters.title": "Todos los tipos de filtro",
  "playground.case.filters.description":
    "Texto, selección, selección múltiple, booleano, rango numérico y rango de fechas, cada uno como pill rápida y en el panel lateral.",
  "playground.case.cards.title": "Tarjetas y tema personalizados",
  "playground.case.cards.description":
    "Un tema de marca fuera de las paletas integradas y un renderizador de tarjeta que recibe el contexto de la lista.",
  "playground.case.selection.title": "Selección de filas",
  "playground.case.selection.description":
    "Casillas, acciones masivas y selección de todos los resultados coincidentes, incluido lo que recibiría un servidor.",
  "playground.case.primitives.title": "Solo primitivas",
  "playground.case.primitives.description":
    "Table, Cards, Pagination y SearchInput controlados por tu propio estado, sin configuración ni provider.",
  "playground.case.basic.title": "Un solo archivo",
  "playground.case.basic.description":
    "Una zona, un archivo. Validación, carga y el descriptor almacenado que devuelve el servidor.",
  "playground.case.multiple.title": "Varios archivos",
  "playground.case.multiple.description":
    "Progreso por lote, cancelación por archivo y un máximo de archivos aplicado antes de enviar nada.",
  "playground.case.avatar.title": "Preset de avatar",
  "playground.case.avatar.description":
    "La imagen es el control: suelta una encima, se comprime a 512px y reemplaza la anterior.",
  "playground.case.gallery.title": "Preset de galería",
  "playground.case.gallery.description":
    "Mosaicos construidos a partir de la vista previa de cada archivo, con un visor a pantalla completa sobre el conjunto.",
  "playground.case.validation.title": "Validación",
  "playground.case.validation.description":
    "Extensión incorrecta, archivo demasiado grande y un archivo renombrado detectado por su firma binaria, todo antes de subir.",
  "playground.case.retry.title": "Reintentos y concurrencia",
  "playground.case.retry.description":
    "Una red inestable simulada que falla dos veces por archivo; el reintento con backoff lo absorbe y un límite de concurrencia pone en cola el resto.",
  "playground.case.viewer.title": "Visor de archivos por separado",
  "playground.case.viewer.description":
    "FileViewer sin uploader: imágenes, PDF y un respaldo para lo demás, reutilizable donde la app ya tenga archivos almacenados.",
  "playground.case.headless.title": "Headless",
  "playground.case.headless.description":
    "Sin la UI incluida: el hook controla una interfaz completamente propia, con su propio anillo de progreso y controles.",
  "playground.case.server.title": "Ida y vuelta real al servidor",
  "playground.case.server.description":
    "Este caso envía a un route handler de este sitio respaldado por el proveedor en memoria. Nada se persiste.",

  "releases.title": "Versiones",
  "releases.subtitle":
    "Cada versión publicada, con sus notas, desde GitHub Releases.",
  "releases.published": "Publicada el {date}",
  "releases.index": "Versiones",
  "faq.title": "Preguntas frecuentes",
  "faq.subtitle":
    "Las preguntas que surgen con más frecuencia sobre estos paquetes.",
  "faq.origin.q": "¿Por qué el historial de versiones empieza donde empieza?",
  "faq.origin.a":
    "Ambos paquetes nacieron como soluciones internas construidas para una empresa con la que trabajo, y se desarrollaron de forma privada durante varias versiones mayores. Cuando quedó claro que los problemas que resuelven son los mismos que enfrenta cualquier proyecto React, los publiqué bajo licencia MIT como paquetes de código abierto independientes. Por eso el historial público comienza en el punto en que pasaron a ser open source, no en la primera línea de código. El linaje privado no se publica, y estas versiones se mantienen de forma separada.",
  "faq.why.q": "¿Por qué liberarlos como código abierto?",
  "faq.why.a":
    "Por dos razones. Me son útiles en mis propios proyectos, y mantenerlos públicos obliga a documentarlos, probarlos y versionarlos correctamente en lugar de copiarlos entre repositorios. Además, una lista de datos o un contrato de carga son trabajo que todo equipo repite; un paquete mantenido le ahorra ese tiempo a quien lo necesite.",
  "faq.production.q": "¿Están listos para producción?",
  "faq.production.a":
    "Hoy se ejecutan en aplicaciones en producción, incluyen una suite de pruebas completa, publican declaraciones de tipos y se liberan mediante un pipeline automatizado con changelog por versión. También son librerías pequeñas y enfocadas, mantenidas por una sola persona y a la vista de todos, así que revisa la documentación y evalúa si encajan en tu caso.",
  "faq.contribute.q": "¿Puedo reportar un problema o contribuir?",
  "faq.contribute.a":
    "Sí. Los issues y pull requests son bienvenidos en el repositorio de cada paquete. Ambos se construyeron para resolver bien un problema concreto, no para cubrir todos los casos, así que un reporte que describa tu caso es una aportación genuinamente valiosa.",
  "faq.together.q": "¿Necesito ambos paquetes?",
  "faq.together.a":
    "No. Comparten convenciones y lenguaje de diseño, pero no dependen entre sí: cada uno se instala y se usa por separado.",
  "faq.stack.q": "¿Qué requieren?",
  "faq.stack.a":
    "React 18 o 19, TypeScript y Tailwind CSS v4 para la capa con estilos. Ambos funcionan con el App Router de Next.js y con cualquier configuración de React; uploaderkit incluye además routers para Next.js y Express donde interviene un servidor.",

  "footer.builtBy": "Desarrollado por {author}",
  "footer.sourceCode": "Código del sitio",

  "lang.switch": "Cambiar idioma",
  "lang.en": "English",
  "lang.es": "Español",
};
