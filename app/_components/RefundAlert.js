import {useTransition} from "react";
import {refundBookingAction} from "@/app/_lib/actions";
import {useAsync} from "@/app/_lib/useAsync";

export default function RefundAlert({bookingId, onRefund, onCloseModal}) {
    const [pending, startTransition] = useTransition()
    async function handleRefund() {
        startTransition(() => onRefund(bookingId))
        onCloseModal()
        await refundBookingAction(bookingId)
    }

 return <div className={"flex flex-col gap-4"}>
     <h3 className={"text-xl"}>Confirm refund <span className={"text-accent-500 font-bold"}>Booking #{bookingId}</span></h3>
     <p className={"text-primary-200"}>Are you sure want to refund, this action will remove the booking out the reservation</p>
     <div className={"flex gap-2 justify-end"}>
         <button onClick={handleRefund} className={"px-4 py-3 border border-primary-800 hover:bg-accent-600 hover:text-primary-900 transition-colors"}>Refund</button>
         <button onClick={onCloseModal} className={"px-4 py-3 bg-red-700 hover:bg-red-800 transition-all"}>Cancel</button>
     </div>
 </div>
}
