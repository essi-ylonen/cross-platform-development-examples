# SQLite Students, Part 2: Updating and Deleting Data

This React Native and Expo example demonstrates how to store student information in a local SQLite database. The main focus of this part is **updating** and **deleting** existing data.

The application also includes the functionality from the earlier example: creating the database, adding students, reading students, and displaying them in a list.

## Learning objectives

After studying this example, you should be able to:

- create and initialize a local SQLite database in an Expo application
- add records to a SQLite table
- read and display records from a SQLite table
- select an existing record for editing
- update an existing record with an SQL `UPDATE` statement
- delete a record with an SQL `DELETE` statement
- ask the user for confirmation before deleting data
- refresh the user interface after a database operation
- use a separate component for displaying each list item
- sort database results in different ways

## Application features

The application allows the user to:

- enter a student's name, email address, and degree programme
- add the student to a local SQLite database
- view all saved students
- see the number of saved students
- sort students by newest first or by name from A to Z
- select a student for editing
- save changes to an existing student
- cancel editing
- delete a student after confirming the operation

## Technologies used

- React Native
- Expo
- JavaScript
- Expo SQLite
- React Hooks: `useState` and `useEffect`
- `FlatList`
- `Alert`
- `SafeAreaView` from `react-native-safe-area-context`

## Project structure

```text
sqlite-students-part2/
├── App.js
├── components/
│   └── StudentItem.js
├── database/
│   └── db.js
└── package.json
```

### `App.js`

The main application component:

- stores the form values and application state
- initializes the database when the application starts
- loads students from the database
- decides whether the form adds a new student or updates an existing one
- clears the form after saving or cancelling
- asks for confirmation before deletion
- displays students with a `FlatList`
- passes each student and its event handlers to `StudentItem`

### `components/StudentItem.js`

A reusable component that displays one student. It shows:

- the student's name
- the student's email address
- the student's degree programme
- an **Edit** button
- a **Delete** button

The component receives the following props from `App.js`:

- `student`: the student object to display
- `onEdit`: the function called when **Edit** is pressed
- `onDelete`: the function called when **Delete** is pressed

### `database/db.js`

The database module keeps the SQLite code separate from the user interface. It exports functions for:

- initializing the database
- adding a student
- reading students
- updating a student
- deleting a student

## Installation and running the application

### 1. Open the project folder

```bash
cd sqlite-students-part2
```

### 2. Install the project dependencies

If the project was cloned from GitHub, run:

```bash
npm install
```

The example uses Expo SQLite and React Native Safe Area Context. If they are not already included in the project, install them with:

```bash
npx expo install expo-sqlite react-native-safe-area-context
```

### 3. Start the Expo development server

```bash
npx expo start
```

You can then open the application on an Android emulator, iOS simulator, or a supported physical device.

## The database and table

The database is opened in `database/db.js`:

```javascript
const dbPromise = SQLite.openDatabaseAsync('students_part2.db');
```

The application creates a table called `students` if it does not already exist:

```sql
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  programme TEXT NOT NULL
);
```

Each student record contains:

| Column | Type | Purpose |
|---|---|---|
| `id` | INTEGER | Unique identifier and primary key |
| `name` | TEXT | Student's name |
| `email` | TEXT | Student's email address |
| `programme` | TEXT | Student's degree programme |

The database uses write-ahead logging:

```sql
PRAGMA journal_mode = WAL;
```

## Application state

`App.js` uses state variables for the form, student list, editing mode, and sorting:

```javascript
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [programme, setProgramme] = useState('');
const [students, setStudents] = useState([]);
const [editingId, setEditingId] = useState(null);
const [sortOrder, setSortOrder] = useState('newest');
```

The meaning of `editingId` is important:

- `editingId === null`: the form is in **add mode**
- `editingId` contains a student ID: the form is in **edit mode**

The same form and Save handler are therefore used for both adding and updating students.

## Adding a student

The Add operation uses a parameterized SQL statement:

```sql
INSERT INTO students (name, email, programme) VALUES (?, ?, ?)
```

The question marks are placeholders. The actual values are passed separately by the application.

Before saving, `handleSave` checks that the user has entered all three values:

```javascript
if (!name.trim() || !email.trim() || !programme.trim()) {
  Alert.alert('Missing information', 'Enter name, email and degree programme.');
  return;
}
```

If `editingId` is `null`, the application adds a new student:

```javascript
await addStudent(name, email, programme);
```

## Updating a student

### 1. The user selects a student

When the user presses **Edit**, `StudentItem` calls the `onEdit` function received from `App.js`.

`App.js` then calls `startEditing(student)`:

```javascript
function startEditing(student) {
  setEditingId(student.id);
  setName(student.name);
  setEmail(student.email);
  setProgramme(student.programme);
}
```

This function:

1. saves the selected student's ID in `editingId`
2. copies the current student values into the form fields
3. changes the application from add mode to edit mode

The heading above the form and the Save button text change automatically:

- **Add a new student** becomes **Editing student ID**
- **Add student** becomes **Save changes**

### 2. The user changes the form values

The inputs are controlled components. Changes are stored in the `name`, `email`, and `programme` state variables.

### 3. The application updates the database

Because `editingId` is no longer `null`, `handleSave` calls:

