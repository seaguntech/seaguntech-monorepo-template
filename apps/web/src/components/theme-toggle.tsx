'use client';

import { useTheme } from '@/providers/theme-provider';
import { Button } from '@seaguntech/ui';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button onClick={toggleTheme} size="sm" type="button" variant="outline">
      {resolvedTheme === 'dark' ? 'Switch to light' : 'Switch to dark'}
    </Button>
  );
}
