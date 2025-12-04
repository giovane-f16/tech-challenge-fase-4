import { db } from "@/app/src/Config/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";

export interface UserApp {
    docId: string;  // ID do documento no Firestore
    uid: string;    // UID do Firebase Auth
    name: string;
    email: string;
    createdAt: string;
    userType?: "professor" | "aluno";
}

const COLLECTION = "users";

export const getProfessors = async (): Promise<UserApp[]> => {
    const q = query(collection(db, COLLECTION),where("userType", "==", "professor"));
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

export const deleteProfessor = async (docId: string): Promise<void> => {
    const ref = doc(db, COLLECTION, docId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        throw new Error("Professor não encontrado");
    }
    await deleteDoc(ref);
};