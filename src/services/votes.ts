import {
  doc,
  getDoc,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import { IdeaRecord } from '../types/formTypes';

export type VoteValue = -1 | 0 | 1;

export type VoteResult = {
  upvotes: number;
  downvotes: number;
  score: number;
  userVote: VoteValue;
};

type VoteDocument = {
  value?: VoteValue;
};

export const getIdeaScore = (idea: Pick<IdeaRecord, 'upvotes' | 'downvotes' | 'score' | 'adminScoreAdjustment'>) =>
  typeof idea.score === 'number'
    ? idea.score
    : (idea.upvotes || 0) - (idea.downvotes || 0) + (idea.adminScoreAdjustment || 0);

export const getUserVote = async (ideaId: string, userId: string): Promise<VoteValue> => {
  const voteRef = doc(db, 'ideas', ideaId, 'votes', userId);
  const voteSnap = await getDoc(voteRef);

  if (!voteSnap.exists()) return 0;

  const value = (voteSnap.data() as VoteDocument).value;
  return value === 1 || value === -1 ? value : 0;
};

export const setUserVote = async (ideaId: string, userId: string, nextVote: VoteValue): Promise<VoteResult> => {
  const vote = httpsCallable(functions, 'setIdeaVote');
  const result = await vote({ ideaId, value: nextVote, userId });
  return result.data as VoteResult;
};

export const clearUserVote = async (ideaId: string, userId: string) => {
  return setUserVote(ideaId, userId, 0);
};
