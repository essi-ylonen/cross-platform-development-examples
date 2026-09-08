# Test Students - React Native + Node.js REST API Example

This example demonstrates how a React Native application can communicate with a Node.js REST API.

The project was created for the Cross-Platform Development course and is intended as a simple introduction to:

- REST APIs
- HTTP GET requests
- Fetching JSON data
- Async/Await
- Request and Response
- Debugging REST API communication

The solution consists of two separate applications:

1. **rest-api-students** (Node.js server)
2. **test-students** (React Native client)

---

# Learning Objectives

After completing this example, students should be able to:

- Explain what a REST API is
- Create a simple Node.js REST endpoint
- Send a GET request from a React Native application
- Receive and process JSON data
- Understand async/await syntax
- Store server data in React state
- Display data using FlatList
- Use basic debugging techniques when working with APIs

---

# Architecture

```text
React Native App
       |
       | GET /students
       |
       v
Node.js REST API
       |
       | JSON Response
       |
       v
React Native App
```

---

# Project 1: rest-api-students

The server is built with Node.js and Express.

Example endpoint:

```javascript
app.get('/students', (req, res) => {
  res.json(students);
});
```

Example data:

```javascript
const students = [
  { id: 1, name: 'Emma' },
  { id: 2, name: 'John' },
  { id: 3, name: 'Mohamed' }
];
```

When a client sends a GET request to:

```text
http://YOUR-IP-ADDRESS:3000/students
```

the server returns JSON data.

---

# Running the Server

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node app.js
```

Expected output:

```text
Server running on port 3000
```

---

# Project 2: test-students

The React Native application fetches student data from the Node.js API and displays it in a FlatList.

Example fetch request:

```javascript
const response = await fetch(
  'http://YOUR-IP-ADDRESS:3000/students'
);

const data = await response.json();

setStudents(data);
```

The retrieved data is displayed using a FlatList component.

---

# Running the React Native App

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

Remember to replace:

```javascript
YOUR-IP-ADDRESS
```

with your own computer's IPv4 address.

Example:

```javascript
http://192.168.1.100:3000/students
```

---

# Async/Await

The application uses async/await to handle asynchronous operations.

Example:

```javascript
const getStudents = async () => {

  const response = await fetch(
    'http://YOUR-IP-ADDRESS:3000/students'
  );

  const data = await response.json();

  setStudents(data);
};
```

Flow:

1. Send request
2. Wait for response
3. Convert response to JSON
4. Update state
5. Update UI

---

# Debugging

The example includes basic debugging techniques.

### View Response Object

```javascript
console.log("Response:");
console.log(response);
```

### View Returned Data

```javascript
console.log("Data:");
console.log(data);
```

### Log Server Requests

```javascript
app.get('/students', (req, res) => {

  console.log('GET request received');

  res.json(students);
});
```

---

# Error Handling with Try/Catch

Example:

```javascript
const getStudents = async () => {

  try {

    const response = await fetch(
      'http://YOUR-IP-ADDRESS:3000/students'
    );

    const data = await response.json();

    setStudents(data);

  } catch (error) {

    console.log(error);

  }
};
```

Using try/catch helps developers identify problems such as:

- Incorrect URLs
- Missing endpoints
- Server not running
- Network connectivity problems

---

# Common Errors

## 404 Not Found

Example:

```javascript
http://YOUR-IP-ADDRESS:3000/studentss
```

Cause:

- Endpoint does not exist.

Solution:

- Check the endpoint name.
- Verify the URL.

---

## Network Request Failed

Cause:

- Node.js server is not running.

Solution:

- Start the server again:

```bash
node app.js
```

---

# Technologies Used

- React Native
- Expo
- JavaScript
- Node.js
- Express
- REST API
- JSON

---

# Course

Cross-Platform Development

This example is used for demonstrating REST API communication between a React Native client application and a Node.js server.

