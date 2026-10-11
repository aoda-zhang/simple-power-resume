import { useState, useRef, useEffect, useCallback } from 'react';

interface PhotoCropperProps {
  /** Raw image file from <input> */
  file: File;
  /** Called with cropped base64 on confirm, or null on cancel */
  onConfirm: (croppedBase64: string) => void;
  onCancel: () => void;
}

export function PhotoCropper({ file, onConfirm, onCancel }: PhotoCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Viewport size (the visible circle)
  const VIEWPORT_SIZE = 200;

  // Image offset (drag to pan) and scale (zoom)
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1);

  // Drag state
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  // Load image
  useEffect(() => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;

      // Compute initial scale to fill the viewport
      const fitScale = Math.max(VIEWPORT_SIZE / img.width, VIEWPORT_SIZE / img.height);
      setScale(fitScale);

      // Center the image
      const scaledW = img.width * fitScale;
      const scaledH = img.height * fitScale;
      setOffsetX(-(scaledW - VIEWPORT_SIZE) / 2);
      setOffsetY(-(scaledH - VIEWPORT_SIZE) / 2);

      drawCanvas();
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Re-draw whenever transform changes
  useEffect(() => {
    drawCanvas();
  }, [offsetX, offsetY, scale]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to VIEWPORT_SIZE x VIEWPORT_SIZE
    canvas.width = VIEWPORT_SIZE;
    canvas.height = VIEWPORT_SIZE;

    // Clear
    ctx.clearRect(0, 0, VIEWPORT_SIZE, VIEWPORT_SIZE);

    // Draw circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(VIEWPORT_SIZE / 2, VIEWPORT_SIZE / 2, VIEWPORT_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Fill background (light gray)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, VIEWPORT_SIZE, VIEWPORT_SIZE);

    // Draw the image portion visible in the viewport
    const imgW = img.width * scale;
    const imgH = img.height * scale;

    // img position relative to viewport top-left
    const imgLeft = offsetX;
    const imgTop = offsetY;

    ctx.drawImage(img, imgLeft, imgTop, imgW, imgH);

    ctx.restore();
  }, [offsetX, offsetY, scale]);

  // Pan: mousedown + mousemove
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, offsetX, offsetY };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setOffsetX(dragStart.current.offsetX + dx);
      setOffsetY(dragStart.current.offsetY + dy);
    },
    [dragging]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Zoom: wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current!.getBoundingClientRect();
    // Mouse position relative to the image viewport
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.max(0.01, Math.min(2, scale * factor));

    // Zoom toward mouse position
    const scaleRatio = newScale / scale;
    const newOffsetX = mx - (mx - offsetX) * scaleRatio;
    const newOffsetY = my - (my - offsetY) * scaleRatio;

    setScale(newScale);
    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
  };

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const base64 = canvas.toDataURL('image/jpeg', 0.92);
    onConfirm(base64);
  };

  // Reset transform
  const handleReset = () => {
    const img = imageRef.current;
    if (!img) return;
    const fitScale = Math.max(VIEWPORT_SIZE / img.width, VIEWPORT_SIZE / img.height);
    setScale(fitScale);
    const scaledW = img.width * fitScale;
    const scaledH = img.height * fitScale;
    setOffsetX(-(scaledW - VIEWPORT_SIZE) / 2);
    setOffsetY(-(scaledH - VIEWPORT_SIZE) / 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-slate-900">调整头像</h3>

        {/* Crop viewport */}
        <div
          ref={containerRef}
          className="relative select-none"
          style={{ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE, cursor: dragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
        >
          <canvas ref={canvasRef} className="rounded-full" />
          {/* Circular border overlay */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none ring-4 ring-white/30"
          />
          {/* Center crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4 h-px bg-white/50" />
            <div className="absolute w-px h-4 bg-white/50" />
          </div>
        </div>

        {/* Zoom slider + size input */}
        <div className="w-full flex items-center gap-3">
          <span className="text-xs text-slate-400 flex-shrink-0">🔍</span>
          <input
            type="range"
            min={0.01}
            max={2}
            step={0.01}
            value={scale}
            onChange={(e) => {
              const rect = containerRef.current!.getBoundingClientRect();
              const mx = rect.width / 2;
              const my = rect.height / 2;
              const newScale = parseFloat(e.target.value);
              const scaleRatio = newScale / scale;
              setOffsetX(mx - (mx - offsetX) * scaleRatio);
              setOffsetY(my - (my - offsetY) * scaleRatio);
              setScale(newScale);
            }}
            className="flex-1 accent-indigo-600"
          />
          <div className="flex items-center gap-1 flex-shrink-0">
            <input
              type="number"
              min={1}
              max={200}
              step={1}
              value={Math.round(scale * 100)}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                const clamped = Math.max(1, Math.min(200, val));
                const newScale = clamped / 100;
                const rect = containerRef.current!.getBoundingClientRect();
                const mx = rect.width / 2;
                const my = rect.height / 2;
                const scaleRatio = newScale / scale;
                setOffsetX(mx - (mx - offsetX) * scaleRatio);
                setOffsetY(my - (my - offsetY) * scaleRatio);
                setScale(newScale);
              }}
              className="w-14 text-xs text-right text-slate-600 bg-slate-100 border border-slate-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <span className="text-xs text-slate-400">%</span>
          </div>
        </div>

        {/* Hint */}
        <p className="text-xs text-slate-400 text-center">
          拖动画布调整位置 · 滚轮或滑块缩放
        </p>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            重置
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}
