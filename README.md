# expo-router `dismissTo` pops to a dynamic route with other params and overwrites them

One root `Stack` with `index`, `[id]` and `modal`.
From `/`: `router.push('/1')`, `router.push('/modal')`, `router.dismissTo('/2')`.

`/2` is not in the history, so `dismissTo` should replace `modal` with `/2`, and `router.back()` should go to `/1`.
Instead it pops to the `/1` screen and overwrites its params with `{ id: '2' }`. `/1` is gone, and `router.back()` goes to `/`.

## Run

```sh
pnpm install
pnpm exec playwright install chromium
pnpm test     # expo export -p web, then Playwright presses the buttons and reads the address bar
```

expo 58.0.23, expo-router 58.0.30, react-native 0.88.1, react-native-web 0.21.4, web:

| call | expected | expo-router 58.0.30 | with-fix |
|---|---|---|---|
| `router.dismissTo('/2')` | `/2` | ✓ | ✓ |
| `router.back()` | `/1` | ✗ `/` | ✓ |

## Cause

With no `dangerouslySingular`, [`StackRouter`](https://github.com/expo/expo/blob/0e673ace1aa2981e08d48290c98377433c9e9282/packages/expo-router/src/react-navigation/routers/StackRouter.tsx#L581-L590) handles `POP_TO` by popping to the last route with the name `[id]`, whatever its path params.

## Fix

Branch [`with-fix`](../../tree/with-fix) (`patches/`): below the focused route, `POP_TO` pops only to a route with the same path params (`getSingularId`), and the replace does not reuse a preloaded route with other path params.
