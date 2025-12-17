export class Config {
    static getApiEndpoint(): string {
        return "";
    }

    static getAuthToken(): string {
        return "";
    }

    static getMongoDbUri(): string {
        return "";
    }

    static getFirebaseConfig(): object {
        return {
            apiKey: "",
            authDomain: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: ""
        }
    }

    static getSuperAdminEmail(): string {
        return ""
    }
}

export default Config;