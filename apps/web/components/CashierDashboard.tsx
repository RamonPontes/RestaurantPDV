"use client";

import { TabResponseDTO } from "@/types/tab.types";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";

import { Badge } from "@workspace/ui/components/badge";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@workspace/ui/components/sheet";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { formatCurrency } from "@/lib/formatter";
import { Field, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { OrderStatusEnum } from "@/types/order.types";

export function CashierDashboard() {
    const [tabs, setTabs] = useState<TabResponseDTO[]>(() => {
        const demoUser = {
            id: 1,
            name: "Caixa Principal",
            role: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const demoTabs: TabResponseDTO[] = [
            {
                id: 1,
                consumer: {
                    id: 1,
                    name: "João Silva",
                    telephone: "42999999999",
                },
                value: 89.90,
                created_at: Date.now() - 3600000,
                updated_at: Date.now() - 1800000,
                finished_at: 0,
                orders: [
                    {
                        id: 101,
                        user: demoUser,
                        products: [
                            { amount: 2, product: { id: 1, name: "X-Burger", price: 24.90 }, note: "Sem cebola" },
                            { amount: 1, product: { id: 2, name: "Batata frita", price: 12.00 }, note: "" },
                        ],
                        value: 61.80,
                        status: OrderStatusEnum.CREATED,
                        created_at: Date.now() - 3300000,
                        updated_at: Date.now() - 3300000,
                        finished_at: 0,
                    },
                    {
                        id: 102,
                        user: demoUser,
                        products: [
                            { amount: 2, product: { id: 1, name: "X-Burger", price: 24.90 }, note: "Sem cebola" },
                            { amount: 1, product: { id: 2, name: "Batata frita", price: 12.00 }, note: "" },
                        ],
                        value: 61.80,
                        status: OrderStatusEnum.CREATED,
                        created_at: Date.now() - 3300000,
                        updated_at: Date.now() - 3300000,
                        finished_at: 0,
                    },
                    {
                        id: 103,
                        user: demoUser,
                        products: [
                            { amount: 2, product: { id: 1, name: "X-Burger", price: 24.90 }, note: "Sem cebola" },
                            { amount: 1, product: { id: 2, name: "Batata frita", price: 12.00 }, note: "" },
                        ],
                        value: 61.80,
                        status: OrderStatusEnum.CREATED,
                        created_at: Date.now() - 3300000,
                        updated_at: Date.now() - 3300000,
                        finished_at: 0,
                    },
                    {
                        id: 104,
                        user: demoUser,
                        products: [
                            { amount: 2, product: { id: 1, name: "X-Burger", price: 24.90 }, note: "Sem cebola" },
                            { amount: 1, product: { id: 2, name: "Batata frita", price: 12.00 }, note: "" },
                        ],
                        value: 61.80,
                        status: OrderStatusEnum.CREATED,
                        created_at: Date.now() - 3300000,
                        updated_at: Date.now() - 3300000,
                        finished_at: 0,
                    },
                    {
                        id: 105,
                        user: demoUser,
                        products: [
                            { amount: 2, product: { id: 1, name: "X-Burger", price: 24.90 }, note: "Sem cebola" },
                            { amount: 1, product: { id: 2, name: "Batata frita", price: 12.00 }, note: "" },
                        ],
                        value: 61.80,
                        status: OrderStatusEnum.CREATED,
                        created_at: Date.now() - 3300000,
                        updated_at: Date.now() - 3300000,
                        finished_at: 0,
                    },
                    {
                        id: 106,
                        user: demoUser,
                        products: [
                            { amount: 2, product: { id: 1, name: "X-Burger", price: 24.90 }, note: "Sem cebola" },
                            { amount: 1, product: { id: 2, name: "Batata frita", price: 12.00 }, note: "" },
                        ],
                        value: 61.80,
                        status: OrderStatusEnum.CREATED,
                        created_at: Date.now() - 3300000,
                        updated_at: Date.now() - 3300000,
                        finished_at: 0,
                    }
                ],
            },
        ];

        return demoTabs;
    });

    return (
        <div className="w-screen h-screen flex bg-muted/30">
            <div className="w-screen h-full p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {tabs.map((tab) => (
                        <Sheet key={tab.id}>
                            <SheetTrigger>
                                <Card key={tab.id} className="overflow-hidden transition-shadow hover:shadow-md">
                                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Comanda</p>
                                            <CardTitle className="text-2xl font-bold">#{tab.id}</CardTitle>
                                        </div>

                                        <Badge variant={tab.finished_at ? "secondary" : "default"}>{tab.finished_at ? "Finalizada" : "Em aberto"}</Badge>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase">Cliente</p>
                                            <p className="font-semibold text-lg">{tab.consumer.name}</p>
                                            <p className="text-sm text-muted-foreground">{tab.consumer.telephone}</p>
                                        </div>
                                        <div className="flex items-end justify-between border-t pt-3">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Total da comanda</p>

                                                <p className="text-2xl font-bold text-green-600">
                                                    {formatCurrency(tab.value)}
                                                </p>
                                            </div>

                                            <p className="text-xs text-muted-foreground">
                                                {new Date(
                                                    tab.created_at
                                                ).toLocaleTimeString("pt-BR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </SheetTrigger>

                            <SheetContent>
                                <SheetHeader className="shrink-0">
                                    <SheetTitle className="text-lg">Comanda #{tab.id}</SheetTitle>
                                    <SheetDescription>
                                        Nome: {tab.consumer.name}
                                        <br />
                                        Telefone: {tab.consumer.telephone}
                                    </SheetDescription>
                                </SheetHeader>
                                <ScrollArea className="min-h-0 flex-1 px-1">
                                    {tab.orders?.map((order) => (
                                        <div key={order.id}>
                                            <Separator />
                                            <Card>
                                                <CardContent>
                                                    <div className="flex justify-between">
                                                        <p className="text-base">Pedido Nº{order.id}</p>
                                                        <Badge>{OrderStatusEnum[order.status]}</Badge>
                                                    </div>
                                                    {order.products?.map((product) => (
                                                        <div key={order.id + "|" + product.product.id} className="flex gap-3 ml-3">
                                                            <p className="text-muted-foreground">{product.amount}x</p>
                                                            <p>{product.product.name}</p>
                                                            <p className="text-green-300 ml-auto">{formatCurrency(product.product.price * product.amount)}</p>
                                                        </div>
                                                    ))}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </ScrollArea>
                                <SheetFooter className="shrink-0">
                                    <div className="flex justify-between text-xl font-black">
                                        <p>TOTAL: </p>
                                        <p className="text-green-400">{formatCurrency(3213.3)}</p>
                                    </div>
                                    <Button className="bg-blue-300 font-black p-5 text-lg">IMPRIMIR</Button>
                                    <Button className="bg-green-300 font-black p-5 text-lg">NOVO PEDIDO</Button>
                                    <Button variant="destructive" className="font-black p-5 text-lg">FECHAR COMANDA</Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    ))}
                </div>
            </div>
            <Dialog>
                <DialogTrigger>
                    <Button className="text-xl font-black p-6 absolute bottom-5 right-5">NOVA COMANDA</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nova comanda</DialogTitle>
                        <DialogDescription>Registre uma nova comanda</DialogDescription>
                    </DialogHeader>
                    <form action="" className="space-y-4">
                        <Field>
                            <FieldLabel>Cliente</FieldLabel>
                            <Input
                                type="text"
                                placeholder="Digite o nome do cliente"
                                className="h-12 text-base"
                                // value={name}
                                // onChange={(event) => {
                                //     setname(event.target.value);
                                //     if (userError) setUserError(false);
                                // }}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Telefone do cliente</FieldLabel>
                            <Input
                                type="text"
                                placeholder="Digite o telefone do cliente"
                                className="h-12 text-base"
                                // value={name}
                                // onChange={(event) => {
                                //     setname(event.target.value);
                                //     if (userError) setUserError(false);
                                // }}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Número de comanda</FieldLabel>
                            <Input
                                type="text"
                                placeholder="Digite o número da comanda"
                                className="h-12 text-base"
                                // value={name}
                                // onChange={(event) => {
                                //     setname(event.target.value);
                                //     if (userError) setUserError(false);
                                // }}
                                required
                            />
                        </Field>
                    </form>
                    <DialogFooter>
                        <Button className="w-full font-black text-lg p-6">Registrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}