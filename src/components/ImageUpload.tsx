// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
// Licencia de software propietario.

"use client";

import React, { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, X, RefreshCw, Upload, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ImageData {
  id: string;
  file: File;
  preview: string;
  rotation: number;
}

export default function ImageUpload() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > 3) {
      setError("Máximo 3 imágenes permitidas");
      return;
    }

    const newImages = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      rotation: 0,
    }));

    setImages((prev) => [...prev, ...newImages].slice(0, 3));
    setError(null);
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 3,
  });

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (images.length <= 3) setError(null);
  };

  const rotateImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
      )
    );
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (images.length === 0) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const base64Images = await Promise.all(images.map((img) => fileToBase64(img.file)));
      
      // Get current GPS position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }).catch(() => null);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: base64Images,
          coords: position ? {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          } : null
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error en el análisis");
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">
          AGM Inspector
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Captura hasta 3 fotos para un diagnóstico técnico agrícola
        </p>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-8 transition-all duration-300 ease-in-out cursor-pointer",
          "flex flex-col items-center justify-center space-y-4 min-h-[200px]",
          isDragActive 
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 scale-[1.02]" 
            : "border-slate-300 dark:border-slate-700 hover:border-emerald-400 bg-white dark:bg-slate-900",
          images.length >= 3 && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <input {...getInputProps()} capture="environment" />
        <div className="bg-emerald-100 dark:bg-emerald-900/40 p-4 rounded-full">
          <Camera className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-700 dark:text-slate-200">
            {isDragActive ? "Suelta las fotos aquí" : "Toca para usar la cámara o arrastra fotos"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Formatos aceptados: JPG, PNG • Max 3 fotos
          </p>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400"
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <AnimatePresence>
          {images.map((img) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800"
            >
              <img
                src={img.preview}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-300"
                style={{ transform: `rotate(${img.rotation}deg)` }}
              />
              <div className="absolute top-1 right-1 flex flex-col gap-1">
                <button
                  onClick={() => removeImage(img.id)}
                  className="bg-white/90 dark:bg-black/80 p-1.5 rounded-full text-red-500 hover:bg-white dark:hover:bg-black"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={() => rotateImage(img.id)}
                  className="bg-white/90 dark:bg-black/80 p-1.5 rounded-full text-emerald-600 hover:bg-white dark:hover:bg-black"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={images.length === 0 || isAnalyzing}
        className={cn(
          "w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl",
          images.length > 0 && !isAnalyzing
            ? "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
            : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
        )}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Analizando con IA...
          </>
        ) : (
          <>
            <Upload className="w-6 h-6" />
            Iniciar Inspección
          </>
        )}
      </button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 p-6 rounded-3xl shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              Resultado del Diagnóstico
            </h3>
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-bold",
              result.severidad > 7 ? "bg-red-100 text-red-700" : 
              result.severidad > 4 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
            )}>
              Severidad: {result.severidad}/10
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Diagnóstico Principal</p>
              <p className="text-lg text-slate-800 dark:text-slate-200">{result.diagnostico_principal}</p>
            </div>
            
            <div>
              <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Acciones Inmediatas</p>
              <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 mt-1">
                {result.acciones_inmediatas.map((action: string, i: number) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900">
              <p className="text-xs uppercase font-bold text-emerald-700 dark:text-emerald-500 tracking-wider">Recomendación</p>
              <p className="text-sm text-slate-800 dark:text-slate-200 mt-1">
                {result.recomendaciones.quimica_o_organica}
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      <footer className="text-center pt-8 opacity-50">
        <p className="text-[10px] text-slate-500">
          Copyright © 2026 Kenior Oswaldo Ruiz Ramirez<br/>
          Huaral, Perú • AGM Inspector v1.0
        </p>
      </footer>
    </div>
  );
}
