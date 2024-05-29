"use client"
import SubmitButton from "@/app/_components/SubmitButton";
import React from "react";
import {getCouponAction, updateBookingStatusAction} from "@/app/_lib/actions";
import {useAsync} from "@/app/_lib/useAsync";

export default function PaymentForm({ booking, settings }) {
    const { isLoading, isError, data: cp, run, error } = useAsync()
    const [hasBreakfast, setHaveBreakfast] = React.useState(false)
    const {
        cabinPrice,
        numGuests,
        numNights,
        id: bookingId
    } = booking

    async function handleApply(e) {
        e.preventDefault()
        const { value } = e.target.elements.promotion
        await run(getCouponAction(value))
    }

    const totalPriceWithCoupon = cp ? Math.round(cabinPrice * (1 - (cp.percentage / 100))) : cabinPrice
    const totalPriceWithBreakfast = hasBreakfast ? numNights * numGuests * settings.breakfastPrice : 0
    const totalPrice = totalPriceWithBreakfast + totalPriceWithCoupon

    const updateData = {
        bookingId,
        totalPrice,
        hasBreakfast,
        extrasPrice: totalPriceWithBreakfast,
        coupon: cp?.coupon
    }


    const enhancedUpdateBookingStatusAction = updateBookingStatusAction.bind(null, updateData)

    return <div>
        <form action={enhancedUpdateBookingStatusAction}>
            <div className={"pb-2"}>
                <h3 className={"font-bold text-xl mb-2"}>Total: </h3>
                <p className={"font-bold text-5xl text-accent-400"}><span className={"text-3xl"}>$</span>{totalPrice}</p>
                {cp ? <React.Fragment>
                    <p className={"text-2xl font-semibold text-primary-200 line-through"}><span className={"text-sm"}>$</span>{hasBreakfast ? totalPriceWithBreakfast + cabinPrice : cabinPrice}</p>
                    <span className={"text-sm text-stone-200"}>{cp.percentage}% off</span>
                </React.Fragment> : null}
            </div>
            <SubmitButton styles={"w-[100%]"}>Submit</SubmitButton>
        </form>

        <div className={"mt-4 pb-2 pt-6 border-t border-primary-800 flex gap-2"}>
            <input type="checkbox" id={"breakfast"} className={"h-5 w-5 accent-accent-500"} value={hasBreakfast} onChange={() => setHaveBreakfast(!hasBreakfast)}/> {" "}
            <label htmlFor="breakfast" className={""}>Breakfast everyday including? (<span
                className={"text-accent-400 font-bold"}>${settings.breakfastPrice}</span> /
                Day)</label>
        </div>

        <form onSubmit={handleApply}>
            <div className={"mt-4 pt-2 border-t border-primary-800"}>
                <p className={"text-xl font-semibold mb-4"}>Promotions</p>
                {cp ?
                    <div
                        className={"mb-4 py-4 h-12 flex justify-between items-center border border-dashed border-primary-800"}>
                        <div className={"pl-2"}>
                            <p className={"text-sm"}><span
                                className={"text-xs font-bold"}>{cp.coupon}</span> is applied</p>
                            <p className={"text-xs"}>{cp.sponsor} coupon</p>
                        </div>
                    </div>
                    : null
                }
                <div>
                    <input type="text" id={"promotion"}
                           className={"w-[75%] px-3 py-2 bg-primary-200 text-primary-800"}
                           placeholder={"Enter Discount"}/>
                    <button
                        className={"bg-accent-500 px-3 py-2 text-primary-800 w-[25%] -primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"}
                        disabled={isLoading}>
                        Apply
                    </button>
                </div>
                {isError ? <p className={"text-red-500 mt-2"}>{error.message}</p> : null}
            </div>
        </form>

    </div>
}
