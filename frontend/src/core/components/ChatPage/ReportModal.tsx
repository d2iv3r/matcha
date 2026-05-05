"use client";

import { X } from "lucide-react";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    userFirstName: string;
    reportReasons: string[];
    onToggleReason: (reason: string) => void;
    onSendReport: () => void;
}

export const ReportModal = ({
    isOpen,
    onClose,
    userFirstName,
    reportReasons,
    onToggleReason,
    onSendReport,
}: ReportModalProps) => {
    if (!isOpen) return null;

    const reasons = [
        "Harassment",
        "Threats",
        "Inappropriate Content",
        "Catfishing",
        "Violation of Terms",
        "Unwanted Advances",
        "Offensive Language",
        "Unsolicited Explicit Content",
        "Disrespectful Behavior",
        "Privacy Concerns",
    ];

    return (
        <div className="fixed inset-0 z-100 flex justify-center items-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#EAE8FC] w-[600px] max-w-[90vw] rounded-[32px] p-6 shadow-2xl relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-black hover:bg-gray-200 rounded-full transition-colors cursor-pointer p-1"
                >
                    <X size={24} strokeWidth={2.5} />
                </button>
                <h2 className="text-base font-bold text-gray-900 mb-6">
                    Report {userFirstName}
                </h2>
                <p className="text-gray-700 mb-8 text-md font-medium">
                    Why did you report this user?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 mb-12 pl-1">
                    {reasons.map((reason,index) => (
                        <label
                            key={`${reason}-${index}`}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                checked={reportReasons.includes(reason)}
                                onChange={() => onToggleReason(reason)}
                                className="w-4 h-4 rounded text-[#6367FF] border-[#6367FF] focus:ring-[#6367FF] accent-[#6367FF] cursor-pointer"
                            />
                            <span className="text-gray-900 tracking-tight text-xs font-semibold group-hover:text-[#6367FF] transition-colors">
                                {reason}
                            </span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end gap-3 mt-auto">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-xs bg-[#DFDBFE] text-[#555DFF] font-bold tracking-wide rounded-xl hover:bg-[#D5CEFF] transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSendReport}
                        className="px-6 py-2.5 text-xs bg-[#424AB5] text-white font-bold tracking-wide rounded-xl hover:bg-[#343999] transition-colors cursor-pointer shadow-lg shadow-[#424AB5]/20"
                    >
                        Send Report
                    </button>
                </div>
            </div>
        </div>
    );
};
