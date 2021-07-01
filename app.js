const http = require("http");
const hostname = "127.0.0.1";
const port = 3000;

const { readFile } = require("fs").promises;
const filePath = process.argv.slice(2);
const { calculateFee } = require("./src/convert");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  readJSONFile(filePath.toString());
});

async function readJSONFile(filePath) {
  try {
    const data = await readFile(filePath, { encoding: "utf8" });
    calculateFee(JSON.parse(data));
  } catch (error) {
    console.error(error.message);
  }
}
