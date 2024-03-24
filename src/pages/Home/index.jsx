import { Header } from '../../components/Header';
import { Card, Chart, Charts, CreateSection, Journey, Modal, Overlay, Status, Top, Form } from './styles';

import add from '../../assets/add.svg';
import close from '../../assets/close.svg';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { JourneyCard } from '../../components/JourneyCard/index.jsx';

import { api } from '../../services/api.js';

import youtube from '../../assets/youtube.svg';
import { Input } from '../../components/Input/index.jsx';
import { useEffect } from 'react';
import { Button } from '../../components/Button/index.jsx';
import { Flash } from '../../components/Flash/';
import dayjs from 'dayjs';

const wsz = 320;
const hsz = 320;

const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

export function Home() {
    const initialFormData = {
        modalValue: 'Youtube',
        youtubeHow: 'Active',
        youtubeUrl: '',
        movieHow: 'Active',
        movieWhich: '',
        movieFile: null,
        movieLong: null,
        talkHow: 'Chatting',
        talkLong: '',
        ankiNew: '',
        ankiReviewed: '',
        ankiLong: '',
        readHow: '',
        vocabularyNew: '',
        vocabularyWhen: '',
    };

    const [successMessage, setSuccessMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [vocabularyAverage, setVocabularyAverage] = useState(0);
    const [vocabulary, setVocabulary] = useState(0);

    const [mediasWords, setMediasWords] = useState(0)

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState(initialFormData);

    const [modal, setModal] = useState(false);
    const [username, setUsername] = useState('Admin');


    const [totalTimeYTBPD, setTotalTitmeYTBPD] = useState('00:00:00');

    const [listJourney, setListJourney] = useState([]);

    async function getInfoUser() {
        const response = await api.get('/v1/users/user');
        const vocabulary = await api.get('/v1/vocabulary')
        console.log(response.data)

        setVocabularyAverage(vocabulary.data.average)
        setVocabulary(vocabulary.data.vocabulary[vocabulary.data.vocabulary.length - 1].vocabulary)

        setMediasWords(response.data.totalWordsMedia)
        setTotalTitmeYTBPD(response.data.mediasTotalTime)
        setListJourney(response.data.ordered);
    }

    function handleSubmit(e) {
        e.preventDefault();

        const modalValue = formData.modalValue;

        if (modalValue == 'Youtube' || modalValue == 'Podcast') {
            setIsLoading(true);

            const data = {
                url: formData.youtubeUrl,
                type: formData.modalValue,
                watch_type: formData.youtubeHow,
            };

            if (!data.url || !data.watch_type) {
                setErrorMessage('All Fields are required.');
                clearMessage();
                setIsLoading(false);
            }

            api.post('/v1/medias', data)
                .then((response) => {
                    if (response.data.closed_caption) {
                        setSuccessMessage('Youtube Created with Success');
                        setIsLoading(false);
                        clearMessage();
                    } else {
                        setSuccessMessage('Youtube Created with Success');
                        setInfoMessage('The YouTube does not include subtitles.');
                        setIsLoading(false);
                        clearMessage(4000);
                    }
                })
                .catch((e) => {
                    setErrorMessage('Failed, Try Again');
                    setIsLoading(false);
                    clearMessage();
                });
        }

        if (modalValue == 'Anki') {
            setIsLoading(true);

            const data = {
                reviewed: formData.ankiReviewed,
                newCards: formData.ankiNew,
                time: formData.ankiLong,
            };

            api.post('/v1/anki', data)
                .then((r) => {
                    setSuccessMessage('Anki Created with success!');
                    setIsLoading(false);
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage('Failed, Try Again Later');
                    setIsLoading(false);
                    clearMessage();
                });
        }

        if (modalValue == 'Movie') {
            setIsLoading(false);

            const data = {
                subtitles: formData.movieFile,
                title: formData.movieWhich,
                watch_type: formData.movieHow,
                type: formData.modalValue,
            };

            if (data.subtitles.type != 'application/x-subrip') {
                setErrorMessage('Only .srt subtitles is allowed');
                clearMessage();
                return;
            }

            api.post('/v1/medias/movies', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((response) => {
                    setSuccessMessage('Movie Created with success');
                    setIsLoading(false);
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage('Failed, try again later');
                    setIsLoading(false);
                    clearMessage();
                });
        }

        if (modalValue == 'Talk') {
            setIsLoading(false);

            const data = {
                type: formData.talkHow,
                time: formData.talkLong,
            };

            api.post('/v1/talk', data)
                .then((response) => {
                    setSuccessMessage('Talk Created with success!');
                    setIsLoading(false);
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage('Failed, try again later');
                    setIsLoading(false);
                    clearMessage();
                });
        }

        if (modalValue == 'Read') {
        }

        if (modalValue == 'Vocabulary Test') {
            setIsLoading(true);

            const data = {
                vocabulary: formData.vocabularyNew,
                date: formData.vocabularyWhen,
            };

            api.post('/v1/vocabulary', data)
                .then((r) => {
                    setSuccessMessage('Vocabulary Created with success!');
                    clearMessage();
                    setIsLoading(false);
                })
                .catch((e) => {
                    setErrorMessage('Failed, Try again later');
                    setIsLoading(false);
                    clearMessage();
                });
        }

        getInfoUser()
    }

    useEffect(() => {
        getInfoUser();
    }, []);

    function clearMessage(time) {
        setTimeout(
            () => {
                setSuccessMessage('');
                setInfoMessage('');
                setErrorMessage('');
            },
            time ? time : 2500,
        );
    }

    function handleModal() {
        setModal(!modal);
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    function handleFileChange(event) {
        const { name, files } = event.target;
        setFormData({
            ...formData,
            [name]: files[0],
        });
    }

    return (
        <>
            <Header />
            <CreateSection onClick={() => handleModal()}>
                <h4>Hello, update your records</h4>
                <button>
                    <img src={add} alt="Add" />
                </button>
            </CreateSection>
            {modal && (
                <>
                    <Overlay onClick={handleModal} />
                    <Modal>
                        <Top>
                            {username && <label>Hello {username}</label>}{' '}
                            <img src={close} alt="close" onClick={handleModal} />
                        </Top>
                        <Form name="form">
                            {successMessage && <Flash level={1} message={successMessage} />}
                            {infoMessage && <Flash level={2} message={infoMessage} />}
                            {errorMessage && <Flash level={3} message={errorMessage} />}
                            <div>
                                <label>What did you do today?</label>
                                <select name="modalValue" onChange={handleInputChange} value={formData.modalValue}>
                                    <option value="Youtube">Youtube</option>
                                    <option value="Podcast">Podcast (Only in Youtube)</option>
                                    <option value="Movie">Movie</option>
                                    <option value="Talk">Talk</option>
                                    <option value="Anki">Anki</option>
                                    <option value="Read">Read</option>
                                    <option value="Vocabulary Test">Vocabulary Test</option>
                                </select>
                            </div>
                            {(formData.modalValue === 'Youtube' || formData.modalValue === 'Podcast') && (
                                <>
                                    <div>
                                        <label>How?</label>
                                        <select
                                            name="youtubeHow"
                                            onChange={handleInputChange}
                                            value={formData.youtubeHow}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Passive">Passive</option>
                                        </select>
                                    </div>
                                    <Input
                                        label="Insert the URL of the Video (Youtube)"
                                        placeholder={'www.youtube.com/example'}
                                        name="youtubeUrl"
                                        onChange={handleInputChange}
                                        value={formData.youtubeUrl}
                                    />
                                </>
                            )}
                            {formData.modalValue === 'Movie' && (
                                <>
                                    <div>
                                        <label>How?</label>
                                        <select name="movieHow" onChange={handleInputChange} value={formData.movieHow}>
                                            <option value="Active">Active</option>
                                            <option value="Passive">Passive</option>
                                        </select>
                                    </div>
                                    <Input
                                        type="text"
                                        name="movieWhich"
                                        label="Which Movie/TV Show?"
                                        value={formData.movieWhich}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Send the Subtitles"
                                        type="file"
                                        name="movieFile"
                                        onChange={handleFileChange}
                                    />
                                    <Input
                                        label={'How long?'}
                                        type="number"
                                        name="movieLong"
                                        placeholder="In minutes"
                                        onChange={handleInputChange}
                                    />
                                </>
                            )}
                            {formData.modalValue === 'Talk' && (
                                <>
                                    <div>
                                        <label>How?</label>
                                        <select name="talkHow" onChange={handleInputChange} value={formData.talkHow}>
                                            <option value="Chatting">Chatting</option>
                                            <option value="Debating">Debating</option>
                                        </select>
                                    </div>
                                    <Input
                                        type="number"
                                        name="talkLong"
                                        label="How long?"
                                        placeholder={'In Minutes'}
                                        value={formData.talkLong}
                                        onChange={handleInputChange}
                                    />
                                </>
                            )}
                            {formData.modalValue === 'Anki' && (
                                <>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Input
                                            type="number"
                                            name="ankiNew"
                                            label="New Cards"
                                            placeholder={'New Cards'}
                                            value={formData.ankiNew}
                                            onChange={handleInputChange}
                                        />
                                        <Input
                                            type="number"
                                            name="ankiReviewed"
                                            label="Reviewed Anki"
                                            placeholder={'Reviewed Cards'}
                                            value={formData.ankiReviewed}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <Input
                                        type="number"
                                        name="ankiLong"
                                        label="How long?"
                                        placeholder={'In Minutes'}
                                        value={formData.ankiLong}
                                        onChange={handleInputChange}
                                    />
                                </>
                            )}
                            {formData.modalValue === 'Vocabulary Test' && (
                                <>
                                    <Input
                                        type="number"
                                        name="vocabularyNew"
                                        label="How Much?"
                                        placeholder={'Total Vocabulary'}
                                        value={formData.vocabularyNew}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        type="date"
                                        name="vocabularyWhen"
                                        label="When?"
                                        value={formData.vocabularyWhen}
                                        onChange={handleInputChange}
                                    />
                                </>
                            )}
                            <Button onClick={handleSubmit} type="button" disabled={isLoading} text={'Submit'} />
                        </Form>
                    </Modal>
                </>
            )}

            <Status>
                <Swiper
                    modules={[Navigation, Autoplay, Pagination, A11y]}
                    navigation
                    loop={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    spaceBetween={50}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        768: {
                            slidesPerView: 2,
                        },
                        1168: {
                            slidesPerView: 3,
                        },
                    }}
                >
                    <SwiperSlide>
                        <Card>
                            <h5>Total Vocabulary</h5> <p>{vocabulary}</p>
                        </Card>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Card>
                            <h5>Average Vocabulary Learned</h5> <p>{vocabularyAverage}</p>
                        </Card>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Card>
                            <h5>Total Words Medias</h5> <p>{mediasWords}</p>
                        </Card>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Card>
                            <h5>Total Words Past 30 Days</h5> <p>{vocabulary}</p>
                        </Card>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Card>
                            <h5>Total Hours</h5> <p>{vocabulary}</p>
                        </Card>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Card>
                            <h5>Total Hours Youtube + Podcast</h5> <p>{totalTimeYTBPD}</p>
                        </Card>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Card>
                            <h5>Total Hours Last Week</h5> <p>{vocabulary}</p>
                        </Card>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Card>
                            <h5>Total Vocabulary</h5> <p>{vocabulary}</p>
                        </Card>
                    </SwiperSlide>
                </Swiper>
            </Status>

            <Charts>
                <Chart>
                    <LineChart
                        width={wsz}
                        height={hsz}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </Chart>
                <Chart>
                    <LineChart
                        width={wsz}
                        height={hsz}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </Chart>
            </Charts>

            <Journey>
                {listJourney.length > 0 &&
                    listJourney.map((item, index) => {
                        const clearDate = dayjs(item.created_at).format('DD/MM/YYYY');

                        return (
                            <JourneyCard
                                key={index}
                                icon={item.source}
                                title={item.source}
                                describe={item.title}
                                time={item.time}
                                words={item.total_words}
                                date={clearDate}
                                withoutTitle={item.type}
                                tl={item.target_language}
                                reviewed={item.reviewed ? "Reviewed " + item.reviewed : null}
                                added={item.added_cards ? "Added Cards " + item.added_cards : null}
                                total={item.vocabulary ? "Vocabulary " + item.vocabulary : null}
                                diff={item.diff_last ? "Difference " + item.diff_last : null}
                            />
                        );
                    })}
                <JourneyCard
                    icon={youtube}
                    title={'Youtube'}
                    describe={'Harry Potter and The Chamber of Secrets'}
                    date={'01/01/2024'}
                    time={'00:13:32'}
                    words={'12312'}
                    withoutTitle={'AudioBook'}
                />
            </Journey>
        </>
    );
}
