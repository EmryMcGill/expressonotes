// package imports
import { useState, useRef, useEffect } from "react";
import styles from '../styles/NoteEditCard.module.css';

const NoteEditCard = ({ 
    handleSubmit, 
    toggleEdit, 
    defaultTitle, 
    defaultBody, 
    defaultTags,
    doneLabel }) => {

    // state
    const [title, setTitle] = useState(defaultTitle); 
    const [tags, setTags] = useState(defaultTags ? [...defaultTags] : []);

    // hooks
    const inputNoteRef = useRef();

    // functions

    const handleKeyDownTitle = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputNoteRef.current?.focus();
        }
    }

    const handleDetectTags = (e) => {
        // get text content from input
        const text = inputNoteRef.current.innerText;
    
        // Regex to find hashtags (#word)
        const tagMatchTitles = text.match(/#(\w+)/g)?.map(tag => tag.slice(1)) || [];
        
        setTags([...tagMatchTitles]);
    };

    return (
        <div>
            <div className={`${styles.card_edit}`}>
                <div className={styles.note_container}>
                    <input defaultValue={title} autoFocus onChange={(e) => setTitle(e.target.value)} onKeyDown={handleKeyDownTitle} type='text' className={styles.input_title} placeholder='title' />
                    <p dangerouslySetInnerHTML={{__html: defaultBody}} onInput={handleDetectTags} ref={inputNoteRef} className={styles.input_note} contentEditable="true"></p>
                </div>
                
                <div className={styles.tag_container}>
                    {tags.map((tag, index) => 
                    <p className={styles.tag} key={index}>{tag}</p>
                    )}
                    <button onClick={toggleEdit} className={styles.btn_action}>Cancel</button>
                    <button onClick={() => handleSubmit(title, inputNoteRef.current.innerText, tags)} className={`${styles.btn_action} ${styles.btn_create}`}>{doneLabel}</button>
                </div>
            </div>
            <div onClick={() => handleSubmit(title, inputNoteRef.current.innerText, tags)} className='overlay'></div>
        </div>
    );
}

export default NoteEditCard;