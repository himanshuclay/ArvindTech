import { Route, Navigate, RouteProps } from 'react-router-dom'

// helpers
import { useAuthContext } from '@/common'

/**
 * Private Route forces the authorization before the route can be accessed
 * @param {*} param0
 * @returns
 */

const PrivateRoute = ({ component: Component, roles, ...rest }: any) => {
	const { isAuthenticated } = useAuthContext()
	return (
		<Route
			{...rest}
			render={(props: RouteProps) => {
				if (!isAuthenticated) {
					// not logged in so redirect to login page with the return url
					return (
						<Navigate
							to={{
								pathname: '/auth/login',
							}}
						/>
					)
				}

				// check if route is restricted by role
				if (isAuthenticated) {
					// role not authorised so redirect to login page
					return <Navigate to={{ pathname: '/' }} />
				}
				// authorised so return component
				return <Component {...props} />
			}}
		/>
	)
}

export default PrivateRoute
