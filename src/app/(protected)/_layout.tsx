import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AppLayout() {
    const { isSignedIn } = useAuth()

    if (!isSignedIn) {
        return <Redirect href='/welcome' />
    }

    return (
        <Stack screenOptions={{headerShown: false,}}/>
    )
}