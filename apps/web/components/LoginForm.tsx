"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { toast } from "sonner";

import { useState } from "react";
import { ApiError } from "@/services/api.service";
import { userLogin } from "@/services/auth.service";
import { redirectByRole } from "@/lib/redirectByRole";
import { useRouter } from "next/navigation";

export function LoginForm() {
    const [name, setname] = useState("");
    const [password, setPassword] = useState("");
    const [userError, setUserError] = useState(false);

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await userLogin({
                name,
                password,
            });
        } catch (error: unknown) {
            console.error("Erro no login:", error);

            if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
                const message = error.message || "Usuário ou senha inválidos";
                toast.error(message);
                setUserError(true)

                return;
            }

            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro inesperado");
            }
        }

        redirectByRole(router)
    };

    return (
        <Card className="w-full max-w-xl pt-5 pb-5 m-5">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">
                    Entrar
                </CardTitle>
                <CardDescription className="text-xs">
                    Acesse sua conta do RestaurantERP
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Field data-invalid={Boolean(userError)}>
                        <FieldLabel>Usuário</FieldLabel>
                        <Input
                            type="text"
                            placeholder="Digite seu usuário"
                            className="h-12 text-base"
                            value={name}
                            onChange={(event) => {
                                setname(event.target.value);
                                if (userError) setUserError(false);
                            }}
                            required
                        />
                    </Field>

                    <Field data-invalid={Boolean(userError)}>
                        <FieldLabel>Senha</FieldLabel>
                        <Input
                            type="password"
                            placeholder="Digite sua senha"
                            className="h-12 text-base"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);
                                if (userError) setUserError(false);
                            }}
                            required
                        />
                    </Field>

                    <Button
                        disabled={name.length == 0 || password.length == 0}
                        type="submit"
                        className="h-12 w-full text-lg font-black"
                    >
                        Entrar
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}