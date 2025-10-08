"use client";

import { useState, useEffect } from "react";
import { js2xml, xml2js } from "xml-js";

/**
 * مبدل دوطرفه JSON ⇄ XML
 * از پکیج xml-js برای تبدیل استفاده می‌کند.
 */
export default function JsonXmlConverter() {
    // مقدار اولیه JSON
    const [jsonText, setJsonText] = useState<string>(
        JSON.stringify(
            { user: { name: "Ali", age: 23, skills: ["JS", "React"], active: true } },
            null,
            2
        )
    );
    const [xmlText, setXmlText] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [lastEdited, setLastEdited] = useState<"json" | "xml">("json");

    // 🔹 وقتی JSON تغییر می‌کند → XML آپدیت شود
    useEffect(() => {
        if (lastEdited !== "json") return;
        try {
            const parsed = JSON.parse(jsonText);
            const xml = js2xml(parsed, { compact: true, spaces: 2 });
            setXmlText(xml);
            setError(null);
        } catch (err: any) {
            setError("خطا در JSON: " + err.message);
        }
    }, [jsonText]);

    // 🔹 وقتی XML تغییر می‌کند → JSON آپدیت شود
    useEffect(() => {
        if (lastEdited !== "xml") return;
        try {
            const parsed = xml2js(xmlText, { compact: true });
            const jsonStr = JSON.stringify(parsed, null, 2);
            setJsonText(jsonStr);
            setError(null);
        } catch (err: any) {
            setError("خطا در XML: " + err.message);
        }
    }, [xmlText]);

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-6 space-y-4">
            <h1 className="text-2xl font-bold text-blue-400">🔄 JSON ⇄ XML Converter</h1>
            <p className="text-gray-400">
                هر تغییری در JSON یا XML بدهید، سمت دیگر به‌صورت خودکار به‌روز می‌شود.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
                {/* 🔸 JSON Input */}
                <div className="flex flex-col">
                    <label className="font-semibold mb-2 text-green-400">JSON</label>
                    <textarea
                        dir="ltr"
                        value={jsonText}
                        onChange={(e) => {
                            setJsonText(e.target.value);
                            setLastEdited("json");
                        }}
                        className="w-full h-[400px] font-mono text-sm p-3 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* 🔹 XML Output */}
                <div className="flex flex-col">
                    <label className="font-semibold mb-2 text-yellow-400">XML</label>
                    <textarea
                        dir="ltr"
                        value={xmlText}
                        onChange={(e) => {
                            setXmlText(e.target.value);
                            setLastEdited("xml");
                        }}
                        className="w-full h-[400px] font-mono text-sm p-3 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
            </div>

            {error && <div className="text-red-400 mt-3">⚠️ {error}</div>}
        </div>
    );
}
