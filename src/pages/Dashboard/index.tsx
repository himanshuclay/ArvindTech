import { Button, Col, Form, Row } from 'react-bootstrap'
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import Select from 'react-select';
import { PageBreadcrumb } from '@/components';




const Dashboard = () => {


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
								<Form.Group controlId="dateOfBirth" className="mb-3">
									<Flatpickr
										// value={employee.dateOfBirth}
										// onChange={([date]) => {
										// 	if (date) {
										// 		const formattedDate = date.toLocaleDateString('en-CA');
										// 		setEmployee({
										// 			...employee,
										// 			dateOfBirth: formattedDate,
										// 		});
										// 	}
										// }}
										options={{
											enableTime: false,
											dateFormat: "Y-m-d",
											time_24hr: false,
										}}
										placeholder=" Start Date "
										className={"  form-control"}
									/>

								</Form.Group>
							</Col>
							<Col lg={6}>
								<Form.Group controlId="dateOfBirth" className="mb-3">
									<Flatpickr
										options={{
											enableTime: false,
											dateFormat: "Y-m-d",
											time_24hr: false,
										}}
										placeholder=" End Date "
										className={"  form-control"}
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
								<Button>
									Apply
								</Button>
							</Col>
						</Row>
					</Form>
				</Col>

				<Col lg={6} className='mt-2'>
					<Row>

						<Col lg={4}>
							<div className='pt-2 text-dark '>
								<div className='text-center  taskpercentage'>
									<div className='bg-primary text-white px-2 mb-2 py-1 rounded '>
										<i className='ri-group-line fs-18 '></i>
									</div>
									<h4>P1:0 %</h4>
									<div className='d-flex justify-content-between'>
										<p className='mb-1 fs-11'>Total Tasks: 00</p>
										<p className='mb-1 fs-11'>Tasks Done: 00</p>
									</div>
								</div>

							</div>
						</Col>
						<Col lg={4}>
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
						</Col>
					</Row>

				</Col>
			</Row>

		</>
	)
}

export default Dashboard
