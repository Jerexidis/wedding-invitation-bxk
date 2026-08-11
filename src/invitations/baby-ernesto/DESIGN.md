# Invitation design brief

## Concept

Baby shower editorial, cálido y elegante para Baby Ernesto. El diseño combina
papel marfil, líneas doradas finas y acuarelas etéreas con un detalle muy
contenido en azul celeste. El osito funciona como retrato central, no como
personaje de fiesta infantil.

## Art direction

- Mood: sereno, delicado, premium, íntimo
- Palette: marfil (#FBF7EF), beige papel (#F5EDDF), dorado antiguo (#B79556),
  cacao (#5A4939), azul celeste suave (#BDD7E5)
- Typography: Cormorant Garamond para títulos y Manrope para texto funcional
- Composition: mucho espacio negativo, arcos, filetes finos, tarjetas tipo
  papelería, nubes en acuarela y ecografía como momento emocional del hero
- Avoid: emojis, globos caricaturescos, sombras gruesas, colores saturados,
  tipografía infantil redondeada y exceso de azul

## Structure

- Section order: Hero/ecografía → Invitación/fecha → Cuenta regresiva →
  Ubicación → Consideraciones → Dress code → Mesa de regalos → RSVP
  → Footer
- Shared services: GSAP, ScrollTrigger, lucide-react
- Custom interactions: copiar números de mesa, Google Calendar, ubicación y
  confirmación por WhatsApp

## Motion

- Entrada del hero por capas con líneas que se dibujan y texto escalonado
- Parallax suave en acuarelas del hero
- Revelado de secciones una sola vez, con distancia corta y easing sobrio
- Cuenta regresiva y mesas de regalos con stagger discreto
- Ilustraciones acuarela de ositos, globos, nubes y elementos de bebé flotan
  lentamente entre secciones sin competir con el contenido principal
- La ecografía se comporta como Live Photo: permanece estática en reposo y,
  mientras la persona mantiene presionada la imagen, cambia a una animación
  corta y reproduce un archivo de latido. En navegadores compatibles también
  acompaña el pulso con vibración; Safari de iPhone no expone esa función web
- Respeta `prefers-reduced-motion`

## Preserve

- Los cuatro registros de mesa de regalos y sus códigos/URL
- Enlace directo a Amazon de Andrea Marmolejo
- Datos del evento: Sara Eventos, Las Hadas, calle Thalía 217, 5:00 pm,
  sábado 12 de septiembre de 2026
- Acento azul como detalle menor; beige y dorado siguen siendo dominantes
- Aviso amable sobre cupo para niños y política de bebidas
- Dress code horizontal en marfil, arena, camel y café, con el tono más oscuro
  a la derecha
- Ecografía recortada sin nombres ni datos clínicos visibles

## Decisions

- Arquitectura `standalone-custom`
- RSVP por WhatsApp al `+52 449 386 8213`, con navegación directa compatible
  con Safari móvil
- Se reutilizan el fondo de nubes y el patrón; el osito no forma parte de la UI
- No se publica video: se usan una imagen estática y un GIF optimizado recortados,
  centrados y sin datos clínicos visibles
- Las secciones beige usan una textura marfil clara tipo tela/seda, sin bloques
  café oscuro
- La canción `Mi Amor` tiene control fijo; se pausa durante el latido y después
  continúa automáticamente
- `eventType`: `babyshower`
