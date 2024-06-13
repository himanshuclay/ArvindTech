import { Card, Col, Row } from 'react-bootstrap'

//dummy data
import { employeeRecords, expandableRecords } from './data'
import { Column } from 'react-table'
import { Employee } from './types'

// components
import { PageSize, Table } from '@/components'
import { PageBreadcrumb } from '@/components'

const columns: ReadonlyArray<Column> = [
	{
		Header: 'ID',
		accessor: 'id',
		defaultCanSort: true,
	},
	{
		Header: 'Name',
		accessor: 'name',
		defaultCanSort: true,
	},
	{
		Header: 'Phone Number',
		accessor: 'phone',
		defaultCanSort: false,
	},
	{
		Header: 'Age',
		accessor: 'age',
		defaultCanSort: true,
	},
	{
		Header: 'Company',
		accessor: 'company',
		defaultCanSort: false,
	},
]

const sizePerPageList: PageSize[] = [
	{
		text: '5',
		value: 5,
	},
	{
		text: '10',
		value: 10,
	},
	{
		text: '25',
		value: 25,
	},
	{
		text: 'All',
		value: employeeRecords.length,
	},
]

const DataTables = () => {
	return (
		<>
			<PageBreadcrumb title="Data Tables" subName="Tables" />
			<Row>
				<Col>
					<Card>
						<Card.Header>
							<h4 className="header-title">Pagination &amp; Sort</h4>
							<p className="text-muted mb-0">
								A simple example of table with pagination and column sorting
							</p>
						</Card.Header>
						<Card.Body>
							<Table<Employee>
								columns={columns}
								data={employeeRecords}
								pageSize={5}
								sizePerPageList={sizePerPageList}
								isSortable={true}
								pagination={true}
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col>
					<Card>
						<Card.Header>
							<h4 className="header-title">Search</h4>
							<p className="text-muted mb-0">A Table allowing search</p>
						</Card.Header>
						<Card.Body>
							<Table<Employee>
								columns={columns}
								data={employeeRecords}
								pageSize={5}
								sizePerPageList={sizePerPageList}
								isSortable={true}
								pagination={true}
								isSearchable={true}
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col>
					<Card>
						<Card.Header>
							<h4 className="header-title">Multiple Row Selection</h4>
							<p className="text-muted mb-0">
								This table allowing selection of multiple rows
							</p>
						</Card.Header>
						<Card.Body>
							<Table<Employee>
								columns={columns}
								data={employeeRecords}
								pageSize={5}
								sizePerPageList={sizePerPageList}
								isSortable={true}
								pagination={true}
								isSelectable={true}
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col>
					<Card>
						<Card.Header>
							<h4 className="header-title">Expand Row</h4>
							<p className="text-muted mb-0">
								Expand row to see more additional details
							</p>
						</Card.Header>
						<Card.Body>
							<Table<Employee>
								columns={columns}
								data={expandableRecords}
								pageSize={5}
								sizePerPageList={sizePerPageList}
								isSortable={true}
								pagination={true}
								isExpandable={true}
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default DataTables
