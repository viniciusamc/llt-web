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
                    <h6>Hello, {username}</h6>
                    <h7 onClick={() => {signOut()}}>Logout </h7>
                </User>
            </div>
        </Container>
    );
}
