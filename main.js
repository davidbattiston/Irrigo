import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { cache } from "@hono/hono/cache";

const app = new Hono();

app.use("/*", serveStatic({ root: "./static" }));

app.get(
  "*",
  cache({
    cacheControl: "max-age=31536000",
    wait: true,
  }),
);

app.get(
  "/",
  serveStatic({ root: "./" }),
  cache({
    cacheControl: "max-age=31536000",
    wait: true,
  }),
);

// // Init function that fixes problem where first command does nothing/
// // Requires more research to figure out why.
() => {
  const initNumber = new Uint8Array([0]);
  Deno.writeFileSync("/dev/cu.usbmodem2101", initNumber);
  Deno.readFile("/dev/cu.usbmodem2101");
};

Deno.serve(app.fetch);

// const getInput = () => {
//   const valvepos = prompt("Enter valve input.\n Input Value: ");

//   if (valvepos === "exit") {
//     Deno.exit();
//   }

//   const encoder = new TextEncoder();
//   const data = encoder.encode(valvepos);

//   Deno.writeFile("/dev/cu.usbmodem2101", data);
//   Deno.readFile("/dev/cu.usbmodem2101");

//   getInput();
// };

// getInput();
