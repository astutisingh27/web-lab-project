const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// DB setup (file: appointments.db)
const db = new sqlite3.Database(path.join(__dirname, 'appointments.db'));
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        department TEXT NOT NULL,
        date TEXT NOT NULL,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // serve your static files (index.html, script.js, style.css)

// API endpoint to save appointment
app.post('/api/appointments', (req, res) => {
    const { name, phone, department, date, message } = req.body;
    if (!name || !phone || !department || !date) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const stmt = db.prepare(`INSERT INTO appointments (name, phone, department, date, message) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(name, phone, department, date, message || '', function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, id: this.lastID });
    });
    stmt.finalize();
});

// (optional) list appointments for testing
app.get('/api/appointments', (req, res) => {
    db.all('SELECT * FROM appointments ORDER BY created_at DESC', (err, rows) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, data: rows });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:3000`));