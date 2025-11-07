import CreatePostButton from "@/app/components/create";
import { Stack } from "expo-router";

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
          headerRight: () => <CreatePostButton />,
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
    </Stack>
  );
}
