import SharedAlbum from '../../album/SharedAlbum'
import { gretelDriveAlbumStore } from '../../utils/driveAlbumStore'
import './album.css'

export default function GretelGeraldineAlbum() {
    return (
        <SharedAlbum
            className="gretel-geraldine-album"
            eventFolder="gretel-y-geraldine"
            kicker="Gretel & Geraldine · XV años"
            title="El reino de nuestros recuerdos"
            intro="Comparte las sonrisas, los abrazos y cada instante que ilumine esta aventura junto al mar y los faroles."
            sectionLabel="Recuerdos compartidos"
            galleryTitle="La celebración vista por ustedes"
            emptyTitle="Tu recuerdo puede encender el primer farol"
            emptyText="Comparte la primera fotografía de los XV años de Gretel y Geraldine."
            footerText="Gracias por ser parte de esta aventura"
            invitationHref="/i/gretel-y-geraldine"
            albumStore={gretelDriveAlbumStore}
            downloadsEnabled
            configurationErrorText="Falta terminar la conexión privada con Google Drive."
        />
    )
}
