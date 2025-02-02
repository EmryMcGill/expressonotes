import styles from '../styles/NoteOptionsMenu.module.css'

const NoteOptionsMenu = () => {
    return (
        <div className={styles.card}>
            <button className={styles.btn}>Delete</button>
        </div>
    );
}

export default NoteOptionsMenu;