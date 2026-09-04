import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { setCredentials } from "../../../store/slices/authSlice";
import { authService } from "../../../services/authService";
import styles from "../../../styles/login.module.css";
import { useAppDispatch } from "../../../store/hook";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      dispatch(
        setCredentials({ user: data.user, accessToken: data.accessToken }),
      );
      if (data.user.role === "ADMIN") navigate("/admin/dashboard");
      else if (data.user.role === "RESIDENT") navigate("/resident/dashboard");
      else if (data.user.role === "GUARD") navigate("/guard/dashboard");
    },
  });

  const onSubmit = (data: LoginForm) => {
    login(data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <h1>NestIQ</h1>
          <p>Smart Residential Society Management</p>
        </div>

        <h2 className={styles.title}>Welcome back</h2>
        <p className={styles.subtitle}>Sign in to your account</p>

        {error && (
          <div className={styles.errorAlert}>
            Invalid email or password. Please try again.
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email Id"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
            />
            {errors.password && (
              <span className={styles.errorText}>
                {errors.password.message}
              </span>
            )}
          </div>

          <div className={styles.forgotPassword}>Forgot password?</div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.divider}>or</div>

        <p className={styles.registerLink}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register here</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
