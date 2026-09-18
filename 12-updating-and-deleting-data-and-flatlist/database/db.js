import * as SQLite from 'expo-sqlite';

const dbPromise = SQLite.openDatabaseAsync('students_part2.db');

export async function initDatabase() {
  const db = await dbPromise;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      programme TEXT NOT NULL
    );
  `);
}

export async function addStudent(name, email, programme) {
  const db = await dbPromise;
  return db.runAsync(
    'INSERT INTO students (name, email, programme) VALUES (?, ?, ?)',
    name.trim(),
    email.trim(),
    programme.trim()
  );
}


export async function getStudents(sortOrder = 'newest') {
  const db = await dbPromise;

  const orderBy =
    sortOrder === 'name'
      ? 'name COLLATE NOCASE ASC'
      : 'id DESC';

  return db.getAllAsync(
    `SELECT id, name, email, programme FROM students ORDER BY ${orderBy}`
  );
}




export async function updateStudent(id, name, email, programme) {
  const db = await dbPromise;
  return db.runAsync(
    'UPDATE students SET name = ?, email = ?, programme = ? WHERE id = ?',
    name.trim(),
    email.trim(),
    programme.trim(),
    id
  );
}

export async function deleteStudent(id) {
  const db = await dbPromise;
  return db.runAsync('DELETE FROM students WHERE id = ?', id);
}
