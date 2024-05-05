"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const Profile = () => {
  const [cookies, setCookies, removeCookies] = useCookies(["user"]);
  const router = useRouter();

  const logout = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, "_self");
    removeCookies("user");
  };

  const getDevices = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/devices/${cookies.user._id}`
    );
    console.log(data);
  };

  useEffect(() => {
    if (!cookies.user) {
      router.push("/");
    }
    getDevices();
  }, []);

  return (
    <div>
      Profile
      <br />
      <Button
        onClick={(e) => {
          e.preventDefault();
          logout();
          removeCookies("user");
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
