// css
import { changePass } from '../../services/authService';
import styles from './UserEdit.module.css';
import { useState } from 'react';

const SelfPasswordChange = ({user, edit}) => {
    const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: user.username,
    new_password: '',
    confirm_password: '',
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
      if (formData.new_password !== formData.confirm_password){
        throw new Error('Password and confirm password do not match!')
      }
      const response = await changePass(formData);
      edit()
    } catch (err) {
      console.log(err)
      setMessage(err.message)
    }
  }

  const { username, new_password, confirm_password, old_password } = formData

  const isFormInvalid = () => {
    return !(username && new_password && old_password && new_password !== old_password)
  }

  return (
    <main className={styles.container}>
      <section>
        <h1>Change your {user.username} password</h1>
        <p className={styles.message}>{message}</p>
        <form autoComplete="off" onSubmit={handleSubmit} className={styles.form}>
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
            Confirm password
            <input
              type="password"
              value={confirm_password}
              name="confirm_password"
              onChange={handleChange}
              autoComplete='off'
            />
          </label>
          <div className={styles.actions}>
          <button onClick={() => edit()} className={styles.button}>Cancel</button>
            <button className={styles.button} disabled={isFormInvalid()}>
              Change
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default SelfPasswordChange;