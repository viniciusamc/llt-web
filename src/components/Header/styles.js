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

export const Logo = styled.div`
    > h4 {
        font-size: 0.8rem;
    }
`;

export const User = styled.div`
    display: flex;
    flex-direction: column;

    text-align: right;

    > h6 {
        font-size: 1.2rem;
        font-weight: 400;
    }

    > h7 {
        font-size: 1rem;
        font-weight: 300;
        cursor: pointer;
    }

    > h7:hover {
        color: red;
        transition: all .3s ease-out;
    }
`;

export const Logout = styled.div``;
