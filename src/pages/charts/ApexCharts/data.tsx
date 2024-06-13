import { ApexOptions } from 'apexcharts'

function generateData(baseval: number, count: number, yrange: any): number[] {
	let i = 0
	const series: any = []
	while (i < count) {
		const x = Math.floor(Math.random() * (750 - 1 + 1)) + 1
		const y =
			Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
		const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15

		series.push([x, y, z])
		baseval += 86400000
		i++
	}
	return series
}

function generateData1(baseval1: number, count: number, yrange: any): number[] {
	let i = 0
	const series: any = []
	while (i < count) {
		//const x =Math.floor(Math.random() * (750 - 1 + 1)) + 1;;
		const y =
			Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
		const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15

		series.push([baseval1, y, z])
		baseval1 += 86400000
		i++
	}
	return series
}

const seriesData = [
	{
		x: new Date(2016, 1, 1),
		y: [51.98, 56.29, 51.59, 53.85],
	},
	{
		x: new Date(2016, 2, 1),
		y: [53.66, 54.99, 51.35, 52.95],
	},
	{
		x: new Date(2016, 3, 1),
		y: [52.96, 53.78, 51.54, 52.48],
	},
	{
		x: new Date(2016, 4, 1),
		y: [52.54, 52.79, 47.88, 49.24],
	},
	{
		x: new Date(2016, 5, 1),
		y: [49.1, 52.86, 47.7, 52.78],
	},
	{
		x: new Date(2016, 6, 1),
		y: [52.83, 53.48, 50.32, 52.29],
	},
	{
		x: new Date(2016, 7, 1),
		y: [52.2, 54.48, 51.64, 52.58],
	},
	{
		x: new Date(2016, 8, 1),
		y: [52.76, 57.35, 52.15, 57.03],
	},
	{
		x: new Date(2016, 9, 1),
		y: [57.04, 58.15, 48.88, 56.19],
	},
	{
		x: new Date(2016, 10, 1),
		y: [56.09, 58.85, 55.48, 58.79],
	},
	{
		x: new Date(2016, 11, 1),
		y: [58.78, 59.65, 58.23, 59.05],
	},
	{
		x: new Date(2017, 0, 1),
		y: [59.37, 61.11, 59.35, 60.34],
	},
	{
		x: new Date(2017, 1, 1),
		y: [60.4, 60.52, 56.71, 56.93],
	},
	{
		x: new Date(2017, 2, 1),
		y: [57.02, 59.71, 56.04, 56.82],
	},
	{
		x: new Date(2017, 3, 1),
		y: [56.97, 59.62, 54.77, 59.3],
	},
	{
		x: new Date(2017, 4, 1),
		y: [59.11, 62.29, 59.1, 59.85],
	},
	{
		x: new Date(2017, 5, 1),
		y: [59.97, 60.11, 55.66, 58.42],
	},
	{
		x: new Date(2017, 6, 1),
		y: [58.34, 60.93, 56.75, 57.42],
	},
	{
		x: new Date(2017, 7, 1),
		y: [57.76, 58.08, 51.18, 54.71],
	},
	{
		x: new Date(2017, 8, 1),
		y: [54.8, 61.42, 53.18, 57.35],
	},
	{
		x: new Date(2017, 9, 1),
		y: [57.56, 63.09, 57.0, 62.99],
	},
	{
		x: new Date(2017, 10, 1),
		y: [62.89, 63.42, 59.72, 61.76],
	},
	{
		x: new Date(2017, 11, 1),
		y: [61.71, 64.15, 61.29, 63.04],
	},
]

