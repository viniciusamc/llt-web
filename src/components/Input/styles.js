import styled from 'styled-components';

export const Container = styled.div`
    margin: 8px 0;
`;

export const Label = styled.label`
    color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const Content = styled.input`
    background-color: ${({ theme }) => theme.COLORS.MAIN};
    color: ${({ theme }) => theme.COLORS.WHITE};
    font-size: 1.1rem;
    padding: 8px;
    border: 1px solid #fff3;
    border-radius: 8px;
    width: 100%;
`;
