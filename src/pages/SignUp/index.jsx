import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ISO6391 from 'iso-639-1';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import global from '../../styles/global';
import { Form } from './styles';
import { Flash } from '../../components/Flash';
import { api } from '../../services/api';

export function SignUp() {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [email, setEmail] = useState('');
    const [language, setLanguage] = useState('');
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const emailFromQuery = queryParams.get('email');
        if (emailFromQuery) {
            setEmail(emailFromQuery);
        }
    }, [location.search]);

    const setClear = () => {
        setTimeout(() => {
            setErrorMessage('');
            setSuccessMessage('');
        }, 1500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const data = {
            user: {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
            },
            config: {
                targetLanguage: formData.get('language'), // Include the language in the data
            }
        };

        if (data.user.username.length < 3) {
            setErrorMessage('Username must be greater than 3 letters');
            setClear();
            return;
        }

        if (data.user.password.length < 6) {
            setErrorMessage('Password must be greater than 6 characters');
            setClear();
            return;
        }

        if (!data.user.username || !data.user.password || !data.user.email || !data.config.targetLanguage) {
            setErrorMessage('All Fields are required');
            setClear();
            return;
        }

        api.post('/user', data)
            .then(() => {
                setSuccessMessage(
                    'Account Created!'
                );
                setTimeout(() => {
                    window.location.href = `/login?email=${encodeURIComponent(data.user.email)}`;
                }, 2500);
            })
            .catch((e) => {
                setErrorMessage(e.response.data.error);
                setClear();
                return;
            });
    };

    return (
        <>
            <Form id="form" onSubmit={handleSubmit}>
                {successMessage && <Flash level={1} message={successMessage} />}
                {errorMessage && <Flash level={3} message={errorMessage} />}
                <div>
                    <h1>{global.logoName}</h1>
                    <p>Sign up to start tracking your learning</p>
                </div>
                <Input type={'text'} label={'Username'} placeholder={'example'} required name={'username'} />
                <Input
                    type={'email'}
                    label={'Email'}
                    placeholder={'example@example.com'}
                    required
                    name={'email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input type={'password'} label={'Password'} placeholder={'******'} required={true} name={'password'} />
                <div className="form-group">
                    <label htmlFor="language">Language to Learn</label>
                    <select
                        id="language"
                        name="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        required
                        className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-complementary text-main w-full"
                    >
                        <option value="" disabled>
                            Select a Language
                        </option>
                        {ISO6391.getAllCodes().map((code) => (
                            <option key={code} value={code}>
                                {ISO6391.getNativeName(code)} ({ISO6391.getName(code)})
                            </option>
                        ))}
                    </select>
                </div>
                <Button type="submit" text={'Sign Up'} />
            </Form>
        </>
    );
}
