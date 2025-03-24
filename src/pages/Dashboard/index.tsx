import { Button, Col, Form, Row } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '@/config';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import Select from 'react-select';
import { Doughnut } from "react-chartjs-2";
import { PageBreadcrumb } from '@/components';
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
} from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);

// Define API response type
interface MISReportData {
	isSuccess: boolean;
	message: string;
	totalTasks: number;
	tasksNotDone: number;
	taskNotDoneOnTime: number;
	p1: number;
	p2: number;
}


const Dashboard = () => {

	const [startDate, setStartDate] = useState<string>("2025-02-24");
	const [endDate, setEndDate] = useState<string>("2025-03-03");
	const [data, setData] = useState<MISReportData | null>(null);

	// const getPastMondays = (): string[] => {
	// 	const mondays: string[] = [];
	// 	const today = new Date();
	// 	let date = new Date(today);

	// 	// Move back to the most recent Monday if today is not Monday
	// 	while (date.getDay() !== 1) {
	// 		date.setDate(date.getDate() - 1);
	// 	}

	// 	// Collect past Mondays only
	// 	while (date <= today) {
	// 		mondays.push(date.toISOString().split("T")[0]);
	// 		date.setDate(date.getDate() - 7);
	// 	}

	// 	return mondays;
	// };

	const handleStartDateChange = ([date]: Date[]) => {
		if (!date) return;

		const selectedDay = date.getDay();
		if (selectedDay !== 1) {
			alert("Please select a past Monday.");
			return;
		}

		const formattedStartDate = date.toISOString().split("T")[0];

		// Auto-fill the end date (Sunday of the same week)
		const sundayDate = new Date(date);
		sundayDate.setDate(date.getDate() + 6);
		const formattedEndDate = sundayDate.toISOString().split("T")[0];

		setStartDate(formattedStartDate);
		setEndDate(formattedEndDate);
	};



	const fetchMISData = async () => {
		if (!startDate || !endDate) {
			alert("Please select a valid date range (Monday to Sunday).");
			return;
		}

		try {
			const role = localStorage.getItem('EmpId') || '';
			const response = await axios.get<MISReportData>(
				`${config.API_URL_ACCOUNT}/MIS/GetMISReport?DoerID=${role}&StartDate=${startDate}&EndDate=${endDate}`
			);
			if (response.data.isSuccess) {
				setData(response.data);
			}
		} catch (error) {
			console.error("Error fetching MIS data:", error);
		}
	};

	useEffect(() => {
		if (startDate && endDate) {
			fetchMISData();
		}
	}, [startDate, endDate]);

	if (!data) {
		return <div className='loader-container'>
			<div className="loader"></div>
			<div className='mt-2'>Please Wait!</div>
		</div>;
	}

	const { p1, p2, totalTasks, tasksNotDone, taskNotDoneOnTime } = data;

	const taskCompleted = totalTasks - tasksNotDone;
	const taskChartData = {
		labels: ["Completed Tasks", "Tasks Not Done", "Tasks Not Done on Time"],
		datasets: [
			{
				data: [taskCompleted, tasksNotDone, taskNotDoneOnTime],
				backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
				hoverBackgroundColor: ["#218838", "#c82333", "#e0a800"],
			},
		],
	};

	const taskChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom" as const,
			},
			tooltip: {
				callbacks: {
					label: (tooltipItem: any) => `${tooltipItem.raw.toFixed(2)} Tasks`,
				},
			},
		},
	};

	// 📉 Chart 2: P1 & P2 Performance
	const performanceChartData = {
		labels: ["P1 Performance", "P2 Performance"],
		datasets: [
			{
				data: [Math.abs(p1), Math.abs(p2)], // Convert negative values to positive for visualization
				backgroundColor: ["#FF4560", "#008FFB"],
				hoverBackgroundColor: ["#FF6384", "#36A2EB"],
			},
		],
	};

	const performanceChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom" as const,
			},
			tooltip: {
				callbacks: {
					label: (tooltipItem: any) => `${tooltipItem.raw.toFixed(2)}%`,
				},
			},
		},
	};


	return (
		<>
			<PageBreadcrumb title="Welcome!" />

			<Row className="mt-3 text-dark">
				<Col lg={6}>
					<Row className='mb-3'>
						<Col>
							<div className='d-flex justify-content-between align-items-center py-3  px-3 bg-white rounded shadow-sm'>
								<div>
									<p className='mb-1'>Doers Managed By Me</p>
									<h3>146</h3>
								</div>
								<div><i className='ri-group-line fs-18'></i></div>

							</div>
						</Col>

						<Col>
							<div className='d-flex justify-content-between align-items-center py-3  px-3 bg-white rounded shadow-sm'>
								<div>
									<p className='mb-1'>Modules With My Tasks</p>
									<h3>{0}</h3>
								</div>
								<div><i className="ri-logout-box-r-line fs-18"></i></div>

							</div>
						</Col>
					</Row>
					<Row>
						<Col>
							<div className='d-flex justify-content-between align-items-center py-3  px-3 bg-white rounded shadow-sm'>
								<div>
									<p className='mb-1'>Processes With My Tasks</p>
									<h3>{0}</h3>
								</div>
								<div><i className="ri-git-merge-fill fs-18"></i></div>

							</div>
						</Col>
						<Col>
							<div className='d-flex justify-content-between align-items-center py-3  px-3 bg-white rounded shadow-sm'>
								<div>
									<p className='mb-1'>Total Tasks</p>
									<h3>{0}</h3>
								</div>
								<div><i className="ri-check-double-line fs-18"></i></div>

							</div>
						</Col>
					</Row>
				</Col>
				<Col lg={6} className='text-primary'>
					<h5 className='text-dark'>Quick Access</h5>
					<Row>
						<Col lg={3} sm={6} className='text-center my-2'>
							<div className='dashboard-quick' style={{ background: '#9433eb' }}>{0}</div>
							<h6>Tasks Due Till Today</h6>
						</Col>
						<Col lg={3} sm={6} className='text-center my-2'>
							<div className='dashboard-quick' style={{ background: '#14b8a7' }}>{0}</div>
							<h6>Future Tasks</h6>
						</Col>
						<Col lg={3} sm={6} className='text-center my-2'>
							<div className='dashboard-quick' style={{ background: '#87efac' }}>{0}</div>
							<h6>Tasks Assigned Today</h6>
						</Col>
						<Col lg={3} sm={6} className='text-center my-2'>
							<div className='dashboard-quick' style={{ background: '#da2727' }}>{0}</div>
							<h6>Tasks Pending On Me</h6>
						</Col>
					</Row>
					<Row>
						<Col lg={3} sm={6} className='text-center my-2'>
							<div className='dashboard-quick' style={{ background: '#00bdd5' }}>{0}</div>
							<h6>Pending Tasks Without Extension</h6>
						</Col>
						<Col lg={3} sm={6} className='text-center my-2'>
							<div className='dashboard-quick' style={{ background: '#fca6a5' }}>{0}</div>
							<h6>Pending Tasks {'>'} 7 Days</h6>
						</Col>
						<Col lg={3} sm={6} className='text-center my-2'>
							<div className='dashboard-quick' style={{ background: '#f87270' }}>{0}</div>
							<h6>pending Tasks {'>'} 15 Days</h6>
						</Col>
						<Col lg={3} sm={6} className='text-center my-2'>
							<div className='dashboard-quick' style={{ background: '#da2727' }}>{0}</div>
							<h6>Pending Tasks {'>'} 30 Days</h6>
						</Col>
					</Row>

				</Col>


			</Row>


			<Row className='mt-4'>

				<Col lg={6}>
					<Form>
						<Row>
							<Col lg={6}>
								<Form.Group controlId="startDate" className="mb-3">
									<Flatpickr
										options={{
											enableTime: false,
											dateFormat: "Y-m-d",
											time_24hr: false,
											maxDate: new Date(), // Restrict future dates
											disable: [
												function (date) {
													return date.getDay() !== 1 || date > new Date(); // Only allow past Mondays
												},
											],
										}}
										value={startDate || new Date()} // Ensure correct type
										onChange={handleStartDateChange}
										placeholder="Select Start Date (Past Monday)"
										className="form-control"
									/>
								</Form.Group>
							</Col>

							<Col lg={6}>
								<Form.Group controlId="endDate" className="mb-3">
									<Flatpickr
										options={{
											enableTime: false,
											dateFormat: "Y-m-d",
											time_24hr: false,
											minDate: startDate,
											maxDate: startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 6)) : "", // Set max date to Sunday
										}}
										value={endDate || new Date()} // Ensure correct type
										placeholder="Auto-filled End Date (Sunday)"
										className="form-control"
										disabled
									/>
								</Form.Group>
							</Col>


							<Col lg={6}>
								<Form.Group controlId="departmentName" className="mb-3">
									<Select
										name="departmentName"
										// value={departmentList.find((emp) => emp.name === employee.departmentName)}
										// onChange={(selectedOption) => {
										// 	setEmployee({
										// 		...employee,
										// 		departmentName: selectedOption?.name || "",
										// 	});
										// }}
										// getOptionLabel={(emp) => emp.name}
										// getOptionValue={(emp) => emp.name}
										// options={departmentList}
										isSearchable={true}
										placeholder="Choose User"
									/>

								</Form.Group>
							</Col>

							<Col lg={6}>
								<Form.Group controlId="departmentName" className="mb-3">
									<Select
										name="departmentName"
										isSearchable={true}
										placeholder="Select Project User"
									/>

								</Form.Group>
							</Col>
							<Col lg={6}>
								<Form.Group controlId="departmentName" className="mb-3">
									<Select
										name="departmentName"
										isSearchable={true}
										placeholder="Select Module"
									/>

								</Form.Group>
							</Col>
							<Col lg={6}>
								<Form.Group controlId="departmentName" className="mb-3">
									<Select
										name="departmentName"
										isSearchable={true}
										placeholder="Select Process"
									/>
								</Form.Group>
							</Col>
							<Col className='text-center'>
								<Button onClick={fetchMISData}>
									Apply
								</Button>
							</Col>
						</Row>
					</Form>
				</Col>

				<Col lg={6} className='mt-2'>
					<Row>
						<Col lg={6}>
							<div className="pt-2 text-dark">
								<div className="text-center taskpercentage">
									<div className="bg-primary text-white px-2 mb-2 py-1 rounded">
										<i className="ri-group-line fs-18"></i>
									</div>
									<h4>Total Tasks: {totalTasks}</h4>
									<div className="d-flex justify-content-between">
										<p className="mb-1 fs-11">Completed: {taskCompleted}</p>
										<p className="mb-1 fs-11">Not Done: {tasksNotDone}</p>
										<p className="mb-1 fs-11">Not Done on Time: {taskNotDoneOnTime}</p>
									</div>
									<div style={{ height: "150px" }}>
										<Doughnut data={taskChartData} options={taskChartOptions} />
									</div>
								</div>
							</div>
						</Col>

						{/* P1 & P2 Performance Chart */}
						<Col lg={6}>
							<div className="pt-2 text-dark">
								<div className="text-center taskpercentage">
									<div className="bg-primary text-white px-2 mb-2 py-1 rounded">
										<i className="ri-group-line fs-18"></i>
									</div>
									<h4>P1: {p1}%</h4>
									<h4>P2: {p2}%</h4>
									<div style={{ height: "125px" }}>
										<Doughnut data={performanceChartData} options={performanceChartOptions} />
									</div>
								</div>
							</div>
						</Col>
						{/* <Col lg={4}>
							<div className='pt-2 text-dark '>
								<div className='text-center  taskpercentage'>
									<div className='bg-primary text-white px-2 mb-2 py-1 rounded '>
										<i className='ri-group-line fs-18 '></i>
									</div>
									<h4>P2:0 %</h4>
									<p className='mb-1 fs-11'>Tasks Not Done on time: 00</p>
								</div>

							</div>
						</Col>
						<Col lg={4}>
							<div className='pt-2 text-dark '>
								<div className='text-center  taskpercentage'>
									<div className='bg-primary text-white px-2 mb-2 py-1 rounded '>
										<i className='ri-group-line fs-18 '></i>
									</div>
									<h4>P3:0 %</h4>
									<p className='mb-1 fs-11'>Delay Hours: 00 Hrs</p>
								</div>

							</div>
						</Col> */}
					</Row>

				</Col>
			</Row>

		</>
	)
}

export default Dashboard
