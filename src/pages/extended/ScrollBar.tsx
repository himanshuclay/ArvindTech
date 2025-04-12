import { Card, Col, Row } from 'react-bootstrap'
import SimpleBar from 'simplebar-react'

// components
import { PageBreadcrumb } from '@/components'

const ScrollBar = () => {
	return (
		<>
			<PageBreadcrumb title="Scrollbar" subName="Extended UI" />
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Default Scroll</h4>
							<p className="text-muted mb-0">
								Just use data attribute <code>data-simplebar</code> and add{' '}
								<code>max-height: **px</code> oh fix height
							</p>
						</Card.Header>
						<Card.Body>
							<div>
								<SimpleBar style={{ maxHeight: 250 }}>
									SimpleBar does only one thing: replace the browser's default
									scrollbar with a custom CSS-styled one without losing
									performances. Unlike some popular plugins, SimpleBar doesn't
									mimic scroll with Javascript, causing janks and strange
									scrolling behaviours... You keep the awesomeness of native
									scrolling...with a custom scrollbar!
									<p>
										SimpleBar{' '}
										<strong>
											does NOT implement a custom scroll behaviour
										</strong>
										. It keeps the <strong>native</strong>{' '}
										<code>overflow: auto</code> scroll and <strong>only</strong>{' '}
										replace the scrollbar visual appearance.
									</p>
									<h5>Design it as you want</h5>
									<p>
										SimpleBar uses pure CSS to style the scrollbar. You can
										easily customize it as you want! Or even have multiple style
										on the same page...or just keep the default style ("Mac OS"
										scrollbar style).
									</p>
									<h5>Lightweight and performant</h5>
									<p>
										Only 6kb minified. SimpleBar doesn't use Javascript to
										handle scrolling. You keep the performances/behaviours of
										the native scroll.
									</p>
									<h5>Supported everywhere</h5>
									<p className="mb-0">
										SimpleBar has been tested on the following browsers: Chrome,
										Firefox, Safari, Edge, IE11.
									</p>
								</SimpleBar>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title">RTL Position</h4>
							<p className="text-muted mb-0">
								Just use data attribute{' '}
								<code>data-simplebar data-simplebar-direction='rtl'</code> and
								add <code>max-height: **px</code> oh fix height
							</p>
						</Card.Header>
						<Card.Body>
							<SimpleBar simplebar-direction="rtl" style={{ maxHeight: 250 }}>
								SimpleBar does only one thing: replace the browser's default
								scrollbar with a custom CSS-styled one without losing
								performances. Unlike some popular plugins, SimpleBar doesn't
								mimic scroll with Javascript, causing janks and strange
								scrolling behaviours... You keep the awesomeness of native
								scrolling...with a custom scrollbar!
								<p>
									SimpleBar{' '}
									<strong>does NOT implement a custom scroll behaviour</strong>.
									It keeps the <strong>native</strong>{' '}
									<code>overflow: auto</code> scroll and <strong>only</strong>{' '}
									replace the scrollbar visual appearance.
								</p>
								<h5>Design it as you want</h5>
								<p>
									SimpleBar uses pure CSS to style the scrollbar. You can easily
									customize it as you want! Or even have multiple style on the
									same page...or just keep the default style ("Mac OS" scrollbar
									style).
								</p>
								<h5>Lightweight and performant</h5>
								<p>
									Only 6kb minified. SimpleBar doesn't use Javascript to handle
									scrolling. You keep the performances/behaviours of the native
									scroll.
								</p>
								<h5>Supported everywhere</h5>
								<p className="mb-0">
									SimpleBar has been tested on the following browsers: Chrome,
									Firefox, Safari, Edge, IE11.
								</p>
							</SimpleBar>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Scroll Size</h4>
							<p className="text-muted mb-0">
								Just use data attribute <code>data-simplebar</code> and add{' '}
								<code>max-height: **px</code> oh fix height
							</p>
						</Card.Header>
						<Card.Body>
							<div>
								<SimpleBar data-simplebar-lg style={{ maxHeight: 250 }}>
									SimpleBar does only one thing: replace the browser's default
									scrollbar with a custom CSS-styled one without losing
									performances. Unlike some popular plugins, SimpleBar doesn't
									mimic scroll with Javascript, causing janks and strange
									scrolling behaviours... You keep the awesomeness of native
									scrolling...with a custom scrollbar!
									<p>
										SimpleBar{' '}
										<strong>
											does NOT implement a custom scroll behaviour
										</strong>
										. It keeps the <strong>native</strong>{' '}
										<code> overflow: auto</code> scroll and{' '}
										<strong>only</strong> replace the scrollbar visual
										appearance.
									</p>
									<h5>Design it as you want</h5>
									<p>
										SimpleBar uses pure CSS to style the scrollbar. You can
										easily customize it as you want! Or even have multiple style
										on the same page...or just keep the default style ("Mac OS"
										scrollbar style).
									</p>
									<h5>Lightweight and performant</h5>
									<p>
										Only 6kb minified. SimpleBar doesn't use Javascript to
										handle scrolling. You keep the performances/behaviours of
										the native scroll.
									</p>
									<h5>Supported everywhere</h5>
									<p className="mb-0">
										SimpleBar has been tested on the following browsers: Chrome,
										Firefox, Safari, Edge, IE11.
									</p>
								</SimpleBar>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Header>
							<h4 className="header-title">Scroll Color</h4>
							<p className="text-muted mb-0">
								Just use data attribute&nbsp;
								<code>data-simplebar data-simplebar-primary</code> and add{' '}
								<code>max-height: **px</code> oh fix height
							</p>
						</Card.Header>
						<Card.Body>
							<SimpleBar data-simplebar-primary style={{ maxHeight: 250 }}>
								SimpleBar does only one thing: replace the browser's default
								scrollbar with a custom CSS-styled one without losing
								performances. Unlike some popular plugins, SimpleBar doesn't
								mimic scroll with Javascript, causing janks and strange
								scrolling behaviours... You keep the awesomeness of native
								scrolling...with a custom scrollbar!
								<p>
									SimpleBar{' '}
									<strong>does NOT implement a custom scroll behaviour</strong>.
									It keeps the <strong>native</strong>{' '}
									<code>overflow: auto</code> scroll and <strong>only</strong>{' '}
									replace the scrollbar visual appearance.
								</p>
								<h5>Design it as you want</h5>
								<p>
									SimpleBar uses pure CSS to style the scrollbar. You can easily
									customize it as you want! Or even have multiple style on the
									same page...or just keep the default style ("Mac OS" scrollbar
									style).
								</p>
								<h5>Lightweight and performant</h5>
								<p>
									Only 6kb minified. SimpleBar doesn't use Javascript to handle
									scrolling. You keep the performances/behaviours of the native
									scroll.
								</p>
								<h5>Supported everywhere</h5>
								<p className="mb-0">
									SimpleBar has been tested on the following browsers: Chrome,
									Firefox, Safari, Edge, IE11.
								</p>
							</SimpleBar>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default ScrollBar
