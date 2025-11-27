import { auth, db } from "@/app/src/Config/firebase";
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";

export interface UserApp {
    uid: string;
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
        where("userType", "==", "professor"),
        orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const professors: UserApp[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        professors.push({
            uid: data.uid,
            name: data.name || "",
            email: data.email,
            createdAt: data.createdAt.toDate().toISOString(),
            userType: data.userType,
        });
    });

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