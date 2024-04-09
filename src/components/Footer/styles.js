import styled from 'styled-components';

export const Container = styled.footer`
    margin-top: 40px;
    padding: 16px 0;
    width: 100%;
    background-color: ${({theme}) => theme.COLORS.SECONDARY};
    text-align: center;
    font-size: 1.4rem;
    color: ${({theme}) => theme.COLORS.WHITE};
`;
