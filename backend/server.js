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
    const { name, score, category} = req.query;
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
  

        // 2. Set headers
    res.setHeader('Content-Type', 'application/pdf');
    
    doc.pipe(res);
    doc.rect(0, 0, 842, 595).fill('#020617');
    doc.rect(0, 0, 842, 595).fill('#020617'); // Background
        
        // Borders
    doc.rect(20, 20, 802, 555).lineWidth(2).stroke('#0891b2');
    doc.rect(35, 35, 772, 525).lineWidth(0.5).stroke('#164e63');

        // Header
    doc.fillColor('#22d3ee').fontSize(10).text('OFFICIAL QUANTUM ASSESSMENT PROTOCOL', 0, 80, { align: 'center', characterSpacing: 2 });
    doc.fillColor('#ffffff').fontSize(45).text('CERTIFICATE OF MASTERY', 0, 120, { align: 'center' });

        // Content
    doc.fillColor('#94a3b8').fontSize(16).text('This document serves as formal verification that', 0, 210, { align: 'center' });
    doc.fillColor('#ffffff').fontSize(38).text(name.toUpperCase(), 0, 250, { align: 'center' });

        // CATEGORY SECTION (Safely handled)
    doc.fillColor('#94a3b8').fontSize(16).text(`has successfully completed the`, 0, 310, { align: 'center' });
    doc.fillColor('#ffffff').fontSize(18).text(category.toUpperCase(), 0, 335, { align: 'center' });
        
    doc.fillColor('#22d3ee').fontSize(24).text(`WITH A PROFICIENCY SCORE OF ${score}%`, 0, 370, { align: 'center' });

        // Signatures
    doc.moveTo(150, 480).lineTo(350, 480).lineWidth(1).stroke('#334155');
    doc.fillColor('#ffffff').fontSize(12).text('SUJOY CHAKRAVARTY', 150, 490, { width: 200, align: 'center' });    
    
    doc.moveTo(492, 480).lineTo(692, 480).lineWidth(1).stroke('#334155');
    doc.fillColor('#475569').text('Copyright @2026 Sujoy. All rights reserved.', 50, 510);
    doc.end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log('Engine v1.0.4 Active'));

