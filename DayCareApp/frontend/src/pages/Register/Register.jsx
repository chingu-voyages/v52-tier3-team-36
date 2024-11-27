// npm modules
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';

// css
import styles from './Register.module.css'
import { getGroups } from '../../services/api';

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

  useEffect(() => {
    const fetchGroups = async () => {
      const groupRes = await getGroups();
      setUserGroups(groupRes)
    };
    fetchGroups();
  }, [])

  const handleGroupChange = (evt) => {
    setSelectedGroup(evt.target.value)
  }

  const handleChange = evt => {
    setMessage('')
    setFormData({ ...formData, [evt.target.name]: evt.target.value })
  }

  const handleSubmit = async evt => {
    evt.preventDefault()
    try {
      if (!import.meta.env.VITE_BACK_END_SERVER_URL) {
        throw new Error('No VITE_BACK_END_SERVER_URL in front-end .env')
      }
      if (formData.password !== formData.confirm_password){
        throw new Error('Password and confirm password do not match!')
      }
      formData.groups = [+selectedGroup];
      const response = await register(formData);
      navigate('/')
    } catch (err) {
      console.log(err)
      setMessage(err.message)
    }
  }

  const { username, password, confirm_password, first_name, last_name, email, groups } = formData

  const isFormInvalid = () => {
    return !(username && password && confirm_password && password === confirm_password)
  }

  return (
    <main className={styles.container}>
      <h1>Create user</h1>
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
            {userGroups.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
        <div>
          <Link to="/">Cancel</Link>
          <button className={styles.button} disabled={isFormInvalid()}>
            Create user
          </button>
        </div>
      </form>
    </main>
  )
}

export default RegisterPage
