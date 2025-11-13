import AdminButton from "@/app/components/admin";
import CreatePostButton from "@/app/components/create";
import UserInfo from "@/app/components/userInfo";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#39558eff",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Login",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="view/Login"
        options={{
          title: "Login",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="view/Home"
        options={{
          title: "Home",
          headerLeft: () => null,
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <UserInfo />
              <AdminButton />
              <CreatePostButton />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="view/post/[id]"
        options={{
          title: "Detalhes do Post",
          headerBackTitle: "Voltar",
        }}
      />
      <Stack.Screen
        name="view/post/create"
        options={{
          title: "Novo Post",
          headerBackTitle: "Voltar",
        }}
      />
      <Stack.Screen
        name="view/post/edit/[id]"
        options={{
          title: "Editar Post",
          headerBackTitle: "Voltar",
        }}
      />
      <Stack.Screen
        name="view/admin/professores"
        options={{
          title: "Gerenciar Professores",
          headerBackTitle: "Voltar",
        }}
      />
      <Stack.Screen
        name="view/admin/create-professor"
        options={{
          title: "Novo Professor",
          headerBackTitle: "Voltar",
        }}
      />
      <Stack.Screen
        name="view/admin/edit-professor/[id]"
        options={{
          title: "Editar Professor",
          headerBackTitle: "Voltar",
        }}
      />
    </Stack>
  );
}
