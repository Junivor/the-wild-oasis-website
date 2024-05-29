"use client"
import {useFormStatus} from "react-dom";

export default function SubmitButton({ children, pendingLabel = "Updating...", type, styles }) {
    const {
        pending
    } = useFormStatus()


    if (type === "small") {
        return <button
            disabled={pending}
            className={"bg-accent-500 px-3 py-2 text-primary-800 w-[25%] -primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"}>
            {pending ? pendingLabel : children}
        </button>
    }

    return <button
        disabled={pending}
        className={`bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300 ${styles}`}>
        {pending ? pendingLabel : children}
    </button>
}