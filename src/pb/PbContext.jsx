import Pocketbase from 'pocketbase';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { cacheDeletedNote, cacheTempNote, clearDeletedNotes, clearTempNotes, getDeletedNotes, getTempNotes } from './idb';

// url for pb TODO: move this to .env
const BASE_URL = import.meta.env.VITE_PB_URI;

// create the pb context
const PbContext = createContext();

export const PbProvider = ({ children }) => {
    // define the pb object 
    const pb = useMemo(() => new Pocketbase(BASE_URL));

    // define user
    const [user, setUser] = useState(pb.authStore.record);
    // define notes
    const [notes, setNotes] = useState([]);
    // define tags
    const [tags, setTags] = useState([]);
    // define loading flag
    const [loading, setLoading] = useState(true);

    const handleTempNotes = async () => {
        let tempNotes = [];
        let deletedNotes = [];
        if (!navigator.onLine) {
            // offline so also check for any temp notes to display
            tempNotes = await getTempNotes();
            deletedNotes = await getDeletedNotes();
        }
        else {
            // online so clear the temp notes
            await clearTempNotes();
            await clearDeletedNotes();
        }
        return {tempNotes: tempNotes, deletedNotes: deletedNotes};
    }

    const refreshTags = (notes) => {
        // get all tags
        const allTags = notes.flatMap(note => note.tags);
        // get unique tags
        const uniqueTags = [...new Set(allTags)];
        // update tags
        setTags(uniqueTags);
    }

    const getNotes = async () => {
        try {
            const res = await pb.collection('notes').getFullList();
            const { tempNotes, deletedNotes } = await handleTempNotes();
            refreshTags([...tempNotes, ...res.filter(note => !tempNotes.some(note1 => note1.id === note.id) && !deletedNotes.some(note1 => note1.id === note.id))]);
            setNotes([...tempNotes, ...res.filter(note => !tempNotes.some(note1 => note1.id === note.id) && !deletedNotes.some(note1 => note1.id === note.id))]);
            setLoading(false);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        // listen for changes to the authStore state
        const unsubscribe = pb.authStore.onChange(record => {
            setUser(record)
        });

        // init notes
        getNotes();

        pb.collection('notes').subscribe('*', async function (e) { 
            let {tempNotes} = await handleTempNotes();
            let newNotes = [];
            setNotes(oldNotes => {
                // update notes
                if (e.action === "create") {
                    newNotes = [e.record, ...oldNotes];
                    refreshTags([...tempNotes, ...newNotes]);
                    return [...tempNotes, ...newNotes];
                }
                if (e.action === "update") {
                    newNotes = oldNotes.map(note => (note.id === e.record.id ? e.record : note));
                    refreshTags([...tempNotes, ...newNotes]);
                    return [...tempNotes, ...newNotes];
                }
                if (e.action === "delete") {
                    newNotes = oldNotes.filter(note => note.id !== e.record.id);
                    refreshTags([...tempNotes, ...newNotes]);
                    return [...tempNotes, ...newNotes];
                }
            })
        }, {});
        
        return () => {
            pb.collection("notes").unsubscribe("*");
            unsubscribe();
        };
    }, [pb.authStore.record]);

    // AUTH

    const login = async (email, pass) => {
        // attempt to login user
        try {
            await pb.collection("users").authWithPassword(email, pass);
            setUser(pb.authStore.record);
            return null;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    const signup = async (data) => {
        // attempt to register user
        try {
            const res = await pb.collection("users").create(data);

            // log in user
            await login(data.email, data.password);

            // create a demo note    
            await pb.collection('notes').create({
                title: "Install to your iPhone",
                body: "To install this app as a PWA onto your phone, press the share button at the bottom of the screen, then scroll down and click on add to home screen.",
                tags: [],
                user: res.id
            });
                    
            await pb.collection('notes').create({
                title: "Welcome!",
                body: "Here is some helpful tips:<br>1. you can add tags to your notes by writing a # followed by whatever you want the tag to be called.<br><br>here's an example<br>#exampletag<br><br>2. when your finished typing your note, create it using the shortcut<br>(ctl + enter)",
                tags: ["exampletag"],
                user: res.id
            });
            
            return null;
        }
        catch (err) {
            console.log(err.data)
            return err;
        }
    }

    const logout = () => {
        try {
            pb.authStore.clear();
            setUser(pb.authStore.record);
        }
        catch (err) {
            console.log(err);
        }
    }

    // NOTES

    const createNote = async (title, body, noteTags) => {
        try {
            // remove duplicate tags
            const uniqueNoteTags = [...new Set(noteTags)];

            // Convert newlines to <br> or wrap in <p>
            const formattedText = body.replace(/\n/g, "<br>");

            // check if we need to create a temp note
            if (!navigator.onLine) {
                // we are offline so create a temp note
                console.log('create temp note');

                await cacheTempNote({
                    title: title,
                    body: formattedText,
                    tags: uniqueNoteTags,
                    user: user.id,
                    id: Math.random()
                });

                // update notes
                const { tempNotes, deletedNotes } = await handleTempNotes();
                setNotes(oldNotes => {
                    // find temps with same id
                    return [...tempNotes, ...oldNotes.filter(note => !tempNotes.some(note1 => note1.id === note.id) && !deletedNotes.some(note1 => note1.id === note.id))];
                });
            }

            // create the note
            await pb.collection('notes').create({
                title: title,
                body: formattedText,
                tags: uniqueNoteTags,
                user: user.id
            });
        }
        catch (err) {
            console.log(err.data);
        }
    }

    const updateNote = async (note_id, title, body, noteTags) => {
        try {
            // remove duplicate tags
            const uniqueNoteTags = [...new Set(noteTags)];

            // Convert newlines to <br> or wrap in <p>
            const formattedText = body.replace(/\n/g, "<br>");

            // check if we need to create a temp note
            if (!navigator.onLine) {
                // we are offline so create a temp note
                console.log('create temp note');

                await cacheTempNote({
                    title: title,
                    body: formattedText,
                    tags: uniqueNoteTags,
                    user: user.id,
                    id: note_id
                });

                // update notes
                const { tempNotes, deletedNotes } = await handleTempNotes();
                setNotes(oldNotes => {
                    // find temps with same id
                    return [...tempNotes, ...oldNotes.filter(note => !tempNotes.some(note1 => note1.id === note.id) && !deletedNotes.some(note1 => note1.id === note.id))];
                });
            }

            await pb.collection('notes').update(note_id, {
                title: title,
                body: formattedText,
                tags: uniqueNoteTags,
                user: user.id
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    const deleteNote = async (note_id) => {
        try {
            // check if we need to create a temp delete note
            if (!navigator.onLine) {
                // we are offline so create a temp note
                await cacheDeletedNote({
                    id: note_id
                });

                // update notes
                const { tempNotes, deletedNotes } = await handleTempNotes();
                setNotes(oldNotes => {
                    // find temps with same id
                    return [...tempNotes, ...oldNotes.filter(note => !tempNotes.some(note1 => note1.id === note.id) && !deletedNotes.some(note1 => note1.id === note.id))];
                });
            }

            await pb.collection('notes').delete(note_id);
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <PbContext.Provider value={{ 
            user,
            login,
            logout,
            signup,
            notes,
            createNote,
            updateNote,
            deleteNote,
            tags,
            loading
         }}>
        {children}
        </PbContext.Provider>
    );
}

// export custom hook to simplify using useContext
export const usePocket = () => useContext(PbContext);