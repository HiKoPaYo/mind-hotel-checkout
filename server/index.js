import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'records.json');

// Ensure data folder and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to read records
function readRecords() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading records:', err);
    return [];
  }
}

// Helper to write records
function writeRecords(records) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing records:', err);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/records', (req, res) => {
  const records = readRecords();
  res.json({ success: true, count: records.length, records });
});

app.post('/api/records', (req, res) => {
  const {
    grade,
    classNum,
    studentName,
    category,
    monsterName,
    monsterConfig,
    gamesPlayed,
    finalEmotion,
    answers,
    stressBefore,
    stressAfter
  } = req.body;

  const newRecord = {
    id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    grade: grade || '미입력',
    classNum: classNum || '미입력',
    studentName: studentName || '익명의 지배인',
    category: category || '기타',
    monsterName: monsterName || '마음 불청객',
    monsterConfig: monsterConfig || {},
    gamesPlayed: gamesPlayed || [],
    finalEmotion: finalEmotion || '미선택',
    answers: answers || {
      q1: '',
      q2: '',
      q3: ''
    },
    stressBefore: typeof stressBefore === 'number' ? stressBefore : 5,
    stressAfter: typeof stressAfter === 'number' ? stressAfter : 1,
    createdAt: new Date().toISOString()
  };

  const records = readRecords();
  records.unshift(newRecord); // 최신순
  writeRecords(records);

  res.status(201).json({ success: true, record: newRecord });
});

app.delete('/api/records/:id', (req, res) => {
  const { id } = req.params;
  const records = readRecords();
  const filtered = records.filter(r => r.id !== id);
  writeRecords(filtered);
  res.json({ success: true, deleted: id });
});

// Stats API for counselor
app.get('/api/stats', (req, res) => {
  const records = readRecords();
  const categoryCounts = {};
  const emotionCounts = {};
  const gameCounts = {};

  records.forEach(r => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    emotionCounts[r.finalEmotion] = (emotionCounts[r.finalEmotion] || 0) + 1;
    if (Array.isArray(r.gamesPlayed)) {
      r.gamesPlayed.forEach(g => {
        gameCounts[g] = (gameCounts[g] || 0) + 1;
      });
    }
  });

  res.json({
    total: records.length,
    categoryCounts,
    emotionCounts,
    gameCounts
  });
});

// Serve frontend build if exists
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🏨 마음 호텔 서버가 포트 ${PORT}에서 실행 중입니다!`);
});
