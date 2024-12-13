// npm modules
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// css
import styles from './Register.module.css'
import { registerChild } from '../../services/api';
/**
 * Represents a child registration component.
 *
 * @component
 * @returns {React.ReactElement} A child registration form element.
 */
const RegisterChildPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [selectedParent, setSelectedParent] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    notes: '',
    dob: '',
    gender: '',
    address: '',
    em_contact_name: '',
    em_contact_number: '',
    parent: ''
  })
  // Get a list of parents from the navigation state
  const {state} = useLocation();
 
  const parents = state.parents
  // Set the accepted gender options
  const genderOptions = [
    {name: "Male", value:"MALE"},
    {name: "Female", value:"FEMALE"},
    {name: "Other", value:"OTHER"},
    {name: "Prefer not to say", value:"NOT"}
  ]
  // Handle change when selecting a parent from parent select element
  const handleParentChange = (evt) => {
    setSelectedParent(evt.target.value)
  }
  // Handle change when selecting gender from gender select element
  const handleGenderChange = (evt) => {
    setSelectedGender(evt.target.value)
  }
  // Handle change for text inputs
  const handleChange = evt => {
    setMessage('')
    setFormData({ ...formData, [evt.target.name]: evt.target.value })
  }
  // Submit the new child registration to the backend API endpoint
  const handleSubmit = async evt => {
    evt.preventDefault()
    try {
      if (!import.meta.env.VITE_BACK_END_SERVER_URL) {
        throw new Error('No VITE_BACK_END_SERVER_URL in front-end .env')
      }
      // Add selected gender and parent to the form data
      formData.gender = selectedGender;
      formData.parent = +selectedParent;
      const response = await registerChild(formData);
      if(response){
        navigate('/')
      } else {
        setMessage('There was an issue registering the child')
      }
    } catch (err) {
      console.log(err)
      setMessage(err.message)
    }
  }

  const { first_name, last_name, notes, dob, address, gender, em_contact_name, em_contact_number, parent } = formData
  // Check if there is user input in the form fields
  const isFormInvalid = () => {
    return !(first_name && last_name && dob && address && em_contact_name && em_contact_number && selectedGender && selectedParent)
  }

  return (
    <main className={styles.container}>
      <section>
        <h1>Register a child</h1>
        <p className={styles.message}>{message}</p>
        <form autoComplete="off" onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            First name
            <input
              type="text"
              value={first_name}
              name="first_name"
              onChange={handleChange}
              autoComplete='on'
              required
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
              required
            />
          </label>
          <label className={styles.label}>
            Date of birth
            <input
              type="date"
              value={dob}
              name="dob"
              onChange={handleChange}
              autoComplete='off'
              required
            />
          </label>
          <label className={styles.label}>
            Gender
            <select value={selectedGender} onChange={handleGenderChange}>
              <option key="blank-gender">Select gender</option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.label}>
            Address
            <input
              type="text"
              value={address}
              name="address"
              onChange={handleChange}
              autoComplete='on'
              required
            />
          </label>
          <label className={styles.label}>
            Parent
            <select value={selectedParent} onChange={handleParentChange}>
              <option key="blank-parent">Select parent</option>
              {parents.map((option) => (
                <option key={option.id} value={option.id}>
                  {`${option.first_name} ${option.last_name}`}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.label}>
            Name of emergency contact
            <input
              type="text"
              value={em_contact_name}
              name="em_contact_name"
              onChange={handleChange}
              autoComplete='on'
              required
            />
          </label>
          <label className={styles.label}>
            Phone number of emergency contact
            <input
              type="text"
              value={em_contact_number}
              name="em_contact_number"
              onChange={handleChange}
              autoComplete='on'
              required
            />
          </label>
          <label className={styles.label}>
            Notes
            <textarea 
              value={notes} 
              onChange={handleChange}
              name='notes'
              placeholder='Any dietary restrictions, allergies or special needs'
              rows={3}
            />
          </label>
          <div className={styles.actions}>
            <Link to="/">Cancel</Link>
            <button className={styles.button} disabled={isFormInvalid()}>
              Submit
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default RegisterChildPage
