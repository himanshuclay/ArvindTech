import { useState } from 'react'
import { Dropdown } from 'react-bootstrap'

const SearchDropDown = () => {
	const [dropDownOpen, setDropDownOpen] = useState<boolean>(false)

	/**
	 * Toggle Profile DropDown
	 */
	const toggleDropDown = () => {
		setDropDownOpen(!dropDownOpen)
	}

	return (
		<Dropdown show={dropDownOpen} onToggle={toggleDropDown}>
			<Dropdown.Toggle
				as="a"
				className="nav-link dropdown-toggle arrow-none"
				role="button"
			>
				<i className="ri-search-line fs-22" />
			</Dropdown.Toggle>
			<Dropdown.Menu className="dropdown-menu-animated dropdown-lg p-0">
				<form className="p-3">
					<input
						type="search"
						className="form-control"
						placeholder="Search ..."
						aria-label="Recipient's username"
					/>
				</form>
			</Dropdown.Menu>
		</Dropdown>
	)
}

export default SearchDropDown
