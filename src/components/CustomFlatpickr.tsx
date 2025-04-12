import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_blue.css'

interface FlatpickrProps {
	className?: string;
  placeholder?: string;
  value?: Date | Date[]; // Flatpickr accepts single date or an array of dates
  onChange?: (dates: Date[]) => void; // Flatpickr returns an array of dates
  options?: any; // Flatpickr options; use 'any' or extend based on your needs
}

const CustomFlatpickr = ({
	className,
  placeholder,
  value,
  onChange,
  options,
}: FlatpickrProps) => {
	return (
		<>
			<Flatpickr
				className={className}
				placeholder={placeholder}
				value={value} // Ensure value is an array
				onChange={onChange} // Pass onChange handler
				options={options}
			/>
		</>
	)
}

export default CustomFlatpickr
