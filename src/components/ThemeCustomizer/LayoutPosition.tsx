import { ThemeSettings } from '@/common/context'
import { ButtonGroup } from 'react-bootstrap'

type LayoutPositionProps = {
	handleChangeLayoutPosition: (value: string) => void
	layoutPosition?: string
	layoutConstants: typeof ThemeSettings.layout.menuPosition
}
const LayoutPosition = ({
	handleChangeLayoutPosition,
	layoutPosition,
	layoutConstants,
}: LayoutPositionProps) => {
	return (
		<div id="layout-position">
			<h5 className="my-3 fs-16 fw-bold">Layout Position</h5>

			<ButtonGroup className="radio" role="group">
				<input
					type="radio"
					className="btn-check"
					name="data-layout-position"
					id="layout-position-fixed"
					value={layoutConstants.fixed}
					onChange={(e) => handleChangeLayoutPosition(e.target.value)}
					checked={layoutPosition === layoutConstants.fixed}
				/>
				<label
					className="btn btn-soft-primary w-sm"
					htmlFor="layout-position-fixed"
				>
					Fixed
				</label>

				<input
					type="radio"
					className="btn-check"
					name="data-layout-position"
					id="layout-position-scrollable"
					value={layoutConstants.scrollable}
					onChange={(e) => handleChangeLayoutPosition(e.target.value)}
					checked={layoutPosition === layoutConstants.scrollable}
				/>
				<label
					className="btn btn-soft-primary w-sm ms-0"
					htmlFor="layout-position-scrollable"
				>
					Scrollable
				</label>
			</ButtonGroup>
		</div>
	)
}

export default LayoutPosition
