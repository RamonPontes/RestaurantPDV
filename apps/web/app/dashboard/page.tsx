'use client'

import { CashierDashboard } from "@/components/CashierDashboard";
import { getMe } from "@/services/user.service"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter()

    useEffect(() => {
        const storedRole = localStorage.getItem("role");

        async function checkAccess() {

            try {
                const response = await getMe();
                console.log(response)
                if (storedRole !== response.role.toString()) {
                    localStorage.removeItem("role");
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("tokenType");

                    throw new Error("Realize login para acessar a dashboard!")
                }

                setRole(storedRole);
            } catch (error) {
                console.log(error)
                router.push("/")
            }
        }

        checkAccess();
    }, [router])

    return (
        <CashierDashboard />
    )
}
