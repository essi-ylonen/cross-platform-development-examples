# Student Interactions

This Expo example demonstrates three common interaction patterns in React Native:

1. dragging a student card
2. deleting a student with a swipe gesture
3. selecting and filtering students with checkboxes and radio buttons

All three demonstrations are included in the same project. The active demonstration is selected in `App.js`.

## Learning objectives

After exploring this example, you should be able to:

- use `PanResponder` to respond to touch gestures
- use the React Native `Animated` API to move interface elements
- recognize a horizontal swipe and compare it with a threshold
- pass data and callback functions to a child component with props
- update and remove array items without mutating React state
- create controlled checkbox and radio-button selections
- filter data before showing it in a `FlatList`
- use accessibility properties with custom controls

## Project structure

```text
student-interactions/
├── App.js
├── components/
│   └── StudentRow.js
└── screens/
    ├── DragStudentScreen.js
    ├── SwipeDeleteScreen.js
    └── StudentChoiceScreen.js
```

> **Note:** File and folder names are case-sensitive in many environments. For example, the import `../components/StudentRow` must match the filename `StudentRow.js` exactly.

## Requirements

You need Node.js, npm, and an Expo development environment. The project also uses these packages:

- `react-native-safe-area-context`
- `expo-checkbox`

If they are not already installed in the project, run:

```bash
npx expo install react-native-safe-area-context expo-checkbox
```

Start the project with:

```bash
npx expo start
```

You can then open the app in Expo Go, an Android emulator, an iOS simulator, or a web browser when the example supports it.

## Selecting a demonstration

`App.js` imports all three screens and uses the `DEMO` constant to decide which one to render.

```js
import DragStudentScreen from './screens/DragStudentScreen';
import SwipeDeleteScreen from './screens/SwipeDeleteScreen';
import StudentChoiceScreen from './screens/StudentChoiceScreen';

// Change only this line:
const DEMO = 1;

export default function App() {
  switch (DEMO) {
    case 1:
      return <DragStudentScreen />;
    case 2:
      return <SwipeDeleteScreen />;
    case 3:
      return <StudentChoiceScreen />;
    default:
      return <DragStudentScreen />;
  }
}
```

Change the number and save `App.js`:

| `DEMO` value | Screen | Topic |
|---:|---|---|
| `1` | `DragStudentScreen` | Drag a student |
| `2` | `SwipeDeleteScreen` | Delete by swipe |
| `3` | `StudentChoiceScreen` | Checkboxes and radio buttons |

Expo Fast Refresh should update the running app after the file is saved.

---

## Part 1: Drag a student

File: `screens/DragStudentScreen.js`

This screen displays one student card. The user can drag the card horizontally and vertically. The example combines `PanResponder`, `Animated.ValueXY`, state, and a ref.

### Try it

1. Set `DEMO` to `1` in `App.js`.
2. Press and drag the student card.
3. Notice that the card changes color while it moves.
4. Move the card more than 120 points horizontally and observe the threshold color.
5. Release the card and watch it return to its original position.
6. Press **Lock card**, try dragging again, and then press **Unlock card**.

### How it works

```js
const pan = useRef(new Animated.ValueXY()).current;
```

`pan` stores the current horizontal and vertical translation. A ref is used so that the same animated value is retained between renders.

```js
const panResponder = useRef(
  PanResponder.create({
    // Gesture handlers
  })
).current;
```

`PanResponder.create()` defines what should happen at different stages of the gesture:

- `onMoveShouldSetPanResponder` determines whether this component should handle the gesture.
- `onPanResponderGrant` runs when dragging begins.
- `onPanResponderMove` updates the animated position while the finger moves.
- `onPanResponderRelease` returns the card to its starting position.
- `onPanResponderTerminate` resets the card if the gesture is interrupted.

The gesture values are connected to the animated values:

```js
onPanResponderMove: Animated.event(
  [null, { dx: pan.x, dy: pan.y }],
  {
    useNativeDriver: false,
    listener: (_, gestureState) => {
      // Change the card color according to the drag distance
    },
  }
)
```

The card moves because the animated values are used in its transform:

```js
transform: [
  { translateX: pan.x },
  { translateY: pan.y },
]
```

### Data flow

1. The user touches and moves the student card.
2. `PanResponder` receives the gesture.
3. `Animated.event` copies `dx` and `dy` to `pan.x` and `pan.y`.
4. The transform moves the `Animated.View`.
5. The listener compares the horizontal distance with the 120-point threshold.
6. React state changes the card color.
7. On release, `Animated.timing` returns the card to `{ x: 0, y: 0 }`.

### State and refs

