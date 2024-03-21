import React from 'react'
import { Header } from '../../components/Header'
import { Card, Chart, Charts, CreateSection, Journey, Status } from './styles'

import add from '../../assets/add.svg'

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
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
} from 'recharts'
import { JourneyCard } from '../../components/JourneyCard/index.jsx'
import { FaYoutube } from 'react-icons/fa'

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

    return (
        <>
            <Header />
            <CreateSection>
                <h4>Hello, update your records</h4>
                <button>
                    <img src={add} alt="Add" />
                </button>
            </CreateSection>

            <Status>
                <Swiper
                    modules={[Navigation, Autoplay, Pagination, A11y]}
                    navigation
                    loop={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{ clickable: true }}
                    spaceBetween={50}
                    breakpoints={{
                        768: {
                            slidesPerView: 2,
                        },
                        1268: {
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
