import LegalLayout from './LegalLayout'

const sections = [
    { id: 'aceptacion', label: 'Aceptación' },
    { id: 'servicio', label: 'Descripción del servicio' },
    { id: 'contenido', label: 'Contenido y permisos' },
    { id: 'uso', label: 'Uso permitido' },
    { id: 'disponibilidad', label: 'Disponibilidad' },
    { id: 'propiedad', label: 'Propiedad intelectual' },
    { id: 'responsabilidad', label: 'Responsabilidad' },
    { id: 'terminacion', label: 'Retiro y terminación' },
    { id: 'contacto', label: 'Contacto y cambios' },
]

export default function TermsOfService() {
    return (
        <LegalLayout
            title="Términos del servicio"
            description="Las condiciones para utilizar las invitaciones, confirmaciones y álbumes compartidos de Invita-Ya."
            updatedAt="22 de agosto de 2026"
            sections={sections}
        >
            <section id="aceptacion">
                <h2>Aceptación</h2>
                <p>
                    Al acceder o utilizar una invitación, formulario de confirmación o álbum operado por Invita-Ya, aceptas estos términos y la Política de privacidad. Si no estás de acuerdo, no utilices las funciones de envío o carga de contenido.
                </p>
            </section>

            <section id="servicio">
                <h2>Descripción del servicio</h2>
                <p>
                    Invita-Ya crea y aloja experiencias digitales para eventos. Una invitación puede incluir información del evento, enlaces de ubicación, música, confirmación de asistencia, galerías y álbumes donde los invitados comparten fotografías.
                </p>
                <p>
                    El organizador es responsable de proporcionar información correcta y de comunicar cualquier cambio de fecha, ubicación o condiciones del evento. Invita-Ya no organiza ni presta directamente los servicios del evento anunciado.
                </p>
            </section>

            <section id="contenido">
                <h2>Contenido y permisos</h2>
                <p>
                    Conservas los derechos que te correspondan sobre las fotografías y mensajes que compartas. Al subir contenido, otorgas a Invita-Ya una autorización limitada, no exclusiva y revocable para almacenarlo, optimizarlo, mostrarlo y permitir su descarga dentro del álbum del evento.
                </p>
                <p>
                    Declaras que creaste el contenido o que cuentas con permiso suficiente para compartirlo, y que su publicación no vulnera derechos de autor, privacidad, imagen u otros derechos de terceros.
                </p>
            </section>

            <section id="uso">
                <h2>Uso permitido</h2>
                <p>No está permitido utilizar el servicio para:</p>
                <ul>
                    <li>Subir archivos maliciosos, ilegales, íntimos, engañosos o ajenos al evento.</li>
                    <li>Acosar, suplantar o perjudicar a otra persona.</li>
                    <li>Intentar obtener credenciales, tokens, carpetas privadas o información no destinada al invitado.</li>
                    <li>Automatizar cargas o descargas abusivas, eludir límites o afectar la disponibilidad del servicio.</li>
                    <li>Publicar fotografías de menores sin autorización suficiente.</li>
                </ul>
            </section>

            <section id="disponibilidad">
                <h2>Disponibilidad del servicio</h2>
                <p>
                    Procuramos mantener las invitaciones y álbumes disponibles, pero pueden existir interrupciones por mantenimiento, conexión, proveedores externos, límites de almacenamiento o causas fuera de nuestro control. Podemos modificar funciones para mejorar seguridad, compatibilidad o rendimiento.
                </p>
            </section>

            <section id="propiedad">
                <h2>Propiedad intelectual</h2>
                <p>
                    El software, estructura, marca y diseños propios de Invita-Ya están protegidos por las normas aplicables. Los nombres, fotografías, música, personajes y otros materiales suministrados para cada evento conservan la titularidad de sus respectivos propietarios.
                </p>
                <p>Google Drive, Supabase y Vercel son servicios independientes; su mención no implica patrocinio de Invita-Ya.</p>
            </section>

            <section id="responsabilidad">
                <h2>Responsabilidad</h2>
                <p>
                    El servicio se proporciona en el estado en que se encuentra. En la medida permitida por la legislación aplicable, Invita-Ya no responde por decisiones tomadas a partir de información incorrecta del organizador, pérdida causada por servicios externos, usos no autorizados o contenido subido por invitados.
                </p>
                <p>Nada en estos términos limita derechos que legalmente no puedan excluirse.</p>
            </section>

            <section id="terminacion">
                <h2>Retiro de contenido y terminación</h2>
                <p>
                    Podemos bloquear cargas, retirar contenido o limitar el acceso cuando exista una solicitud válida, un riesgo de seguridad, una infracción de estos términos o una obligación legal. El organizador puede solicitar el cierre de su invitación o álbum conforme a las condiciones acordadas para el evento.
                </p>
            </section>

            <section id="contacto">
                <h2>Contacto y cambios</h2>
                <p>
                    Para consultas sobre estos términos, utiliza los medios de asistencia informados por Invita-Ya o el correo de soporte mostrado en la pantalla de consentimiento de Google. Podemos actualizar estas condiciones y publicaremos la versión vigente en esta misma dirección.
                </p>
                <p>Estos términos se interpretan conforme a la legislación aplicable en México.</p>
            </section>
        </LegalLayout>
    )
}