- `cardColor` is state because changing it must update the displayed color.
- `locked` is state because its value affects the button and status text.
- `canDrag` is a ref because the gesture handler needs the latest lock value without recreating the responder.
- `pan` is a ref containing an animated value that must persist between renders.

---

## Part 2: Delete by swipe

Files:

- `screens/SwipeDeleteScreen.js`
- `components/StudentRow.js`

This demonstration divides the work between a screen and a reusable row component.

- `SwipeDeleteScreen` owns the student array and deletes students from state.
- `StudentRow` handles the swipe animation and reports a deletion through the `onDelete` prop.

### Try it

1. Set `DEMO` to `2` in `App.js`.
2. Swipe a student row to the left.
3. When the swipe passes the threshold, release the row.
4. Press the revealed **Delete** action.
5. Delete all students to see the empty-list message.

### Parent component: `SwipeDeleteScreen`

The list is stored in state:

```js
const [students, setStudents] = useState(INITIAL_STUDENTS);
```

A student is removed with `filter()`:

```js
const deleteStudent = (id) => {
  setStudents((currentStudents) =>
    currentStudents.filter((student) => student.id !== id)
  );
};
```

`filter()` creates a new array containing every student except the one with the matching ID. This is an immutable state update.

Each `FlatList` item creates a `StudentRow` and passes two props:

```js
<StudentRow student={item} onDelete={deleteStudent} />
```

- `student` contains the row data.
- `onDelete` is the parent component's deletion function.

### Child component: `StudentRow`

The row accepts props:

```js
export default function StudentRow({ student, onDelete }) {
```

The delete threshold is negative because the allowed gesture moves to the left:

```js
const DELETE_THRESHOLD = -110;
```

Vertical scrolling and accidental movement are reduced by starting the row gesture only when:

- horizontal movement is greater than 8 points, and
- horizontal movement is greater than vertical movement.

```js
onMoveShouldSetPanResponder: (_, gestureState) =>
  Math.abs(gestureState.dx) > 8 &&
  Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
```

Movement is restricted so the row cannot be dragged to the right:

```js
const x = Math.min(0, gestureState.dx);
pan.setValue({ x, y: 0 });
```

When the user releases the row:

- a swipe beyond `-110` leaves the row open at `-110`
- a shorter swipe calls `resetRow()` and returns the row to its starting position

The red delete action is behind the animated white row. Its text gradually appears through interpolation:

```js
const deleteOpacity = pan.x.interpolate({
  inputRange: [DELETE_THRESHOLD, 0],
  outputRange: [1, 0],
  extrapolate: 'clamp',
});
```

Pressing the action passes the selected student's ID to the parent:

```js
onPress={() => onDelete(student.id)}
```

### Data flow

1. `SwipeDeleteScreen` gives one student and the `deleteStudent` callback to `StudentRow`.
2. The user swipes the row to the left.
3. `StudentRow` updates its local animated position.
4. Passing the threshold changes the row's visual state.
5. Releasing after the threshold leaves the delete action visible.
6. The user presses **Delete**.
7. `StudentRow` calls `onDelete(student.id)`.
8. The parent uses `filter()` to create a new student array.
9. Updating state causes `FlatList` to render without the deleted student.

### Why use a separate row component?

Keeping the gesture logic in `StudentRow` makes the screen easier to read and makes the swipeable row reusable. The parent manages application data, while the child manages the interaction for one row.

---

## Part 3: Checkboxes and radio buttons

File: `screens/StudentChoiceScreen.js`

This screen demonstrates two different selection patterns:

- radio buttons choose one programme filter
- checkboxes select zero, one, or several students

### Try it

1. Set `DEMO` to `3` in `App.js`.
2. Select **All**, **Computer Applications**, or **Business IT**.
3. Observe how the displayed list changes.
4. Select or clear individual students with checkboxes.
5. Observe the selected-student count.
6. Press **Remove selected**.
7. Notice that the button is disabled when no students are selected.

### Radio buttons: select one option

The programme options are stored in an array:

```js
const PROGRAMMES = ['All', 'Computer Applications', 'Business IT'];
```

`selectedProgramme` stores the one currently selected value:

```js
const [selectedProgramme, setSelectedProgramme] = useState('All');
```

The custom `RadioOption` component receives:

- `label`, the text to display
- `selected`, whether this option matches the current state
- `onPress`, the function that updates the selection

The radio option also uses `accessibilityRole="radio"` and reports its checked state with `accessibilityState`.

### Filtering with `useMemo`

The visible list is derived from `students` and `selectedProgramme`:

