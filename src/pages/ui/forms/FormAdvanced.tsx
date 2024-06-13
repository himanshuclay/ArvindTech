import { useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import Select from 'react-select'
import { Typeahead } from 'react-bootstrap-typeahead'
import { DateRangePicker, DatePicker } from 'rsuite'
import subDays from 'date-fns/subDays'
import startOfWeek from 'date-fns/startOfWeek'
import endOfWeek from 'date-fns/endOfWeek'
import addDays from 'date-fns/addDays'
import startOfMonth from 'date-fns/startOfMonth'
import MaskedInput from 'react-text-mask-legacy'

// css
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'rsuite/dist/rsuite-no-reset.min.css'

// dummy data
import { options, states } from './data'

//components
import CustomFlatpickr from '@/components/CustomFlatpickr'
import { PageBreadcrumb } from '@/components'

const FormSelect = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">React Select</h4>
				<p className="text-muted mb-0">
					React Select gives you a customizable select box with support for
					searching, tagging, remote data sets, infinite scrolling, and many
					other highly used options.
				</p>
			</Card.Header>
			<Card.Body>
				<Row>
					<Col lg={6}>
						<p className="mb-1 fw-bold text-muted">Single Select</p>
						<p className="text-muted fs-14">
							Select2 can take a regular select box like this...
						</p>
						<Select className="select2 z-3" options={options} />
					</Col>

					<Col lg={6}>
						<p className="mb-1 fw-bold text-muted">Multiple Select</p>
						<p className="text-muted fs-14">
							Select2 can take a regular select box like this...
						</p>
						<Select
							className="select2 select2-multiple z-3"
							options={options}
							isMulti={true}
						/>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}

const FormDateRangePicker = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">React Suite Date Range Picker</h4>
				<p className="text-muted mb-0">
					A JavaScript component for choosing date ranges, dates and times.
				</p>
			</Card.Header>

			<Card.Body>
				<Row>
					<Col lg={6}>
						<div className="mb-3">
							<label className="form-label d-block">Date Range</label>
							<DateRangePicker
								className="w-100"
								appearance="default"
								defaultValue={[new Date(), new Date()]}
							/>
						</div>
					</Col>

					<Col lg={6}>
						<div className="mb-3">
							<label className="form-label d-block">
								Date Range Picker With Times
							</label>
							<DateRangePicker
								className="w-100"
								format="yyyy-MM-dd HH:mm:ss"
								defaultValue={[new Date(), new Date()]}
							/>
						</div>
					</Col>
				</Row>

				<Row>
					<Col lg={6}>
						<div>
							<label className="form-label d-block">Single Date Picker</label>
							<DatePicker block defaultValue={new Date()} />
						</div>
					</Col>
					<Col lg={6}>
						<div>
							<label className="form-label d-block">
								Predefined Date Ranges
							</label>
							<DateRangePicker
								ranges={[
									{
										label: 'Today',
										value: [new Date(), new Date()],
										placement: 'left',
									},
									{
										label: 'Yesterday',
										value: [addDays(new Date(), -1), addDays(new Date(), -1)],
										placement: 'left',
									},
									{
										label: 'This week',
										value: [startOfWeek(new Date()), endOfWeek(new Date())],
										placement: 'left',
									},
									{
										label: 'Last 7 days',
										value: [subDays(new Date(), 6), new Date()],
										placement: 'left',
									},
									{
										label: 'Last 30 days',
										value: [subDays(new Date(), 29), new Date()],
										placement: 'left',
									},
									{
										label: 'This month',
										value: [startOfMonth(new Date()), new Date()],
										placement: 'left',
									},
									{
										label: 'This year',
										value: [
											new Date(new Date().getFullYear(), 0, 1),
											new Date(),
										],
										placement: 'left',
									},
								]}
								showOneCalendar
								block
								defaultValue={[new Date(), new Date()]}
							/>
						</div>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}

