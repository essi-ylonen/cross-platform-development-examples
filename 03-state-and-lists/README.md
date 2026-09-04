# State, User Input, and Lists in React Native

This example demonstrates how a React Native application can store changing data, handle text entered by the user, and display items in a list.

The application is a simple **task list**. The user can:

1. Enter a task in the text field.
2. Press **Add Task**.
3. See the new task appear in the list.

## Concepts demonstrated

This example includes:

- the `useState` Hook
- a string state variable
- an array stored in state
- a controlled `TextInput`
- handling user input with `onChangeText`
- handling a button press with `onPress`
- checking and trimming input
- updating an array without changing the original array
- rendering a list with `map()`
- clearing the input field after adding an item

## Main state variables

```jsx
const [task, setTask] = useState('');
const [tasks, setTasks] = useState([]);
```

`task` stores the text currently entered in the input field.

`tasks` stores all tasks that have been added to the list.

The initial value of `task` is an empty string, and the initial value of `tasks` is an empty array.

## Handling user input

```jsx
<TextInput
  style={styles.input}
  placeholder="Enter a task"
  value={task}
  onChangeText={setTask}
/>
```

Every time the user changes the text, `onChangeText` calls `setTask`. This updates the `task` state variable.

Because `value={task}` connects the input field to the state variable, this is called a **controlled input**.

## Adding a task

```jsx
const addTask = () => {
  if (task.trim() === '') {
    return;
  }

  setTasks([...tasks, task.trim()]);
  setTask('');
};
```

The function first checks whether the input contains text. An empty task is not added.

The spread syntax `...tasks` copies the existing tasks into a new array. The new task is then added to the end:

```jsx
[...tasks, task.trim()]
```

Finally, `setTask('')` clears the input field.

## Handling the button press

```jsx
<Button
  title="Add Task"
  onPress={addTask}
/>
```

When the user presses the button, React Native calls the `addTask` function.

Notice that `addTask` is written without parentheses. We give the function to `onPress` so that React Native can call it when the button is pressed.

## Displaying the list

```jsx
{tasks.map((item, index) => (
  <Text key={index}>
    {index + 1}. {item}
  </Text>
))}
```

The `map()` method goes through the `tasks` array. It creates one `Text` component for each task.

- `item` is the current task.
- `index` is the position of the task in the array.
- `index + 1` displays numbering that begins with 1 instead of 0.
- `key` helps React identify the rendered list items.

Using the array index as a key is acceptable for this small demonstration because items are only added. In applications where items can be deleted, reordered, or edited, each item should normally have its own stable and unique ID.

## How to run the example

1. Create or open an Expo React Native project.
2. Replace the contents of the project's `App.js` file with the code in this folder.
3. Save the file.
4. Start the project with:

```bash
npx expo start
```

5. Open the application in an Android emulator or another supported Expo environment.

## Try it yourself

After testing the original example, try one or more of these extensions:

- Change the heading and placeholder text.
- Add some initial tasks to the `tasks` array.
- Show the number of tasks on the screen.
- Add a button for clearing the whole list.
- Investigate how individual tasks could be deleted.

## Key idea

In React Native, the user interface is based on the current state. When a state setter such as `setTask` or `setTasks` changes the state, React renders the relevant parts of the interface again.

The main flow in this example is:

**User types → state changes → user presses the button → list state changes → the screen updates**
