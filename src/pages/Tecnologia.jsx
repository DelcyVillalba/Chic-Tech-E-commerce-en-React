import { useEffect, useMemo, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import DealCard from "../components/DealCard";
import QuickViewModal from "../components/QuickViewModal";
import CategoryCatalog from "../components/CategoryCatalog";
import SubscribeBanner from "../components/SubscribeBanner";

// Carrusel reutilizable (similar al de Mujer/Home)
function usePerPage(config = { mobile: 1, tablet: 2, desktop: 4 }) {
  const calc = () => {
    if (typeof window === "undefined") return config.desktop;
    const w = window.innerWidth;
    if (w < 640) return config.mobile;
    if (w < 1024) return config.tablet;
    return config.desktop;
  };
  const [perPage, setPerPage] = useState(calc);

  useEffect(() => {
    const onResize = () => setPerPage(calc());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return perPage;
}

function Carousel({ items, renderItem, perPageConfig, dotsId }) {
  const perPage = usePerPage(perPageConfig);
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  useEffect(() => {
    setPage(0);
  }, [perPage, items.length]);

  const start = page * perPage;
  const visible = items.slice(start, start + perPage);

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <button
          className="h-10 w-10 grid place-items-center rounded-full border text-gray-600 dark:text-gray-300 dark:border-[#2a2338] disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page <= 0}
          aria-label="Anterior"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visible.map((item, idx) => (
              <div key={idx}>{renderItem(item)}</div>
            ))}
          </div>
        </div>
        <button
          className="h-10 w-10 grid place-items-center rounded-full border text-gray-600 dark:text-gray-300 dark:border-[#2a2338] disabled:opacity-40"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          aria-label="Siguiente"
        >
          →
        </button>
      </div>
      <div
        className="flex justify-center gap-2 mt-3"
        role="tablist"
        aria-label={dotsId || "paginacion"}
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`h-2.5 w-2.5 rounded-full border ${
              i === page
                ? "bg-[#c2185b] border-[#c2185b]"
                : "bg-white dark:bg-[#1c1828]"
            }`}
            aria-label={`Ir a página ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Tecnologia() {
  const { data, loading, error } = useProducts({ category: "tecnologia" });
  const catalogoId = "catalogo-tecnologia";
  const [tab, setTab] = useState("recien"); // recien | vendidos | oferta
  const [quick, setQuick] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showAllPosts, setShowAllPosts] = useState(false);

  const scrollToCatalogo = () => {
    const el = document.getElementById(catalogoId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleBackToBlog = () => {
    setSelectedPost(null);
  };

  const handleShowAllPosts = () => {
    setShowAllPosts(true);
  };

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  const blogPosts = [
    {
      id: 1,
      img: "/tecnologia/samsung-s25-ultra.jpg",
      title: "Samsung Galaxy S25 Ultra: Review real",
      date: "28 de noviembre de 2025",
      excerpt:
        "Cámara 200MP con IA, chip Snapdragon 8 Elite y batería de 5000mAh. ¿Samsung vuelve al trono?",
      category: "Smartphones",
      readTime: "8 min lectura",
      slug: "samsung-galaxy-s25-ultra-review",
      content: `
        <h2>Introducción</h2>
        <p>Anunciado el 22 de enero y lanzado el 7 de febrero de 2025, el Galaxy S25 Ultra llega con ambiciones claras: recuperar el crown perdido. Con una cámara de 200MP potenciada por IA y el nuevo chip Snapdragon 8 Elite para Galaxy, ¿logra superar a la competencia?</p>
        
        <h2>Diseño y Materiales</h2>
        <p>El titanio grado 2 se siente increíblemente premium. El diseño es ligeramente más delgado que su predecesor (8.2mm vs 8.6mm), pero mantiene la resistencia IP68. Los bordes son más suaves al tacto, y el nuevo color "Titanium Mystic Black" es espectacular.</p>
        
        <h2>La Cámara: IA como Protagonista</h2>
        <p>El salto a 200MP es impresionante, pero lo realmente revolucionario es el procesamiento con IA. Las fotos nocturnas ahora capturan detalles que antes eran imposibles, y el modo retrato con "AI Depth Mapping" es casi perfecto.</p>
        
        <h3>Zoom Híbrido Mejorado con IA</h3>
        <p>El zoom híbrido de 100X ahora estabiliza imágenes con mayor precisión gracias a las mejoras de IA. Puedes leer texto a larga distancia con claridad mejorada. La IA predice el movimiento y compensa el temblor de manos en tiempo real.</p>
        
        <h2>Rendimiento: Snapdragon 8 Elite para Galaxy</h2>
        <p>El nuevo chip personalizado de Qualcomm es una bestia. Los benchmarks muestran un rendimiento significativamente superior al Gen 3, con mejoras notables en eficiencia energética. El chip "Elite para Galaxy" es la versión optimizada exclusiva de Samsung.</p>
        
        <h2>Batería y Carga Real</h2>
        <p>Los 5000mAh garantizan un día completo de uso, y a veces más con uso moderado. La carga rápida de 45W te lleva del 0 al 70% en 30 minutos. Además, soporta carga inalámbrica inversa de 15W para cargar otros dispositivos.</p>
        
        <h2>Android 15 con One UI 7</h2>
        <p>Lanzado con Android 15 y One UI 7, la interfaz es más fluida que nunca. Galaxy AI ahora puede traducir conversaciones en tiempo real, resumir reuniones automáticamente y organizar tus fotos por eventos sin intervención manual.</p>
        
        <h2>Especificaciones Clave</h2>
        <p><strong>Procesador:</strong> Snapdragon 8 Elite para Galaxy<br/>
        <strong>Batería:</strong> 5000mAh (un día completo garantizado)<br/>
        <strong>Pantalla:</strong> Dynamic AMOLED 2X 6.8", 120Hz, 2500 nits<br/>
        <strong>Cámaras:</strong> 200MP principal, 12MP ultra wide, 50MP telephoto 5x, 10MP telephoto 3x<br/>
        <strong>Almacenamiento:</strong> 256GB/512GB/1TB UFS 4.0<br/>
        <strong>Resistencia:</strong> IP68, Gorilla Glass Victus 2</p>
        
        <h2>¿Vale la Pena en 2025?</h2>
        <p>Si buscas el mejor Android del mercado, definitivamente sí. La combinación de hardware premium y software inteligente lo hace casi perfecto. Solo el precio podría ser un impedimento para algunos usuarios.</p>
        
        <h2>Conclusión</h2>
        <p>El Galaxy S25 Ultra es considerado por las principales publicaciones de tecnología como el mejor smartphone Android de 2025. Samsung ha logrado el equilibrio perfecto entre innovación y usabilidad. Recomendado para quienes buscan lo máximo en Android.</p>
      `,
    },
    {
      id: 2,
      img: "/tecnologia/apple-vision-pro.jpg",
      title: "Apple Vision Pro: Un año después, ¿vale la pena?",
      date: "25 de noviembre de 2025",
      excerpt:
        "Lanzado en febrero 2024, el headset de $3499 sigue siendo el más avanzado. ¿Realidad mixta para todos o solo para early adopters?",
      category: "Realidad Virtual",
      readTime: "10 min lectura",
      slug: "apple-vision-pro-review-2025",
      content: `
        <h2>Introducción</h2>
        <p>Casi dos años después de su lanzamiento en febrero 2024, el Apple Vision Pro sigue siendo el dispositivo de realidad mixta más avanzado del mercado. A $3499, ¿ha logrado trascender el nicho de early adopters o sigue siendo un producto para pocos?</p>
        
        <h2>Diseño y Construcción Real</h2>
        <p>El Vision Pro pesa aproximadamente 600-650g sin batería, más de 1kg con ella. El diseño de aluminrio y vidrio premium se siente de alta calidad, pero el peso causa fatiga en sesiones prolongadas. Las correas ajustables ayudan, pero no eliminan completamente el problema.</p>
        
        <h2>Pantallas Micro-OLED Impresionantes</h2>
        <p>Las dos pantallas Micro-OLED de 23MP cada una ofrecen más de 4K por ojo con 90Hz de refresh rate. El brillo máximo es de 1000 nits, y los colores son increíblemente vibrantes. El "Eye Tracking" es sorprendentemente preciso para controlar la interfaz.</p>
        
        <h2>Ecosistema de Apps en 2025</h2>
        <p>El ecosistema ha crecido significativamente. Ahora hay miles de apps optimizadas, incluyendo herramientas de productividad, juegos inmersivos y experiencias de entretenimiento. Adobe ofrece algunas herramientas básicas, pero las suites completas nativas aún no son una realidad.</p>
        
        <h3>Apps Destacadas Disponibles</h3>
        <p>- Microsoft Office (Word, Excel, PowerPoint)<br/>
        - Safari con múltiples ventanas virtuales<br/>
        - Apple TV con pantalla virtual inmersiva<br/>
        - Juegos optimizados para spatial computing<br/>
        - Apps de productividad como Notion y Slack</p>
        
        <h2>visionOS: Evolución Continua</h2>
        <p>El sistema operativo ha recibido actualizaciones significativas. visionOS 1.x ha mejorado el rendimiento, añadido más gestos hand tracking y optimizado la integración con Mac. Puedes usar tu MacBook como monitor virtual, pero la experiencia aún tiene latencia.</p>
        
        <h2>Batería y Autonomía Real</h2>
        <p>La batería externa dura aproximadamente 2-2.5 horas de uso general. Con uso intensivo (gaming o video 4K), la autonomía se reduce a 1.5-2 horas. La carga completa toma aproximadamente 2.5 horas con el cargador de 30W.</p>
        
        <h2>Rendimiento y Experiencia</h2>
        <p>El chip M2 con coprocesador R1 ofrece rendimiento excelente. Las apps corren fluidamente, los videos 4K se reproducen sin problemas, y la passthrough de realidad aumentada es impresionantemente clara y sin latencia perceptible.</p>
        
        <h2>¿Para Quién Es en 2025?</h2>
        <p><strong>Perfecto para:</strong> Desarrolladores, creativos profesionales, presentaciones inmersivas, entusiastas de tecnología con presupuesto alto.<br/>
        <strong>No para:</strong> Usuarios casuales, gamers que buscan VR tradicional, personas con presupuesto limitado.</p>
        
        <h2>El Mercado Actual</h2>
        <p>Las ventas han sido modestas pero consistentes. Apple ha posicionado el Vision Pro como un dispositivo "pro" más que como un producto masivo. La competencia (Meta Quest 3, PSVR2) es más asequible pero tecnológicamente inferior.</p>
        
        <h2>¿Vale la Pena en 2025?</h2>
        <p>Si eres desarrollador o creativo profesional que necesita las mejores herramientas de realidad mixta, absolutamente sí. Si buscas entretenimiento casual, hay opciones mucho más económicas.</p>
        
        <h2>Conclusión</h2>
        <p>El Apple Vision Pro sigue siendo el dispositivo de realidad mixta más impresionante del mercado, pero su precio alto y limitaciones prácticas lo mantienen como un producto de nicho. No es para todos, pero para quienes pueden aprovechar su potencial, es insuperable.</p>
      `,
    },
    {
      id: 3,
      img: "/tecnologia/chatgpt-5-gemini-3.jpg",
      title: "ChatGPT-5 vs Gemini 3 Pro: La batalla final",
      date: "22 de noviembre de 2025",
      excerpt:
        "OpenAI y Google lanzan sus modelos más avanzados. ¿Quién gana la carrera de la IA en 2025?",
      category: "Inteligencia Artificial",
      readTime: "12 min lectura",
      slug: "chatgpt-5-gemini-3-batalla",
      content: `
        <h2>Introducción</h2>
        <p>2025 marca el punto de inflexión en la IA. ChatGPT-5 de OpenAI (lanzado en agosto 2025) y Gemini 3 Pro de Google (lanzado en noviembre 2025) representan lo mejor de cada enfoque. Después de probar ambos extensivamente, te damos el veredicto definitivo.</p>
        
        <h2>ChatGPT-5: El Especialista Multimodal</h2>
        <p>OpenAI ha perfeccionado el modelo. GPT-5 entiende contexto de manera casi humana, puede analizar videos en tiempo real y generar código que funciona sin debugging. Su precisión en tareas técnicas es notablemente superior.</p>
        
        <h3>Capacidades Destacadas</h3>
        <p>- Razonamiento matemático a nivel PhD<br/>
        - Generación de arte 4K coherente<br/>
        - Análisis de video frame por frame<br/>
        - Code generation con arquitecturas completas<br/>
        - Mayor precisión en desarrollo de software</p>
        
        <h2>Gemini 3 Pro: El Integrador Universal</h2>
        <p>Google apuesta por la integración total. Gemini 3 Pro conecta Gmail, Drive, Calendar y Search en tiempo real, creando un asistente verdaderamente omnipresente. Su fortaleza es el contexto personal.</p>
        
        <h3>Superpoderes de Gemini 3</h3>
        <p>- Acceso a toda tu información personal<br/>
        - Búsqueda web en tiempo real<br/>
        - Integración perfecta con Workspace<br/>
        - Multilingüismo perfecto en 100+ idiomas<br/>
        - Contexto personal profundo y continuo</p>
        
        <h2>Velocidad y Eficiencia</h2>
        <p>ChatGPT-5 es más rápido en tareas específicas: genera código 40% más rápido que Gemini 3 Pro y con mayor precisión. Pero Gemini 3 Pro brilla en tareas complejas que requieren información personal y contextual.</p>
        
        <h2>Rendimiento en Codificación</h2>
        <p>Evaluaciones comparativas reales demuestran que ChatGPT-5 es superior para desarrollo de software: genera código más limpio, con menos errores y mejor estructurado. Gemini 3 Pro es bueno, pero ChatGPT-5 es excepcional.</p>
        
        <h2>Precios y Disponibilidad</h2>
        <p>ChatGPT-5: $29/mes para Pro, $199/mes para Enterprise<br/>
        Gemini 3 Pro: $20/mes incluido en Google One, $150/mes para Workspace</p>
        
        <h2>Casos de Uso</h2>
        <p><strong>Para programadores:</strong> ChatGPT-5 es superior (mayor precisión)<br/>
        <strong>Para negocios:</strong> Gemini 3 Pro gana por integración<br/>
        <strong>Para creativos:</strong> Empate, pero ChatGPT-5 tiene mejor arte<br/>
        <strong>Para estudiantes:</strong> Gemini 3 Pro por acceso a research</p>
        
        <h2>Integración Personal vs Especialización</h2>
        <p>La elección clave: ¿prefieres IA que conoce tu vida personal (Gemini 3 Pro) o IA que es técnicamente superior (ChatGPT-5)? Ambos enfoques tienen méritos.</p>
        
        <h2>El Futuro de la IA</h2>
        <p>Ambos modelos son increíblemente capaces y representan el estado del arte en 2025. La elección depende de tu ecosistema: si estás en Apple/Microsoft, ChatGPT-5. Si vives en Google, Gemini 3 Pro.</p>
        
        <h2>Conclusión Final</h2>
        <p>No hay un ganador claro, solo diferentes filosofías. ChatGPT-5 es técnicamente superior, Gemini 3 Pro es más personal. La buena noticia: la IA ha llegado para quedarse, y nunca ha sido tan útil.</p>
      `,
    },
    {
      id: 4,
      img: "/tecnologia/tesla-cybertruck-nov-2025.jpg",
      title:
        "Cybertruck de Tesla: El debut global y sus desafíos en Noviembre 2025",
      date: "30 de Noviembre de 2025",
      excerpt:
        "Entregas en Corea del Sur, problemas bajo la lluvia y la nueva versión FSD V14. ¿Vale la pena la camioneta futurista?",
      category: "Vehículos Eléctricos",
      readTime: "10 min lectura",
      slug: "tesla-cybertruck-review-nov-2025",
      content: `
        <h2>Introducción</h2>
        <p>A finales de 2025, el Tesla Cybertruck sigue generando titulares, esta vez por su expansión a mercados fuera de Norteamérica y por las continuas actualizaciones de software que buscan perfeccionar su funcionalidad y rendimiento.</p>
        
        <h2>Novedades y Especificaciones Reales (Nov 2025)</h2>
        <p>El Cybertruck, con su exoesqueleto de acero inoxidable y diseño futurista, ha completado sus primeras entregas en <strong>Corea del Sur</strong> en noviembre de 2025. A diferencia de los rumores, estas son las especificaciones confirmadas para los modelos AWD y Cyberbeast:</p>
        
        <h3>Especificaciones Clave:</h3>
        <p><strong>Autonomía EPA (AWD):</strong> Aproximadamente 520 km (325 millas). Con el extensor de autonomía opcional (disponible en 2025), puede alcanzar cifras mayores, aunque a costa de espacio en la caja.<br/>
        <strong>Batería:</strong> Capacidad útil de unos 123 kWh.<br/>
        <strong>Carga:</strong> Soporta Supercarga de hasta <strong>250 kW</strong>.<br/>
        <strong>Aceleración (Cyberbeast):</strong> 0-100 km/h en menos de 2.7 segundos (0-60 mph en 2.6s).<br/>
        <strong>Potencia (AWD):</strong> Cerca de 600 caballos de fuerza (HP).<br/>
        <strong>Capacidad de Remolque:</strong> Hasta 5 toneladas (11,000 lbs).<br/>
        <strong>Suspensión:</strong> Suspensión neumática adaptativa con hasta 40 cm (16 pulgadas) de distancia al suelo en modo "Extract".</p>
        
        <h2>Software y Actualizaciones Recientes (Nov 2025)</h2>
        <p>Tesla ha continuado desplegando actualizaciones de software over-the-air (OTA). En noviembre de 2025, se lanzó la versión <strong>FSD (Full Self-Driving) v14.1.7</strong> y la actualización general <strong>2025.44</strong>, que prepara el terreno para la "Holiday Update" y optimiza la experiencia de conducción y las funciones de infoentretenimiento.</p>
        
        <p>Se espera que la funcionalidad FSD Supervisado llegue a la Cybertruck a finales de 2025.</p>
        
        <h2>Problemas Reportados</h2>
        <p>A pesar de su diseño robusto, algunos propietarios han reportado fallos en los sistemas electrónicos y de software al conducir bajo la lluvia, poniendo a prueba la durabilidad tecnológica del modelo. Tesla suele abordar estos problemas mediante actualizaciones de software rápidas, como lo hizo con un retiro (recall) del sistema de iluminación Off-Road Lightbar en noviembre.</p>
        
        <h2>Precios y Disponibilidad</h2>
        <p>En EE. UU., los precios estimados de mercado para el modelo 2025 oscilan entre <strong>$70,000 y $100,000 USD</strong> dependiendo de la versión. En mercados de importación como Argentina, los precios superan los $250,000 USD debido a impuestos y aranceles.</p>
        
        <h2>Conclusión</h2>
        <p>El Cybertruck de 2025 es un vehículo polarizante y tecnológicamente avanzado, que sigue evolucionando rápidamente a través del software. Lidera en capacidad de remolque y rendimiento entre las pickups eléctricas, pero enfrenta los desafíos iniciales de ser un producto de primera generación con un diseño radical.</p>
      `,
    },
    {
      id: 5,
      img: "/tecnologia/playstation-5-pro-xbox-series-x.jpg",
      title: "PlayStation 5 Pro vs Xbox Series X: El estado actual",
      date: "18 de noviembre de 2025",
      excerpt:
        "PS5 Pro con ray tracing mejorado vs Series X con Game Pass. ¿Cuál consola domina en 2025?",
      category: "Gaming",
      readTime: "11 min lectura",
      slug: "playstation-5-pro-xbox-series-x-2025",
      content: `
        <h2>Introducción</h2>
        <p>A finales de 2025, el mercado de consolas está en un punto interesante. La PlayStation 5 Pro ya está disponible desde septiembre de 2024, mientras que Xbox Series X sigue siendo la referencia de Microsoft. ¿Cuál vale la pena comprar hoy?</p>
        
        <h2>PlayStation 5 Pro: El Refinamiento</h2>
        <p>Lanzada en septiembre de 2024, la PS5 Pro es una versión mejorada de la consola original. CPU AMD Zen 2 a 3.85GHz (17% más rápida), GPU mejorada con 16.7 TFLOPs (45% más poderosa) y 16GB de memoria GDDR6.</p>
        
        <h3>Características Destacadas</h3>
        <p>- SSD de 2TB (1TB más que la estándar)<br/>
        - Ray tracing acelerado por hardware<br/>
        - Soporte para 4K a 60fps estable<br/>
        - Modo de rendimiento para 120fps selectivo<br/>
        - Compatible 100% con PS4/PS5</p>
        
        <h2>Xbox Series X: La Consistencia</h2>
        <p>La Series X sigue siendo la consola más potente de Microsoft desde 2020. CPU AMD Zen 2 a 3.8GHz, GPU de 12.15 TFLOPs y 16GB de memoria GDDR6. Su gran ventaja: el ecosistema Game Pass.</p>
        
        <h3>Ventajas de Xbox</h3>
        <p>- Xbox Game Pass Ultimate con 500+ juegos<br/>
        - Quick Resume para múltiples juegos<br/>
        - Retrocompatibilidad con Xbox, Xbox 360 y Xbox One<br/>
        - Smart Delivery para actualizaciones gratuitas<br/>
        - Xbox Cloud Gaming (xCloud)</p>
        
        <h2>Juegos Exclusivos Actuales</h2>
        <p><strong>PlayStation:</strong> Marvel's Spider-Man 2, God of War Ragnarök, The Last of Us Part I, Horizon Forbidden West, Ratchet & Clank: Rift Apart<br/>
        <strong>Xbox:</strong> Starfield, Halo Infinite, Forza Motorsport, Fable, Gears of War, Age of Empires IV</p>
        
        <h2>Rendimiento Real Comparado</h2>
        <p>La PS5 Pro es aproximadamente 35% más potente que la Series X en juegos optimizados. Sin embargo, la Series X mantiene un rendimiento consistente en todos los títulos. La diferencia más notable es en juegos con ray tracing.</p>
        
        <h2>Precios Actuales (Noviembre 2025)</h2>
        <p>PS5 Pro: $699 (disponibilidad limitada)<br/>
        Xbox Series X: $499 (disponibilidad amplia)<br/>
        Xbox Game Pass Ultimate: $19.99/mes<br/>
        PlayStation Plus Premium: $17.99/mes</p>
        
        <h2>Ecosistema y Servicios</h2>
        <p><strong>PlayStation Plus Premium:</strong> 700+ juegos, streaming clásico, pruebas de tiempo limitado<br/>
        <strong>Xbox Game Pass Ultimate:</strong> 500+ juegos día uno, cloud gaming, EA Play, descuentos exclusivos</p>
        
        <h2>¿Qué Hay del Futuro?</h2>
        <p>Se espera que PlayStation 6 llegue entre finales de 2027 y 2028. Xbox podría lanzar una consola portátil a finales de 2025, pero la "Next Gen" principal también se espera para 2027-2028.</p>
        
        <h2>¿Para Quién Es Cada Una?</h2>
        <p><strong>PS5 Pro:</strong> Gamers que quieren el mejor rendimiento posible y exclusivos de alta calidad<br/>
        <strong>Series X:</strong> Gamers que quieren mejor valor por dinero y acceso a la mayor biblioteca de juegos</p>
        
        <h2>El Mercado en 2025</h2>
        <p>La PS5 Pro es para entusiastas con presupuesto alto. La Series X sigue siendo la mejor opción para la mayoría de los gamers gracias a Game Pass y su precio más accesible.</p>
        
        <h2>Conclusión</h2>
        <p>Si dinero no es problema y quieres el máximo rendimiento, la PS5 Pro es la elección. Si buscas el mejor valor y acceso a más juegos, la Series X con Game Pass es imbatible. Ambas son excelentes consolas, pero sirven a diferentes tipos de gamers.</p>
      `,
    },
    {
      id: 6,
      img: "/tecnologia/samsung-galaxy-fold-6.jpg",
      title: "Samsung Galaxy Z Fold6: Review real",
      date: "10 de Julio de 2024",
      excerpt:
        "Cresta mejorada, Snapdragon 8 Gen 3 y Android 14. ¿El mejor foldable de 2024?",
      category: "Smartphones",
      readTime: "8 min lectura",
      slug: "samsung-galaxy-fold-6-review-real",
      content: `
        <h2>Introducción</h2>
        <p>Samsung lanza el Galaxy Z Fold6 con mejoras incrementales pero significativas. Aunque no revoluciona la categoría, consolida su posición como el foldable más maduro del mercado. ¿Vale la pena el upgrade?</p>
        
        <h2>Diseño y Construcción</h2>
        <p>El armor aluminum frame es más resistente que nunca. El dispositivo es 1.4mm más delgado que el Fold5 y 14g más ligero (239g). La certificación IP48 ofrece resistencia al agua y polvo, aunque no es tan robusta como la IP68 de los teléfonos tradicionales.</p>
        
        <h2>La Mejora: Cresta Reducida</h2>
        <p>El gran avance: la cresta central es significativamente menos pronunciada. Aunque sigue siendo visible a ciertos ángulos, es mucho menos molesta al usar la pantalla principal. El mecanismo de bisagra es más silencioso y robusto.</p>
        
        <h2>Pantallas Reales</h2>
        <p><strong>Exterior (Cover):</strong> 6.3" Dynamic AMOLED 2X, 120Hz, 2600 nits peak<br/>
        <strong>Interior (Main):</strong> 7.6" Dynamic AMOLED 2X, 120Hz, 2600 nits peak<br/>
        Ambas soportan HDR10+ y son increíblemente brillantes incluso bajo el sol directo</p>
        
        <h2>Rendimiento: Snapdragon 8 Gen 3 for Galaxy</h2>
        <p>El chip personalizado de Qualcomm ofrece excelente rendimiento. Las apps se ejecutan sin problemas en ambas pantallas, y la transición entre modos es instantánea. 12GB de RAM LPDDR5X aseguran multitasking fluido.</p>
        
        <h2>Batería y Carga Real</h2>
        <p>Batería de 4400mAh (típica) que dura un día completo con uso moderado. Con uso intensivo, necesitarás carga a media tarde. Carga rápida de 25W (lenta para el precio) y wireless 15W.</p>
        
        <h2>Cámara Sistema Triple</h2>
        <p>- Principal: 50MP f/1.8 con OIS y sensor de 1/1.56"<br/>
        - Ultra Wide: 12MP f/2.2, 120° FOV<br/>
        - Telephoto: 10MP f/2.4 con 3x zoom óptico y OIS<br/>
        Calidad similar al Galaxy S24, excelente para un foldable</p>
        
        <h2>Android 14 con One UI 6.1.1</h2>
        <p>Lanzado con Android 14 (no Android 15 como se rumoreaba). One UI 6.1.1 está optimizado para foldables con mejoras en Multi-window y Flex Mode. Actualización garantizada a Android 15 y 4 años más de seguridad.</p>
        
        <h2>Apps Optimizadas</h2>
        <p>Google Docs, Microsoft Office, y apps de Adobe funcionan bien en modo tablet. La experiencia es similar a un tablet pequeño, pero algunas apps aún no aprovechan el formato plegable completamente.</p>
        
        <h2>Especificaciones Reales</h2>
        <p>✅ Cresta significativamente reducida<br/>
        ✅ Pantallas más brillantes (2600 nits)<br/>
        ✅ Construcción premium y ligera<br/>
        ✅ Software optimizado<br/>
        ❌ Carga lenta (25W)<br/>
        ❌ Precio elevado ($1899)<br/>
        ❌ Android 14 (no 15) al lanzar</p>
        
        <h2>¿Vale la Pena en 2024?</h2>
        <p>Si vienes de un Fold4 o anterior, definitivamente sí. Las mejoras en pantalla y cresta justifican el upgrade. Si tienes un Fold5, quizás esperes al Fold7.</p>
        
        <h2>Conclusión</h2>
        <p>El Galaxy Z Fold6 es el mejor foldable del mercado, pero no es perfecto. Es un dispositivo excelente para profesionales y entusiastas de la tecnología que necesitan la versatilidad de teléfono y tablet en uno. No es para todos, pero para quienes aprovechan su potencial, es incomparable.</p>
      `,
    },
  ];

  // Si hay un post seleccionado, mostrar vista individual
  if (selectedPost) {
    return (
      <div className="bg-white dark:bg-[#0b0913] dark:text-gray-100 min-h-screen transition-colors">
        {/* Header del post */}
        <div className="relative">
          <img
            src={selectedPost.img}
            alt={selectedPost.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
              <button
                onClick={handleBackToBlog}
                className="mb-4 inline-flex items-center text-white/80 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Volver al blog
              </button>
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                  {selectedPost.category}
                </span>
                <span className="text-white/80 text-sm">
                  {selectedPost.readTime}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {selectedPost.title}
              </h1>
              <p className="text-white/90 text-lg">{selectedPost.date}</p>
            </div>
          </div>
        </div>

        {/* Contenido del post */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div
            className="prose prose-lg max-w-none text-gray-900 dark:text-gray-100"
            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
          />

          {/* Footer del post */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-[#2a2338]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Publicado en Blog Tech
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Chic Tech E-commerce
                </p>
              </div>
              <button
                onClick={handleBackToBlog}
                className="bg-gray-900 text-white rounded-full px-6 py-3 font-semibold hover:bg-gray-800 transition-colors"
              >
                Volver al blog
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0b0913] dark:text-gray-100 transition-colors">
      {/* Hero con video */}
      <section className="relative overflow-hidden min-h-[calc(100vh-8rem)] flex items-center">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/20" />
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center text-white">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">
              Innovación en cada detalle
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Tecnología para tu día a día
            </h1>
            <p className="text-white/80">
              Gadgets, audio, wearables y más. Dale play a la siguiente
              generación de productos.
            </p>
            <button
              className="mt-2 rounded-xl px-6 py-3 font-semibold text-white bg-[#c2185b] hover:bg-[#a3154a] transition-colors dark:bg-black dark:hover:bg-zinc-900"
              onClick={scrollToCatalogo}
            >
              Ver catálogo
            </button>
          </div>
        </div>
      </section>

      {/* Botón Ver todos al inicio */}
      <div className="bg-white dark:bg-[#0b0913] transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-end">
          <button
            type="button"
            onClick={scrollToCatalogo}
            className="text-sm font-semibold text-gray-900 dark:text-gray-100 underline"
          >
            Ver todos
          </button>
        </div>
      </div>

      {/* Ofertas diarias*/}
      {data.length > 0 && (
        <section className="bg-white dark:bg-[#0f0c19] transition-colors">
          <div className="max-w-6xl mx-auto px-4 py-12 text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center justify-center gap-6 mb-6">
              <span className="h-px w-16 bg-black/60 dark:bg-white/40" />
              <h2 className="text-2xl font-semibold">¡OFERTAS DIARIAS!</h2>
              <span className="h-px w-16 bg-black/60 dark:bg-white/40" />
            </div>

            <div className="flex items-center justify-center gap-8 text-sm mb-8">
              <button
                className={`pb-1 ${
                  tab === "recien"
                    ? "text-black dark:text-white border-b-2 border-[#c2185b]"
                    : "opacity-80 dark:text-gray-200"
                }`}
                onClick={() => setTab("recien")}
              >
                Recién llegados
              </button>

              <button
                className={`pb-1 ${
                  tab === "vendidos"
                    ? "text-black dark:text-white border-b-2 border-[#c2185b]"
                    : "opacity-80 dark:text-gray-200"
                }`}
                onClick={() => setTab("vendidos")}
              >
                Los más vendidos
              </button>

              <button
                className={`pb-1 ${
                  tab === "oferta"
                    ? "text-black dark:text-white border-b-2 border-[#c2185b]"
                    : "opacity-80 dark:text-gray-200"
                }`}
                onClick={() => setTab("oferta")}
              >
                Artículos en oferta
              </button>
            </div>

            {getTabItems(data, tab).length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                No hay productos para mostrar en esta sección.
              </p>
            ) : (
              <Carousel
                key={tab}
                items={getTabItems(data, tab)}
                perPageConfig={{ mobile: 1, tablet: 2, desktop: 4 }}
                dotsId={`tecno-${tab}`}
                renderItem={(p) => (
                  <DealCard key={p.id} product={p} onQuickView={setQuick} />
                )}
              />
            )}
          </div>
          {quick && (
            <QuickViewModal product={quick} onClose={() => setQuick(null)} />
          )}
        </section>
      )}

      <div className="max-w-6xl mx-auto px-4 py-10">
        <CategoryCatalog
          category="tecnologia"
          title="Catálogo"
          anchorId={catalogoId}
          perPage={8}
          showHeader
        />
      </div>

      {/* Blog / noticias - Mejorado */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        {/* Header del blog */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Tech
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Descubre las últimas novedades en tecnología, guías de compra y
            tendencias del mundo digital.
          </p>
        </div>

        {/* Grid de posts del blog */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(showAllPosts ? blogPosts : blogPosts.slice(0, 6)).map(
            (post, idx) => (
              <article
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="group bg-white dark:bg-[#161225] border border-gray-200 dark:border-[#2a2338] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Imagen con overlay */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-gray-800">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-3 flex-1 flex flex-col">
                  {/* Fecha y categoría */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-300">
                      {post.date}
                    </span>
                    <span className="text-blue-600 dark:text-blue-300 font-medium">
                      {post.readTime}
                    </span>
                  </div>

                  {/* Título */}
                  <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Botón leer más */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePostClick(post);
                    }}
                    className="inline-flex items-center text-blue-600 dark:text-blue-300 font-semibold hover:text-blue-700 dark:hover:text-blue-200 transition-colors group"
                  >
                    Leer más
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </article>
            )
          )}
        </div>

        {/* Botón ver más posts */}
        {!showAllPosts && blogPosts.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={handleShowAllPosts}
              className="bg-gray-900 text-white rounded-full px-8 py-3 font-semibold hover:bg-gray-800 transition-colors"
            >
              Ver todos los artículos ({blogPosts.length} totales)
            </button>
          </div>
        )}
      </section>

      <SubscribeBanner />
    </div>
  );
}

function getTabItems(data, tab) {
  if (tab === "vendidos") {
    return [...data]
      .sort((a, b) => (b?.rating?.count || 0) - (a?.rating?.count || 0))
      .slice(0, 8);
  }
  if (tab === "oferta") {
    return data.filter((p) => (p.discount || 0) > 0).slice(0, 8);
  }
  // Recién llegados
  return [...data].sort((a, b) => b.id - a.id).slice(0, 8);
}
