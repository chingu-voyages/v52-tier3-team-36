// npm modules
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// css
import styles from './Register.module.css'
import { registerChild, getUsers } from '../../services/api';

const RegisterChildPage = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState([]);
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

  useEffect(() => {
    const fetchParents = async () => {
      const usersRes = await getUsers();
      setParents(usersRes.filter(user => user.groups.includes(3)))
    };
    fetchParents();
  }, [])

  const genderOptions = [
    {name: "Male", value:"MALE"},
    {name: "Female", value:"FEMALE"},
    {name: "Other", value:"OTHER"},
    {name: "Prefer not to say", value:"NOT"}
  ]

  const handleParentChange = (evt) => {
    setSelectedParent(evt.target.value)
  }

  const handleGenderChange = (evt) => {
    setSelectedGender(evt.target.value)
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
      formData.gender = selectedGender;
      formData.parent = selectedParent;
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

  const isFormInvalid = () => {
    return !(first_name && last_name && dob && address && em_contact_name && em_contact_number && selectedGender && selectedParent)
  }

  return (
    <main className={styles.container}>
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
          Date of birth
          <input
            type="date"
            value={dob}
            name="dob"
            onChange={handleChange}
            autoComplete='of'
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
          />
        </label>
        <label className={styles.label}>
          Parent
          <select value={selectedParent} onChange={handleParentChange}>
            <option key="blank-parent">Select parent</option>
            {parents.map((option) => (
              <option key={option.id} value={option.url}>
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
          />
        </label>
        <label className={styles.label}>
          Notes
          <textarea 
            value={notes} 
            onChange={handleChange}
            name='notes' />
        </label>
        <div>
          <Link to="/">Cancel</Link>
          <button className={styles.button} disabled={isFormInvalid()}>
            Register child
          </button>
        </div>
      </form>
    </main>
  )
}

export default RegisterChildPage