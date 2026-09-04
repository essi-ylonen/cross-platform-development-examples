# FlatList with an Insert Modal

This React Native example demonstrates how to use a `Modal` to add new items to a `FlatList`.

The application displays a list of fish. The user can open a modal, enter a fish name, and add it to the list. A fish can also be deleted by pressing and holding its list item.

## Learning objectives

This example demonstrates how to:

- store an array of JavaScript objects in state
- display object data with `FlatList`
- identify list items with `keyExtractor`
- define the appearance and behavior of list items with `renderItem`
- control the visibility of a `Modal` with a Boolean state variable
- open and close a modal by updating state
- handle user input with `TextInput`
- add a new object to an array without directly modifying the existing array
- remove an object from an array with `filter()`
- handle presses and long presses with `Pressable`
- clear a text input after adding or cancelling

## Application features

- Displays three initial fish: Bream, Burbot, and Tench
- Opens an insert form in a modal
- Adds a new fish to the FlatList
- Prevents empty or whitespace-only names from being added
- Creates a simple unique string identifier for each new fish
- Clears the input and closes the modal after adding a fish
- Clears the input and closes the modal when the user presses **Cancel**
- Deletes a fish with a long press
- Provides visual feedback while a list item is pressed

## Project structure

```text
test-modal-view/
└── App.js
```

## State variables

The application has three state variables:

```javascript
const [showModal, setShowModal] = useState(false);
const [newFish, setNewFish] = useState('');
const [fishList, setFishList] = useState([
  { fishId: '1', fishName: 'Bream' },
  { fishId: '2', fishName: 'Burbot' },
  { fishId: '3', fishName: 'Tench' },
]);
```

- `showModal` determines whether the modal is visible.
- `newFish` stores the current value of the text input.
- `fishList` stores the fish objects displayed by the FlatList.

Each fish object has two properties:

```javascript
{
  fishId: '1',
  fishName: 'Bream'
}
```

- `fishId` is the stable identifier used as the FlatList key.
- `fishName` is the value displayed to the user.

## Opening the modal

The initial value of `showModal` is `false`, so the modal is hidden when the application starts.

```javascript
const openModal = () => {
  setShowModal(true);
};
```

The **Add New Fish** button calls `openModal`:

```jsx
<Pressable
  onPress={openModal}
  style={styles.openButton}
>
  <Text style={styles.buttonText}>
    Add New Fish
  </Text>
</Pressable>
```

When `showModal` changes to `true`, React Native renders the modal as visible.

## The Modal component

```jsx
<Modal
  visible={showModal}
  animationType="slide"
  transparent={true}
>
```

The modal uses the following props:

- `visible` connects the modal to the `showModal` state variable.
- `animationType="slide"` makes the modal slide onto the screen.
- `transparent={true}` allows the content behind the modal to remain visible through the custom background layer.

The semi-transparent background is created with this style:

```javascript
modalBackground: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.3)',
},
```

The modal contains:

- a heading
- a `TextInput`
- a **Cancel** button
- an **Add** button

## Handling the input

```jsx
<TextInput
  style={styles.input}
  placeholder="Enter a fish name"
  value={newFish}
  onChangeText={setNewFish}
/>
```

The `value` prop displays the current value of `newFish`. When the user types, `onChangeText` calls `setNewFish`, which updates the state.

This makes the input a controlled component because its displayed value comes from React state.

## Adding a fish

```javascript
const addFish = () => {
  const trimmedName = newFish.trim();

  if (trimmedName.length === 0) {
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
  setShowModal(false);
};
```

The function works in the following order:

1. `trim()` removes spaces from the beginning and end of the input.
2. The function returns without adding anything if the remaining value is empty.
3. A new fish object is created.
4. `Date.now().toString()` creates a simple string identifier for the classroom example.
5. The spread operator copies the existing fish into a new array.
6. The new fish is added to the end of that array.
7. `setFishList` stores the new array in state.
8. The input is cleared.
9. The modal is closed.

The **Add** button calls the function through its `onPress` prop:

```jsx
<Pressable
  onPress={addFish}
  style={styles.addButton}
>
  <Text style={styles.buttonText}>Add</Text>
</Pressable>
```

## Cancelling the insert

