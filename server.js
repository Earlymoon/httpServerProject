const express = require("express");
const fs = require("fs");

const app = express();
const port = 8080;

function readContentFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data;
  } catch (error) {
    console.error(`Error reading file at ${filePath}: ${error.message}`);
    throw error;
  }
}

function readLineFromFile(filePath, lineNumber) {
  const content = readContentFromFile(filePath);
  const lines = content.split("\n");

  if (lineNumber && (lineNumber <= 0 || lineNumber > lines.length)) {
    console.error(`Requested line (${lineNumber}) is out of bounds.`);
    throw new Error("Line not found");
  }

  return lineNumber ? lines[lineNumber - 1] : content;
}

app.get("/data", (req, res) => {
  const fileName = req.query.n;
  const lineNumber = req.query.m;

  if (!fileName) {
    return res.status(400).send("File name (n) is required.");
  }

  const filePath = `/tmp/data/${fileName}.txt`;

  try {
    const result = readLineFromFile(filePath, lineNumber);
    res.send(result);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
