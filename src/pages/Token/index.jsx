import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { useState } from 'react';
import { Flash } from '../../components/Flash';

export function Token() {
    const { token } = useParams();

    const [status, setStatus] = useState();
    const [errorMessage, setErrorMessage] = useState();

    useEffect(() => {
        async function activateAccount() {
            try {
                const response = await api.get(`/v1/users/token/${token}`);

                if (response.status === 201) {
                    setStatus(200);
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 5000);
                }
            } catch (error) {
                setErrorMessage('Was not possible to active your account, please try again');
            }
        }

        activateAccount();
    }, [token]);

    return (
        <main
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '90vh',
                margin: '0 auto',
                textAlign: 'center',
                color: '#fff',
            }}
        >
            {errorMessage && <Flash level={3} message={errorMessage} />}
            {status && (
                <>
                    <h4>
                        Your account has been activated. You can now{' '}
                        <a href="/" style={{ color: '#F75050' }}>
                            sign in.
                        </a>
                    </h4>
                    <h1>Thanks.</h1>
                </>
            )}
        </main>
    );
}
