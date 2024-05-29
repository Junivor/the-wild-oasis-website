import React from "react";
import Spinner from "@/app/_components/Spinner";
import BookingPayment from "@/app/_components/BookingPayment";

export default async function Page({ params }) {
    const { bookingId } = params


 return <div className="max-w-6xl mx-auto mt-8">
     <h1 className="text-4xl mb-5 text-accent-400 font-medium">
         Finishing up for #{bookingId} booking
     </h1>
     <React.Suspense fallback={<Spinner/>}>
         <BookingPayment bookingId={bookingId}/>
     </React.Suspense>
 </div>
}
