# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Invitados que abren una invitación desde el teléfono para consultar el evento, compartir fotografías de la celebración y volver a descargar los recuerdos. El propietario de Invita-Ya administra las invitaciones y conserva el almacenamiento de los álbumes.

## Product Purpose

Invita-Ya reúne múltiples invitaciones digitales personalizadas, su información de evento, confirmaciones y álbumes compartidos. El éxito significa que cada invitación funciona como una experiencia coherente y que sus flujos públicos requieren la menor fricción posible.

## Positioning

Cada evento puede tener una composición artística propia sin perder los flujos compartidos y la administración central del producto.

## Operating Context

La experiencia es una SPA pública, principalmente móvil, desplegada en Vercel. Los invitados llegan mediante un enlace, normalmente desde mensajería, y no deben crear una cuenta para consultar o compartir recuerdos.

## Capabilities and Constraints

- Las invitaciones se resuelven por slug bajo `/i/:slug`.
- Los álbumes aceptan JPEG, PNG, WebP y HEIC, optimizan las imágenes en el navegador y permiten listarlas y ampliarlas.
- Lorena y Arturo y el álbum general conservan Supabase Storage.
- El álbum de Gretel y Geraldine usa una carpeta privada de Google Drive propiedad del administrador; invitados y clientes no reciben acceso directo a Drive.
- Las credenciales privadas nunca se exponen mediante variables `VITE_*` ni se incluyen en el bundle del navegador.

## Brand Commitments

Invita-Ya mantiene la identidad visual particular de cada evento. Gretel y Geraldine conserva su mundo de cuento inspirado en mar, faroles, morados y dorados, y el álbum debe sentirse como una continuación de su invitación.

## Evidence on Hand

Las invitaciones, fotografías, textos, rutas y recursos gráficos existentes en `src/invitations/` y `public/invitations/` son la fuente factual. No se deben fabricar testimonios, métricas o datos de evento.

## Product Principles

- Mantener aislados los datos y cambios de cada evento.
- Diseñar primero para el uso desde teléfono.
- Evitar autenticación o permisos de terceros para los invitados.
- Proteger credenciales y accesos administrativos detrás del servidor.
- Reutilizar los flujos compartidos sin borrar la identidad de cada invitación.
