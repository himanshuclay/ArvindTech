import { Card, Col, Row } from 'react-bootstrap'
import ReactQuill from 'react-quill'

// components
import { PageBreadcrumb } from '@/components'

// styles
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'

const Editors = () => {
	let valueBubble = ''
	let valueSnow = ''
	valueSnow =
		valueBubble = `<h3><span class="ql-size-large">Hello World!</span></h3>
  <p><br/></p>
  <h3>This is an simple editable area.</h3>
  <p><br/></p>
  <ul>
    <li>Select a text to reveal the toolbar.</li>
    <li>Edit rich document on-the-fly, so elastic!</li>
  </ul>
  <p><br/></p>
  <p>End of simple area</p>`

	const modules = {
		toolbar: [
			[{ font: [] }, { size: [] }],
			['bold', 'italic', 'underline', 'strike'],
			[{ color: [] }, { background: [] }],
			[{ script: 'super' }, { script: 'sub' }],
			[{ header: [false, 1, 2, 3, 4, 5, 6] }, 'blockquote', 'code-block'],
			[
				{ list: 'ordered' },
				{ list: 'bullet' },
				{ indent: '-1' },
				{ indent: '+1' },
			],
			['direction', { align: [] }],
			['link', 'image', 'video'],
			['clean'],
		],
	}
	return (
		<>
			<PageBreadcrumb title="Editors" subName="Forms" />
			<Row>
				<Col xs={12}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Quill Editor</h4>
							<p className="text-muted mb-0">
								Snow is a clean, flat toolbar theme.
							</p>
						</Card.Header>
						<ul className="list-group list-group-flush">
							<li className="list-group-item">
								<div className="mb-2">
									<ReactQuill
										modules={modules}
										defaultValue={valueSnow}
										theme="snow"
										style={{ height: 340 }}
										className="pb-4"
									/>
								</div>
							</li>
						</ul>
					</Card>

					<Card>
						<div className="card-header">
							<h5 className="mb-1">Bubble Editor</h5>
							<p className="text-muted mb-0">
								Bubble is a simple tooltip based theme.
							</p>
						</div>
						<ul className="list-group list-group-flush">
							<li className="list-group-item">
								<div className="mb-2">
									<ReactQuill
										defaultValue={valueBubble}
										theme="bubble"
										style={{ height: 300 }}
										className="pb-1"
									/>
								</div>
							</li>
						</ul>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default Editors
