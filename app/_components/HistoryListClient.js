"use client"
import { useOptimistic } from "react"
import HistoryCard from "@/app/_components/HistoryCard";

export default function HistoryListClient({ purchases }) {
    const [optimisticPurchases, optimisticRefund] = useOptimistic(
        purchases,
        (current, mutated) => {
            return current.filter(item => item.id !== mutated)
        }
    )

    return optimisticPurchases.map(purchases => <HistoryCard key={purchases.id} purchase={purchases} onRefund={optimisticRefund}/>)
 }
