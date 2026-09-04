# Passing Props to Custom Components in React Native

This example demonstrates how information can be passed from a **parent component** to a reusable **custom component** using props.

The app displays two course cards. Both cards use the same `CourseCard` component, but they receive different prop values.

## Learning objectives

After reviewing this example, you should be able to:

- create a custom React Native component
- pass props from a parent component to a child component
- receive props using object destructuring
- pass strings, numbers, objects, and Boolean values as props
- use prop values when rendering content
- use a Boolean prop for conditional content and styling
- reuse the same component with different data

## Complete example

Add the following code to your `App.js` file:

```javascript
import { StyleSheet, Text, View } from 'react-native';

// Custom component
const CourseCard = ({ title, credits, teacher, isOpen }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text>Credits: {credits}</Text>

      <Text>
        Teacher: {teacher.firstName} {teacher.lastName}
      </Text>

      <Text style={isOpen ? styles.open : styles.closed}>
        {isOpen ? 'Enrollment is open' : 'Enrollment is closed'}
      </Text>
    </View>
  );
};

// Main App component
export default function App() {
  const courseTeacher = {
    firstName: 'Essi',
    lastName: 'Lavonius-Ylönen',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My courses</Text>

      <CourseCard
        title="Cross-Platform Development"
        credits={5}
        teacher={courseTeacher}
        isOpen={true}
      />

      <CourseCard
        title="Mobile Programming Project"
        credits={5}
        teacher={courseTeacher}
        isOpen={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#f2f4f5',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#003755',
  },
  card: {
    backgroundColor: 'white',
    padding: 18,
    marginBottom: 14,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003755',
    marginBottom: 8,
  },
  open: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 8,
  },
  closed: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 8,
  },
});
```

## How the example works

### 1. The custom component

`CourseCard` is a custom component that represents one course:

```javascript
const CourseCard = ({ title, credits, teacher, isOpen }) => {
```

A component receives all its props in one JavaScript object. In this example, object destructuring is used to extract four properties directly from that object:

- `title`
- `credits`
- `teacher`
- `isOpen`

Without destructuring, the component could receive a variable called `props` and access the values like this:

```javascript
const CourseCard = (props) => {
  return <Text>{props.title}</Text>;
};
```

Both approaches work. Destructuring is commonly used because it makes the component concise and clearly shows which props it expects.

### 2. Passing a string prop

```javascript
title="Cross-Platform Development"
```

A string can be passed by writing its value inside quotation marks.

The custom component displays the value like this:

```javascript
<Text style={styles.title}>{title}</Text>
```

Curly braces are needed when a JavaScript value is displayed inside JSX.

### 3. Passing a number prop

```javascript
credits={5}
```

The number is written inside curly braces because it is a JavaScript value.

Compare these two examples:

```javascript
credits="5"  // String
credits={5}  // Number
```

The custom component displays the number using the `credits` variable:

```javascript
<Text>Credits: {credits}</Text>
```

### 4. Passing an object prop

The `App` component creates a JavaScript object:

```javascript
const courseTeacher = {
  firstName: 'Essi',
  lastName: 'Lavonius-Ylönen',
};
```

The entire object is passed to `CourseCard` through the `teacher` prop:

```javascript
teacher={courseTeacher}
```

Inside `CourseCard`, individual object properties are accessed with dot notation:

```javascript
teacher.firstName
teacher.lastName
```

They are displayed together in the component:

```javascript
<Text>
  Teacher: {teacher.firstName} {teacher.lastName}
</Text>
```

### 5. Passing a Boolean prop

A Boolean value can be either `true` or `false`:

```javascript
isOpen={true}
```

The example uses the value to decide which enrollment message to display:

```javascript
{isOpen ? 'Enrollment is open' : 'Enrollment is closed'}
```

This is a **ternary operator**. It can be read as:

> If `isOpen` is true, display `Enrollment is open`. Otherwise, display `Enrollment is closed`.

The same value is also used to select a style:

```javascript
style={isOpen ? styles.open : styles.closed}
```

When `isOpen` is true, the `open` style is used. Otherwise, the `closed` style is used.

## Parent and child components

In this example:

- `App` is the **parent component**.
- `CourseCard` is the **child component**.
- Data is passed from `App` to `CourseCard` through props.

```text
App
 ├── CourseCard
 └── CourseCard
```

Props allow the parent to provide information to the child. The child uses that information to render its user interface.

## Reusing the component

The same `CourseCard` component is used twice:

```javascript
<CourseCard
  title="Cross-Platform Development"
  credits={5}
  teacher={courseTeacher}
  isOpen={true}
/>

<CourseCard
  title="Mobile Programming Project"
  credits={5}
  teacher={courseTeacher}
  isOpen={false}
/>
```

The structure and styling of both cards come from the same component. Only the prop values change.

This is the main benefit of custom components and props: **one reusable component can display different data**.

## Expected result

The app displays:

- the heading **My courses**
- a card for **Cross-Platform Development**
- a card for **Mobile Programming Project**
- the number of credits for each course
- the teacher's name
- an open or closed enrollment message

The open message is green, and the closed message is red.

## Try it yourself

After running the example, try one or more of these changes:

1. Change the title or number of credits of a course.
2. Change `isOpen` from `true` to `false` and observe the result.
3. Add a third `CourseCard` with different prop values.
4. Add a new string prop called `room` and display it in the card.
5. Add a property called `email` to the `courseTeacher` object and display it in `CourseCard`.

### Optional challenge

Add a new prop called `level`:

```javascript
<CourseCard
  title="Cross-Platform Development"
  credits={5}
  teacher={courseTeacher}
  isOpen={true}
  level="Beginner"
/>
```

Then receive it in the custom component:

```javascript
const CourseCard = ({ title, credits, teacher, isOpen, level }) => {
```

Finally, display it inside the card:

```javascript
<Text>Level: {level}</Text>
```

## Key takeaway

Props make custom components reusable. The component defines the structure of the user interface, while the parent component provides the data that the component displays.
