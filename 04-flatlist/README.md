# FlatList with a Custom Form Component

This React Native example demonstrates how to display and manage a list with `FlatList` and how to move part of the user interface into a separate custom component.

The application displays a list of fish. The user can add a new fish through a form and delete a fish by pressing and holding a list item.

## Learning objectives

This example demonstrates how to:

- store an array of JavaScript objects in a state variable
- display object data with `FlatList`
- provide stable keys with `keyExtractor`
- render each list item with `renderItem`
- add a new object to an array without changing the existing array directly
- remove an object with the array `filter()` method
- handle normal presses and long presses with `Pressable`
- create a custom React Native component in a separate file
- pass values and functions from a parent component to a child component through props
- display alternative content when a list is empty

## Application features

- Displays three initial fish: Bream, Burbot, and Tench
- Adds a fish by pressing **Add** or submitting the text input
- Prevents empty or whitespace-only names from being added
- Creates a unique string identifier for each new fish
- Deletes a fish with a long press
- Shows a message when the list is empty
- Uses a separate `FishForm` component for the text input and Add button

## Project structure

```text
test-flatlist/
├── App.js
└── components/
    └── FishForm.js
```

## Main component: App.js

`App.js` is the parent component. It owns the application state and contains the `FlatList`.

### State variables

```javascript
const [newFish, setNewFish] = useState('');

const [fishList, setFishList] = useState([
  { fishId: '1', fishName: 'Bream' },
  { fishId: '2', fishName: 'Burbot' },
  { fishId: '3', fishName: 'Tench' },
]);
```

`newFish` stores the current text input value. `fishList` stores an array of fish objects. Each object has two properties:

- `fishId`: a unique identifier used by `FlatList`
- `fishName`: the name displayed to the user

### Adding a fish

The `addFish` function removes leading and trailing whitespace, checks that the name is not empty, creates a new fish object, and adds it to a new array.

```javascript
const addFish = () => {
  const trimmedName = newFish.trim();

  if (trimmedName === '') {
    return;
  }

  const fishToAdd = {
    fishId: Date.now().toString(),
    fishName: trimmedName,
  };

  setFishList((currentFishList) => [
    ...currentFishList,
    fishToAdd,
  ]);

  setNewFish('');
};
```

`Date.now().toString()` is used here to create a simple identifier for classroom demonstration purposes.

### Deleting a fish

The `deleteFish` function creates a new array that excludes the selected fish.

```javascript
const deleteFish = (fishIdToDelete) => {
  setFishList((currentFishList) =>
    currentFishList.filter(
      (fish) => fish.fishId !== fishIdToDelete
    )
  );
};
```

The `filter()` callback returns `true` for the fish that should remain in the array and `false` for the fish that should be removed.

### FlatList

```jsx
<FlatList
  data={fishList}
  keyExtractor={keyHandler}
  renderItem={renderFish}
  ListEmptyComponent={
    <Text style={styles.emptyText}>The list is empty.</Text>
  }
/>
```

The most important props in this example are:

- `data`: the array to display
- `keyExtractor`: a function that returns a unique string key for an item
- `renderItem`: a function that returns the user interface for one item
- `ListEmptyComponent`: content displayed when the data array is empty

### keyExtractor

```javascript
const keyHandler = (item) => {
  console.log('Key:', item.fishId);
  return item.fishId;
};
```

`FlatList` passes one fish object at a time to this function. The function returns its `fishId`. The console message helps demonstrate when `FlatList` requests keys.

### renderItem

```javascript
const renderFish = ({ item, index }) => {
  console.log('Rendering:', item.fishName);

  return (
    <Pressable
      onLongPress={() => deleteFish(item.fishId)}
      style={({ pressed }) => [
        styles.listItem,
        pressed && styles.pressedItem,
      ]}
    >
      <Text style={styles.fishText}>
        {index + 1}. {item.fishName}
      </Text>
    </Pressable>
  );
};
```

The parameter received from `FlatList` is destructured into:

- `item`: the current fish object
- `index`: the current position in the array

The displayed number uses `index + 1` because array indexes begin at zero. A long press calls `deleteFish` with the stable ID of the selected fish.

## Custom component: FishForm.js

`FishForm.js` contains the text input and Add button. It does not own the fish list or the input state. Instead, it receives the required value and functions from `App.js` through props.

### Using the component in App.js

```jsx
<FishForm
  value={newFish}
  onFishInput={setNewFish}
  onAddFish={addFish}
/>
```

Three props are passed to `FishForm`:

- `value`: the current input value
- `onFishInput`: the function used when the input text changes
- `onAddFish`: the function used when the new fish should be added

### Receiving props in FishForm.js

```jsx
<TextInput
  placeholder="Enter a fish name"
  value={props.value}
  onChangeText={props.onFishInput}
  onSubmitEditing={props.onAddFish}
/>

<Pressable onPress={props.onAddFish}>
  <Text>Add</Text>
</Pressable>
```

The prop names used in `FishForm.js` must match the prop names passed from `App.js`.

## Data flow

```text
The user types a fish name
          ↓
FishForm calls props.onFishInput
          ↓
App updates newFish
          ↓
The user presses Add
          ↓
FishForm calls props.onAddFish
          ↓
App adds an object to fishList
          ↓
FlatList renders the updated data
```

The child component provides the form user interface, while the parent component owns and updates the state.

## Running the example

1. Open Command Prompt or a terminal.
2. Navigate to the Expo project folder.
3. Install project dependencies if needed:

```bash
npm install
```

4. If `react-native-safe-area-context` is not already installed, install the Expo-compatible version:

```bash
npx expo install react-native-safe-area-context
```

5. Start the Expo development server:

```bash
npx expo start
```

6. Press `a` in the Expo terminal to open the application in an available Android emulator.

## Testing the application

1. Confirm that the initial fish are displayed.
2. Enter a fish name and press **Add**.
3. Confirm that the new fish appears in the list.
4. Try adding only spaces and confirm that nothing is added.
5. Long press a fish and confirm that it is deleted.
6. Delete every fish and confirm that **The list is empty.** is displayed.
7. Observe the `Key:` and `Rendering:` messages in the Expo terminal or React Native DevTools.

## Notes

- The example keeps the state in `App.js` and moves only the form user interface into `FishForm.js`.
- The application uses object IDs instead of array indexes as FlatList keys.
- The state is updated immutably by creating new arrays with the spread operator and `filter()`.
- Console messages are included for teaching and debugging. In development mode, a message may appear more than once.
- The example uses `SafeAreaView` from `react-native-safe-area-context`, not the deprecated `SafeAreaView` from React Native core.
