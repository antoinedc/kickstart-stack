
### Dark Mode

- Uses `next-themes` with class-based dark mode
- `ThemeProvider` wraps app content in `AppLayoutClient.tsx`
- CSS variables defined in `globals.css` for both light/dark themes
- Use `dark:` Tailwind prefix for dark-specific styles
- `suppressHydrationWarning` on `<html>` tag prevents flash
- Theme persisted in localStorage by next-themes
