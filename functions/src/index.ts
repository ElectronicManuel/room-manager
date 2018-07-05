import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

admin.firestore();

import { cleanAfterUser, listUsers, setupUserInFirestore, initUnsetUser } from './users';

export const setupUser = functions.auth.user().onCreate(user => {
    return setupUserInFirestore(user);
});

export const handleUserRemoval = functions.auth.user().onDelete(user => {
    const { uid } = user;
    return cleanAfterUser(uid);
});

export const setUnsetUserData = functions.https.onRequest(async (req, res) => {
    const users = await listUsers();
    const fixedUsers = [];

    for(const user of users) {
        const neededFix = initUnsetUser(user);
        if(neededFix) {
            fixedUsers.push(user.email);
        }
    }

    res.status(200).send(JSON.stringify(fixedUsers));
});