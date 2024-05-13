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
import {
    CartesianGrid,
    BarChart,
    Line,
    Bar,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
} from 'recharts';
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

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

import { MonthPicker, MonthInput } from 'react-lite-month-picker';
import MoonLoader from "react-spinners/MoonLoader";
import iso6391 from 'iso-639-1';

const wsz = 320;
const hsz = 320;

export function Home() {
    const userLocale = navigator.language;
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
        bookHow: 'Active',
        bookNewTitle: '',
        bookNewPages: '',
        vocabularyNew: '',
        vocabularyWhen: '',
        targetLanguage: '',
    };

    const instance = Axios.create();
    const axiosCache = setupCache(instance);

    const [value, onChange] = useState([new Date(2024, 1, 1), new Date()]);

    const [globalSuccessMessage, setGlobalSuccessMessage] = useState('');

    const [successMessage, setSuccessMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { width, height } = useWindowSize();
    const [confetti, setConfetti] = useState(false);

    const [chartMonthHour, setChartMonthHour] = useState([]);
    const [heatMap, setHeatMap] = useState([]);
    const [dailyRegister, setDailyRegister] = useState([]);
    const [heatMapStartDate, setHeatMapStartdate] = useState(new Date(2023));
    const [chartMonthCumulative, setChartMonthCumulative] = useState([]);

    const [totalTime, setTotalTime] = useState('00:00:00');
    const [streak, setStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [daysOfImmersion, setDaysOfImmersion] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(0);
    const [dailyGoalDid, setDailyGoalDid] = useState(0);

    const [vocabularyAverage, setVocabularyAverage] = useState(0);
    const [vocabulary, setVocabulary] = useState(0);

    const [mediasWords, setMediasWords] = useState(0);

    const [booksWords, setBooksWords] = useState(0);
    const [booksTotalPages, setBooksTotalPages] = useState(0);
    const [booksTotalTime, setBooksTotalTime] = useState('00:00:00');
    const [books, setBooks] = useState(0);
    const [bookList, setBookList] = useState([]);
    const [booksHistory, setBooksHistory] = useState([]);

    const [currentBook, setCurrentBook] = useState('new');
    const [bookPages, setBookPages] = useState(0);
    const [editBook, setEditBook] = useState([]);

    const [talkTotalTime, setTalkTotalTime] = useState('00:00:00');
    const [talkStreak, setTalkStreak] = useState(0);
    const [talkAverage, setTalkAverage] = useState('00:00:00');
    const [talk, setTalk] = useState();

    const [filter, setFilter] = useState('All');

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [formData, setFormData] = useState(initialFormData);

    const [modal, setModal] = useState(false);
    const [username, setUsername] = useState('Admin');

    const [totalTimeYTBPD, setTotalTitmeYTBPD] = useState('00:00:00');

    const [listJourney, setListJourney] = useState([]);
    const [listJourneyWithoutFilter, setListJourneyWithoutFilter] = useState([]);

    const [isPickerOpen, setIsPickerOpen] = useState(false)
    const [selectedMonthData, setSelectedMonthData] = useState({
        month: dayjs().month() + 1,
        year: dayjs().year(),
    })
    const [orderedList, setOrderedList] = useState([])
    const [language, setLanguage] = useState([])
    const [addNewLanguage, setAddNewLanguage] = useState()

    async function getInfoUser() {
        axios
            .all([
                api.get('/v1/users/user'),
                api.get('/v1/vocabulary'),
                api.get('/v1/books'),
                api.get('/v1/talk'),
                api.get('/v1/users'),
            ])
            .then(
                axios.spread((userResponse, vocabularyResponse, booksResponse, talkResponse, userConfigs) => {
                    const response = userResponse;
                    const user = userConfigs;
                    const vocabulary = vocabularyResponse;
                    const books = booksResponse;
                    const talk = talkResponse;

                    setBookList(books.data.books);
                    setOrderedList(response)
                    setLanguage(response.data.usedLanguages)

                    setTotalTime(response.data.totalTime);
                    setStreak(response.data.streak.currentStreak);
                    setLongestStreak(response.data.streak.longestStreak);

                    setVocabularyAverage(vocabulary.data.average);
                    const totalVocabulary = vocabulary.data.vocabulary.length
                        ? vocabulary.data.vocabulary[vocabulary.data.vocabulary.length - 1].vocabulary || 0
                        : 0;
                    setVocabulary(totalVocabulary);

                    setMediasWords(response.data.totalWordsMedia);
                    setTotalTitmeYTBPD(response.data.mediasTotalTime);

                    setBooksWords(books.data.totalBooksWords);
                    setBooksTotalPages(books.data.totalBooksPages);
                    setBooksTotalTime(books.data.totalTimeBooks);
                    setBooks(books.data.books.length);
                    setBooksHistory(books.data.booksLastHistory);

                    setTalk(talk.data.output.length);
                    setTalkTotalTime(talk.data.outputTotalTime);
                    setTalkAverage(talk.data.averageTime);
                    setTalkStreak(talk.data.outputStreak.currentStreak);

                    setListJourney(response.data.ordered);
                    setListJourneyWithoutFilter(response.data.ordered);

                    setDaysOfImmersion(response.data.heatMap.length);

                    const heatMapStart = new Date(response.data.heatMap[0].date);
                    setHeatMapStartdate(heatMapStart);
                    setHeatMap(response.data.heatMap);

                    const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');
                    const todayGoal = response.data.heatMap.filter((entry) => entry.date === today);
                    setDailyGoal(user.data.configs.dailyGoal);
                    if (todayGoal && todayGoal.length > 0) {
                        setDailyGoalDid(todayGoal[0].count || 0);
                    } else {
                        setDailyGoalDid(0);
                    }

                    if (dailyGoalDid >= user.data.configs.dailyGoal) {
                        setConfetti(true);
                    }
                    setChartMonthHour(response.data.hoursByMonth.reverse());
                    const cumulativeHours = [];
                    let cumulativeSum = 0;

                    const dailyRegisterDate = response.data.ordered.filter((item) => {
                        const itemDateFormatted = dayjs(item.created_at).format('MM/DD/YYYY');
                        const itemDate = dayjs(itemDateFormatted)
                        const startOfCurrentMonth = dayjs().startOf('month');
                        const endOfCurrentMonth = dayjs().endOf('month');

                        return itemDate.isBetween(startOfCurrentMonth, endOfCurrentMonth, null, '[]');
                    });

                    const activities = ["Youtube", "Podcast", "books_history", "books", "anki", "talk", "vocabulary"];

                    const dailyDetails = {};

                    const firstDayOfMonth = dayjs().startOf('month');

                    const daysUntilToday = dayjs().diff(firstDayOfMonth, 'day') + 1;

                    for (let i = 0; i < daysUntilToday; i++) {
                        const currentDate = firstDayOfMonth.add(i, 'day');
                        const formattedDate = currentDate.format('MM/DD/YYYY');
                        dailyDetails[formattedDate] = {};
                    }

                    dailyRegisterDate.forEach(element => {
                        const day = dayjs(element.created_at).format('MM/DD/YYYY');

                        if (!dailyDetails[day]) {
                            dailyDetails[day] = {};
                        }

                        if (!dailyDetails[day][element.source]) {
                            dailyDetails[day][element.source] = {
                                activity: [],
                                totalMinutes: 0,
                            };
                        }

                        dailyDetails[day][element.source].activity.push(element);

                        if (element.source === 'books_history' && element.time_diff) {
                            const timeSplited = element.time_diff.split(':')
                            const hours = parseInt(timeSplited[0]);
                            const minutes = parseInt(timeSplited[1]);
                            const seconds = parseInt(timeSplited[2]);
                            const totalMinutes = Math.floor(hours * 60 + minutes + seconds / 60);

                            dailyDetails[day][element.source].totalMinutes += totalMinutes;
                            return
                        }
                        const timeSplited = element.time.split(':');
                        const hours = parseInt(timeSplited[0]);
                        const minutes = parseInt(timeSplited[1]);
                        const seconds = parseInt(timeSplited[2]);
                        const totalMinutes = Math.floor(hours * 60 + minutes + seconds / 60);

                        dailyDetails[day][element.source].totalMinutes += totalMinutes;
                    });


                    const dailyDetailsFormated = Object.keys(dailyDetails).map(key => ({
                        date: key,
                        minutes: dailyDetails[key],
                    }));

                    const dailyMinutesSeparated = dailyDetailsFormated.map(item => {
                        const date = dayjs(item.date).format('MM/DD/YYYY');
                        const minutes = item.minutes;
                        const activityMinutes = activities.map(activity => minutes[activity] ? minutes[activity].totalMinutes : 0);
                        return { date, ...Object.fromEntries(activities.map((activity, index) => [activity, activityMinutes[index]])) };
                    });

                    setDailyRegister(dailyMinutesSeparated)

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

    function handleDailyRegister() {
        const ordered = orderedList.data.ordered

        const dailyRegisterDate = ordered.filter((item) => {
            const itemDate = dayjs(item.created_at).format('MM/DD/YYYY');
            const itemDateFormatted = dayjs(itemDate)
            const startOfCurrentMonth = dayjs(`${selectedMonthData.month}/01/${selectedMonthData.year}`).startOf('month');
            const endOfCurrentMonth = dayjs(`${selectedMonthData.month}/01/${selectedMonthData.year}`).endOf('month')

            return itemDateFormatted.isBetween(startOfCurrentMonth, endOfCurrentMonth, null, '[]');
        });

        const activities = ["Youtube", "Podcast", "books_history", "books", "anki", "talk", "vocabulary"];

        const dailyDetails = {};

        const startOfCurrentMonth = dayjs(`${selectedMonthData.month}/01/${selectedMonthData.year}`).startOf('month');

        for (let i = 0; i < 30; i++) {
            const currentDate = startOfCurrentMonth.add(i, 'day');
            const formattedDate = currentDate.format('MM/DD/YYYY');
            dailyDetails[formattedDate] = {};
        }

        dailyRegisterDate.forEach(element => {
            const day = dayjs(element.created_at).format('MM/DD/YYYY');

            if (!dailyDetails[day]) {
                dailyDetails[day] = {};
            }

            if (!dailyDetails[day][element.source]) {
                dailyDetails[day][element.source] = {
                    activity: [],
                    totalMinutes: 0,
                };
            }

            dailyDetails[day][element.source].activity.push(element);

            const timeSplited = element.time.split(':');
            const hours = parseInt(timeSplited[0]);
            const minutes = parseInt(timeSplited[1]);
            const seconds = parseInt(timeSplited[2]);
            const totalMinutes = Math.floor(hours * 60 + minutes + seconds / 60);

            dailyDetails[day][element.source].totalMinutes += totalMinutes;
        });


        const dailyDetailsFormated = Object.keys(dailyDetails).map(key => ({
            date: key,
            minutes: dailyDetails[key],
        }));

        const dailyMinutesSeparated = dailyDetailsFormated.map(item => {
            const date = item.date;
            const minutes = item.minutes;
            const activityMinutes = activities.map(activity => minutes[activity] ? minutes[activity].totalMinutes : 0);
            return { date, ...Object.fromEntries(activities.map((activity, index) => [activity, activityMinutes[index]])) };
        });

        setDailyRegister(dailyMinutesSeparated)
    }

    function handleSubmit(e) {
        e.preventDefault();

        const modalValue = formData.modalValue;
        const targetLanguage = formData.targetLanguage

        if (modalValue == 'Youtube' || modalValue == 'Podcast') {
            setIsLoading(true);

            const data = {
                url: formData.youtubeUrl,
                type: formData.modalValue,
                watch_type: formData.youtubeHow,
                target_language: targetLanguage,
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
                }).finally(() => {
                    getInfoUser();
                })
        }

        if (modalValue == 'Anki') {
            setIsLoading(true);

            const data = {
                reviewed: formData.ankiReviewed,
                newCards: formData.ankiNew,
                time: formData.ankiLong,
                target_language: targetLanguage,
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
                }).finally(() => {
                    getInfoUser();
                });
        }

        if (modalValue == 'Movie') {
            setIsLoading(false);

            const data = {
                subtitles: formData.movieFile,
                title: formData.movieWhich,
                watch_type: formData.movieHow,
                type: formData.modalValue,
                target_language: targetLanguage,
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
                }).finally(() => {
                    getInfoUser();
                });
        }

        if (modalValue == 'Talk') {
            setIsLoading(false);

            const data = {
                type: formData.talkHow,
                time: Number(formData.talkLong),
                target_language: targetLanguage,
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
                }).finally(() => {
                    getInfoUser();
                });
        }

        if (modalValue == 'Read') {
            if (currentBook == 'new') {
                setIsLoading(false);

                const data = {
                    title: formData.bookNewTitle,
                    pages: formData.bookNewPages,
                    target_language: targetLanguage,
                };

                if (!data.title || !data.pages) {
                    setErrorMessage('All The fields are required');
                    clearMessage();
                    return;
                }

                if (data.pages >= 20000) {
                    setErrorMessage('Books Maximum Pages is 20000 pages');
                    clearMessage();
                    return;
                }

                api.post('/v1/books', data)
                    .then((response) => {
                        setSuccessMessage('Book created with success');
                        setIsLoading(false);
                        clearMessage();
                    })
                    .catch((e) => {
                        setErrorMessage('Was not possible to create a book, try again later');
                        setIsLoading(false);
                        clearMessage();
                    }).finally(() => {
                        getInfoUser();
                    });
            } else {
                const data = {
                    read_type: formData.bookHow,
                    read_pages: Number(bookPages),
                    target_language: targetLanguage,
                };

                if (!data.read_pages || !data.read_type) {
                    setErrorMessage('All The fields are required');
                    clearMessage();
                    return;
                }

                if (data.read_pages >= 20000) {
                    setErrorMessage('Books Maximum Pages is 20000 pages');
                    clearMessage();
                    return;
                }

                api.patch(`/v1/books/${editBook}`, data)
                    .then((response) => {
                        setSuccessMessage('Book Updated with success');
                        setIsLoading(false);
                        clearMessage();
                    })
                    .catch((e) => {
                        setErrorMessage(e.response.data.message);
                        setIsLoading(false);
                        clearMessage();
                    }).finally(() => {
                        getInfoUser();
                    });
            }
        }

        if (modalValue == 'Vocabulary Test') {
            setIsLoading(true);

            const data = {
                vocabulary: formData.vocabularyNew,
                date: formData.vocabularyWhen,
                target_language: targetLanguage,
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
                }).finally(() => {
                    getInfoUser();
                });
        }
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
                }).finally(() => {
                    getInfoUser();
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
                }).finally(() => {
                    getInfoUser();
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
                }).finally(() => {
                    getInfoUser();
                });
        }

        if (source == 'vocabulary') {
            api.delete(`/v1/vocabulary/${id}`)
                .then((response) => {
                    setInfoMessage('Vocabulary Deleted with Sucess!');
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage('Was not possible to delete this content, try again later');
                    clearMessage();
                }).finally(() => {
                    getInfoUser();
                });
        }
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
        setIsFetching(true)
        getInfoUser();
        setIsFetching(false)

        const userName = localStorage.getItem('@username');

        setUsername(userName);
    }, []);

    function updateBookPages(selected) {
        const selectedBook = bookList.filter((book) => {
            return book.title == selected;
        });
        if (selectedBook) {
            const history = booksHistory.filter((book) => book.id_book === selectedBook[0].id);
            setEditBook(history[0].id_book);
            setBookPages(history[0].actual_page);
        }
    }

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
            {isFetching && (
                <div style={{
                    position: 'fixed',
                    top: '0',
                    width: '100vw',
                    height: '100vh',
                    zIndex: '100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    backdropFilter: 'blur(3px)'
                }}>
                    <MoonLoader color='#fff' loading={isFetching} size={80} speedMultiplier={0.6} />
                </div>

            )}
            {confetti && (
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={800}
                    tweenDuration={15000}
                    style={{ zIndex: '10000' }}
                />
            )}
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
                            {formData.modalValue === 'Read' && (
                                <>
                                    <div>
                                        <label>Select The book</label>
                                        <select
                                            onChange={(e) => {
                                                setCurrentBook(e.target.value);
                                                updateBookPages(e.target.value);
                                            }}
                                            value={currentBook}
                                        >
                                            <option value="new"> Create a New Book </option>
                                            {bookList.map((item, index) => (
                                                <option key={index} value={item.title}>
                                                    {item.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {currentBook !== 'new' && (
                                        <>
                                            <div>
                                                <label>How?</label>
                                                <select
                                                    name="bookHow"
                                                    onChange={handleInputChange}
                                                    value={formData.bookHow}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Passive">Passive</option>
                                                </select>
                                            </div>
                                            <Input
                                                type={'number'}
                                                label={'What is your current page?'}
                                                placeholder={'Only Numbers'}
                                                onChange={(e) => setBookPages(e.target.value)}
                                                value={bookPages}
                                            />
                                        </>
                                    )}
                                    {currentBook == 'new' && (
                                        <>
                                            <Input
                                                type={'text'}
                                                label={'What is the book?'}
                                                placeholder={'Title'}
                                                name={'bookNewTitle'}
                                                onChange={handleInputChange}
                                                value={formData.bookNewTitle}
                                            />
                                            <Input
                                                type={'number'}
                                                label={'How much pages?'}
                                                placeholder={'in numbers'}
                                                name={'bookNewPages'}
                                                onChange={handleInputChange}
                                                value={formData.bookNewPages}
                                            />
                                        </>
                                    )}
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
                            <div>
                                <label>In which language? </label>
                                <select name="targetLanguage" onChange={(event) => {
                                    handleInputChange(event);
                                    if (event.target.value === 'newLanguage') {
                                        setAddNewLanguage(!addNewLanguage)
                                    }
                                }} value={formData.targetLanguage}>
                                    {language.map((item, index) => {
                                        return (
                                            <option value={item.code} key={index}>{item.languageName}</option>
                                        )
                                    })}
                                    <option value={'newLanguage'}>Add a new Language</option>
                                    <option disabled>You can choose the default in Settings {'>'} Target Language</option>
                                    {
                                        addNewLanguage && (
                                            iso6391.getAllCodes().map((item) => (
                                                <option key={item} value={item}>
                                                    {iso6391.getName(item)}
                                                </option>
                                            ))
                                        )
                                    }
                                </select>
                            </div>
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
                            <h5>Days of Immersion</h5> <p>{daysOfImmersion}</p>
                        </Card>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Card>
                            <h5>Total Words Medias</h5> <p>{mediasWords}</p>
                        </Card>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Card>
                            <h5>Average Vocabulary Learned</h5> <p>{vocabularyAverage}</p>
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

            <Charts>
                <Chart
                    style={{
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                    }}
                >
                    <div style={{ width: 200, height: 200 }}>
                        <h4 style={{ textAlign: 'center' }}>Your Daily goal is {dailyGoal} min, you did</h4>
                        <CircularProgressbar value={dailyGoalDid} maxValue={dailyGoal} text={`${dailyGoalDid} min`} />
                    </div>
                </Chart>
                <Chart
                    style={{
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                    }}
                >
                    <div>
                        <h4 style={{ textAlign: 'center' }}>Your Heat Map</h4>
                        <HeatMap
                            value={heatMap}
                            weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                            rectSize={16}
                            startDate={heatMapStartDate}
                            endDate={new Date()}
                            style={{ color: 'white' }}
                            legendRender={(props) => <rect {...props} y={props.y + 10} rx={5} />}
                            rectProps={{
                                rx: 5,
                            }}
                            panelColors={{
                                0: '#222222',
                                1: '#221e22',
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
                    </div>
                </Chart>
            </Charts>
            <Charts>
                <Chart style={{ overflowX: 'auto', display: 'flex', alignItems: 'center' }}>
                    <MonthInput
                        selected={selectedMonthData}
                        setShowMonthPicker={setIsPickerOpen}
                        showMonthPicker={isPickerOpen}
                        bgColor={"#221E22"}
                        bgColorHover={"#000"}
                        textColor={"#fff"}
                        size={"small"}
                    />
                    {isPickerOpen ? (
                        <div
                            style={{ zIndex: '100000', width: '100%' }}
                        >
                            <MonthPicker
                                setIsOpen={setIsPickerOpen}
                                selected={selectedMonthData}
                                onChange={(e) => {
                                    setSelectedMonthData(e);
                                    handleDailyRegister();
                                }}
                                size={"small"}
                                bgColorMonthActive={"#000"}
                                bgColorPicker={"#221E22"}
                                bgColorMonthHover={"#000"}
                                textColor={"#fff"}
                            />
                        </div>
                    ) : null}
                    <BarChart width={800} height={hsz} data={dailyRegister}>
                        <CartesianGrid strokeDasharray="1 1" />
                        <XAxis
                            dataKey="date"
                        />
                        <YAxis label={{ value: 'Time (minutes)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#252525' }}
                        />

                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="Youtube" fill="#ff0000" name={'Youtube'} stackId={'a'} />
                        <Bar dataKey="Podcast" fill="#709BA2" name={'Podcast'} stackId={'a'} />
                        <Bar dataKey="books_history" fill="#FBDECF" name={'Books'} stackId={'a'} />
                        <Bar dataKey="talk" fill="#872BF4" name={'Talks'} stackId={'a'} />
                        <Bar dataKey="anki" fill="#0988DF" name={'Anki'} stackId={'a'} />

                    </BarChart>
                </Chart>
            </Charts>
            <Charts>
                <Chart
                    style={{
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                    }}
                >
                    <div>
                        Hours By Month
                        <LineChart width={wsz} height={hsz} data={chartMonthHour}>
                            <XAxis dataKey="monthYear" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#252525' }}
                                labelFormatter={(value) => {
                                    const [month, year] = value.split('/');
                                    const date = new Date(`${year}-${month}-01`);
                                    return date.toLocaleDateString(userLocale, {
                                        month: 'long',
                                        year: 'numeric',
                                    });
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="totalTime" name="Hours By Month" stroke="#8884d8" />
                        </LineChart>
                    </div>
                </Chart>
                <Chart
                    style={{
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                    }}
                >
                    <div>
                        Total Hours
                        <LineChart width={wsz} height={hsz} data={chartMonthCumulative}>
                            <XAxis dataKey="monthYear" scale={'point'} />
                            <YAxis />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#252525' }}
                                labelFormatter={(value) => {
                                    const [month, year] = value.split('/');
                                    const date = new Date(`${year}-${month}-01`);
                                    return date.toLocaleDateString(userLocale, {
                                        month: 'long',
                                        year: 'numeric',
                                    });
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="totalTime" name="Total Hours" stroke="#8884d8" />
                        </LineChart>
                    </div>
                </Chart>
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
                    pageRangeDisplayed={3}
                    pageCount={Math.floor(listJourney.length / itemsPerPage)}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                />

                {listJourney.slice(itemOffset, itemOffset + itemsPerPage).map((item, index) => {
                    const clearDate = dayjs(item.created_at).format('DD/MM/YYYY');
                    if (item.source == 'books') {
                        return null
                    }
                    if (item.source == 'books_history') {
                        const thisBook = listJourney.filter((a) => a.id == item.id_book)[0]
                        item.source = thisBook.title
                    }
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
                            bookTitle={item.diff_last ? 'Difference ' + item.diff_last : null}
                            readType={item.readType ? 'Read Type ' + item.read_type : null}
                            timeSession={item.time_diff ? 'Session Time ' + item.time_diff : null}
                            totalPages={item.total_pages && item.actual_page ? `${item.actual_page}/${item.total_pages}` : null}
                            onClick={() => handleDelete(item.source, item.id)}
                        />
                    );
                })}
            </Journey>
            <Footer />
        </>
    );
}
