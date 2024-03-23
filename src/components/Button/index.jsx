import { Content } from './styles';

export function Button({ onClick, text, type }) {
    return (
        <Content onClick={onClick} type={type}>
            {text}
        </Content>
    );
}
