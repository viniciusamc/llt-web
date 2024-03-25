import { Container, Logo, User } from './styles';

import global from '../../styles/global.js';

import { useAuth } from '../../hooks/auth.jsx';
import dayjs from 'dayjs';

export function Header() {
    const { signOut, user } = useAuth()
    console.log(user)
    return (
        <Container>
            <div>
                <Logo>
                    <h3>{global.logoName}</h3>
                    <h4>{dayjs().format('DD/MM/YYYY')}</h4>
                </Logo>

                <User>Hello, User</User>
            </div>
        </Container>
    );
}
