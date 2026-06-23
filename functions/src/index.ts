import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

type VoteValue = -1 | 0 | 1;

const isVoteValue = (value: unknown): value is VoteValue =>
  value === -1 || value === 0 || value === 1;

export const setIdeaVote = onCall({region: "us-central1"}, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Please log in before voting.");
  }

  const {ideaId, value} = request.data || {};

  if (typeof ideaId !== "string" || !ideaId.trim()) {
    throw new HttpsError("invalid-argument", "Missing ideaId.");
  }

  if (!isVoteValue(value)) {
    throw new HttpsError("invalid-argument", "Vote must be -1, 0, or 1.");
  }

  const userId = request.auth.uid;
  const ideaRef = admin.firestore().collection("ideas").doc(ideaId);
  const voteRef = ideaRef.collection("votes").doc(userId);

  return admin.firestore().runTransaction(async (transaction) => {
    const [ideaSnap, voteSnap] = await Promise.all([
      transaction.get(ideaRef),
      transaction.get(voteRef),
    ]);

    if (!ideaSnap.exists) {
      throw new HttpsError("not-found", "Idea not found.");
    }

    const idea = ideaSnap.data() || {};
    const previousVote = voteSnap.exists ? voteSnap.data()?.value || 0 : 0;

    if (!isVoteValue(previousVote)) {
      throw new HttpsError("failed-precondition", "Stored vote is invalid.");
    }

    if (previousVote === value) {
      return {
        upvotes: idea.upvotes || 0,
        downvotes: idea.downvotes || 0,
        score: idea.score || 0,
        userVote: value,
      };
    }

    const upvotes =
      Math.max(0, (idea.upvotes || 0) + (value === 1 ? 1 : 0) -
        (previousVote === 1 ? 1 : 0));
    const downvotes =
      Math.max(0, (idea.downvotes || 0) + (value === -1 ? 1 : 0) -
        (previousVote === -1 ? 1 : 0));
    const adminScoreAdjustment = idea.adminScoreAdjustment || 0;
    const score = upvotes - downvotes + adminScoreAdjustment;

    transaction.update(ideaRef, {
      upvotes,
      downvotes,
      score,
    });

    if (value === 0) {
      transaction.delete(voteRef);
    } else {
      transaction.set(voteRef, {
        value,
        userId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return {upvotes, downvotes, score, userVote: value};
  });
});
