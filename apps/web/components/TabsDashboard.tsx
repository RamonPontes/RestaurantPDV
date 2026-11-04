"use client";

import { PaymentMethods, RegisterTabRequestDTO, TabResponseDTO, FinishTabRequestDTO } from "@/types/tab.types";

import { toast } from "sonner";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"

import {
    Dialog,
    DialogContent,
    DialogDescription,
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
    SheetClose,
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
import { formatCurrency, formatTelephone } from "@/lib/formatter";
import { Field, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { OrderStatusEnum } from "@/types/order.types";
import { finishTab, getAllTabs, registerNewTab } from "@/services/tab.service";
import { ApiError } from "@/services/api.service";
import { Lock, LockOpen } from "@phosphor-icons/react";
import { Checkbox } from "@workspace/ui/components/checkbox";

export function TabsDashboard() {
    const [tabs, setTabs] = useState<TabResponseDTO[]>([]);
    const [isRegistering, setIsRegistering] = useState(false);
    const [dialogOpenNewTab, setdialogOpenNewTab] = useState(false);
    const [newTab, setNewTab] = useState<RegisterTabRequestDTO>({
        consumerName: "",
        consumerTelephone: "",
        tabNumber: 0,
    });
    const [serviceChargeByTab, setServiceChargeByTab] = useState<Record<number, boolean>>({});
    const [paymentMethodByTab, setPaymentMethodByTab] = useState<Record<number, PaymentMethods>>({});
    const [selectTab, setSelectTab] = useState<TabResponseDTO>()

    const loadTabs = async () => {
        const tabs = await getAllTabs();

        tabs.sort((a, b) => {
            const aIsFinished = a.finishedAt != null;
            const bIsFinished = b.finishedAt != null;

            if (aIsFinished !== bIsFinished) {
                return aIsFinished ? 1 : -1;
            }

            return b.createdAt - a.createdAt || b.id - a.id;
        });


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

            setdialogOpenNewTab(false);
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

    const handleFinishTab = async () => {
        if (selectTab) {
            try {
                const data: FinishTabRequestDTO = {
                    serviceCharge: serviceChargeByTab[selectTab.id] ?? true,
                    paymentMethod: paymentMethodByTab[selectTab.id] ?? PaymentMethods.PIX,
                };

                await finishTab(selectTab.id, data)
                toast.success("Comanda finalizada com sucesso")
            }
            catch {
                toast.error("Erro ao finalizar comanda")
            } finally {
                setSelectTab(undefined)
                loadTabs()
            }
        }
    }

    useEffect(() => {
        loadTabs();

    }, []);

    return (
        <div className="w-full min-w-0 h-full overflow-x-hidden">
            <div className="w-full min-w-0 h-full p-6 overflow-x-hidden overflow-y-auto">
                <div className="grid min-w-0 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
                    {tabs.length === 0 ? (
                        <h1 className="col-span-full w-full py-6 text-center">
                            Nenhuma comanda registrada
                        </h1>
                    ) : (
                        tabs.map((tab) => (
                            <Sheet
                                key={tab.id}
                                open={selectTab?.id === tab.id}
                                onOpenChange={(open) => {
                                    setSelectTab(open ? tab : undefined);
                                }}
                            >
                                <SheetTrigger className="h-full w-full min-w-0 text-left">
                                    <Card key={tab.id} className={`h-full overflow-hidden transition-shadow hover:shadow-md ${tab.finishedAt != null ? "opacity-40" : ""}`}>
                                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Comanda</p>
                                                <CardTitle className="text-2xl font-bold">#{tab.id}</CardTitle>
                                            </div>

                                            <Badge variant={tab.finishedAt ? "secondary" : "default"}>{tab.finishedAt ? "Finalizada" : "Em aberto"}</Badge>
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
                                            </div>
                                        </CardContent>
                                    </Card>
                                </SheetTrigger>

                                <SheetContent className="overflow-x-hidden">
                                    <SheetHeader className="shrink-0">
                                        <SheetTitle className="text-lg">Comanda #{tab.id}</SheetTitle>
                                        <SheetDescription>
                                            Nome: {tab.consumer.name}
                                            <br />
                                            Telefone: {tab.consumer.telephone}
                                        </SheetDescription>
                                        <div className="flex border-y justify-between py-3 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <LockOpen size={18} />
                                                <div>
                                                    <p className="text-xs">Abertura</p>
                                                    <p className="font-medium text-foreground">
                                                        {new Date(tab.createdAt).toLocaleTimeString("pt-BR", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            {tab.finishedAt && (
                                                <div className="flex items-center gap-2">
                                                    <Lock size={18} />
                                                    <div>
                                                        <p className="text-xs">Fechamento</p>
                                                        <p className="font-medium text-foreground">
                                                            {new Date(tab.finishedAt).toLocaleTimeString("pt-BR", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </SheetHeader>
                                    <ScrollArea className="min-h-0 flex-1 overflow-x-hidden px-1">
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
                                                            <div key={order.id + "|" + product.id} className="flex min-w-0 gap-3 ml-3">
                                                                <p className="text-muted-foreground">{amount}x</p>
                                                                <p className="min-w-0">{product.name}</p>
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
                                            <p className="text-green-400">{formatCurrency(tab.value)}</p>
                                        </div>
                                        <Button className="bg-blue-300 font-black p-5 text-lg">IMPRIMIR</Button>
                                        {!tab.finishedAt && (
                                            <>
                                                <Button className="bg-green-300 font-black p-5 text-lg">NOVO PEDIDO</Button>
                                                <Dialog>
                                                    <DialogTrigger render={
                                                        <Button variant="destructive" className="font-black p-5 text-lg">FECHAR COMANDA</Button>
                                                    } />
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>FECHAR COMANDA #{tab.id}</DialogTitle>
                                                        </DialogHeader>
                                                        <form className="space-y-4">
                                                            <Field>
                                                                <FieldLabel>Selecione a forma de pagamento</FieldLabel>
                                                                <Select
                                                                    value={PaymentMethods[paymentMethodByTab[tab.id] ?? PaymentMethods.PIX]}
                                                                    onValueChange={(value) => {
                                                                        if (value === null) {
                                                                            return;
                                                                        }

                                                                        setPaymentMethodByTab((current) => ({
                                                                            ...current,
                                                                            [tab.id]: PaymentMethods[value as keyof typeof PaymentMethods] as PaymentMethods,
                                                                        }));
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="py-6">
                                                                        <SelectValue placeholder="Forma de pagamento" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            {Object.keys(PaymentMethods)
                                                                                .filter((method) => Number.isNaN(Number(method)))
                                                                                .map((method) => (
                                                                                <SelectItem
                                                                                    key={method}
                                                                                    value={method}
                                                                                >
                                                                                    {method}
                                                                                </SelectItem>
                                                                            ))}

                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            </Field>

                                                            <Field orientation="horizontal">
                                                                <Checkbox
                                                                    checked={serviceChargeByTab[tab.id] ?? true}
                                                                    onCheckedChange={(checked) => {
                                                                        setServiceChargeByTab((current) => ({
                                                                            ...current,
                                                                            [tab.id]: checked,
                                                                        }));
                                                                    }}
                                                                />
                                                                <FieldLabel>Taxa de 10% de serviço</FieldLabel>
                                                            </Field>
                                                            <Separator />
                                                            <div className="space-y-0.5">
                                                                <p>Subtotal: {formatCurrency(tab.value)}</p>
                                                                <p>Taxa de serviço: {formatCurrency(tab.value * 0.10)}</p>
                                                                <p className="text-xl font-black text-green-400">
                                                                    Total: {formatCurrency(
                                                                        tab.value +
                                                                        (serviceChargeByTab[tab.id] ?? true
                                                                            ? tab.value * 0.10
                                                                            : 0)
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <Button type="button" className="text-lg font-black p-6 w-full" onClick={handleFinishTab}>FECHAR</Button>
                                                        </form>
                                                    </DialogContent>
                                                </Dialog>
                                            </>
                                        )}
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        ))
                    )}
                </div>
            </div>
            <Dialog open={dialogOpenNewTab} onOpenChange={setdialogOpenNewTab}>
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
                                        consumerTelephone: formatTelephone(event.target.value),
                                    } as RegisterTabRequestDTO);
                                }}
                                required
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