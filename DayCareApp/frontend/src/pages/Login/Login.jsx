// npm modules
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '@mui/material'
// contexts
import { useAuth } from '../../contexts/useAuth'
// css
import styles from './Login.module.css'
/**
 * Represents a user login component.
 *
 * @component
 * @returns {React.ReactElement} A login form element.
 */
const LoginPage = () => {
  const navigate = useNavigate()
  // The backend API request query from context
  const { loginUser } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  // Handle change in inputs of the form
  const handleChange = evt => {
    setMessage('')
    setFormData({ ...formData, [evt.target.name]: evt.target.value })
  }
  // Submit the form data to backend login API endpoint
  const handleSubmit = async evt => {
    evt.preventDefault()
    try {
      if (!import.meta.env.VITE_BACK_END_SERVER_URL) {
        throw new Error('No VITE_BACK_END_SERVER_URL in front-end .env')
      }
      const success = await loginUser(formData);
      if(success){
        navigate('/')
      } else {
        setMessage('Incorrect username or password.')
      }
      
    } catch (err) {
      setMessage(err.message)
    }
  }
    //Check if success when logging out
    useEffect(() => {
      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams.get('success') === 'true') {
          setShowAlert(true)
          const timeId = setTimeout(() => {
              setShowAlert(false);
          }, 15000)
          
          return () => {
              clearTimeout(timeId)
          }
      }
  }, [navigate])
  const { username, password } = formData
// Check if there is user input in the form input fields
  const isFormInvalid = () => {
    return !(username && password)
  }

  return (
    <main className={styles.container}>
      {showAlert && <Alert severity="info">You have successfully logged out!</Alert>}
      <section>
        <h1>Log In</h1>
        <p className={styles.message}>{message}</p>
        <form autoComplete="off" onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Username
            <input
              type="text"
              value={username}
              name="username"
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
          <div>
            <Link to="/">Cancel</Link>
            <button className={styles.button} disabled={isFormInvalid()}>
              Log In
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
