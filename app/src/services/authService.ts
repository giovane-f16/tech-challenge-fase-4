import { auth } from "@/app/src/Config/firebase";
import {
    createUserWithEmailAndPassword,
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updateEmail,
    updatePassword,
    User
} from "firebase/auth";

export const loginUser = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const registerUser = async (email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const logoutUser = async (): Promise<void> => {
    await signOut(auth);
};

export const getCurrentUser = (): User | null => {
    return auth.currentUser;
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

export const deleteUserAccount = async (currentPassword: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("Usuário não autenticado");

    // Reautentica o usuário antes de deletar
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    await deleteUser(user);
};