import { Container, Content } from './styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faInfoCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export function Flash({ message, level }) {
    let icon = null;
    switch (level) {
        case 1:
            icon = <FontAwesomeIcon icon={faCheckCircle} />;
            break;
        case 2:
            icon = <FontAwesomeIcon icon={faInfoCircle} />;
            break;
        case 3:
            icon = <FontAwesomeIcon icon={faExclamationCircle} />;
            break;
        default:
            icon = null;
            break;
    }
    return (
        <Container level={level}>
            <Content>
                <span>{icon}</span>
                <p>{message}</p>
            </Content>
        </Container>
    );
}
