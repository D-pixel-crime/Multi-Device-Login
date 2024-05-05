"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const Profile = () => {
  const [cookies, setCookies] = useCookies(["user"]);
  const router = useRouter();

  useEffect(() => {
    if (!cookies.user) {
      router.push("/");
    }
    console.log(cookies.user);
  }, []);

  return (
    <div>
      Profile
      <br />
      <Button
        onClick={(e) => {
          e.preventDefault();
          window.open(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
            "_self"
          );
        }}
      >
        Logout
      </Button>
      <br />
      {`Welcome ${cookies.user?.name}`}
    </div>
  );
};
export default Profile;
