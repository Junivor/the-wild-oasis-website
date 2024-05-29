"use client"

import {useRouter, useSearchParams} from "next/navigation";

export default function ReservationFilter() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const activeFilter = searchParams.get("time") ?? "all"

    function handleFilter(filter) {
        const params = new URLSearchParams(searchParams)
        params.set("time", filter)
        router.replace(`?${params.toString()}`, {scroll: false})
    }

 return <div className="border border-primary-800 flex">
     <Button
         filter="all"
         handleFilter={handleFilter}
         activeFilter={activeFilter}
     >
         All renovations
     </Button>
     <Button
         filter="past"
         handleFilter={handleFilter}
         activeFilter={activeFilter}
     >
         Past renovations
     </Button>
     <Button
         filter="upcoming"
         handleFilter={handleFilter}
         activeFilter={activeFilter}
     >
         Upcoming renovations
     </Button>
 </div>
}

function Button({ filter, handleFilter, activeFilter, children }) {
    return (
        <button
            className={`px-5 py-2 hover:bg-primary-700 ${
                filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
            }`}
            onClick={() => handleFilter(filter)}
        >
            {children}
        </button>
    );
}
