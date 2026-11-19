import SharedAlbum from './SharedAlbum'
import { createDriveAlbumStore } from '../utils/driveAlbumStore'

const albumStore = createDriveAlbumStore('/api/albums/album-fatima')

export default function OrlanndoAlbum() {
    return (
        <SharedAlbum
            className="xv-fati-album"
            eventFolder="album-fatima"
            kicker="Mis XV años · Fati "
            title="Una noche para recordar"
            intro="Me encantará compartir contigo este momento tan especial. Guarda aquí las fotografías de la celebración."
            eventDate="Sábado 21 de noviembre de 2026"
            heroImage="/invitations/xv-fati/assets/butterfly.png"
            heroImageAlt="Mariposa roja"
            sectionLabel="La celebración"
            galleryTitle="Recuerdos compartidos"
            emptyTitle="El álbum comienza contigo"
            emptyText="Comparte las fotografías que tomes durante la celebración para conservar cada momento."
            footerText="Gracias por acompañarme en una noche inolvidable."
            albumStore={albumStore}
            downloadsEnabled
            configurationErrorText="Falta terminar la conexión con Google Drive."
        />
    )
}
