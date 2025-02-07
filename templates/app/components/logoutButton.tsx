'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

const LogoutButton = () => {
  const t = useTranslations('Auth');
  const handleClick = async () => {
    const currentUrl = window.location.pathname;

    await signOut({
      callbackUrl: currentUrl || '/auth/login',
    });
  };

  return (
    <Button className="mx-3" onClick={handleClick}>
      {t('logOut')}
    </Button>
  );
};
export default LogoutButton;