const InputMask = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Input Masks</h4>
			</Card.Header>
			<Card.Body>
				<Row>
					<Col md={6}>
						<form action="#">
							<div className="mb-3">
								<label className="form-label">Date</label>
								<MaskedInput
									mask={[
										/\d/,
										/\d/,
										'/',
										/\d/,
										/\d/,
										'/',
										/\d/,
										/\d/,
										/\d/,
										/\d/,
									]}
									placeholder="Enter date"
									className="form-control"
								/>
								<span className="fs-13 text-muted">e.g "DD/MM/YYYY"</span>
							</div>
							<div className="mb-3">
								<label className="form-label">Hour</label>
								<MaskedInput
									mask={[/\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/]}
									placeholder="Enter time"
									className="form-control"
								/>
								<span className="fs-13 text-muted">e.g "HH:MM:SS"</span>
							</div>
							<div className="mb-3">
								<label className="form-label">Date & Hour</label>
								<MaskedInput
									mask={[
										/\d/,
										/\d/,
										'/',
										/\d/,
										/\d/,
										'/',
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										' ',
										/\d/,
										/\d/,
										':',
										/\d/,
										/\d/,
										':',
										/\d/,
										/\d/,
									]}
									placeholder="Enter date & time"
									className="form-control"
								/>
								<span className="fs-13 text-muted">
									e.g "DD/MM/YYYY HH:MM:SS"
								</span>
							</div>
							<div className="mb-3">
								<label className="form-label">ZIP Code</label>
								<MaskedInput
									mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
									placeholder="Enter zip code"
									className="form-control"
								/>
								<span className="fs-13 text-muted">e.g "xxxxx-xxx"</span>
							</div>
							<div className="mb-3">
								<label className="form-label">Crazy Zip Code</label>
								<MaskedInput
									mask={[
										/\d/,
										'-',
										/\d/,
										/\d/,
										'-',
										/\d/,
										/\d/,
										'-',
										/\d/,
										/\d/,
									]}
									placeholder="Enter zip code"
									className="form-control"
								/>
								<span className="fs-13 text-muted">e.g "x-xx-xx-xx"</span>
							</div>
							<div className="mb-3">
								<label className="form-label">Money</label>
								<MaskedInput
									mask={[
										/\d/,
										/\d/,
										/\d/,
										'.',
										/\d/,
										/\d/,
										/\d/,
										'.',
										/\d/,
										/\d/,
										/\d/,
										'.',
										/\d/,
										/\d/,
										/\d/,
										'.',
										/\d/,
										/\d/,
										/\d/,
										',',
										/\d/,
										/\d/,
									]}
									placeholder="Enter money"
									className="form-control"
								/>
								<span className="fs-13 text-muted">e.g "Your money"</span>
							</div>
							<div>
								<label className="form-label">Money 2</label>
								<MaskedInput
									mask={[/\d/, '.', /\d/, /\d/, /\d/, ',', /\d/, /\d/]}
									placeholder="Enter money"
									className="form-control"
								/>
								{/* <input type="text" className="form-control" placeholder="Enter money" data-toggle="input-mask" data-mask-format="#.##0,00" data-reverse="true" /> */}
								<span className="fs-13 text-muted">e.g "#.##0,00"</span>
							</div>
						</form>
					</Col>
					<Col md={6}>
						<form action="#">
							<div className="mb-3">
								<label className="form-label">Telephone</label>
								<MaskedInput
									mask={[
										/[1-9]/,
										/\d/,
										/\d/,
										/\d/,
										'-',
										/\d/,
										/\d/,
										/\d/,
										/\d/,
									]}
									placeholder="Enter telephone"
									className="form-control"
								/>
								<span className="fs-13 text-muted">e.g "xxxx-xxxx"</span>
							</div>
							<div className="mb-3">
								<label className="form-label">Telephone with Code Area</label>
								<MaskedInput
									mask={[
										'(',
										/[1-9]/,
										/\d/,
										')',
										' ',
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										'-',
										/\d/,
										/\d/,
										/\d/,
										/\d/,
									]}
									placeholder="Enter telephone"
									className="form-control"
								/>
								<span className="fs-13 text-muted">e.g "(xx) xxxx-xxxx"</span>
							</div>
							<div className="mb-3">
								<label className="form-label">US Telephone</label>
								<MaskedInput
									mask={[
										'(',
										/[1-9]/,
										/\d/,
										/\d/,
										')',
										' ',
										/\d/,
										/\d/,
										/\d/,
										'-',
										/\d/,
										/\d/,
										/\d/,
										/\d/,
									]}
									placeholder="Enter US telephone"
									className="form-control"
								/>
								<span className="fs-13 text-muted">e.g "(xxx) xxx-xxxx"</span>
							</div>
							<div className="mb-3">
								<label className="form-label">São Paulo Celphones</label>
								<MaskedInput
									mask={[
										'(',
										/[1-9]/,
										/\d/,
										')',
										' ',
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										'-',
										/\d/,
										/\d/,
										/\d/,
										/\d/,
									]}
									placeholder="Enter telephone"
									className="form-control"
								/>
								<span className="fs-13 text-muted">e.g "(xx) xxxxx-xxxx"</span>
							</div>
							<div className="mb-3">
								<label className="form-label">CPF</label>
								<MaskedInput
									mask={[
										/\d/,
										/\d/,
										/\d/,
										'.',
										/\d/,
										/\d/,
										/\d/,
										'.',
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										'-',
										/\d/,
										/\d/,
									]}
									placeholder="Enter CPF"
									className="form-control"
								/>
								<span className="fs-13 text-muted">e.g "xxx.xxx.xxxx-xx"</span>
							</div>
							<div className="mb-3">
								<label className="form-label">CNPJ</label>
								<MaskedInput
									mask={[
										/\d/,
										/\d/,
										'.',
										/\d/,
										/\d/,
										/\d/,
										'.',
										/\d/,
										/\d/,
										/\d/,
										'/',
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										'-',
										/\d/,
										/\d/,
									]}
									placeholder="Enter CNPJ"
									className="form-control"
								/>
								<span className="fs-13 text-muted">
									e.g "xx.xxx.xxx/xxxx-xx"
								</span>
							</div>
							<div>
								<label className="form-label">IP Address</label>
								<MaskedInput
									mask={[
										/\d/,
										/\d/,
										/\d/,
										'.',
										/\d/,
										/\d/,
										/\d/,
										'.',
										/\d/,
										/\d/,
										/\d/,
										'.',
										/\d/,
										/\d/,
										/\d/,
									]}
									placeholder="Enter IP Address"
									className="form-control"
								/>
								<span className="fs-13 text-muted">e.g "xxx.xxx.xxx.xxx"</span>
							</div>
						</form>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}

