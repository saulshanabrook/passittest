# Testing Passit with Nativescript

This repo is to test if it is possible to create a Passit app for iOS and Android using nativescript.
This is not trivial, because Passit uses the Web Cryptography API, which isn't supported in the Javascript
runtimes used by Nativescript (Javascript Core on iOS and V8 on Android). So instead, we use the
`nativescript-webview-crypto` addon to polyfill it.


The current status is that this isn't working on either iOS or Android.


## Usage

First start `passit-backend`. Set the globally accessible URL for it in
`./app/constants.ts`. It can't be `localhost` if using Genymotion.
I used [ngrok](https://ngrok.com/) to expose the local port. If you are
 running it locally, you can set it to `http://10.0.3.2:8000/api/`
to use localhost. I  use ngrok if I wanna test it on a deployed device.

Also start Genymotion.

then:

```bash
tns install
tns run android
```


If you want to create an APK you can also run:

```bash
tns build android --release --key-store-path my-key.keystore  --key-store-alias prod --key-store-alias-password saul123 --key-store-password saul123
```

It will be available at `platforms/android/build/outputs/apk/passittest-release.apk`.

If you change some node dependencies or some of the `postinstall` scripts, I recommend
doing a clean re-install of the deps.


```bash
rm -rf node_modules/ platforms/ hooks/; tns platform remove android; tns platform remove android
tns install; tns platform add ios; tns platform add android
```

## Timing

This is the timing on my Nexus 6p running 7.1.1: ![](Screenshot_20161230-145447.png)


## Blockers

### iOS

Passit-sdk-js requires `PBKDF2` which isn't supported on JavaScriptCore. However,
it us supported on the iOS Safari browser. This means it should work when
[Nativescript moves to the new `WKWebview`](https://github.com/NativeScript/NativeScript/issues/1287)
component that uses the Safari browser.


### Android
Works!

## Workarounds

### Node Modules
Nativescript does not automatically polyfill Node APIs like webpack does.
So instead, I have manually installed the required polyfills and used `grep`
after the `npm install` to install them on the dependencies. These  are the
`fix:buffer`, `fix:randombytes:main`, `fix:randombytes`, and `fix:vm:require:asn1`
NPM scripts, that are all run in `postinstall`.

TODO:
- [ ] Convert changing imports to adding global module, ala `app/btoa-polyfill`

### NPM Modules with `.js`
I have found that Nativescript fails to properly find NPM modules that end in `.js` (like `asn1.js`).
I assume it must think these are files instead of folders and fails to find them. I have not
logged a bug yet in NativeScript for this behavior. The `fix:asn1:rename` and `fix:bn:rename`
NPM sripts work around this by renaming troublesome files.

### Browser Support

The `window.btoa` function is used in passit-sdk-js, but is not supported in
Nativescript, o we polyfil it (`app/btoa-polyfill.ts`). The same is true for
the Text Encoding API.
