import { createContext, useEffect, useState } from 'react';
import { m } from '../lib/magic-links';

export const AuthContext = createContext();

export default function ContextProvider({ children }) {
    const [username, setUsername] = useState(null);
    console.log(username);
    useEffect(() => {
        let isMounted = true;

        async function getUsername() {
            try {
                const isLoggedIn = await m.user.isLoggedIn();
                const { email } = isLoggedIn && await m.user.getMetadata();
                isMounted && setUsername(email);
            } catch (err) {
                console.error('error while retreieving email address', err);
            }
        }
        getUsername();

        return () => {
            isMounted = false;
        };
    }, []);


    return <AuthContext.Provider value={{
        username
    }}>
        {children}
    </AuthContext.Provider>;
}