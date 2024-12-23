// css
import { adminResetPass } from '../../services/authService';
import styles from './UserEdit.module.css';
import { useState } from 'react';
import * as yup from 'yup';
/**
 * Represents a user password reset component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.user - An object representing the selected user.
 * @param {UserDetailsState} props.edit - Set state for the user reset password form.
 * @returns {React.ReactElement} A form for user password reset by the admin. Only requires single password input - no confirmation.
 */
const AdminPasswordChange = ({user, edit, showBanner}) => {
    const [message, setMessage] = useState([]);
  const [formData, setFormData] = useState({
    username: user.username,
    new_password: '',
  })
  // Form validation schema
  const schema = yup.object({
    new_password: yup.string().required('New password is required!'),
  });
  // Handle input change
  const handleChange = evt => {
    setMessage('')
    setFormData({ ...formData, [evt.target.name]: evt.target.value })
  }
  // Submit password reset to backend API endpoint
  const handleSubmit = async evt => {
    evt.preventDefault()
    try {
      if (!import.meta.env.VITE_BACK_END_SERVER_URL) {
        throw new Error('No VITE_BACK_END_SERVER_URL in front-end .env')
      }
      // Validate form
      await schema.validate(formData, { abortEarly: false });
      const response = await adminResetPass(formData);
      // Set editing to false to hide the form
      edit()
      showBanner()
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

  const { username, new_password } = formData
  // Checks if the user has inputed a new password and if a username is known
  const isFormInvalid = () => {
    return !(username && new_password)
  }

  return (
    <main className={styles.container}>
      <section>
        <h1>Reset password for user {user.username}</h1>
        <p className={styles.message}>{message}</p>
        <form autoComplete="off" onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            New password *
            <input
              type="password"
              value={new_password}
              name="new_password"
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
        {message && message.map( (msg, id) => <p className={styles.message} key={id}>{msg}</p>
        )}
      </section>
    </main>
  )
}

export default AdminPasswordChange;