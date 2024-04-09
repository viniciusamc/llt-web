import { Card, Chart, Charts, CreateSection, Journey, Modal, Overlay, Status, Top, Form, Filter } from './styles';

import axios from 'axios';

import { JourneyCard } from '../../components/JourneyCard/index.jsx';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input/index.jsx';
import { Button } from '../../components/Button/index.jsx';
import { Flash } from '../../components/Flash/';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, A11y } from 'swiper/modules';

import ReactPaginate from 'react-paginate';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { useState, useEffect } from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import HeatMap from '@uiw/react-heat-map';
import ToolTipHeatMap from '@uiw/react-tooltip';

import { api } from '../../services/api.js';

import add from '../../assets/add.svg';
import close from '../../assets/close.svg';

import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { Footer } from '../../components/Footer/index.jsx';

const wsz = 320;
const hsz = 320;

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

    const instance = Axios.create();
    const axiosCache = setupCache(instance);

    const [value, onChange] = useState([new Date(2024, 1, 1), new Date()]);

    const [globalSuccessMessage, setGlobalSuccessMessage] = useState('');

    const [successMessage, setSuccessMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [chartMonthHour, setChartMonthHour] = useState([]);
    const [heatMap, setHeatMap] = useState([]);
    const [chartMonthCumulative, setChartMonthCumulative] = useState([]);

    const [totalTime, setTotalTime] = useState('00:00:00');
    const [streak, setStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);

    const [vocabularyAverage, setVocabularyAverage] = useState(0);
    const [vocabulary, setVocabulary] = useState(0);

    const [mediasWords, setMediasWords] = useState(0);

    const [booksWords, setBooksWords] = useState(0);
    const [booksTotalPages, setBooksTotalPages] = useState(0);
    const [booksTotalTime, setBooksTotalTime] = useState('00:00:00');
    const [books, setBooks] = useState(0);

    const [talkTotalTime, setTalkTotalTime] = useState('00:00:00');
    const [talkStreak, setTalkStreak] = useState(0);
    const [talkAverage, setTalkAverage] = useState('00:00:00');
    const [talk, setTalk] = useState();

    const [filter, setFilter] = useState('All');

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState(initialFormData);

    const [modal, setModal] = useState(false);
    const [username, setUsername] = useState('Admin');

    const [totalTimeYTBPD, setTotalTitmeYTBPD] = useState('00:00:00');

    const [listJourney, setListJourney] = useState([]);
    const [listJourneyWithoutFilter, setListJourneyWithoutFilter] = useState([]);

    async function getInfoUser() {
        axios
            .all([api.get('/v1/users/user'), api.get('/v1/vocabulary'), api.get('/v1/books'), api.get('/v1/talk')])
            .then(
                axios.spread((userResponse, vocabularyResponse, booksResponse, talkResponse) => {
                    const response = userResponse;
                    const vocabulary = vocabularyResponse;
                    const books = booksResponse;
                    const talk = talkResponse;

                    setTotalTime(response.data.totalTime);
                    setStreak(response.data.streak.currentStreak);
                    setLongestStreak(response.data.streak.longestStreak);

                    setVocabularyAverage(vocabulary.data.average);
                    setVocabulary(vocabulary.data.vocabulary[vocabulary.data.vocabulary.length - 1].vocabulary);

                    setMediasWords(response.data.totalWordsMedia);
                    setTotalTitmeYTBPD(response.data.mediasTotalTime);

                    setBooksWords(books.data.totalBooksWords);
                    setBooksTotalPages(books.data.totalBooksPages);
                    setBooksTotalTime(books.data.totalTimeBooks);
                    setBooks(books.data.books.length);

                    setTalk(talk.data.output.length);
                    setTalkTotalTime(talk.data.outputTotalTime);
                    setTalkAverage(talk.data.averageTime);
                    setTalkStreak(talk.data.outputStreak.currentStreak);

                    setListJourney(response.data.ordered);
                    setListJourneyWithoutFilter(response.data.ordered);

                    setHeatMap(response.data.heatMap);
                    setChartMonthHour(response.data.hoursByMonth.reverse());
                    const cumulativeHours = [];
                    let cumulativeSum = 0;

                    for (let i = 0; i < response.data.hoursByMonth.length; i++) {
                        const currentMonthYear = response.data.hoursByMonth[i].monthYear;
                        const currentTotalTime = response.data.hoursByMonth[i].totalTime;

                        cumulativeSum += currentTotalTime;

                        const cumulativeObject = {
                            monthYear: currentMonthYear,
                            totalTime: cumulativeSum,
                        };

                        cumulativeHours.push(cumulativeObject);
                    }

                    setChartMonthCumulative(cumulativeHours);
                }),
            )
            .catch((error) => {
                console.error('Error:', error);
            });
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
                return;
            }

            const youtubeURLCheck = data.url.match(
                /^((?:https?:)?\/\/)?((?:www|m)\.)?(youtube(?:-nocookie)?\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|watch\?.+&v=)?([\w-]{11})(?:\S+)?$/,
            );

            if (!youtubeURLCheck) {
                setErrorMessage('Insert a Valid Youtube URL');
                clearMessage();
                setIsLoading(false);
                return;
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
                time: Number(formData.talkLong),
            };

            if (!data.time || !Number.isInteger(data.time)) {
                setErrorMessage('Please, insert the time in minutes in the field "How Long"');
                clearMessage();
                return;
            }
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

        getInfoUser();
    }

    function handleDelete(source, id) {
        if (source == 'Podcast' || source == 'Youtube') {
            api.delete(`/v1/medias/${id}`)
                .then((response) => {
                    setInfoMessage('Media Deleted With Success!');
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage('Was not possible to delete this content, try again later');
                    clearMessage();
                });
        }

        if (source == 'anki') {
            api.delete(`/v1/anki/${id}`)
                .then((response) => {
                    setInfoMessage('Anki Deleted with Sucess!');
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage('Was not possible to delete this content, try again later');
                    clearMessage();
                });
        }

        if (source == 'talk') {
            api.delete(`/v1/talk/${id}`)
                .then((response) => {
                    setInfoMessage('Conversation Deleted with Sucess!');
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage('Was not possible to delete this content, try again later');
                    clearMessage();
                });
        }

        if(source == 'vocabulary'){
            api.delete(`/v1/vocabulary/${id}`)
                .then((response) => {
                    setInfoMessage('Vocabulary Deleted with Sucess!');
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage('Was not possible to delete this content, try again later');
                    clearMessage();
                });

        }

        getInfoUser();
    }

    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 10;

    function handlePageClick(selected) {
        const offset = selected.selected * itemsPerPage;
        setItemOffset(offset);
    }

    function handleDatePicker() {
        const initialDate = dayjs(value[0], 'DD/MM/YYYY').format('DD/MM/YYYY') || null;
        const finalDate = dayjs(value[1], 'DD/MM/YYYY').format('DD/MM/YYYY') || null;

        const journeyList = listJourneyWithoutFilter;

        let filter2 = '';
        if (filter === 'book') {
            filter2 = 'books_history';
        } else if (filter == 'Youtube') {
            filter2 = 'videos';
        } else if (filter === 'All') {
            const filtered = journeyList.filter((item) => {
                const formattedDate = dayjs(item.created_at, 'DD/MM/YYYY').format('DD/MM/YYYY');
                return formattedDate >= initialDate && formattedDate <= finalDate;
            });
            setListJourney(filtered);
            return;
        }

        const filtered = journeyList.filter((item) => {
            const formattedDate = dayjs(item.created_at, 'DD/MM/YYYY').format('DD/MM/YYYY');
            return (
                (formattedDate >= initialDate && formattedDate <= finalDate && item.source == filter) ||
                item.source == filter2
            );
        });

        setListJourney(filtered);
    }

