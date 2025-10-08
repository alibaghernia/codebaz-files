"use client";

import { JSX, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { useRouter } from "next/navigation";
import { dracula } from "@uiw/codemirror-theme-dracula";

export default function JsonQuestion(): JSX.Element {
  return (<div className="p-6 space-y-4 text-white bg-gray-900 min-h-screen">
    <h1 className="text-xl font-bold">❓ این فایلا چی هستن؟ | کدباز</h1>
    <p className="text-gray-300">
      توی این جلسه قراره با چندتا فرمت فایل آشنا بشیم و ببینیم چجوری می‌تونیم بینشون تبدیل انجام بدیم.
      <br />
      - JSON: فرمت محبوب برای ذخیره‌سازی داده‌ها که توی برنامه‌نویسی خیلی استفاده می‌شه.
      <br />  - YAML: فرمت دیگه‌ای برای ذخیره‌سازی داده‌ها که بیشتر توی فایل‌های تنظیمات (config) استفاده می‌شه.
      <br />
      - CSV: فرمت ساده برای ذخیره‌سازی داده‌ها به صورت جدولی که توی فایل‌های اکسل و دیتابیس‌ها کاربرد داره.
      <br />
      - و ...
      <br />
      توی این دوره یاد می‌گیریم چجوری بین این فرمت‌ها تبدیل انجام بدیم و ازشون توی پروژه‌هامون استفاده کنیم.
      <br />
      <br />
      لیست صفحات از اینجا در دسترس هستن:

    </p>
    <div className="flex">
      <a
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition font-semibold mr-2"
        href="/codebaz-files/json/1">تمرین json 1</a>

      <a
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition font-semibold mr-2"
        href="/codebaz-files/json/2">تمرین json 2</a>
    </div>

    <div className="flex">
      <a
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition font-semibold mr-2"
        href="/codebaz-files/yml/1">تمرین yml 1</a>
    </div>


    <div className="flex">
      <a
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition font-semibold mr-2"
        href="/codebaz-files/json2yml">json2yml</a>
    </div>

    <div className="flex">
      <a
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition font-semibold mr-2"
        href="/codebaz-files/csv">show csv</a>
    </div>

     <div className="flex">
      <a
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition font-semibold mr-2"
        href="https://markdownlivepreview.com/">MD Editor</a>
    </div>
    {/* https://markdownlivepreview.com/ */}
  </div>
  )
}
