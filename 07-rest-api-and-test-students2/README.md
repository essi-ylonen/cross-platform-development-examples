# Students CRUD Example

This example demonstrates how a React Native application built with Expo communicates with a local Node.js and Express REST API.

The example consists of two projects:

- `rest-api-students2`: the Node.js and Express server
- `test-students2`: the Expo client application

Students can use the application to:

- read students with `GET`
- create students with `POST`
- update students with `PUT`
- delete students with `DELETE`

> This is a classroom example. The server stores data in an array, not in a database. Restarting the Node.js server restores the original student data.

## Learning goals

After working through the example, you should be able to:

- explain the four basic CRUD operations
- connect CRUD operations to HTTP methods
- create routes with Express
- send requests from React Native with `fetch`
- send JSON data in a request body
- use `async` and `await`
- check HTTP response status codes
- handle request errors with `try`, `catch`, and `finally`
- update React state after data changes

## CRUD overview

| CRUD operation | HTTP method | API route | Purpose | Successful response |
|---|---|---|---|---|
| Create | `POST` | `/students` | Add a new student | `201 Created` |
| Read | `GET` | `/students` | Get all students | `200 OK` |
| Update | `PUT` | `/students/:id` | Update an existing student | `200 OK` |
| Delete | `DELETE` | `/students/:id` | Delete an existing student | `204 No Content` |

## Project structure

A possible folder structure is:

```text
course-code-examples/
├── rest-api-students2/
│   ├── app.js
│   ├── package.json
│   └── package-lock.json
└── test-students2/
    ├── App.js
    ├── package.json
    └── ...
```

The two applications must be run separately in two terminal windows.

---

# 1. Node.js server: `rest-api-students2`

## Install the dependencies

Open a terminal in the `rest-api-students2` folder and run:

```bash
npm install
```

If you create the server project from the beginning, install Express:

```bash
npm install express
```

The server code uses ES module imports:

```javascript
import express from 'express';
```

Therefore, make sure the server project's `package.json` contains:

```json
{
  "type": "module"
}
```

Your actual `package.json` will also contain the project name, version, dependencies, and possibly scripts.

## Start the server

Run:

```bash
node app.js
```

You should see:

```text
Students API running on port 3000
```

The server listens on port `3000` and on host `0.0.0.0`, allowing the Android emulator or another device on the same network to connect to it.

## Test the GET route

Open the following address in a browser on the same computer:

```text
http://localhost:3000/students
```

You should receive an array similar to:

```json
[
  {
    "id": 1,
    "name": "Emma",
    "programme": "Computer Applications"
  },
  {
    "id": 2,
    "name": "John",
    "programme": "Business Information Technology"
  },
  {
    "id": 3,
    "name": "Mohammed",
    "programme": "Computer Applications"
  }
]
```

## Server routes

### GET `/students`

Returns the whole student array.

```javascript
app.get('/students', (req, res) => {
  console.log('GET /students');
  res.json(students);
});
```

### POST `/students`

Creates a new student.

The client sends the student's `name` and `programme` in the request body. The server creates the id.

Example request body:

```json
{
  "name": "Amina",
  "programme": "Computer Applications"
}
```

Important parts:

```javascript
app.use(express.json());
```

This middleware parses incoming JSON and makes it available through `req.body`.

```javascript
const { name, programme } = req.body;
```

This extracts the two properties from the request body.

```javascript
const newStudent = {
  id: nextId++,
  name: name.trim(),
  programme: programme.trim(),
};
```

The server assigns a new id and removes unnecessary spaces from the beginning and end of the text.

```javascript
students.push(newStudent);
res.status(201).json(newStudent);
```

The student is added to the array, and the server returns status `201 Created` with the newly created student.

### PUT `/students/:id`

Updates an existing student.

For example:

```text
PUT /students/2
```

The `:id` part is a route parameter. Express makes it available through `req.params.id`.

```javascript
const id = Number(req.params.id);
```

Route parameters are strings, so the id is converted into a number.

```javascript
const index = students.findIndex((student) => student.id === id);
```

The server searches for the position of the matching student in the array.

If no student is found, the server returns:

```text
404 Not Found
```

In this example, `PUT` sends both editable properties:

```json
{
  "name": "John Smith",
  "programme": "Computer Applications"
}
```

### DELETE `/students/:id`

Deletes an existing student.

For example:

```text
DELETE /students/3
```

The server locates the student and removes one item from the array:

```javascript
students.splice(index, 1);
```

A successful deletion returns:

```text
204 No Content
```

A `204` response has no JSON response body.

---

# 2. Expo application: `test-students2`

## Install the dependencies

Open another terminal in the `test-students2` folder and run:

```bash
npm install
```

The application uses `react-native-safe-area-context`. If it is not already installed, run:

```bash
npx expo install react-native-safe-area-context
```

## Configure the server address

In `App.js`, find:

```javascript
const BASE_URL = 'http://10.102.106.1:3000';
```

Replace `10.102.106.1` with the current IPv4 address of the computer running the Node.js server.

On Windows, find the address with:

```cmd
ipconfig
```

Look for the active network adapter and its `IPv4 Address`.

Example:

```javascript
const BASE_URL = 'http://10.102.106.57:3000';
```

