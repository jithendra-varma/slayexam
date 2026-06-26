import { useState, useEffect } from 'react';
import {
  collection, query, where, orderBy,
  onSnapshot, addDoc, deleteDoc, doc,
  updateDoc, increment, serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

export function useNotes(branch, semester, subjectName, topicName) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'notes'),
      where('branch', '==', branch),
      where('semester', '==', semester),
      where('subjectName', '==', subjectName),
      where('topicName', '==', topicName),
      orderBy('downloads', 'desc'),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(q, snap => {
      setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [branch, semester, subjectName, topicName]);

  async function uploadNote({ file, title, description, uploaderName, uploadedBy }) {
    const ext = file.name.split('.').pop().toLowerCase();
    const fileType = ext === 'pdf' ? 'pdf' : ['jpg','jpeg','png','gif','webp'].includes(ext) ? 'image' : 'doc';
    const storageRef = ref(storage, `notes/${branch}/${semester}/${topicName}/${Date.now()}_${file.name}`);

    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, file);
      task.on('state_changed', null, reject, async () => {
        const fileUrl = await getDownloadURL(task.snapshot.ref);
        await addDoc(collection(db, 'notes'), {
          branch, semester, subjectName, topicName,
          uploadedBy, uploaderName, title, description,
          fileUrl, fileType, fileName: file.name,
          downloads: 0,
          createdAt: serverTimestamp(),
        });
        resolve();
      });
    });
  }

  async function deleteNote(note) {
    try {
      const fileRef = ref(storage, note.fileUrl);
      await deleteObject(fileRef);
    } catch (_) {}
    await deleteDoc(doc(db, 'notes', note.id));
  }

  async function trackDownload(noteId) {
    await updateDoc(doc(db, 'notes', noteId), { downloads: increment(1) });
  }

  return { notes, loading, uploadNote, deleteNote, trackDownload };
}
