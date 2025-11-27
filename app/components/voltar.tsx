import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";


interface BotaoVoltarProps {
    caminho?: string;
}

const BotaoVoltar: React.FC<BotaoVoltarProps> = ({ caminho = "/view/Home" }) => {
    const router = useRouter();

    return(
        <TouchableOpacity onPress={() => router.replace(caminho as any)} style={styles.botao}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
    );
}

export default BotaoVoltar;

const styles = StyleSheet.create({
    botao: {
        marginLeft: 10,
        padding: 5
    }
});