import LegalLayout from './LegalLayout'

const sections = [
    { id: 'responsable', label: 'Responsable y alcance' },
    { id: 'informacion', label: 'Información que tratamos' },
    { id: 'finalidades', label: 'Cómo la utilizamos' },
    { id: 'google', label: 'Google Drive y Google APIs' },
    { id: 'proveedores', label: 'Proveedores y transferencias' },
    { id: 'conservacion', label: 'Conservación y seguridad' },
    { id: 'derechos', label: 'Tus derechos' },
    { id: 'menores', label: 'Fotografías y menores' },
    { id: 'cambios', label: 'Cambios a esta política' },
]

export default function PrivacyPolicy() {
    return (
        <LegalLayout
            title="Política de privacidad"
            description="Cómo recopilamos, utilizamos y protegemos la información relacionada con las invitaciones y álbumes de Invita-Ya."
            updatedAt="22 de agosto de 2026"
            sections={sections}
        >
            <section id="responsable">
                <h2>Responsable y alcance</h2>
                <p>
                    Invita-Ya ofrece invitaciones digitales, confirmaciones de asistencia y álbumes compartidos para eventos. Esta política se aplica a las páginas publicadas bajo el dominio <strong>eventos.invita-ya.com</strong> y a las funciones asociadas que operamos para prestar esos servicios.
                </p>
                <p>
                    Cada organizador decide qué información de su evento publica y durante cuánto tiempo desea conservarla. Invita-Ya procesa esa información únicamente para crear, operar y mantener la experiencia contratada.
                </p>
            </section>

            <section id="informacion">
                <h2>Información que tratamos</h2>
                <p>Dependiendo de las funciones activadas para cada evento, podemos tratar:</p>
                <ul>
                    <li>Nombre, respuesta de asistencia, número de acompañantes y mensajes enviados mediante un formulario RSVP.</li>
                    <li>Fotografías seleccionadas voluntariamente para un álbum compartido, junto con su fecha técnica de carga.</li>
                    <li>Información pública del evento proporcionada por su organizador, como nombres, fecha, horarios, ubicaciones y fotografías.</li>
                    <li>Datos técnicos necesarios para entregar y proteger el sitio, como dirección IP, tipo de navegador, fecha de acceso y registros de error procesados por nuestros proveedores de infraestructura.</li>
                </ul>
                <p>No solicitamos contraseñas de Google a invitados, clientes ni organizadores.</p>
            </section>

            <section id="finalidades">
                <h2>Cómo utilizamos la información</h2>
                <p>Utilizamos la información exclusivamente para:</p>
                <ul>
                    <li>Mostrar y operar la invitación correspondiente.</li>
                    <li>Registrar y entregar confirmaciones al organizador del evento.</li>
                    <li>Optimizar, almacenar, mostrar y permitir la descarga de fotografías autorizadas.</li>
                    <li>Prevenir fallos, abuso, archivos incompatibles y accesos no autorizados.</li>
                    <li>Cumplir obligaciones legales aplicables y atender solicitudes de privacidad.</li>
                </ul>
                <p>
                    No vendemos información personal, no creamos perfiles publicitarios y no utilizamos fotografías o datos de Google para publicidad, entrenamiento de modelos de inteligencia artificial o reventa de datos.
                </p>
            </section>

            <section id="google">
                <h2>Google Drive y Google APIs</h2>
                <p>
                    El propietario de Invita-Ya puede autorizar una cuenta propia de Google para almacenar fotografías de un álbum en una carpeta privada de Google Drive. Los invitados no reciben acceso a esa cuenta ni a la carpeta de Drive. La visualización y descarga se realizan mediante rutas controladas por Invita-Ya que validan que cada archivo pertenezca al álbum correspondiente.
                </p>
                <p>
                    Nuestro uso de la información recibida de Google APIs se limita a crear, listar y leer las imágenes necesarias para operar ese álbum. No transferimos esos datos a terceros salvo a los proveedores necesarios para entregar el servicio, por razones de seguridad o cuando la ley lo exija.
                </p>
                <p>
                    El uso y transferencia a otras aplicaciones de la información recibida de Google APIs cumple la <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">Política de Datos de Usuario de los Servicios API de Google</a>, incluidos sus requisitos de Uso Limitado.
                </p>
                <p>
                    El propietario de la cuenta puede revocar el acceso de Invita-Ya desde la sección de <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">conexiones de su Cuenta de Google</a>. Revocar el acceso impide nuevas operaciones del álbum, pero no elimina automáticamente los archivos ya guardados en Drive.
                </p>
            </section>

            <section id="proveedores">
                <h2>Proveedores y transferencias</h2>
                <p>Usamos proveedores tecnológicos únicamente para alojar y entregar las funciones del servicio:</p>
                <ul>
                    <li><strong>Vercel</strong>, para alojamiento, distribución y funciones privadas del servidor.</li>
                    <li><strong>Supabase</strong>, para confirmaciones y los álbumes que expresamente utilizan su almacenamiento.</li>
                    <li><strong>Google Drive</strong>, para álbumes configurados por el propietario mediante Google OAuth.</li>
                </ul>
                <p>
                    Estos proveedores pueden procesar información en otros países conforme a sus condiciones y medidas de protección. No compartimos datos con terceros para que los utilicen con finalidades comerciales propias.
                </p>
            </section>

            <section id="conservacion">
                <h2>Conservación y seguridad</h2>
                <p>
                    Conservamos los datos mientras la invitación o el álbum permanezcan activos, mientras sean necesarios para prestar el servicio o hasta que el organizador solicite eliminarlos. Las fotografías almacenadas en Google Drive permanecen hasta que el propietario de la cuenta las elimine.
                </p>
                <p>
                    Aplicamos controles razonables como credenciales exclusivas del servidor, validación de formatos, separación por evento y verificación de pertenencia de archivos. Ningún sistema conectado a internet puede garantizar seguridad absoluta.
                </p>
            </section>

            <section id="derechos">
                <h2>Tus derechos</h2>
                <p>
                    Puedes solicitar acceso, corrección o eliminación de información que hayas proporcionado. Para hacerlo, utiliza el correo de asistencia que aparece en la pantalla de consentimiento de Google de Invita-Ya o comunícate con el organizador del evento, indicando la invitación y la información relacionada con tu solicitud.
                </p>
                <p>
                    Podemos solicitar datos mínimos para verificar que la solicitud corresponde a la persona correcta. Algunas obligaciones legales o de seguridad podrían exigir conservar información limitada durante un periodo adicional.
                </p>
            </section>

            <section id="menores">
                <h2>Fotografías y menores de edad</h2>
                <p>
                    Algunos eventos pueden incluir menores de edad. Quien sube una fotografía declara que cuenta con autorización suficiente para compartirla y que respeta la privacidad de las personas retratadas. No debe compartirse contenido íntimo, ilegal, dañino o que exponga innecesariamente información sensible de un menor.
                </p>
                <p>El organizador o el propietario de Invita-Ya puede retirar contenido reportado o inapropiado.</p>
            </section>

            <section id="cambios">
                <h2>Cambios a esta política</h2>
                <p>
                    Podemos actualizar esta política cuando cambien las funciones, proveedores o requisitos legales. Publicaremos la versión vigente en esta misma dirección e indicaremos su fecha de actualización.
                </p>
            </section>
        </LegalLayout>
    )
}
