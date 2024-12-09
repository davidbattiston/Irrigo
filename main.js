import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";

let deviceState = {};
let gallonsPerSecond = 0.00853;
let ozPerSecond = 1.098;

(async () => {
  const file = await Deno.open("/dev/cu.usbmodem101", {
    read: true,
    write: true,
  });

  const initNumber = new Uint8Array([0]);

  const writer = file.writable.getWriter();
  writer.write(initNumber);

  const decoder = new TextDecoder();

  let buffer = ""; // Holds incomplete data from the readable stream

  for await (const chunk of file.readable) {
    buffer += decoder.decode(chunk); // Append the chunk to the buffer

    let openBraces = 0;
    let start = 0;

    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === "{") openBraces++;
      if (buffer[i] === "}") openBraces--;

      // When a complete JSON object is found
      if (openBraces === 0 && start < i) {
        const jsonStr = buffer.slice(start, i + 1);
        start = i + 1;

        try {
          const jsonObj = JSON.parse(jsonStr.trim()); // Trim any leading/trailing whitespace
          deviceState = jsonObj;
          console.log(deviceState);
        } catch (err) {
          console.error("Failed to parse JSON:", err.message, "Data:", jsonStr);
        }
      }
    }

    // Retain incomplete data in the buffer
    buffer = buffer.slice(start);

    // Optional: Avoid unbounded buffer growth
    if (buffer.length > 10000) {
      console.warn("Buffer size exceeded, discarding incomplete data:", buffer);
      buffer = "";
    }
  }
})();

const valveOne = async () => {
  const file = await Deno.open("/dev/cu.usbmodem101", {
    read: true,
    write: true,
  });

  const writer = file.writable.getWriter();
  await writer.write(encoder.encode("1"));

  file.close();
};

const valveTwo = async () => {
  const file = await Deno.open("/dev/cu.usbmodem101", {
    read: true,
    write: true,
  });

  const writer = file.writable.getWriter();
  await writer.write(encoder.encode("2"));

  file.close();
};

const encoder = new TextEncoder();

const app = new Hono();

app.use("/*", serveStatic({ root: "./static" }));

app.get("/", (c) => {
  serveStatic({ root: "./" });
});

app.post("/s-one/", async (c) => {
  valveOne();

  return new Response("Actuate Valve One");
});

app.post("/s-two/", async (c) => {
  valveTwo();

  return new Response("Actuate Valve Two");
});

app.post("/s-four/", async (c) => {
  const body = await c.req.json();
  // console.log(body);
  const now = new Date();
  const targetTime = new Date();

  targetTime.setHours(parseInt(body.hours), parseInt(body.minutes), 0, 0);

  // If the target time is in the past, set it for the next day
  if (targetTime <= now) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  const delay = targetTime - now;

  setTimeout(valveTwo, delay);
  return new Response();
});

app.post("/s-three/", async (c) => {
  const file = await Deno.open("/dev/cu.usbmodem101", {
    read: true,
    write: true,
  });
  const writer = file.writable.getWriter();
  await writer.write(encoder.encode("3"));

  file.close();

  return new Response(
    `Water Used: ${((deviceState.totalElapsedTime / 1000) * ozPerSecond).toFixed(2)} Oz`,
  );
});

Deno.serve(app.fetch);
