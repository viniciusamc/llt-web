import styled from 'styled-components';

export const Form = styled.form`
    width: 90vw;
    max-width: 600px;
    margin: 10vh auto;
    color: ${({ theme }) => theme.COLORS.WHITE};

    background-color: ${({ theme }) => theme.COLORS.MAIN};
    padding: 40px;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    > div {
        display: flex;
        flex-direction: column;
        gap: 12px;

        a {
            color: ${({ theme }) => theme.COLORS.WHITE};
        }

        > h1 {
            font-size: 2rem;
        }
    }
`;
