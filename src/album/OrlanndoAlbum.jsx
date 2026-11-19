import SharedAlbum from './SharedAlbum'
import { createDriveAlbumStore } from '../utils/driveAlbumStore'

const albumStore = createDriveAlbumStore('/api/albums/album-orlanndo')

export default function OrlanndoAlbum() {
    return (
        <SharedAlbum
            className="orlanndo-album"
            eventFolder="album-orlanndo"
            kicker="Album Orlanndo"
            title="Álbum compartido"
            intro="Sube aquí tus fotos del evento para compartirlas con todos."
            sectionLabel="Fotos del evento"
            galleryTitle="Fotos compartidas"
            emptyTitle="Aún no hay fotos"
            emptyText="Sé la primera persona en compartir un recuerdo del evento."
            footerText="Gracias por compartir tus fotos."
            albumStore={albumStore}
            downloadsEnabled
            configurationErrorText="Falta terminar la conexión con Google Drive."
        />
    )
}
