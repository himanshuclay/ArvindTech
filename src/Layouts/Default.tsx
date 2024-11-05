import { useEffect, Suspense, ReactNode } from 'react'
import { useThemeContext } from '../common/context'

// utils
import { changeHTMLAttribute } from '../utils'

const loading = () => {
    console.log('fallback arrived')
    return <></>
}

interface DefaultLayoutProps {
    children?: ReactNode
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    const { settings } = useThemeContext()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            changeHTMLAttribute('data-bs-theme', settings.theme)
        }
    }, [settings.theme])

    return <Suspense fallback={loading()}>{children}</Suspense>
}

export default DefaultLayout
