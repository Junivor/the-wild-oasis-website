"use client"
import { useOptimistic } from "react"
import ReservationCard from "@/app/_components/ReservationCard";
import {deleteBookingAction} from "@/app/_lib/actions";
import {useSearchParams} from "next/navigation";
import {isPast} from "date-fns";

export default function ReservationList({ bookings }) {
    const searchParams = useSearchParams()
    const filter = searchParams.get("time")
    const [
        optimisticBookings,
        optimisticDelete
    ] = useOptimistic(
        bookings,
        (currentBookings, bookingId) => {
            return currentBookings.filter(booking => booking.id !== bookingId)
        }
    )

    async function handleDelete(bookingId) {
        optimisticDelete(bookingId)
        await deleteBookingAction(bookingId)
    }


    let filteredOptBookings;
    switch (filter) {
        case "all": {
            filteredOptBookings = optimisticBookings
            break
        }
        case "past": {
            filteredOptBookings = optimisticBookings
                .filter(booking => isPast(new Date(booking.startDate)))
            break
        }
        case "upcoming": {
            filteredOptBookings = optimisticBookings
                .filter(booking => !isPast(new Date(booking.startDate)))
            break
        }
        default: filteredOptBookings = optimisticBookings
    }

 return <ul className="space-y-6">
     {filteredOptBookings.map((booking) => (
         <ReservationCard onDelete={handleDelete} booking={booking} key={booking.id}/>
     ))}
 </ul>
}
