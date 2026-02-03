const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PDFDocument = require('pdfkit');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const Result = mongoose.model('Result', {
    name: String, email: String, score: Number, category: String, date: { type: Date, default: Date.now }
});

app.post('/api/save', async (req, res) => {
    try { await new Result(req.body).save(); res.status(201).send(); }
    catch (e) { res.status(500).send(e); }
});

app.get('/api/leaderboard', async (req, res) => {
    const top = await Result.find().sort({ score: -1 }).limit(10);
    res.json(top);
});

app.get('/api/cert', (req, res) => {
    const { name, score, category } = req.query;
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);
    doc.rect(0, 0, 842, 595).fill('#020617');
    doc.fillColor('#22d3ee').fontSize(40).text('QUANTUM MASTERY CERTIFICATE', 0, 150, { align: 'center' });
    doc.fillColor('#ffffff').fontSize(25).text(`Awarded to: ${name}`, 0, 230, { align: 'center' });
    doc.fontSize(15).text(`Score: ${score}% | ${category}`, 0, 280, { align: 'center' });
    doc.fillColor('#475569').text('Copyright @2026 Sujoy. All rights reserved.', 50, 540);
    doc.end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log('Engine v1.0.4 Active'));

