"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Input from "@/components/input";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [user, setUser] = useState({
    password: "",
    email: "",
  });
  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      toast.success(response.data.message);
      router.push("/");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user.password.length > 0 && user.email.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="auth-form flex flex-col gap-5">
        <h1 className="text-2xl">Login</h1>
        <hr />

        <Input
          label="Email"
          type="email"
          name="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          error={user.email.length === 0 ? "Email is required" : ""}
          placeholder="Enter your email"
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          error={user.password.length === 0 ? "Password is required" : ""}
          placeholder="Enter your password"
          required
        />

        <button
          className={buttonDisabled ? "disabled-btn" : ""}
          onClick={onLogin}
        >
          Login
        </button>

        <Link href="/register">Dont have an account? Register</Link>
      </div>
    </div>
  );
}

export default Login;
