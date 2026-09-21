import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
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
    <div className="rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Hồ sơ năng lực học sinh
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Chẩn đoán chuyên sâu 5 trụ cột ngôn ngữ từ ngày đầu nhập học
          </p>
        </div>

        <Badge variant="amber" className="text-[11px] py-1">
          Chẩn đoán 1-1
        </Badge>
      </div>

      {/* Grid: Radar Chart + Teacher Diagnostic Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Left: Recharts Radar Chart */}
        <Card className="md:col-span-6 border-slate-200/80 shadow-md flex flex-col justify-between">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center justify-between">
              <span>Đa giác Năng lực (5 Trục)</span>
              <span className="text-[11px] text-slate-600 font-normal">Thang điểm 100</span>
            </CardTitle>
            <CardDescription>
              Trực quan hóa sự mở rộng toàn diện của các kỹ năng tiếng Anh
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 flex-1 flex flex-col items-center justify-center">
            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    stroke="#94a3b8"
                    tick={{ fill: "#64748b", fontSize: 9 }}
                  />

                  {/* Vùng điểm đầu vào */}
                  <Radar
                    name="Ngày đầu nhập học"
                    dataKey="baseline"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.25}
                  />

                  {/* Vùng điểm hiện tại */}
                  <Radar
                    name="Năng lực hiện tại"
                    dataKey="current"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.45}
                  />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: "8px", fontSize: "11px" }}
                  />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const dataItem = payload[0]?.payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg border border-slate-700">
                            <div className="font-bold text-amber-300">{dataItem.subject}</div>
                            <div className="text-slate-300">
                              Đầu vào: <span className="text-white font-mono">{dataItem.baseline}/100</span>
                            </div>
                            <div className="text-amber-400 font-semibold">
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
            <div className="w-full flex items-center justify-around pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 opacity-60" />
                <span>Đầu vào (Vùng xám)</span>
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-amber-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Hiện tại (Vùng vàng bứt phá)</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Right: Card Nhận xét của giáo viên ngày đầu nhập học */}
        <Card className="md:col-span-6 border-amber-200/70 bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 shadow-md flex flex-col justify-between">
          <CardHeader className="pb-2 border-b border-amber-100/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-amber-800 uppercase flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Nhập học ngày: {diagnosis.admissionDate}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-100/80 text-rose-800">
                Đầu vào: {diagnosis.baselineOverallScore}/10
              </span>
            </div>
            <CardTitle className="text-sm sm:text-base text-slate-900 mt-1 font-bold">
              Nhận xét của giáo viên ngày đầu nhập học
            </CardTitle>
            <div className="text-xs font-semibold text-rose-600 italic">
              &ldquo;{diagnosis.diagnosisTitle}&rdquo;
            </div>
          </CardHeader>

          <CardContent className="pt-3.5 space-y-3.5 flex-1 text-xs text-slate-700 leading-relaxed">
            {/* Initial Observations */}
            <div className="space-y-1">
              <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5 text-rose-800">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Chẩn đoán điểm nghẽn ban đầu:
              </div>
              <p className="text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/70 text-[12px] leading-relaxed">
                {diagnosis.initialObservations}
              </p>
            </div>

            {/* Breakthrough Action */}
            <div className="space-y-1">
              <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Giải pháp Cô Nghi đã áp dụng:
              </div>
              <p className="text-slate-600 bg-white/80 p-2.5 rounded-xl border border-emerald-200/60 text-[12px] leading-relaxed">
                {diagnosis.breakthroughAction}
              </p>
            </div>

            {/* Message to Parents */}
            <div className="p-3 bg-gradient-to-r from-amber-100/70 to-orange-100/60 rounded-xl border border-amber-200/80 text-amber-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                <MessageSquareHeart className="w-3.5 h-3.5 text-orange-600" />
                <span>Lời nhắn riêng cho ba mẹ:</span>
              </div>
              <p className="text-[12px] italic text-amber-900/90 leading-relaxed">
                &ldquo;{diagnosis.messageToParents}&rdquo;
              </p>
              <div className="pt-1 text-right text-[11px] font-bold text-amber-800">
                — Cô Nghi (Giáo viên chủ nhiệm) ✍️
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
