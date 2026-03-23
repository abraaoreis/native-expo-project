import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Ingresa tu correo electrónico.")
    .email("Correo electrónico inválido."),
  password: z
    .string()
    .min(1, "Ingresa tu contraseña.")
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function useLogin() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email") || "";
  const password = watch("password") || "";

  const onLogin = (data: LoginFormData) => {
    Alert.alert("Éxito", "Inicio de sesión validado con éxito!");
    router.replace("/Home");
  };

  const onEmailBlur = () => {
    // Validation handled by react-hook-form
  };

  const onPasswordBlur = () => {
    // Validation handled by react-hook-form
  };

  return {
    control,
    handleSubmit,
    errors,
    setValue,
    email,
    password,
    onLogin: handleSubmit(onLogin),
    onEmailBlur,
    onPasswordBlur,
  };
}
