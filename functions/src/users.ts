import * as admin from 'firebase-admin';

const firestore = admin.firestore();

const USER_PATHS = function (uid) {
    return [
        `users/${uid}`,
    ];
}

export const getDisplayName = (user: admin.auth.UserRecord) => {
    let displayName: string;
    if(user.displayName) {
        displayName = user.displayName;
    } else if(user.email) {
        displayName = user.email;
    } else {
        displayName = 'Anonym';
    }
    return displayName;
}

export const setupUserInFirestore = async (user: admin.auth.UserRecord) => {
    const { uid } = user;

    return firestore.doc(`users/${uid}`).set({
        role: 'user',
        displayName: getDisplayName(user)
    });
}

export const initUnsetUser = async (user: admin.auth.UserRecord) => {
    let neededFix: boolean = false;
    const { uid } = user;

    const userRef = firestore.doc(`users/${uid}`);
    const doc = await userRef.get();

    const defaultUser = {
        role: 'user',
        displayName: getDisplayName(user)
    }

    if(!doc.exists) {
        try {
            userRef.set(defaultUser);
        } catch(err) {}
        neededFix = true;
    } else {
        const userData: {
            role: string,
            displayName: string
        } = (doc.data() as any);
        const updateUser: {
            role?: string,
            displayName?: string
        } = {};
        if(!userData.role) {
            updateUser.role = 'user';
            neededFix = true;
        }
        if(!userData.displayName) {
            updateUser.displayName = defaultUser.displayName;
            neededFix = true;
        }

        if(neededFix) {
            try {
                userRef.update(updateUser);
            } catch(err) {
            }
        }
    }

    return neededFix;
}

export const cleanAfterUser = async function (uid) {
    const paths = USER_PATHS(uid);
    for (const path of paths) {
        await firestore.doc(path).delete();
    }

    return 'SUCCESS';
}

export const listUsers = async function (): Promise<Array<admin.auth.UserRecord>> {
    const userArray = [];

    let nextToken;
    do {
        const result = await admin.auth().listUsers(1000, nextToken);
        result.users.forEach(user => {
            userArray.push(user);
        });
        nextToken = result.pageToken;
    } while (nextToken);

    return userArray;
}