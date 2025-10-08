"use client";

import { JSX, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { useRouter } from "next/navigation";
import { dracula } from "@uiw/codemirror-theme-dracula";

/* 
🔹 نوع خطاهای اعتبارسنجی
هر خطا شامل مسیر (path) و پیغام خطا (message) است
*/
interface ValidationError {
  path: string;
  message: string;
}

/* 
🔹 JSON مورد انتظار
یعنی ساختار صحیحی که کاربر باید شبیه آن بنویسد
*/
const expected = {
  "name": "علی",
  "family": "زارع",
  "age": 20,
  "is_student": true,
  "has_job": null
};

/*
🔹 تابعی برای تشخیص نوع یک مقدار
در جاوااسکریپت typeof برای null مقدار "object" برمی‌گرداند،
پس با بررسی جداگانه، مقدار واقعی را تشخیص می‌دهیم.
*/
function getType(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

/*
🔹 تابع بازگشتی برای اعتبارسنجی JSON وارد شده توسط کاربر
expected → ساختار مرجع (الگوی درست)
actual → مقدار واقعی کاربر
path → مسیر فعلی در شیء (مثلاً "user.name")
*/
function validate(expected: any, actual: any, path = ""): ValidationError[] {
  const errors: ValidationError[] = [];
  const p = path || "";

  // اگر فیلد وجود ندارد
  if (actual === undefined) {
    errors.push({
      path: p,
      message: (p ? `'${p}'` : "مقدار") + " وارد نشده است.",
    });
    return errors;
  }

  const et = getType(expected);
  const at = getType(actual);

  // 🔹 اگر انتظار داشتیم یک شیء باشد ولی نیست
  if (et === "object") {
    if (at !== "object") {
      errors.push({
        path: p,
        message: `'${p || "فیلد"}' باید یک شیء باشد، اما نوع ${at} دریافت شد.`,
      });
      return errors;
    }

    const keysE = Object.keys(expected);
    const keysA = Object.keys(actual);

    // بررسی تمام کلیدهای مورد انتظار
    for (const key of keysE) {
      errors.push(...validate(expected[key], actual[key], p ? `${p}.${key}` : key));
    }

    // پیدا کردن کلیدهای اضافی
    for (const key of keysA) {
      if (!keysE.includes(key)) {
        errors.push({
          path: p ? `${p}.${key}` : key,
          message: `فیلد اضافی '${key}' در '${p || "root"}' وجود دارد.`,
        });
      }
    }

    return errors;
  }

  // 🔹 اگر نوع‌ها متفاوت باشند
  if (et !== at) {
    errors.push({
      path: p,
      message: `نوع '${p}' اشتباه است: انتظار ${et} ولی ${at} دریافت شد.`,
    });
    return errors;
  }

  // 🔹 اگر مقدار درست ولی متفاوت باشد
  if (expected !== actual) {
    errors.push({
      path: p,
      message: `مقدار '${p}' نادرست است: انتظار '${String(expected)}' ولی '${String(actual)}' دریافت شد.`,
    });
  }

  return errors;
}

/*
🔹 کامپوننت اصلی سوال JSON
*/
export default function JsonQuestion(): JSX.Element {
  // محتوای ادیتور (به صورت string)
  const [value, setValue] = useState<string>(
    `{
  "name": "ممد",
  "family": true,
  age: null,
  "is_student": 5,
  "has_job": false,
}`
  );

  // خطای سینتکس JSON (در صورت وجود)
  const [syntaxError, setSyntaxError] = useState<string | null>(null);

  // لیست خطاهای اعتبارسنجی
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // برای هدایت به صفحه بعد
  const router = useRouter();

  /*
  🔹 وقتی محتوای ادیتور تغییر می‌کند:
  - مقدار جدید ذخیره می‌شود
  - درستی JSON از نظر سینتکس بررسی می‌شود
  */
  const handleChange = (val: string) => {
    setValue(val);

    try {
      JSON.parse(val); // اگر درست بود
      setSyntaxError(null);
      setValidationErrors([]); // خطاها فقط بعد از دکمه "بررسی" نمایش داده می‌شوند
    } catch (e: any) {
      // اگر JSON اشتباه بود
      setSyntaxError(e.message);
      setValidationErrors([]);
    }
  };

  /*
  🔹 وقتی کاربر دکمه "بررسی" را می‌زند:
  - JSON پارس می‌شود
  - با expected مقایسه می‌شود
  - در صورت نبود خطا → مرحله بعد
  */
  const handleValidate = () => {
    let parsed: any;
    try {
      parsed = JSON.parse(value);
    } catch {
      setSyntaxError("JSON نادرست است");
      return;
    }

    const errs = validate(expected, parsed, "");
    setValidationErrors(errs);

    // اگر هیچ خطایی نبود
    if (errs.length === 0) {
      alert('ایول بریم مرحله بعد')
      router.push("/json/2");
    }
  };

  return (
    <div className="p-6 space-y-4 text-white bg-gray-900 min-h-screen">
      <h1 className="text-xl font-bold">❓ سوال</h1>
      <p className="text-gray-300">
        مشخصات علی را در قالب یک آبجکت JSON بنویسید:
        <br /> او <b>علی زارع</b> است،
        <br /> <b>۲۰ سال</b> دارد،
        <br /> <b>دانشجو</b> است،
        <br /> و نمی‌دانیم شغل دارد یا نه.
      </p>

      {/* 🔹 ادیتور CodeMirror برای وارد کردن JSON */}
      <CodeMirror
        dir="ltr"
        value={value}
        height="300px"
        extensions={[json()]}
        theme={dracula}
        onChange={handleChange}
      />

      {/* 🔹 نمایش خطای سینتکس (در صورت وجود) */}
      {syntaxError && (
        <div className="text-red-400">⚠️ خطای سینتکس: {syntaxError}</div>
      )}

      {/* 🔹 دکمه بررسی (غیرفعال در صورت خطا) */}
      <button
        className={`px-4 py-2 rounded ${syntaxError ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        disabled={!!syntaxError}
        onClick={handleValidate}
      >
        بررسی
      </button>

      {/* 🔹 نمایش خطاهای اعتبارسنجی */}
      {validationErrors.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold text-red-400">اشکالات پیدا شده:</h2>
          <ul className="list-disc list-inside text-red-300">
            {validationErrors.map((e, i) => (
              <li key={i}>
                {e.path ? `${e.path}: ` : ""}
                {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
