import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { Printer, Plus, Trash2, Settings, Palette, Type, Image as ImageIcon, Layout, Box, CheckSquare, Square, X, FileText, Image as PhotoIcon } from 'lucide-react';

interface Subject {
  name: string;
  color: string;
  textColor: string;
}

interface Course {
  name: string;
}

const DEFAULT_SUBJECTS: Subject[] = [
  { name: '语文', color: '#FEE2E2', textColor: '#991B1B' },
  { name: '数学', color: '#DBEAFE', textColor: '#1E40AF' },
  { name: '英语', color: '#F3E8FF', textColor: '#6B21A8' },
  { name: '物理', color: '#CFFAFE', textColor: '#0891B2' },
  { name: '化学', color: '#D1FAE5', textColor: '#065F46' },
  { name: '生物', color: '#ECFCCB', textColor: '#3F6212' },
  { name: '历史', color: '#FEF3C7', textColor: '#92400E' },
  { name: '地理', color: '#FFEDD5', textColor: '#9A3412' },
  { name: '道德与法治', color: '#FFF1F2', textColor: '#BE123C' },
  { name: '体育与健康', color: '#F0FDFA', textColor: '#0D9488' },
  { name: '美术', color: '#FDF2F8', textColor: '#9D174D' },
  { name: '音乐', color: '#FAF5FF', textColor: '#7E22CE' },
  { name: '自然', color: '#F0FDF4', textColor: '#166534' },
  { name: '信息技术', color: '#E2E8F0', textColor: '#475569' },
  { name: '劳动', color: '#FEF9C3', textColor: '#854D0E' },
  { name: '综合实践', color: '#F1F5F9', textColor: '#334155' },
];

const DAYS = ['一', '二', '三', '四', '五'];

const ROW_DEFS = [
  { type: 'lesson', label: '1' },
  { type: 'lesson', label: '2' },
  { type: 'break', label: '升旗早操、大课间体育活动' },
  { type: 'lesson', label: '3' },
  { type: 'lesson', label: '4' },
  { type: 'break', label: '午间休息' },
  { type: 'lesson', label: '午会' },
  { type: 'lesson', label: '5' },
  { type: 'break', label: '大课间体育活动' },
  { type: 'lesson', label: '6' },
  { type: 'lesson', label: '7' },
];

// Initial data from the image
const INITIAL_SCHEDULE: Record<string, Course> = {
  '0-0': { name: '语文' }, '1-0': { name: '体育与健康' }, '2-0': { name: '数学' }, '3-0': { name: '英语' }, '4-0': { name: '语文' },
  '0-1': { name: '英语' }, '1-1': { name: '语文' }, '2-1': { name: '语文' }, '3-1': { name: '美术' }, '4-1': { name: '写字' },
  '0-3': { name: '游泳' }, '1-3': { name: '道德与法治' }, '2-3': { name: '道德与法治' }, '3-3': { name: '语文' }, '4-3': { name: '体育与健康' },
  '0-4': { name: '游泳' }, '1-4': { name: '数学' }, '2-4': { name: '英语' }, '3-4': { name: '数学' }, '4-4': { name: '英语' },
  '0-6': { name: '行规训练' }, '1-6': { name: '健康安全' }, '2-6': { name: '快乐队会' }, '3-6': { name: '校园电视' }, '4-6': { name: '时事教育' },
  '0-7': { name: '美术' }, '1-7': { name: '劳动' }, '2-7': { name: '心理' }, '3-7': { name: '体育与健康' }, '4-7': { name: '体活' },
  '0-9': { name: '数学' }, '1-9': { name: '音乐' }, '2-9': { name: '自然' }, '3-9': { name: '自然' }, '4-9': { name: '综合实践活动' },
  '0-10': { name: '少先队活动课' }, '1-10': { name: '信息' }, '2-10': { name: '音乐' }, '3-10': { name: '体活' },
};

