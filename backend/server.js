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
    const doc = new PDFDocument({ 
        layout: 'landscape', 
        size: 'A4',
        margin: 0 
    });

    const certId = `QNT-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;
    const date = new Date().toLocaleDateString('en-US', { year: '2026', month: 'long', day: 'numeric' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${name}_Certificate.pdf`);
    doc.pipe(res);

    // 1. BACKGROUND & BORDER
    doc.rect(0, 0, 842, 595).fill('#020617'); // Deep Midnight Background
    
    // Draw Cyan Outer Frame
    doc.rect(20, 20, 802, 555).lineWidth(2).stroke('#0891b2');
    // Draw Thin Inner Frame
    doc.rect(35, 35, 772, 525).lineWidth(0.5).stroke('#164e63');

    // 2. CORNER ACCENTS (Cyberpunk style)
    const cornerSize = 40;
    doc.lineWidth(4).strokeColor('#22d3ee');
    // Top Left
    doc.moveTo(20, 20 + cornerSize).lineTo(20, 20).lineTo(20 + cornerSize, 20).stroke();
    // Bottom Right
    doc.moveTo(822 - cornerSize, 575).lineTo(822, 575).lineTo(822, 575 - cornerSize).stroke();

    // 3. HEADER
    doc.fillColor('#22d3ee')
       .fontSize(10)
       .text('OFFICIAL QUANTUM ASSESSMENT PROTOCOL', 0, 80, { align: 'center', characterSpacing: 2 });

    doc.fillColor('#ffffff')
       .fontSize(45)
       .font('Helvetica-Bold')
       .text('CERTIFICATE OF MASTERY', 0, 120, { align: 'center' });

    // 4. MAIN CONTENT
    doc.fillColor('#94a3b8')
       .fontSize(16)
       .font('Helvetica')
       .text('This document serves as formal verification that', 0, 210, { align: 'center' });

    doc.fillColor('#ffffff')
       .fontSize(38)
       .font('Times-Italic')
       .text(name.toUpperCase(), 0, 250, { align: 'center' });

    doc.fillColor('#94a3b8')
       .fontSize(16)
       .font('Helvetica')
       .text(`has successfully completed the ${category} competency test`, 0, 310, { align: 'center' });

    doc.fillColor('#22d3ee')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text(`WITH A PROFICIENCY SCORE OF ${score}%`, 0, 350, { align: 'center' });

    // 5. FOOTER / SIGNATURES
    doc.moveTo(150, 480).lineTo(350, 480).lineWidth(1).stroke('#334155');
    doc.fillColor('#ffffff').fontSize(12).text('SUJOY CHAKRAVARTY', 150, 490, { width: 200, align: 'center' });
    doc.fillColor('#64748b').fontSize(8).text('Lead Systems Architect', 150, 505, { width: 200, align: 'center' });

    doc.moveTo(492, 480).lineTo(692, 480).lineWidth(1).stroke('#334155');
    doc.fillColor('#ffffff').fontSize(12).text('DATE OF ISSUE', 492, 490, { width: 200, align: 'center' });
    doc.fillColor('#64748b').fontSize(8).text(date, 492, 505, { width: 200, align: 'center' });

    // 6. DIGITAL SEAL / ID
    doc.fillColor('#164e63').fontSize(7)
       .text(`VERIFICATION ID: ${certId}`, 40, 545);
    doc.text('GEN-3 QUANTUM CLOUD COMPUTE ENGINE v1.0.4', 40, 555);

    doc.end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log('Engine v1.0.4 Active'));

