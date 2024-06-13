import { Table } from 'react-bootstrap'

// components
import { CustomCardPortlet } from '@/components'

// data
import { projects } from './data'

const Projects = () => {
	return (
		<CustomCardPortlet cardTitle="Projects" titleClass="header-title">
			<Table hover responsive className="table-nowrap mb-0">
				<thead>
					<tr>
						<th>#</th>
						<th>Project Name</th>
						<th>Start Date</th>
						<th>Due Date</th>
						<th>Status</th>
						<th>Assign</th>
					</tr>
				</thead>
				<tbody>
					{(projects || []).map((project, idx) => {
						return (
							<tr key={idx}>
								<td>{project.id}</td>
								<td>{project.projectName}</td>
								<td>01/01/2015</td>
								<td>{project.dueDate}</td>
								<td>
									<span
										className={`badge bg-${project.variant}-subtle text-${project.variant}`}>
										{project.status}
									</span>
								</td>
								<td>Techzaa Studio</td>
							</tr>
						)
					})}
				</tbody>
			</Table>
		</CustomCardPortlet>
	)
}

export default Projects
