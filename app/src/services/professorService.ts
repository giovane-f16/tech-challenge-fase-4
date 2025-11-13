import { auth, db } from "@/app/src/Config/firebase";
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp } from "firebase/firestore";

export interface Professor {
    uid: string;
    email: string;
    createdAt: string;
}

const PROFESSORS_COLLECTION = "professors";

export const createProfessor = async (email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await addDoc(collection(db, PROFESSORS_COLLECTION), {
        uid: user.uid,
        email: user.email,
        createdAt: Timestamp.now(),
    });

    return user;
};

export const getProfessors = async (): Promise<Professor[]> => {
    const q = query(collection(db, PROFESSORS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const professors: Professor[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        professors.push({
            uid: data.uid,
            email: data.email,
            createdAt: data.createdAt.toDate().toISOString(),
        });
    });

    return professors;
};

export const deleteProfessor = async (uid: string): Promise<void> => {
    const q = query(collection(db, PROFESSORS_COLLECTION));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (document) => {
        if (document.data().uid === uid) {
            await deleteDoc(doc(db, PROFESSORS_COLLECTION, document.id)); // Nota: Para deletar do Auth, o usuário precisa estar autenticado
        }
    });
};