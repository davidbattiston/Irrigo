import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";

const app = new Hono();

app.use("/*", serveStatic({ root: "./static" }));

app.get("/", async (c) => {
  serveStatic({ root: "./" });
  console.log("Init ran");

  // // Init function that fixes problem where first command does nothing/
  // // Requires more research to figure out why.
  //

  const initNumber = new Uint8Array([0]);
  await Deno.writeFile("/dev/cu.usbmodem2101", initNumber);
  Deno.readFile("/dev/cu.usbmodem2101");
});

app.post("/s-one/", async (c) => {
  const encoder = new TextEncoder();
  const data = encoder.encode("1");

  await Deno.writeFile("/dev/cu.usbmodem2101", data);
  Deno.readFile("/dev/cu.usbmodem2101");

  return new Response("Servo One Triggered");
});

app.post("/s-two/", async (c) => {
  const encoder = new TextEncoder();
  const data = encoder.encode("2");

  await Deno.writeFile("/dev/cu.usbmodem2101", data);
  Deno.readFile("/dev/cu.usbmodem2101");

  return new Response("Servo Two Triggered");
});

Deno.serve(app.fetch);
