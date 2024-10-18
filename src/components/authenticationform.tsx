// "use client"

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// type btnLabelType = {
//     btnLabel: string;
//     btnFunc: (email: string, password: string) => void;
//     showMsg: string;
//     loginSiguplink: string
//     linkName: string
// }

// export default function AuthForm({ btnLabel, btnFunc, showMsg, loginSiguplink, linkName }: btnLabelType) {



//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");


//     const router = useRouter();

//     const pushLink = () => {
//         router.push(linkName);
//     }



//     return (
//         <>
//             <div>
//                 <h1>{btnLabel}</h1>


//                 <input type="email" value={email} placeholder="Enter Email" onChange={(e) => { setEmail(e.target.value) }} />

//                 <br /><br />

//                 <input type="password" value={password} placeholder="Enter Password" onChange={(e) => { setPassword(e.target.value) }} />

//                 <br /><br />
//                 <p>{showMsg} have an account? <span onClick={pushLink}> {loginSiguplink} </span></p>
//                 <br />

//                 <button onClick={() => { btnFunc(email, password) }}>{btnLabel}</button>

//             </div>
//         </>
//     )
// }



// import { UserRole } from "@/types/user-role-type";
import { useState } from "react";

type SignupType = {
    signup?: boolean;
    func: (email: string, password: string, setError: (error: string) => void) => void;
};

export default function AuthForm({ signup, func }: SignupType) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        try {
            await func(email, password, setError);
        } catch (err) {
            console.error(err);
            setError("An error occurred. Please try again.");


            setTimeout(() => {
                setError("");
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card bg-base-100 w-full sm:w-80 md:w-96 p-4">
            <label className="input input-bordered flex items-center gap-2 mb-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                >
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                    type="text"
                    className="flex-grow"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                >
                    <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd"
                    />
                </svg>
                <input
                    type="password"
                    className="flex-grow"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
            </label>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
                className="btn btn-primary mb-4 w-full sm:w-auto"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? "Loading..." : (signup ? "Signup" : "Login")}
            </button>
        </div>
    );
}
