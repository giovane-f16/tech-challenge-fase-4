import { Config } from "@/app/src/Config/config";
import { auth, db } from "@/app/src/Config/firebase";
import { createUserWithEmailAndPassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const loginUser = async (email: string, password: string, userType: "professor" | "aluno"): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Verificar se o tipo de usuário corresponde ao armazenado no Firestore
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (!userDoc.exists()) {
        throw new Error("Dados do usuário não encontrados.");
    }

    const userData = userDoc.data();
    if (userData.userType !== userType) {
        await signOut(auth);
        throw new Error(`Este usuário está registrado como ${userData.userType}, não como ${userType}`);
    }

    return userCredential.user;
};

export const registerUser = async (email: string, password: string, name: string, userType: "professor" | "aluno"): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Salvar o tipo de usuário no Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email,
        userType: userType,
        createdAt: new Date(),
    });

    return userCredential.user;
};

export const logoutUser = async (): Promise<void> => {
    await signOut(auth);
};

export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

export const isSuperAdmin = (): boolean => {
    const user = auth.currentUser;
    const SUPER_ADMIN_EMAIL = Config.getSuperAdminEmail();
    return user?.email === SUPER_ADMIN_EMAIL;
};

export const updateUserEmail = async (newEmail: string, currentPassword: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("Usuário não autenticado");

    // Reautentica o usuário antes de fazer a mudança
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    await updateEmail(user, newEmail);
};

export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("Usuário não autenticado");

    // Reautentica o usuário antes de fazer a mudança
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, newPassword);
};

export const updateNameAccount = async ( uid: string, newName: string): Promise<void> => {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, { name: newName }, { merge: true });
}

export const deleteUserAccount = async (currentPassword: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("Usuário não autenticado");

    // Reautentica o usuário antes de deletar
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    await deleteUser(user);
};

export const getUserData = async (): Promise<{ name: string; email: string; userType: string; id: string } | null> => {
    const current = getCurrentUser();
    if (!current || !current.uid) {
        return null;
    }
    const userDoc = await getDoc(doc(db, "users", current.uid));
    if (!userDoc.exists()) {
        return null;
    }

    const userData = userDoc.data();

    return {
        name: userData.name,
        email: userData.email,
        userType: userData.userType,
        id: current.uid,
    };
};

export default { loginUser, registerUser, logoutUser, getCurrentUser, isSuperAdmin, updateUserEmail, updateUserPassword, deleteUserAccount, getUserData };