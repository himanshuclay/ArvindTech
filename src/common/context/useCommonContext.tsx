import {
    ReactNode,
    createContext,
    useContext,
    useState,
} from 'react'

const CommonContext = createContext<any>({})


export function useCommonContext() {
    const context = useContext(CommonContext)
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider')
    }
    return context
}

export function CommonProvider({ children }: { children: ReactNode }) {

    const [unreadCount, setUnreadCount] = useState<number>(0)

    // Optional helper functions for better usage
    const incrementUnread = () => setUnreadCount(prev => prev + 1)
    const decrementUnread = () => setUnreadCount(prev => Math.max(prev - 1, 0))
    const resetUnread = () => setUnreadCount(0)

    return (
        <CommonContext.Provider
            value={{
                unreadCount,
                setUnreadCount,
                incrementUnread,
                decrementUnread,
                resetUnread,
            }}
        >
            {children}
        </CommonContext.Provider>
    )
}
