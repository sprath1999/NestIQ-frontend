import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../../services/authService";
import styles from "../../../styles/regidster.module.css";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(10, "Enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["ADMIN", "RESIDENT", "GUARD"]),
    flatNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "RESIDENT" },
  });

  const selectedRole = watch("role");

  const {
    mutate: registerUser,
    isPending,
    error,
  } = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      navigate("/login");
    },
  });

  const onSubmit = (data: RegisterForm) => {
    const { confirmPassword, ...payload } = data;
    registerUser(payload);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <h1>NestIQ</h1>
          <p>Smart Residential Society Management</p>
        </div>

        <h2 className={styles.title}>Create account</h2>
        <p className={styles.subtitle}>Fill in your details to get started</p>

        {error && (
          <div className={styles.errorAlert}>
            Something went wrong. Please try again.
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name.message}</span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Phone</label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="9876543210"
                className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
              />
              {errors.phone && (
                <span className={styles.errorText}>{errors.phone.message}</span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Role</label>
            <select {...register("role")} className={styles.select}>
              <option value="RESIDENT">Resident</option>
              <option value="ADMIN">Admin</option>
              <option value="GUARD">Security Guard</option>
            </select>
          </div>

          {selectedRole === "RESIDENT" && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Flat Number</label>
              <input
                {...register("flatNumber")}
                type="text"
                placeholder="e.g. A-101"
                className={`${styles.input} ${errors.flatNumber ? styles.inputError : ""}`}
              />
              {errors.flatNumber && (
                <span className={styles.errorText}>
                  {errors.flatNumber.message}
                </span>
              )}
            </div>
          )}

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Min 6 characters"
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              />
              {errors.password && (
                <span className={styles.errorText}>
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Confirm Password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Repeat password"
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
              />
              {errors.confirmPassword && (
                <span className={styles.errorText}>
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className={styles.loginLink}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
