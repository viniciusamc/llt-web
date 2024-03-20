import { Container, Logo, User } from './styles'

import global from '../../styles/global.js'

export function Header() {
    return (
        <Container>
            <Logo>
                <h3>{global.logoName}</h3>
            </Logo>

            <User>Hello, User</User>
        </Container>
    )
}
