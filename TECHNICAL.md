# Solo/todo-app — technical notes

Implementation notes for the static todo app described in `README.md`. There is no server-side component to configure: the committed files are served directly and all state stays in the browser.

## Stack

The repository is source-only: one static HTML file, one Vue script, and vendored browser builds. There is no `package.json`, no lockfile, and no build step, so no dependency versions can be pinned from a manifest — the assets are committed as-is.

- Vue 3 is vendored twice: `js/vue.esm-browser.js` (the ES-module build the page actually loads, via importmap at `index.html:10-13`) and `js/vue.global.js` (the global build).
- Two version strings appear in `js/vue.global.js`: `3.0.8` (`js/vue.global.js:2338`) and `3.2.31` (`js/vue.global.js:9118`). Neither is pinned by a manifest, so the exact Vue point version is `UNKNOWN — requires human input`.
- Tailwind CSS is vendored as static assets: `js/tailwindcss_forms.js` and an inline `<style type="text/tailwindcss">` block at `index.html:19`. The companion `js/tailwind.config.js` is empty (0 bytes). How these Tailwind assets were originally produced is `UNKNOWN — requires human input`; no manifest records it.

## Architecture

`index.html` is the sole entry point. It declares an importmap mapping `vue` to `./js/vue.esm-browser.js` (`index.html:10-13`) and loads `./js/index.js` as an ES module (`index.html:105`). `js/index.js` builds the UI with Vue 3's Composition API: a reactive `todos` array (`js/index.js:5`) with functions to add (`js/index.js:10`), remove (`js/index.js:14`), toggle one (`js/index.js:17`), toggle all (`js/index.js:20`), and clear all (`js/index.js:23`) entries.

Saving an empty entry is rejected in the browser with an alert (`js/index.js:9`); there is no server-side validation to mirror.

The template at `index.html:61` destructures `{ content, done }` in a `v-for`, and the check-all and remove-all controls sit behind `v-if="todos.length >= 1"` (`index.html:87`). A fresh browser with no `todos` key therefore renders the whole shell with those two actions hidden. On load the script also focuses the input through the `contentEl` ref (`js/index.js:35`).

The whole application runs in the browser. There is no backend, no server-side controller, no API, and no authentication — these are absent by design, not unfinished work. The single page at `/` is entirely public, and every interaction happens client-side.

nginx serves the committed files directly; there is no application server, routing layer, or background work. There is one route (`/`). Deep links rely on the nginx SPA fallback rather than a client-side router — the app has no `<router-link>` or `<router-view>`.

## Data and persistence

There is no database. The only persistent state is the browser's `localStorage` under the key `todos`:

- `js/index.js:26` writes `localStorage.setItem("todos", JSON.stringify(todos))`.
- `js/index.js:32-33` reads it back with `JSON.parse(localStorage.getItem("todos"))` and pushes each item into the reactive array on load.
- The stored value is a JSON array of objects shaped `{ content, done }` (created at `js/index.js:10`): `content` is the todo text, `done` is a boolean.

The list lives in a single browser profile and has no server copy. Clearing site data or using incognito mode loses it; there is no migration or SQL dump to reconcile because nothing is stored outside the browser.

## Container layout

`Dockerfile` is a single runtime stage: `FROM docker.io/nginxinc/nginx-unprivileged:1.27-alpine`, `COPY . /usr/share/nginx/html`, the SPA template copied to `/etc/nginx/templates/default.conf.template`, and `ENV PORT=8080` / `EXPOSE 8080` (`Dockerfile:1-5`).

The nginx template (`.containerize/nginx-spa.conf.template`) listens on `${PORT}`, sets `root /usr/share/nginx/html` and `index index.html`, and handles `location /` with `try_files $uri $uri/ /index.html` (`.containerize/nginx-spa.conf.template:8`) so unknown paths return the app shell.

Two repo-local details must survive regeneration: that SPA fallback template, and the `dist` exclusion in `.dockerignore:15` — the source `index.html` is served, not the `dist/` production build. This repo is not one of the six never-re-render repos, so regenerating is safe but not required. `CONTAINERIZE.md` holds the full generated-file inventory.
