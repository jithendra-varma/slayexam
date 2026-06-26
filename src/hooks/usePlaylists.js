import { useState, useEffect } from 'react';
import {
  collection, query, where, orderBy,
  onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, getDoc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export function useMyPlaylists(userId) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const q = query(
      collection(db, 'playlists'),
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc'),
    );
    return onSnapshot(q, snap => {
      setPlaylists(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, [userId]);

  async function createPlaylist({ title, description, branch, creatorName }) {
    const ref = await addDoc(collection(db, 'playlists'), {
      title, description, branch,
      createdBy: userId, creatorName,
      isPublic: false, tags: [],
      videos: [],
      rating: 0, ratingCount: 0,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  }

  return { playlists, loading, createPlaylist };
}

export function usePlaylist(playlistId) {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playlistId) return;
    return onSnapshot(doc(db, 'playlists', playlistId), snap => {
      setPlaylist(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoading(false);
    });
  }, [playlistId]);

  async function updateVideos(videos) {
    await updateDoc(doc(db, 'playlists', playlistId), { videos });
  }

  async function updateMeta({ title, description, branch, isPublic }) {
    await updateDoc(doc(db, 'playlists', playlistId), { title, description, branch, isPublic });
  }

  async function deletePlaylist() {
    await deleteDoc(doc(db, 'playlists', playlistId));
  }

  return { playlist, loading, updateVideos, updateMeta, deletePlaylist };
}

export function usePublicPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'playlists'),
      where('isPublic', '==', true),
      orderBy('rating', 'desc'),
      orderBy('createdAt', 'desc'),
    );
    return onSnapshot(q, snap => {
      setPlaylists(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  return { playlists, loading };
}

export function useRating(playlistId, userId) {
  const [myRating, setMyRating] = useState(0);

  useEffect(() => {
    if (!playlistId || !userId) return;
    getDoc(doc(db, 'ratings', `${playlistId}_${userId}`)).then(snap => {
      if (snap.exists()) setMyRating(snap.data().score);
    });
  }, [playlistId, userId]);

  async function submitRating(score) {
    const ratingRef = doc(db, 'ratings', `${playlistId}_${userId}`);
    const existing = await getDoc(ratingRef);
    await setDoc(ratingRef, { playlistId, ratedBy: userId, score, createdAt: serverTimestamp() });

    const playlistRef = doc(db, 'playlists', playlistId);
    const playlistSnap = await getDoc(playlistRef);
    if (!playlistSnap.exists()) return;

    const { rating, ratingCount } = playlistSnap.data();
    let newCount = ratingCount;
    let newTotal = rating * ratingCount;

    if (existing.exists()) {
      newTotal = newTotal - existing.data().score + score;
    } else {
      newCount = ratingCount + 1;
      newTotal = newTotal + score;
    }

    await updateDoc(playlistRef, {
      rating: newCount > 0 ? newTotal / newCount : 0,
      ratingCount: newCount,
    });

    setMyRating(score);
  }

  return { myRating, submitRating };
}

export async function copyPlaylist(playlist, userId, userName) {
  await addDoc(collection(db, 'playlists'), {
    title: `${playlist.title} (copy)`,
    description: playlist.description,
    branch: playlist.branch,
    createdBy: userId,
    creatorName: userName,
    isPublic: false,
    tags: playlist.tags || [],
    videos: playlist.videos || [],
    rating: 0,
    ratingCount: 0,
    createdAt: serverTimestamp(),
  });
}
