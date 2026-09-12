# test-students-drawer

Cross-Platform Development course example.

This example demonstrates **Drawer Navigation** using Expo Router and React Native.

The application contains multiple top-level screens that can be accessed through a Drawer menu.

The backend used in this example is:

- rest-api-students2 (Node.js + Express)

## Learning goals

After studying this example, you should be able to:

- Understand the purpose of Drawer Navigation
- Create top-level routes using Expo Router
- Configure Drawer screens
- Navigate between sections of an application
- Submit data using a REST API
- Refresh data when returning to a screen
- Understand when Drawer and Stack Navigation should be used

---

## Application structure

```text
app/
│
├── _layout.js
├── index.js
├── add.js
└── about.js
```

### _layout.js

Defines:

- Drawer Navigator
- Drawer labels
- Screen titles
- Shared configuration

### index.js

Students screen.

Responsibilities:

- Fetch students from the REST API
- Display students in a FlatList
- Refresh data when the screen becomes active

### add.js

Add Student screen.

Responsibilities:

- Display a form
- Send data using POST
- Return to the Students screen after saving

### about.js

About screen.

Responsibilities:

- Display static information
- Demonstrate a simple Drawer route

---

## Drawer Navigation

Unlike Stack Navigation, Drawer screens are:

- Top-level destinations
- Not dependent on a selected item
- Directly accessible from the menu

Typical examples:

- Home
- Students
- Add Student
- Courses
- Settings
- About

---

## Backend API

### Get all students

```text
GET /students
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Emma",
    "programme": "Computer Applications"
  }
]
```

### Add a student

```text
POST /students
```

Request body:

```json
{
  "name": "Emma",
  "programme": "Computer Applications"
}
```

Example response:

```json
{
  "id": 4,
  "name": "Emma",
  "programme": "Computer Applications"
}
```

---

## Navigation flow

```text
Drawer
│
├── Students
├── Add Student
└── About
```

Users can move freely between these sections.

---

## Important concepts

### Drawer Navigation

A Drawer menu is commonly used to provide access to the main sections of an application.

Examples:

- Gmail
- Outlook
- Teams
- Banking apps

### router.replace()

After a student has been saved:

```js
router.replace('/');
```

returns the user to the Students screen.

### useFocusEffect()

The Students screen refreshes its data whenever it becomes active again.

This allows newly added students to appear immediately after saving.

---

## Drawer vs Stack

### Drawer Navigation

Use for:

- Home
- Students
- Add Student
- Settings
- About

### Stack Navigation

Use for:

- Student Details
- Edit Student
- Course Details
- Product Details

A good rule:

> Drawer Navigation is for top-level sections.  
> Stack Navigation is for contextual screens.

---

## Example extensions

Try adding:

- Edit Student screen
- Delete Student functionality
- Settings screen
- Contact screen
- Programme filter
- Search functionality

---

## Technologies used

- React Native
- Expo
- Expo Router
- Expo Drawer
- JavaScript
- Node.js
- Express.js
- REST API
