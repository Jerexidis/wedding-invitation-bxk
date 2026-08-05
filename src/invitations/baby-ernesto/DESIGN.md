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
  Ubicación → Consideraciones → Mesa de regalos → RSVP → Footer
- Shared services: GSAP, ScrollTrigger, lucide-react
- Custom interactions: copiar números de mesa, Google Calendar, ubicación y
  confirmación por WhatsApp

## Motion

- Entrada del hero por capas con líneas que se dibujan y texto escalonado
- Parallax suave en acuarelas del hero
- Revelado de secciones una sola vez, con distancia corta y easing sobrio
- Cuenta regresiva y mesas de regalos con stagger discreto
- La ecografía se comporta como Live Photo: permanece estática en reposo y,
  mientras la persona mantiene presionada la imagen, cambia a una animación
  corta y suena el latido sintetizado
- Respeta `prefers-reduced-motion`

## Preserve

- Los cuatro registros de mesa de regalos y sus códigos/URL
- Enlace directo a Amazon de Andrea Marmolejo
- Datos del evento: Sara Eventos, Las Hadas, calle Thalía 217, 5:00 pm,
  sábado 12 de septiembre de 2026
- Acento azul como detalle menor; beige y dorado siguen siendo dominantes
- Aviso amable sobre cupo para niños y política de bebidas
- Ecografía recortada sin nombres ni datos clínicos visibles

## Decisions

- Arquitectura `standalone-custom`
- RSVP por WhatsApp; el número real sigue pendiente antes de publicar
- Se reutilizan el fondo de nubes y el patrón; el osito no forma parte de la UI
- No se publica video: se usan una imagen estática y un GIF optimizado recortados,
  centrados y sin datos clínicos visibles
- Las secciones beige usan una textura marfil clara tipo tela/seda, sin bloques
  café oscuro
- `eventType`: `babyshower`
