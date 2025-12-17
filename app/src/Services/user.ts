import { Config } from "@/app/src/Config/config";
import { auth, db } from "@/app/src/Config/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";

export interface UserApp {
    docId: string;  // ID do documento no Firestore
    uid: string;    // UID do Firebase Auth
    name: string;
    email: string;
    createdAt: string;
    userType?: "professor" | "aluno";
}

const COLLECTION = "users";

export const getProfessores = async (): Promise<UserApp[]> => {
    const currentEmail = auth.currentUser?.email || null;

    const excludeEmails = [Config.getSuperAdminEmail()];
    if (currentEmail && !excludeEmails.includes(currentEmail)) {
        excludeEmails.push(currentEmail);
    }

    // Usa not-in para excluir múltiplos emails e ordena por email
    const q = query(
        collection(db, COLLECTION),
        where("userType", "==", "professor"),
        where("email", "not-in", excludeEmails),
        orderBy("email")
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
}

export const deleteProfessor = async (docId: string): Promise<void> => {
    const ref = doc(db, COLLECTION, docId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        throw new Error("Professor não encontrado");
    }
    await deleteDoc(ref);
}

export const getAlunos = async (): Promise<UserApp[]> => {
    const currentEmail = auth.currentUser?.email || null;
    const consulta = query(
        collection(db, COLLECTION),
        where("userType", "==", "aluno"),
        where("email", "!=", currentEmail)
    );
    const querySnapshot = await getDocs(consulta);
    const alunos: UserApp[] = [];

    querySnapshot.forEach((document) => {
        const data = document.data();
        alunos.push({
            docId: document.id,
            uid: data.uid,
            name: data.name || "",
            email: data.email,
            createdAt: data.createdAt.toDate().toISOString(),
            userType: data.userType,
        });
    });

    return alunos;
}

export const deleteAluno = async (docId: string): Promise<void> => {
    const ref = doc(db, COLLECTION, docId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        throw new Error("Aluno não encontrado");
    }
    await deleteDoc(ref);
}

export default { getProfessores, deleteProfessor, getAlunos, deleteAluno }