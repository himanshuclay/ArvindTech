import { HttpClient } from '../helpers'

function ProfileService() {
	return {
		profile: () => {
			return HttpClient.get('/profile')
		},
	}
}

export default ProfileService()
