import avatar2 from '@/assets/images/users/avatar-2.jpg'
import avatar3 from '@/assets/images/users/avatar-3.jpg'
import avatar5 from '@/assets/images/users/avatar-5.jpg'
import avatar6 from '@/assets/images/users/avatar-6.jpg'
import avatar7 from '@/assets/images/users/avatar-7.jpg'
import avatar8 from '@/assets/images/users/avatar-8.jpg'
import avatar9 from '@/assets/images/users/avatar-9.jpg'
import avatar10 from '@/assets/images/users/avatar-10.jpg'

interface ContactList {
	name: string
	avatar: string
}

export const contactList: ContactList[] = [
	{
		name: 'Jonathan Smith',
		avatar: avatar2,
	},
	{
		name: 'James Haley',
		avatar: avatar6,
	},
	{
		name: 'Fred Otero',
		avatar: avatar7,
	},
	{
		name: 'Danny Berry',
		avatar: avatar9,
	},
	{
		name: 'Jerry Johnson',
		avatar: avatar3,
	},
	{
		name: 'Mark Smith',
		avatar: avatar5,
	},
	{
		name: 'John McBryde',
		avatar: avatar8,
	},
	{
		name: 'Charles Burns',
		avatar: avatar10,
	},
]
