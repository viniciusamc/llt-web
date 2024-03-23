import styled from 'styled-components';

export const Container = styled.div`
    background-color: ${({ level }) => {
        switch (level) {
            case 1:
                return '#7AC272';
            case 2:
                return '#4DA9C2';
            case 3:
                return '#F75050';
            default:
                return 'black';
        }
    }};
    color: white;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
`;

export const Content = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;
