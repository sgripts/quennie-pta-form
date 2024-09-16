import {useState, useContext} from 'react';
import PocketBaseContext from "./PocketBaseContext.js";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";

export default function EntryForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { pb, gradeLevels } = useContext(PocketBaseContext);
    const { register, handleSubmit, reset } = useForm();

    const gradeSelectOptions = gradeLevels.map((item) =>{
        return <option key={item.id} value={item.id}>{item.Name}</option>
    });

    const getFirstListItemRecord = async (formData) => {
        return await pb.collection('Parents').getFirstListItem(`firstName="${formData.firstName}" && lastName="${formData.lastName}"`);
    }

    const doesParentExist = async (formData) => {
        try {
            await getFirstListItemRecord(formData);
            return true;
        } catch (err) {
            return false;
        }
    }

    const doesGradeExist = (record, gradeSelected) => {
        const index = record.GradeLevels.indexOf(gradeSelected);

        if (index > -1) {
            return true;
        } else {
            return false;
        }
    }

    const signOut = (e) => {
        e.preventDefault();
        pb.authStore.clear();
        navigate("/login");
    }

    const onSubmit = async (formData) => {
        setIsLoading(true);
        const recordExist = await doesParentExist(formData);

        if (recordExist) {
            const record = await getFirstListItemRecord(formData);

            if (doesGradeExist(record, formData.grade_level)) {
                alert('Parent and grade already exist!');
            } else {
                const updatedRow = await pb.collection('Parents').update(record.id, {
                    GradeLevels: [...record.GradeLevels, formData.grade_level],
                })
                alert('Parent record has been updated successfully!');
            }

        } else {
            const data = {
                "firstName": formData["firstName"],
                "lastName": formData["lastName"],
                "fourPs": formData["fourPs"],
                "GradeLevels": [
                    formData["grade_level"],
                ],
            }
            const recordCreated = await pb.collection('Parents').create(data);
            alert('Parent record has been created!');
        }

        reset();
        setIsLoading(false);
    }



    return (
        <div className="card card-compact bg-base-100 w-[480px] shadow-xl p-8 gap-4">
            <h2 className="font-bold text-center">Add Record</h2>
            <div className="form-container">
                <form onSubmit={handleSubmit(onSubmit)} method="post" className="flex flex-col gap-4 justify-stretch">
                    <input type="text" {...register("firstName")} placeholder="First Name"
                           className="input input-bordered w-full" required/>
                    <input type="text" {...register("lastName")} placeholder="Last Name"
                           className="input input-bordered w-full" required/>
                    <select {...register("grade_level")} className="select select-bordered w-full" required>
                        <option disabled>Select Grade:</option>
                        {gradeSelectOptions}
                    </select>
                    <div className="form-control">
                        <label className="label cursor-pointer flex flex-row gap-2 justify-start">
                            <span className="label-text">4Ps</span>
                            <input type="checkbox" {...register("fourPs")} className="toggle"/>
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary cursor-pointer bg-green-200"
                            disabled={isLoading}>{isLoading ?
                        <span className="loading loading-dots loading-xs"></span>
                        : "Submit"}</button>
                </form>
            </div>
            <button onClick={signOut} className="link link-error self-end mt-4">Sign out</button>
        </div>
    )
}