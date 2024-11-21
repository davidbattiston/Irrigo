import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";

// // Init function that fixes problem where first command does nothing/
// // Requires more research to figure out why.
//
() => {
  const initNumber = new Uint8Array([0]);
  Deno.writeFileSync("/dev/cu.usbmodem2101", initNumber);
  Deno.readFile("/dev/cu.usbmodem2101");

  const encoder = new TextEncoder();
  const data = encoder.encode("1");

  Deno.writeFile("/dev/cu.usbmodem2101", data);
  Deno.readFile("/dev/cu.usbmodem2101");
};

const app = new Hono();

app.use("/*", serveStatic({ root: "./static" }));

app.get("/", serveStatic({ root: "./" }));

app.post("/s-one/", async (c) => {
  const encoder = new TextEncoder();
  const data = encoder.encode("1");

  // await Deno.writeFile("/dev/cu.usbmodem2101", data);
  Deno.readFile("/dev/cu.usbmodem2101");

  console.log(await Deno.writeFile("/dev/cu.usbmodem2101", data));
});

Deno.serve(app.fetch);
