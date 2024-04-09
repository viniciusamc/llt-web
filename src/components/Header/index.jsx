import { Container, Logo, User } from './styles';

import global from '../../styles/global.js';

import { useAuth } from '../../hooks/auth.jsx';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useState } from 'react';

export function Header() {
    const { signOut } = useAuth();

    const [username, setUsername] = useState('User');

    useEffect(() => {
        const name = localStorage.getItem('@username');

        setUsername(name);
    }, []);

    return (
        <Container>
            <div>
                <Logo>
                    <h3>{global.logoName}</h3>
                    <h4>{dayjs().format('DD/MM/YYYY')}</h4>
                </Logo>

                <User>
                    <h5>Hello, {username}</h5>
                    <h6 onClick={() => {signOut()}}>Logout </h6>
                </User>
            </div>
        </Container>
    );
}
