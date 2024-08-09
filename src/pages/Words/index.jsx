import { Header } from "../../components/Header";
import iso6391 from 'iso-639-1';
import { useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from "../../services/api";
import { useState } from "react";

export function Words() {
	const [listWords, setListWords] = useState([])

	const [language, setLanguage] = useState("en")
	const [order, setOrder] = useState("DESC")
	const [limit, setLimit] = useState(50)
	const [page, setPage] = useState(1)
	const [min, setMin] = useState(0)
	const [max, setMax] = useState(10000)

	useEffect(() => {
		async function getWords() {
			api.get("/v1/user/settings").then((response) => {
				setLanguage(response.data.configs.TL)
			})
		}

		getWords()

		handleFilter()
	}, [page])

	function handleFilter() {
		api.get("/v1/user/words", {
			params: {
				language,
				order,
				limit,
				page,
				min,
				max,
			}
		}).then(response => {
			setListWords(response.data)
		})
	}

	return (
		<>
			<Header />

			<section className="p-6 bg-background border-2 border-white rounded-md w-11/12 mx-auto">
				<div className="flex flex-wrap gap-4 justify-center items-end">
					<div className="w-full sm:w-48">
						<label htmlFor="language" className="block text-sm font-medium text-white">Language</label>
						<select value={language} onChange={(e) => setLanguage(e.target.value)} id="language" className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
							<option value={language}>{iso6391.getName(language)}</option>
							{iso6391.getAllCodes().map((item) => (
								<option key={item} value={item}>
									{iso6391.getName(item)}
								</option>
							))}
						</select>
					</div>

					<div className="w-full sm:w-48">
						<label htmlFor="order" className="block text-sm font-medium text-white">Order</label>
						<select value={order} onChange={(e) => setOrder(e.target.value)} id="order" className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
							<option value="ASC">Ascending &uarr;</option>
							<option value="DESC">Descending &darr;</option>
						</select>
					</div>

					<div className="w-full sm:w-48">
						<label htmlFor="limit" className="block text-sm font-medium text-white">Amount per Page</label>
						<input value={limit} onChange={(e) => setLimit(e.target.value)} id="limit" type="number" min="0" className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
					</div>

					<div className="w-full sm:w-48">
						<label htmlFor="min" className="block text-sm font-medium text-white">Minimum Viewed</label>
						<input value={min} onChange={(e) => setMin(e.target.value)} id="min" type="number" min="0" className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
					</div>

					<div className="w-full sm:w-48">
						<label htmlFor="max" className="block text-sm font-medium text-white">Maximum Viewed</label>
						<input value={max} onChange={(e) => setMax(e.target.value)} id="max" type="number" min="0" className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
					</div>

					<div className="w-full sm:w-auto flex justify-center">
						<button onClick={handleFilter} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-sm">
							Search
						</button>
					</div>
				</div>
			</section>


			<section className="flex flex-col mt-4">
				<ResponsiveContainer width="100%" height={600}>
					<BarChart
						data={listWords}
						margin={{
							top: 20, right: 30, left: 20, bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="4 4" />
						<XAxis dataKey="word" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar dataKey="amount" fill="#8884d8" name={"Seen"} />
					</BarChart>
				</ResponsiveContainer>

				<div class="inline-flex justify-center">
					<button onClick={() => setPage(page - 1)} className="bg-primary hover:scale-105 transition-all duration-200 text-white font-bold py-2 px-4 rounded-l">
						Prev
					</button>
					<button onClick={() => setPage(page + 1)} className="bg-primary hover:scale-105 transition-all duration-200 text-white font-bold py-2 px-4 rounded-r">
						Next
					</button>
				</div>
			</section>
		</>
	);
}

