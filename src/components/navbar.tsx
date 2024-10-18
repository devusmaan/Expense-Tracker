"use client";

import { auth, signOutUser } from "@/firebase/firebaseauth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";





export default function Navbar() {


    const currentPath = usePathname();


      return (
        <>
            <div className="navbar bg-base-100">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">


                            {(currentPath === "/"  || currentPath === "/chart") && (
                                <li>
                                    <Link href="/addexpense">Add Expense</Link>
                                </li>
                            )}

                            
                            {(currentPath === "/addexpense" || currentPath === "/editexpense" || currentPath === "/chart") && (
                                <>
                                    <li>
                                        <Link href="/">See Your Expense</Link>
                                    </li>
                                    <li>
                                        <Link href="/">Back to Home</Link>
                                    </li>

                                </>
                            )}



                            {currentPath !== "/chart" && (
                                <li>
                                    <Link href="/chart">See Chart</Link>
                                </li>
                            )}


                        </ul>
                    </div>
                    <Link href={"/"} className="btn btn-ghost text-xl">Expense Tracker</Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {(currentPath === "/" || currentPath === "/chart") && (
                            <li>
                                <Link href="/addexpense">Add Expense</Link>
                            </li>
                        )}
                        {(currentPath === "/addexpense" || currentPath === `/editexpense` || currentPath === "/chart") && (
                            <>
                                <li>
                                    <Link href="/">See Your Expense</Link>
                                </li>
                                <li>
                                    <Link href="/">Back to Home</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
                <div className="navbar-end">
                    <button className="btn btn-outline w-30 rounded-2xl mr-3" onClick={() => signOutUser(auth)}>Log out</button>
                </div>
            </div>

        </>

    )
}

