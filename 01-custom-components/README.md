# React Native Custom Components and Props

This example demonstrates how to create and reuse a **custom component** in React Native. It also shows how a parent component can pass information to a child component using **props**.

The application displays three course cards. All cards use the same `CourseCard` component, but each card receives different content and a different accent color.

## Learning objectives

After studying this example, you should be able to:

- explain what a custom component is
- create a custom component as a JavaScript function
- render a custom component using JSX
- pass data from a parent component to a child component with props
- display prop values inside JSX
- reuse the same component with different content
- add event handling inside a custom component
- combine shared styles with dynamic styles

## What is a custom component?

React Native provides built-in components such as `View`, `Text`, `Image`, `Pressable`, and `TextInput`. You can also create your own components. These are called **custom components**.

A custom component is usually a JavaScript function that returns JSX:

```jsx
function Greeting() {
  return <Text>Hello!</Text>;
}
```

The component is rendered using JSX:

```jsx
<Greeting />
```

Custom component names must begin with a **capital letter**. This helps React distinguish custom components from other elements.

## Why use custom components?

Custom components help us:

- reuse the same user-interface structure
- reduce repeated code
- divide a large application into smaller parts
- make code easier to read and maintain
- give each part of the interface a clear responsibility

## What are props?

**Props**, short for properties, are values passed from a parent component to a child component.

In this example, `App` passes three props to `CourseCard`:

```jsx
<CourseCard
  title="Cross-Platform Development"
  topic="React Native custom components"
  color="#003755"
/>
```

The `CourseCard` component receives the values using object destructuring:

```jsx
function CourseCard({ title, topic, color }) {
  // The prop values can be used here.
}
```

The values can then be displayed in JSX by placing the JavaScript expressions inside curly braces:

```jsx
<Text>{title}</Text>
<Text>{topic}</Text>
```

Props are read-only. A child component uses the values it receives, but it should not change them directly.

## Example application

Replace the contents of your Expo project's `App.js` file with the following code:

```jsx
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Courses</Text>

      <CourseCard
        title="Cross-Platform Development"
        topic="React Native custom components"
        color="#003755"
      />

      <CourseCard
        title="Mobile Programming Project"
        topic="Planning an application MVP"
        color="#8A1538"
      />

      <CourseCard
        title="Web Development"
        topic="HTML, CSS and JavaScript"
        color="#53682B"
      />

      <StatusBar style="auto" />
    </View>
  );
}

function CourseCard({ title, topic, color }) {
  const showCourse = () => {
    Alert.alert(title, `Current topic: ${topic}`);
  };

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardTopic}>{topic}</Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: color },
          pressed && styles.buttonPressed,
        ]}
        onPress={showCourse}
      >
        <Text style={styles.buttonText}>View course</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f5',
    padding: 24,
    paddingTop: 70,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003755',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 6,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 6,
  },
  cardTopic: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 14,
  },
  button: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
```

## How the example works

### 1. `App` is the parent component

`App` controls the main screen and renders three instances of `CourseCard`:

```jsx
<CourseCard title="Cross-Platform Development" ... />
<CourseCard title="Mobile Programming Project" ... />
<CourseCard title="Web Development" ... />
```

The component definition is written only once, although the component is used three times.

### 2. `CourseCard` is the child component

`CourseCard` receives `title`, `topic`, and `color` from `App`:

```jsx
function CourseCard({ title, topic, color }) {
```

Every component instance receives its own prop values. This is why the cards can display different information while sharing the same structure and styles.

### 3. Curly braces contain JavaScript expressions

The prop values are displayed inside JSX:

```jsx
<Text style={styles.cardTitle}>{title}</Text>
<Text style={styles.cardTopic}>{topic}</Text>
```

Text written without curly braces is displayed literally. A value inside curly braces is evaluated as JavaScript.

### 4. Styles can be combined

The card uses an array containing a shared style and a dynamic style:

```jsx
<View style={[styles.card, { borderLeftColor: color }]}>
```

- `styles.card` gives every card the same basic appearance.
- `{ borderLeftColor: color }` uses the color received through props.

The button background uses the same prop value:

```jsx
{ backgroundColor: color }
```

### 5. A custom component can handle user interaction

When the button is pressed, React Native calls `showCourse`:

```jsx
onPress={showCourse}
```

The function opens an alert containing the course title and topic:

```jsx
const showCourse = () => {
  Alert.alert(title, `Current topic: ${topic}`);
};
```

Notice that `onPress` receives the function without parentheses:

```jsx
onPress={showCourse}   // Give the function to onPress
```

Writing `onPress={showCourse()}` would call the function immediately during rendering instead of waiting for the user to press the button.

### 6. Pressed-state styling

`Pressable` can provide information about whether the button is currently being pressed:

```jsx
style={({ pressed }) => [
  styles.button,
  { backgroundColor: color },
  pressed && styles.buttonPressed,
]}
```

When `pressed` is `true`, `styles.buttonPressed` is added and the button becomes slightly transparent.

## Component structure

```text
App
└── View
    ├── Text: heading
    ├── CourseCard
    │   ├── Text: title
    │   ├── Text: topic
    │   └── Pressable
    ├── CourseCard
    ├── CourseCard
    └── StatusBar
```

## Component versus ordinary function

A React component should be rendered with JSX:

```jsx
<CourseCard
  title="Cross-Platform Development"
  topic="React Native custom components"
  color="#003755"
/>
```

Do not call a component as an ordinary function:

```jsx
CourseCard(); // Do not render React components this way
```

An ordinary helper function can still be called normally when it is not a component:

```jsx
function createMessage(title) {
  return `Welcome to ${title}`;
}

const message = createMessage('Cross-Platform Development');
```

## Suggested live-demo sequence

You can build the application gradually instead of showing the complete code immediately.

1. Create one course card directly inside `App`.
2. Copy the card to demonstrate repeated code.
3. Move the repeated structure into a `CourseCard` component.
4. Render the component twice with `<CourseCard />`.
5. Add the `title` prop.
6. Add the `topic` and `color` props.
7. Add the `Pressable` component and event handler.
8. Add the pressed-state style.

This sequence demonstrates why custom components and props are useful.

## Try it yourself

### Exercise 1: Add a new card

Add a fourth `CourseCard` with a different title, topic, and color.

### Exercise 2: Add a new prop

Add a `teacher` prop and display the teacher's name in each card.

Example usage:

```jsx
<CourseCard
  title="Cross-Platform Development"
  topic="React Native custom components"
  teacher="Teacher name"
  color="#003755"
/>
```

### Exercise 3: Change the button label

Create a `buttonText` prop so that each card can have a different button label.

### Exercise 4: Experiment with styles

Change the card spacing, border radius, background color, or text sizes. Observe which changes affect all cards and which changes come from props.

## Review questions

1. What is a custom component?
2. Why must a custom component name begin with a capital letter?
3. What is the relationship between `App` and `CourseCard`?
4. What are props used for?
5. Why are curly braces used around `title` and `topic`?
6. Why can the same `CourseCard` component display different content?
7. What is the difference between `onPress={showCourse}` and `onPress={showCourse()}`?
8. Which styles are shared by all cards, and which style value is dynamic?

## Key takeaways

- A custom component is a reusable part of the user interface.
- A component is commonly written as a JavaScript function that returns JSX.
- Custom component names begin with a capital letter.
- Components are rendered using JSX, for example `<CourseCard />`.
- Props pass information from a parent component to a child component.
- The same component can be reused with different prop values.
- A custom component can include layout, styles, props, and event handling.
