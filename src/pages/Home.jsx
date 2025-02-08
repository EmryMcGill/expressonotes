// package imports
import { useState, useEffect } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
//style imports
import styles from "../styles/Home.module.css";
// component imports
import NoteCard from "../components/NoteCard";
import SideMenu from "../components/SideMenu";
import NoteEditCard from "../components/NoteEditCard";
import Loading from "../components/Loading";
// context imports
import { usePocket } from "../pb/PbContext";

const Home = () => {

    // state
    const [activeTag, setActiveTag] = useState(null);
    const [menu, setMenu] = useState();
    const [newNote, setNewNote] = useState(false);
    const [searchVal, setSearchVal] = useState('');

    // hooks
    const { 
        notes, 
        tags,
        loading,
        createNote, 
        updateNote, 
        deleteNote, 
        logout 
    } = usePocket();

    useEffect(() => {
        if (window.innerWidth < 650) {
            // start w menu closed
            setMenu(false);
        }
        else {
            // start w menu open
            setMenu(true);
        }
    },[]);

    // functions

    const handleLogout = async () => {
        logout();
    }

    const toggleMenu = () => {
        setMenu(!menu);
    }

    const toggleNewNote = () => {
        setNewNote(!newNote);
    }

    const toggleActiveTag = (tag_id) => {
        setActiveTag(tag_id);
    }

    const handleCreateNote = async (title, body, tags) => {
        // validate input
        if (title || body.trim()) {
            // create note
            await createNote(title, body, tags);
        }
        // close the new note card
        toggleNewNote();
    }


    return (
        <div className={`${styles.page} page`}>
            <button onClick={toggleNewNote} className={styles.new_note_btn_mobile}><FiPlus /></button>
            <SideMenu 
                menu={menu} 
                toggleMenu={toggleMenu} 
                handleLogout={handleLogout} 
                tags={tags}
                toggleActiveTag={toggleActiveTag}
                toggleNewNote={toggleNewNote}
                activeTag={activeTag} />
            <div className={styles.top_container}>
                <button onClick={toggleMenu} className={`btn_icon`}>
                    <HiOutlineMenu />
                </button>
                <input value={searchVal} onChange={(e) => setSearchVal(e.target.value)} className={styles.input_search} type="text" placeholder="Search notes" />
            </div>

            {newNote ? <NoteEditCard handleSubmit={handleCreateNote} toggleEdit={toggleNewNote} doneLabel='Create' activeTag={activeTag} /> : '' }
            
            <div className={`${styles.note_container} ${menu ? styles.note_container_open : ''}`}>
                {loading ? <Loading /> : notes.filter(note => {
                    if (activeTag) {
                        return note.tags.includes(activeTag) && (note.title.toLowerCase().includes(searchVal.toLowerCase()) || note.body.toLowerCase().includes(searchVal.toLowerCase()));
                    }
                    else {
                        return note.title.toLowerCase().includes(searchVal.toLowerCase()) || note.body.toLowerCase().includes(searchVal.toLowerCase());
                    }
                }).sort((a, b) => new Date(b.updated) - new Date(a.updated)).map(note => 
                    <NoteCard 
                        title={note.title} 
                        tags={tags.filter(tag => note.tags.includes(tag))} 
                        body={note.body}
                        key={note.id}
                        id={note.id}
                        updateNote={updateNote}
                        deleteNote={deleteNote} />
                )
                }
            </div>
        </div>
    );
}

export default Home;