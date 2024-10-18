import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, Auth, User } from "firebase/auth";
import { app } from '@/firebase/firebaseconfig';
import { saveUser } from "./firebasefirestore";


export const auth = getAuth(app);

export function SignupForm(email: string, password: string, setError: (error: string) => void) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            const { uid, email } = userCredential.user;
            sendEmailVerification(auth.currentUser as User);
            // console.log(user, 'user created successfully.');


            saveUser({ email: email as string, uid });

            setError("");


        })
        .catch((error) => {
            setError("Email or Password is incorrect");


            setTimeout(() => {
                setError("");
            }, 3000);
        });
}


export function loginForm(email: string, password: string, setError: (error: string) => void) {

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // sendEmailVerification(auth.currentUser as User);
            // console.log(user);
            if (user.emailVerified) {

                // console.log('Email is verified. User can log in.')
            } else {
                setError("Email is not verified. Please check your email.")
            }
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // console.error(errorMessage, 'already login your account.');
            setError("Incorrect Email or Password")
        });
}


export function emailVerification() {

    const auth = getAuth(app);
    sendEmailVerification(auth.currentUser as User)
        .then((success) => {
            // Email verification sent!
            console.log(success, "Email verifcation send successfully")
            // ...
        });
}



export function signOutUser(auth: Auth) {
    signOut(auth).then(() => {
        console.log("Sign-out successful.");
    }).catch((error) => {
        console.log(" An error happened");
    });
}

