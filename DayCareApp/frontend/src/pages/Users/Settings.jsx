import { useEffect, useState } from "react"
import { getGroups } from "../../services/api";
import styles from "./UserEdit.module.css";
import { editGroupPermissions, getGroupPermissions, addGroup, deleteGroup } from "../../services/authService";
/**
 * Represents a settings component for the app groups and permissions.
 *
 * @component
 * @returns {React.ReactElement} A list of groups with opitons to delete/edit groups and permissions. 
 *                                If editing - show edit form, if adding - show new group form
 */
const SettingsPage = () => {
  const [groups, setUserGroups] = useState([]);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [permissions, setPermissions] = useState({})
  const [message, setMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  // Handle change in checkbox selection
  const handleChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    setPermissions({ ...permissions, [value]: isChecked })
  };
  // Submit form to backend API endpoint
  const handleSubmit = async evt => {
    evt.preventDefault()
    try {
      if (!import.meta.env.VITE_BACK_END_SERVER_URL) {
        throw new Error('No VITE_BACK_END_SERVER_URL in front-end .env')
      }
      if (adding) {
        // If adding a group - use the addGroup request
        const response = await addGroup(permissions, groupName);
        if (response) {
          // After successful submission add new group to the list
          setUserGroups([...groups, response])
          // Close all forms if open
          setAdding(false)
          setEditing(false)
        }
      } else {
        // If editing - use the editGroupPermission API
        const response = await editGroupPermissions(permissions, groupName);
        if (response) {
          setUserGroups(prevGroups => prevGroups.map(group => group.id === permissions.group ? { ...group, name: groupName } : group))
          setEditing(false)
        }
      }
    } catch (err) {
      console.error(err)
      setMessage(err.message)
    }
  }

  // If editing - get the group current permissions
  const handleEdit = async (groupId) => {
    const response = await getGroupPermissions(groupId)
    setPermissions(response[0])
    const groupNameDefault = groups.filter(group => group.id === groupId).map(group => group.name)
    setGroupName(groupNameDefault[0])
    setAdding(false)
    setEditing(true)
  }
  // When adding a new group, add all available permission objects to the displayed form
  const handleAdding = () => {
    setGroupName('');
    // Use a list of preset blank permissions instead of querying the backend
    const perm_list = ["list_users", "edit_users", "list_parents", "edit_parents", "list_children", "edit_children", "list_own_children", "edit_report_cards", "check_in", "view_stats"];
    const blank_permissions = Object.assign(...perm_list.map(p => ({ [p]: false })));
    setPermissions(blank_permissions);
    setAdding(true);
    setEditing(true);
  }
  // Handle group deletion
  const handleDelete = async (groupId) => {
    const response = await deleteGroup(groupId)
    if (response) {
      setUserGroups(groups.filter(group => group.id !== groupId))
    }
  }
  // Fetch a list of available groups
  useEffect(() => {
    const fetchGroups = async () => {
      const groupRes = await getGroups();
      setUserGroups(groupRes)
    };
    fetchGroups();
  }, [])



  return (
    <main className={styles.container}>
      <div>
        <p>Groups</p>
        <button onClick={handleAdding}>Add group</button>
        <ul>
          {groups.map(group => <li key={group.id}>{group.name}<button onClick={() => handleEdit(group.id)}>Edit</button><button onClick={() => handleDelete(group.id)}>Delete</button></li>
          )}
        </ul>
      </div>

      {editing &&
        <section>
          <h1>{adding ? "Add group" : "Edit group"}</h1>
          <p className={styles.message}>{message}</p>
          <form autoComplete="off" onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              Group name
              <input
                type="text"
                value={groupName}
                name="group"
                onChange={(e) => setGroupName(e.target.value)}
                autoComplete='off'
              />
            </label>
            <p>Staff permissions:</p>
            <label className={styles.label}>
              List Users
              <input
                type="checkbox"
                value="list_users"
                name="list_users"
                checked={permissions['list_users']}
                onChange={handleChange}
                autoComplete='off'
              />
            </label>
            <label className={styles.label}>
              Edit Users
              <input
                type="checkbox"
                value="edit_users"
                name="edit_users"
                checked={permissions['edit_users']}
                onChange={handleChange}
                autoComplete='off'
              />
            </label>
            <label className={styles.label}>
              List Parents
              <input
                type="checkbox"
                value="list_parents"
                name="list_parents"
                checked={permissions['list_parents']}
                onChange={handleChange}
                autoComplete='off'
              />
            </label>
            <label className={styles.label}>
              Edit Parents
              <input
                type="checkbox"
                value="edit_parents"
                name="edit_parents"
                checked={permissions['edit_parents']}
                onChange={handleChange}
                autoComplete='off'
              />
            </label>
            <label className={styles.label}>
              List Children
              <input
                type="checkbox"
                value="list_children"
                name="list_children"
                checked={permissions['list_children']}
                onChange={handleChange}
                autoComplete='off'
              />
            </label>
            <label className={styles.label}>
              Edit Children
              <input
                type="checkbox"
                value="edit_children"
                name="edit_children"
                checked={permissions['edit_children']}
                onChange={handleChange}
                autoComplete='off'
              />
            </label>
            <label className={styles.label}>
              Edit Report Cards
              <input
                type="checkbox"
                value="edit_report_cards"
                name="edit_report_cards"
                checked={permissions['edit_report_cards']}
                onChange={handleChange}
                autoComplete='off'
              />
            </label>
            <label className={styles.label}>
              Allow Check In
              <input
                type="checkbox"
                value="check_in"
                name="check_in"
                checked={permissions['check_in']}
                onChange={handleChange}
                autoComplete='off'
              />
            </label>
            <label className={styles.label}>
              View Dashboard Statistics
              <input
                type="checkbox"
                value="view_stats"
                name="view_stats"
                checked={permissions['view_stats']}
                onChange={handleChange}
                autoComplete='off'
              />
            </label>
            <p>Parent permissions:</p>
            <label className={styles.label}>
              List Own Children
              <input
                type="checkbox"
                value="list_own_children"
                name="list_own_children"
                checked={permissions['list_own_children']}
                onChange={handleChange}
                autoComplete='off'
              />
            </label>
            <div className={styles.actions}>
              <button onClick={() => setEditing(false)} className={styles.button}>Cancel</button>
              <button className={styles.button}>
                Submit
              </button>
            </div>
          </form>
        </section>
      }
    </main>
  )
}

export default SettingsPage