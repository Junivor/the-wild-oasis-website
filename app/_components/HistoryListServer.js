import {getAllPurchaseHistory} from "@/app/_lib/data-service";
import HistoryListClient from "@/app/_components/HistoryListClient";

export default async function HistoryListServer() {
    const purchases = await getAllPurchaseHistory()
    return <HistoryListClient purchases={purchases}/>
}
