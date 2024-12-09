// css
import styles from './CheckinList.module.css'
// npm modules
import { useState } from 'react';
import { postReportCard } from '../../services/api';
import EditNoteIcon from '@mui/icons-material/EditNote';
/**
 * Represents a list of child checkins component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.user - An object representing the selected user.
 * @param {Object[]} props.checkins - A list of objects with checkins for the selected child.
 * @param {ChildDetailsState} props.updateCheckin - Set state for the list of checkins if there is a change.
 * @returns {React.ReactElement} A list of checkins element.
 */
const CheckinList = ({ checkins, updateCheckins, user }) => {
    const [editingItemId, setEditingItemId] = useState(false);
    const [editText, setEditText] = useState('');
    const [message, setMessage] = useState('');
    // Handle editing of selected row in the checkin table
    const handleEditing = (id) => {
        const itemToEdit = checkins.find(checkin => checkin.id === id);
        setEditingItemId(id);
        setEditText(itemToEdit.report_card && itemToEdit.report_card || '');
    };

    const cancelEditing = () => {
        setEditingItemId(false)
    }
    // Handle submit of the edit/change of report cards
    const handleSubmit = async () => {
        try {
            if (!import.meta.env.VITE_BACK_END_SERVER_URL) {
                throw new Error('No VITE_BACK_END_SERVER_URL in front-end .env')
            }
            const response = await postReportCard(editText, user.id, editingItemId);
            if (response) {
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

    const editNote = <EditNoteIcon></EditNoteIcon>

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
                                {editingItemId === checkin.id ?
                                    <div className={styles.noteInput}>
                                        <textarea
                                            value={editText}
                                            onChange={e => setEditText(e.target.value)}
                                            name='report_card'
                                            placeholder='Any reported information for the day.'
                                            rows={2}
                                        />
                                        <div className={styles.actions}>
                                            <button onClick={cancelEditing} className={styles.button}>Cancel</button>
                                            <button className={styles.button} onClick={() => handleSubmit(checkin.url)} disabled={editText.length === 0}>
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                    :
                                    <div className={styles.note}>
                                        <span>{checkin.report_card}</span>
                                        {user && user.permissions.edit_report_cards && <button onClick={() => handleEditing(checkin.id)}>{checkin.report_card && editNote || 'Add Note'}</button>}
                                    </div>
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