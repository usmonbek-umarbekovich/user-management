import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserInfo } from '../contexts/userInfoContext';
import adminService from '../features/adminService';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { FaUnlockAlt, FaTrashAlt } from 'react-icons/fa';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const selectAllRef = useRef();

  const { user: me, logoutUser } = useUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (me == null) navigate('/login');
    else {
      setIsLoading(true);
      adminService.getUsers().then(data => {
        data.unshift({ ...me, selected: false });
        data.forEach(u => (u.selected = false));
        setUsers(data);
        setIsLoading(false);
      });
    }
  }, [me, navigate]);

  const handleChange = (e, user) => {
    if (user === null) {
      users.forEach(u => {
        u.selected = e.target.checked;
      });

      if (e.target.checked) setSelectedUsers(users);
      else setSelectedUsers([]);
      return;
    }

    user.selected = e.target.checked;
    setSelectedUsers(prevUsers => {
      if (user.selected) return [...prevUsers, user];

      return prevUsers.filter(u => u._id !== user._id);
    });
  };

  const handleStatus = status => {
    setIsLoading(true);

    // block/unblock selected users
    adminService.changeStatus(status, selectedUsers).then(() => {
      if (status === 'blocked' && selectedUsers.find(u => u._id === me._id)) {
        logoutUser();
        toast.info('You have been blocked');
        return;
      }

      selectedUsers.forEach(u => {
        u.selected = false;
        u.status = status;
      });
      selectAllRef.current.checked = false;
      setSelectedUsers(_ => []);
      setIsLoading(_ => false);
    });
  };

  const handleDelete = () => {
    setIsLoading(true);

    // delete selected users
    adminService.deleteUsers(selectedUsers).then(() => {
      if (selectedUsers.find(u => u._id === me._id)) {
        logoutUser();
        toast.error('You have been deleted from the database');
        return;
      }

      selectAllRef.current.checked = false;
      setUsers(prevUsers => prevUsers.filter(u => !u.selected));
      setSelectedUsers([]);
      setIsLoading(false);
    });
  };

  if (me == null) return null;

  return (
    <>
      {isLoading ? (
        <div className="overlay position-fixed w-100 h-100 bg-opacity-25 bg-black d-flex">
          <Spinner
            animation="grow"
            role="status"
            variant="primary"
            className="m-auto"
            style={{ width: '5rem', height: '5rem' }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : null}
      <Stack direction="horizontal" gap={4} className="align-items-center p-2">
        <Button
          variant="danger"
          disabled={selectedUsers.length === 0}
          onClick={() => handleStatus('blocked')}>
          Block
        </Button>
        <Button
          variant="outline-info"
          disabled={selectedUsers.length === 0}
          onClick={() => handleStatus('active')}>
          <FaUnlockAlt />
        </Button>
        <Button
          variant="outline-danger"
          disabled={selectedUsers.length === 0}
          onClick={handleDelete}>
          <FaTrashAlt />
        </Button>
      </Stack>
      <Table bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th>
              <Form.Check
                ref={selectAllRef}
                aria-label="select all the users"
                onChange={e => handleChange(e, null)}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login</th>
            <th>Registration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr
              key={user._id}
              className={`${user._id === me._id ? 'table-warning' : ''} ${
                user.selected ? 'table-active' : ''
              }`}>
              <td>
                <Form.Check
                  aria-label={`select ${user.name}`}
                  checked={user.selected}
                  onChange={e => handleChange(e, user)}
                />
              </td>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.lastLogin}</td>
              <td>{user.registrationTime}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
export default Dashboard;
