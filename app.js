import express from "express";
import { chromium } from "playwright";
import json from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const port = 5000;

// Middleware to parse JSON in the request body
app.use(json());

app.post("/convertToPDF", async (req, res) => {
  try {
    const { html } = req.body;

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set content and wait for rendering
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf();

    // Close the browser
    await browser.close();

    // Save the PDF to a file
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    const pdfPath = path.join(currentDir, "output.pdf");
    fs.writeFileSync(pdfPath, pdfBuffer);

    // Send the link to the saved PDF as a response
    const pdfUrl = `https://converttopdf.onrender.com/output.pdf`;
    res.json({ pdfUrl });
  } catch (error) {
    console.error("Error converting to PDF:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Serve static files (PDF in this case)
const currentDir = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(currentDir));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
