// css
import styles from './CheckinList.module.css'
import { useState } from 'react';
import { postReportCard } from '../../services/api';

const CheckinList = ({checkins, updateCheckins, user}) => {
    const [editingItemId, setEditingItemId] = useState(false);
    const [editText, setEditText] = useState('');
    const [message, setMessage] = useState('');

      const handleEditing = (id) => {
        const itemToEdit = checkins.find(checkin => checkin.id === id);
        setEditingItemId(id);
        setEditText(itemToEdit.report_card && itemToEdit.report_card || '');
    };

    const cancelEditing = () => {
        setEditingItemId(false)
    }
    
      const handleSubmit = async () => {
        try {
          if (!import.meta.env.VITE_BACK_END_SERVER_URL) {
            throw new Error('No VITE_BACK_END_SERVER_URL in front-end .env')
          }
          const response = await postReportCard(editText, user.id, editingItemId);
          if(response){
            updateCheckins(response)
            setEditingItemId(false)
            setEditText('')
          } else {
            setMessage('There was an issue adding the report')
          }
        } catch (err) {
          console.error(err)
          setMessage(err.message)
        }
      }
    
    return (
        <div className={styles.reports}>
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Checkin</th>
                    <th>Staff</th>
                    <th>Report</th>
                    <th>Checkout</th>
                </tr>
                </thead>
                <tbody>
                {checkins.map(checkin => {
                    const checkinDate = new Date(checkin.checkin).toLocaleDateString();
                    const checkinTime = new Date(checkin.checkin).toLocaleTimeString();
                    const checkoutDate = checkin.checkout ? new Date(checkin.checkout).toLocaleDateString() : '';
                    const checkoutime = checkin.checkout ? new Date(checkin.checkout).toLocaleTimeString() : '';
                    return <tr key={checkin.id}>
                            <td>{checkinDate}</td>
                            <td>{checkinTime}</td>
                            <td>{checkin.report_staff}</td>
                            <td>
                                { editingItemId === checkin.id ?
                                <>
                                <label className={styles.label}>
                                <textarea 
                                  value={editText} 
                                  onChange={e => setEditText(e.target.value)}
                                  name='report_card'
                                  placeholder='Any reported information for the day.'
                                  rows={3}
                                />
                              </label>
                              <div className={styles.actions}>
                                <button onClick={cancelEditing} className={styles.button}>Cancel</button>
                                <button className={styles.button} onClick={() => handleSubmit(checkin.url)}>
                                  Submit
                                </button>
                              </div>
                              </> :
                                <span>{checkin.report_card}{user && !user.groups.includes(3) && <button onClick={() => handleEditing(checkin.id)}>{checkin.report_card && 'Edit' || 'Add'}</button>}</span>
                                }       
                            </td>
                            <td>{checkoutime}</td>
                        </tr>
                })}
                </tbody>
            </table>
            
        </div>
    )

}

export default CheckinList