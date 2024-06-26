import { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import global from '../../styles/global';
import { Form, Bottom } from './styles';
import { Flash } from '../../components/Flash';

import { useAuth } from '../../hooks/auth';

export function Login() {
    const { signIn } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    function setClear() {
        setTimeout(() => {
            setErrorMessage('');
            setSuccessMessage('');
        }, 2500);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const email = formData.get('email');
        const password = formData.get('password');

        if (!password || !email) {
            setErrorMessage('All Fields are required');
            setClear();
            return;
        }

        const response = await signIn({ email, password });

        if (response.data.error) {
            setErrorMessage(response.data.error)
        }

        if (response.errorStatus === 400) {
            setErrorMessage('Your account is not verified. Please check your email.');
        }

        if (response.errorStatus === 404) {
            setErrorMessage('Email or password incorrect. Please try again.');
        }

        if (response.errorStatus === 500) {
            setErrorMessage('Internal server error. Please try again.');
        }

        if (response.success) {
            setSuccessMessage('Sign in successful!');
            window.location.href = '/';
        }
    }

    return (
        <>
            <Form id="form" onSubmit={handleSubmit}>
                {successMessage && <Flash level={1} message={successMessage} />}
                {errorMessage && <Flash level={3} message={errorMessage} />}
                <div>
                    <h1>{global.logoName}</h1>
                    <p>Welcome back! Please sign in to your account.</p>
                </div>
                <Input type={'email'} label={'Email'} placeholder={'example@example.com'} required name={'email'} />
                <Input type={'password'} label={'Password'} placeholder={'******'} required={true} name={'password'} />
                <Button type="submit" text={'Login'} />
                <Bottom>
                    <p>
                        {' '}
                        Don't have an account? <a href="/signup" style={{color: '#C94B4B'}}> Sign Up</a>
                    </p>
                </Bottom>
            </Form>
        </>
    );
}
