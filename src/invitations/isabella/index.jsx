import config from './config.json'
import DynamicInvitation from '../../components/DynamicInvitation'

export default function IsabellaInvitation(props) {
    return <DynamicInvitation config={config} {...props} />
}
