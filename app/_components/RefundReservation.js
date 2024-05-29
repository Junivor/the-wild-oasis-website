import {ReceiptRefundIcon} from "@heroicons/react/24/solid";

export default function RefundReservation() {
 return <button className={"flex grow gap-2 items-center uppercase text-xs font-bold px-3 text-primary-300 hover:bg-accent-600 transition-colors hover:text-primary-900"}>
     <div><ReceiptRefundIcon className={"h-5 w-5 text-primary-700"}/></div>
     <p className={"mt-1"}>Refund</p>
 </button>
 }
