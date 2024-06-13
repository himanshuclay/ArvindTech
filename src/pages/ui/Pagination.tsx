import {
	Row,
	Pagination as BootstrapPagination,
	Col,
	Card,
} from 'react-bootstrap'

// component
import { PageBreadcrumb } from '@/components'

const DefaultPagination = () => {
	let items = []
	for (let number = 1; number <= 5; number++) {
		items.push(
			<BootstrapPagination.Item key={number}>{number}</BootstrapPagination.Item>
		)
	}
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Default Pagination</h4>
				<p className="text-muted mb-0">
					Simple pagination inspired by Rdio, great for apps and search results.
				</p>
			</Card.Header>
			<Card.Body>
				<nav>
					<BootstrapPagination className="mb-0">
						<BootstrapPagination.Prev />
						{items}
						<BootstrapPagination.Next />
					</BootstrapPagination>
				</nav>
			</Card.Body>
		</Card>
	)
}

const PaginationWithStates = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Disabled and active states</h4>
				<p className="text-muted mb-0">
					Pagination links are customizable for different circumstances. Use{' '}
					<code>.disabled</code> for links that appear un-clickable and{' '}
					<code>.active</code> to indicate the current page.
				</p>
			</Card.Header>
			<Card.Body>
				<nav aria-label="...">
					<BootstrapPagination className="mb-0">
						<BootstrapPagination.Prev disabled>
							Previous
						</BootstrapPagination.Prev>
						<BootstrapPagination.Item>{1}</BootstrapPagination.Item>
						<BootstrapPagination.Item active>{2}</BootstrapPagination.Item>
						<BootstrapPagination.Item>{3}</BootstrapPagination.Item>
						<BootstrapPagination.Next>Next</BootstrapPagination.Next>
					</BootstrapPagination>
				</nav>
			</Card.Body>
		</Card>
	)
}

const PaginationAlignment = () => {
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Alignment</h4>
				<p className="text-muted mb-0">
					Change the alignment of pagination components with flexbox utilities.
				</p>
			</Card.Header>
			<Card.Body>
				<nav aria-label="Page navigation example">
					<BootstrapPagination className="justify-content-center">
						<BootstrapPagination.Prev disabled>
							Previous
						</BootstrapPagination.Prev>
						<BootstrapPagination.Item>{1}</BootstrapPagination.Item>
						<BootstrapPagination.Item>{2}</BootstrapPagination.Item>
						<BootstrapPagination.Item>{3}</BootstrapPagination.Item>
						<BootstrapPagination.Next>Next</BootstrapPagination.Next>
					</BootstrapPagination>
				</nav>
				<nav aria-label="Page navigation example">
					<BootstrapPagination className="justify-content-end">
						<BootstrapPagination.Prev disabled>
							Previous
						</BootstrapPagination.Prev>
						<BootstrapPagination.Item>{1}</BootstrapPagination.Item>
						<BootstrapPagination.Item>{2}</BootstrapPagination.Item>
						<BootstrapPagination.Item>{3}</BootstrapPagination.Item>
						<BootstrapPagination.Next>Next</BootstrapPagination.Next>
					</BootstrapPagination>
				</nav>
			</Card.Body>
		</Card>
	)
}

const RoundedPagination = () => {
	let items = []
	for (let number = 1; number <= 5; number++) {
		items.push(
			<BootstrapPagination.Item key={number} active={number === 3}>
				{number}
			</BootstrapPagination.Item>
		)
	}
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Rounded Pagination</h4>
				<p className="text-muted mb-0">
					Add <code> .pagination-rounded</code> for rounded pagination.
				</p>
			</Card.Header>
			<Card.Body>
				<nav>
					<BootstrapPagination className="pagination-rounded mb-0">
						<BootstrapPagination.Prev />
						{items}
						<BootstrapPagination.Next />
					</BootstrapPagination>
				</nav>
			</Card.Body>
		</Card>
	)
}

const PaginationSizes = () => {
	let items = []
	for (let number = 1; number <= 3; number++) {
		items.push(
			<BootstrapPagination.Item key={number}>{number}</BootstrapPagination.Item>
		)
	}
	return (
		<>
			<Card>
				<Card.Header>
					<h4 className="header-title">Sizing</h4>
					<p className="text-muted mb-0">
						Add <code> .pagination-lg</code> or <code> .pagination-sm</code> for
						additional sizes.
					</p>
				</Card.Header>
				<Card.Body>
					<nav>
						<BootstrapPagination size="lg">
							<BootstrapPagination.Prev />
							{items}
							<BootstrapPagination.Next />
						</BootstrapPagination>
						<BootstrapPagination size="sm">
							<BootstrapPagination.Prev />
							{items}
							<BootstrapPagination.Next />
						</BootstrapPagination>
					</nav>
				</Card.Body>
			</Card>
		</>
	)
}
const Pagination = () => {
	return (
		<>
			<PageBreadcrumb title="Pagination" subName="Base UI" />
			<Row>
				<Col xl={12}>
					<DefaultPagination />
					<PaginationWithStates />
					<PaginationAlignment />
				</Col>
				<Col xl={12}>
					<RoundedPagination />
					<PaginationSizes />
				</Col>
			</Row>
		</>
	)
}

export default Pagination