const series = {
	monthDataSeries1: {
		prices: [
			8107.85, 8128.0, 8122.9, 8165.5, 8340.7, 8423.7, 8423.5, 8514.3, 8481.85,
			8487.7, 8506.9, 8626.2, 8668.95, 8602.3, 8607.55, 8512.9, 8496.25,
			8600.65, 8881.1, 9340.85,
		],
		dates: [
			'13 Nov 2017',
			'14 Nov 2017',
			'15 Nov 2017',
			'16 Nov 2017',
			'17 Nov 2017',
			'20 Nov 2017',
			'21 Nov 2017',
			'22 Nov 2017',
			'23 Nov 2017',
			'24 Nov 2017',
			'27 Nov 2017',
			'28 Nov 2017',
			'29 Nov 2017',
			'30 Nov 2017',
			'01 Dec 2017',
			'04 Dec 2017',
			'05 Dec 2017',
			'06 Dec 2017',
			'07 Dec 2017',
			'08 Dec 2017',
		],
	},
	monthDataSeries2: {
		prices: [
			8423.7, 8423.5, 8514.3, 8481.85, 8487.7, 8506.9, 8626.2, 8668.95, 8602.3,
			8607.55, 8512.9, 8496.25, 8600.65, 8881.1, 9040.85, 8340.7, 8165.5,
			8122.9, 8107.85, 8128.0,
		],
		dates: [
			'13 Nov 2017',
			'14 Nov 2017',
			'15 Nov 2017',
			'16 Nov 2017',
			'17 Nov 2017',
			'20 Nov 2017',
			'21 Nov 2017',
			'22 Nov 2017',
			'23 Nov 2017',
			'24 Nov 2017',
			'27 Nov 2017',
			'28 Nov 2017',
			'29 Nov 2017',
			'30 Nov 2017',
			'01 Dec 2017',
			'04 Dec 2017',
			'05 Dec 2017',
			'06 Dec 2017',
			'07 Dec 2017',
			'08 Dec 2017',
		],
	},
	monthDataSeries3: {
		prices: [
			7114.25, 7126.6, 7116.95, 7203.7, 7233.75, 7451.0, 7381.15, 7348.95,
			7347.75, 7311.25, 7266.4, 7253.25, 7215.45, 7266.35, 7315.25, 7237.2,
			7191.4, 7238.95, 7222.6, 7217.9, 7359.3, 7371.55, 7371.15, 7469.2,
			7429.25, 7434.65, 7451.1, 7475.25, 7566.25, 7556.8, 7525.55, 7555.45,
			7560.9, 7490.7, 7527.6, 7551.9, 7514.85, 7577.95, 7592.3, 7621.95,
			7707.95, 7859.1, 7815.7, 7739.0, 7778.7, 7839.45, 7756.45, 7669.2,
			7580.45, 7452.85, 7617.25, 7701.6, 7606.8, 7620.05, 7513.85, 7498.45,
			7575.45, 7601.95, 7589.1, 7525.85, 7569.5, 7702.5, 7812.7, 7803.75,
			7816.3, 7851.15, 7912.2, 7972.8, 8145.0, 8161.1, 8121.05, 8071.25, 8088.2,
			8154.45, 8148.3, 8122.05, 8132.65, 8074.55, 7952.8, 7885.55, 7733.9,
			7897.15, 7973.15, 7888.5, 7842.8, 7838.4, 7909.85, 7892.75, 7897.75,
			7820.05, 7904.4, 7872.2, 7847.5, 7849.55, 7789.6, 7736.35, 7819.4,
			7875.35, 7871.8, 8076.5, 8114.8, 8193.55, 8217.1, 8235.05, 8215.3, 8216.4,
			8301.55, 8235.25, 8229.75, 8201.95, 8164.95, 8107.85, 8128.0, 8122.9,
			8165.5, 8340.7, 8423.7, 8423.5, 8514.3, 8481.85, 8487.7, 8506.9, 8626.2,
		],
		dates: [
			'02 Jun 2017',
			'05 Jun 2017',
			'06 Jun 2017',
			'07 Jun 2017',
			'08 Jun 2017',
			'09 Jun 2017',
			'12 Jun 2017',
			'13 Jun 2017',
			'14 Jun 2017',
			'15 Jun 2017',
			'16 Jun 2017',
			'19 Jun 2017',
			'20 Jun 2017',
			'21 Jun 2017',
			'22 Jun 2017',
			'23 Jun 2017',
			'27 Jun 2017',
			'28 Jun 2017',
			'29 Jun 2017',
			'30 Jun 2017',
			'03 Jul 2017',
			'04 Jul 2017',
			'05 Jul 2017',
			'06 Jul 2017',
			'07 Jul 2017',
			'10 Jul 2017',
			'11 Jul 2017',
			'12 Jul 2017',
			'13 Jul 2017',
			'14 Jul 2017',
			'17 Jul 2017',
			'18 Jul 2017',
			'19 Jul 2017',
			'20 Jul 2017',
			'21 Jul 2017',
			'24 Jul 2017',
			'25 Jul 2017',
			'26 Jul 2017',
			'27 Jul 2017',
			'28 Jul 2017',
			'31 Jul 2017',
			'01 Aug 2017',
			'02 Aug 2017',
			'03 Aug 2017',
			'04 Aug 2017',
			'07 Aug 2017',
			'08 Aug 2017',
			'09 Aug 2017',
			'10 Aug 2017',
			'11 Aug 2017',
			'14 Aug 2017',
			'16 Aug 2017',
			'17 Aug 2017',
			'18 Aug 2017',
			'21 Aug 2017',
			'22 Aug 2017',
			'23 Aug 2017',
			'24 Aug 2017',
			'28 Aug 2017',
			'29 Aug 2017',
			'30 Aug 2017',
			'31 Aug 2017',
			'01 Sep 2017',
			'04 Sep 2017',
			'05 Sep 2017',
			'06 Sep 2017',
			'07 Sep 2017',
			'08 Sep 2017',
			'11 Sep 2017',
			'12 Sep 2017',
			'13 Sep 2017',
			'14 Sep 2017',
			'15 Sep 2017',
			'18 Sep 2017',
			'19 Sep 2017',
			'20 Sep 2017',
			'21 Sep 2017',
			'22 Sep 2017',
			'25 Sep 2017',
			'26 Sep 2017',
			'27 Sep 2017',
			'28 Sep 2017',
			'29 Sep 2017',
			'03 Oct 2017',
			'04 Oct 2017',
			'05 Oct 2017',
			'06 Oct 2017',
			'09 Oct 2017',
			'10 Oct 2017',
			'11 Oct 2017',
			'12 Oct 2017',
			'13 Oct 2017',
			'16 Oct 2017',
			'17 Oct 2017',
			'18 Oct 2017',
			'19 Oct 2017',
			'23 Oct 2017',
			'24 Oct 2017',
			'25 Oct 2017',
			'26 Oct 2017',
			'27 Oct 2017',
			'30 Oct 2017',
			'31 Oct 2017',
			'01 Nov 2017',
			'02 Nov 2017',
			'03 Nov 2017',
			'06 Nov 2017',
			'07 Nov 2017',
			'08 Nov 2017',
			'09 Nov 2017',
			'10 Nov 2017',
			'13 Nov 2017',
			'14 Nov 2017',
			'15 Nov 2017',
			'16 Nov 2017',
			'17 Nov 2017',
			'20 Nov 2017',
			'21 Nov 2017',
			'22 Nov 2017',
			'23 Nov 2017',
			'24 Nov 2017',
			'27 Nov 2017',
			'28 Nov 2017',
		],
	},
}

