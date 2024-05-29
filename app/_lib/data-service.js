import { notFound } from "next/navigation";
import {eachDayOfInterval, format} from "date-fns";
import { supabase } from "./supabase";
import {auth} from "@/app/_lib/auth";

/////////////
// GET

export async function getCabin(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  // For testing
  // await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export async function getCabinPrice(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function () {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  // For testing
  // await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

// Guests are uniquely identified by their email address
export async function getGuest(email) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(id) {
  const { data, error, count } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

    await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookingBaseOnGuestId(id, guestId) {
    const { data, error, count } = await supabase
        .from("bookings")
        .select("*")
        .eq("guestId", guestId)
        .eq("id", id)
        .single();

    await new Promise((res) => setTimeout(res, 2000));

    if (error) {
        console.error(error);
        throw new Error("Booking could not get loaded");
    }

    return data;
}

export async function getBookings(guestId) {
  const { data, error, count } = await supabase
    .from("bookings")
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      "id, created_at, startDate, endDate, isPaid, numNights, numGuests, totalPrice, guestId, cabinId, cabins(id, name, image)"
    )
    .eq("guestId", guestId)
    .eq("isPaid", false)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getBookedDatesByCabinId(cabinId) {
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  today = today.toISOString();

  // Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${today},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  // await new Promise((res) => setTimeout(res, 5000));

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

export async function getCoupon(couponName) {
    const { data, error } = await supabase
        .from("coupons")
        .select("coupon, sponsor, percentage, amount")
        .eq("coupon", couponName)
        .single()


    if (data.amount < 1)
        throw new Error("We are out stocks this coupon, please wait for new coupons arrive!")

    if (error) {
        throw new Error("Please provide a valid coupon");
    }

    return data;
}

export async function getAllPurchaseHistory() {
    const session = await auth()
    if (!session)
        throw new Error("Please log in again")

    /*console.log(differenceInDays(
        new Date(2024, 4, 27),
        new Date(Date.now())
    ))*/

    const currentDay = format(new Date(), "yyyy-MM-d hh:mm")

    const { data, error } = await supabase
        .from("bookings")
        .select("*, cabins(name, image)")
        .eq("guestId", session.user.guestId)
        .eq("isPaid", true)

    if (error)
        throw new Error("Could not fetch purchase history")

    return data
}

/////////////
// CREATE

export async function createGuest(newGuest) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function createBooking(newBooking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id, updatedFields) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(id, updatedFields) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function updateCoupon(cpName, updatedFields) {
    const { data, error } = await supabase
        .from("coupons")
        .update(updatedFields)
        .eq("coupon", cpName)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error("Coupon could not be updated");
    }

    return data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  return data;
}

export async function refundBooking(id) {
    const { data, error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id)
        .eq("isPaid", true)
        .or("status.eq.checked-in, status.eq.unconfirmed")

    if (error) {
        console.error(error);
        throw new Error("Booking could not be refunded");
    }

    return data
}

export async function deleteCoupon(couponId) {
    const { data, error } = await supabase
        .from("coupons")
        .delete()
        .eq("id", couponId)

    if (error) {
        console.log(error)
        throw new Error("Coupon could not be deleted")
    }

    return data
}