import Config from "@/app/src/Config/config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = Config.getFirebaseConfig();

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;