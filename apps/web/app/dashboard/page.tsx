'use client'

import { TabsDashboard } from "@/components/TabsDashboard";
import { getMe } from "@/services/user.service"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@workspace/ui/components/navigation-menu";
import { Separator } from "@workspace/ui/components/separator";
import Link from "next/link";
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

                if (storedRole !== response.role.toString()) {
                    localStorage.removeItem("role");
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("tokenType");

                    throw new Error("Realize login para acessar a dashboard!")
                }

                setRole(storedRole);
            } catch (error) {
                router.push("/")
            }
        }

        checkAccess();
    }, [router])

    return (
        <>
            <header className="w-full overflow-x-hidden py-3 flex justify-center items-center">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuLink>Comandas</NavigationMenuLink>
                        <NavigationMenuLink>Funcionarios</NavigationMenuLink>
                        <NavigationMenuLink>Produtos</NavigationMenuLink>
                        <NavigationMenuLink>Estatisticas</NavigationMenuLink>
                    </NavigationMenuList>
                </NavigationMenu>
            </header>
            <Separator className="w-full" />
            <TabsDashboard />
        </>
    )
}
