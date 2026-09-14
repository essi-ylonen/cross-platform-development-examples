import express from 'express';

const app = express();
const PORT = 3000;

// Parse JSON request bodies before the routes.
app.use(express.json());

let students = [
  { id: 1, name: 'Emma', programme: 'Computer Applications' },
  { id: 2, name: 'John', programme: 'Business Information Technology' },
  { id: 3, name: 'Mohammed', programme: 'Computer Applications' },
];

let nextId = 4;

app.get('/students', (req, res) => {
  console.log('GET /students');
  res.json(students);
});

app.get('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((item) => item.id === id);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.json(student);
});


app.post('/students', (req, res) => {
  console.log('POST /students body:', req.body);
  const { name, programme } = req.body;

  if (!name?.trim() || !programme?.trim()) {
    return res.status(400).json({ message: 'Name and programme are required.' });
  }

  const newStudent = {
    id: nextId++,
    name: name.trim(),
    programme: programme.trim(),
  };

  students.push(newStudent);
  console.log('Created:', newStudent);
  res.status(201).json(newStudent);
});

app.put('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  console.log(`PUT /students/${id} body:`, req.body);
  const index = students.findIndex((student) => student.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  const { name, programme } = req.body;
  if (!name?.trim() || !programme?.trim()) {
    return res.status(400).json({ message: 'Name and programme are required.' });
  }

  students[index] = { id, name: name.trim(), programme: programme.trim() };
  console.log('Updated:', students[index]);
  res.json(students[index]);
});

app.delete('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  console.log(`DELETE /students/${id}`);
  const index = students.findIndex((student) => student.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  students.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Students API running on port ${PORT}`);
});
