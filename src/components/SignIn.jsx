import {useContext, useState} from 'react';
import PocketBaseContext from "./PocketBaseContext.js";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";

export default function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthValid, setIsAuthValid] = useState();
    const { pb } = useContext(PocketBaseContext);
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const authData = await pb.admins.authWithPassword(data.userEmail, data.passWord);
            setIsAuthValid(true);

            navigate('/form');
        } catch (error) {
            console.log('error:', error);
        }

        console.log('isValid:', pb.authStore.isValid);

        setIsLoading(false);
        setIsAuthValid(pb.authStore.isValid);
    }
    return (
        <>
            <div className="card card-compact bg-base-100 w-96 shadow-xl p-8 gap-4">
                <h2 className="text-center font-bold">Login</h2>
                { isAuthValid == false ? <div role="alert" className="alert alert-error py-2 bg-error"><span className="text-xs">Invalid email or password!</span></div> : '' }
                <form method="post" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <input type="email" {...register("userEmail")} placeholder="Email"
                           className="input input-bordered input-sm w-full max-w-xs"/>
                    <input type="password" {...register("passWord")} placeholder="Password"
                           className="input input-bordered input-sm w-full max-w-xs"/>
                    <button type="submit" className="btn btn-primary cursor-pointer" disabled={isLoading}>{isLoading ?
                        <span className="loading loading-dots loading-xs"></span>
                        : "Login"}</button>
                </form>
            </div>
                        </>
                        )
                    }
