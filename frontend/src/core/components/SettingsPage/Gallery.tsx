"use client";
import { useState, useEffect } from "react";
import {
    Camera,
    Trash2,
    Upload,
    RotateCcw,
    RotateCw,
    FlipHorizontal,
    Maximize2,
    Crop,
    Check,
    User,
} from "lucide-react";

interface GalleryProps {
    profileData: any;
    onUpdate: (data: any) => void;
}

export default function Gallery({ profileData, onUpdate }: GalleryProps) {
    const profile = profileData?.profile || {};
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        profile.avatar || null,
    );
    const [allPictures, setAllPictures] = useState<any[]>(
        profile.pictures || [],
    );
    const [isDragging, setIsDragging] = useState(false);

    // Editor State
    const [editingImage, setEditingImage] = useState<{
        index: number;
        src: string;
    } | null>(null);
    const [rotation, setRotation] = useState(0);
    const [filter, setFilter] = useState("none");
    const [flip, setFlip] = useState({ h: 1, v: 1 });
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDraggingImage, setIsDraggingImage] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imgNaturalSize, setImgNaturalSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        if (profile.avatar) setAvatarPreview(profile.avatar);
        if (profile.pictures) setAllPictures(profile.pictures);
    }, [profile.avatar, profile.pictures]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            onUpdate({ avatar: file });
        }
    };

    const handleUpload = (files: File[]) => {
        const remaining = 4 - allPictures.length;
        if (files.length > 0 && remaining > 0) {
            const filesToAdd = files.slice(0, remaining);
            const updatedList = [...allPictures, ...filesToAdd];
            setAllPictures(updatedList);
            onUpdate({ allPictures: updatedList });
        }
    };

    const handlePicturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleUpload(Array.from(e.target.files || []));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleUpload(Array.from(e.dataTransfer.files));
    };

    const removePicture = (index: number) => {
        const updatedList = allPictures.filter((_, i) => i !== index);
        setAllPictures(updatedList);
        onUpdate({ allPictures: updatedList });
    };

    const getPreview = (item: any) => {
        if (typeof item === "string") return item;
        try {
            return URL.createObjectURL(item);
        } catch (e) {
            return "";
        }
    };

    const startEditing = (index: number, src: string) => {
        setEditingImage({ index, src });
        setRotation(0);
        setFilter("none");
        setFlip({ h: 1, v: 1 });
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDraggingImage(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingImage || !imgNaturalSize.w) return;

        const previewSize = 400;
        const fitScale = Math.max(
            previewSize / imgNaturalSize.w,
            previewSize / imgNaturalSize.h,
        );
        const w = imgNaturalSize.w * fitScale * zoom;
        const h = imgNaturalSize.h * fitScale * zoom;

        const maxX = Math.max(0, (w - previewSize) / 2);
        const maxY = Math.max(0, (h - previewSize) / 2);

        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        setPosition({
            x: Math.max(-maxX, Math.min(maxX, newX)),
            y: Math.max(-maxY, Math.min(maxY, newY)),
        });
    };

    const handleMouseUp = () => setIsDraggingImage(false);

    const applyEdits = async () => {
        if (!editingImage) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = editingImage.src;

        await new Promise((resolve) => {
            img.onload = resolve;
        });

        const size = 1024;
        canvas.width = size;
        canvas.height = size;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, size, size);

        ctx.filter =
            filter === "none"
                ? "none"
                : filter === "grayscale"
                  ? "grayscale(1)"
                  : filter === "sepia"
                    ? "sepia(1)"
                    : filter === "invert"
                      ? "invert(1)"
                      : "none";

        const previewSize = 400;
        const fitScale = Math.max(
            previewSize / img.width,
            previewSize / img.height,
        );

        const outputScale = size / previewSize;
        ctx.translate(size / 2, size / 2);
        ctx.translate(position.x * outputScale, position.y * outputScale);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(
            flip.h * zoom * outputScale * fitScale,
            flip.v * zoom * outputScale * fitScale,
        );
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    const editedFile = new File(
                        [blob],
                        `edited_${Date.now()}.jpg`,
                        { type: "image/jpeg" },
                    );
                    const updatedList = [...allPictures];
                    updatedList[editingImage.index] = editedFile;
                    setAllPictures(updatedList);
                    onUpdate({ allPictures: updatedList });
                    setEditingImage(null);
                }
            },
            "image/jpeg",
            0.9,
        );
    };

    return (
        <div className="w-full h-full p-6 flex flex-col gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Avatar</h2>
                <p className="text-xs text-gray-500">
                    How you appear to others.
                </p>
                <div className="relative w-32 h-32 mt-2 group">
                    <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-[#6367FF] shadow-md bg-white">
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <User size={48} />
                            </div>
                        )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 p-2 bg-[#6367FF] text-white rounded-xl cursor-pointer shadow-lg hover:scale-105 transition-all">
                        <Camera size={18} />
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </label>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold">Gallery</h2>
                    <p className="text-xs text-gray-500">
                        Drag and drop up to 4 photos.
                    </p>
                </div>

                <div
                    className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl transition-all ${isDragging ? "bg-[#6367FF]/10 ring-2 ring-[#6367FF] ring-dashed" : ""}`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    {allPictures.map((pic, index) => {
                        const preview = getPreview(pic);
                        return (
                            <div
                                key={index}
                                className="relative aspect-square rounded-2xl overflow-hidden group bg-gray-100 shadow-sm border border-gray-100"
                            >
                                <img
                                    src={preview}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() =>
                                            startEditing(index, preview)
                                        }
                                        className="p-2 bg-white text-[#6367FF] rounded-lg hover:scale-110 transition-all"
                                    >
                                        <Crop size={16} />
                                    </button>
                                    <button
                                        onClick={() => removePicture(index)}
                                        className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {allPictures.length < 4 && (
                        <label className="aspect-square rounded-2xl border-2 border-dashed border-[#AEB0FF] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white transition-all text-[#6367FF]">
                            <Upload size={24} />
                            <span className="text-[10px] font-medium">
                                Click or Drag
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handlePicturesChange}
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* Image Editor Modal */}
            {editingImage && (
                <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="min-h-full flex items-center justify-center p-4 md:p-6">
                        <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl my-8">
                        {/* Preview Area */}
                        <div className="flex-1 bg-black/5 flex flex-col items-center justify-center p-8 min-h-[450px]">
                            <div
                                className="relative w-full aspect-square max-w-[400px] overflow-hidden rounded-xl bg-white shadow-lg cursor-move select-none"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                <img
                                    src={editingImage.src}
                                    onLoad={(e) => {
                                        const img = e.currentTarget;
                                        setImgNaturalSize({
                                            w: img.naturalWidth,
                                            h: img.naturalHeight,
                                        });
                                    }}
                                    style={{
                                        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${flip.h * zoom}, ${flip.v * zoom})`,
                                        filter:
                                            filter === "none"
                                                ? "none"
                                                : filter === "grayscale"
                                                  ? "grayscale(1)"
                                                  : filter === "sepia"
                                                    ? "sepia(1)"
                                                    : filter === "invert"
                                                      ? "invert(1)"
                                                      : "none",
                                    }}
                                    className="min-w-full min-h-full object-cover transition-transform duration-75 pointer-events-none"
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-white/50 pointer-events-none border-[10px] border-black/10"></div>
                            </div>
                            <div className="w-full max-w-[400px] mt-6 flex flex-col gap-2">
                                <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                                    <span>Zoom</span>
                                    <span>{Math.round(zoom * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="0.1"
                                    value={zoom}
                                    onChange={(e) =>
                                        setZoom(parseFloat(e.target.value))
                                    }
                                    className="w-full accent-[#6367FF] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="w-full md:w-64 p-6 flex flex-col gap-6 border-l border-gray-100 bg-white">
                            <h3 className="font-bold flex items-center gap-2 text-gray-800">
                                <Maximize2 size={18} /> Edit Image
                            </h3>

                            <div className="flex flex-col gap-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Adjustment
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            setRotation((r) => r - 90)
                                        }
                                        className="flex-1 p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <RotateCcw
                                            size={16}
                                            className="mx-auto"
                                        />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setRotation((r) => r + 90)
                                        }
                                        className="flex-1 p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <RotateCw
                                            size={16}
                                            className="mx-auto"
                                        />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setFlip((f) => ({
                                                ...f,
                                                h: f.h * -1,
                                            }))
                                        }
                                        className="flex-1 p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <FlipHorizontal
                                            size={16}
                                            className="mx-auto"
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Filters
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        "none",
                                        "grayscale",
                                        "sepia",
                                        "invert",
                                    ].map((f, index: number) => (
                                        <button
                                            key={`${f}-${index}`}
                                            onClick={() => setFilter(f)}
                                            className={`py-1.5 px-3 text-[10px] rounded-lg border font-medium transition-all ${filter === f ? "bg-[#6367FF] border-[#6367FF] text-white shadow-md shadow-[#6367FF]/20" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                                        >
                                            {f.charAt(0).toUpperCase() +
                                                f.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <p className="text-[10px] text-gray-400 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <b>Tip:</b> Drag the image to pan and use the
                                slider to zoom for the perfect square crop.
                            </p>

                            <div className="mt-auto flex gap-3 pt-4">
                                <button
                                    onClick={() => setEditingImage(null)}
                                    className="flex-1 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={applyEdits}
                                    className="flex-1 py-3 px-4 bg-[#6367FF] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#555DFF] text-nowrap shadow-lg shadow-[#6367FF]/30 transition-all"
                                >
                                    <Check size={14} /> Save Profile
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
