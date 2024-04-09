import styled from 'styled-components';

export const Section = styled.section`
    width: 90vw;
    max-width: 900px;
    margin: 0 auto;

    > h3 {
        color: ${({ theme }) => theme.COLORS.WHITE};
        text-align: center;
        font-size: 2rem;
    }

    > label {
        color: ${({ theme }) => theme.COLORS.WHITE};
    }

    select {
        background-color: ${({ theme }) => theme.COLORS.MAIN};
        color: ${({ theme }) => theme.COLORS.WHITE};
        font-size: 1.1rem;
        padding: 8px;
        border: 1px solid #fff3;
        border-radius: 8px;
        width: 100%;
    }
`;
