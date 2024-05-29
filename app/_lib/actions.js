"use server";
import {auth, signIn, signOut} from "./auth";
import {
    createBooking,
    deleteBooking, deleteCoupon,
    getBookingBaseOnGuestId,
    getBookings,
    getCoupon,
    refundBooking,
    updateBooking,
    updateCoupon,
    updateGuest,
} from "@/app/_lib/data-service";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {differenceInDays, isPast} from "date-fns";

async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

async function updateGuestAction(formData) {
    const session = await auth()
    if (!session)
        throw new Error("Please log in again")
    const nationalID = formData.get("nationalID")
    const [nationality, countryFlag] = formData.get("nationality").split("%")

    if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
        throw new Error("Please provide a valid national ID")

    const updatedData = {
        nationalID,
        nationality,
        countryFlag
    }

    await updateGuest(session.user.guestId, updatedData)
    await revalidatePath("/account/profile")
}

async function createBookingAction(data, formData) {
    const session = await auth()
    if (!session)
        throw new Error("Please log in again")

    const newBooking = {
        numGuests: Number(formData.get("numGuests")),
        observations: formData.get("observations"),
        status: "unconfirmed",
        hasBreakfast: false,
        isPaid: false,
        extrasPrice: 0,
        totalPrice: data.cabinPrice,
        guestId: session.user.guestId,
        ...data
    }

    await createBooking(newBooking)
    await revalidatePath(`/cabins/${data.cabinId}`)
    redirect("/cabins/thankyou")
}

async function deleteBookingAction(bookingId) {
    const session = await auth()
    const guestBookings = await getBookings(session.user.guestId)
    if (!session)
        throw new Error("Please log in again")

    const guestBookingIds = guestBookings.map(booking => booking.id)
    if (!guestBookingIds.includes(bookingId))
        throw new Error("You are not allowed to do that")


    await deleteBooking(bookingId)
    await revalidatePath("/account/reservations")
}

async function updateBookingAction(formData) {
    const session = await auth()
    const guestBookings = await getBookings(session.user.guestId)
    const bookingId = Number(formData.get("bookingId"))
    const numGuests = Number(formData.get("numGuests"))
    const observations = formData.get("observations")

    if (!session)
        throw new Error("Please log in again")

    const guestBookingIds = guestBookings.map(booking => booking.id)
    if (!guestBookingIds.includes(bookingId))
        throw new Error("You are not allowed to do that")

    const updatedData = {
        numGuests,
        observations
    }


    await updateBooking(bookingId, updatedData)
    await revalidatePath(`/account/reservations`)
    await revalidatePath(`/account/reservations/edit/${bookingId}`)
    redirect("/account/reservations")
}

async function updateBookingStatusAction(updatedData) {
    const session = await auth()
    if (!session)
        throw new Error("Please log in again!")

    const { bookingId, coupon, ...rest } = updatedData
    const mutatedData = {
        isPaid: true,
        ...rest
    }

    if (coupon) {
        const { amount } = await getCoupon(coupon)
        const {id, amount: mutatedAmount } = await updateCoupon(coupon, {amount: amount - 1})
        if (mutatedAmount < 1) await deleteCoupon(id)
    }

    await updateBooking(bookingId, mutatedData)
    await revalidatePath(`/checkout/${bookingId}`)
    redirect("/account/reservations")

}

async function getCouponAction(couponName) {
    const session = await auth()
    if (!session)
        throw new Error("Please log in again")

    return await getCoupon(couponName)
}

async function refundBookingAction(bookingId) {
    const session = await auth()
    if (!session)
        throw new Error("Please log in again")

    const booking = await getBookingBaseOnGuestId(bookingId, session.user.guestId)
    const isAfterThreeDays = differenceInDays(booking.startDate, new Date()) <= -3
    const isAfterOneDay = differenceInDays(booking.startDate, new Date()) <= -1


    if (isAfterThreeDays)
        throw new Error(`It's been three days since you are not check-in, so we remove that booking and you won't have any refund`)

    if (booking.status === "checked-in" && isAfterOneDay)
        throw new Error("It's been one day since you are checked-in, so you can't refund")

    if (booking.status === "checked-out")
        throw new Error(`You has been checked-out, so no refund!`)

    await refundBooking(bookingId)
    revalidatePath("account/history")
}

export {
    signInAction,
    signOutAction,
    updateGuestAction,
    createBookingAction,
    updateBookingAction,
    deleteBookingAction,
    refundBookingAction,
    updateBookingStatusAction,
    getCouponAction
}