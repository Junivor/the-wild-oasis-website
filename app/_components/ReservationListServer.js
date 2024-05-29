import {auth} from "@/app/_lib/auth";
import {getBookings} from "@/app/_lib/data-service";
import ReservationList from "@/app/_components/ReservationList";
import React from "react";

export default async function ReservationListServer() {
    const session = await auth()
    const bookings = await getBookings(session.user.guestId)

    return <React.Fragment>
        {bookings.length === 0 ? (
            <p className="text-lg">
                You have no reservations yet. Check out our{" "}
                <a className="underline text-accent-500" href="/cabins">
                    luxury cabins &rarr;
                </a>
            </p>
        ) : (
            <ReservationList bookings={bookings}/>
        )}
    </React.Fragment>
}
