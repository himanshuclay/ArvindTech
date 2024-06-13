import {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
} from 'react'
import { User } from '@/types'

const AuthContext = createContext<any>({})

export function useAuthContext() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuthContext must be used within an AuthProvider')
	}
	return context
}

const authSessionKey = '_VELONIC_AUTH'

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState(
		localStorage.getItem(authSessionKey)
			? JSON.parse(localStorage.getItem(authSessionKey) || '{}')
			: undefined
	)

	const saveSession = useCallback(
		(user: User) => {
			localStorage.setItem(authSessionKey, JSON.stringify(user))
			setUser(user)
		},
		[setUser]
	)

	const removeSession = useCallback(() => {
		localStorage.removeItem(authSessionKey)
		setUser(undefined)
	}, [setUser])

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: Boolean(user),
				saveSession,
				removeSession,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