```javascript
const cancelFish = () => {
  setNewFish('');
  setShowModal(false);
};
```

Pressing **Cancel** does not change the fish list. It clears the input and hides the modal.

```jsx
<Pressable
  onPress={cancelFish}
  style={styles.cancelButton}
>
  <Text style={styles.buttonText}>Cancel</Text>
</Pressable>
```

## Displaying data with FlatList

```jsx
<FlatList
  data={fishList}
  keyExtractor={keyHandler}
  renderItem={renderFish}
/>
```

The FlatList uses three important props:

- `data` specifies the array to display.
- `keyExtractor` returns a unique string key for each item.
- `renderItem` defines how one item is rendered.

### keyExtractor

```javascript
const keyHandler = (item) => {
  return item.fishId;
};
```

FlatList passes each fish object to `keyHandler`. The function returns the fish object's stable `fishId` value.

### renderItem

```javascript
const renderFish = ({ item, index }) => {
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

The parameter received from FlatList is destructured into:

- `item`, the current fish object
- `index`, the current position of the fish in the array

The displayed position uses `index + 1` because JavaScript array indexes begin at zero.

The arrow function inside `onLongPress` ensures that `deleteFish` is called only after the user performs a long press. It also passes the selected fish ID to the function.

## Deleting a fish

```javascript
const deleteFish = (fishIdToDelete) => {
  setFishList((currentFishList) =>
    currentFishList.filter(
      (fish) => fish.fishId !== fishIdToDelete
    )
  );
};
```

`filter()` creates a new array. Fish whose IDs do not match `fishIdToDelete` remain in the new array. The selected fish is excluded.

After `setFishList` updates the state, the component renders again and FlatList displays the updated data.

## Application data flow

### Adding an item

```text
Press Add New Fish
        ↓
openModal sets showModal to true
        ↓
The Modal becomes visible
        ↓
Type a name in TextInput
        ↓
setNewFish updates the input state
        ↓
Press Add
        ↓
addFish creates a new object
        ↓
setFishList updates the array
        ↓
The FlatList displays the new fish
        ↓
The input is cleared and the Modal closes
```

### Cancelling

```text
Press Cancel
      ↓
cancelFish clears newFish
      ↓
showModal becomes false
      ↓
The Modal closes without changing fishList
```

### Deleting an item

```text
Long press a fish
        ↓
deleteFish receives its fishId
        ↓
filter creates a new array
        ↓
setFishList updates the state
        ↓
The FlatList displays the remaining fish
```

## Running the example

1. Open Command Prompt or a terminal.
2. Navigate to the Expo project folder.
3. Install the project dependencies if needed:

```bash
npm install
```

4. Start the Expo development server:

```bash
npx expo start
```

5. Press `a` in the Expo terminal to open the application in an available Android emulator.

You can also start the Android version directly with:

```bash
npx expo start --android
```

## Testing the application

1. Confirm that Bream, Burbot, and Tench appear in the list.
2. Press **Add New Fish** and confirm that the modal opens.
3. Enter a fish name and press **Add**.
4. Confirm that the modal closes and the new fish appears in the FlatList.
5. Open the modal again, type text, and press **Cancel**.
6. Reopen the modal and confirm that the input is empty.
7. Try entering only spaces and press **Add**. Confirm that no item is added.
8. Long press a fish and confirm that it is removed from the list.

## Key concepts

### State controls the user interface

The modal is not opened or closed directly. Its visibility is determined by `showModal`. Updating this state causes React Native to render the appropriate user interface.

### The list is derived from state

The FlatList displays the current value of `fishList`. Adding or deleting a fish updates the state, and the user interface follows that state.

### Arrays are updated immutably

The example does not use `push()` or directly remove an element from the existing state array. It creates new arrays with the spread operator and `filter()`.

### Events receive function references

Props such as `onPress` and `onLongPress` receive functions that React Native can call later when the user interacts with the application.

## Notes

- `Date.now().toString()` is suitable for this simple classroom demonstration. In an application connected to a database or REST API, identifiers typically come from the data source.
- The example implements insertion and deletion with local state. The data is reset when the application is restarted.
- The modal is used only for inserting a fish. Updating an existing fish is not implemented in this version.
- The long-press instruction is displayed below the FlatList.

