import express from "express";
import puppeteer from 'puppeteer';
import json from "body-parser";

const app = express();
const port = 5000;

// Middleware to parse JSON in the request body
app.use(json());

app.post("/convertToPDF", async (req, res) => {
  try {
    const { html } = req.body;

    const browser = await puppeteer.launch({
        headless: 'new',
      });
    const page = await browser.newPage();

    // Set content and wait for rendering
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf();

    // Close the browser
    await browser.close();

    // Send the PDF as a response
    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error converting to PDF:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
