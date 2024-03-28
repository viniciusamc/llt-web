import styled, { css } from 'styled-components';

export const Content = styled.button`
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    background-color: ${({ theme, disabled }) => (disabled ? 'gray' : theme.COLORS.PRIMARY)};
    width: 100%;
    padding: 12px;
    margin: 15px auto;
    border: none;
    border-radius: 8px;
    transition: ${({ disabled }) => (disabled ? 'none' : 'transform 0.3s ease')};
    color: ${({theme}) => theme.COLORS.WHITE};

    &:hover {
        ${({ disabled }) => !disabled && 'transform: scale(1.05);'}
    }

    &:disabled {
        background-color: gray;
        cursor: not-allowed;
    }
`;