const Typeaheads = () => {
	const [singleSelections, setSingleSelections] = useState<any>([])
	const [multiSelections, setMultiSelections] = useState<any>([])

	const onChangeSingleSelection = (selected: any) => {
		setSingleSelections(selected)
	}

	const onChangeMultipleSelection = (selected: any) => {
		setMultiSelections(selected)
	}

	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Typeahead</h4>
				<p className="text-muted mb-0">
					Typeahead.js is a fast and fully-featured autocomplete library.
				</p>
			</Card.Header>
			<Card.Body>
				<Row>
					<Col lg={6}>
						<div className="mb-3">
							<label className="form-label">The Basics</label>
							<Typeahead
								id="the-basics"
								labelKey={'label'}
								multiple={false}
								onChange={onChangeSingleSelection}
								options={states}
								placeholder="Basic Example"
								selected={singleSelections}
							/>
						</div>
					</Col>

					<Col lg={6} className="mt-3 mt-lg-0">
						<label className="form-label">Multiple Selection</label>
						<Typeahead
							id="multi"
							labelKey={'label'}
							multiple
							onChange={onChangeMultipleSelection}
							options={states}
							placeholder="Basic Example"
							selected={multiSelections}
						/>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}

const FlatpickrDate = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Flatpickr - Date picker</h4>
				<p className="text-muted mb-0">
					A lightweight and powerful datetimepicker
				</p>
			</Card.Header>
			<Card.Body>
				<Row>
					<Col lg={6}>
						<div className="mb-3">
							<label className="form-label d-block">Basic</label>
							<CustomFlatpickr className="form-control" placeholder="Basic" />
						</div>

						<div className="mb-3">
							<label className="form-label">Date & Time</label>
							<CustomFlatpickr
								className="form-control"
								placeholder="Date & Time"
								options={{
									enableTime: true,
									dateFormat: 'Y-m-d H:i',
								}}
							/>
						</div>

						<div className="mb-3">
							<label className="form-label">Human-friendly Dates</label>
							<CustomFlatpickr
								className="form-control"
								value={new Date()}
								options={{
									altInput: true,
									altFormat: 'F j, Y',
									dateFormat: 'Y-m-d',
								}}
							/>
						</div>

						<div className="mb-3">
							<label className="form-label">MinDate and MaxDate</label>
							<CustomFlatpickr
								className="form-control"
								placeholder="MinDate and MaxDate"
								options={{
									minDate: 'today',
									maxDate: new Date('2025-05-01'),
								}}
							/>
						</div>

						<div className="mb-3">
							<label className="form-label">Disabling dates</label>
							<CustomFlatpickr
								className="form-control"
								placeholder="Disabling dates"
								options={{
									disable: [
										function (date: Date) {
											return date.getDay() === 0 || date.getDay() === 6
										},
									],
									locale: {
										firstDayOfWeek: 1, // start week on Monday
									},
								}}
							/>
						</div>

						<div className="mb-3">
							<label className="form-label">Selecting multiple dates</label>
							<CustomFlatpickr
								className="form-control"
								placeholder="Multiple dates"
								options={{
									mode: 'multiple',
									dateFormat: 'Y-m-d',
									defaultDate: ['2016-10-20', '2016-11-04'],
								}}
							/>
						</div>
					</Col>

					<Col lg={6} className="mt-3 mt-lg-0">
						<div className="mb-3">
							<label className="form-label">
								Selecting multiple dates - Conjunction
							</label>
							<CustomFlatpickr
								className="form-control"
								value={[new Date(), new Date()]}
								options={{
									mode: 'multiple',
									dateFormat: 'Y-m-d',
									conjunction: ' :: ',
								}}
							/>
						</div>

						<div className="mb-3">
							<label className="form-label">Range Calendar</label>
							<CustomFlatpickr
								className="form-control"
								value={[new Date(), new Date()]}
								options={{
									mode: 'range',
								}}
							/>
						</div>

						<div>
							<label className="form-label">Inline Calendar</label>
							<CustomFlatpickr
								className="form-control"
								placeholder="Inline calendar"
								options={{
									inline: true,
								}}
							/>
						</div>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}

