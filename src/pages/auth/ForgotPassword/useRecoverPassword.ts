import { useState } from 'react'
import { AxiosResponse } from 'axios'
import { User } from '@/types'
import { authApi } from '@/common'

export default function useForgotPassword() {
	const [loading, setLoading] = useState(false)

	/*
	 * handle form submission
	 */
	const onSubmit = async (data: any) => {
		console.log(data)
		const { email }: User = data
		setLoading(true)
		try {
			const response: AxiosResponse<User> = await authApi.forgetPassword(email)
			console.log(response)
		} finally {
			setLoading(false)
		}
	}

	return { loading, onSubmit }
}
