import DragStudentScreen from './screens/DragStudentScreen';
import SwipeDeleteScreen from './screens/SwipeDeleteScreen';
import StudentChoiceScreen from './screens/StudentChoiceScreen';
import LocationStudentScreen from './screens/LocationStudentScreen';
import StudentMarkersScreen from './screens/StudentMarkersScreen';
import ContinuousStudentLocationScreen from './screens/ContinuousStudentLocationScreen';
import SimulatedLocationScreen from './screens/SimulatedLocationScreen';

// Change only this line:
const DEMO = 7;

export default function App() {
  switch (DEMO) {
    case 1:
      return <DragStudentScreen />;

    case 2:
      return <SwipeDeleteScreen />;

    case 3:
      return <StudentChoiceScreen />;
    
    case 4:
      return <LocationStudentScreen />;

    case 5:
      return <StudentMarkersScreen />;

    case 6:
      return <ContinuousStudentLocationScreen />;

    case 7:
      return <SimulatedLocationScreen />;

    default:
      return <DragStudentScreen />;
  }
}