useEffect(() => {
    getInfoUser();

    const userName = localStorage.getItem('@username');

    setUsername(userName);
}, []);

function clearMessage(time) {
    setTimeout(
        () => {
            setSuccessMessage('');
            setGlobalSuccessMessage('');
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
                        <h5>Your Streak</h5> <p>{streak}</p>
                    </Card>
                </SwiperSlide>
                <SwiperSlide>
                    <Card>
                        <h5>Total Time</h5> <p>{totalTime}</p>
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
                        <h5>Total Words Books</h5> <p>{booksWords}</p>
                    </Card>
                </SwiperSlide>
                <SwiperSlide>
                    <Card>
                        <h5>Total Hours Book</h5> <p>{booksTotalTime}</p>
                    </Card>
                </SwiperSlide>
                <SwiperSlide>
                    <Card>
                        <h5>Total Hours Youtube + Podcast</h5> <p>{totalTimeYTBPD}</p>
                    </Card>
                </SwiperSlide>
                <SwiperSlide>
                    <Card>
                        <h5>Total Pages Books</h5> <p>{booksTotalPages}</p>
                    </Card>
                </SwiperSlide>
                <SwiperSlide>
                    <Card>
                        <h5>Books</h5> <p>{books}</p>
                    </Card>
                </SwiperSlide>
                <SwiperSlide>
                    <Card>
                        <h5>Total Talks</h5> <p>{talk}</p>
                    </Card>
                </SwiperSlide>
                <SwiperSlide>
                    <Card>
                        <h5>Streak Talk</h5> <p>{talkStreak}</p>
                    </Card>
                </SwiperSlide>
                <SwiperSlide>
                    <Card>
                        <h5>Total Time Talk</h5> <p>{talkTotalTime}</p>
                    </Card>
                </SwiperSlide>
                <SwiperSlide>
                    <Card>
                        <h5>Average Talk</h5> <p>{talkAverage}</p>
                    </Card>
                </SwiperSlide>
                <SwiperSlide>
                    <Card>
                        <h5>Your Longest Streak</h5> <p>{longestStreak}</p>
                    </Card>
                </SwiperSlide>
            </Swiper>
        </Status>

            <Chart style={{display: 'flex', flexDirection: 'column', maxWidth: '90vw', margin: '40px auto'}}>
                Your Heat Map
                <HeatMap
                    value={heatMap}
                    weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                    rectSize={16}
                    width={600}
                    startDate={new Date('2024/01/01')}
                    style={{ color: 'white' }}
                    panelColors={{
                        0: '#221e22',
                        10: '#14532d',
                        30: '#166534',
                        40: '#166534',
                        60: '#15803d',
                        120: '#16a34a',
                    }}
                    rectRender={(props, data) => {
                        return (
                            <ToolTipHeatMap
                                placement="top"
                                content={`Time ${data.date}: ${data.count || 0} minutes`}
                            >
                                <rect {...props} />
                            </ToolTipHeatMap>
                        );
                    }}
                />
            </Chart>
        <Charts>
            <Chart>
                <LineChart
                    width={wsz}
                    height={hsz}
                    data={chartMonthHour}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="5 5" stroke="#eee" />
                    <XAxis dataKey="monthYear" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="totalTime"
                        name="Hours By Month"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </Chart>
                <Chart style={{flex: 1, height: '1'}}>
                    <h1>W.I.P</h1>
                </Chart>
            {
                <Chart>
                    <LineChart
                        width={wsz}
                        height={hsz}
                        data={chartMonthCumulative}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="monthYear" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="totalTime"
                            name="Total Hours"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </Chart>
            }
        </Charts>

        <Journey>
            <Filter>
                <h1>Your History</h1>
                <div>
                    <section>
                            <p>Select What you want to see</p>
                            <select name="filterValue" onChange={(e) => setFilter(e.target.value)} value={filter}>
                                <option value="All">All</option>
                                <option value="Youtube">Youtube</option>
                                <option value="Podcast">Podcast</option>
                                <option value="Movie">Movie</option>
                                <option value="talk">Talk</option>
                                <option value="anki">Anki</option>
                                <option value="books">Read</option>
                                <option value="vocabulary">Vocabulary Test</option>
                            </select>
                        </section>
                        <section>
                            <p>Select the date</p>
                            <DateRangePicker
                                calendarAriaLabel="Toggle calendar"
                                clearAriaLabel="Clear value"
                                dayAriaLabel="Day"
                                monthAriaLabel="Month"
                                nativeInputAriaLabel="Date"
                                onChange={onChange}
                                value={value}
                                yearAriaLabel="Year"
                            />
                        </section>
                    </div>
                    <Button text={'Filter'} onClick={() => handleDatePicker()} />
                    {successMessage && <Flash level={1} message={successMessage} />}
                    {infoMessage && <Flash level={2} message={infoMessage} />}
                    {errorMessage && <Flash level={3} message={errorMessage} />}
                </Filter>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={Math.ceil(listJourney.length / itemsPerPage)} // Calculate total pages
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                />

                {listJourney.slice(itemOffset, itemOffset + itemsPerPage).map((item, index) => {
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
                            reviewed={item.reviewed ? 'Reviewed ' + item.reviewed : null}
                            added={item.added_cards ? 'Added Cards ' + item.added_cards : null}
                            total={item.vocabulary ? 'Vocabulary ' + item.vocabulary : null}
                            diff={item.diff_last ? 'Difference ' + item.diff_last : null}
                            onClick={() => handleDelete(item.source, item.id)}
                        />
                    );
                })}
            </Journey>
            <Footer />
        </>
    );
}
