import { useLogin } from "@/hooks/useLogin";
import { Controller } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const { control, errors, onLogin } = useLogin();

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <View style={styles.group}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="tu@correo.com"
                placeholderTextColor="#999"
                style={styles.input}
              />
            )}
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          ) : null}
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Contraseña</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                placeholder="********"
                placeholderTextColor="#999"
                style={styles.input}
              />
            )}
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          ) : null}
        </View>

        <Pressable style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>

        <View style={styles.linksRow}>
          <Pressable
            onPress={() =>
              Alert.alert(
                "Olvidé mi contraseña",
                "Redefinición de contraseña solicitada.",
              )
            }
          >
            <Text style={styles.linkText}>Olvidé mi contraseña</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              Alert.alert(
                "Crear usuario",
                "Navega al registro de usuario aquí.",
              )
            }
          >
            <Text style={styles.linkText}>Crear usuario</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "rgb(90, 91, 99)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "center",
    marginBottom: 16,
  },
  group: {
    marginBottom: 14,
  },
  label: {
    color: "#333",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#111",
    backgroundColor: "#fff",
  },
  errorText: {
    marginTop: 4,
    color: "#d00",
    fontSize: 13,
  },
  button: {
    backgroundColor: "#db052c",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  linksRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  linkText: {
    color: "#333",
    fontSize: 14,
  },
});
