import SharedAlbum from './SharedAlbum'
import { createDriveAlbumStore } from '../utils/driveAlbumStore'

const albumStore = createDriveAlbumStore('/api/albums/album-orlanndo')

export default function OrlanndoAlbum() {
    return (
        <SharedAlbum
            className="orlanndo-album"
            eventFolder="album-orlanndo"
            kicker="Fati cumple 15 años"
            title="¡Mis XV años!"
            intro="Celebremos juntas este día tan especial. Sábado 21 de noviembre de 2026."
            sectionLabel="Recuerdos de la fiesta"
            galleryTitle="Fotos de mis XV"
            emptyTitle="Aún no hay fotos"
            emptyText="Sé la primera persona en compartir un recuerdo de esta fiesta."
            footerText="Gracias por celebrar conmigo."
            albumStore={albumStore}
            downloadsEnabled
            configurationErrorText="Falta terminar la conexión con Google Drive."
        />
    )
}
