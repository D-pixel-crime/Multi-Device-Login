"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { useCookies } from "react-cookie";

const EmailVerification = () => {
  const [otpDetails, setOtpDetails] = useState(null);
  const [value, setValue] = useState("");
  const [inCorrectOtp, setInCorrectOtp] = useState(false);
  const [expiredOrNot, setExpiredOrNot] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cookies, setCookies] = useCookies(["user"]);

  const verifyOtp = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verifyOtp`,
        { input: value, otpDetails: otpDetails }
      );

      if (data.isMatch) {
        setCookies("user", user, {
          path: "/",
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        });
        router.push("/profile");
      }
    } catch (error: any) {
      console.log(error.response);
      if (error.response.data.error === true) {
        setExpiredOrNot(true);
        setOtpDetails(null);
        setInCorrectOtp(false);
      } else setInCorrectOtp(true);
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
        { currentUser: user }
      );

      setValue("");
      setOtpDetails(data.otpDetails);
      setInCorrectOtp(false);
      setExpiredOrNot(false);
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex-center h-screen w-screen bg-slate-200">
      <div className="border-2 rounded-lg py-5 px-7 flex-center flex-col gap-8">
        <h1 className="text-3xl font-bold">Enter OTP</h1>
        <form
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            verifyOtp();
          }}
        >
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
        {isFirstTime && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              setIsFirstTime(false);
              getOtpDetails();
            }}
          >
            Get OTP
          </Button>
        )}
        {expiredOrNot && (
          <div className="flex-center flex-col">
            <Button
              onClick={(e) => {
                e.preventDefault();
                getOtpDetails();
              }}
            >
              Resend OTP
            </Button>
            <p className="mt-5 text-red-500">
              *The OTP has expired, please request a new OTP*
            </p>
          </div>
        )}
        {inCorrectOtp && <p className="text-red-500">*Incorrect OTP*</p>}
        {otpDetails && (
          <p className="mt-5 text-green-600">
            *Please check your email for the OTP sent*
          </p>
        )}
      </div>
    </div>
  );
};
export default EmailVerification;
