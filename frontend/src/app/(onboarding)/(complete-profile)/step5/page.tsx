"use client";
import { redirect } from "next/navigation";
import { Check, Wallpaper, X, Plus } from "lucide-react";
import { useState, useRef } from "react";

export default function Page() {
    const [images, setImages] = useState<{file: File, url: string}[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        let validFiles = files.filter(file => {
            if (file.size > 3 * 1024 * 1024) {
                alert(`File ${file.name} is larger than 3MB.`);
                return false;
            }
            if (!file.type.startsWith('image/')) {
                alert(`File ${file.name} is not an image.`);
                return false;
            }
            return true;
        });

        if (images.length + validFiles.length > 5) {
            alert("You can only upload up to 5 photos.");
            validFiles = validFiles.slice(0, 5 - images.length);
        }

        const newImages = validFiles.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        setImages(prev => [...prev, ...newImages]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };
    return (
        <div className="h-full w-full flex flex-col gap-4 items-center justify-between p-6">
            <div className="relative w-full flex flex-row gap-4 justify-between items-center mb-2">
                <div className="absolute w-full h-[3px] bg-[#6367FF]" />
                <div className="w-full flex flex-row gap-4 justify-between z-10">
                    <div className="w-8 h-8 rounded-full border-[3px] bg-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        <Check size={20} color="white" strokeWidth={3} />
                    </div>
                    <div className="w-8 h-8 rounded-full border-[3px] bg-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        <Check size={20} color="white" strokeWidth={3} />
                    </div>
                    <div className="w-8 h-8 rounded-full border-[3px] bg-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        <Check size={20} color="white" strokeWidth={3} />
                    </div>
                    <div className="w-8 h-8 rounded-full border-[3px] bg-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        <Check size={20} color="white" strokeWidth={3} />
                    </div>
                    <div className="w-8 h-8 bg-[#FFF0FE] rounded-full border-[3px] border-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        5
                    </div>
                </div>
            </div>
            <div className="w-full flex-2 gap-2 flex flex-col px-3">
                <p className="text-md font-extrabold text-[#4B4B4B] mb-1">
                    Step 5 of 5
                </p>
                <h1 className="text-2xl font-medium">Complete your profile</h1>
                <p className="text-black/50 text-sm mb-2">
                    A picture is worth a thousand words. Upload up to 5 photos
                    to show your personality.
                </p>
                <div className="w-full flex items-center flex-col gap-3 bg-[#E2DCFF] rounded-2xl p-4">
                    <input 
                        type="file" 
                        multiple 
                        accept="image/jpeg, image/png" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                    />
                    
                    {/* Upload header */}
                    <div 
                        className="flex flex-col justify-center items-center py-1 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Wallpaper size={28} className="mb-2 text-[#4B4B4B]" />
                        <p className="text-xs font-medium text-[#4B4B4B]">Choose a file, jpeg and png formats up to 3MB</p>
                    </div>
                    
                    {/* Primary uploaded file */}
                    {images[0] ? (
                        <div className="w-full h-[88px] flex items-center justify-between p-3 border border-[#6367FF] rounded-xl bg-transparent">
                            <div className="flex items-center gap-4 w-full h-full overflow-hidden">
                                <div 
                                    className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0" 
                                    style={{ backgroundImage: `url(${images[0].url})` }}
                                />
                                <div className="flex flex-col gap-1 overflow-hidden h-full justify-center w-[calc(100%-80px)]">
                                    <p className="font-semibold text-sm truncate">{images[0].file.name}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-[#C6BAFF] text-[10px] font-semibold rounded-md uppercase">
                                            {images[0].file.type.split('/')[1] || "JPEG"}
                                        </span>
                                        <span className="text-xs text-black/50 font-medium">
                                            {(images[0].file.size / (1024 * 1024)).toFixed(1)} MB
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <X size={20} className="text-black cursor-pointer shrink-0 ml-2" onClick={() => removeImage(0)} />
                        </div>
                    ) : (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-[88px] rounded-xl border-2 border-dashed border-[#8E90FF] flex items-center justify-center cursor-pointer"
                        >
                            <Plus size={32} className="text-[#6367FF]" strokeWidth={2.5}/>
                        </div>
                    )}

                    {/* Secondary files grid */}
                    <div className="w-full flex flex-row gap-3 mt-1 h-[150px]">
                        {[1, 2, 3, 4].map((index) => {
                            const image = images[index];
                            if (image) {
                                return (
                                    <div key={index} className="flex-1 min-w-0 rounded-xl border border-[#6367FF] bg-transparent flex flex-col p-1.5 cursor-pointer">
                                        <div 
                                            className="w-full flex-1 rounded-lg bg-cover bg-center mb-1" 
                                            style={{ backgroundImage: `url(${image.url})` }}
                                        />
                                        <div className="flex justify-between items-center px-1">
                                            <p className="text-[10px] font-semibold truncate leading-tight flex-1 mr-1">{image.file.name}</p>
                                            <X size={12} className="cursor-pointer shrink-0" onClick={() => removeImage(index)} />
                                        </div>
                                        <p className="text-[10px] text-black/50 font-medium px-1 leading-none pb-0.5">
                                            {(image.file.size / (1024 * 1024)).toFixed(1)} MB
                                        </p>
                                    </div>
                                );
                            } else {
                                return (
                                    <div 
                                        key={index}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex-1 rounded-xl border-2 border-dashed border-[#8E90FF] flex items-center justify-center cursor-pointer"
                                    >
                                        <Plus size={32} className="text-[#6367FF]" strokeWidth={2.5}/>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-row gap-7">
                <button
                    onClick={() => {
                        redirect("/step4");
                    }}
                    className="w-full flex-1 flex flex-col items-center justify-center p-3 border rounded-2xl"
                >
                    <p className="font-semibold text-black/50">Back</p>
                </button>
                <button
                    onClick={() => {
                        redirect("/step6");
                    }}
                    className="w-full flex-2 flex flex-col items-center justify-center p-3 bg-[#6367FF] rounded-2xl"
                >
                    <p className="font-semibold text-white">Finish</p>
                </button>
            </div>
        </div>
    );
}