const FlatpickrTime = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Flatpickr - Time Picker </h4>
				<p className="text-muted mb-0">
					A lightweight and powerful datetimepicker
				</p>
			</Card.Header>
			<Card.Body>
				<Row>
					<Col lg={6}>
						<div className="mb-3">
							<label className="form-label">Default Time Picker</label>
							<div className="input-group">
								<CustomFlatpickr
									className="form-control"
									placeholder="Basic timepickr"
									options={{
										enableTime: true,
										noCalendar: true,
										dateFormat: 'H:i',
									}}
								/>
								<span className="input-group-text">
									<i className="ri-time-line" />
								</span>
							</div>
						</div>

						<div className="mb-0">
							<label className="form-label">24-hour Time Picker</label>
							<div className="input-group">
								<CustomFlatpickr
									className="form-control"
									value={new Date()}
									options={{
										enableTime: true,
										noCalendar: true,
										dateFormat: 'H:i',
										time_24hr: true,
									}}
								/>
								<span className="input-group-text">
									<i className="ri-time-line" />
								</span>
							</div>
						</div>
					</Col>
					<Col lg={6} className="mt-3 mt-lg-0">
						<div className="mb-3">
							<label className="form-label">Time Picker w/ Limits</label>
							<div className="input-group">
								<CustomFlatpickr
									className="form-control"
									placeholder="Limits"
									options={{
										enableTime: true,
										noCalendar: true,
										dateFormat: 'H:i',
										minTime: '16:00',
										maxTime: '22:30',
									}}
								/>
								<span className="input-group-text">
									<i className="ri-time-line" />
								</span>
							</div>
						</div>
						<div className="mb-0">
							<label className="form-label">Preloading Time</label>
							<div className="input-group">
								<CustomFlatpickr
									className="form-control"
									value={new Date()}
									options={{
										enableTime: true,
										noCalendar: true,
										dateFormat: 'H:i',
										defaultDate: '13:45',
									}}
								/>
								<span className="input-group-text">
									<i className="ri-time-line" />
								</span>
							</div>
						</div>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}

