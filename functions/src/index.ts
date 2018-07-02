import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const firestore = admin.firestore();

import { cleanAfterUser, listUsers } from './users';

export const setupUser = functions.auth.user().onCreate(user => {
    const { uid } = user;
    return firestore.doc(`users/${uid}`).set({
        role: 'user'
    });
});

export const handleUserRemoval = functions.auth.user().onDelete(user => {
    const { uid } = user;
    return cleanAfterUser(uid);
});

export const setUnsetRoles = functions.https.onRequest(async (req, res) => {
    const users = await listUsers();
    const fixedUsers = [];

    for(const user of users) {
        const userRef = firestore.doc(`users/${user.uid}`);
        const doc = await userRef.get();
        if(!doc.exists) {
            const defaultUser: RoomManager.User = {role: 'user'};
            userRef.set(defaultUser);
            fixedUsers.push(user.email);
        }
    }

    res.status(200).send(JSON.stringify(fixedUsers));
});

export const getAllUsers = functions.https.onRequest(async (req, res) => {
    const users = await listUsers();
    res.status(200).json(users);
});