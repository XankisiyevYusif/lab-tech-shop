# Notes: my design log

**Live URL (Vercel):** https://lab-tech-shop-seven.vercel.app/

## 1. Route and storage choice

- **Route:** I created `/premium` (`app/premium/page.js`) because it aligns perfectly with the navbar's pre-configured target and maps clean semantic routing for a premium checkout experience.
- **Storage:** I stored the "this user is premium" flag in `localStorage` (`techcart_premium` and `techcart_premium_plan`).
- **Why?** `localStorage` persists data indefinitely across page refreshes, tab closures, and browser restarts. `sessionStorage` would have broken the experience by forgetting the user's premium status the moment they closed the tab. A cookie would work but is unnecessary since the application is fully client-managed and doesn't require backend server rendering verification for this mock shop.

## 2. Server vs Client Components

- **Files Touched & Types:**
  - `app/context/PremiumContext.js` — **Client**: Manages reactive state, uses context hooks, and interacts with browser `localStorage`.
  - `app/layout.js` — **Server**: Defines the main root document layout, processes metadata, and loads fonts. It remains a Server Component because wrapping child components in a Client Provider (`PremiumProvider`) doesn't force the layout itself to become client-side.
  - `app/components/Navbar.js` — **Client**: Accesses the user path via `usePathname` to highlight the active tab and consumes the `usePremium` hook to dynamically render the "Premium ✓" badge.
  - `app/components/AdBanner.js` — **Client**: Consumes the `usePremium` hook to dynamically unmount ads when premium status is active.
  - `app/premium/page.js` — **Client**: Handles form interactivity (controlled inputs), validation, visual state changes, and updates context state.
- **Forced to Client:** `Navbar`, `AdBanner`, and `/premium` were forced to be Client Components because they either use React hooks (`useState`, `useEffect`, `usePathname`, `useContext`) or need to access client-only browser APIs like `localStorage` and `window`.
- **Advantages of Server Components:** Keeping `layout.js` and `app/page.js` (homepage/product catalog) as Server Components optimizes performance. Next.js compiles them on the server, resulting in zero hydration overhead for product data fetching and layout rendering, faster Initial Page Loads (FCP), and optimal SEO indexing.

## 3. The first-render problem

- **Hydration Mismatch / Errors:** Attempting to read `localStorage` during the server-side render or initial client hydration results in:
  1. A crash on the server with `"window is not defined"` or `"localStorage is not defined"` since browser objects don't exist in the Node runtime.
  2. React hydration warnings/mismatches because the server renders the default UI (showing ads), but the client immediately renders the premium UI (hiding ads) if the local storage check runs synchronously during hydration.
- **The Fix:** I introduced a `hasMounted` state boolean in the context. On the server and during client-side hydration, `hasMounted` is `false`. Thus, both the server and client render the exact same default layout (showing ads). After hydration completes, `useEffect` runs, setting `hasMounted` to `true` and reading the `localStorage` key to trigger a clean client re-render.
- **Verification:** I checked the Google Chrome browser console, and there are absolutely no React hydration mismatch logs or warnings. When the page is loaded, it boots up matching the server state, then instantly hides the ads if the premium flag is set.

## 4. How the pieces connect

- When a user submits the premium checkout form, the app performs client-side field validation, starts a `1.5s` simulated payment processing delay, and triggers `buyPremium(plan)`. This call writes the premium flags to `localStorage` and updates the React Context's `isPremium` state. Because `Navbar` and `AdBanner` consume this context, they react instantly: the banner returns `null` (unmounts the ads) and the navbar transitions the button to a shiny "Premium ✓" badge, all without a page reload.

## 5. If I had another hour

- I would implement a mock server-side API endpoint `/api/premium` to securely issue and sign a session cookie. This would let us read the premium status on the server, avoiding the client-side layout shift (where ads flicker briefly before disappearing once mounted) and allowing for true Server Component ad-filtering. I would also add a dynamic confetti canvas animation when payment succeeds.
