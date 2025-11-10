import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const AdminButton: React.FC = () => {
    const handlePress = () => {
        router.push("/view/admin/professores");
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Professores</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        marginRight: 15,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "#ffffff20",
        borderRadius: 6,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default AdminButton;