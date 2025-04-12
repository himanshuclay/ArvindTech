import {
	Button,
	Card,
	Col,
	Image,
	OverlayTrigger,
	Pagination,
	Row,
	Tooltip,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { splitArray } from '@/utils'

// components
import { PageBreadcrumb } from '@/components'

// data
import { contactList } from './data'

interface ContactListData {
	name: string
	avatar: string
}

const contactlist = contactList || []
const contactListChunks = splitArray(contactlist, 2)

const ContactLists = ({ avatar, name }: ContactListData) => {
	return (
		<Col md={6}>
			<Card>
				<Card.Body>
					<div className="d-flex align-items-start justify-content-between">
						<div className="d-flex">
							<Link className="me-3" to="#">
								<Image className="avatar-md rounded-circle bx-s" src={avatar} />
							</Link>
							<div className="info">
								<h5 className="fs-18 my-1">{name}</h5>
								<p className="text-muted fs-15">Graphics Designer</p>
							</div>
						</div>
						<div>
							<OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
								<Button variant="success" size="sm" className="me-1">
									{' '}
									<i className="ri-pencil-fill" />{' '}
								</Button>
							</OverlayTrigger>
							<OverlayTrigger
								placement="top"
								overlay={<Tooltip>Delete</Tooltip>}
							>
								<Button variant="danger" size="sm">
									{' '}
									<i className="ri-close-fill" />{' '}
								</Button>
							</OverlayTrigger>
						</div>
					</div>
					<hr />
					<ul className="social-list list-inline mt-3 mb-0">
						<li className="list-inline-item">
							<OverlayTrigger
								placement="top"
								overlay={<Tooltip>Facebook</Tooltip>}
							>
								<Link
									className="social-list-item bg-dark-subtle text-secondary fs-16 border-0"
									to=""
								>
									<i className="ri-facebook-fill" />
								</Link>
							</OverlayTrigger>
						</li>
						<li className="list-inline-item">
							<OverlayTrigger
								placement="top"
								overlay={<Tooltip>Twitter</Tooltip>}
							>
								<Link
									className="social-list-item bg-dark-subtle text-secondary fs-16 border-0"
									to=""
								>
									<i className="ri-twitter-fill" />
								</Link>
							</OverlayTrigger>
						</li>
						<li className="list-inline-item">
							<OverlayTrigger
								placement="top"
								overlay={<Tooltip>LinkedIn</Tooltip>}
							>
								<Link
									className="social-list-item bg-dark-subtle text-secondary fs-16 border-0"
									to="#"
								>
									<i className="ri-linkedin-box-fill" />
								</Link>
							</OverlayTrigger>
						</li>
						<li className="list-inline-item">
							<OverlayTrigger
								placement="top"
								overlay={<Tooltip>Skype</Tooltip>}
							>
								<Link
									className="social-list-item bg-dark-subtle text-secondary fs-16 border-0"
									to="#"
								>
									<i className="ri-skype-fill" />
								</Link>
							</OverlayTrigger>
						</li>
						<li className="list-inline-item">
							<OverlayTrigger
								placement="top"
								overlay={<Tooltip>Message</Tooltip>}
							>
								<Link
									className="social-list-item bg-dark-subtle text-secondary fs-16 border-0"
									to="#"
								>
									<i className="ri-mail-open-line" />
								</Link>
							</OverlayTrigger>
						</li>
					</ul>
				</Card.Body>
			</Card>
		</Col>
	)
}
const ContactList = () => {
	const items = []
	for (let number = 1; number <= 5; number++) {
		items.push(
			<Pagination.Item
				key={number}
				className={`${number === 2 ? 'active' : ''}`}
			>
				{number}
			</Pagination.Item>
		)
	}
	return (
		<>
			<PageBreadcrumb title="Contact List" subName="Pages" />
			<Row>
				<Col lg={8}>
					<Card>
						<Card.Body>
							<div className="input-group">
								<input
									type="text"
									id="example-input1-group2"
									name="example-input1-group2"
									className="form-control"
									placeholder="Search"
								/>
								<span className="input-group-append">
									<button
										type="button"
										className="btn btn-primary rounded-start-0"
									>
										<i className="ri-search-line fs-16"></i>
									</button>
								</span>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{(contactListChunks || []).map((chunk, idx) => {
				return (
					<Row key={idx}>
						{(chunk || []).map((item, idx) => {
							return (
								<ContactLists key={idx} avatar={item.avatar} name={item.name} />
							)
						})}
					</Row>
				)
			})}
			<div className="row">
				<div className="col-sm-12">
					<nav aria-label="Page navigation example">
						<Pagination className="pagination justify-content-end">
							<Pagination.Prev />
							{items}
							<Pagination.Next />
						</Pagination>
					</nav>
				</div>
			</div>
		</>
	)
}

export default ContactList
