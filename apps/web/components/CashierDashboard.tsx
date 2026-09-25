"use client";

import { RegisterTabRequestDTO, TabResponseDTO } from "@/types/tab.types";

import { toast } from "sonner";

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

import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { formatCurrency } from "@/lib/formatter";
import { Field, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { OrderStatusEnum } from "@/types/order.types";
import { ProductResponseDTO } from "@/types/product.type";
import { getAllTabs, registerNewTab } from "@/services/tab.service";
import { ApiError } from "@/services/api.service";

export function CashierDashboard() {
    const [tabs, setTabs] = useState<TabResponseDTO[]>([]);
    const [isRegistering, setIsRegistering] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newTab, setNewTab] = useState<RegisterTabRequestDTO>({
        consumerName: "",
        consumerTelephone: "",
        tabNumber: 0,
    });

    const loadTabs = async () => {
        const tabs = await getAllTabs();
        setTabs(tabs ?? []);
    };

    const handleRegisterTab = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!newTab) {
            toast.error("Preencha todos os campos");
            return;
        }

        try {
            setIsRegistering(true);

            await registerNewTab(newTab);

            toast.success("Comanda registrada com sucesso");

            setDialogOpen(false);
            loadTabs()
        } catch (error: unknown) {
            console.error("Erro ao registrar comanda:", error);

            if (
                error instanceof ApiError &&
                error.status >= 400 &&
                error.status < 500
            ) {
                toast.error(error.message || "Erro ao registrar comanda");
                return;
            }

            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado");
            }
        } finally {
            setIsRegistering(false);
        }
    };

    useEffect(() => {
        const loadTabs = async () => {
            const tabs = await getAllTabs();
            setTabs(tabs ?? []);
        };

        loadTabs();
    }, []);

    return (
        <div className="w-screen h-screen flex bg-muted/30">
            <div className="w-screen h-full p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {tabs.length === 0 ? (
                        <h1 className="col-span-full w-full py-6 text-center">
                            Nenhuma comanda registrada
                        </h1>
                    ) : (
                        tabs.map((tab) => (
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
                                                        {Array.from(order.products).map(([product, amount]) => (
                                                            <div key={order.id + "|" + product.id} className="flex gap-3 ml-3">
                                                                <p className="text-muted-foreground">{amount}x</p>
                                                                <p>{product.name}</p>
                                                                <p className="text-green-300 ml-auto">{formatCurrency(product.price * amount)}</p>
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
                        ))
                    )}
                </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger
                    render={
                        <Button className="text-xl font-black p-6 absolute bottom-5 right-5">
                            NOVA COMANDA
                        </Button>
                    }
                />
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nova comanda</DialogTitle>
                        <DialogDescription>Registre uma nova comanda</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRegisterTab} className="space-y-4">
                        <Field>
                            <FieldLabel>Cliente</FieldLabel>
                            <Input
                                type="text"
                                placeholder="Digite o nome do cliente"
                                className="h-12 text-base"
                                value={newTab.consumerName}
                                onChange={(event) => {
                                    setNewTab({
                                        ...newTab,
                                        consumerName: event.target.value,
                                    } as RegisterTabRequestDTO);
                                }}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Telefone do cliente</FieldLabel>
                            <Input
                                type="tel"
                                placeholder="Digite o telefone do cliente"
                                className="h-12 text-base"
                                value={newTab.consumerTelephone}
                                onChange={(event) => {
                                    setNewTab({
                                        ...newTab,
                                        consumerTelephone: event.target.value,
                                    } as RegisterTabRequestDTO);
                                }}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Número de comanda</FieldLabel>
                            <Input
                                type="number"
                                placeholder="Digite o número da comanda"
                                className="h-12 text-base"
                                value={newTab.tabNumber}
                                onChange={(event) => {
                                    setNewTab({
                                        ...newTab,
                                        tabNumber: Number(event.target.value),
                                    } as RegisterTabRequestDTO);
                                }}
                                required
                            />
                        </Field>

                        <Button
                            className="w-full font-black text-lg p-6"
                            type="submit"
                            disabled={isRegistering}
                        >
                            {isRegistering ? (
                                <>
                                    <span className="animate-spin">⟳</span>
                                    Registrando...
                                </>
                            ) : (
                                "Registrar"
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}