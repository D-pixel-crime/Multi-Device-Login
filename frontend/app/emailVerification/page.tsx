"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";

const EmailVerification = () => {
  const [otpDetails, setOtpDetails] = useState(null);
  const [value, setValue] = useState("");
  const router = useRouter();
  const [user, setUser] = useState(null);

  const verifyOtp = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verifyOtp`,
        { input: value, otpId: otpDetails!._id }
      );

      if (data.success) {
        router.push("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      setUser(data.user);
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  };

  const getOtpDetails = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/mailVerification`,
        { user: user }
      );

      setOtpDetails(data.otpDetails);
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  };

  useLayoutEffect(() => {
    getUser();
    getOtpDetails();
  }, []);

  return (
    <div className="flex-center h-screen w-screen bg-slate-200">
      <div className="border-2 rounded-lg py-5 px-7 flex-center flex-col gap-8">
        <h1 className="text-3xl font-bold">Enter OTP</h1>
        <form method="post">
          <InputOTP
            maxLength={4}
            value={value}
            onChange={(value) => setValue(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="border border-gray-400" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={1} className="border border-gray-400" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={2} className="border border-gray-400" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} className="border border-gray-400" />
            </InputOTPGroup>
          </InputOTP>
        </form>
        {otpDetails && (
          <p className="mt-5 text-red-500">
            *Please check your email for the OTP sent*
          </p>
        )}
      </div>
    </div>
  );
};
export default EmailVerification;
