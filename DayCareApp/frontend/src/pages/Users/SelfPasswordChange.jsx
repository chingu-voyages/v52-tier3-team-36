// css
import { changePass } from '../../services/authService';
import styles from './UserEdit.module.css';
import { useState } from 'react';

const SelfPasswordChange = ({user, edit}) => {
    const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: user.username,
    new_password: '',
    old_password: ''
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
      const response = await changePass(formData);
      edit()
    } catch (err) {
      console.log(err)
      setMessage(err.message)
    }
  }

  const { username, new_password, old_password } = formData

  const isFormInvalid = () => {
    return !(username && new_password && old_password && new_password === old_password)
  }

  return (
    <main className={styles.container}>
      <section>
        <h1>Change your {user.username} password</h1>
        <p className={styles.message}>{message}</p>
        <form autoComplete="off" onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            New password
            <input
              type="password"
              value={new_password}
              name="new_password"
              onChange={handleChange}
              autoComplete='off'
            />
          </label>
          <label className={styles.label}>
            Current password
            <input
              type="password"
              value={old_password}
              name="old_password"
              onChange={handleChange}
              autoComplete='off'
            />
          </label>
          <div className={styles.actions}>
          <button onClick={() => edit()} className={styles.button}>Cancel</button>
            <button className={styles.button} disabled={isFormInvalid()}>
              Reset
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default SelfPasswordChange;