import { Content } from './styles';

export function Button({ onClick, text, type, disabled }) {
    return (
        <Content onClick={onClick} type={type} disabled={disabled} >
            {text}
        </Content>
    );
}
