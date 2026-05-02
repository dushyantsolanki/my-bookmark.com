"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useFormik } from "formik"
import * as Yup from "yup"
import api from "@/lib/axios"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useState } from "react"

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, "Name too short").required("Full name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      setError(null)
      try {
        const response = await api.post("/auth/register", values)
        const { accessToken, user } = response.data

        // Store access token in cookie
        Cookies.set("accessToken", accessToken)
        localStorage.setItem("user", JSON.stringify(user))

        router.push("/")
      } catch (err: any) {
        setError(err.response?.data?.error || "Registration failed. Please try again.")
      }
    },
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={formik.handleSubmit} className="p-6 md:p-8 flex flex-col justify-center">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-4">
                <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                <p className="text-balance text-muted-foreground">
                  Start organizing your digital life today
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center mb-4 font-medium">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className={cn(
                    "h-11 border border-accent-foreground/20",
                    formik.touched.name && formik.errors.name && "border-destructive ring-destructive"
                  )}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name && (
                  <FieldError>{formik.errors.name}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  className={cn(
                    "h-11 border border-accent-foreground/20",
                    formik.touched.email && formik.errors.email && "border-destructive ring-destructive"
                  )}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <FieldError>{formik.errors.email}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className={cn(
                    "h-11 border border-accent-foreground/20",
                    formik.touched.password && formik.errors.password && "border-destructive ring-destructive"
                  )}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password && (
                  <FieldError>{formik.errors.password}</FieldError>
                )}
              </Field>
              <Field className="pt-2">
                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="h-11 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {formik.isSubmitting ? "Creating account..." : "Sign Up"}
                </Button>
              </Field>
              <FieldSeparator className="my-2">
                Or sign up with
              </FieldSeparator>
              <div className="flex flex-col gap-4">
                <Button variant="outline" type="button" className="h-11 flex items-center gap-2 transition-all hover:bg-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>
              <FieldDescription className="text-center mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Login
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-zinc-950 md:block">
            <img
              src="/login-illustration.png"
              alt="Register Illustration"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent flex flex-col justify-end p-10">
              <h2 className="text-white text-2xl font-bold mb-2">Secure Your Knowledge</h2>
              <p className="text-zinc-400 text-sm max-w-[280px]">
                Never lose a great idea or a useful link again. Create your personal library in seconds.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
