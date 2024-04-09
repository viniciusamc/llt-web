import { Container } from './styles';
import global from '../../styles/global';

export function Footer() {
    return (
        <Container>
            <h5>
                {global.logoName} - <a href="mailto:viniciusmartinsdacunha1@gmail.com" style={{color: '#C94B4B'}}> Contact </a>
            </h5>
        </Container>
    );
}
