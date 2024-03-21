import { Header } from '../../components/Header'
import {
    Card,
    Chart,
    Charts,
    CreateSection,
    Journey,
    Modal,
    Overlay,
    Status,
    Top,
    Form,
} from './styles'

import add from '../../assets/add.svg'
import close from '../../assets/close.svg'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Pagination, A11y } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useState } from 'react'
import {
    CartesianGrid,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
} from 'recharts'
import { JourneyCard } from '../../components/JourneyCard/index.jsx'

import youtube from '../../assets/youtube.svg'

const wsz = 320
const hsz = 320

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
]

export function Home() {
    const [vocabulary, setVocabulary] = useState(9321)

    const [modal, setModal] = useState(false)
    const [modalValue, setModalValue] = useState('Youtube')
    const [username, setUsername] = useState('Admin')

    function handleModal() {
        setModal(!modal)
    }

    function handleInput(value) {
        setModalValue(value)
    }

    function handleSubmit(e) {
        e.preventDefault()
        console.log(modalValue)
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
                    <Overlay onClick={() => handleModal()} />
                    <Modal>
                        <Top>{username && <label>Hello {username}</label>} <img src={close} alt='close' onClick={() => {handleModal()}}/></Top>
                        <Form>
                            <div>
                                <label>What did you do today?</label>
                                <select
                                    name="activities"
                                    onChange={(event) =>
                                        handleInput(event.target.value)
                                    }
                                    value={modalValue}
                                >
                                    <option value="Youtube">Youtube</option>
                                    <option value="Podcast">
                                        Podcast (Only in Youtube)
                                    </option>
                                    <option value="Movie">Movie</option>
                                    <option value="Talk">Talk</option>
                                    <option value="Anki">Anki</option>
                                    <option value="Read">Read</option>
                                    <option value="Vocabulary Test">
                                        Vocabulary Test
                                    </option>
                                </select>
                            </div>
                            {(modalValue == 'Youtube' || modalValue == 'Podcast') && (
                                    <>
                                    <div>
                                        <label>How?</label>
                                        <select name="medias" name='youtube-how'>
                                            <option value="Active">
                                                Active
                                            </option>
                                            <option value="Passive">
                                                Passive
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Insert the URL of the Video (Youtube)</label>
                                        <input placeholder='www.youtube.com/' name='youtube-url'/>
                                    </div>
                                    </>
                                )}
                            {modalValue == 'Movie' && (
                                <div>
                                    <label>How?</label>
                                    <input />
                                </div>
                            )}
                            {modalValue == 'Talk' && (
                                <>
                                <div>
                                    <label>How?</label>
                                        <select name="talk" name='talk-how'>
                                            <option value="Talking">
                                                Talking
                                            </option>
                                            <option value="Debating">
                                                Debating
                                            </option>
                                            <option value="Language Exchange">
                                                Language Exchange
                                            </option>
                                        </select>
                                </div>
                                    <div>
                                        <label>How long?</label>
                                        <input placeholder='In minutes' name='talk-long' type='number'/>
                                    </div>
                                </>
                            )}
                            {modalValue == 'Anki' && (
                                <>
                                    <div>
                                        <label>How much new cards?</label>
                                        <input name='anki-new' type='number'/>
                                    </div>
                                    <div>
                                        <label>How much reviewed cards?</label>
                                        <input name='anki-reviewed' type='number'/>
                                    </div>
                                    <div>
                                        <label>How long?</label>
                                        <input placeholder='In minutes' name='anki-long' type='number'/>
                                    </div>
                                </>
                            )}
                            {modalValue == 'Read' && (
                                <div>
                                    <label>How?</label>
                                    <input />
                                </div>
                            )}
                            {modalValue == 'Vocabulary Test' && (
                                <>
                                    <div>
                                        <label>How much?</label>
                                        <input name='vocabulary-new' type='number'/>
                                    </div>
                                    <div>
                                        <label>When?</label>
                                        <input name='vocabulary-when' type='date'/>
                                    </div>
                                </>
                            )}
                            <button onClick={(e) => handleSubmit(e)}>
                                {' '}
                                Submit{' '}
                            </button>
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
                            <h5>Total Words</h5> <p>{vocabulary}</p>
                        </Card>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Card>
                            <h5>Total Vocabulary</h5> <p>{vocabulary}</p>
                        </Card>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Card>
                            <h5>Total Vocabulary</h5> <p>{vocabulary}</p>
                        </Card>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Card>
                            <h5>Total Words</h5> <p>{vocabulary}</p>
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
                        <Line
                            type="monotone"
                            dataKey="pv"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                        />
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
                        <Line
                            type="monotone"
                            dataKey="pv"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                        />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </Chart>
            </Charts>

            <Journey>
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
    )
}
