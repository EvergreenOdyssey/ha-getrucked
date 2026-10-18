// Bundles the card into a single committed JS file served by the
// integration -- no CDN, no build step required of end users.
import * as esbuild from "esbuild";
import { mkdirSync } from "node:fs";

const outdir = "custom_components/getrucked/www";
mkdirSync(outdir, { recursive: true });

await esbuild.build({
  entryPoints: ["src/card/index.ts"],
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2021",
  outfile: `${outdir}/getrucked-card.js`,
  logLevel: "info",
});
