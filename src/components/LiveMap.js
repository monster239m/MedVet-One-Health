'use client';
import { useRef, useEffect, useState, useCallback } from 'react';

// Canvas-based city map with animated markers
export default function LiveMap({
  doctorLocation,
  patientLocation,
  route = [],
  routeIndex = 0,
  medicineLocation = null,
  medicineRoute = [],
  medicineRouteIndex = 0,
  nearbyDoctors = [],
  showDoctorMarker = true,
  showMedicineMarker = false,
  width = '100%',
  height = 400,
  style = {},
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 400 });
  const pulseRef = useRef(0);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({ w: rect.width, h: typeof height === 'number' ? height : rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [height]);

  // Convert lat/lng to canvas coordinates
  const toCanvas = useCallback((lat, lng) => {
    const allPoints = [...route, patientLocation, ...(medicineRoute || [])];
    if (allPoints.length === 0) return { x: canvasSize.w / 2, y: canvasSize.h / 2 };

    const lats = allPoints.map(p => p.lat);
    const lngs = allPoints.map(p => p.lng);
    const minLat = Math.min(...lats) - 0.003;
    const maxLat = Math.max(...lats) + 0.003;
    const minLng = Math.min(...lngs) - 0.003;
    const maxLng = Math.max(...lngs) + 0.003;

    const padding = 50;
    const x = padding + ((lng - minLng) / (maxLng - minLng)) * (canvasSize.w - padding * 2);
    const y = padding + ((maxLat - lat) / (maxLat - minLat)) * (canvasSize.h - padding * 2);
    return { x, y };
  }, [canvasSize, route, patientLocation, medicineRoute]);

  // Draw everything
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvasSize.w * 2;
    canvas.height = canvasSize.h * 2;
    ctx.scale(2, 2);

    let running = true;
    const draw = () => {
      if (!running) return;
      pulseRef.current += 0.03;

      ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, canvasSize.w, canvasSize.h);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#1e1b4b');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvasSize.w, canvasSize.h);

      // Grid lines (city blocks)
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvasSize.w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasSize.h); ctx.stroke();
      }
      for (let y = 0; y < canvasSize.h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvasSize.w, y); ctx.stroke();
      }

      // Road network (simulated major roads)
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      // Horizontal roads
      for (let y = 80; y < canvasSize.h; y += 120) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvasSize.w, y); ctx.stroke();
      }
      // Vertical roads
      for (let x = 100; x < canvasSize.w; x += 150) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasSize.h); ctx.stroke();
      }

      // Draw route path (full route as dotted)
      if (route.length > 1) {
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        route.forEach((point, i) => {
          const { x, y } = toCanvas(point.lat, point.lng);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Traveled path (solid, glowing)
        if (routeIndex > 0) {
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#6366f1';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          for (let i = 0; i <= Math.min(routeIndex, route.length - 1); i++) {
            const { x, y } = toCanvas(route[i].lat, route[i].lng);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // Medicine route
      if (showMedicineMarker && medicineRoute.length > 1) {
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.3)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        medicineRoute.forEach((point, i) => {
          const { x, y } = toCanvas(point.lat, point.lng);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        if (medicineRouteIndex > 0) {
          ctx.strokeStyle = '#14b8a6';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#14b8a6';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          for (let i = 0; i <= Math.min(medicineRouteIndex, medicineRoute.length - 1); i++) {
            const { x, y } = toCanvas(medicineRoute[i].lat, medicineRoute[i].lng);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // Nearby doctor markers (small dots)
      nearbyDoctors.forEach(doc => {
        if (doc.lat && doc.lng) {
          const { x, y } = toCanvas(doc.lat, doc.lng);
          ctx.fillStyle = doc.isDemo ? 'rgba(99, 102, 241, 0.4)' : 'rgba(148, 163, 184, 0.3)';
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Patient marker (home icon)
      if (patientLocation) {
        const { x, y } = toCanvas(patientLocation.lat, patientLocation.lng);
        const pulseSize = 20 + Math.sin(pulseRef.current * 2) * 5;
        // Pulse ring
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.stroke();
        // Outer ring
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.stroke();
        // Inner circle
        ctx.fillStyle = '#6366f1';
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        // Icon
        ctx.fillStyle = 'white';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏠', x, y);
        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('You', x, y - 20);
      }

      // Doctor marker (animated)
      if (showDoctorMarker && doctorLocation) {
        const { x, y } = toCanvas(doctorLocation.lat, doctorLocation.lng);
        const pulseSize = 22 + Math.sin(pulseRef.current * 3) * 6;
        // Pulse
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.stroke();
        // Outer glow
        ctx.fillStyle = 'rgba(20, 184, 166, 0.15)';
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();
        // Inner
        ctx.fillStyle = '#14b8a6';
        ctx.shadowColor = '#14b8a6';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        // Icon
        ctx.fillStyle = 'white';
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚗', x, y);
        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('Doctor', x, y - 22);
      }

      // Medicine marker
      if (showMedicineMarker && medicineLocation) {
        const { x, y } = toCanvas(medicineLocation.lat, medicineLocation.lng);
        const pulseSize = 20 + Math.sin(pulseRef.current * 2.5) * 5;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'white';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📦', x, y);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('Medicine', x, y - 18);
      }

      // Legend
      const legendX = 15, legendY = canvasSize.h - 55;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 1;
      const legendW = 180, legendH = 48;
      ctx.beginPath();
      ctx.roundRect(legendX, legendY, legendW, legendH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      // Patient
      ctx.fillStyle = '#6366f1';
      ctx.beginPath(); ctx.arc(legendX + 12, legendY + 14, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText('Patient', legendX + 22, legendY + 14);
      // Doctor
      ctx.fillStyle = '#14b8a6';
      ctx.beginPath(); ctx.arc(legendX + 82, legendY + 14, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText('Doctor', legendX + 92, legendY + 14);
      // Medicine
      if (showMedicineMarker) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(legendX + 12, legendY + 34, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText('Medicine', legendX + 22, legendY + 34);
      }

      // "LIVE" indicator
      const liveX = canvasSize.w - 65, liveY = 15;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.beginPath();
      ctx.roundRect(liveX, liveY, 50, 22, 6);
      ctx.fill();
      const livePulse = 0.6 + Math.sin(pulseRef.current * 4) * 0.4;
      ctx.fillStyle = `rgba(255,255,255,${livePulse})`;
      ctx.beginPath(); ctx.arc(liveX + 12, liveY + 11, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('LIVE', liveX + 20, liveY + 12);

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [canvasSize, doctorLocation, patientLocation, route, routeIndex, medicineLocation, medicineRoute, medicineRouteIndex, nearbyDoctors, showDoctorMarker, showMedicineMarker, toCanvas]);

  return (
    <div ref={containerRef} style={{ width, borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)', ...style }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${canvasSize.h}px`, display: 'block' }}
      />
    </div>
  );
}
