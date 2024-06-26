import { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import global from '../../styles/global';
import { Form } from './styles';
import { Flash } from '../../components/Flash';
import { api } from '../../services/api';

export function SignUp() {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    function setClear() {
        setTimeout(() => {
            setErrorMessage('');
            setSuccessMessage('');
        }, 2500);
    }

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
        };

        if (data.username.length < 3) {
            setErrorMessage('Username must be greater than 3 letters');
            setClear();
            return;
        }

        if (data.password.length < 6) {
            setErrorMessage('Password must be greater than 6 characters');
            setClear();
            return;
        }

        if (!data.username || !data.password || !data.email) {
            setErrorMessage('All Fields are required');
            setClear();
            return;
        }

        api.post('/v1/users', data)
            .then((response) => {
                setSuccessMessage('Account Created! Verify your email!');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2500);
            })
            .catch((e) => {
                setErrorMessage(e.response.data.error);
                setClear();
                return;

            });
    }

    return (
        <>
            <Form id="form" onSubmit={handleSubmit}>
                {successMessage && <Flash level={1} message={successMessage} />}
                {errorMessage && <Flash level={3} message={errorMessage} />}
                <div>
                    <h1>{global.logoName}</h1>
                    <p>Sign up to start to tracking your learning</p>
                </div>
                <Input type={'text'} label={'Username'} placeholder={'example'} required name={'username'} />
                <Input type={'email'} label={'Email'} placeholder={'example@example.com'} required name={'email'} />
                <Input type={'password'} label={'Password'} placeholder={'******'} required={true} name={'password'} />
                <Button type="submit" text={'Sign Up'} />
            </Form>
        </>
    );
}
