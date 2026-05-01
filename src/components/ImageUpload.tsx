// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
// Licencia de software propietario.

"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, X, RefreshCw, Upload, Loader2, CheckCircle2, AlertTriangle, ChevronRight, MapPin, User, LogOut, Settings, Key, Check, Wifi, AlertCircle, MessageSquare, Microscope, Search, Image as ImageIcon, Leaf, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

export default function ImageUpload() {
  const [images, setImages] = useState<any[]>([]);
  const [crop, setCrop] = useState("");
  const [description, setDescription] = useState("");
  const [isDeepAnalysis, setIsDeepAnalysis] = useState(false); // Nuevo Switch
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
      };
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (images.length + files.length > 2) {
      setError("Máximo 2 imágenes para optimizar velocidad");
      return;
    }
    const newImages = await Promise.all(
      Array.from(files).map(async (file) => {
        const compressedBase64 = await compressImage(file);
        return {
          id: Math.random().toString(36).substring(7),
          file,
          preview: URL.createObjectURL(file),
          base64: compressedBase64
        };
      })
    );
    setImages(prev => [...prev, ...newImages]);
    setShowActionSheet(false);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (images.length === 0) { setError("Capture una muestra primero"); return; }
    if (!crop) { setError("Escriba el nombre del cultivo"); return; }
    
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          images: images.map(img => img.base64),
          crop: crop,
          description: description,
          isDeepAnalysis: isDeepAnalysis, // Enviamos el modo
          location: { lat: -12.0464, lng: -77.0428 }
        }),
      });
      const data = await response.json();
      if (data.error) { setError(data.error); } 
      else { setResult(data); setShowModal(true); }
    } catch (err) { setError("Error de conexión"); } 
    finally { setIsAnalyzing(false); }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto min-h-screen bg-[#FDFCF7] flex flex-col font-outfit pb-10 relative overflow-x-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4A6D32 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      <header className="px-6 py-6 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-20 shadow-sm">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Inspector</p>
            <p className="text-xs font-black text-primary">EN CAMPO</p>
          </div>
          <button onClick={() => signOut()} className="p-2 bg-slate-50 rounded-xl text-slate-300 active:text-red-400 transition-colors"><LogOut size={18} /></button>
        </div>
      </header>

      {/* Hidden Inputs */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileSelect} />
      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileSelect} />

      <main className="flex-1 px-6 py-8 space-y-8">
        <div 
          onClick={() => setShowActionSheet(true)}
          className={`w-full h-32 rounded-[2.5rem] flex flex-row items-center justify-center space-x-6 transition-all cursor-pointer px-8 active:scale-95 ${
            isDeepAnalysis 
            ? "bg-gradient-to-br from-[#4A6D32] to-[#2D4A1E] shadow-[0_20px_40px_-10px_rgba(74,109,50,0.3)]" 
            : "bg-gradient-to-br from-[#F37021] to-[#D65A10] shadow-[0_20px_40px_-10px_rgba(243,112,33,0.3)]"
          }`}
        >
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20"><Camera className="w-7 h-7 text-white" /></div>
          <div className="text-left"><h3 className="text-lg font-black text-white leading-tight">Capturar<br/>Muestra</h3><div className="flex items-center gap-2 mt-1"><div className="w-1.5 h-1.5 rounded-full bg-[#F37021] animate-pulse" /><p className="text-[9px] text-white/60 uppercase font-black tracking-widest">Toque para iniciar</p></div></div>
        </div>

        {/* MODOS DE ANÁLISIS (SWITCH) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-2 flex gap-1 shadow-sm">
          <button 
            onClick={() => setIsDeepAnalysis(false)}
            className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${!isDeepAnalysis ? 'bg-[#F37021] text-white shadow-md' : 'text-slate-400'}`}
          >
            <Zap size={14} fill={!isDeepAnalysis ? "currentColor" : "none"} />
            <span className="text-[10px] font-black uppercase tracking-widest">Simple</span>
          </button>
          <button 
            onClick={() => setIsDeepAnalysis(true)}
            className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${isDeepAnalysis ? 'bg-primary text-white shadow-md' : 'text-slate-400'}`}
          >
            <ShieldCheck size={14} fill={isDeepAnalysis ? "currentColor" : "none"} />
            <span className="text-[10px] font-black uppercase tracking-widest">Avanzado</span>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400"><Leaf size={14} className="text-primary" /><span className="text-[10px] font-black uppercase tracking-widest">Tipo de Cultivo</span></div>
            <input type="text" value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="Ej: Vid, Palto, Maíz..." className="w-full bg-white border border-slate-100 rounded-2xl p-5 text-sm font-black text-slate-700 outline-none focus:border-primary shadow-sm" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400"><MessageSquare size={14} /><span className="text-[10px] font-black uppercase tracking-widest">Notas del Inspector</span></div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej: Se ven manchas amarillas..." className="w-full bg-white border border-slate-100 rounded-2xl p-5 text-sm font-medium outline-none focus:border-primary shadow-sm h-24 resize-none" />
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 pb-2">
              {images.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                  <img src={img.preview} className="w-full h-full object-cover" />
                  <button onClick={() => setImages(images.filter(i => i.id !== img.id))} className="absolute top-1 right-1 bg-white/80 p-1.5 rounded-full text-red-500 shadow-sm"><X size={12} /></button>
                </div>
              ))}
            </div>
          )}

          <button onClick={handleAnalyze} disabled={images.length === 0 || isAnalyzing} className={`w-full flex items-center justify-center gap-3 py-6 rounded-3xl font-black text-white uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50 ${isDeepAnalysis ? 'bg-primary' : 'bg-[#F37021]'}`}>
            {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <><RefreshCw size={18} strokeWidth={2.5} /> <span>{isDeepAnalysis ? "Análisis Profundo" : "Análisis Rápido"}</span></>}
          </button>
          
          {error && <p className="text-center text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 py-3 rounded-xl">{error}</p>}
        </div>
      </main>

      {/* Action Sheet */}
      <AnimatePresence>
        {showActionSheet && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowActionSheet(false)} className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed bottom-0 left-0 right-0 max-w-[400px] mx-auto bg-white rounded-t-[2.5rem] z-[70] p-8 pb-16 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              <div className="space-y-3">
                <button onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center gap-4 p-5 bg-gradient-to-r from-[#4A6D32] to-[#2D4A1E] rounded-2xl shadow-lg active:scale-95 transition-all group">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 text-white"><Camera size={24} strokeWidth={1.5} /></div>
                  <div className="text-left"><p className="text-sm font-black text-white">Usar Cámara</p><p className="text-[10px] font-medium text-white/60">Capturar muestra en tiempo real</p></div>
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 p-5 bg-gradient-to-r from-[#4A6D32] to-[#2D4A1E] rounded-2xl shadow-lg active:scale-95 transition-all group">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 text-white"><ImageIcon size={24} strokeWidth={1.5} /></div>
                  <div className="text-left"><p className="text-sm font-black text-white">Cargar desde Galería</p><p className="text-[10px] font-medium text-white/60">Buscar en almacenamiento local</p></div>
                </button>
              </div>
              <button onClick={() => setShowActionSheet(false)} className="w-full mt-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Cerrar Menú</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && result && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed bottom-0 left-0 right-0 max-w-[400px] mx-auto bg-[#FDFCF7] rounded-t-[3rem] z-[90] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />
              <div className="overflow-y-auto px-8 pb-16 pt-4 space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-primary"><Microscope size={20} /></div>
                    <div><h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Análisis {result.is_verified ? 'Verificado' : 'Rápido'}</h4><p className="text-xs font-black text-primary">AGM ENGINE</p></div>
                  </div>
                  {result.is_verified && <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full"><CheckCircle2 size={10} className="text-emerald-500" /><span className="text-[8px] font-black text-emerald-500 uppercase">Verificado</span></div>}
                </div>
                <div className="bg-[#2D4A1E] rounded-[2rem] p-8 text-white shadow-xl space-y-6"><div className="font-mono text-xs leading-relaxed whitespace-pre-wrap">{result.diagnosis}</div></div>
                <button onClick={() => setShowModal(false)} className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">Cerrar Reporte</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <footer className="py-10 text-center opacity-30"><p className="text-[8px] font-black uppercase tracking-[0.4em]">AGM Inspector • 2026</p></footer>
    </div>
  );
}
