import { Card } from 'react-bootstrap'

interface StatisticWidget {
	title: string
	stats: string
	change: string
	icon: string
	variant: string
}
const Statistics = ({
	title,
	icon,
	stats,
	variant,
	change,
}: StatisticWidget) => {
	return (
		<Card className={`widget-flat ${variant}`}>
			<Card.Body>
				<div className="float-end">
					<i className={`${icon} widget-icon`}></i>
				</div>
				<h6 className="text-uppercase mt-0" title="Customers">
					{title}
				</h6>
				<h2 className="my-2">{stats}</h2>
				<p className="mb-0">
					<span className="badge bg-white bg-opacity-10 me-1">{change}</span>
					&nbsp;
					<span className="text-nowrap">Since last month</span>
				</p>
			</Card.Body>
		</Card>
	)
}

export default Statistics
