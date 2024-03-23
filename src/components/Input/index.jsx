import React from 'react';
import { Container, Content, Label } from './styles';

export function Input({ type, name, label, placeholder, value, onChange }){
    return (
        <Container>
            <Label>{label}</Label>
            <Content
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </Container>
    );
};

