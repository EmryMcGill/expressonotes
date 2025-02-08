//style imports
import styles from "../styles/DeleteModal.module.css";

const DeleteModal = ({ handleDelete, handleCancel }) => {

    return (
        <div>
            <div className={styles.card}>
                <h2>Are you sure you want to delete this note?</h2>
                <div className={styles.btn_container}>
                    <button onClick={handleCancel} className={styles.btn_action}>Cancel</button>
                    <button onClick={handleDelete} autoFocus className={`${styles.btn_action} ${styles.btn_delete}`}>Delete</button>
                </div>
            </div>
            <div onClick={handleCancel} className="overlay"></div>
        </div>
    );
}

export default DeleteModal;