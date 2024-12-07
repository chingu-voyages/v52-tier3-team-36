// css
import styles from './ChildEdit.module.css';

const ReportCard = ({report, handleSubmit, handleEditing}) => {
    return (
        <form autoComplete="off" onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
            <textarea 
              value={report} 
              onChange={handleChange}
              name='report_card'
              placeholder='Any reported information for the day.'
              rows={3}
            />
          </label>
          <div className={styles.actions}>
            <button onClick={handleEditing} className={styles.button}>Cancel</button>
            <button className={styles.button}>
              Submit
            </button>
          </div>
    </form>
    )
}

export default ReportCard