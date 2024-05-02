"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      setUser(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
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
      {user && `Welcome ${(user as { name: string }).name}!`}
    </div>
  );
};
export default Profile;
