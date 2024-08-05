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
        targetLanguage: '',
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

    async function getInfoUser() {
        let response = await api.get("/v1/user")
        response = response.data

        // book
        setBooks(response.books.totalBooks)
        setBookList(response.books?.books)
        setBooksTotalTime(response.books.totalTimeBooks)
        setBooksWords(response.books.totalBooksWords)
        setBooksHistory(response.books.booksLastHistory)
        setBooksTotalPages(response.books.totalBooksPages)

        // medias
        setMediasWords(response.medias.totalWordCount)
        setTotalTitmeYTBPD(response.medias.time)

        //talk
        setTalk(response.talk.output.length)
        setTalkTotalTime(response.talk.outputTotalTime)
        setTalkAverage(response.talk.averageTime)
        setTalkStreak(response.talk.outputStreak.currentStreak)

        // vocabulary
        setVocabularyAverage(response.vocabulary.average)
        setVocabulary(response.vocabulary.vocabulary.length)

        const ordered = [...response.anki.anki, ...response.books?.booksHistory, ...response.medias.videos, ...response.talk.output, ...response.vocabulary.vocabulary].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        setOrderedList(ordered)
        setListJourney(ordered);
        setListJourneyWithoutFilter(ordered);

        let daysStreak = 0
        let bigStreak = 0
        let daysOfImersion = 0
        for (let i = 1; i < ordered.length; i++) {
            const splited = ordered[i].created_at.split("T")[0];
            const splitedP1 = new Date(splited);

            const splitb = ordered[i - 1].created_at.split("T")[0];
            const splitbP1 = new Date(splitb);

            const diffInTime = Math.abs(splitedP1 - splitbP1);
            const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

            if (diffInDays === 1) {
                daysStreak++;
                daysOfImersion++
            } else {
                if (splitb !== splited) {
                    daysOfImersion++
                    daysStreak = 0;
                }
            }

            if (daysStreak > bigStreak) {
                bigStreak = daysStreak;
            }
        }
        setStreak(daysStreak)
        setLongestStreak(bigStreak)
        setDaysOfImmersion(daysOfImersion);

        const parsedDurationMonth = response.month_report?.map((item) => {
            const [hours, minutes, seconds] = item.duration.split(':').map(Number);
            const durationNew = Math.round(hours + (minutes / 60) + (seconds / 3600));
            const monthItem = new Date(item.month.split('T')[0])
            const parsedMonth = monthItem.toLocaleDateString(userLocale, {
                month: 'long',
                year: 'numeric',
            });
            return {
                month: parsedMonth,
                duration: durationNew
            }
        })

        setChartMonthHour(parsedDurationMonth)

        let cumulativeHours = 0;
        const hourCumulative = response.month_report?.map((item) => {
            const [hours, minutes, seconds] = item.duration.split(':').map(Number);
            const durationNew = Math.round(hours + (minutes / 60) + (seconds / 3600));
            const monthItem = new Date(item.month.split('T')[0])
            const parsedMonth = monthItem.toLocaleDateString(userLocale, {
                month: 'long',
                year: 'numeric',
            });

            cumulativeHours += durationNew

            return {
                month: parsedMonth,
                duration: cumulativeHours
            }
        })

        setChartMonthCumulative(hourCumulative)

        setChartMonthHour(parsedDurationMonth)
        setHeatMapStartdate(response.user.created_at)
        setHeatMap(response.daily_report)

        const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');
        const todayGoal = response.daily_report?.filter((entry) => entry.date === today);
        setDailyGoal(response.user.configs.dailyGoal);
        if (todayGoal && todayGoal.length > 0) {
            setDailyGoalDid(todayGoal[0].count || 0);
        } else {
            setDailyGoalDid(0);
        }

        const dailyRegisterDate = ordered.filter((item) => {
            const itemDateFormatted = dayjs(item.created_at).format('MM/DD/YYYY');
            const itemDate = dayjs(itemDateFormatted)
            const startOfCurrentMonth = dayjs().startOf('month');
            const endOfCurrentMonth = dayjs().endOf('month');

            return itemDate.isBetween(startOfCurrentMonth, endOfCurrentMonth, null, '[]');
        });

        const activities = ["Youtube", "books_history", "Books", "Anki", "Talk", "Vocabulary"];

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

            if (element.source === 'BooksHistory' && element.time_diff) {
                const timeSplited = element.time_diff.split(':')
                const hours = parseInt(timeSplited[0]);
                const minutes = parseInt(timeSplited[1]);
                const seconds = parseInt(timeSplited[2]);
                const totalMinutes = Math.floor(hours * 60 + minutes + seconds / 60);

                dailyDetails[day][element.source].totalMinutes += totalMinutes;
                return
            }
            const timeSplited = element.time?.split(':') || [0, 0, 0];
            const hours = parseInt(timeSplited[0]);
            const minutes = parseInt(timeSplited[1]);
            const seconds = parseInt(timeSplited[2]);
            const totalMinutes = Math.floor(hours * 60 + minutes + seconds / 60);

            dailyDetails[day][element.source].totalMinutes += totalMinutes;
        });

        const languages = []
        ordered.forEach((item) => {
            if (item.target_language && !languages.includes(item.target_language)) {
                languages.push(item.target_language);
            }
        });

        if (languages.length == 0) {
            languages.push(response.user.configs.TL)
        }

        if (!formData.targetLanguage) {
            formData.targetLanguage = response.user.configs.TL
        }

        setLanguages(languages)

        const dailyGoalTime = response.daily_report?.filter((item) => {
            const itemDate = dayjs(item.date).add(+1, "day").format('DD/MM/YYYY')
            const today = dayjs().format('DD/MM/YYYY')

            return itemDate === today
        })

        setDailyGoalDid(dailyGoalTime[0]?.count || 0)

        let totalMinutes = 0
        response.daily_report.map((item) => {
            totalMinutes += item.count

        })
        const hours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        const totalTimeF = `${hours}h ${remainingMinutes}m`;

        setTotalTime(totalTimeF)

        cal.paint({
            data: {
                source: response.daily_report,
                type: 'json',
                x: (datum) => new Date(datum.date),
                y: (datum) => datum.count
            },
            scale: {
                color: {
                    type: 'threshold',
                    range: ['#14432a', '#166b34', '#37a446', '#4dd05a'],
                    domain: [10, 20, 30, 60],
                },
            },
            date: {
                start: dayjs().format("YYYY")
            },
            domain: {
                type: "month",
                label: { text: 'MMM', textAlign: 'start', position: 'top' },
            },
            subDomain: { type: 'ghDay', radius: 2, width: 11, height: 11, gutter: 4 },
            itemSelector: "#heatmap",
            theme: "dark",
        },
            [
                [
                    Tooltips,
                    {
                        text: function(date, value, dayjsDate) {
                            return (
                                (value ? value + ' Minutes' : '0  Minutes 😔') + ' on ' + dayjsDate.format('LL')
                            )
                        }
                    }
                ]
            ])
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
                time: Number(formData.ankiLong),
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

            api.post('/v1/talk', data)
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
                    time: Number(formData.bookHowLong),
                    target_language: targetLanguage,
                };

                if (!data.read_pages || !data.read_type || !data.time) {
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
        if (source == 'Podcast' || source == 'Youtube' || source == "Medias") {
            api.delete(`/v1/medias/${id}`)
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

        if (source == 'Anki') {
            api.delete(`/v1/anki/${id}`)
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

        if (source == 'Talk') {
            api.delete(`/v1/talk/${id}`)
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

        if (source == 'Vocabulary') {
            api.delete(`/v1/vocabulary/${id}`)
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
            const history = booksHistory.filter((book) => book.id_book === selectedBook.id);
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
                                <select name="targetLanguage" onChange={(event) => {
                                    handleInputChange(event);
                                    if (event.target.value === 'newLanguage') {
                                        setAddNewLanguage(!addNewLanguage)
                                    }
                                }} value={formData.targetLanguage}>
                                    {
                                        languages && (
                                            languages.map((item, index) => (
                                                <option key={index} value={item}>
                                                    {iso6391.getName(item)}
                                                </option>
                                            ))
                                        )
                                    }
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
                <Chart
                    style={{
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                    }}
                >
                    <div>
                        Total Hours
                        <LineChart width={wsz} height={hsz} data={chartMonthCumulative}>
                            <XAxis dataKey="month" scale={'point'} />
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
                            <Line type="monotone" dataKey="duration" name="Total Hours" stroke="#8884d8" />
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
