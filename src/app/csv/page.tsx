"use client";

import { useState } from "react";

/**
 * تابع ساده برای تبدیل CSV به آرایه دوبعدی
 * خط‌ها با \n جدا می‌شن و سلول‌ها با ,
 */
function parseCSV(text: string): string[][] {
    return text
        .trim()
        .split("\n")
        .map((line) => line.split(",").map((cell) => cell.trim()));
}

export default function CsvViewer() {
    const [csvText, setCsvText] = useState<string>("name,age,city\nAli,22,Tehran\nSara,25,Shiraz");
    const [rows, setRows] = useState<string[][]>([]);
    const [error, setError] = useState<string | null>(null);

    // وقتی دکمه نمایش زده می‌شود
    const handleParse = () => {
        try {
            if (!csvText.trim()) {
                setError("لطفاً متنی وارد کنید");
                setRows([]);
                return;
            }

            const parsed = parseCSV(csvText);
            if (parsed.length === 0) throw new Error("CSV خالی است");
            setRows(parsed);
            setError(null);
        } catch (err: any) {
            setError("خطا در پردازش CSV: " + err.message);
            setRows([]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-6 space-y-4">
            <h1 className="text-2xl font-bold text-blue-400">🧩 CSV Viewer</h1>

            <p className="text-gray-400">
                در باکس زیر متن CSV را بنویسید و دکمه نمایش را بزنید تا به‌صورت جدول نمایش داده شود.
            </p>

            <textarea
                dir="ltr"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="w-full h-48 p-3 rounded bg-gray-800 text-white font-mono text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`مثلاً:\nname,age,city\nAli,22,Tehran\nSara,25,Shiraz`}
            />

            <button
                onClick={handleParse}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition font-semibold"
            >
                نمایش جدول
            </button>

            {error && <div className="text-red-400">{error}</div>}

            {rows.length > 0 && (
                <div className="overflow-x-auto mt-6">
                    <table className="min-w-full border border-gray-700 border-collapse">
                        <thead className="bg-gray-800">
                            <tr>
                                {rows[0].map((header, i) => (
                                    <th key={i} className="border border-gray-700 px-3 py-2 text-left font-bold">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.slice(1).map((row, ri) => (
                                <tr key={ri} className="odd:bg-gray-900 even:bg-gray-800">
                                    {row.map((cell, ci) => (
                                        <td key={ci} className="border border-gray-700 px-3 py-2">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
