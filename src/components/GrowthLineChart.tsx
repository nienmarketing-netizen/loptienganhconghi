import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { TrendingUp, Award, Info } from "lucide-react";
import { StudentProfile } from "../types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";

interface GrowthLineChartProps {
  student: StudentProfile;
}

export const GrowthLineChart: React.FC<GrowthLineChartProps> = ({ student }) => {
  const data = student.growthHistory;
  const baselineScore = student.teacherDiagnosis.baselineOverallScore;
  const latestClassScore = data[data.length - 1]?.classScore ?? 0;
  const latestSchoolScore = data[data.length - 1]?.schoolScore ?? 0;
  const scoreDiff = (latestClassScore - baselineScore).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-[0_8px_24px_rgba(15,45,90,0.06)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#1e293b] tracking-[-0.015em] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0066ff] shadow-[0_0_8px_#0066ff] animate-pulse" />
            <span>Biểu đồ tăng trưởng điểm số</span>
          </h3>
          <p className="text-xs text-[#64748b] font-normal mt-0.5">
            Theo dõi sự tiến bộ giữa bài kiểm tra lớp Cô Nghi và bài thi trường
          </p>
        </div>

        <Badge variant="success" className="self-start sm:self-auto py-1 px-3 font-bold text-xs leading-tight rounded-full shadow-xs">
          <Award className="w-3.5 h-3.5 mr-1 text-[#4caf50]" />
          <span>Tăng +{scoreDiff} điểm so với đầu vào</span>
        </Badge>
      </div>

      <div>
        {/* Quick summary metrics - Modern Clean Cards */}
        <div className="grid grid-cols-3 gap-2.5 mb-4 p-3 bg-[#edf3fa] border border-[#dbe4f0] rounded-xl text-center">
          <div className="p-1">
            <span className="text-[11px] sm:text-xs text-[#64748b] font-medium block">Điểm đầu vào</span>
            <span className="text-base sm:text-2xl font-black text-rose-500 tracking-[-0.02em] mt-0.5 block">
              {baselineScore.toFixed(1)}
            </span>
          </div>
          <div className="p-1 border-x border-slate-200/80">
            <span className="text-[11px] sm:text-xs text-[#64748b] font-medium block">Test lớp Cô Nghi</span>
            <span className="text-base sm:text-2xl font-black text-[#0066ff] tracking-[-0.02em] mt-0.5 block">
              {latestClassScore.toFixed(1)}
            </span>
          </div>
          <div className="p-1">
            <span className="text-[11px] sm:text-xs text-[#64748b] font-medium block">Thi tại trường</span>
            <span className="text-base sm:text-2xl font-black text-[#1e293b] tracking-[-0.02em] mt-0.5 block">
              {latestSchoolScore.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Recharts Line Chart Container */}
        <div className="w-full h-64 sm:h-72 -ml-2 sm:-ml-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.8} />
              
              <XAxis
                dataKey="period"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />

              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />

              {/* Baseline Reference Line */}
              <ReferenceLine
                y={baselineScore}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Mốc đầu vào: ${baselineScore}`,
                  position: "insideBottomRight",
                  fill: "#f43f5e",
                  fontSize: 10,
                  fontWeight: 700,
                  offset: 8,
                }}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const point = payload[0]?.payload;
                    return (
                      <div className="bg-white text-[#1e293b] p-3 rounded-2xl shadow-[0_12px_28px_rgba(15,45,90,0.12)] border border-slate-100 text-xs space-y-1.5 min-w-[170px]">
                        <div className="font-bold text-[#0066ff] border-b border-slate-100 pb-1.5 flex justify-between items-center">
                          <span>{label}</span>
                          {point?.note && (
                            <span className="text-[10px] text-[#64748b] font-normal">Ghi chú</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-3 text-blue-900">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#0066ff]" />
                            <span>Test tại lớp:</span>
                          </span>
                          <strong className="font-mono text-[#0066ff] text-sm font-bold">
                            {point?.classScore} / 10
                          </strong>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-slate-700">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                            <span>Thi trên trường:</span>
                          </span>
                          <strong className="font-mono text-[#1e293b] text-sm font-bold">
                            {point?.schoolScore} / 10
                          </strong>
                        </div>
                        {point?.note && (
                          <div className="pt-1.5 text-[11px] text-[#64748b] italic border-t border-slate-100">
                            💡 {point.note}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: "12px", fontSize: "11px" }}
              />

              {/* Line 1: Điểm test tại lớp */}
              <Line
                name="Điểm test tại lớp"
                type="monotone"
                dataKey="classScore"
                stroke="#0066ff"
                strokeWidth={3.5}
                dot={{ fill: "#0066ff", r: 4.5, strokeWidth: 2.5, stroke: "#ffffff" }}
                activeDot={{ r: 7, fill: "#0052cc", stroke: "#ffffff", strokeWidth: 3 }}
              />

              {/* Line 2: Điểm thi trên trường */}
              <Line
                name="Điểm thi trên trường"
                type="monotone"
                dataKey="schoolScore"
                stroke="#64748b"
                strokeWidth={2.5}
                strokeDasharray="4 2"
                dot={{ fill: "#64748b", r: 4, strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 6, fill: "#1e293b", stroke: "#ffffff", strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Footnote explanation for parents */}
        <div className="flex items-start gap-2 mt-3 text-xs text-[#64748b] bg-[#edf3fa] border border-[#dbe4f0] p-3 rounded-xl leading-relaxed">
          <Info className="w-4 h-4 text-[#0066ff] shrink-0 mt-0.5" />
          <p className="mb-0">
            Đường nét liền màu xanh là <strong className="text-[#0066ff] font-semibold">Điểm bài test tại lớp Cô Nghi</strong>, còn đường nét đứt là <strong className="text-[#1e293b] font-semibold">Điểm thi trên trường</strong>. Đồ thị đi lên phản ánh sự tiến bộ vững chắc và bứt phá của con.
          </p>
        </div>
      </div>
    </div>
  );
};
