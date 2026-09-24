# Student Interactions

A React Native and Expo demonstration project for practising different kinds of user interaction.

The project contains small examples related to:

- dragging components
- deleting items with a swipe gesture
- checkboxes and radio buttons
- retrieving a device location
- displaying locations on a map
- adding and moving map markers
- continuous location tracking
- simulated location tracking without a map or device location services

The examples are intended for teaching and classroom demonstrations.

## Demo screens

The project currently contains seven demo screens.

| Demo | Screen | Main topic |
|---|---|---|
| 1 | `DragStudentScreen.js` | Dragging a student component |
| 2 | `SwipeDeleteScreen.js` | Deleting an item with a swipe gesture |
| 3 | `StudentChoiceScreen.js` | Checkboxes and radio buttons |
| 4 | `LocationStudentScreen.js` | Reading and displaying the current location |
| 5 | `StudentMarkersScreen.js` | Adding, moving and removing map markers |
| 6 | `ContinuousStudentLocationScreen.js` | Continuous location tracking and route visualization |
| 7 | `SimulatedLocationScreen.js` | Simulated location tracking without maps or location services |

## Selecting a demo

Open `App.js` and change the value of the `DEMO` constant:

```javascript
const DEMO = 7;
```

Use the following values:

```text
1 = Drag student
2 = Delete by swipe
3 = Checkbox and radio buttons
4 = Find the current student location
5 = Add and manage map markers
6 = Track the student location continuously
7 = Simulate student location tracking
```

For example, to open the map marker example:

```javascript
const DEMO = 5;
```

The selected screen is returned from the `switch` statement in `App.js`.

## Location examples

### Demo 4: Current student location

`LocationStudentScreen.js` demonstrates how to:

1. request foreground location permission
2. read the current device location
3. store the coordinates in component state
4. update the map region
5. display the location with a marker
6. show the latitude and longitude to the user

The screen uses:

```javascript
Location.requestForegroundPermissionsAsync();
```

and:

```javascript
Location.getCurrentPositionAsync();
```

If the device location cannot be read, the current example uses predefined HAMK coordinates as a simulated fallback.

### Demo 5: Student study spots

`StudentMarkersScreen.js` demonstrates how to manage markers on a map.

The user can:

- long-press the map to add a study spot
- drag a marker to another location
- press a marker callout to remove the marker
- clear all markers
- see how many markers are stored in component state

The markers are temporary. They are stored in React state and are not saved permanently.

### Demo 6: Continuous student location

`ContinuousStudentLocationScreen.js` demonstrates continuous location tracking.

The screen can:

- start location tracking
- stop location tracking
- receive repeated location updates
- save the received coordinates into a route array
- display the latest location with a marker
- draw the route with a polyline
- reset the route

The example uses:

```javascript
Location.watchPositionAsync();
```

The watcher is removed when tracking stops or when the component is unmounted.

### Demo 7: Simulated location tracking

`SimulatedLocationScreen.js` provides a location demonstration that does not require:

- a Google Maps API key
- `react-native-maps`
- device GPS
- emulator location services
- location permissions

The screen uses a predefined array of coordinates and a JavaScript timer to simulate movement.

The user can:

- start and stop simulated tracking
- reset the simulated route
- follow the current route step
- view visited coordinates
- view a movement log
- add markers with custom names
- remove the latest marker
- inspect the marker array

This screen is useful if maps or location services are unavailable in the teaching environment.

## Project structure

```text
student-interactions/
├── assets/
├── screens/
│   ├── DragStudentScreen.js
│   ├── SwipeDeleteScreen.js
│   ├── StudentChoiceScreen.js
│   ├── LocationStudentScreen.js
│   ├── StudentMarkersScreen.js
│   ├── ContinuousStudentLocationScreen.js
│   └── SimulatedLocationScreen.js
├── App.js
├── app.json
├── package.json
└── README.md
```

## Technologies and libraries

The project uses:

- React Native
- Expo
- React Hooks
- Expo Location
- React Native Maps
- React Native Safe Area Context

The examples use hooks such as:

```javascript
useState
useEffect
useRef
```

## Installation

Clone the repository and move to the project folder:

```bash
git clone YOUR-REPOSITORY-URL
cd student-interactions
```

Install the project dependencies:

```bash
npm install
```

If the location and map packages are not already installed, install them with Expo:

```bash
npx expo install expo-location react-native-maps react-native-safe-area-context
```

Start the development server:

```bash
npx expo start
```

You can then open the project using an Android emulator, an iOS simulator, Expo Go, or another supported Expo development environment.

## Google Maps API key

The map-based screens require a valid Google Maps API key when using a build or environment that requires native Google Maps configuration.

Add your own key to `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```

Do not commit an actual private API key to a public GitHub repository.

The repository version of `app.json` should contain an empty value or a clear placeholder:

```json
"apiKey": ""
```

or:

```json
"apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
```

> Important: Standard JSON does not support comments. Do not add a `// comment` after the API key inside `app.json`, because that can make the JSON invalid.

## Android emulator location

The map screens need location data from the device or emulator.

When using an Android emulator, a simulated location can be configured through the emulator controls:

1. Open the Android emulator.
2. Open the extended controls.
3. Select **Location**.
4. Search for or enter a location.
5. Send the location to the emulator.
6. Return to the Expo application.
7. Run one of the location demos.

The exact emulator controls may vary depending on the Android Studio version.

## Location permissions

The location screens request foreground location permission while the application is running.

If permission is denied:

- the current location cannot be retrieved
- continuous tracking cannot start
- the user receives a permission message

If permission was previously denied, it may need to be enabled from the device or emulator application settings.

## Troubleshooting

### The map does not appear

Check that:

- `react-native-maps` is installed
- the selected environment supports the map implementation
- the Google Maps API key is correctly configured when required
- the appropriate Google Maps service is enabled for the key
- the device or emulator has an internet connection
- the application has been rebuilt after native configuration changes

If maps are unavailable, select Demo 7:

```javascript
const DEMO = 7;
```

The simulated location example does not require a map.

### The location is not updated

Check that:

- location permission has been granted
- device location services are enabled
- the emulator has received a simulated location
- the selected accuracy mode is supported
- the application is running in the foreground

### The API key is not recognized

Changes to native configuration in `app.json` may require a new development or native build. Restarting only the JavaScript development server may not apply every native configuration change.

### The project opens the wrong screen

Check the `DEMO` value in `App.js`:

```javascript
const DEMO = 4;
```

Make sure the value is between `1` and `7`.

## Learning objectives

After exploring the examples, students should be able to:

- use React state to update the user interface
- respond to press, drag, swipe and long-press interactions
- request foreground location permission
- retrieve location coordinates
- display coordinates as text
- render a location marker
- add, update and remove objects from an array in state
- subscribe to continuous location updates
- clean up a location watcher or timer
- visualize a route as a sequence of coordinates
- create a simulated alternative when device services are unavailable

## Notes

- Marker data is stored only in component state.
- Restarting or reloading the application clears unsaved marker and route data.
- The simulated route uses predefined coordinates near the HAMK campus.
- The project is designed as a collection of separate teaching demonstrations rather than a complete production application.
