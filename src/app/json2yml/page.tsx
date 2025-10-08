"use client";

import { useState, useEffect } from "react";
import yaml from "js-yaml";

/**
 * کامپوننت تبدیل JSON ↔ YAML
 */
export default function JsonYamlConverter() {
    const [jsonText, setJsonText] = useState<string>(
        JSON.stringify(
            { name: "Ali", age: 22, skills: ["JS", "React"], active: true },
            null,
            2
        )
    );
    const [yamlText, setYamlText] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [lastEdited, setLastEdited] = useState<"json" | "yaml">("json");

    // 🔹 وقتی JSON تغییر کرد → YAML آپدیت بشه
    useEffect(() => {
        if (lastEdited !== "json") return;
        try {
            const parsed = JSON.parse(jsonText);
            const yml = yaml.dump(parsed);
            setYamlText(yml);
            setError(null);
        } catch (err: any) {
            setError("خطا در JSON: " + err.message);
        }
    }, [jsonText]);

    // 🔹 وقتی YAML تغییر کرد → JSON آپدیت بشه
    useEffect(() => {
        if (lastEdited !== "yaml") return;
        try {
            const parsed = yaml.load(yamlText);
            const jsonStr = JSON.stringify(parsed, null, 2);
            setJsonText(jsonStr);
            setError(null);
        } catch (err: any) {
            setError("خطا در YAML: " + err.message);
        }
    }, [yamlText]);

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-6 space-y-4">
            <h1 className="text-2xl font-bold text-blue-400">🔄 JSON ⇄ YAML Converter</h1>
            <p className="text-gray-400">
                هر تغییری در JSON یا YAML بدهید، بخش دیگر به‌صورت خودکار به‌روز می‌شود.
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

                {/* 🔹 YAML Output */}
                <div className="flex flex-col">
                    <label className="font-semibold mb-2 text-yellow-400">YAML</label>
                    <textarea
                        dir="ltr"
                        value={yamlText}
                        onChange={(e) => {
                            setYamlText(e.target.value);
                            setLastEdited("yaml");
                        }}
                        className="w-full h-[400px] font-mono text-sm p-3 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
            </div>

            {error && <div className="text-red-400 mt-3">⚠️ {error}</div>}
        </div>
    );
}