// Basic Area Chart
export const AreaApexOpt: ApexOptions = {
	chart: {
		height: 380,
		type: 'area',
		zoom: {
			enabled: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		width: 2,
		curve: 'straight',
	},
	colors: ['#3bc0c3'],
	series: [
		{
			name: 'STOCK ABC',
			data: series.monthDataSeries1.prices,
		},
	],
	title: {
		text: 'Fundamental Analysis of Stocks',
		align: 'left',
	},
	subtitle: {
		text: 'Price Movements',
		align: 'left',
	},
	labels: series.monthDataSeries1.dates,
	xaxis: {
		type: 'datetime',
	},
	yaxis: {
		opposite: false,
	},
	legend: {
		horizontalAlign: 'left',
	},
	grid: {
		borderColor: '#f1f3fa',
	},
	responsive: [
		{
			breakpoint: 600,
			options: {
				chart: {
					toolbar: {
						show: false,
					},
				},
				legend: {
					show: false,
				},
			},
		},
	],
}

//   Spline Area Chart
export const SpilineAreaApexOpt: ApexOptions = {
	chart: {
		height: 380,
		type: 'area',
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		width: 2,
		curve: 'smooth',
	},
	colors: ['#3bc0c3', '#1a2942'],
	series: [
		{
			name: 'Series 1',
			data: [40, 60, 44, 84, 64, 110, 95],
		},
		{
			name: 'Series 2',
			data: [20, 30, 22, 42, 32, 55, 44],
		},
	],
	legend: {
		offsetY: 5,
	},
	xaxis: {
		categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
	},
	tooltip: {
		fixed: {
			enabled: false,
			position: 'topRight',
		},
	},
	grid: {
		row: {
			colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
			opacity: 0.2,
		},
		borderColor: '#f1f3fa',
		padding: {
			bottom: 5,
		},
	},
	// grid: {
	//     borderColor: '#f1f3fa',

	// }
}

//   Basic Bar Chart
export const BasicBarOps: ApexOptions = {
	chart: {
		height: 380,
		type: 'bar',
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			horizontal: true,
		},
	},
	dataLabels: {
		enabled: false,
	},
	series: [
		{
			data: [350, 480, 490, 520, 550, 600, 700, 1140, 1260, 1400],
		},
	],
	colors: ['#4489e4'],
	xaxis: {
		categories: [
			'South Korea',
			'Canada',
			'United Kingdom',
			'Netherlands',
			'Italy',
			'France',
			'Japan',
			'United States',
			'China',
			'Germany',
		],
	},
	// states: {
	//     // hover: {
	//     //     // filter: 'none'
	//     // }
	// },
	grid: {
		borderColor: '#f1f3fa',
	},
}

