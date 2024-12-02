// css
import styles from './CheckinList.module.css'

const CheckinList = ({checkins}) => {

    return (
        <div className={styles.reports}>
            <table>
                <tr>
                    <th>Date</th>
                    <th>Checkin</th>
                    <th>Staff</th>
                    <th>Report</th>
                    <th>Checkout</th>
                </tr>
                {checkins.map(checkin => {
                    const checkinDate = new Date(checkin.checkin).toLocaleDateString();
                    const checkinTime = new Date(checkin.checkin).toLocaleTimeString();
                    const checkoutDate = checkin.checkout ? new Date(checkin.checkout).toLocaleDateString() : '';
                    const checkoutime = checkin.checkout ? new Date(checkin.checkout).toLocaleTimeString() : '';
                    return <tr key={checkin.id}>
                            <td>{checkinDate}</td>
                            <td>{checkinTime}</td>
                            <td>{checkin.report_staff}</td>
                            <td>Lorem Ipsum is simply dummy text of tde printing and typesetting industry. Lorem Ipsum has been tde industry's standard dummy text ever since tde 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also tde leap into electronic typesetting, remaining essentially unchanged.</td>
                            <td>{checkoutime}</td>
                        </tr>
                })}
            </table>
            
        </div>
    )

}

export default CheckinList