'use client';

import { z } from 'zod';
import { loginSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { loginAction } from '@/actions/auth';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/themeToggle';
import LanguageSelector from '@/components/languageSelector';

const FormLogin = () => {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null);
    startTransition(async () => {
      const response = await loginAction(values);
      if (response.error) {
        setError(response.error);
      } else {
        router.push('/dashboard');
      }
    });
  }

  function handleRegister() {
    router.push('/auth/register');
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('Login.title')}</CardTitle>
          <CardDescription>{t('Login.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {error && <FormMessage className="mb-3">{error}</FormMessage>}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="on"
                        placeholder={t('emailPlaceholder')}
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
                    <FormLabel>{t('password')}</FormLabel>
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
                className="w-full mt-6"
                disabled={isPending}
              >
                {isPending ? t('signingIn') : t('signIn')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end">
          {/* <Button variant="link">{t('forgotPassword')}</Button> */}
          <Button className="p-0" variant="link" onClick={handleRegister}>
            {t('signUp')}
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

export default FormLogin;
