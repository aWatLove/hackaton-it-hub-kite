"use client";

import * as React from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { ThemeProvider, useTheme } from 'next-themes';

import { Button } from './button';

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(resolvedTheme === "light"? "dark" : "light");
  return (
      <Button className="" variant="ghost" size="icon" onClick={toggleTheme}>
        <SunIcon className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
  );
}

export { ThemeProvider, ThemeToggle };