```js
const filteredStudents = useMemo(() => {
  if (selectedProgramme === 'All') return students;

  return students.filter(
    (student) => student.programme === selectedProgramme
  );
}, [students, selectedProgramme]);
```

`useMemo` recalculates the filtered list when either dependency changes. The original `students` state still contains the complete current list.

### Checkboxes: select many options

Each student has a Boolean `selected` property. The checkbox is controlled by that value:

```js
<Checkbox
  value={item.selected}
  onValueChange={() => toggleStudent(item.id)}
/>
```

`toggleStudent()` uses `map()` to create a new array. It also creates a new object only for the student whose selection changes:

```js
const toggleStudent = (id) => {
  setStudents((currentStudents) =>
    currentStudents.map((student) =>
      student.id === id
        ? { ...student, selected: !student.selected }
        : student
    )
  );
};
```

### Removing selected students

The selected count is derived from state:

```js
const selectedCount = students.filter(
  (student) => student.selected
).length;
```

The selected students are removed by keeping only students whose `selected` value is `false`:

```js
const removeSelected = () => {
  setStudents((currentStudents) =>
    currentStudents.filter((student) => !student.selected)
  );
};
```

The button is disabled when `selectedCount === 0`.

### Data flow

1. The user presses a radio option.
2. `setSelectedProgramme()` updates the selected programme.
3. `filteredStudents` is recalculated.
4. `FlatList` renders the filtered result.
5. The user changes a checkbox.
6. `toggleStudent(id)` creates a new array with the student's `selected` value reversed.
7. React renders the checkbox and selected count from the updated state.
8. The user presses **Remove selected**.
9. `filter()` creates a new array containing only unselected students.
10. React renders the updated list.

---

## Key concepts compared

| Concept | Drag example | Swipe-delete example | Choice example |
|---|---|---|---|
| Main interaction | Free two-dimensional drag | Left-only horizontal swipe | Press controls |
| Main gesture tool | `PanResponder` | `PanResponder` | `Pressable` and `Checkbox` |
| Animation | Position and return animation | Row translation and opacity | None |
| Main state | Lock status and card color | Student array in parent | Students and programme filter |
| Array operation | Not required | `filter()` | `map()` and `filter()` |
| Component communication | One screen | Parent and child props | Local helper component |
| List | No | `FlatList` | Filtered `FlatList` |

## Important React patterns

### Do not mutate state directly

Create a new array when state changes:

```js
setStudents((currentStudents) =>
  currentStudents.filter((student) => student.id !== id)
);
```

Avoid operations such as directly changing an item inside the existing state array.

### Use stable IDs

Every student has an `id`, and `FlatList` uses it as a key:

```js
keyExtractor={(student) => student.id}
```

The ID is also used to identify the student to toggle or delete.

### Pass callbacks from parent to child

The swipe example uses a common React data-flow pattern:

```text
Parent state
   ↓ props
Child row
   ↓ callback with student ID
Parent state update
   ↓
Updated list
```

Data travels down through props, and events travel up through callback functions.

## Suggested experiments

Try these extensions after you understand the original examples:

1. Change the drag threshold from `120` to another value.
2. Replace `Animated.timing` with `Animated.spring` in the drag example.
3. Add a **Reset students** button to the swipe-delete screen.
4. Require a confirmation before deleting a swiped student.
5. Display the number of students currently visible after filtering.
6. Add another programme to `PROGRAMMES` and `INITIAL_STUDENTS`.
7. Add a **Select all visible** action to the choice screen.
8. Extract the custom radio option into its own component file.

## Troubleshooting

### Unable to resolve `StudentRow`

Check that:

- the file is named exactly `StudentRow.js`
- it is inside the `components` folder
- `SwipeDeleteScreen.js` contains this import:

```js
import StudentRow from '../components/StudentRow';
```

### Cannot find `expo-checkbox`

Install it with Expo:

```bash
npx expo install expo-checkbox
```

Then restart the development server if necessary.

### The wrong screen is displayed

Check the value of `DEMO` in `App.js`, save the file, and make sure it is `1`, `2`, or `3`.

### Changes do not appear

Save the edited file. If Fast Refresh does not update the app, reload the app from the Expo developer menu or restart the Expo development server.

## Summary

This project demonstrates three ways users can interact with student data in a React Native application:

- `DragStudentScreen` uses gesture events and animated values to move a card.
- `SwipeDeleteScreen` and `StudentRow` combine a reusable gesture component with parent-owned list state.
- `StudentChoiceScreen` uses radio buttons for one choice, checkboxes for multiple choices, and immutable array operations to update the interface.

Together, the examples show how user input flows through event handlers, state updates, props, derived data, and React rendering.

