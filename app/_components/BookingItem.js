"use client"
import Image from "next/image";
import Link from "next/link";
import {format, isToday} from "date-fns";
import {formatDistanceFromNow} from "@/app/_components/ReservationCard";


export default function BookingItem({ cabin, booking }) {
    const {
        numNights,
        numGuests,
        startDate,
        endDate
    } = booking

    const {
        name,
        image,
        id,
        regularPrice
    } = cabin



 return <div>
     <Link href={`/cabins/${id}`} className={" flex border border-primary-800"}>
         <div className="relative h-32 aspect-square">
             <Image
                 src={image}
                 fill
                 className="object-cover"
                 alt={`Cabin ${name}`}
             />
         </div>

         <div className={"flex justify-between flex-col py-3 px-6"}>
             <h3 className={"text-xl font-semibold"}>{numNights} nights in Cabin {name}</h3>
             <p className={"text-lg text-primary-300"}>
                 {format(new Date(startDate), "EEE, LLL d y")} {" "}
                 (in {isToday(new Date(startDate)) ? "Today" : formatDistanceFromNow(startDate)}) &mdash; {" "}
                 {format(new Date(endDate), "EEE, LLL d y")}</p>
             <div className={"flex gap-4"}>
                 <p className={"text-xl font-semibold text-accent-400"}>${regularPrice}</p>
                 <p className="text-primary-300">&bull;</p>
                 <p className={"text-lg text-primary-300"}>{numGuests} guests</p>
             </div>
         </div>
     </Link>
 </div>
}