const FormDatepicker = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">React Suite Bootstrap Datepicker</h4>
				<p className="text-muted mb-0">
					Bootstrap-datepicker provides a flexible datepicker widget in the
					Bootstrap style.
				</p>
			</Card.Header>

			<Card.Body>
				<Row>
					<Col lg={6}>
						<div className="mb-3 position-relative" id="datepicker1">
							<label className="form-label d-block">Date Picker</label>
							<DatePicker block placeholder="Select Date" />
						</div>
					</Col>
					<Col lg={6}>
						<div className="mb-3 position-relative" id="datepicker2">
							<label className="form-label">Date View</label>
							<DatePicker block format="d-M-yyyy" placeholder="Select Date" />
						</div>
					</Col>
				</Row>

				<Row>
					<Col lg={6}>
						<div className="mb-3 position-relative" id="datepicker3">
							<label className="form-label d-block">Date & Time</label>
							<DatePicker
								block
								placeholder="Select date & time"
								format="yyyy-MM-dd HH:mm:ss"
								calendarDefaultDate={new Date('2022-02-02 00:00:00')}
								ranges={[
									{
										label: 'Now',
										value: new Date(),
									},
								]}
							/>
						</div>
					</Col>
					<Col lg={6}>
						<div className="mb-3 position-relative" id="datepicker6">
							<label className="form-label d-block">Year View</label>
							<DatePicker
								block
								format="HH:mm:ss"
								placeholder="Select time"
								ranges={[]}
							/>
						</div>
					</Col>
				</Row>

				<Row>
					<Col lg={6}>
						<div className="mb-3 position-relative" id="datepicker5">
							<label className="form-label">Month View</label>
							<DatePicker
								block
								placeholder="Select Month"
								format="yyyy-MM"
								ranges={[]}
							/>
						</div>
					</Col>

					<Col lg={6}>
						<div className="mb-3 position-relative" id="datepicker4">
							<label className="form-label d-block">Autoclose</label>
							<DatePicker block placeholder="Select Date" oneTap />
						</div>
					</Col>
				</Row>

				<Row>
					<Col lg={6}>
						<div className="mb-3 position-relative" id="datepicker7">
							<label className="form-label">Custom short options</label>
							<DatePicker
								block
								ranges={[
									{
										label: 'yesterday',
										value: addDays(new Date(), -1),
										placement: 'left',
									},
									{
										label: 'today',
										value: new Date(),
										placement: 'left',
									},
									{
										label: 'Prev Day',
										closeOverlay: false,
										value: (date) => {
											return subDays(date, 1)
										},
									},
								]}
								placeholder="Placement mixed"
							/>
						</div>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}

const FormMaxLength = () => {
	const [isInvalid1, setisInvalid1] = useState(false)
	const [isInvalid2, setisInvalid2] = useState(false)

	const changeHandler = (e: any, id: string) => {
		if (id === 'input' && e.target.value.length === 25)
			return setisInvalid1(true)
		if (id === 'textarea' && e.target.value.length === 225)
			return setisInvalid2(true)
		setisInvalid1(false)
		setisInvalid2(false)
	}
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Bootstrap Maxlength</h4>
				<p className="text-muted mb-0">
					Uses the HTML5 attribute "maxlength" to work. Just specify{' '}
					<code>data-toggle="maxlength"</code> attribute to have maxlength
					indication on any input.
				</p>
			</Card.Header>
			<Card.Body>
				<Row>
					<Col lg={6}>
						<Form.Group className="position-relative mb-3">
							<Form.Label>Default usage</Form.Label>
							<p className="text-muted fs-13">
								The badge will show up when you have exceed the max characters
								limit:
							</p>
							<Form.Control
								isInvalid={isInvalid1}
								type="text"
								placeholder="Max 25"
								maxLength={25}
								data-toggle="maxlength"
								onChange={(e) => changeHandler(e, 'input')}
							/>
							<Form.Control.Feedback type="invalid" tooltip>
								You typed 25 chars available
							</Form.Control.Feedback>
						</Form.Group>
					</Col>

					<Col lg={6} className="mt-3 mt-lg-0">
						<Form.Group className="position-relative">
							<Form.Label>Textareas</Form.Label>
							<p className="text-muted fs-13">
								Bootstrap maxlength supports textarea as well as inputs. Even on
								old IE.
							</p>
							<Form.Control
								isInvalid={isInvalid2}
								as="textarea"
								data-toggle="maxlength"
								maxLength={225}
								rows={3}
								placeholder="This textarea has a limit of 225 chars."
								onChange={(e) => changeHandler(e, 'textarea')}
							></Form.Control>
							<Form.Control.Feedback type="invalid" tooltip>
								You typed 225 chars available
							</Form.Control.Feedback>
						</Form.Group>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}

const FormAdvanced = () => {
	return (
		<>
			<PageBreadcrumb title="Form Advanced" subName="Forms" />
			<Row>
				<Col>
					<FormSelect />
				</Col>
			</Row>

			<Row>
				<Col>
					<FormDateRangePicker />
				</Col>
			</Row>

			<Row>
				<Col>
					<FormDatepicker />
				</Col>
			</Row>

			<Row>
				<Col>
					<FlatpickrDate />
				</Col>
			</Row>

			<Row>
				<Col>
					<FlatpickrTime />
				</Col>
			</Row>

			<Row>
				<Col>
					<InputMask />
				</Col>
			</Row>

			<Row>
				<Col>
					<FormMaxLength />
				</Col>
			</Row>

			<Row>
				<Col>
					<Typeaheads />
				</Col>
			</Row>
		</>
	)
}

export default FormAdvanced
