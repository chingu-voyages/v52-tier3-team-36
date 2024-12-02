
const CheckinList = ({checkins}) => {

    return (
        <div>
            <ul>
                {checkins.map(checkin => {
                    const checkinDate = new Date(checkin.checkin).toLocaleDateString();
                    const checkinTime = new Date(checkin.checkin).toLocaleTimeString();
                    const checkoutDate = checkin.checkout ? new Date(checkin.checkout).toLocaleDateString() : '';
                    const checkoutime = checkin.checkout ? new Date(checkin.checkout).toLocaleTimeString() : '';
                    return <li key={checkin.id}>{checkinDate} {checkinTime} {checkin.checkin_staff} {checkin.report_card} {checkin.report_staff} {checkoutDate} {checkoutime} {checkin.checkout_staff}</li>
                })}
            </ul>
        </div>
    )

}

export default CheckinList