// npm modules
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
// css
import styles from './Register.module.css'
import { getGroups } from '../../services/api';
/**
 * Represents a user registration component.
 *
 * @component
 * @returns {React.ReactElement} A user registration form element.
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [userGroups, setUserGroups] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedGroup, setSelectedGroup] = useState();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    confirm_password: '',
    groups: ''
  })
  // Fetch user groups to show a select element
  useEffect(() => {
    const fetchGroups = async () => {
      const groupRes = await getGroups();
      setUserGroups(groupRes)
    };
    fetchGroups();
  }, [])
  // Handle change in the group select element
  const handleGroupChange = (evt) => {
    setSelectedGroup(evt.target.value)
  }
  // Handle change in the text input elements
  const handleChange = evt => {
    setMessage('')
    setFormData({ ...formData, [evt.target.name]: evt.target.value })
  }
  // Submit user registration form to the backend API endpoint
  const handleSubmit = async evt => {
    evt.preventDefault()
    try {
      if (!import.meta.env.VITE_BACK_END_SERVER_URL) {
        throw new Error('No VITE_BACK_END_SERVER_URL in front-end .env')
      }
      if (formData.password !== formData.confirm_password){
        throw new Error('Password and confirm password do not match!')
      }
      // Set the group from the selected option and make sure it is an integer
      formData.groups = [+selectedGroup];
      const response = await register(formData);
      if(response.username[0] === 'A user with that username already exists.'){
        throw new Error('A user with that username already exists.')
      }
      navigate('/')
    } catch (err) {
      console.error(err)
      setMessage(err.message)
    }
  }

  const { username, password, confirm_password, first_name, last_name, email, groups } = formData
  // Check for user input in the form input fields
  const isFormInvalid = () => {
    return !(username && password && selectedGroup && confirm_password)
  }

  return (
    <main className={styles.container}>
      <section>
        <h1>Add user</h1>
        <p className={styles.message}>{message}</p>
        <form autoComplete="off" onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Username
            <input
              type="text"
              value={username}
              name="username"
              onChange={handleChange}
              autoComplete='off'
            />
          </label>
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
          <label className={styles.label}>
            Password
            <input
              type="password"
              value={password}
              name="password"
              onChange={handleChange}
              autoComplete='off'
            />
          </label>
          <label className={styles.label}>
            Confirm password
            <input
              type="password"
              value={confirm_password}
              name="confirm_password"
              onChange={handleChange}
              autoComplete='off'
            />
          </label>
          <label className={styles.label}>
            Groups
            <select value={selectedGroup} onChange={handleGroupChange}>
              <option key="blank-group">Select user group</option>
              {userGroups.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.actions}>
            <Link to="/" className={styles.button}>Cancel</Link>
            <button className={styles.button} disabled={isFormInvalid()}>
              Submit
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default RegisterPage
