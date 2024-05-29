import React from "react";
import Spinner from "@/app/_components/Spinner";
import HistoryListServer from "@/app/_components/HistoryListServer";

export const metadata = {
    title: "Purchase History",
};

export default function Page() {
 return <div>
     <h2 className="font-semibold text-2xl text-accent-400 mb-7">
         Purchase history
     </h2>
     <p className="text-lg mb-8 text-primary-200">
         You can request a refund if you have not checked into our cabin after 3 days, if after 3 days or you have checked-in after 1 day, you will not be refunded
     </p>

     <React.Suspense fallback={<Spinner/>}>
         <HistoryListServer/>
     </React.Suspense>
 </div>
}
