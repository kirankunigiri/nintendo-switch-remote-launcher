# NX Remote Launcher
A Nintendo Switch homebrew app to browse, filter, and launch Switch games from your phone.

### About

Open the app on your Switch, and scan the QR code to view your games.
- View your game library.
- Filter by genre and player count.
- View game details, trailer, and tap to launch.

### Screenshots
<table>
  <tr align="center">
      <td colspan="3"><img src="https://i.imgur.com/aEJBxTN.jpeg"></img></td>
  </tr>
  <tr align="center">
      <td><img src="https://i.imgur.com/oCxk0tS.jpeg"></img></td>
      <td><img src="https://i.imgur.com/JS4atJz.jpeg"></img></td>
      <td><img src="https://i.imgur.com/MTkYNA9.jpeg"></img></td>
  </tr>
</table>

---
### How it works

The app uses `nx.js` with a `remix` server to serve a web app. It loads the list of games from the Switch, and the react frontend displays it. We call external API's to get metadata about the games (genre/player count).

Libraries Used
- 📖 [Remix docs](https://remix.run/docs)
- [nx.js docs](https://github.com/TooTallNate/remix-nxjs)

---
### Development - Switch

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
### Development - Web Only

You don't need to have a Switch to develop! You can run the web version which will automatically use test game data from a json file in `app/lib/test/apps.json`. All of the data fetching and UI is created in the remix react app, so you can work on most of the functionality of the app. Only the "launch game" feature requires having a switch to test.

```sh
bun run dev:web
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