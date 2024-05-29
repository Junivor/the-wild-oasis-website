import React from "react";
import Spinner from "@/app/_components/Spinner";
import ReservationListServer from "@/app/_components/ReservationListServer";
import ReservationFilter from "@/app/_components/ReservationFilter";

export const metadata = {
  title: "Reservations",
};

export default function Page() {

  return (
    <div>
        <div className={"flex justify-between items-center mb-8"}>
            <h2 className="font-semibold text-2xl text-accent-400">
                Your reservations
            </h2>

            <ReservationFilter/>
        </div>

        <React.Suspense fallback={<Spinner/>}>
            <ReservationListServer/>
        </React.Suspense>
    </div>
  );
}