```javascript
await updateStudent(editingId, name, email, programme);
```

The database function runs this SQL statement:

```sql
UPDATE students
SET name = ?, email = ?, programme = ?
WHERE id = ?
```

The `WHERE id = ?` condition is essential. It makes sure that only the selected student is updated.

### 4. The form and list are refreshed

After a successful update, the application:

```javascript
clearForm();
await loadStudents();
```

`clearForm()` clears the inputs and sets `editingId` back to `null`. `loadStudents()` reads the current data from SQLite and updates the list on the screen.

## Cancelling editing

The **Cancel** button calls `clearForm()`:

```javascript
function clearForm() {
  setName('');
  setEmail('');
  setProgramme('');
  setEditingId(null);
}
```

The button is disabled while the application is in add mode:

```javascript
disabled={editingId === null}
```

Cancelling only clears the form and leaves the database unchanged.

## Deleting a student

### 1. The user presses Delete

`StudentItem` calls the `onDelete` function received from `App.js`.

### 2. The application asks for confirmation

`confirmDelete(student)` displays a React Native alert with two choices:

- **Cancel**: closes the alert without deleting data
- **Delete**: continues with the database operation

```javascript
Alert.alert(
  'Delete student?',
  `${student.name} will be removed from this device.`,
  [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: async () => {
        // Delete operation
      },
    },
  ]
);
```

This confirmation step helps prevent accidental deletion.

### 3. The database record is deleted

The application calls:

```javascript
await deleteStudent(student.id);
```

The database function runs:

```sql
DELETE FROM students WHERE id = ?
```

Again, the `WHERE` condition is essential because it identifies the record that should be deleted.

### 4. Editing state is handled

If the user deletes the same student that is currently being edited, the application clears the form:

```javascript
if (editingId === student.id) clearForm();
```

### 5. The displayed list is refreshed

After deletion, the application calls:

```javascript
await loadStudents();
```

This reads the remaining students from the database and updates the `FlatList`.

## Reading and sorting students

The application reads the students with:

```javascript
const rows = await getStudents(sortOrder);
setStudents(rows);
```

The SQL sorting depends on the selected sort order.

### Newest first

```sql
ORDER BY id DESC
```

Students with the highest IDs are displayed first.

### Name A-Z

```sql
ORDER BY name COLLATE NOCASE ASC
```

`COLLATE NOCASE` makes the alphabetical sorting case-insensitive.

When `sortOrder` changes, the effect runs again and reloads the students:

```javascript
useEffect(() => {
  async function prepareDatabase() {
    await initDatabase();
    await loadStudents();
  }

  prepareDatabase();
}, [sortOrder]);
```

## Full data flow

### Updating data

1. The user presses **Edit** next to a student.
2. `StudentItem` calls `onEdit`.
3. `App.js` calls `startEditing(student)`.
4. The selected ID is stored in `editingId`.
5. The student's current values are copied into the controlled `TextInput` fields.
6. The user changes one or more values.
7. The user presses **Save changes**.
8. `handleSave()` validates the form.
9. `updateStudent()` runs a parameterized SQL `UPDATE` statement.
10. `clearForm()` returns the form to add mode.
11. `loadStudents()` reads the latest data.
12. `setStudents(rows)` causes the list to render again.

### Deleting data

1. The user presses **Delete** next to a student.
2. `StudentItem` calls `onDelete`.
3. `App.js` calls `confirmDelete(student)`.
4. The application displays a confirmation alert.
5. If the user selects **Delete**, `deleteStudent()` runs a parameterized SQL `DELETE` statement.
6. If the deleted student was being edited, the form is cleared.
7. `loadStudents()` reads the remaining data.
8. `setStudents(rows)` causes the list to render again.

## Error handling

Database operations use `try...catch`. If an operation fails, the application displays an appropriate alert, for example:

- `Database error`
- `Reading failed`
- `Saving failed`
- `Deleting failed`

This prevents database errors from failing silently and gives feedback to the user.

## Important points to remember

- SQLite data is stored locally on the device used by the application.
- `editingId` determines whether the form adds or updates a student.
- An SQL `UPDATE` or `DELETE` should use a `WHERE` condition to target the correct record.
- The SQL statements use placeholders instead of inserting form values directly into the SQL string.
- The list must be reloaded after adding, updating, or deleting data.
- A confirmation dialog is useful before a destructive operation.
- Separating database functions into `database/db.js` keeps database logic away from the UI components.
- Separating each row into `StudentItem.js` makes `App.js` easier to read and the row reusable.

## Try it yourself

1. Add at least three students.
2. Edit one student's name or degree programme.
3. Press **Cancel** while editing and check that no database value changes.
4. Delete one student and test both choices in the confirmation dialog.
5. Change the sorting between **Newest first** and **Name A-Z**.
6. Close and reopen the application and check whether the saved data is still available.
7. Try saving the form with one field empty and observe the validation message.

## Possible extensions

You could continue developing the example by adding:

- email format validation
- a search field
- filtering by degree programme
- a button for deleting all students
- a separate edit screen
- success messages after database operations
- more student fields
- improved accessibility labels

## Source files

The example consists of:

- `App.js`
- `components/StudentItem.js`
- `database/db.js`

The database functions and the user interface are intentionally separated so that the data flow is easier to follow.

