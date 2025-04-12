import { Card } from 'react-bootstrap'

interface StatisticWidget {
	title: string
	stats: number
	change: number
	icon: any
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
		// <Card className="widget-flat" style={{ border: `1px solid ${variant}` }}>

		<Card className="widget-flat" style={{ backgroundColor: variant }}>
			<Card.Body>
				<div className="float-end">

					<span className='widget-icon'>
						{icon}
					</span>
				</div>
				<h5 className=" mt-0" title="Customers">
					{title}
				</h5>
				<h2 className="my-2 ">{stats}</h2>
				<p className="mb-0 ">
					<span className="badge text-dark bg-opacity-10 me-1">{change}</span>
					&nbsp;
					<span className="text-nowrap">Since last month</span>
				</p>
			</Card.Body>
		</Card>
	)
}

export default Statistics
