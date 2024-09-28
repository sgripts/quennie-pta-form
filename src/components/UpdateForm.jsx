import { useForm } from "react-hook-form";
import {useContext, useEffect, useState} from "react";
import PocketBaseContext from "./PocketBaseContext.js";

const UpdateForm = ({ data }) => {
    const { register, handleSubmit, reset } = useForm({
        recordId: "",
        firstName: "",
        lastName: "",
        grade_level: [],
        fourPs: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { pb } = useContext(PocketBaseContext);

    let gradeLevelCheckboxes;

    const onSubmit = async (value) => {
        setIsLoading(true);
        console.log(value);

        const record = await pb.collection('Parents').update(value.recordId, {
           "firstName": value.firstName,
           "lastName": value.lastName,
           "fourPs": value.fourPs,
            "GradeLevels": [...value.grade_level],
        });
        console.log('record updated!', record);

        alert('Parent record has been updated!');

        window.location.reload();
        setIsLoading(false);
    }

    const closeModal = () => {
        updateRecordFormModal.close()
    }

    useEffect(() => {
        if (data) {
            reset({
                recordId: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                fourPs: data.fourPs || false
            });
        }
    }, [reset, data]);

    if (data && data.hasOwnProperty("expand")) {
        gradeLevelCheckboxes = data.expand.GradeLevels.map((gradeLevel, index) => {
            return (
                <div key={index} className="form-control flex flex-row justify-start">
                    <label className="label cursor-pointer flex flex-row gap-1 justify-start">
                        <input type="checkbox" {...register("grade_level")} defaultChecked={true} value={gradeLevel.id} className="checkbox checkbox-xs">
                        </input>
                        <span className="label-text">{gradeLevel.Name}</span>
                    </label>
                </div>
            );
        });
    }

    return(
        <dialog id="updateRecordFormModal" className="modal">
            <div className="modal-box">
                <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <h3 className="font-bold text-center pb-4">Update Record</h3>
                <div className="form-container">
                    <form onSubmit={handleSubmit(onSubmit)} method="post"
                          className="flex flex-col gap-4 justify-stretch">
                        <input type="hidden" {...register("recordId")} />
                        <input type="text" {...register("firstName")} className="input input-bordered w-full" required />
                        <input type="text" {...register("lastName")} className="input input-bordered w-full" required />
                        <fieldset className="flex flex-row gap-2 justify-start">
                            <legend>Current Grade Levels</legend>
                            {gradeLevelCheckboxes && gradeLevelCheckboxes}
                        </fieldset>
                        <div className="form-control">
                            <label className="label cursor-pointer flex flex-row gap-2 justify-start">
                                <span className="label-text">4Ps</span>
                                <input type="checkbox" {...register("fourPs")} className="toggle" />
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary cursor-pointer bg-green-200"
                                disabled={isLoading}>{isLoading ?
                            <span className="loading loading-dots loading-xs"></span>
                            : "Submit"}</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}

export default UpdateForm;