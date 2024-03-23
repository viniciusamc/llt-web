import styled from 'styled-components';

export const Content = styled.button`
    cursor: pointer;
    background-color: ${({ theme }) => theme.COLORS.PRIMARY};
    width: 100%;
    padding: 12px;
    margin: 15px auto;
    border: none;
    border-radius: 8px;
`;
