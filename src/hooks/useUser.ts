import { APICore } from '../common/api/apiCore'

export default function useUser() {
	const api = new APICore()

	const loggedInUser = api.getLoggedInUser()
	return [loggedInUser]
}
