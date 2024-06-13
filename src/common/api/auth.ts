import { HttpClient } from '../helpers'

function AuthService() {
	return {
		login: (values: any) => {
			return HttpClient.post('/login', values)
		},
		logout() {
			return HttpClient.post('/logout', {})
		},
		register: (values: any) => {
			return HttpClient.post('/register', values)
		},
		forgetPassword: (values: any) => {
			return HttpClient.post('/forget-password', values)
		},
	}
}

export default AuthService()
