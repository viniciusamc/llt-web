import styled from 'styled-components';

export const CreateSection = styled.section`
    width: 100%;
    max-width: 90vw;
    min-width: 290px;
    margin: 0 auto;

    background-color: ${({ theme }) => theme.COLORS.PRIMARY};

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding: 12px;

    border-radius: 8px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

    > h4 {
        font-size: 1.2rem;
        font-weight: 400;
        color: ${({ theme }) => theme.COLORS.WHITE};
    }

    > button {
        background: transparent;
        border: none;

        cursor: pointer;

        > img {
            width: 50px;
        }
    }

    @media (min-width: 768px) {
        > h4 {
            font-size: 2rem;
        }

        button > {
            > img {
                width: 65px;
            }
        }
    }
`;

export const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    backdrop-filter: blur(5px);
    cursor: pointer;
`;

export const Modal = styled.section`
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, 0);
    width: 90vw;
    max-width: 400px;
    z-index: 10001;
    background-color: ${({ theme }) => theme.COLORS.SECONDARY};
    border-radius: 8px;

    padding: 15px;

    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const Top = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #fff;

    > label {
        font-size: 1.5rem;
    }

    > img {
        width: 40px;
        cursor: pointer;
    }
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;

    div {
        margin: 8px 0;

        label {
            color: ${({ theme }) => theme.COLORS.WHITE};
        }

        select,
        input {
            background-color: ${({ theme }) => theme.COLORS.MAIN};
            color: ${({ theme }) => theme.COLORS.WHITE};
            font-size: 1.1rem;
            padding: 8px;
            border: 1px solid #fff3;
            border-radius: 8px;
            width: 100%;
        }
    }

    button {
        background-color: ${({ theme }) => theme.COLORS.PRIMARY};
        width: 50%;
        padding: 12px;
        margin: 15px auto;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }
`;

export const Status = styled.section`
    width: 90vw;
    min-width: 290px;
    margin: 0 auto;
    margin-top: 40px;
    height: 200px;
    background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
`;

export const Card = styled.section`
    width: 100%;
    min-width: 290px;
    margin: 0 auto;
    height: 200px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.COLORS.MAIN};
    border-radius: 8px;

    padding: 16px;

    > h5 {
        font-size: 1rem;
    }

    > p {
        font-size: 2rem;
    }
`;

export const Charts = styled.section`
    width: 90vw;
    margin: 40px auto 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 28px;

    @media (min-width: 1024px) {
        flex-direction: row;
        justify-content: space-around;
    }
`;

export const Chart = styled.section`
    padding: 20px;
    width: 90vw;
    max-width: 400px;
    background-color: ${({ theme }) => theme.COLORS.MAIN};
    border-radius: 8px;

    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Journey = styled.section``;
