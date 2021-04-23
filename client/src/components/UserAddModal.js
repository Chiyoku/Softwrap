import React, { useContext, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import UserForm from './UserForm';
import { UserContext } from '../contexts/UserContext';
import { createUser, getPage } from '../utils/Api';

function reducer(state, data) {
  if (data.action === 'change') {
    const newState = { ...state };
    newState[data.key] = data.value;
    return newState;
  }
  if (data.action === 'clear') {
    return {
      fullname: '',
    };
  }
  return state;
}

function UserAddModal({ state, setState }) {
  const [users, setUsers] = useContext(UserContext);
  const handleClose = () => setState(false);
  const [user, setProp] = useReducer(reducer, { });
  const setUser = (key, value) => setProp({ key, value, action: 'change' });

  const submitAndClose = async (e) => {
    e.preventDefault();
    if (!user.civil_state)user.civil_state = 0;
    await createUser(user);
    getPage(users.page).then((resp) => setUsers({
      action: 'set',
      page: state.page,
      users: resp.users,
      pages: resp.pages,
    }));
    setProp({ action: 'clear' });
    handleClose();
  };
  return (
    <Modal show={state} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Adicionar usuário</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UserForm id="adduser" user={user} setUser={setUser} onSubmit={submitAndClose} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
        <Button variant="primary" type="submit" form="adduser">
          Adicionar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

UserAddModal.propTypes = {
  state: PropTypes.bool.isRequired,
  setState: PropTypes.func.isRequired,
};

export default UserAddModal;