export default function App() {
  const [title, setTitle] = useState('我的课程表');
  const [academicYear, setAcademicYear] = useState('2026');
  const [semester, setSemester] = useState('第二学期');
  const [headerSeparator, setHeaderSeparator] = useState('|');
  const [grade, setGrade] = useState('三（5）');
  const [gradeSuffix, setGradeSuffix] = useState('班');
  const [footerText, setFooterText] = useState('上师三附小南校 课程教学部');
  const [periodHeader, setPeriodHeader] = useState('节次');
  const [dayPrefix, setDayPrefix] = useState('周');
  const [days, setDays] = useState(['一', '二', '三', '四', '五']);
  const [logoType, setLogoType] = useState<'icon' | 'image'>('icon');
  const [logoIcon, setLogoIcon] = useState('Type');
  const [logoImage, setLogoImage] = useState('');
  const [schedule, setSchedule] = useState<Record<string, Course>>(INITIAL_SCHEDULE);
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [newSubjectName, setNewSubjectName] = useState('');
  
  // Styling States
  const [printPadding, setPrintPadding] = useState(10);
  const [guideMargin, setGuideMargin] = useState(15);
  const [rowHeight, setRowHeight] = useState(40);
  const [fontSize, setFontSize] = useState(12);
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderColor, setBorderColor] = useState('#000000');
  const [tableOpacity, setTableOpacity] = useState(100);
  const [useBgColor, setUseBgColor] = useState(false);
  const [rowDefs, setRowDefs] = useState(ROW_DEFS);
  const [bgOpacity, setBgOpacity] = useState(100);
  const [bgBlur, setBgBlur] = useState(0);
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [showLogoPopover, setShowLogoPopover] = useState(false);
  const [paperSize, setPaperSize] = useState<'A4' | 'photo'>('A4');
  
  // Image States
  const [bgImage, setBgImage] = useState('');
  const [headerImage, setHeaderImage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-paper-size', paperSize);

    const dynamicPageStyleId = 'dynamic-print-page-size';
    let styleEl = document.getElementById(dynamicPageStyleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = dynamicPageStyleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent =
      paperSize === 'photo'
        ? '@media print { @page { size: 6in 4in; margin: 0; } }'
        : '@media print { @page { size: A4 landscape; margin: 0; } }';

    return () => {
      document.body.removeAttribute('data-paper-size');
      const currentStyleEl = document.getElementById(dynamicPageStyleId);
      if (currentStyleEl) currentStyleEl.remove();
    };
  }, [paperSize]);

  const handlePrint = () => {
    setIsPrinting(true);
    // Use a small timeout to allow UI updates and ensure the event loop is clear
    setTimeout(() => {
      try {
        window.focus();
        window.print();
      } catch (error) {
        console.error('Print error:', error);
      } finally {
        setIsPrinting(false);
      }
    }, 150);
  };

  const updateRowLabel = (idx: number, newLabel: string) => {
    const newRowDefs = [...rowDefs];
    newRowDefs[idx].label = newLabel;
    setRowDefs(newRowDefs);
  };

  const addRow = (index: number, type: 'lesson' | 'break') => {
    const newRow = type === 'lesson' 
      ? { type: 'lesson' as const, label: `${rowDefs.filter(r => r.type === 'lesson').length + 1}` }
      : { type: 'break' as const, label: '休息' };
    
    const newRowDefs = [...rowDefs];
    newRowDefs.splice(index, 0, newRow);
    setRowDefs(newRowDefs);

    // Shift schedule data
    const newSchedule: Record<string, Course> = { ...schedule };
    const shiftedSchedule: Record<string, Course> = {};
    
    Object.entries(newSchedule).forEach(([key, value]) => {
      const [day, row] = key.split('-').map(Number);
      if (row >= index) {
        shiftedSchedule[`${day}-${row + 1}`] = value;
      } else {
        shiftedSchedule[key] = value;
      }
    });
    setSchedule(shiftedSchedule);
  };

  const deleteRow = (index: number) => {
    if (rowDefs.length <= 1) return;
    const newRowDefs = [...rowDefs];
    newRowDefs.splice(index, 1);
    setRowDefs(newRowDefs);

    // Shift schedule data back
    const newSchedule: Record<string, Course> = { ...schedule };
    const shiftedSchedule: Record<string, Course> = {};
    
    Object.entries(newSchedule).forEach(([key, value]) => {
      const [day, row] = key.split('-').map(Number);
      if (row === index) return; // Deleted
      if (row > index) {
        shiftedSchedule[`${day}-${row - 1}`] = value;
      } else {
        shiftedSchedule[key] = value;
      }
    });
    setSchedule(shiftedSchedule);
  };

  const updateCell = (dayIndex: number, timeIndex: number, value: string) => {
    const key = `${dayIndex}-${timeIndex}`;
    setSchedule(prev => ({
      ...prev,
      [key]: { name: value }
    }));
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    if (subjects.find(s => s.name === newSubjectName)) return;
    
    setSubjects([...subjects, { 
      name: newSubjectName, 
      color: '#f1f5f9', 
      textColor: '#475569' 
    }]);
    setNewSubjectName('');
  };

  const removeSubject = (name: string) => {
    setSubjects(subjects.filter(s => s.name !== name));
  };

  const updateSubject = (index: number, field: keyof Subject, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
  };

  const getCellStyle = (courseName: string) => {
    const subject = subjects.find(s => s.name === courseName.trim());
    if (subject) {
      return {
        backgroundColor: useBgColor ? subject.color : 'transparent',
        color: subject.textColor,
      };
    }
    return {};
  };

  const effectiveRowHeight = rowHeight;

  const photoFitScale = useMemo(() => {
    if (paperSize !== 'photo') return 1;

    const lessonRows = rowDefs.filter((r) => r.type === 'lesson').length;
    const breakRows = rowDefs.filter((r) => r.type === 'break').length;

    const baseBreakHeight = 16;
    const estimatedHeaderHeight = 78;
    const estimatedTableHeaderHeight = 36;
    const estimatedFooterHeight = 24;

    const estimatedHeight =
      estimatedHeaderHeight +
      estimatedTableHeaderHeight +
      estimatedFooterHeight +
      printPadding * 2 +
      guideMargin * 2 +
      lessonRows * effectiveRowHeight +
      breakRows * baseBreakHeight;

    const estimatedWidth = printPadding * 2 + guideMargin * 2 + 64 + days.length * 92;

    const targetHeight = 4 * 96;
    const targetWidth = 6 * 96;

    const scaleByHeight = targetHeight / estimatedHeight;
    const scaleByWidth = targetWidth / estimatedWidth;
    const safeScale = Math.min(1, scaleByHeight, scaleByWidth) * 0.92;

    return Math.max(0.35, Number(safeScale.toFixed(3)));
  }, [paperSize, rowDefs, printPadding, guideMargin, effectiveRowHeight, days.length]);

  const activeScale = paperSize === 'photo' ? photoFitScale : 1;
  const effectiveFontSize = Number((fontSize * activeScale).toFixed(1));
  const effectiveBorderWidth = Number(Math.max(0.5, borderWidth * activeScale).toFixed(2));
  const paperBoundary =
    paperSize === 'A4'
      ? { widthCm: '29.7', heightCm: '21.0', name: 'A4 横向' }
      : { widthCm: '15.24', heightCm: '10.16', name: '4x6 相纸' };
  const scaledLessonRowHeight =
    paperSize === 'photo'
      ? Math.max(12, Math.floor(effectiveRowHeight * activeScale))
      : effectiveRowHeight;
  const scaledBreakRowHeight =
    paperSize === 'photo' ? Math.max(12, Math.floor(16 * activeScale)) : 24;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'bg' | 'header' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'bg') setBgImage(reader.result as string);
        else if (type === 'header') setHeaderImage(reader.result as string);
        else setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="min-h-screen print-root bg-slate-100 p-4 md:p-6 font-sans"
      style={{ 
        '--print-padding': `${printPadding}px`,
        '--border-color': borderColor,
        '--border-width': `${effectiveBorderWidth}px`,
        '--photo-fit-scale': String(activeScale)
      } as React.CSSProperties}
    >
      {/* Floating Print Button for easier access */}
      <button
        onClick={handlePrint}
        disabled={isPrinting}
        className="fixed bottom-6 right-6 z-[100] no-print flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:bg-slate-400 group"
        title="打印课程表"
      >
        <Printer size={20} className={isPrinting ? 'animate-pulse' : ''} />
        <span className="font-bold text-sm">{isPrinting ? '准备中...' : '打印'}</span>
      </button>

      {/* 纸张尺寸切换 Tab */}
      <div className="flex justify-center gap-2 mb-4 no-print z-10">
        <button
          onClick={() => setPaperSize('A4')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md ${
            paperSize === 'A4' 
              ? 'bg-indigo-600 text-white shadow-indigo-200' 
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <FileText size={16} />
          A4 纸张
        </button>
        <button
          onClick={() => setPaperSize('photo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md ${
            paperSize === 'photo' 
              ? 'bg-indigo-600 text-white shadow-indigo-200' 
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <PhotoIcon size={16} />
          相册纸 (4×6寸)
        </button>
        {paperSize === 'photo' && (
          <div className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            自适应缩放 {Math.round(activeScale * 100)}%
          </div>
        )}
      </div>

      {/* Main Print Container (Background & Paper Margin) */}
      <div 
        className={`mx-auto bg-white shadow-2xl print-container mb-8 rounded-xl transition-all duration-300 flex flex-col ${
          paperSize === 'A4' ? 'max-w-5xl aspect-[1.414/1]' : 
          'max-w-4xl aspect-[1.5/1]'
        }`}
        style={{ 
          padding: `${printPadding}px`,
          backgroundImage: bgImage ? `url(${bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          height: 'auto',
          minHeight: 'unset',
          overflow: 'visible'
        }}
      >
        {/* Background Overlay for Opacity and Blur */}
        {bgImage && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              backgroundColor: `rgba(255, 255, 255, ${1 - bgOpacity / 100})`,
              backdropFilter: `blur(${bgBlur}px)`,
              WebkitBackdropFilter: `blur(${bgBlur}px)`,
            }}
          />
        )}
        {/* 纸张边界 - 灰色虚线边框（打印时隐藏） */}
        <div 
          className="border-[3px] border-dashed border-slate-500 print-guide w-full relative"
          style={{ padding: `${guideMargin}px` }}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[11px] text-slate-600 font-semibold whitespace-nowrap no-print bg-white/90 px-2 py-0.5 border border-slate-300">
            纸张边界宽 {paperBoundary.widthCm} cm
          </div>
          <div
            className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 -ml-2 z-30 text-[11px] text-slate-600 font-semibold whitespace-nowrap no-print bg-white/95 px-2 py-1 border border-slate-300 pointer-events-none"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            纸张边界高 {paperBoundary.heightCm} cm
          </div>
          <div className="absolute -bottom-7 right-0 text-[10px] text-slate-500 font-medium whitespace-nowrap no-print">
            {paperBoundary.name} · 虚线即真实纸张边界
          </div>
          <div className="relative w-full" ref={constraintsRef}>
            {/* Print-only Header (Static) */}
            {headerImage && (
              <div className="hidden print:block absolute z-50" style={{ top: '10px', left: '10px' }}>
                <img 
                  src={headerImage} 
                  alt="header" 
                  className="max-w-[150px] h-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Title Section */}
          <div className="flex items-center justify-between px-3 py-4 mb-2 border-b border-slate-100/50">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="relative no-print" onMouseEnter={() => setShowLogoPopover(true)} onMouseLeave={() => setShowLogoPopover(false)}>
                <div 
                  className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-sm shrink-0 cursor-pointer hover:bg-indigo-700 transition-colors"
                >
                  {logoType === 'image' && logoImage ? (
                    <img src={logoImage} alt="logo" className="w-4 h-4 object-contain" />
                  ) : (
                    logoIcon === 'Type' ? <Type size={16} /> :
                    logoIcon === 'Layout' ? <Layout size={16} /> :
                    logoIcon === 'Box' ? <Box size={16} /> :
                    logoIcon === 'CheckSquare' ? <CheckSquare size={16} /> :
                    logoIcon === 'Square' ? <Square size={16} /> :
                    logoIcon === 'ImageIcon' ? <ImageIcon size={16} /> :
                    logoIcon === 'Settings' ? <Settings size={16} /> :
                    <Palette size={16} />
                  )}
                </div>

                <AnimatePresence>
                  {showLogoPopover && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-[100] origin-top-left"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Logo 设置</span>
                          <div className="flex bg-slate-100 p-0.5 rounded-lg">
                            <button 
                              onClick={() => setLogoType('icon')}
                              className={`px-3 py-1 text-[10px] rounded-md transition-all ${logoType === 'icon' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                              图标
                            </button>
                            <button 
                              onClick={() => setLogoType('image')}
                              className={`px-3 py-1 text-[10px] rounded-md transition-all ${logoType === 'image' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                              图片
                            </button>
                          </div>
                        </div>

                        {logoType === 'icon' ? (
                          <div className="grid grid-cols-4 gap-2">
                            {['Type', 'Layout', 'Box', 'CheckSquare', 'Square', 'ImageIcon', 'Settings', 'Palette'].map(icon => (
                              <button
                                key={icon}
                                onClick={() => setLogoIcon(icon)}
                                className={`p-2 rounded-lg border transition-all flex items-center justify-center ${logoIcon === icon ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-100 hover:text-indigo-500'}`}
                              >
                                {icon === 'Type' ? <Type size={16} /> :
                                 icon === 'Layout' ? <Layout size={16} /> :
                                 icon === 'Box' ? <Box size={16} /> :
                                 icon === 'CheckSquare' ? <CheckSquare size={16} /> :
                                 icon === 'Square' ? <Square size={16} /> :
                                 icon === 'ImageIcon' ? <ImageIcon size={16} /> :
                                 icon === 'Settings' ? <Settings size={16} /> :
                                 <Palette size={16} />}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <button 
                              onClick={() => logoInputRef.current?.click()}
                              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
                            >
                              {logoImage ? (
                                <img src={logoImage} alt="preview" className="w-10 h-10 object-contain" />
                              ) : (
                                <ImageIcon size={24} className="text-slate-300 group-hover:text-indigo-400" />
                              )}
                              <span className="text-[10px] text-slate-500 font-medium">点击上传 Logo 图片</span>
                            </button>
                            {logoImage && (
                              <button 
                                onClick={() => setLogoImage('')}
                                className="w-full py-1.5 text-[10px] text-red-500 font-bold hover:bg-red-50 rounded-lg transition-colors"
                              >
                                移除当前图片
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      {/* Arrow */}
                      <div className="absolute -top-1.5 left-4 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
              </div>
              
              {/* Print-only Logo */}
              <div className="hidden print:block shrink-0">
                {logoType === 'image' && logoImage ? (
                  <img src={logoImage} alt="logo" className="w-5 h-5 object-contain" />
                ) : (
                  <div className="p-1 bg-indigo-600 rounded text-white">
                    {logoIcon === 'Type' ? <Type size={12} /> :
                    logoIcon === 'Layout' ? <Layout size={12} /> :
                    logoIcon === 'Box' ? <Box size={12} /> :
                    logoIcon === 'CheckSquare' ? <CheckSquare size={12} /> :
                    logoIcon === 'Square' ? <Square size={12} /> :
                    logoIcon === 'ImageIcon' ? <ImageIcon size={12} /> :
                    logoIcon === 'Settings' ? <Settings size={12} /> :
                    <Palette size={12} />}
                  </div>
                )}
              </div>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-black tracking-tight text-slate-800 bg-transparent border-none focus:ring-0 p-0 truncate w-full"
                placeholder="我的课程表"
              />
            </div>
            
            <div className="flex items-center gap-1.5 shrink-0 ml-4 text-[11px] text-slate-600 font-black">
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-10 bg-transparent border-none focus:ring-0 p-0 text-right"
              />
              <input
                type="text"
                value={headerSeparator}
                onChange={(e) => setHeaderSeparator(e.target.value)}
                className="w-2 bg-transparent border-none focus:ring-0 p-0 text-center opacity-40 font-normal"
              />
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-16 bg-transparent border-none focus:ring-0 p-0 text-center"
              />
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-14 bg-transparent border-none focus:ring-0 p-0 text-right text-indigo-600"
              />
              <input
                type="text"
                value={gradeSuffix}
                onChange={(e) => setGradeSuffix(e.target.value)}
                className="w-6 bg-transparent border-none focus:ring-0 p-0 text-indigo-600"
              />
            </div>
          </div>

          {/* Timetable Grid */}
          <div 
            className="rounded-lg"
            style={{ backgroundColor: `rgba(255, 255, 255, ${tableOpacity / 100})` }}
          >
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr>
                  <th 
                    className="bg-slate-200/90 text-slate-600 font-bold text-[10px] w-16"
                    style={{ borderColor: borderColor, borderWidth: `${effectiveBorderWidth}px`, borderStyle: 'solid' }}
                  >
                    <input
                      type="text"
                      value={periodHeader}
                      onChange={(e) => setPeriodHeader(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-center"
                    />
                  </th>
                  {days.map((day, idx) => (
                    <th 
                      key={idx} 
                      className="p-2 bg-slate-200/90 text-slate-900 font-black text-sm"
                      style={{ borderColor: borderColor, borderWidth: `${effectiveBorderWidth}px`, borderStyle: 'solid' }}
                    >
                      <div className="flex items-center justify-center gap-0.5">
                        <input
                          type="text"
                          value={dayPrefix}
                          onChange={(e) => setDayPrefix(e.target.value)}
                          className="w-4 bg-transparent border-none focus:ring-0 p-0 text-center"
                        />
                        <input
                          type="text"
                          value={day}
                          onChange={(e) => {
                            const newDays = [...days];
                            newDays[idx] = e.target.value;
                            setDays(newDays);
                          }}
                          className="w-4 bg-transparent border-none focus:ring-0 p-0 text-center"
                        />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Top Add Button */}
                {isEditingEnabled && (
                  <tr className="no-print h-0">
                    <td colSpan={days.length + 1} className="relative p-0 border-none">
                      <div className="absolute -top-3 left-0 right-0 flex justify-center opacity-0 hover:opacity-100 transition-opacity z-20">
                        <div className="flex gap-1 bg-white shadow-lg rounded-full p-1 border border-indigo-100 scale-75 origin-center">
                          <button 
                            onClick={() => addRow(0, 'lesson')}
                            className="flex items-center gap-1 px-2 py-1 hover:bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold whitespace-nowrap"
                          >
                            <Plus size={10} /> 课
                          </button>
                          <button 
                            onClick={() => addRow(0, 'break')}
                            className="flex items-center gap-1 px-2 py-1 hover:bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold whitespace-nowrap"
                          >
                            <Plus size={10} /> 息
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {rowDefs.map((row, rowIdx) => (
                  <React.Fragment key={rowIdx}>
                    <tr className="group/row relative">
                      {row.type === 'lesson' ? (
                        <>
                          <td 
                            className="text-center bg-slate-100/80 font-bold text-xs relative"
                            style={{ 
                              borderColor: borderColor, 
                              borderWidth: `${effectiveBorderWidth}px`,
                              borderStyle: 'solid',
                              height: `${scaledLessonRowHeight}px`
                            }}
                          >
                            {isEditingEnabled && (
                              <button
                                onClick={() => deleteRow(rowIdx)}
                                className="absolute -left-2 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover/row:opacity-100 transition-all no-print z-30 bg-white rounded-full shadow-sm border border-slate-100"
                                title="删除此行"
                              >
                                <X size={10} />
                              </button>
                            )}

                            <div 
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => updateRowLabel(rowIdx, e.currentTarget.textContent || '')}
                              className="flex items-center justify-center h-full outline-none"
                            >
                              {row.label}
                            </div>
                          </td>
                          {days.map((_, dayIdx) => {
                            const key = `${dayIdx}-${rowIdx}`;
                            const course = schedule[key];
                            const style = getCellStyle(course?.name || '');
                            return (
                              <td
                                key={dayIdx}
                                className="p-0 transition-colors group relative"
                                style={{ 
                                  ...style,
                                  borderColor: borderColor, 
                                  borderWidth: `${effectiveBorderWidth}px`,
                                  borderStyle: 'solid',
                                  height: `${scaledLessonRowHeight}px`
                                }}
                              >
                                <div className="w-full h-full flex items-center justify-center p-1">
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => updateCell(dayIdx, rowIdx, e.currentTarget.textContent || '')}
                                    data-placeholder="+"
                                    className="w-full outline-none focus:ring-0 text-center whitespace-pre-wrap break-words cell-input"
                                    style={{ 
                                      fontSize: `${effectiveFontSize}px`, 
                                      fontWeight: 'bold',
                                      lineHeight: paperSize === 'photo' ? '1.05' : '1.2'
                                    }}
                                  >
                                    {course?.name || ''}
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                        </>
                      ) : (
                        <td 
                          colSpan={days.length + 1}
                          className="text-center bg-slate-100/40 text-[10px] font-medium text-slate-500 italic relative"
                          style={{ 
                            borderColor: borderColor, 
                            borderWidth: `${effectiveBorderWidth}px`,
                            borderStyle: 'solid',
                            height: `${scaledBreakRowHeight}px`
                          }}
                        >
                          {isEditingEnabled && (
                            <button
                              onClick={() => deleteRow(rowIdx)}
                              className="absolute -left-2 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover/row:opacity-100 transition-all no-print z-30 bg-white rounded-full shadow-sm border border-slate-100"
                              title="删除此行"
                            >
                              <X size={10} />
                            </button>
                          )}

                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => updateRowLabel(rowIdx, e.currentTarget.textContent || '')}
                            className="w-full h-full outline-none flex items-center justify-center"
                          >
                            {row.label}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Add Row Divider */}
                    {isEditingEnabled && (
                      <tr className="no-print h-0">
                        <td colSpan={days.length + 1} className="relative p-0 border-none">
                          <div className="absolute -top-3 left-0 right-0 flex justify-center opacity-0 hover:opacity-100 transition-opacity z-20">
                            <div className="flex gap-1 bg-white shadow-lg rounded-full p-1 border border-indigo-100 scale-75 origin-center">
                              <button 
                                onClick={() => addRow(rowIdx + 1, 'lesson')}
                                className="flex items-center gap-1 px-2 py-1 hover:bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold whitespace-nowrap"
                              >
                                <Plus size={10} /> 课
                              </button>
                              <button 
                                onClick={() => addRow(rowIdx + 1, 'break')}
                                className="flex items-center gap-1 px-2 py-1 hover:bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold whitespace-nowrap"
                              >
                                <Plus size={10} /> 息
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer Section */}
          <div className="mt-4 text-right pr-4">
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className="text-[10px] text-slate-400 bg-transparent border-none focus:ring-0 p-0 text-right w-full"
            />
          </div>

          {/* Floating Header Decoration (Moved to end for better drag interaction) */}
          {headerImage && (
            <motion.div 
              drag
              dragConstraints={constraintsRef}
              dragMomentum={false}
              dragElastic={0}
              whileDrag={{ scale: 1.05, zIndex: 100 }}
              className="absolute z-50 no-print group cursor-grab active:cursor-grabbing"
              style={{ top: 20, left: 20, touchAction: 'none' }}
            >
              <img 
                src={headerImage} 
                alt="header" 
                className="max-w-[200px] h-auto object-contain rounded-lg shadow-lg border-2 border-white/50 select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div 
                className="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10" 
                onClick={(e) => {
                  e.stopPropagation();
                  setHeaderImage('');
                }}
              >
                <X size={12} className="text-red-500" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>

      {/* Configuration Section */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
        {/* Course Content Configuration (Left) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Palette className="text-indigo-600" size={18} />
                <h2 className="text-sm">课程内容配置</h2>
              </div>
              <button 
                onClick={() => setUseBgColor(!useBgColor)}
                className="flex items-center gap-2 text-[10px] font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                {useBgColor ? <CheckSquare size={14} className="text-indigo-600" /> : <Square size={14} />}
                启用背景色
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {subjects.map((subject, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) => updateSubject(idx, 'name', e.target.value)}
                    className="bg-transparent border-none focus:ring-0 p-0 font-medium text-[11px] w-full"
                  />
                  <div className="flex gap-1">
                    <input
                      type="color"
                      value={subject.textColor}
                      onChange={(e) => updateSubject(idx, 'textColor', e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border-none p-0"
                      title="文字颜色"
                    />
                    {useBgColor && (
                      <input
                        type="color"
                        value={subject.color}
                        onChange={(e) => updateSubject(idx, 'color', e.target.value)}
                        className="w-5 h-5 rounded cursor-pointer border-none p-0"
                        title="背景颜色"
                      />
                    )}
                    <button 
                      onClick={() => removeSubject(subject.name)}
                      className="text-slate-300 hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="新增学科..."
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSubject()}
                className="flex-1 bg-slate-50 border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-indigo-500"
              />
              <button
                onClick={addSubject}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-900 flex items-center gap-1"
              >
                <Plus size={14} />
                添加
              </button>
            </div>
          </div>

          <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <Layout size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-indigo-900">行列编辑模式</h3>
                  <p className="text-[10px] text-indigo-600 opacity-80">开启后可在表格中插入或删除课程行/休息行</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditingEnabled(!isEditingEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isEditingEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEditingEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Layout & Style Configuration (Right) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
            <Settings className="text-indigo-600" size={18} />
            <h2 className="text-sm">视觉与排版样式</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative group">
                <button onClick={() => headerInputRef.current?.click()} className={`w-full flex flex-col items-center justify-center p-3 border-2 border-dashed rounded-lg transition-colors group ${headerImage ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-400'}`}>
                  <ImageIcon size={16} className={`${headerImage ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500'} mb-1`} />
                  <span className="text-[10px] text-slate-500">页眉装饰图</span>
                  <input type="file" ref={headerInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'header')} />
                </button>
                {headerImage && (
                  <button 
                    onClick={() => setHeaderImage('')}
                    className="absolute -top-1.5 -right-1.5 bg-white shadow-md rounded-full p-1 text-red-500 hover:bg-red-50 transition-colors z-10"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
              
              <div className="relative group">
                <button onClick={() => fileInputRef.current?.click()} className={`w-full flex flex-col items-center justify-center p-3 border-2 border-dashed rounded-lg transition-colors group ${bgImage ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-400'}`}>
                  <Layout size={16} className={`${bgImage ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500'} mb-1`} />
                  <span className="text-[10px] text-slate-500">背景底图</span>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'bg')} />
                </button>
                {bgImage && (
                  <button 
                    onClick={() => setBgImage('')}
                    className="absolute -top-1.5 -right-1.5 bg-white shadow-md rounded-full p-1 text-red-500 hover:bg-red-50 transition-colors z-10"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
               <div className="space-y-1">
                 <label className="text-[10px] font-medium text-slate-500 flex justify-between">
                   纸张尺寸
                 </label>
                 <div className="flex gap-2">
                   <button
                     onClick={() => setPaperSize('A4')}
                     className={`flex-1 py-1.5 text-[10px] rounded-lg border transition-all flex items-center justify-center gap-1 ${
                       paperSize === 'A4' 
                         ? 'bg-indigo-600 text-white border-indigo-600' 
                         : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                     }`}
                   >
                     <FileText size={12} />
                     A4
                   </button>
                   <button
                     onClick={() => setPaperSize('photo')}
                     className={`flex-1 py-1.5 text-[10px] rounded-lg border transition-all flex items-center justify-center gap-1 ${
                       paperSize === 'photo' 
                         ? 'bg-indigo-600 text-white border-indigo-600' 
                         : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                     }`}
                   >
                     <PhotoIcon size={12} />
                     相册纸
                   </button>
                 </div>
               </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500 flex justify-between">
                  虚线边距 <span>{guideMargin}px</span>
                </label>
                <input type="range" min="0" max="50" value={guideMargin} onChange={(e) => setGuideMargin(parseInt(e.target.value))} className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-indigo-600" />
              </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-medium text-slate-500 flex justify-between">
                   行高 <span>{rowHeight}px</span>
                 </label>
                 <input type="range" min="20" max="100" value={rowHeight} onChange={(e) => setRowHeight(parseInt(e.target.value))} className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-indigo-600" />
               </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500 flex justify-between">
                  字号 <span>{fontSize}px</span>
                </label>
                <input type="range" min="8" max="18" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-indigo-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500 flex justify-between">
                  打印内距 <span>{printPadding}px</span>
                </label>
                <input type="range" min="0" max="50" value={printPadding} onChange={(e) => setPrintPadding(parseInt(e.target.value))} className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-indigo-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500 flex justify-between">
                  表格透明度 <span>{tableOpacity}%</span>
                </label>
                <input type="range" min="0" max="100" value={tableOpacity} onChange={(e) => setTableOpacity(parseInt(e.target.value))} className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-indigo-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500 flex justify-between">
                  背景透明度 <span>{bgOpacity}%</span>
                </label>
                <input type="range" min="0" max="100" value={bgOpacity} onChange={(e) => setBgOpacity(parseInt(e.target.value))} className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-indigo-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500 flex justify-between">
                  背景虚化 <span>{bgBlur}px</span>
                </label>
                <input type="range" min="0" max="20" value={bgBlur} onChange={(e) => setBgBlur(parseInt(e.target.value))} className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-indigo-600" />
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-medium text-slate-500">边框粗细</label>
                <div className="flex gap-2">
                  {[0, 0.5, 1, 2].map(w => (
                    <button key={w} onClick={() => setBorderWidth(w)} className={`flex-1 py-1 text-[10px] rounded border ${borderWidth === w ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>{w}px</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500">边框颜色</label>
                <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full h-6 rounded cursor-pointer border-none p-0" />
              </div>
            </div>
          </div>
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className={`w-full mt-4 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all shadow-lg ${isPrinting ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 text-white'}`}
          >
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Printer size={16} className={isPrinting ? 'animate-pulse' : ''} />
              {isPrinting ? '正在准备预览...' : '打印课程表'}
            </div>
            <span className="text-[9px] opacity-70 mt-0.5">
              {isPrinting ? '如果预览窗口未弹出，请尝试在新标签页打开应用' : '点击将打开预览界面，确认无误后即可打印'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
