"use client";

import Link from "next/link";
import { z } from "zod";
import { uiRegisterSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LanguageSelector from "@/components/languageSelector";
import { useTranslations } from "next-intl";
import { registerAction } from "@/actions/auth";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/themeToggle";
/*import { warn } from "console";*/

const FormRegister = () => {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const schema = uiRegisterSchema(t);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setError(null);
    startTransition(async () => {
      const response = await registerAction(values);
      if (response.error) {
        setError(response.error);
      } else {
        router.push("/dashboard");
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("Register.title")}</CardTitle>
          <CardDescription>{t("Register.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {error && <FormMessage className="mb-3">{t(error)}</FormMessage>}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="on"
                        placeholder={t("namePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="on"
                        placeholder={t("emailPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("password")}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="password"
                        type="password"
                        placeholder="******"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isPending}
              >
                {isPending ? t("signingUp") : t("signUp")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="p-0" variant="link">
            <Link href="/">{t("gotoHomePage")}</Link>
          </Button>
          <Button className="p-0" variant="link">
            <Link href="/auth/login">{t("signIn")}</Link>
          </Button>
        </CardFooter>
      </Card>
      <div className="flex gap-2 absolute bottom-0 left-0 p-4">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default FormRegister;
