"use client";

import { JSX, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml as yamlLang } from "@codemirror/lang-yaml";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useRouter } from "next/navigation";
import YAML from "js-yaml";

/* 🔹 نوع خطاها برای ولیدیشن */
interface ValidationError {
  path: string;
  message: string;
}

/* 🔹 ساختار داده مورد انتظار */
const expected = {
  team_name: "کدموز",
  members: ["علی", "سارا", "کوروش"],
};

/* 🔹 تابع تشخیص نوع مقدار */
function getType(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

/* 🔹 تابع بازگشتی برای اعتبارسنجی YAML پارس‌شده */
function validate(expected: any, actual: any, path = ""): ValidationError[] {
  const errors: ValidationError[] = [];
  const p = path || "";

  if (actual === undefined) {
    errors.push({
      path: p,
      message: (p ? `'${p}'` : "مقدار") + " وارد نشده است.",
    });
    return errors;
  }

  const et = getType(expected);
  const at = getType(actual);

  // --- برای اشیاء ---
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

    for (const key of keysE) {
      errors.push(...validate(expected[key], actual[key], p ? `${p}.${key}` : key));
    }

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

  // --- برای آرایه‌ها ---
  if (et === "array") {
    if (at !== "array") {
      errors.push({
        path: p,
        message: `'${p || "فیلد"}' باید یک آرایه باشد، اما نوع ${at} دریافت شد.`,
      });
      return errors;
    }

    const expArr = expected as any[];
    const actArr = actual as any[];

    const minLen = Math.min(expArr.length, actArr.length);
    for (let i = 0; i < minLen; i++) {
      errors.push(...validate(expArr[i], actArr[i], p ? `${p}[${i}]` : `[${i}]`));
    }

    if (actArr.length < expArr.length) {
      for (let i = actArr.length; i < expArr.length; i++) {
        errors.push({
          path: p ? `${p}[${i}]` : `[${i}]`,
          message: `عنصر ${i} در '${p || "آرایه"}' وارد نشده است.`,
        });
      }
    }

    if (actArr.length > expArr.length) {
      for (let i = expArr.length; i < actArr.length; i++) {
        errors.push({
          path: p ? `${p}[${i}]` : `[${i}]`,
          message: `عنصر اضافی '${i}' در '${p || "آرایه"}' وجود دارد.`,
        });
      }
    }

    return errors;
  }

  // --- برای نوع‌های ساده (primitive) ---
  if (et !== at) {
    errors.push({
      path: p,
      message: `نوع '${p}' اشتباه است: انتظار ${et} ولی ${at} دریافت شد.`,
    });
    return errors;
  }

  if (expected !== actual) {
    errors.push({
      path: p,
      message: `مقدار '${p}' نادرست است: انتظار '${String(
        expected
      )}' ولی '${String(actual)}' دریافت شد.`,
    });
  }

  return errors;
}

/* 🔹 کامپوننت اصلی سوال YAML */
export default function YamlQuestion(): JSX.Element {
  const [value, setValue] = useState<string>(
    `team_name: "یوهو"\nmembers:\n  - "علی"\n `
  );
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const router = useRouter();

  // 🔹 هندل تغییر محتوا
  const handleChange = (val: string) => {
    setValue(val);

    try {
      YAML.load(val);
      setSyntaxError(null);
      setValidationErrors([]);
    } catch (e: any) {
      setSyntaxError(e.message);
      setValidationErrors([]);
    }
  };

  // 🔹 دکمه بررسی
  const handleValidate = () => {
    let parsed: any;
    try {
      parsed = YAML.load(value);
    } catch {
      setSyntaxError("YAML نادرست است");
      return;
    }

    const errs = validate(expected, parsed, "");
    setValidationErrors(errs);

    if (errs.length === 0) {
      router.push("/next");
    }
  };

  return (
    <div className="p-6 space-y-4 text-white bg-gray-900 min-h-screen">
      <h1 className="text-xl font-bold">❓ سوال</h1>
      <p className="text-gray-300">
        اطلاعات تیم را در قالب یک فایل YAML بنویسید:
        <br /> تیم <b>کدموز</b> شامل اعضای <b>علی، سارا و کوروش</b> است.
      </p>

      {/* 🔹 ادیتور برای YAML */}
      <CodeMirror
        dir="ltr"
        value={value}
        height="300px"
        extensions={[yamlLang()]}
        theme={dracula}
        onChange={handleChange}
      />

      {/* 🔹 خطای سینتکس */}
      {syntaxError && (
        <div className="text-red-400">⚠️ خطای سینتکس: {syntaxError}</div>
      )}

      {/* 🔹 دکمه بررسی */}
      <button
        className={`px-4 py-2 rounded ${
          syntaxError
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={!!syntaxError}
        onClick={handleValidate}
      >
        بررسی
      </button>

      {/* 🔹 نمایش خطاهای ولیدیشن */}
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
