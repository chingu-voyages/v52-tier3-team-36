// css
import { changePass } from '../../services/authService';
import styles from './UserEdit.module.css';
import { useState } from 'react';
import * as yup from 'yup';
/**
 * Represents a user password se;f change component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.user - An object representing the selected user.
 * @param {UserDetailsState} props.edit - Set state for the user reset password form.
 * @returns {React.ReactElement} A form for self user password chnage. Requires current password and new password confirmation.
 */
const SelfPasswordChange = ({user, edit, showBanner}) => {
    const [message, setMessage] = useState([]);
  const [formData, setFormData] = useState({
    username: user.username,
    new_password: '',
    confirm_password: '',
    old_password: ''
  })
  // Form validation schema
  const schema = yup.object({
    old_password: yup.string().required('Current password is required!'),
    new_password: yup.string().min(8, 'New password must be at least 8 characters!').required('Password is required!').notOneOf([yup.ref('old_password'), null], 'New password cannot be the same as current password!'),
    confirm_password: yup.string().min(8).required('Password confirmation is required').oneOf([yup.ref('new_password'), null], 'Passwords must match!'),
  });
  // Handle input change
  const handleChange = evt => {
    setMessage([])
    setFormData({ ...formData, [evt.target.name]: evt.target.value })
  }
  // Submit form data to the backend API endpoint
  const handleSubmit = async evt => {
    evt.preventDefault()
    try {
      if (!import.meta.env.VITE_BACK_END_SERVER_URL) {
        throw new Error('No VITE_BACK_END_SERVER_URL in front-end .env')
      }
      // Validate form
      await schema.validate(formData, { abortEarly: false });
      const response = await changePass(formData);
      // Hides the form after submission
      edit()
      // Show banner
      showBanner();
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

  const { username, new_password, confirm_password, old_password } = formData
  // Checks if form has user input
  const isFormInvalid = () => {
    return !(username && new_password && old_password)
  }

  return (
    <main className={styles.container}>
      <section>
        <h1>Change your {user.username} password</h1>
        <form autoComplete="off" onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
            Current password *
            <input
              type="password"
              value={old_password}
              name="old_password"
              onChange={handleChange}
              autoComplete='off'
            />
          </label>
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
          <label className={styles.label}>
            Confirm password *
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
        {message && message.map( (msg, id) => <p className={styles.message} key={id}>{msg}</p>
        )}
      </section>
    </main>
  )
}

export default SelfPasswordChange;