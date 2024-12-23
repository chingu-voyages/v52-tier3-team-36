// npm modules
import { useState } from 'react';
import { editRecord } from '../../services/api.js';
import * as yup from 'yup';
// css
import styles from './UserEdit.module.css';
/**
 * Represents a user details edit form component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.user - An object representing the selected user.
 * @param {UserDetailsState} props.edit - Set state for the user reset password form.
 * @param {UserDetailsState} props.editedUser - Set state with the new inputs from the edit form
 * @returns {React.ReactElement} A form for editing user infomration.
 */
const UserEdit = ({curUser, user, edit, editedUser, userGroups}) => {
  const [message, setMessage] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(user.groups[0]);
  const [isActive, setIsActive] = useState(user.is_active);
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    is_active: user.is_active,
    groups: user.groups
  })
  // Form validation schema
  const schema = yup.object({
    first_name: yup.string().required('First name is required!'),
    last_name: yup.string().required('Last name is required!'),
    email: yup.string().email('Please enter a valid email address!').required('Email is required!'),
    groups: yup.number().required('Please select a user group!')
  });
  // Handle change for selected group
  const handleGroupChange = (evt) => {
    setSelectedGroup(evt.target.value)
  }
  // Handle change of is_active checkbox
  const handleIsActiveChange = (event) => {
    setIsActive(event.target.checked);
  };
  // Handle change for text inputs
  const handleChange = evt => {
    setMessage([])
    setFormData({ ...formData, [evt.target.name]: evt.target.value })
  }
  // Submit user edit form to backend API endpoint
  const handleSubmit = async evt => {
    evt.preventDefault()
    try {
      if (!import.meta.env.VITE_BACK_END_SERVER_URL) {
        throw new Error('No VITE_BACK_END_SERVER_URL in front-end .env')
      }
      // Add selected group to form and make sure it is an integer
      formData.groups = [+selectedGroup];
      formData.is_active = isActive;
      formData.username = user.username;
      // Validate form
      await schema.validate(formData, { abortEarly: false });
      const response = await editRecord(formData, user.url);
      // Set new user details to state
      editedUser(formData)
      edit()
    } catch (err) {
      if(err?.inner){
        const newErrors= [];
        err.inner.forEach((error) => {
          newErrors.push(error.message)
        })
        setMessage(newErrors)
      } else {
        setMessage([err.message])
      }
    }
  }

  const { first_name, last_name, email, is_active, groups } = formData
  // Check if all form inputs are filled
  const isFormInvalid = () => {
    return !(first_name, last_name, email, selectedGroup)
  }

  return (
    <main className={styles.container}>
      <section>
        <h1>Edit user {user.username}</h1>
        <form autoComplete="off" onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            First name
            <input
              type="text"
              value={first_name}
              name="first_name"
              onChange={handleChange}
              autoComplete='on'
            />
          </label>
          <label className={styles.label}>
            Last name
            <input
              type="text"
              value={last_name}
              name="last_name"
              onChange={handleChange}
              autoComplete='on'
            />
          </label>
          <label className={styles.label}>
            Email address
            <input
              type="email"
              value={email}
              name="email"
              onChange={handleChange}
              autoComplete='on'
            />
          </label>
          { curUser.permissions.edit_user &&
          <label className={styles.label}>
            Groups
            <select name="groups" value={selectedGroup} onChange={handleGroupChange} disabled={!curUser.permissions.edit_users}>
              <option key="blank-group">Select user group</option>
              {userGroups.map((option) => (
                <option key={option.id} value={option.id}>
                {option.name}
              </option>
              ))}
            </select>
          </label>
}
          <label className={styles.label}>
              Active
              <input
                type="checkbox"
                name="is_active"
                checked={isActive}
                onChange={handleIsActiveChange}
                autoComplete='off'
              />
          </label>
          <div className={styles.actions}>
            <button onClick={() => edit()} className={styles.button}>Cancel</button>
            <button className={styles.button} disabled={isFormInvalid()}>
              Submit
            </button>
          </div>
        </form>
        {message && message.map( (msg, id) => <p className={styles.message} key={id}>{msg}</p>
        )}
      </section>
    </main>
  )
}

export default UserEdit;