//   Grouped Bar Chart
export const GroupBarOps: ApexOptions = {
	chart: {
		height: 380,
		type: 'bar',
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			horizontal: true,
			dataLabels: {
				position: 'top',
			},
		},
	},
	dataLabels: {
		enabled: true,
		offsetX: -6,
		style: {
			fontSize: '12px',
			colors: ['#fff'],
		},
	},
	colors: ['#33b0e0', '#f24f7c'],
	stroke: {
		show: true,
		width: 1,
		colors: ['#fff'],
	},
	series: [
		{
			name: 'Series 1',
			data: [45, 60, 41, 64, 22, 43, 21],
		},
		{
			name: 'Series 2',
			data: [42, 40, 33, 52, 13, 44, 32],
		},
	],
	xaxis: {
		categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
	},
	legend: {
		offsetY: 5,
	},
	// states: {
	//     hover: {
	//         filter: 'none'
	//     }
	// },
	grid: {
		borderColor: '#f1f3fa',
		padding: {
			bottom: 5,
		},
	},
}

//   BasicBoxplot Chart
export const BasicBoxplotOps: ApexOptions = {
	series: [
		{
			type: 'boxPlot',
			data: [
				{
					x: 'Jan 2015',
					y: [92, 80, 72, 68, 42],
				},
				{
					x: 'Jan 2016',
					y: [43, 65, 69, 76, 81],
				},
				{
					x: 'Jan 2017',
					y: [31, 39, 45, 51, 59],
				},
				{
					x: 'Jan 2018',
					y: [39, 46, 55, 65, 71],
				},
				{
					x: 'Jan 2019',
					y: [29, 31, 35, 39, 44],
				},
				{
					x: 'Jan 2020',
					y: [41, 49, 58, 61, 67],
				},
				{
					x: 'Jan 2021',
					y: [54, 59, 66, 71, 88],
				},
			],
		},
	],
	chart: {
		type: 'boxPlot',
		height: 350,
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		boxPlot: {
			colors: {
				upper: '#3bc0c3',
				lower: '#47ad77',
			},
		},
	},
	stroke: {
		colors: ['#a1a9b1'],
	},
}

//   ScatterBoxplot Chart
export const ScatterBoxplotOps: ApexOptions = {
	series: [
		{
			name: 'Box',
			type: 'boxPlot',
			data: [
				{
					x: new Date('2017-01-01').getTime(),
					y: [54, 66, 69, 75, 88],
				},
				{
					x: new Date('2018-01-01').getTime(),
					y: [43, 65, 69, 76, 81],
				},
				{
					x: new Date('2019-01-01').getTime(),
					y: [31, 39, 45, 51, 59],
				},
				{
					x: new Date('2020-01-01').getTime(),
					y: [39, 46, 55, 65, 71],
				},
				{
					x: new Date('2021-01-01').getTime(),
					y: [29, 31, 35, 39, 44],
				},
			],
		},
		{
			name: 'Outliers',
			type: 'scatter',
			data: [
				{
					x: new Date('2017-01-01').getTime(),
					y: 32,
				},
				{
					x: new Date('2018-01-01').getTime(),
					y: 25,
				},
				{
					x: new Date('2019-01-01').getTime(),
					y: 64,
				},
				{
					x: new Date('2020-01-01').getTime(),
					y: 27,
				},
				{
					x: new Date('2020-01-01').getTime(),
					y: 78,
				},
				{
					x: new Date('2021-01-01').getTime(),
					y: 15,
				},
			],
		},
	],
	chart: {
		type: 'boxPlot',
		height: 350,
	},
	colors: ['#fa5c7c', '#6c757d'],
	stroke: {
		colors: ['#a1a9b1'],
	},
	legend: {
		offsetY: 10,
	},
	xaxis: {
		type: 'datetime',
		tooltip: {
			formatter: function (val: string) {
				return new Date(val).getFullYear().toString()
			},
		},
	},
	grid: {
		padding: {
			bottom: 5,
		},
	},
	tooltip: {
		shared: false,
		intersect: true,
	},
	plotOptions: {
		boxPlot: {
			colors: {
				upper: '#fa5c7c',
				lower: '#6c757d',
			},
		},
	},
}

