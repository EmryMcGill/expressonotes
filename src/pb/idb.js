import { openDB } from 'idb';

const dbPromise = openDB('temp-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('note')) {
      db.createObjectStore('note', { keyPath: 'id' });
    }

    if (!db.objectStoreNames.contains('deletedNote')) {
        db.createObjectStore('deletedNote', { keyPath: 'id' });
      }
  },
});

export async function cacheTempNote(note) {
    try {
        const db = await dbPromise;
        await db.put('note', note);
    }
    catch (err) {
        console.log("temp err", err);
    }
}

export async function getTempNotes() {
    const db = await dbPromise;
    let notes = await db.getAll('note');
    return notes;
}

export async function clearTempNotes() {
    try {
        const db = await dbPromise;
        await db.clear('note');
    }
    catch (err) {
        console.log("err clearing temp", err);
    }
}


export async function cacheDeletedNote(note) {
    try {
        const db = await dbPromise;
        await db.put('deletedNote', note);
    }
    catch (err) {
        console.log("temp err", err);
    }
}

export async function getDeletedNotes() {
    const db = await dbPromise;
    let notes = await db.getAll('deletedNote');
    return notes;
}

export async function clearDeletedNotes() {
    try {
        const db = await dbPromise;
        await db.clear('deletedNote');
    }
    catch (err) {
        console.log("err clearing temp", err);
    }
}