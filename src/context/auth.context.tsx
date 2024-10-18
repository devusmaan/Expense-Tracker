"use client";

import { getAuth, onAuthStateChanged, sendSignInLinkToEmail } from "firebase/auth";
import { app } from "@/firebase/firebaseconfig";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";


type UserType = {
    email: string | null,
    uid: string;
    emailVerified: boolean
}

type userContextType = {
    user: UserType | null
}


const AuthContext = createContext<userContextType | null>(null);


export function AuthContextProvider({ children }: { children: ReactNode }) {


    const [user, setUser] = useState<UserType | null>(null);

    const router = useRouter();


    useEffect(() => {
        const auth = getAuth(app);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                // const uid = user.uid;

                // console.log(user, "inside");

                const { email, uid, emailVerified } = user;
                setUser({ email, uid, emailVerified });
                if(user.emailVerified) {
                    router.push("/")
                }
                else {
                    router.push("/emailverification")
                }
               
                // ...
            } else {
                // User is signed out
                setUser(null);
                router.push("/signup")

            }
        });

    }, [])

        


    return (


        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const AuthContextData = () => useContext(AuthContext)