//   Simple Bubble Chart
export const simpleBubbleChartOpts: ApexOptions = {
	chart: {
		height: 380,
		type: 'bubble',
		toolbar: {
			show: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	series: [
		{
			name: 'Bubble 1',
			data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
				min: 10,
				max: 60,
			}),
		},
		{
			name: 'Bubble 2',
			data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
				min: 10,
				max: 60,
			}),
		},
		{
			name: 'Bubble 3',
			data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
				min: 10,
				max: 60,
			}),
		},
	],
	fill: {
		opacity: 0.8,
		gradient: {
			// enabled: false
		},
	},
	colors: ['#3bc0c3', '#edc755', '#fa5c7c'],
	xaxis: {
		tickAmount: 12,
		type: 'category',
	},
	yaxis: {
		max: 70,
	},
	grid: {
		borderColor: '#f1f3fa',
		padding: {
			bottom: 10,
		},
	},
	legend: {
		offsetY: 7,
	},
}

//   3D Bubble Chart
export const secondBubbleChartOpts: ApexOptions = {
	chart: {
		height: 380,
		type: 'bubble',
		toolbar: {
			show: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	series: [
		{
			name: 'Product 1',
			data: generateData1(new Date('11 Feb 2017 GMT').getTime(), 20, {
				min: 10,
				max: 60,
			}),
		},
		{
			name: 'Product 2',
			data: generateData1(new Date('11 Feb 2017 GMT').getTime(), 20, {
				min: 10,
				max: 60,
			}),
		},
		{
			name: 'Product 3',
			data: generateData1(new Date('11 Feb 2017 GMT').getTime(), 20, {
				min: 10,
				max: 60,
			}),
		},
		{
			name: 'Product 4',
			data: generateData1(new Date('11 Feb 2017 GMT').getTime(), 20, {
				min: 10,
				max: 60,
			}),
		},
	],
	fill: {
		type: 'gradient',
	},
	colors: ['#3bc0c3', '#47ad77', '#fa5c7c', '#39afd1'],
	xaxis: {
		tickAmount: 12,
		type: 'datetime',

		labels: {
			rotate: 0,
		},
	},
	yaxis: {
		max: 70,
	},
	legend: {
		offsetY: 7,
	},
	grid: {
		borderColor: '#f1f3fa',
		padding: {
			bottom: 10,
		},
	},
}
//   simple Candlestick Chart
export const simpleCandlestickChartOpts: ApexOptions = {
	chart: {
		height: 400,
		type: 'candlestick',
	},
	plotOptions: {
		candlestick: {
			colors: {
				upward: '#47ad77',
				downward: '#fa5c7c',
			},
		},
	},
	series: [
		{
			data: seriesData,
		},
	],

	stroke: {
		show: true,
		colors: ['#f1f3fa'],
		width: [1, 4],
	},
	xaxis: {
		type: 'datetime',
	},
	grid: {
		borderColor: '#f1f3fa',
	},
}

//   Basic Column Chart
export const apexColumnChartOpts: ApexOptions = {
	chart: {
		height: 380,
		type: 'bar',
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			horizontal: false,
			// endingShape: 'rounded',
			columnWidth: '55%',
		},
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		show: true,
		width: 2,
		colors: ['transparent'],
	},
	colors: ['#3bc0c3', '#4489e4', '#33b0e0'],
	series: [
		{
			name: 'Net Profit',
			data: [82, 50, 55, 42, 45, 48, 52, 53, 41],
		},
		{
			name: 'Revenue',
			data: [60, 42, 82, 62, 61, 68, 63, 60, 66],
		},
		{
			name: 'Free Cash Flow',
			data: [70, 60, 95, 82, 87, 105, 91, 114, 94],
		},
	],
	xaxis: {
		categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
	},
	legend: {
		offsetY: 5,
	},
	yaxis: {
		title: {
			text: '$ (thousands)',
		},
	},
	fill: {
		opacity: 1,
	},
	grid: {
		row: {
			colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
			opacity: 0.2,
		},
		borderColor: '#f1f3fa',
		padding: {
			bottom: 10,
		},
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return '$ ' + val + ' thousands'
			},
		},
	},
}

