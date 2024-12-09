// npm modules
import { useState } from 'react';
import { editRecord } from '../../services/api.js';
// css
import styles from './ChildEdit.module.css';
/**
 * Represents a child edit form component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.child - An object representing the selected child.
 * @param {Object} props.childParent- An object representing the selected child's parent.
 * @param {ChildDetailsState} props.edit - Set state for the user reset password form.
 * @param {ChildDetailsState} props.editedChild - Set state with the edited child details form.
 * @param {Object[]} props.parents - A list of objects representing the parents.
 * @returns {React.ReactElement} A form for child details change element.
 */
const ChildEdit = ({child, parents, childParent, edit, editedChild}) => {
  const [message, setMessage] = useState('');
  const [selectedParent, setSelectedParent] = useState(childParent[0]?.id);
  const [selectedGender, setSelectedGender] = useState(child.gender);
  const [formData, setFormData] = useState({
    first_name: child.first_name,
    last_name: child.last_name,
    notes: child.notes,
    dob: child.dob,
    gender: child.gender,
    address: child.address,
    em_contact_name: child.em_contact_name,
    em_contact_number: child.em_contact_number,
    parent: child.parent
  });
  // Set the available gender options
  const genderOptions = [
    {name: "Male", value:"MALE"},
    {name: "Female", value:"FEMALE"},
    {name: "Other", value:"OTHER"},
    {name: "Prefer not to say", value:"NOT"}
  ];
  // Handle changing parents from the select element
  const handleParentChange = (evt) => {
    setSelectedParent(evt.target.value)
  };
 // Handle changing gender from the select element
  const handleGenderChange = (evt) => {
    setSelectedGender(evt.target.value)
  }
  // Handle changing text inputs
  const handleChange = evt => {
    setMessage('')
    setFormData({ ...formData, [evt.target.name]: evt.target.value })
  };
  // Submit form to the backend API endpoint
  const handleSubmit = async evt => {
    evt.preventDefault()
    try {
      if (!import.meta.env.VITE_BACK_END_SERVER_URL) {
        throw new Error('No VITE_BACK_END_SERVER_URL in front-end .env')
      }
      // Set gender and parent to the form data
      formData.gender = selectedGender;
      formData.parent = +selectedParent;
      const response = await editRecord(formData, child.url);
      if(response){
        editedChild(formData)
        edit()
      } else {
        setMessage('There was an issue registering the child')
      }
    } catch (err) {
      console.log(err)
      setMessage(err.message)
    }
  }

  const { first_name, last_name, gender, dob, address, em_contact_name, em_contact_number, parent, notes } = formData
  // Checks if all fields are used to validate form 
  const isFormInvalid = () => {
    return !(first_name, last_name, selectedGender, dob, address, em_contact_name, em_contact_number, selectedParent)
  }

  return (
    <main className={styles.container}>
      <section>
        <h1>Edit details for {child.first_name} {child.last_name}</h1>
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
            <button onClick={() => edit()} className={styles.button}>Cancel</button>
            <button className={styles.button} disabled={isFormInvalid()}>
              Submit
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default ChildEdit;
