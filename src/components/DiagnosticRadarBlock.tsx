import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import { Stethoscope, Calendar, CheckCircle2, MessageSquareHeart, Award } from "lucide-react";
import { StudentProfile } from "../types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";

interface DiagnosticRadarBlockProps {
  student: StudentProfile;
}

export const DiagnosticRadarBlock: React.FC<DiagnosticRadarBlockProps> = ({ student }) => {
  const radarData = student.radarCapabilities;
  const diagnosis = student.teacherDiagnosis;

  return (
    <div className="rounded-lg sm:rounded-xl soft-ui-embossed p-4 sm:p-6 space-y-4 sm:space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#b2c2d4]/40 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a] tracking-[-0.015em] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
            <span>Hồ sơ năng lực học sinh</span>
          </h3>
          <p className="text-xs text-[#666666] font-normal mt-0.5">
            Chẩn đoán chuyên sâu 5 trụ cột ngôn ngữ từ ngày đầu nhập học
          </p>
        </div>

        <Badge variant="amber" className="text-xs py-1 px-2.5 font-semibold leading-tight">
          Chẩn đoán 1-1
        </Badge>
      </div>

      {/* Grid: Radar Chart + Teacher Diagnostic Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Left: Recharts Radar Chart */}
        <div className="md:col-span-6 soft-ui-embossed-sm rounded-lg sm:rounded-xl p-4 flex flex-col justify-between">
          <div className="pb-2 border-b border-[#b2c2d4]/40">
            <div className="text-xs sm:text-sm font-bold text-[#1a1a1a] tracking-[-0.015em] flex items-center justify-between">
              <span>Đa giác năng lực (5 trục)</span>
              <span className="text-xs text-[#666666] font-normal">Thang 100</span>
            </div>
            <p className="text-xs text-[#666666] font-normal mt-0.5">
              Trực quan hóa sự mở rộng toàn diện của các kỹ năng tiếng Anh
            </p>
          </div>

          <div className="pt-2 flex-1 flex flex-col items-center justify-center">
            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid stroke="#b0c0d2" opacity={0.7} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#1a1a1a", fontSize: 12, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    stroke="#a3b1c6"
                    tick={{ fill: "#4a5568", fontSize: 9 }}
                  />

                  {/* Vùng điểm đầu vào */}
                  <Radar
                    name="Đầu vào"
                    dataKey="baseline"
                    stroke="#d4af37"
                    fill="#FFF3C6"
                    fillOpacity={0.7}
                  />

                  {/* Vùng điểm hiện tại */}
                  <Radar
                    name="Hiện tại"
                    dataKey="current"
                    stroke="#ff4757"
                    fill="#ff4757"
                    fillOpacity={0.45}
                  />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const dataItem = payload[0]?.payload;
                        return (
                          <div className="bg-[#2d3436] text-white p-2.5 rounded-lg text-xs space-y-1 shadow-[var(--shadow-floating)] border border-white/20 font-mono">
                            <div className="font-bold text-amber-300">{dataItem.subject}</div>
                            <div className="text-slate-300">
                              Đầu vào: <span className="text-white font-mono">{dataItem.baseline}/100</span>
                            </div>
                            <div className="text-rose-300 font-semibold">
                              Hiện tại: <span className="font-mono text-white">{dataItem.current}/100</span> (tăng +{dataItem.current - dataItem.baseline})
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Quick Legend Highlights */}
            <div className="w-full flex items-center justify-around pt-2 border-t border-[#b0c0d2]/40 text-[11px] text-[#4a5568] font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFF3C6] border border-[#d4af37]" />
                <span className="font-semibold text-[#1a1a1a]">Đầu vào</span>
              </span>
              <span className="flex items-center gap-1.5 font-bold text-[#ff4757]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff4757]" />
                <span>Hiện tại</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Card Nhận xét của giáo viên ngày đầu nhập học */}
        <div className="md:col-span-6 soft-ui-embossed-sm rounded-lg sm:rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div className="pb-2 border-b border-[#b0c0d2]/40">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
              <span className="text-xs font-semibold text-[#ff4757] flex items-center gap-1.5 leading-tight">
                <Calendar className="w-3.5 h-3.5 text-[#ff4757] shrink-0" />
                <span>Nhập học ngày: {diagnosis.admissionDate}</span>
              </span>
              <span className="self-start sm:self-auto text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 leading-tight">
                Đầu vào: {diagnosis.baselineOverallScore}/10
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a] tracking-[-0.015em] mt-2">
              Nhận xét của giáo viên ngày đầu nhập học
            </h4>
            <div className="text-xs font-semibold text-[#ff4757] italic mt-0.5">
              &ldquo;{diagnosis.diagnosisTitle}&rdquo;
            </div>
          </div>

          <div className="space-y-3 flex-1 text-xs sm:text-sm text-[#1a1a1a] leading-relaxed">
            {/* Initial Observations - Recessed Well */}
            <div className="space-y-1">
              <div className="font-semibold text-[#1a1a1a] text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Chẩn đoán điểm nghẽn ban đầu:</span>
              </div>
              <div className="text-[#1a1a1a] soft-ui-debossed p-3 rounded-lg text-xs sm:text-sm leading-relaxed font-normal">
                {diagnosis.initialObservations}
              </div>
            </div>

            {/* Breakthrough Action - Recessed Well */}
            <div className="space-y-1">
              <div className="font-semibold text-[#1a1a1a] text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Giải pháp Cô Nghi đã áp dụng:</span>
              </div>
              <div className="text-[#1a1a1a] soft-ui-debossed p-3 rounded-lg text-xs sm:text-sm leading-relaxed font-normal">
                {diagnosis.breakthroughAction}
              </div>
            </div>

            {/* Message to Parents - Skool Blockquote */}
            <div className="p-3 soft-ui-convex rounded-lg text-[#1a1a1a] space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-[#ff4757]">
                <MessageSquareHeart className="w-3.5 h-3.5 text-[#ff4757]" />
                <span>Lời nhắn riêng cho ba mẹ:</span>
              </div>
              <blockquote className="text-xs sm:text-sm italic text-[#1a1a1a] leading-relaxed pl-2 border-l-2 border-[#ff4757]/70 my-1">
                &ldquo;{diagnosis.messageToParents}&rdquo;
              </blockquote>
              <div className="pt-1 text-right">
                <span className="skool-mention text-xs">
                  @Cô Nghi ✍️
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
