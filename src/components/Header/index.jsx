import { Container, Logo, User } from './styles';

import global from '../../styles/global.js';

import { useAuth } from '../../hooks/auth.jsx';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export function Header() {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    return (
        <Container>
            <div>
                <Logo onClick={() => navigate('/')}>
                    <h3>{global.logoName}</h3>
                    <h4>{dayjs().format('DD/MM/YYYY')}</h4>
                </Logo>

                <button className="hover:cursor-pointer hover:text-main transition-all duration-200 ease-in-out p-3 bg-primary rounded-md" onClick={() => navigate('/words')}>Words You Know</button>

                <User>
                    <h5 onClick={() => navigate('/settings')}>Settings</h5>
                    <h6
                        onClick={() => {
                            signOut();
                        }}
                    >
                        Logout{' '}
                    </h6>
                </User>
            </div>
        </Container>
    );
}
