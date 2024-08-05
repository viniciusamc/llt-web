import { Header } from '../../components/Header';
import iso6391 from 'iso-639-1';
import { Section } from './styles';
import { Input } from '../../components/Input';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Button } from '../../components/Button';
import { Flash } from '../../components/Flash';

import { useAuth } from '../../hooks/auth';

export function Settings() {
    const { refresh } = useAuth()

    const [succeessMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const [language, setLanguage] = useState('az');
    const [daily, setDaily] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [awp, setAwp] = useState(0);

    async function getUser() {
        api.get('/v1/user/settings').then((response) => {
            setLanguage(response.data.configs.TL);
            setWpm(response.data.configs.wpm);
            setAwp(response.data.configs.averageWordsPage);
            setDaily(response.data.configs.dailyGoal);
        });
    }

    function handleSubmit() {
        setIsLoading(true)
        api.patch('/v1/users', { wpm, averageWordsPage: awp, TL: language, dailyGoal: daily }).then((response) => {
            setSuccessMessage('Settings Saved with Success');
            refresh()
            clearMessage();
        }).catch((e) => {
            console.error(e)
            setErrorMessage('Was not possible save your new settings, try again later');
            clearMessage();
        })

        setIsLoading(false)
    }

    useEffect(() => {
        getUser();
    }, []);

    function clearMessage(time) {
        setTimeout(
            () => {
                setSuccessMessage('');
                setErrorMessage('');
            },
            time ? time : 2500,
        );
    }

    return (
        <>
            <Header />
            <Section>
                <h3>Settings</h3>

                {succeessMessage && <Flash level={1} message={succeessMessage} />}
                {errorMessage && <Flash level={3} message={errorMessage} />}
                <label> Target Language </label>
                <select onChange={(e) => setLanguage(e.target.value)}>
                    <option value={language}>{iso6391.getName(language)}</option>
                    {iso6391.getAllCodes().map((item) => (
                        <option key={item} value={item}>
                            {iso6391.getName(item)}
                        </option>
                    ))}
                </select>

                <Input
                    type={'number'}
                    label={'Daily Goal (In Minutes)'}
                    placeholder={'In Minutes'}
                    onChange={(e) => {
                        setDaily(e.target.value);
                    }}
                    value={daily}
                />
                <Input
                    type={'number'}
                    label={'Books - Words Per Minute'}
                    placeholder={''}
                    onChange={(e) => {
                        setWpm(e.target.value);
                    }}
                    value={wpm}
                />
                <Input
                    type={'number'}
                    label={'Books - Average Words per Page'}
                    onChange={(e) => {
                        setAwp(e.target.value);
                    }}
                    value={awp}
                />

                <Button text={'Save'} onClick={() => handleSubmit()} disabled={isLoading}/>
            </Section>
        </>
    );
}
