import styled from 'styled-components';

export const Container = styled.section`
    width: 90vw;
    background-color: ${({ theme }) => theme.COLORS.MAIN};
    border-radius: 8px;
    margin: 40px auto 0;

    @media (min-width: 768px) {
        width: 50vw;
    }
`;

export const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    border-bottom: 1px solid #fff6;
    text-transform: capitalize;

    > div {
        display: flex;
        align-items: center;
        gap: 12px;

        img {
            width: 40px;
            height: 40px;
            object-fit: fill;
        }
    }

    h5 {
        display: none;
    }

    span {
        font-size: 1.5rem;
    }

    @media (min-width: 768px) {
        h5 {
            display: block;
            font-size: 1.5rem;
            font-weight: 400;
        }
    }
`;

export const Bottom = styled.div`
    display: flex;
    flex-direction: column;
    

    padding: 15px;

    > h6 {
        font-size: 1rem;
        font-weight: 400;
    }

    > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: right;
    }
`;
