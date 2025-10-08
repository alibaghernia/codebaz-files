"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { useRouter } from "next/navigation";
import { dracula } from "@uiw/codemirror-theme-dracula";

// 🔹 JSON مورد انتظار
const expected = {
  name: "ali",
  family: "zare",
  age: 20,
  is_student: true,
  has_job: null,
};

// 🔹 گرفتن نوع مقدار
function getType(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

// 🔹 تابع اعتبارسنجی بازگشتی
function validate(expected, actual: unknown, path = ""){
  const errors = [];
  const p = path || "";

  if (actual === undefined) {
    errors.push({ path: p, message: (p ? `'${p}'` : "مقدار") + " وارد نشده است." });
    return errors;
  }

  const et = getType(expected);
  const at = getType(actual);

  if (et === "object") {
    if (at !== "object") {
      errors.push({ path: p, message: `'${p || "فیلد"}' باید یک شیء باشد، اما نوع ${at} دریافت شد.` });
      return errors;
    }
    const keysE = Object.keys(expected);
    const keysA = Object.keys(actual);

    for (const key of keysE) {
      errors.push(...validate(expected[key], actual[key], p ? `${p}.${key}` : key));
    }

    for (const key of keysA) {
      if (!keysE.includes(key)) {
        errors.push({ path: p ? `${p}.${key}` : key, message: `فیلد اضافی '${key}' در '${p || "root"}' وجود دارد.` });
      }
    }
    return errors;
  }

  if (et !== at) {
    errors.push({ path: p, message: `نوع '${p}' اشتباه است: انتظار ${et} ولی ${at} دریافت شد.` });
    return errors;
  }

  if (expected !== actual) {
    errors.push({ path: p, message: `مقدار '${p}' نادرست است: انتظار '${String(expected)}' ولی '${String(actual)}' دریافت شد.` });
  }
  return errors;
}

export default function JsonQuestion() {
  const [value, setValue] = useState(`{\n  "name": "",\n  "family": "",\n  "age": 0,\n  "is_student": false,\n  "has_job": null\n}`);
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const router = useRouter();

  const handleChange = (val: string) => {
    setValue(val);
    try {
      JSON.parse(val);
      setSyntaxError(null);
      setValidationErrors([]); // فقط بعد از دکمه ولیدیت نشون داده میشه
    } catch (e) {
      setSyntaxError(e.message);
      setValidationErrors([]);
    }
  };

  const handleValidate = () => {
    let parsed;
    try {
      parsed = JSON.parse(value);
    } catch {
      setSyntaxError("JSON نادرست است");
      return;
    }

    const errs = validate(expected, parsed, "");
    setValidationErrors(errs);

    if (errs.length === 0) {
      // ✅ درست بود
      router.push("/next"); // مرحله بعدی
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

      <CodeMirror
        dir="ltr"
        value={value}
        height="300px"
        extensions={[json()]}
        theme={dracula}
        onChange={handleChange}
      />

      {syntaxError && <div className="text-red-400">⚠️ خطای سینتکس: {syntaxError}</div>}

      <button
        className={`px-4 py-2 rounded ${syntaxError ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        disabled={!!syntaxError}
        onClick={handleValidate}
      >
        بررسی
      </button>

      {validationErrors.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold text-red-400">اشکالات پیدا شده:</h2>
          <ul className="list-disc list-inside text-red-300">
            {validationErrors.map((e, i) => (
              <li key={i}>
                {e.path ? `${e.path}: ` : ""}{e.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
