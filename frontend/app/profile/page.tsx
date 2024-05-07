"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const Profile = () => {
  const [cookies, setCookies, removeCookies] = useCookies(["user"]);
  const [allDevices, setAllDevices] = useState([]);
  const router = useRouter();
  const deviceId = localStorage.getItem("deviceId");

  const logout = () => {
    removeCookies("user");
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout/${cookies.user._id}`,
      "_self"
    );
  };

  const getDevices = async () => {
    try {
      if (deviceId) {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/devices/${cookies.user._id}/${deviceId}`
        );
        setAllDevices(data.allDevices);
        console.log(data.allDevices);

        return;
      }
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/devices/${cookies.user._id}/new`
      );
      localStorage.setItem("deviceId", data.newDevice._id);
      setAllDevices(data.allDevices);
      console.log(data.allDevices);

      return;
    } catch (error) {
      console.log(error);
    }
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
