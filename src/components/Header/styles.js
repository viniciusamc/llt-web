import styled from 'styled-components';

export const Container = styled.header`
    max-width: 100vw;
    height: 70px;
    background-color: ${({ theme }) => theme.COLORS.MAIN};
    margin-bottom: 40px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    > div {
        width: 90%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

export const Logo = styled.div``;

export const User = styled.div``;
