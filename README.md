# expo-router `dismissTo` pops to a dynamic route with other params

The root Stack holds `projects/[slug]/(project)` for project `a`, then a drop of `a`, then a drop of `b`.
`router.dismissTo('/projects/b/drops')` should replace the drop of `b` with the drops of `b`, because `/projects/b/drops` is not in the history.
Instead it pops to the layout of `a` and gives it the params of `b`. The drop of `a` and the drops of `a` are gone from the history.

## Run

```sh
pnpm install
pnpm exec playwright install chromium
pnpm test     # expo export -p web, then Playwright presses the buttons and reads the address bar
```

Expo SDK 58, expo-router 58.0.30, web.

Steps: open `/projects/a/drops`, open drop 1 of `a`, open drop 2 of `b`, press `router.dismissTo('/projects/b/drops')`, then press `router.back()` twice.

| step | expected | expo-router 58.0.30 | with-fix |
|---|---|---|---|
| `router.dismissTo('/projects/b/drops')` | `/projects/b/drops` | ✓ | ✓ |
| `router.back()` | `/projects/a/drops/1` | ✗ `/` | ✓ |
| `router.back()` | `/projects/a/drops` | ✗ (already on `/`) | ✓ |

## Cause

`dismissTo` resolves to a `POP_TO` for the route name `projects/[slug]/(project)` in the root Stack.
[`StackRouter`](https://github.com/expo/expo/blob/main/packages/expo-router/src/react-navigation/routers/StackRouter.tsx) handles `POP_TO` by popping to the last route with that name, whatever its params.
That route is the layout of `a`, so the Stack pops to it and gives it `slug: 'b'`.

## Fix

Branch [`with-fix`](../../tree/with-fix) (`patches/`): in `resolveNavigationDestination`, when the last Stack route with the target's name has other params for its dynamic segments, resolve the `POP_TO` to a `REPLACE`, which is what `dismissTo` does when the href is not in the history.