Important:

- do not use the HTML link version of the address in JavaScript
- keep the address inside normal quotation marks
- keep port `3000`
- the Expo device or emulator must be able to reach the computer running the server
- the address may change when the computer changes network

## Start the Expo application

Run:

```bash
npx expo start
```

Then open the application in an Android emulator or Expo Go.

The Node.js server must remain running in its own terminal.

---

# How the Expo application works

## Reading students

When the component is first rendered, `useEffect` calls `getStudents()`:

```javascript
useEffect(() => {
  getStudents();
}, []);
```

The function sends a GET request:

```javascript
const response = await fetch(`${BASE_URL}/students`);
```

The JSON response is converted into a JavaScript value and saved in state:

```javascript
const data = await response.json();
setStudents(data);
```

`FlatList` then displays the students.

## Creating a student

The user enters a name and a degree programme and presses **Add student**.

The application sends a POST request:

```javascript
const response = await fetch(`${BASE_URL}/students`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, programme }),
});
```

Key points:

- `method: 'POST'` selects the HTTP method
- `Content-Type: application/json` describes the request body
- `JSON.stringify()` converts the JavaScript object into JSON text
- after a successful POST, the form is cleared
- `getStudents()` is called again to refresh the list

## Updating a student

Tap a student card to edit that student.

The application stores the selected id and copies the current values into the input fields:

```javascript
const startEditing = (student) => {
  setSelectedId(student.id);
  setName(student.name);
  setProgramme(student.programme);
  setError('');
};
```

When `selectedId` has a value, the main button displays **Save changes** instead of **Add student**.

The application sends a PUT request to the selected student's URL:

```javascript
const response = await fetch(`${BASE_URL}/students/${selectedId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, programme }),
});
```

After a successful update, the application clears the form and refreshes the list.

## Deleting a student

Long-press a student card to open the confirmation dialog.

If the user confirms the deletion, the application sends:

```javascript
const response = await fetch(`${BASE_URL}/students/${id}`, {
  method: 'DELETE',
});
```

The application does not call `response.json()` after a successful deletion because the server returns status `204 No Content`.

After deletion, `getStudents()` refreshes the list.

---

# Request flow

The general flow is:

```text
User action in the Expo app
        ↓
fetch sends an HTTP request
        ↓
Express matches the route
        ↓
The server reads or changes the students array
        ↓
The server sends an HTTP response
        ↓
The Expo app checks response.ok
        ↓
React state is updated
        ↓
The interface is rendered again
```

# Error handling

Each asynchronous request uses:

```javascript
try {
  // Send and process the request
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
```

- `try` contains the request
- `catch` handles an error
- `finally` stops the loading indicator whether the request succeeds or fails

The application also checks:

```javascript
if (!response.ok) {
  // Handle an HTTP error
}
```

This is needed because `fetch` does not automatically throw an error for every HTTP error response.

## Status codes used in this example

| Status | Meaning in this example |
|---|---|
| `200 OK` | GET or PUT succeeded |
| `201 Created` | POST created a new student |
| `204 No Content` | DELETE succeeded and has no response body |
| `400 Bad Request` | Name or programme is missing |
| `404 Not Found` | The requested route or student was not found |

# Troubleshooting

## The Expo application shows a network error

Check that:

1. the Node.js server is running
2. `BASE_URL` contains the computer's current IPv4 address
3. port `3000` is included
4. the Expo device or emulator can reach the computer
5. the server was started from the correct project folder

## GET works, but POST returns 404

A `404` means that a server responded, but it did not find the requested route or resource.

Check that:

1. the running server contains `app.post('/students', ...)`
2. Node.js was restarted after editing `app.js`
3. the correct server project, `rest-api-students2`, is running
4. the client requests exactly `${BASE_URL}/students`
5. the route is `/students`, not `/studentss`

Restart the server with:

```bash
node app.js
```

## The app shows `Creating failed`

Look at both terminals:

- the Expo terminal shows the client-side log and HTTP status
- the Node.js terminal shows which route was received and the request body

For a successful create, the logs should include something similar to:

```text
POST /students body: { name: 'Amina', programme: 'Computer Applications' }
```

and:

```text
POST response: 201
```

## A DELETE request causes a JSON parsing error

Do not call:

```javascript
await response.json();
```

after a successful DELETE response with status `204`, because the response body is empty.

## Changes disappear after restarting the server

This is expected. The example uses an in-memory array rather than a database.

# Suggested practice tasks

1. Start both applications and load the original students.
2. Create a new student.
3. Tap the new student and update the degree programme.
4. Long-press the student and delete it.
5. Observe the HTTP status after each operation.
6. Observe the request logs in both terminals.
7. Temporarily change `/students` to `/studentss` and observe the `404` response. Restore the correct route afterward.
8. Stop the Node.js server and compare the connection error with an HTTP `404` response.

# Important notes

- Run the Node.js server and Expo application in separate terminals.
- Keep both terminals visible when debugging.
- Change `BASE_URL` whenever the computer's IPv4 address changes.
- The student id is created by the server during POST.
- The id is included in the URL during PUT and DELETE.
- POST and PUT send JSON request bodies.
- DELETE returns no JSON body in this example.
- Data is not persistent because no database is used.

