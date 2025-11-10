import { auth } from "@/app/src/Config/firebase";
import {
    createUserWithEmailAndPassword,
    deleteUser,
    User
} from "firebase/auth";

export interface Professor {
    uid: string;
    email: string;
    createdAt: string;
}

// Como o Firebase Auth não permite listar usuários pelo cliente,
// vamos precisar armazenar os professores no Firestore
// Por enquanto, vou criar funções básicas e você precisará
// configurar o Firestore ou usar Firebase Admin SDK no backend

export const createProfessor = async (email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const deleteProfessor = async (user: User): Promise<void> => {
    await deleteUser(user);
};