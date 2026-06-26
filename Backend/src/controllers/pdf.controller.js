const PDFDocument = require('pdfkit');

const pdfDownload = async (req, res) => {
    try {
        const { title, notes, revisionPoints, questions } = req.body;

        // Prevent crashes on empty requests
        if (!notes && !revisionPoints && !questions) {
            return res.status(400).json({ message: "No content provided to build document" });
        }

        // Initialize document with strict layout boundaries
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 60, left: 50, right: 50 },
            bufferPages: true // Critical for multi-page evaluation loops
        });

        // Set attachment downloading metadata configurations
        const safeFilename = (title || 'study-notes').toLowerCase().replace(/[^a-z0-9]/g, '-');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.pdf"`);

        doc.pipe(res);

        const contentWidth = doc.page.width - 100; // 495pt crisp rendering boundary

        //Header section
        doc.rect(0, 0, doc.page.width, 15).fill('#1e1b4b');
        doc.y = 45;

        doc.fillColor('#1e1b4b').fontSize(24).font('Helvetica-Bold').text(`${title || 'Generated Notes'}`, {
            width: contentWidth,
            align: 'left'
        });

        doc.moveDown(0.3);
        doc.fillColor('#6b7280').fontSize(10).font('Helvetica-Oblique').text(`Generated via ExamNotes AI • ${new Date().toLocaleDateString()}`);

        doc.moveDown(0.8);
        doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(1.5);

        //Study Notes
        if (notes) {
            doc.fillColor('#4338ca').fontSize(16).font('Helvetica-Bold').text('📝 Detailed Study Notes');
            doc.moveDown(0.6);

            const cleanNotes = notes.replace(/[#*`_]/g, '');

            doc.fillColor('#374151').fontSize(11).font('Helvetica').text(cleanNotes, {
                lineGap: 5,
                width: contentWidth,
                align: 'justify'
            });
            doc.moveDown(2);
        }

        //Revison Points
        if (revisionPoints && revisionPoints.length > 0) {
            doc.fillColor('#065f46').fontSize(16).font('Helvetica-Bold').text('⚡ Quick Revision Points');
            doc.moveDown(0.6);

            revisionPoints.forEach((point) => {
                const currentY = doc.y;

                // Keep the canvas drawing vectors fully isolated
                doc.rect(52, currentY + 3, 5, 5).fill('#10b981');

                // Use a defined text block shift bounding frame layout
                doc.fillColor('#1f2937').fontSize(11).font('Helvetica').text(point, 65, currentY, {
                    width: contentWidth - 15,
                    lineGap: 4
                });
                doc.moveDown(0.5);
            });

            // CRITICAL FIX: Explicitly reset structural coordinate state positions
            doc.x = 50;
            doc.moveDown(1.5);
        }

        // Question Section
        if (questions && (questions.short?.length > 0 || questions.long?.length > 0)) {
            doc.fillColor('#991b1b').fontSize(16).font('Helvetica-Bold').text('❓ Important Questions');
            doc.moveDown(0.8);

            if (questions.short && questions.short.length > 0) {
                doc.fillColor('#7f1d1d').fontSize(12).font('Helvetica-Bold').text('Short Answer Questions');
                doc.moveDown(0.4);

                questions.short.forEach((q, idx) => {
                    doc.fillColor('#374151').fontSize(11).font('Helvetica').text(`${idx + 1}.  ${q}`, {
                        width: contentWidth,
                        lineGap: 4,
                        indent: 10
                    });
                    doc.moveDown(0.4);
                });
                doc.moveDown(1);
            }

            if (questions.long && questions.long.length > 0) {
                doc.fillColor('#7f1d1d').fontSize(12).font('Helvetica-Bold').text('Long Answer Questions');
                doc.moveDown(0.4);

                questions.long.forEach((q, idx) => {
                    doc.fillColor('#374151').fontSize(11).font('Helvetica').text(`${idx + 1}.  ${q}`, {
                        width: contentWidth,
                        lineGap: 4,
                        indent: 10
                    });
                    doc.moveDown(0.4);
                });
            }
        }

        // Footer
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
            doc.switchToPage(i);

            const footerY = doc.page.height - 40; // Strict absolute baseline marker anchor

            // Draw clean baseline rule separating header frame from text container flow
            doc.strokeColor('#e5e7eb').lineWidth(0.5).moveTo(50, footerY - 5).lineTo(545, footerY - 5).stroke();

            // Left Footer Text
            doc.fillColor('#9ca3af').fontSize(9).font('Helvetica').text('ExamNotes AI Dashboard Export', 50, footerY, {
                width: contentWidth / 2,
                height: 15
            });

            // Right Footer Text (Page Counter tracking string index metrics)
            doc.fillColor('#9ca3af').fontSize(9).font('Helvetica').text(`Page ${i + 1} of ${range.count}`, 50, footerY, {
                align: 'right',
                width: contentWidth,
                height: 15
            });
        }

        // Send streaming data to output stream destination channels
        doc.end();
    } catch (err) {
        console.error("PDF Production Engine Crash Exception:", err);
        if (!res.headersSent) {
            res.status(500).json({ message: "Internal server error assembling content stream mapping array objects." });
        }
    }
};

module.exports = { pdfDownload };