// package imports
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/NoteCard.module.css';
// component imports
import { PiTrash } from "react-icons/pi";
import NoteEditCard from './NoteEditCard';
import DeleteModal from './DeleteModal';


const NoteCard = ({ title, tags, body, updateNote, deleteNote, id }) => {

    // state
    const [edit, setEdit] = useState(false);
    const [del, setDel] = useState(false);

    // functions

    const toggleEdit = () => {
        if (edit) {
            setEdit(false);
        }
        else {
            setEdit(true);
        }
    }

    const handleUpdateNote = async (title, body, tags) => {
        await updateNote(id, title, body, tags);
        toggleEdit();
    }

    const handleDeleteNote = async (e) => {
        e.stopPropagation();
        await deleteNote(id);
    }

    return (
        <div className={styles.card_container}>
            <div onClick={toggleEdit} className={styles.card}>
                <div className={styles.note_container}>
                    <h2>{title}</h2>
                    <p dangerouslySetInnerHTML={{ __html: body }}></p>
                </div>
                <div className={styles.tag_container}>
                    {tags.map((tag, index) => 
                        <p className={styles.tag} key={index}>{tag}</p>
                    )}
                    <button onClick={(e) => {
                        e.stopPropagation();
                        setDel(true);
                    }} className={styles.btn_icon}>
                        <PiTrash />
                    </button>
                </div>
            </div>
            {edit ? <NoteEditCard 
                        handleSubmit={handleUpdateNote} 
                        toggleEdit={toggleEdit}
                        defaultTitle={title}
                        defaultBody={body}
                        defaultTags={tags}
                        doneLabel='Done' /> : '' }

            {del ? <DeleteModal handleDelete={handleDeleteNote} handleCancel={() => setDel(false)} /> : ''}
        </div>
    );
}

export default NoteCard;