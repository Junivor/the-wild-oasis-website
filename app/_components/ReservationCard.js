import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { format, formatDistance, isPast, isToday, parseISO } from "date-fns";
import DeleteReservation from "./DeleteReservation";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace("about ", "");

function ReservationCard({ booking, onDelete }) {
  const {
    id: bookingId,
    guestId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    created_at,
      isPaid,
    cabins: { id: cabinId, name, image },
  } = booking;
  const isFromPast = isPast(new Date(startDate))

  return (
    <div className="flex border border-primary-800">
      <div className="relative h-32 aspect-square">
        <Image
            fill
          src={image}
          alt={`Cabin ${name}`}
          className="object-cover border-r border-primary-800"
        />
      </div>

      <div className="flex-grow px-6 py-3 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {numNights} nights in Cabin {name}
          </h3>
              <div className={"flex justify-between gap-4"}>
                  {isFromPast ? (
                      <span className="bg-yellow-800 text-yellow-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              past
            </span>
                  ) : (
                      <span className="bg-green-800 text-green-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              upcoming
            </span>
                  )}
                  {isPaid ?
                      <span
                          className="bg-green-800 text-green-100 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
                    Already paid
                </span>
                      : <span
                          className="bg-gray-800 text-gray-100 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
                    Not paying yet
                </span>
                  }
              </div>
        </div>

          <div className={"flex justify-between items-center mt-2"}>
              <p className="text-lg text-primary-300">
                  {format(new Date(startDate), "EEE, MMM dd yyyy")} (
                  {isToday(new Date(startDate))
                      ? "Today"
                      : formatDistanceFromNow(startDate)}
                  ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
              </p>

              {!isPaid
                  ? <Link href={`/checkout/${bookingId}`} className={"text-accent-400 ml-auto hover:underline hover:decoration-accent-400"}>Finish up your payment &rarr;</Link>
                  : null
              }
          </div>

          <div className="flex gap-5 mt-auto items-baseline">
              <p className="text-xl font-semibold text-accent-400">${totalPrice}</p>
              <p className="text-primary-300">&bull;</p>
              <p className="text-lg text-primary-300">
                  {numGuests} guest{numGuests > 1 && "s"}
              </p>
          <p className="ml-auto text-sm text-primary-400">
            Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}
          </p>
        </div>
      </div>

      <div className="flex flex-col border-l border-primary-800 w-[100px]">
          {!isFromPast ?
              <React.Fragment>
                  <Link
                      href={`/account/reservations/edit/${bookingId}`}
                      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 border-b border-primary-800 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
                  >
                      <PencilSquareIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
                      <span className="mt-1">Edit</span>
                  </Link>
                  <DeleteReservation onDelete={onDelete} bookingId={bookingId} />
              </React.Fragment>
              : null
          }
      </div>
    </div>
  );
}

export default ReservationCard;
