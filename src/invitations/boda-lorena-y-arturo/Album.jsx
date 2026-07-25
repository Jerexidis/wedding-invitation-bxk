import SharedAlbum from '../../album/SharedAlbum'
import './album.css'

const basePath = '/invitations/boda-lorena-y-arturo'

export default function LorenaArturoAlbum() {
    return (
        <SharedAlbum
            className="lorena-arturo-album"
            eventFolder="evento-principal/boda-lorena-y-arturo"
            kicker="Bodas de Plata · Lorena & Arturo"
            title="Nuestro álbum de plata"
            intro="Ayúdanos a guardar las risas, abrazos y aventuras de esta noche que celebra 25 años de amor."
            sectionLabel="Recuerdos de la celebración"
            galleryTitle="La noche vista por ustedes"
            emptyTitle="Este recuerdo puede empezar contigo"
            emptyText="Comparte la primera foto de la celebración de Lorena y Arturo."
            footerText="Gracias por acompañarnos en estos 25 años"
            heroImage={`${basePath}/img/novios-cartoon.png`}
            heroImageAlt="Ilustración de Lorena y Arturo celebrando sus bodas de plata"
            invitationHref="/i/boda-lorena-y-arturo"
        />
    )
}
