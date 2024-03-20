import styled from 'styled-components'

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
`

export const Status = styled.section`
    width: 90vw;
    min-width: 290px;
    margin: 0 auto;
    margin-top: 40px;
    height: 200px;
    background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
`

export const Card = styled.section`
    width: 90vw;
    max-width: 300px;
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
`