//   Column Chart with Datalabels
export const columnWithDataLableOpts: ApexOptions = {
	chart: {
		height: 380,
		type: 'bar',
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			dataLabels: {
				position: 'top', // top, center, bottom
			},
		},
	},
	dataLabels: {
		enabled: true,
		formatter: function (val) {
			return val + '%'
		},
		offsetY: -30,
		style: {
			fontSize: '12px',
			colors: ['#304758'],
		},
	},
	colors: ['#3bc0c3'],
	series: [
		{
			name: 'Inflation',
			data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
		},
	],
	xaxis: {
		categories: [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		],
		position: 'top',
		labels: {
			offsetY: -18,
		},
		axisBorder: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
		crosshairs: {
			fill: {
				type: 'gradient',
				gradient: {
					colorFrom: '#D8E3F0',
					colorTo: '#BED1E6',
					stops: [0, 100],
					opacityFrom: 0.4,
					opacityTo: 0.5,
				},
			},
		},
		tooltip: {
			enabled: true,
			offsetY: -35,
		},
	},
	fill: {
		gradient: {
			// enabled: false,
			shade: 'light',
			type: 'horizontal',
			shadeIntensity: 0.25,
			gradientToColors: undefined,
			inverseColors: true,
			opacityFrom: 1,
			opacityTo: 1,
			stops: [50, 0, 100, 100],
		},
	},
	yaxis: {
		axisBorder: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
		labels: {
			show: false,
			formatter: function (val) {
				return val + '%'
			},
		},
	},
	title: {
		text: 'Monthly Inflation in Argentina, 2002',
		floating: true,
		offsetY: 350,
		align: 'center',
		style: {
			color: '#444',
		},
	},
	grid: {
		row: {
			colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
			opacity: 0.2,
		},
		borderColor: '#f1f3fa',
	},
}

