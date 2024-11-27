// npm modules
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// contexts
import { useAuth } from '../../contexts/useAuth'

// css
import styles from './Login.module.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const { loginUser } = useAuth();
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

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
      await loginUser(formData);
      navigate('/')
    } catch (err) {
      console.log(err)
      setMessage(err.message)
    }
  }

  const { username, password } = formData

  const isFormInvalid = () => {
    return !(username && password)
  }

  return (
    <main className={styles.container}>
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