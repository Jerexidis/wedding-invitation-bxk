import config from './config.json'
import DynamicInvitation from '../../components/DynamicInvitation'
import './western-theme.css'

export default function JoseRaulInvitation(props) {
    return (
        <div className="jose-western-theme">
            <DynamicInvitation config={config} {...props} />
        </div>
    )
}
