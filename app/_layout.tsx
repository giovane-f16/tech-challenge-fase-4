import { NewPostButton } from "@/app/components/create";
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
          title: "Blogging",
          headerRight: () => <NewPostButton />
        }}
      />
      <Stack.Screen
        name="view/Home"
        options={{
          title: "Home",
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
    </Stack>
  );
}
