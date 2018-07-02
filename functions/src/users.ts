import * as admin from 'firebase-admin';

const firestore = admin.firestore();

const USER_PATHS = function (uid) {
    return [
        `users/${uid}`,
    ];
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