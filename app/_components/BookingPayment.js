import {getBooking, getCabin, getSettings} from "@/app/_lib/data-service";
import Image from "next/image";
import PaymentForm from "@/app/_components/PaymentForm";
import BookingItem from "@/app/_components/BookingItem";

export default async function BookingPayment({ bookingId }) {
    const booking = await getBooking(bookingId)
    const cabin = await getCabin(booking.cabinId)
    const settings = await getSettings()

 return <div
     className={"grid grid-cols-[6fr_3fr] gap-20 py-3 px-10 mb-24"}>
     <BookingItem booking={booking} settings={settings} cabin={cabin}/>
     <PaymentForm booking={booking} settings={settings}/>
 </div>
}
