# switch-remote-launcher
Browser and launch apps on your switch remotely

### Libraries
- 📖 [Remix docs](https://remix.run/docs)
- [nx.js docs](https://github.com/TooTallNate/remix-nxjs)


### Screenshots

Open the app on your Switch, and scan the QR code to view your apps.
![Switch Screenshot](https://i.imgur.com/aEJBxTN.jpeg)

View your games and tap to launch.

<img src="https://i.imgur.com/98Q08GA.jpeg" width="300">

Filter by genre and player count.

<img src="https://i.imgur.com/55ZtKF4.jpeg" width="300">

---
### Development

The development server mode involves running the Remix server .nro file on the Switch, while also running the "dev" script on your local machine:

1. Run the build:dev script:
```sh
bun run build:dev
```

2. Create the dev mode .nro file:
```sh
bun run nro
```

3. Upload the `.nro` file to your Switch and launch the app from the Homebrew Launcher
4. Run the `dev` script on your local machine, passing the URL to your Switch Remix app. This script monitors for file changes in the `app` directory, rebuilds the Remix app, and then uploads the new server bundle to the `/__dev` endpoint for the Switch to use for future HTTP requests:
```sh
# IMPORTANT: Replace with your own Switch's IP address
bun run dev http://192.168.86.103:8080
```
---
### Generate a production `.nro`

First, run the `build` script to build your Remix app and place the client-side assets into the "romfs" directory:

```sh
bun run build
```

Then run the `nro` script to generate the final `.nro` file.

```sh
bun run nro
```

Place the `.nro` file onto your Switch's SD card inside the "switch" directory, and launch the app through the Homebrew Launcher (album menu). While the app is running, you can access your Remix application from a web browser using the IP address and port shown on the Switch screen.

### `.nro` Metadata

* Add a square `icon.jpg` file in the root of the project to customize the icon of the NRO file
* The following `package.json` values are shown on the Homebrew Launcher:
  * `name`
  * `version`
  * `author`
* Set the `titleId` property in `package.json` to a random 16 digit hex string (example: `012a792e7a730000`)
  * This allows your app to access Save Data via `localStorage` in `loader()`/`action()` functions