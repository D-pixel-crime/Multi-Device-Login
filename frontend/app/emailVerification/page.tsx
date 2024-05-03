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

  //   useLayoutEffect(() => {
  //     const getOtpDetails = async () => {
  //       try {
  //         const { data } = await axios.get(
  //           `${process.env.NEXT_PUBLIC_API_URL}/auth/mailVerification`,
  //           { withCredentials: true }
  //         );

  //         setOtpDetails(data.otpDetails);
  //       } catch (error) {
  //         console.log(error);
  //         router.push("/");
  //       }
  //     };
  //   }, []);

  return (
    <div className="flex-center h-screen w-screen">
      <div className="border-2 rounded-lg py-5 px-7 flex-center flex-col gap-8">
        <h1 className="text-3xl">Enter OTP</h1>
        <form method="post">
          <InputOTP
            maxLength={4}
            value={value}
            onChange={(value) => setValue(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </form>
      </div>
    </div>
  );
};
export default EmailVerification;
