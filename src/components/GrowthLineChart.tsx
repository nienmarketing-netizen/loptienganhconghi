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
    <div className="soft-ui-embossed rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-[#b2c2d4]/40">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-[#1a1a1a] tracking-[-0.015em] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
            <span>Biểu đồ tăng trưởng điểm số</span>
          </h3>
          <p className="text-xs text-[#666666] font-normal mt-0.5">
            Theo dõi sự tiến bộ giữa bài kiểm tra lớp Cô Nghi và bài thi trường
          </p>
        </div>

        <Badge variant="success" className="self-start sm:self-auto py-1 px-3 font-semibold text-xs leading-tight">
          <Award className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          <span>Tăng +{scoreDiff} điểm so với đầu vào</span>
        </Badge>
      </div>

      <div>
        {/* Quick summary metrics - Recessed Well */}
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 soft-ui-debossed rounded-xl text-center">
          <div>
            <span className="text-xs text-[#666666] font-semibold block">Điểm đầu vào</span>
            <span className="text-base sm:text-xl font-bold text-rose-600 tracking-[-0.02em] mt-0.5 block">
              {baselineScore.toFixed(1)}
            </span>
          </div>
          <div className="border-x border-[#babecc]/60">
            <span className="text-xs text-[#666666] font-semibold block">Test tại lớp</span>
            <span className="text-base sm:text-xl font-bold text-[#ff4757] tracking-[-0.02em] mt-0.5 block">
              {latestClassScore.toFixed(1)}
            </span>
          </div>
          <div>
            <span className="text-xs text-[#666666] font-semibold block">Thi trường</span>
            <span className="text-base sm:text-xl font-bold text-[#1a1a1a] tracking-[-0.02em] mt-0.5 block">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#babecc" vertical={false} opacity={0.6} />
              
              <XAxis
                dataKey="period"
                stroke="#4a5568"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#babecc" }}
              />

              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                stroke="#4a5568"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#babecc" }}
              />

              {/* Baseline Reference Line */}
              <ReferenceLine
                y={baselineScore}
                stroke="#ff4757"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Mốc đầu vào: ${baselineScore}`,
                  position: "insideBottomRight",
                  fill: "#ff4757",
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
                      <div className="bg-[#2d3436] text-white p-3 rounded-xl shadow-[var(--shadow-floating)] border border-white/20 text-xs space-y-1.5 min-w-[160px] font-mono">
                        <div className="font-bold text-amber-400 border-b border-white/10 pb-1 flex justify-between items-center">
                          <span>{label}</span>
                          {point?.note && (
                            <span className="text-[10px] text-slate-300 font-normal">Ghi chú</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-3 text-rose-200">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#ff4757]" />
                            <span>Test tại lớp:</span>
                          </span>
                          <strong className="font-mono text-white text-sm">
                            {point?.classScore} / 10
                          </strong>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#a3b1c6]" />
                            <span>Thi trên trường:</span>
                          </span>
                          <strong className="font-mono text-white text-sm">
                            {point?.schoolScore} / 10
                          </strong>
                        </div>
                        {point?.note && (
                          <div className="pt-1 text-[11px] text-slate-300 italic border-t border-white/10">
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
                stroke="#ff4757"
                strokeWidth={3}
                dot={{ fill: "#ff4757", r: 4, strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 6, fill: "#ff3344", stroke: "#ffffff", strokeWidth: 3 }}
              />

              {/* Line 2: Điểm thi trên trường */}
              <Line
                name="Điểm thi trên trường"
                type="monotone"
                dataKey="schoolScore"
                stroke="#2d3436"
                strokeWidth={2.5}
                strokeDasharray="4 2"
                dot={{ fill: "#2d3436", r: 4, strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 6, fill: "#1e2528", stroke: "#ffffff", strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Footnote explanation for parents - Recessed well */}
        <div className="flex items-start gap-2 mt-3 text-xs text-[#666666] soft-ui-debossed p-3 rounded-xl leading-relaxed">
          <Info className="w-4 h-4 text-[#ff4757] shrink-0 mt-0.5" />
          <p className="mb-0">
            Đường nét đứt màu xám đậm là <strong className="text-[#1a1a1a] font-semibold">Điểm thi trên trường</strong>, còn đường nét liền màu đỏ là <strong className="text-[#ff4757] font-semibold">Điểm bài test tại lớp</strong>. Biểu đồ đi lên chứng minh sự thẩm thấu kiến thức và tính bền vững khi làm bài thi trên trường.
          </p>
        </div>
      </div>
    </div>
  );
};
