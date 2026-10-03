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
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-[0_8px_24px_rgba(15,45,90,0.06)] space-y-4 sm:space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1e293b] tracking-[-0.015em] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0066ff] shadow-[0_0_8px_#0066ff] animate-pulse" />
            <span>Hồ sơ năng lực học sinh</span>
          </h3>
          <p className="text-xs text-[#64748b] font-normal mt-0.5">
            Chẩn đoán chuyên sâu 5 trụ cột ngôn ngữ từ ngày đầu nhập học
          </p>
        </div>

        <Badge variant="default" className="text-xs py-1 px-3 font-bold leading-tight rounded-full shadow-xs bg-blue-50 text-[#0066ff] border-blue-200">
          Chẩn đoán 1-1
        </Badge>
      </div>

      {/* Grid: Radar Chart + Teacher Diagnostic Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Left: Recharts Radar Chart */}
        <div className="md:col-span-6 bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 flex flex-col justify-between">
          <div className="pb-2 border-b border-slate-200/70">
            <div className="text-xs sm:text-sm font-bold text-[#1e293b] tracking-[-0.015em] flex items-center justify-between">
              <span>Đa giác năng lực (5 trục)</span>
              <span className="text-xs font-semibold text-[#0066ff] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">Thang 100</span>
            </div>
            <p className="text-xs text-[#64748b] font-normal mt-0.5">
              Trực quan hóa sự mở rộng toàn diện của các kỹ năng tiếng Anh
            </p>
          </div>

          <div className="pt-2 flex-1 flex flex-col items-center justify-center">
            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid stroke="#cbd5e1" opacity={0.8} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#1e293b", fontSize: 12, fontWeight: 700 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    stroke="#94a3b8"
                    tick={{ fill: "#64748b", fontSize: 9 }}
                  />

                  {/* Vùng điểm đầu vào */}
                  <Radar
                    name="Đầu vào"
                    dataKey="baseline"
                    stroke="#ffb800"
                    fill="#ffb800"
                    fillOpacity={0.3}
                  />

                  {/* Vùng điểm hiện tại */}
                  <Radar
                    name="Hiện tại"
                    dataKey="current"
                    stroke="#0066ff"
                    fill="#0066ff"
                    fillOpacity={0.4}
                  />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const dataItem = payload[0]?.payload;
                        return (
                          <div className="bg-white text-[#1e293b] p-3 rounded-2xl text-xs space-y-1 shadow-[0_10px_25px_rgba(15,45,90,0.12)] border border-slate-100 min-w-[170px]">
                            <div className="font-bold text-[#0066ff] border-b border-slate-100 pb-1">{dataItem.subject}</div>
                            <div className="text-slate-600 flex justify-between">
                              <span>Đầu vào:</span>
                              <strong className="font-mono text-amber-700">{dataItem.baseline}/100</strong>
                            </div>
                            <div className="text-blue-900 font-bold flex justify-between">
                              <span>Hiện tại:</span>
                              <strong className="font-mono text-[#0066ff]">{dataItem.current}/100 (+{dataItem.current - dataItem.baseline})</strong>
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
            <div className="w-full flex items-center justify-around pt-3 border-t border-slate-200/70 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-amber-800">
                <span className="w-3 h-3 rounded-full bg-[#ffb800] shadow-xs" />
                <span>Mốc Đầu vào</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#0066ff] font-bold">
                <span className="w-3 h-3 rounded-full bg-[#0066ff] shadow-xs" />
                <span>Năng lực Hiện tại</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Card Nhận xét của giáo viên ngày đầu nhập học */}
        <div className="md:col-span-6 bg-slate-50/60 border border-slate-200/70 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="pb-2 border-b border-slate-200/70">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
              <span className="text-xs font-bold text-[#0066ff] flex items-center gap-1.5 leading-tight">
                <Calendar className="w-3.5 h-3.5 text-[#0066ff] shrink-0" />
                <span>Nhập học ngày: {diagnosis.admissionDate}</span>
              </span>
              <span className="self-start sm:self-auto text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 shadow-xs leading-tight">
                Đầu vào: {diagnosis.baselineOverallScore}/10
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1e293b] tracking-[-0.015em] mt-2">
              Nhận xét của giáo viên ngày đầu nhập học
            </h4>
            <div className="text-xs font-bold text-[#0066ff] italic mt-0.5">
              &ldquo;{diagnosis.diagnosisTitle}&rdquo;
            </div>
          </div>

          <div className="space-y-3 flex-1 text-xs sm:text-sm text-[#1e293b] leading-relaxed">
            {/* Initial Observations - Recessed Well */}
            <div className="space-y-1">
              <div className="font-bold text-[#1e293b] text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Chẩn đoán điểm nghẽn ban đầu:</span>
              </div>
              <div className="text-[#1e293b] bg-white border border-slate-200/80 p-3 rounded-xl text-xs sm:text-sm leading-relaxed font-normal shadow-xs">
                {diagnosis.initialObservations}
              </div>
            </div>

            {/* Breakthrough Action - Recessed Well */}
            <div className="space-y-1">
              <div className="font-bold text-[#1e293b] text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4caf50]" />
                <span>Giải pháp Cô Nghi đã áp dụng:</span>
              </div>
              <div className="text-[#1e293b] bg-white border border-slate-200/80 p-3 rounded-xl text-xs sm:text-sm leading-relaxed font-normal shadow-xs">
                {diagnosis.breakthroughAction}
              </div>
            </div>

            {/* Message to Parents */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-xl text-[#1e293b] space-y-1.5 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#0066ff]">
                <MessageSquareHeart className="w-3.5 h-3.5 text-[#0066ff]" />
                <span>Lời nhắn riêng cho ba mẹ:</span>
              </div>
              <blockquote className="text-xs sm:text-sm italic text-[#1e293b] leading-relaxed pl-2.5 border-l-2 border-[#0066ff] my-1">
                &ldquo;{diagnosis.messageToParents}&rdquo;
              </blockquote>
              <div className="pt-1 text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-[#0066ff] font-bold text-xs">
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
