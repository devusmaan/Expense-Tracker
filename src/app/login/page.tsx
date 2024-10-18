"use client";

import AuthForm from "@/components/authenticationform";
import { loginForm } from "@/firebase/firebaseauth";
import Link from "next/link";
import { useState } from "react";

export default function Login() {





    return (
        <>

            <div className="flex flex-col justify-center items-center mt-20">
                <AuthForm func={loginForm} />
                <div>
                    <p>
                        Does have not an account? <Link href={"/signup"}>Signup here.</Link>
                    </p>
                </div>
            </div>

        </>
    )

}