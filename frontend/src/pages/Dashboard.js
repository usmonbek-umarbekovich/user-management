import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [error, setError] = useState('');
  const selectAllRef = useRef();

  const { user: me, logoutUser } = useUserInfo();
  const navigate = useNavigate();

  const getUsers = useCallback(async () => {
    setIsLoading(true);

    const response = await adminService.getUsers();
    switch (response.statusText) {
      case 'OK': {
        response.data.unshift({ ...me, selected: false });
        response.data.forEach(u => (u.selected = false));
        setUsers(response.data);
        break;
      }
      case 'Unauthorized': {
        setError('You are not authorized to view this page');
        break;
      }
      default: {
        toast.error('Something went wrong. Try loging in again');
        break;
      }
    }
    setIsLoading(false);
  }, [me]);

  useEffect(() => {
    if (me == null) navigate('/login');
    else if (error) {
      logoutUser();
      toast.error(error);
    } else getUsers();

    return () => {
      setError('');
    };
  }, [me, navigate, getUsers, error, logoutUser]);

  // handling checkbox states
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
      // update selected users array
      let newUsers;
      if (user.selected) {
        newUsers = [...prevUsers, user];
      } else {
        newUsers = prevUsers.filter(u => u._id !== user._id);
      }

      // handle "select all" checkbox state
      if (newUsers.length > 0 && newUsers.length < users.length) {
        selectAllRef.current.indeterminate = true;
      } else {
        selectAllRef.current.indeterminate = false;

        if (newUsers.length === users.length) {
          selectAllRef.current.checked = true;
        }
      }

      return newUsers;
    });
  };

  const handleStatus = status => {
    setIsLoading(true);

    // block/unblock selected users
    adminService
      .changeStatus(status, selectedUsers)
      .then(() => {
        if (status === 'blocked' && selectedUsers.find(u => u._id === me._id)) {
          setError('You have been blocked');
          return;
        }

        // reset
        selectedUsers.forEach(u => {
          u.selected = false;
          u.status = status;
        });
        selectAllRef.current.indeterminate = false;
        selectAllRef.current.checked = false;
        setSelectedUsers([]);
      })
      .catch(err => toast.error(err))
      .finally(() => setIsLoading(false));
  };

  const handleDelete = () => {
    setIsLoading(true);

    // delete selected users
    adminService
      .deleteUsers(selectedUsers)
      .then(() => {
        if (selectedUsers.find(u => u._id === me._id)) {
          logoutUser();
          toast.error('You have been deleted from the database');
          return;
        }

        // reset
        selectAllRef.current.checked = false;
        selectAllRef.current.indeterminate = false;
        setUsers(prevUsers => prevUsers.filter(u => !u.selected));
        setSelectedUsers([]);
      })
      .catch(err => toast.error(err))
      .finally(() => setIsLoading(false));
  };

  const formatTime = rawTime => {
    const parsed = new Date(rawTime);
    const intl = new Intl.DateTimeFormat([], {
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
    return intl.format(parsed);
  };

  if (me == null) return null;

  return (
    <>
      {/* Show Spinner while loading data */}
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
      {/* Buttons for BLOCK, UNBLOCK & DELETE users */}
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
      {/* List of users in the database */}
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
              <td>{formatTime(user.lastLogin)}</td>
              <td>{formatTime(user.registrationTime)}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
export default Dashboard;
