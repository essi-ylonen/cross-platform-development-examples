import DragStudentScreen from './screens/DragStudentScreen';
import SwipeDeleteScreen from './screens/SwipeDeleteScreen';
import StudentChoiceScreen from './screens/StudentChoiceScreen';

// Change only this line:
const DEMO = 2;

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


