import { useState, useEffect } from 'react';
import {
  collection, query, where, orderBy,
  onSnapshot, addDoc, updateDoc, doc,
  increment, serverTimestamp, getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export function useQuestions(branch, semester, subjectName, topicName) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'questions'),
      where('branch', '==', branch),
      where('topicName', '==', topicName),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(q, snap => {
      setQuestions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [branch, topicName]);

  async function addQuestion({ title, body, askedBy, askerName }) {
    await addDoc(collection(db, 'questions'), {
      branch, semester, subjectName, topicName,
      title, body, askedBy, askerName,
      upvotes: 0, answerCount: 0,
      createdAt: serverTimestamp(),
    });
  }

  async function upvoteQuestion(questionId) {
    await updateDoc(doc(db, 'questions', questionId), { upvotes: increment(1) });
  }

  return { questions, loading, addQuestion, upvoteQuestion };
}

export function useAnswers(questionId) {
  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoc(doc(db, 'questions', questionId)).then(snap => {
      if (snap.exists()) setQuestion({ id: snap.id, ...snap.data() });
    });

    const q = query(
      collection(db, 'answers'),
      where('questionId', '==', questionId),
      orderBy('isAccepted', 'desc'),
      orderBy('upvotes', 'desc'),
    );
    const unsub = onSnapshot(q, snap => {
      setAnswers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [questionId]);

  async function addAnswer({ body, answeredBy, answererName }) {
    await addDoc(collection(db, 'answers'), {
      questionId, body, answeredBy, answererName,
      upvotes: 0, isAccepted: false,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, 'questions', questionId), { answerCount: increment(1) });
  }

  async function upvoteAnswer(answerId) {
    await updateDoc(doc(db, 'answers', answerId), { upvotes: increment(1) });
  }

  async function acceptAnswer(answerId, askedBy, currentUserId) {
    if (askedBy !== currentUserId) return;
    // Unaccept all first, then accept the chosen one
    answers.forEach(a => {
      if (a.isAccepted) updateDoc(doc(db, 'answers', a.id), { isAccepted: false });
    });
    await updateDoc(doc(db, 'answers', answerId), { isAccepted: true });
  }

  return { question, answers, loading, addAnswer, upvoteAnswer, acceptAnswer };
}
