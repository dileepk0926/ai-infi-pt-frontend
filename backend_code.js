// backend/index.js
const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { PDFDocument, rgb } = require("pdf-lib");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(fileUpload());

app.post("/api/run-test", async (req, res) => {
  if (!req.files || !req.files.testFile) {
    return res.status(400).send("No test file uploaded");
  }

  const testFile = req.files.testFile;
  const aiEnabled = req.body.aiEnabled === "true";
  const testSteps = JSON.parse(testFile.data.toString());

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const images = [];
  const times = [];

  for (let i = 0; i < testSteps.length; i++) {
    const step = testSteps[i];
    const start = Date.now();

    if (step.action === "goto") {
      await page.goto(step.url);
    } else if (step.action === "click") {
      await page.click(step.selector);
    } else if (step.action === "waitFor") {
      await page.waitForTimeout(step.ms);
    }

    const buffer = await page.screenshot();
    const timeTaken = Date.now() - start;
    images.push(buffer);
    times.push({ step: i + 1, action: step.action, time: timeTaken });
  }

  await browser.close();

  const pdfDoc = await PDFDocument.create();
  for (let i = 0; i < images.length; i++) {
    const page = pdfDoc.addPage();
    const pngImage = await pdfDoc.embedPng(images[i]);
    const { width, height } = pngImage.scale(0.5);
    page.drawImage(pngImage, {
      x: 50,
      y: 300,
      width,
      height,
    });
    page.drawText(`Step ${i + 1}: ${times[i].action} - ${times[i].time} ms`, {
      x: 50,
      y: 500,
      size: 14,
      color: rgb(0, 0, 0),
    });
  }

  const pdfBytes = await pdfDoc.save();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=Test_Report.pdf");
  res.send(Buffer.from(pdfBytes));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
