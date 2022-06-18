import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import UserInfoProvider from './contexts/userInfoContext';
import Stack from 'react-bootstrap/Stack';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Stack className="min-vh-100">
      <UserInfoProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <ToastContainer />
      </UserInfoProvider>
    </Stack>
  );
}

export default App;
