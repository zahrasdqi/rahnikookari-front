import { useEffect, useMemo, useRef, useState } from "react";
import "./Otp.scss";


export default function Otp() {
  const LENGTH = 4;

  const [code, setCode] = useState(Array(LENGTH).fill(""));
  const inputsRef = useRef([]);

  const otpValue = useMemo(() => code.join(""), [code]);

  useEffect(() => {
    // فوکوس روی اولین باکس
    inputsRef.current?.[0]?.focus?.();
  }, []);

  function setAt(index, value) {
    setCode((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleChange(index, e) {
    const v = e.target.value;

    // فقط رقم
    const digit = v.replace(/\D/g, "").slice(-1);
    setAt(index, digit);

    // برو بعدی
    if (digit && index < LENGTH - 1) {
      inputsRef.current[index + 1]?.focus?.();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace") {
      if (code[index]) {
        setAt(index, "");
        return;
      }
      // اگر خالی بود، برو قبلی
      if (index > 0) {
        inputsRef.current[index - 1]?.focus?.();
        setAt(index - 1, "");
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus?.();
    }

    if (e.key === "ArrowRight" && index < LENGTH - 1) {
      inputsRef.current[index + 1]?.focus?.();
    }
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!text) return;

    e.preventDefault();
    const chars = text.split("");
    setCode((prev) => {
      const next = [...prev];
      for (let i = 0; i < LENGTH; i++) next[i] = chars[i] || "";
      return next;
    });

    const nextFocus = Math.min(text.length, LENGTH - 1);
    inputsRef.current[nextFocus]?.focus?.();
  }

  function handleSubmit(e) {
    e.preventDefault();

    // فعلاً فقط UI: بعداً اینجا API را وصل می‌کنی
    console.log("OTP:", otpValue);
  }

  return (
    <div className="otp-page">
      <div className="otp-card">
        <h1 className="otp-card__brand">راه نیک</h1>

        <p className="otp-card__title">کد چهار رقمی را وارد کنید</p>

        <form className="otp-form" onSubmit={handleSubmit}>
          <div className="otp-inputs" dir="ltr" onPaste={handlePaste}>
            {code.map((val, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                className="otp-input"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`digit-${i + 1}`}
              />
            ))}
          </div>

          <button   className="otp-button" type="submit" disabled={otpValue.length !== LENGTH}>
            ورود
          </button>

          <button className="otp-resend" type="button" onClick={() => console.log("resend")}>
            ارسال مجدد کد
          </button>
        </form>
      </div>
    </div>
  );
}
