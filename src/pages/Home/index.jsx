import { Card, Chart, Charts, CreateSection, Journey, Modal, Overlay, Status, Top, Form, Filter } from './styles';

import { JourneyCard } from '../../components/JourneyCard/index.jsx';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input/index.jsx';
import { Button } from '../../components/Button/index.jsx';
import { Flash } from '../../components/Flash/';
import 'cal-heatmap/cal-heatmap.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, A11y } from 'swiper/modules';

import ReactPaginate from 'react-paginate';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import duration from 'dayjs/plugin/duration';

dayjs.extend(isBetween);
dayjs.extend(duration);

import { useState, useEffect } from 'react';
import {
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
} from 'recharts';

import { api } from '../../services/api.js';

import add from '../../assets/add.svg';
import close from '../../assets/close.svg';

import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import { Footer } from '../../components/Footer/index.jsx';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

import MoonLoader from "react-spinners/MoonLoader";
import iso6391 from 'iso-639-1';

import CalHeatmap from 'cal-heatmap';
import Tooltips from 'cal-heatmap/plugins/Tooltip';

const cal = new CalHeatmap()

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
        bookHowLong: '',
        vocabularyNew: '',
        vocabularyWhen: '',
        targetLanguage: localStorage.getItem('@targetLanguage'),
    };

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
    const [heatMapStartDate, setHeatMapStartdate] = useState();
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

    const [orderedList, setOrderedList] = useState([])
    const [languages, setLanguages] = useState([])
    const [addNewLanguage, setAddNewLanguage] = useState()

    function formatSeconds(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        // Using dayjs to format the time as HH:MM:SS
        return dayjs().hour(hours).minute(minutes).second(remainingSeconds).format('HH:mm:ss');
    }

    async function getInfoUser() {
        let response = await api.get("/user/me");
        const data = response.data

        setBooks(data.user.books.length);
        setBookList(data.user.books);

        // Calculate total book words and total time spent on books (using available fields)
        let totalBooksWords = 0;
        let totalTimeBooks = 0;

        const latestBookHistories = {};

        data.user.booksHistory.forEach(history => {
            const bookId = history.id;  // Assuming bookId is a property in booksHistory
            if (!latestBookHistories[bookId] || new Date(history.createdAt) > new Date(latestBookHistories[bookId].createdAt)) {
                latestBookHistories[bookId] = history;
            }
        });

        setBooksHistory(data.user.booksHistory)

        // Now calculate total words and time for only the most recent entry for each book
        Object.values(latestBookHistories).forEach(history => {
            totalBooksWords += history.totalWords || 0; // Adjust if totalWords is available
            totalTimeBooks += history.time || 0; // Adjust if time is available
        });

        setBooksWords(totalBooksWords);
        setBooksTotalTime(formatSeconds(totalTimeBooks));

        // Media (YouTube) data processing
        let youtubeWords = data.user.youtube.reduce((acc, video) => acc + video.totalWords, 0);
        setMediasWords(youtubeWords);

        let totalYouTubeTime = data.user.youtube.reduce((acc, video) => acc + video.duration, 0);
        setTotalTitmeYTBPD(formatSeconds(totalYouTubeTime)); // Fixed typo here (from setTotalTitmeYTBPD to setTotalTimeYTB)

        // Talk data processing
        setTalk(data.user.output.length);

        let talkTotalTime = data.user.output.reduce((acc, talk) => acc + talk.time, 0);
        setTalkTotalTime(formatSeconds(talkTotalTime));

        let talkAverageTime = data.user.output.length ? talkTotalTime / data.user.output.length : 0;
        setTalkAverage(formatSeconds(talkAverageTime));

        // Vocabulary (Anki) processing
        setVocabularyAverage(data.user.userConfigs.averageWordsPerPage || 0);
        setVocabulary(data.user.anki.length);

        // Combined timeline (merge and order all events by date)
        const ordered = [
            ...data.user.anki,
            ...data.user.booksHistory,
            ...data.user.youtube,
            ...data.user.output
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const journey = [
            ...ordered,
            ...data.user.books
        ]

        setOrderedList(ordered);
        setListJourney(journey);
        setListJourneyWithoutFilter(journey);

        let daysStreak = 0; // Current streak of consecutive days
        let bigStreak = 0; // Longest streak
        let daysOfImmersion = 0; // Total immersion days

        for (let i = 1; i < ordered.length; i++) {
            const currentDate = new Date(ordered[i].createdAt);
            const previousDate = new Date(ordered[i - 1].createdAt);

            const diffInDays = (previousDate.setHours(0, 0, 0, 0) - currentDate.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24);

            if (diffInDays === 1) {
                daysStreak++; // Continue the streak
            } else if (diffInDays > 1) {
                daysStreak = 1; // Reset streak to 1 for the current day
            }

            if (daysStreak > bigStreak) {
                bigStreak = daysStreak;
            }

            if (diffInDays > 0) {
                daysOfImmersion++;
            }
        }

        if (ordered.length > 0) {
            daysOfImmersion++;
        }

        setStreak(daysStreak);
        setLongestStreak(bigStreak);
        setDaysOfImmersion(data.dailyData.length);

        const parsedDurationMonth = response.data.monthlyData?.map(item => {
            const durationInHours = Math.round(item.totalseconds / 3600);  // Adjust to total seconds for accurate hours
            const parsedMonth = new Date(item.month).toLocaleDateString(userLocale, { month: "long", year: "numeric" });
            return { month: parsedMonth, duration: durationInHours };
        }) || [];

        setChartMonthHour(parsedDurationMonth);

        const languages = Array.from(new Set(ordered.map(item => item.targetLanguage).filter(Boolean)));
        setLanguages(languages.length > 0 ? languages : [data.user.userConfigs.targetLanguage]);

        const heatmapData = data.dailyData?.map(item => ({
            date: new Date(item.day),
            count: Number(item.totalSeconds)
        }));

        cal.paint({
            data: { source: heatmapData, type: 'json', x: d => d.date, y: d => d.count },
            scale: {
                color: { type: 'threshold', range: ['#14432a', '#166b34', '#37a446', '#4dd05a'], domain: [10, 20, 30, 60] },
            },
            date: { start: new Date(data.user.createdAt) },
            domain: { type: 'month', label: { text: 'MMM', textAlign: 'start', position: 'top' } },
            subDomain: { type: 'ghDay', radius: 2, width: 11, height: 11, gutter: 4 },
            itemSelector: "#heatmap",
            theme: "dark",
        });

        setDailyGoal(data.user.userConfigs.dailyGoal);
        setDailyGoalDid(Math.round(response.data.dailyData[response.data.dailyData.length - 1]?.totalSeconds / 60) || 0);

        // Total time formatting
        let totalTime = 0
        for (let i = 0; i < data.dailyData.length; i++) {
            totalTime = + Number(data.dailyData[i].totalSeconds)
        }

        setTotalTime(formatSeconds(totalTime));
    }

    function handleSubmit(e) {
        e.preventDefault();

        const modalValue = formData.modalValue;
        const targetLanguage = formData.targetLanguage

        if (targetLanguage === 'newLanguage') {
            setErrorMessage('Set the language of the content.')
            return
        }

        if (modalValue == 'Youtube' || modalValue == 'Podcast') {
            setIsLoading(true);

            const data = {
                url: formData.youtubeUrl,
                type: formData.modalValue,
                watchType: formData.youtubeHow,
                targetLanguage: targetLanguage,
            };

            if (!data.url || !data.watchType) {
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

            api.post('/youtube', data)
                .then((response) => {
                    setSuccessMessage('Youtube Created with Success');
                    setIsLoading(false);
                    clearMessage();
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
                reviewed: Number(formData.ankiReviewed),
                newCards: Number(formData.ankiNew),
                time: Number(formData.ankiLong * 60),
                targetLanguage: targetLanguage,
            };

            api.post('/anki', data)
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

        if (modalValue == 'Talk') {
            setIsLoading(false);

            const data = {
                output: {
                    type: formData.talkHow,
                    duration: Number(formData.talkLong * 60),
                    targetLanguage: targetLanguage,
                }
            };

            api.post('/output', data)
                .then((response) => {
                    setSuccessMessage('Talk Created with success!');
                    setIsLoading(false);
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage(e.response.data.error);
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
                    book: {
                        title: formData.bookNewTitle,
                        targetLanguage: targetLanguage,
                    },
                    bookHistory: {
                        actualPage: 0,
                        totalPages: Number(formData.bookNewPages),
                        readType: "First"
                    }
                };

                if (!data.book.title || !data.bookHistory.totalPages) {
                    setErrorMessage('All The fields are required');
                    clearMessage();
                    return;
                }

                if (data.bookHistory.pages >= 20000) {
                    setErrorMessage('Books Maximum Pages is 20000 pages');
                    clearMessage();
                    return;
                }

                api.post('/book', data)
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
                    bookHistory: {
                        readType: formData.bookHow,
                        actualPage: Number(bookPages),
                        //time: Number(formData.bookHowLong),
                        //target_language: targetLanguage,
                    }
                };

                if (!data.bookHistory.readType || !data.bookHistory.actualPage) {
                    setErrorMessage('All The fields are required');
                    clearMessage();
                    return;
                }


                api.post(`/book/${editBook.id}/history`, data)
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
                vocabulary: Number(formData.vocabularyNew),
                target_language: targetLanguage,
            };

            api.post('/v1/vocabulary', data)
                .then((r) => {
                    setSuccessMessage(r.data);
                    clearMessage();
                    setIsLoading(false);
                })
                .catch((e) => {
                    setErrorMessage(e.response.data.error);
                    setIsLoading(false);
                    clearMessage();
                }).finally(() => {
                    getInfoUser();
                });
        }
    }

    function handleDelete(source, id) {
        if (source == 'podcast' || source == 'youtube' || source == "medias") {
            api.delete(`/youtube/${id}`)
                .then((response) => {
                    const removeFromList = listJourney.find((item) => item.id != id)
                    setListJourney(...removeFromList)
                    setInfoMessage(response.data);
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage(e.response.data.error);
                    clearMessage();
                }).finally(() => {
                });
        }
        if (source == "books") {
            api.delete(`/book/${id}`)
                .then((response) => {
                    const removeFromList = listJourney.find((item) => item.id != id)
                    setListJourney(...removeFromList)
                    setInfoMessage(response.data);
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage(e.response.data.error);
                    clearMessage();
                }).finally(() => {
                });
        }

        if (source == "booksHistory") {
            api.delete(`/book/history/${id}`)
                .then((response) => {
                    const removeFromList = listJourney.find((item) => item.id != id)
                    setListJourney(...removeFromList)
                    setInfoMessage(response.data);
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage(e.response.data.error);
                    clearMessage();
                }).finally(() => {
                });
        }

        if (source == 'anki') {
            api.delete(`/anki/${id}`)
                .then((response) => {
                    const removeFromList = listJourney.find((item) => item.id != id)
                    setListJourney(...removeFromList)
                    setInfoMessage(response.data);
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage(e.response);
                    clearMessage();
                }).finally(() => {
                });
        }

        if (source == 'output') {
            api.delete(`/output/${id}`)
                .then((response) => {
                    const removeFromList = listJourney.find((item) => item.id != id)
                    setListJourney(...removeFromList)
                    setInfoMessage(response.data);
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage(e.response.data);
                    clearMessage();
                }).finally(() => {
                    getInfoUser();
                });
        }

        if (source == 'Vocabulary') {
            api.delete(`/vocabulary/${id}`)
                .then((response) => {
                    setInfoMessage(response.data);
                    clearMessage();
                })
                .catch((e) => {
                    setErrorMessage(e.response.data.error);
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
        })[0]

        if (selectedBook) {
            const actualBook = booksHistory.filter((book) => {
                return book.book.id === selectedBook.id
            }).sort()
            setBookPages(actualBook[actualBook.length - 1].actualPage)
            setEditBook(selectedBook);
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
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Input
                                                    type={'number'}
                                                    label={'What is your current page?'}
                                                    placeholder={'Only Numbers'}
                                                    onChange={(e) => setBookPages(e.target.value)}
                                                    value={bookPages}
                                                />
                                                <Input
                                                    type={'number'}
                                                    name="bookHowLong"
                                                    label={'For how long time? (Minutes)'}
                                                    placeholder={'In Minutes'}
                                                    value={formData.bookHowLong}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
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
                                </>
                            )}
                            <div>
                                <label>In which language? </label>
                                <select name="targetLanguage">
                                    <option value={formData.targetLanguage}>{iso6391.getName(formData.targetLanguage)}</option>
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
                            <h4 style={{ textAlign: 'center' }}>Your Daily goal is {dailyGoal} min, you did</h4>
                            <CircularProgressbar value={dailyGoalDid} maxValue={dailyGoal} text={`${dailyGoalDid} min`} />
                        </Card>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Card>
                            <h5>Your Biggest Streak</h5> <p>{streak}</p>
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
                    <div style={{
                        overflow: 'auto',
                        alignItems: 'stretch',
                        width: '100%',
                    }}>
                        <h4 style={{ textAlign: 'center', float: 'left' }}>Your Heat Map</h4>
                        <div id='heatmap' style={{
                            margin: '0 auto'
                        }}></div>
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-around' }}>
                            <a
                                style={{
                                    color: '#fff'
                                }}
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    cal.previous();
                                }}
                            >
                                ← Previous
                            </a>
                            <a
                                style={{
                                    color: '#fff'
                                }}
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    cal.next();
                                }}
                            >
                                Next →
                            </a>
                        </div>
                    </div>
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
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#252525' }}
                                labelFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString(userLocale, {
                                        month: 'long',
                                        year: 'numeric',
                                    });
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="duration" name="Hours By Month" stroke="#8884d8" />
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
                                <option value="Talk">Talk</option>
                                <option value="Anki">Anki</option>
                                <option value="Books">Read</option>
                                <option value="Vocabulary">Vocabulary Test</option>
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
                    const clearDate = dayjs(item.createdAt).format('DD/MM/YYYY');
                    if (item.source == 'books') {
                        return null
                    }

                    let book;
                    if (item.source == 'booksHistory') {
                        const thisBook = item.book
                        book = thisBook.title
                        item.targetLanguage = item.book.targetLanguage
                        if (item.actualPage === 0) {
                            item.actualPage = "0"
                            item.totalWords = "0"
                        }
                    }

                    return (
                        <JourneyCard
                            key={index}
                            icon={item.source}
                            title={item.source}
                            describe={item.title}
                            time={formatSeconds(item.duration)}
                            words={item.totalWords}
                            date={clearDate}
                            withoutTitle={item.type}
                            tl={item.targetLanguage}
                            reviewed={item.reviewed ? 'Reviewed ' + item.reviewed : null}
                            added={item.newCards ? 'Added Cards ' + item.newCards : null}
                            total={item.vocabulary ? 'Vocabulary ' + item.vocabulary : null}
                            diff={item.timeDiff ? 'Difference ' + formatSeconds(item.timeDiff) : null}
                            bookTitle={item.diff_last ? 'Difference ' + item.diff_last : null}
                            book={book}
                            readType={item.readType ? 'Read Type: ' + item.readType : null}
                            totalPages={item.totalPages && item.actualPage ? `${item.actualPage}/${item.totalPages}` : null}
                            timeSession={item.time_diff ? 'Session Time ' + item.time_diff : null}
                            onClick={() => handleDelete(item.source, item.id)}
                        />
                    );
                })}
            </Journey>
            <Footer />
        </>
    );
}
