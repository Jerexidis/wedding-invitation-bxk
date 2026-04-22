import config from './config.json'
import InvitacionBoda from '../../templates/InvitacionBoda'

export default function Invitation() {
    return <InvitacionBoda config={config} />
}
