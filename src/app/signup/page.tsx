"use client"

import AuthForm from "@/components/authenticationform";
import { SignupForm } from "@/firebase/firebaseauth";
import Link from "next/link";


export default function SignUp() {



    return (
        <>


            <div className="flex flex-col justify-center items-center mt-20">
                <AuthForm signup={true} func={SignupForm} />
                <div>
                    <p>
                        Already have an account? <Link href={"/login"}>Login here.</Link>
                    </p>
                </div>
            </div>



        </>
    )
}