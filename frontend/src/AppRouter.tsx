import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Authenticated from './Authenticated';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/authenticated" element={<Authenticated />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
