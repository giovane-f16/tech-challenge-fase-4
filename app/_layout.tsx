import UserInfo from "@/app/components/userInfo";
import BotaoVoltar from "@/app/components/voltar";
import { auth } from "@/app/src/Config/firebase";
import { getUserData } from "@/app/src/Services/auth";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";

export default function RootLayout() {
    const [userData, setUserData] = useState<{ name: string; email: string; userType: string } | null>(null);

    useEffect(() => {
        getUserData().then(setUserData);

        const unsub = onAuthStateChanged(auth, () => {
            getUserData().then(setUserData);
        });
        return () => unsub();
    }, []);

    return (
        <Drawer
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#39558eff"
                },
                headerTintColor: "#ffffff",
                headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 20,
                },
                headerTitleAlign: "left",
                drawerActiveTintColor: "#39558eff",
                drawerInactiveTintColor: "#666",
                drawerItemStyle: { display: "none" },
                headerRight: () => <UserInfo />,
            }}
        >
            <Drawer.Screen
                name="index"
                options={{
                    title: "Login",
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="view/Login"
                options={{
                    title: "Login",
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="view/Home"
                options={{
                    title: "Home",
                    drawerLabel: "Início",
                    drawerItemStyle: { display: "flex" },
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="view/post/create"
                options={{
                    title: "Novo Post",
                    drawerLabel: "Novo Post",
                    drawerItemStyle: userData?.userType === "professor" ? { display: "flex" } : { display: "none" },
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="add-circle-outline" size={size} color={color} />
                    ),
                    headerLeft: () => {
                        return <BotaoVoltar />
                    },
                }}
            />

            <Drawer.Screen
                name="view/admin/professores"
                options={{
                    title: "Professores",
                    headerTitleStyle: { fontSize: 18 },
                    drawerLabel: "Professores",
                    drawerItemStyle: userData?.userType === "professor" ? { display: "flex" } : { display: "none" },
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="people-outline" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="view/admin/alunos"
                options={{
                    title: "Alunos",
                    drawerLabel: "Alunos",
                    drawerItemStyle: { display: "flex" },
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="people-circle-outline" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="view/post/[id]"
                options={{
                    title: "Post",
                    headerLeft: () => {
                        return <BotaoVoltar />
                    },
                }}
            />
            <Drawer.Screen
                name="view/post/edit/[id]"
                options={{
                    title: "Editar Post",
                    headerLeft: () => {
                        return <BotaoVoltar />
                    },
                }}
            />
            <Drawer.Screen
                name="view/admin/create-professor"
                options={{
                    title: "Novo Professor",
                    headerLeft: () => {
                        return <BotaoVoltar caminho={"/view/admin/professores"} />
                    },
                }}
            />
            <Drawer.Screen
                name="view/admin/edit-professor/[id]"
                options={{
                    title: "Editar Professor",
                    headerLeft: () => {
                        return <BotaoVoltar caminho={"/view/admin/professores"} />
                    },
                }}
            />
            <Drawer.Screen
                name="view/admin/create-aluno"
                options={{
                    title: "Novo Aluno",
                    headerLeft: () => {
                        return <BotaoVoltar caminho={"/view/admin/alunos"} />
                    },
                }}
            />
            <Drawer.Screen
                name="view/admin/edit-aluno/[id]"
                options={{
                    title: "Editar Aluno",
                    headerLeft: () => {
                        return <BotaoVoltar caminho={"/view/admin/alunos"} />
                    },
                }}
            />
        </Drawer>
    );
}
