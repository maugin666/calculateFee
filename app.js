const { readFile } = require("fs").promises;
const filePath = process.argv.slice(2);
const { calculateFee } = require("./src/convert");

async function readJSONFile(filePath) {
    try {
        const data = await readFile(filePath, { encoding: "utf8" });
        calculateFee(JSON.parse(data));
    } catch (error) {
        throw new Error(error.message);
    }
}

readJSONFile(filePath.toString());