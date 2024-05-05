"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import googleIcon from "../components/icons/google.svg";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [cookies, setCookies] = useCookies(["user"]);
  const router = useRouter();

  useEffect(() => {
    if (cookies.user) router.push("/profile");
  }, []);

  const googleAuth = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`,
      "_self"
    );
  };

  return (
    <section className="flex-center h-screen">
      <Card>
        <CardHeader className="border-b mb-6">
          <CardTitle className="font-extrabold">LOGIN</CardTitle>
          <CardDescription>Login to Real-Time-Dashboard</CardDescription>
        </CardHeader>
        <CardContent className="flex-center">
          <div className="flex gap-2">
            <Image src={googleIcon} height={40} width={40} alt="google logo" />
            <Button className="login-button" onClick={googleAuth}>
              Login With Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
export default Login;
