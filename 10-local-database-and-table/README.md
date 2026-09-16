# SQLite Students, Part 1

A simple React Native and Expo example that demonstrates how to create and use a local SQLite database in a mobile application.

This is **Part 1** of the SQLite Students example. The main focus is on:

- opening a local SQLite database
- creating a database table
- adding data to the table
- reading data from the table
- displaying the saved data in a React Native application

## Learning objectives

After studying this example, you should understand how to:

1. use SQLite in an Expo application
2. separate database operations from the user interface
3. create a table with SQL
4. insert data using a parameterized SQL statement
5. retrieve rows from a database
6. update the React Native user interface with database data
7. handle asynchronous database operations with `async` and `await`

## Technologies used

- React Native
- Expo
- JavaScript
- SQLite
- `expo-sqlite`
- `react-native-safe-area-context`

## Application features

The application allows the user to:

- enter a student's name
- enter a student's email address
- enter a student's degree programme
- save the student in a local SQLite database
- read all saved students
- view the students in a list

The data is stored locally on the device or emulator. A separate Node.js server or REST API is not used in this example.

## Project structure

```text
sqlite-students-part1/
├── App.js
├── database/
│   └── db.js
├── package.json
└── ...
```

### `App.js`

Contains the application's user interface and state management. It:

- prepares the database when the application starts
- stores the form values in state
- validates the form
- calls the database functions
- stores the retrieved students in state
- displays the students with `FlatList`

### `database/db.js`

Contains the SQLite operations. Keeping the database code in a separate file makes the application easier to read, maintain, and extend.

It exports three functions:

| Function | Purpose |
|---|---|
| `initDatabase()` | Opens the database and creates the `students` table if it does not already exist |
| `addStudent(name, email, programme)` | Inserts a new student into the table |
| `getStudents()` | Retrieves all students from the table |

## Database

The application opens a local database called:

```text
students_v2.db
```

The database is opened with:

```javascript
const dbPromise = SQLite.openDatabaseAsync('students_v2.db');
```

Opening the database returns a promise. The code can therefore wait for the database connection with `await`.

## The `students` table

The table is created in `initDatabase()`:

```sql
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  programme TEXT NOT NULL
);
```

The table contains the following columns:

| Column | Data type | Description |
|---|---|---|
| `id` | `INTEGER` | Unique identifier for each student |
| `name` | `TEXT` | Student's name |
| `email` | `TEXT` | Student's email address |
| `programme` | `TEXT` | Student's degree programme |

`PRIMARY KEY` identifies each row uniquely. Because the column is an `INTEGER PRIMARY KEY`, SQLite generates its value when a new row is inserted.

`NOT NULL` means that the column must have a value.

`CREATE TABLE IF NOT EXISTS` prevents an error if the table has already been created.

## Database initialization

When the application starts, the `useEffect` hook calls `prepareDatabase()` once:

```javascript
useEffect(() => {
  async function prepareDatabase() {
    try {
      await initDatabase();
      setStatus('Database and students table are ready.');
      await loadStudents();
    } catch (error) {
      setStatus(`Database error: ${error.message}`);
    }
  }

  prepareDatabase();
}, []);
```

The empty dependency array, `[]`, means that the effect runs when the component is first mounted.

The application first creates the table if necessary and then loads any students that are already stored in the database.

## Adding a student

The application stores the input values in state:

```javascript
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [programme, setProgramme] = useState('');
```

Before saving, the application checks that every field contains a value:

```javascript
if (!name.trim() || !email.trim() || !programme.trim()) {
  Alert.alert(
    'Missing information',
    'Enter name, email and degree programme.'
  );
  return;
}
```

The student is inserted with this SQL statement:

```sql
INSERT INTO students (name, email, programme)
VALUES (?, ?, ?)
```

The question marks are placeholders. The values are passed separately:

```javascript
return db.runAsync(
  'INSERT INTO students (name, email, programme) VALUES (?, ?, ?)',
  name.trim(),
  email.trim(),
  programme.trim()
);
```

Using placeholders is safer and clearer than building an SQL statement by joining user input directly into the SQL string.

After a successful insert, the application:

1. writes the inserted row ID to the console
2. clears the input fields
3. loads the updated student list

## Reading students

The following query retrieves all students:

```sql
SELECT id, name, email, programme
FROM students
ORDER BY id DESC
```

`ORDER BY id DESC` displays the newest rows first.

The result is assigned to the `students` state:

```javascript
const rows = await getStudents();
console.log('Students from SQLite:', rows);
setStudents(rows);
```

If the database is empty, the console displays:

```text
Students from SQLite: []
```

The empty array means that the query worked, but no students have been saved yet.

## Displaying the data

The students are displayed with `FlatList`:

```javascript
<FlatList
  data={students}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.row}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>{item.email}</Text>
      <Text>{item.programme}</Text>
    </View>
  )}
  ListEmptyComponent={<Text>No students saved yet.</Text>}
/>
```

Each database row becomes one item in the list. The database `id` is used as the unique key.

## Error handling

Database operations can fail, so the example uses `try...catch` blocks.

For example:

```javascript
try {
  const rows = await getStudents();
  setStudents(rows);
} catch (error) {
  Alert.alert('Reading failed', error.message);
}
```

This prevents an unhandled error and gives feedback to the user.

## Installation

If you want to build the example yourself, create an Expo project and install the required packages.

```bash
npx create-expo-app sqlite-students-part1
cd sqlite-students-part1
npx expo install expo-sqlite react-native-safe-area-context
```

Place `db.js` inside a `database` folder and check that the import in `App.js` is:

```javascript
import { addStudent, getStudents, initDatabase } from './database/db';
```

## Running the application

Start the Expo development server:

```bash
npx expo start
```

You can then open the application in an Android emulator or another environment supported by your Expo project.

## Testing the example

1. Start the application.
2. Check that the status says `Database and students table are ready.`
3. Notice that the list may initially display `No students saved yet.`
4. Enter a name, email address, and degree programme.
5. Select **Add student**.
6. Check that the input fields are cleared.
7. Check that the new student appears in the list.
8. Add another student and observe that the newest student appears first.
9. Reload the application and check that the saved students are still available.
10. Select **Read all** to retrieve the rows again.

## Important concepts

### Local persistence

React state exists while the application is running. SQLite stores data locally, so the data can remain available after the component rerenders or the application restarts.

### Asynchronous operations

The SQLite API used in this project is asynchronous. Database functions return promises, and the application waits for them with `await`.

### Separation of concerns

The user interface is in `App.js`, while the database operations are in `database/db.js`. This keeps different responsibilities separate.

### State and database data

The database is the persistent data source. The `students` state contains the rows currently shown in the user interface. After inserting a student, the application reads the database again so that the list stays up to date.

## Suggested exercises

Try extending the example by:

1. adding more students
2. changing the order of the results
3. adding another column to the table
4. validating the email address more carefully
5. displaying the number of saved students
6. searching students by name or degree programme

> If you change the table structure during development, remember that `CREATE TABLE IF NOT EXISTS` does not modify a table that already exists. You may need a migration strategy or a new development database before the new structure is visible.

## Summary

This example introduces the basic flow of a local database application:

```text
Application starts
      ↓
Open the SQLite database
      ↓
Create the table if needed
      ↓
Read saved rows
      ↓
Store rows in React state
      ↓
Display rows with FlatList
```

When the user adds a student:

```text
Read input values
      ↓
Validate the values
      ↓
Insert a row into SQLite
      ↓
Read all rows again
      ↓
Update the list
```

This provides a foundation for the next part of the example, where additional database operations and application features can be introduced.

