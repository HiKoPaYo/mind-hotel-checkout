import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'records.json');

// Supabase client setup
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://sjgcutllflktuojqorne.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZ2N1dGxsZmxrdHVvanFvcm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQzNzQ2NzUsImV4cCI6MjEwOTk1MDY3NX0.c3yvLmEOMo6_Cpf6yojmpxJnH0NZGZmzhSgRh-NZkq0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Ensure local data folder and file exist for fallback & backup
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to read local fallback records
function readLocalRecords() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local records:', err);
    return [];
  }
}

// Helper to write local fallback records
function writeLocalRecords(records) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local records:', err);
  }
}

// Map Supabase DB row to App format
function mapRowToRecord(row) {
  return {
    id: row.id,
    grade: row.grade,
    classNum: row.class_num,
    studentName: row.student_name,
    category: row.category,
    monsterName: row.monster_name,
    monsterConfig: row.monster_config || {},
    gamesPlayed: row.games_played || [],
    finalEmotion: row.final_emotion,
    answers: row.answers || {},
    stressBefore: row.stress_before,
    stressAfter: row.stress_after,
    createdAt: row.created_at,
    source: 'supabase',
  };
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'supabase',
    supabaseConnected: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
    time: new Date().toISOString(),
  });
});

// GET /api/records
app.get('/api/records', async (req, res) => {
  try {
    // Try fetching from Supabase
    const { data, error } = await supabase
      .from('mind_checkout_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase query error, falling back to local records:', error.message);
      const localRecords = readLocalRecords();
      return res.json({ success: true, count: localRecords.length, records: localRecords, source: 'local' });
    }

    const records = (data || []).map(mapRowToRecord);
    res.json({ success: true, count: records.length, records, source: 'supabase' });
  } catch (err) {
    console.error('Failed to get records:', err);
    const localRecords = readLocalRecords();
    res.json({ success: true, count: localRecords.length, records: localRecords, source: 'local' });
  }
});

// POST /api/records
app.post('/api/records', async (req, res) => {
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
    stressAfter,
  } = req.body;

  const dbRow = {
    grade: grade || '미입력',
    class_num: classNum || '미입력',
    student_name: studentName || '익명의 지배인',
    category: category || '기타',
    monster_name: monsterName || '마음 불청객',
    monster_config: monsterConfig || {},
    games_played: Array.isArray(gamesPlayed) ? gamesPlayed : [],
    final_emotion: finalEmotion || '미선택',
    answers: answers || { q1: '', q2: '', q3: '' },
    stress_before: typeof stressBefore === 'number' ? stressBefore : 5,
    stress_after: typeof stressAfter === 'number' ? stressAfter : 1,
  };

  // Local fallback object
  const localRecord = {
    id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    grade: dbRow.grade,
    classNum: dbRow.class_num,
    studentName: dbRow.student_name,
    category: dbRow.category,
    monsterName: dbRow.monster_name,
    monsterConfig: dbRow.monster_config,
    gamesPlayed: dbRow.games_played,
    finalEmotion: dbRow.final_emotion,
    answers: dbRow.answers,
    stressBefore: dbRow.stress_before,
    stressAfter: dbRow.stress_after,
    createdAt: new Date().toISOString(),
  };

  // 1. Always backup to local
  const localRecords = readLocalRecords();
  localRecords.unshift(localRecord);
  writeLocalRecords(localRecords);

  // 2. Insert into Supabase
  try {
    const { data, error } = await supabase
      .from('mind_checkout_records')
      .insert([dbRow])
      .select();

    if (error) {
      console.warn('Supabase insert error, saved locally:', error.message);
      return res.status(201).json({ success: true, record: localRecord, source: 'local_fallback' });
    }

    const insertedRecord = data && data[0] ? mapRowToRecord(data[0]) : localRecord;
    res.status(201).json({ success: true, record: insertedRecord, source: 'supabase' });
  } catch (err) {
    console.error('Supabase insert exception:', err);
    res.status(201).json({ success: true, record: localRecord, source: 'local_fallback' });
  }
});

// DELETE /api/records/:id
app.delete('/api/records/:id', async (req, res) => {
  const { id } = req.params;

  // 1. Delete from local backup
  const localRecords = readLocalRecords();
  const filtered = localRecords.filter(r => r.id !== id);
  writeLocalRecords(filtered);

  // 2. Delete from Supabase (if uuid)
  try {
    await supabase.from('mind_checkout_records').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase delete error:', err);
  }

  res.json({ success: true, deleted: id });
});

// GET /api/stats
app.get('/api/stats', async (req, res) => {
  let records = [];

  try {
    const { data, error } = await supabase
      .from('mind_checkout_records')
      .select('*');

    if (!error && data) {
      records = data.map(mapRowToRecord);
    } else {
      records = readLocalRecords();
    }
  } catch (err) {
    records = readLocalRecords();
  }

  const categoryCounts = {};
  const emotionCounts = {};
  const gameCounts = {};

  records.forEach(r => {
    if (r.category) categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    if (r.finalEmotion) emotionCounts[r.finalEmotion] = (emotionCounts[r.finalEmotion] || 0) + 1;
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
    gameCounts,
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
  console.log(`🏨 마음 호텔 서버가 포트 ${PORT}에서 실행 중입니다! (Supabase Database 연동)`);
});
