import App from './App'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'regenerator-runtime/runtime'

const container = document.getElementById('root')
if (container) {
	const root = createRoot(container)
	root.render(
		// <React.StrictMode>
		<BrowserRouter basename={''}>
			<App />
		</BrowserRouter>
		// </React.StrictMode>,
	)
}
