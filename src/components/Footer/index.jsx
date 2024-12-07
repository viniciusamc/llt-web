import { Container } from './styles';
import global from '../../styles/global';

export function Footer() {
    return (
        <Container>
            <h5>
                {global.logoName} - <a href="mailto:support@loglingua.com" style={{color: '#C94B4B'}}> Contact </a>
            </h5>
        </Container>
    );
}
