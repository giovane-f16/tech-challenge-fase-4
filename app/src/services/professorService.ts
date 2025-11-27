import { auth, db } from "@/app/src/Config/firebase";
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, query, Timestamp, where } from "firebase/firestore";

export interface UserApp {
    docId: string;  // ID do documento no Firestore
    uid: string;    // UID do Firebase Auth
    name: string;
    email: string;
    createdAt: string;
    userType?: "professor" | "aluno";
}

const COLLECTION = "users";

export const createProfessor = async (name: string, email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await addDoc(collection(db, COLLECTION), {
        uid: user.uid,
        name: name,
        email: user.email,
        createdAt: Timestamp.now(),
        userType: "professor",
    });

    return user;
};

export const getProfessors = async (): Promise<UserApp[]> => {
    const q = query(
        collection(db, COLLECTION),
        where("userType", "==", "professor")
    );
    const querySnapshot = await getDocs(q);

    const professors: UserApp[] = [];
    querySnapshot.forEach((document) => {
        const data = document.data();
        professors.push({
            docId: document.id,  // ID do documento
            uid: data.uid,       // UID do Auth
            name: data.name || "",
            email: data.email,
            createdAt: data.createdAt.toDate().toISOString(),
            userType: data.userType,
        });
    });

    professors.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return professors;
};

export const deleteProfessor = async (uid: string): Promise<void> => {
    const q = query(collection(db, COLLECTION));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (document) => {
        if (document.data().uid === uid) {
            await deleteDoc(doc(db, COLLECTION, document.id)); // Nota: Para deletar do Auth, o usuário precisa estar autenticado
        }
    });
};