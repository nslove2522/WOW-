import http from "node:http";
import net from "node:net";

const TARGET_PORT = Number(process.env.TARGET_PORT || 43147);
const LISTEN_PORT = Number(process.env.LISTEN_PORT || 3000);

const server = http.createServer((req, res) => {
  const proxy = http.request(
    {
      hostname: "127.0.0.1",
      port: TARGET_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (upstream) => {
      res.writeHead(upstream.statusCode ?? 502, upstream.headers);
      upstream.pipe(res);
    },
  );
  proxy.on("error", () => {
    res.statusCode = 502;
    res.end("WOW proxy could not reach the app.");
  });
  req.pipe(proxy);
});

server.on("upgrade", (req, socket, head) => {
  const dest = net.connect(TARGET_PORT, "127.0.0.1", () => {
    const headerLines = Object.entries(req.headers)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
      .join("\r\n");
    dest.write(`${req.method} ${req.url} HTTP/1.1\r\n${headerLines}\r\n\r\n`);
    if (head.length) dest.write(head);
    dest.pipe(socket);
    socket.pipe(dest);
  });
  dest.on("error", () => socket.destroy());
});

server.listen(LISTEN_PORT, "0.0.0.0", () => {
  console.log(`WOW proxy listening on 0.0.0.0:${LISTEN_PORT} -> 127.0.0.1:${TARGET_PORT}`);
});