//   Simple line chart
export const lineChartOpts: ApexOptions = {
	chart: {
		height: 380,
		type: 'line',
		zoom: {
			enabled: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	colors: ['#edc755'],
	stroke: {
		width: [4],
		curve: 'straight',
	},
	series: [
		{
			name: 'Desktops',
			data: [40, 35, 55, 60, 33, 70, 80, 96, 130],
		},
	],
	title: {
		text: 'Product Trends by Month',
		align: 'center',
	},
	grid: {
		row: {
			colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
			opacity: 0.2,
		},
		borderColor: '#edc755',
	},
	labels: series.monthDataSeries1.dates,
	xaxis: {
		categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
	},
	responsive: [
		{
			breakpoint: 600,
			options: {
				chart: {
					toolbar: {
						show: false,
					},
				},
				legend: {
					show: false,
				},
			},
		},
	],
}

//   Line with Data Labels
export const LineWithDataLabelOps: ApexOptions = {
	chart: {
		height: 380,
		type: 'line',
		zoom: {
			enabled: false,
		},
		toolbar: {
			show: false,
		},
	},
	colors: ['#d03f3f', '#3bc0c3'],
	dataLabels: {
		enabled: true,
	},
	stroke: {
		width: [3, 3],
		curve: 'smooth',
	},
	series: [
		{
			name: 'High - 2018',
			data: [28, 29, 33, 36, 32, 32, 33],
		},
		{
			name: 'Low - 2018',
			data: [12, 11, 14, 18, 17, 13, 13],
		},
	],
	title: {
		text: 'Average High & Low Temperature',
		align: 'left',
	},
	grid: {
		row: {
			colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
			opacity: 0.2,
		},
		borderColor: '#f1f3fa',
	},
	markers: {
		// style: 'inverted',
		size: 6,
	},
	xaxis: {
		categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
		title: {
			text: 'Month',
		},
	},
	yaxis: {
		title: {
			text: 'Temperature',
		},
		min: 5,
		max: 40,
	},
	legend: {
		position: 'top',
		horizontalAlign: 'right',
		floating: true,
		offsetY: -25,
		offsetX: -5,
	},
	responsive: [
		{
			breakpoint: 600,
			options: {
				chart: {
					toolbar: {
						show: false,
					},
				},
				legend: {
					show: false,
				},
			},
		},
	],
}

//   line Column Chart
export const lineColumnChartOpts: ApexOptions = {
	chart: {
		height: 380,
		type: 'line',
		toolbar: {
			show: false,
		},
	},
	series: [
		{
			name: 'Website Blog',
			type: 'column',
			data: [500, 510, 420, 680, 400, 415, 340, 360, 780, 340, 270, 180],
		},
		{
			name: 'Social Media',
			type: 'line',
			data: [28, 42, 30, 25, 48, 30, 26, 30, 28, 32, 15, 20],
		},
	],
	stroke: {
		width: [0, 4],
	},
	labels: [
		'01 Jan 2001',
		'02 Jan 2001',
		'03 Jan 2001',
		'04 Jan 2001',
		'05 Jan 2001',
		'06 Jan 2001',
		'07 Jan 2001',
		'08 Jan 2001',
		'09 Jan 2001',
		'10 Jan 2001',
		'11 Jan 2001',
		'12 Jan 2001',
	],
	xaxis: {
		type: 'datetime',
	},
	colors: ['#4489e4', '#3bc0c3'],
	yaxis: [
		{
			title: {
				text: 'Website Blog',
			},
		},
		{
			opposite: true,
			title: {
				text: 'Social Media',
			},
		},
	],
	legend: {
		offsetY: 7,
	},
	grid: {
		borderColor: '#f1f3fa',
		padding: {
			bottom: 5,
		},
	},
}

//   Multiple Y-Axis Chart
export const multipleYAxisChartOpts: ApexOptions = {
	chart: {
		height: 380,
		type: 'line',
		stacked: false,
		toolbar: {
			show: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		width: [0, 0, 3],
	},
	series: [
		{
			name: 'Income',
			type: 'column',
			data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
		},
		{
			name: 'Cashflow',
			type: 'column',
			data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5],
		},
		{
			name: 'Revenue',
			type: 'line',
			data: [20, 29, 37, 36, 44, 45, 50, 58],
		},
	],
	colors: ['#3bc0c3', '#39afd1', '#fa5c7c'],
	xaxis: {
		categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
	},
	yaxis: [
		{
			axisTicks: {
				show: true,
			},
			axisBorder: {
				show: true,
				color: '#675db7',
			},
			labels: {
				// style: {
				//     color: '#675db7',
				// }
			},
			title: {
				text: 'Income (thousand crores)',
			},
		},

		{
			opposite: true,
			axisTicks: {
				show: true,
			},
			axisBorder: {
				show: true,
				color: '#e36498',
			},
			labels: {
				// style: {
				//     color: ["#e36498"],
				// }
			},
			title: {
				text: 'Revenue (thousand crores)',
			},
		},
	],
	tooltip: {
		followCursor: true,
		y: {
			formatter: function (y) {
				if (typeof y !== 'undefined') {
					return y + ' thousand crores'
				}
				return y
			},
		},
	},
	grid: {
		borderColor: '#f1f3fa',
		padding: {
			bottom: 10,
		},
	},
	legend: {
		offsetY: 7,
	},
	responsive: [
		{
			breakpoint: 600,
			options: {
				yaxis: {
					show: false,
				},
				legend: {
					show: false,
				},
			},
		},
	],
}

//   Simple Pie Chart
const colors1 = ['#3bc0c3', '#6c757d', '#4489e4', '#d03f3f', '#edc755']
export const SimplePieOpt: ApexOptions = {
	chart: {
		height: 320,
		type: 'pie',
	},
	series: [60, 40, 32, 55, 18],
	labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5'],
	colors: colors1,
	legend: {
		show: true,
		position: 'bottom',
		horizontalAlign: 'center',
		// verticalAlign: "middle",
		floating: false,
		fontSize: '14px',
		offsetX: 0,
		offsetY: 7,
	},
	responsive: [
		{
			breakpoint: 600,
			options: {
				chart: {
					height: 240,
				},
				legend: {
					show: false,
				},
			},
		},
	],
}

// Simple Donut Chart
export const SimpleDonutOpt: ApexOptions = {
	chart: {
		height: 320,
		type: 'donut',
	},
	series: [40, 60, 45, 22, 18],
	legend: {
		show: true,
		position: 'bottom',
		horizontalAlign: 'center',
		// verticalAlign: 'middle',
		floating: false,
		fontSize: '14px',
		offsetX: 0,
		offsetY: 7,
	},
	labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5'],
	colors: ['#3bc0c3', '#6c757d', '#4489e4', '#d03f3f', '#edc755'],
	responsive: [
		{
			breakpoint: 600,
			options: {
				chart: {
					height: 240,
				},
				legend: {
					show: false,
				},
			},
		},
	],
}

//   BasicPolar Area Chart
export const BasicPolarAreaOpt: ApexOptions = {
	series: [16, 22, 24, 16, 17, 12],
	chart: {
		height: 380,
		type: 'polarArea',
	},
	stroke: {
		colors: ['#fff'],
	},
	fill: {
		opacity: 0.8,
	},
	labels: ['Vote A', 'Vote B', 'Vote C', 'Vote D', 'Vote E', 'Vote F'],
	legend: {
		position: 'bottom',
	},
	colors: ['#3bc0c3', '#6c757d', '#4489e4', '#d03f3f', '#edc755', '#33b0e0'],
	responsive: [
		{
			breakpoint: 480,
			options: {
				chart: {
					width: 200,
				},
				legend: {
					position: 'bottom',
				},
			},
		},
	],
}

//   Monochrome Polar Area Chart
export const MonochromePolarAreaOpt: ApexOptions = {
	series: [72, 80, 60, 75, 65],
	chart: {
		height: 380,
		type: 'polarArea',
	},
	labels: ['Rose A', 'Rose B', 'Rose C', 'Rose D', 'Rose E'],
	fill: {
		opacity: 1,
	},
	stroke: {
		width: 1,
	},
	yaxis: {
		show: false,
	},
	legend: {
		position: 'bottom',
	},
	plotOptions: {
		polarArea: {
			rings: {
				strokeWidth: 0,
			},
			spokes: {
				strokeWidth: 0,
			},
		},
	},
	theme: {
		monochrome: {
			enabled: true,
			shadeTo: 'light',
			color: '#f24f7c',
			shadeIntensity: 0.6,
		},
	},
}

//   Basic Radar Chart
export const BasicRadarOpt: ApexOptions = {
	chart: {
		height: 350,
		type: 'radar',
	},
	series: [
		{
			name: 'Series 1',
			data: [80, 50, 30, 40, 100, 20],
		},
	],
	colors: ['#4489e4'],
	labels: ['January', 'February', 'March', 'April', 'May', 'June'],
}

//   Polygon Fill Chart
export const PolygonFillOpt: ApexOptions = {
	chart: {
		height: 350,
		type: 'radar',
	},
	series: [
		{
			name: 'Series 1',
			data: [20, 100, 40, 30, 50, 80, 33],
		},
	],
	labels: [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	],
	plotOptions: {
		radar: {
			size: 140,
		},
	},
	colors: ['#FF4560'],
	markers: {
		size: 4,
		colors: ['#d03f3f'],
		strokeColors: ['#FF4560'],
		strokeWidth: 2,
	},
	tooltip: {
		y: {
			formatter: function (val: number) {
				return val.toString()
			},
		},
	},
	yaxis: {
		tickAmount: 7,
		labels: {
			formatter: function (val: number, i): string {
				if (i % 2 === 0) {
					return val.toString()
				} else {
					return ''
				}
			},
		},
	},
}

//   basic Radial Bar Chart
export const basicRadialBarChart: ApexOptions = {
	chart: {
		height: 350,
		type: 'radialBar',
	},
	plotOptions: {
		radialBar: {
			hollow: {
				size: '70%',
			},
		},
	},
	colors: ['#3bc0c3'],
	series: [70],
	labels: ['CRICKET'],
}

//   Multiple RadialBars
export const multipleRadialBarOpts: ApexOptions = {
	chart: {
		height: 350,
		type: 'radialBar',
	},
	plotOptions: {
		radialBar: {
			dataLabels: {
				name: {
					fontSize: '22px',
				},
				value: {
					fontSize: '16px',
				},
				total: {
					show: true,
					label: 'Total',
					// formatter: function (w) {
					//   // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
					//   return 249
					// }
				},
			},
		},
	},
	colors: ['#3bc0c3', '#4489e4', '#edc755', '#33b0e0'],
	series: [44, 55, 67, 83],
	labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
}
