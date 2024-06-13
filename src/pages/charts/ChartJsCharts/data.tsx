import hexToRGB from '@/utils/chartjs'
import { type ChartConfiguration } from 'chart.js/auto'

const boundariesConfig: ChartConfiguration = {
	type: 'line',
	data: {
		labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
		datasets: [
			{
				label: 'Fully Rounded',
				data: [12.5, -19.4, 14.3, -15.0, 10.8, -10.5],
				borderColor: ['#3bc0c3', '#47ad77'],
				backgroundColor: hexToRGB('#3e60d5', 0.3),
				fill: false,
			},
		],
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
				position: 'top',
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
			},
			y: {
				grid: {
					display: false,
				},
			},
		},
	},
}

const datasetColors = ['#3bc0c3', '#4489e4', '#d03f3f', '#716cb0', '#f24f7c']
const datasetConfig: ChartConfiguration = {
	type: 'line',
	data: {
		labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
		datasets: [
			{
				label: 'D0',
				data: [10, 20, 15, 35, 38, 24],
				borderColor: datasetColors[0],
				hidden: true,
				backgroundColor: hexToRGB(datasetColors[0], 0.3),
			},
			{
				label: 'D1',
				data: [12, 18, 18, 33, 41, 20],
				borderColor: datasetColors[1],
				fill: '-1',
				backgroundColor: hexToRGB(datasetColors[1], 0.3),
			},
			{
				label: 'D2',
				data: [5, 25, 20, 25, 28, 14],
				borderColor: datasetColors[2],
				fill: 1,
				backgroundColor: hexToRGB(datasetColors[2], 0.3),
			},
			{
				label: 'D3',
				data: [12, 45, 15, 35, 38, 24],
				borderColor: datasetColors[3],
				fill: '-1',
				backgroundColor: hexToRGB(datasetColors[3], 0.3),
			},
			{
				label: 'D4',
				data: [24, 38, 35, 15, 20, 10],
				borderColor: datasetColors[4],
				fill: 8,
				backgroundColor: hexToRGB(datasetColors[4], 0.3),
			},
		],
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,

		plugins: {
			filler: {
				propagate: false,
			},
		},
		interaction: {
			intersect: false,
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
			},
			y: {
				stacked: true,
				grid: {
					display: false,
				},
			},
		},
	},
}

const colors = ['#3bc0c3', '#4489e4']
const borderRadiusConfig: ChartConfiguration = {
	type: 'bar',
	data: {
		labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
		datasets: [
			{
				label: 'Fully Rounded',
				data: [12, -19, 14, -15, 12, -14],
				borderColor: colors[0],
				backgroundColor: hexToRGB(colors[0], 0.3),
				borderWidth: 2,
				borderRadius: Number.MAX_VALUE,
				borderSkipped: false,
			},
			{
				label: 'Small Radius',
				data: [-10, 19, -15, -8, 12, -7],
				backgroundColor: hexToRGB(colors[1], 0.3),
				borderColor: colors[1],
				borderWidth: 2,
				borderRadius: Number.MAX_VALUE,
				borderSkipped: false,
			},
		],
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,

		plugins: {
			legend: {
				display: false,

				position: 'top',
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
			},
			y: {
				grid: {
					display: false,
				},
			},
		},
	},
}

const floatingConfig: ChartConfiguration = {
	type: 'bar',
	data: {
		labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
		datasets: [
			{
				label: 'Fully Rounded',
				data: [12, -19, 14, -15, 12, -14],
				backgroundColor: colors[0],
			},
			{
				label: 'Small Radius',
				data: [-10, 19, -15, -8, 12, -7],
				backgroundColor: colors[1],
			},
		],
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,

		plugins: {
			legend: {
				display: false,

				position: 'top',
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
			},
			y: {
				grid: {
					display: false,
				},
			},
		},
	},
}

const datapoints = [0, 20, 20, 60, 60, 120, NaN, 180, 120, 125, 105, 110, 170]

const interpolationConfig: ChartConfiguration = {
	type: 'line',
	data: {
		labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		datasets: [
			{
				label: 'Fully Rounded',
				data: datapoints,
				borderColor: colors[1],
				fill: false,
				cubicInterpolationMode: 'monotone',
				tension: 0.4,
			},
			{
				label: 'Small Radius',
				data: datapoints,
				borderColor: colors[0],
				fill: false,
				tension: 0.4,
			},
			{
				label: 'Small Radius',
				data: datapoints,
				borderColor: colors[2],
				fill: false,
			},
		],
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			intersect: false,
		},
		plugins: {
			legend: {
				display: false,

				position: 'top',
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
			},
			y: {
				grid: {
					display: false,
				},
				suggestedMin: -10,
				suggestedMax: 200,
			},
		},
	},
}
const lineConfig: ChartConfiguration = {
	type: 'line',
	data: {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [
			{
				label: 'Fully Rounded',
				data: [32, 42, 42, 62, 52, 75, 62],
				borderColor: colors[1],
				fill: true,
				backgroundColor: hexToRGB(colors[1], 0.3),
				tension: 0.3,
			},
			{
				label: 'Small Radius',
				data: [42, 58, 66, 93, 82, 105, 92],
				fill: true,
				backgroundColor: 'transparent',
				borderColor: '#d03f3f',
				borderDash: [5, 5],
				tension: 0.3,
			},
		],
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,

		plugins: {
			legend: {
				display: false,

				position: 'top',
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
			},
			y: {
				grid: {
					display: false,
				},
			},
		},
	},
}

const colors1 = ['#716cb0', '#d03f3f']

const bubbleConfig: ChartConfiguration = {
	type: 'bubble',
	data: {
		labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
		datasets: [
			{
				label: 'Fully Rounded',
				data: [
					{ x: 10, y: 20, r: 5 },
					{ x: 20, y: 10, r: 5 },
					{ x: 15, y: 15, r: 5 },
				],
				borderColor: colors1[0],
				backgroundColor: hexToRGB(colors1[0], 0.3),
				borderWidth: 2,
				borderSkipped: false,
			},
			{
				label: 'Small Radius',
				data: [
					{ x: 12, y: 22 },
					{ x: 22, y: 20 },
					{ x: 5, y: 15 },
				],
				backgroundColor: hexToRGB(colors1[1], 0.3),
				borderColor: colors1[1],
				borderWidth: 2,
				borderSkipped: false,
			},
		],
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,

		plugins: {
			legend: {
				display: false,

				position: 'top',
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
			},
			y: {
				grid: {
					display: false,
				},
			},
		},
	},
}

const colors2 = ['#3bc0c3', '#4489e4', '#d03f3f', '#716cb0']
const donutConfig: ChartConfiguration = {
	type: 'doughnut',
	data: {
		labels: ['Direct', 'Affilliate', 'Sponsored', 'E-mail'],
		datasets: [
			{
				data: [200, 184, 96, 198],
				backgroundColor: colors2,
				borderColor: 'transparent',
				borderWidth: 3,
			},
		],
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		// cutoutPercentage: 60,
		plugins: {
			legend: {
				display: false,

				position: 'top',
			},
		},
	},
}

export {
	boundariesConfig,
	datasetConfig,
	borderRadiusConfig,
	floatingConfig,
	interpolationConfig,
	lineConfig,
	bubbleConfig,
	donutConfig,
}
