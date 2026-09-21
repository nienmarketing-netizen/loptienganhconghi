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
    <Card className="border-slate-200/80 shadow-md bg-white">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg text-slate-900">
              Biểu đồ Tăng trưởng Điểm số
            </CardTitle>
            <CardDescription>
              Theo dõi sự tiến bộ giữa bài kiểm tra lớp Cô Nghi và bài thi trường
            </CardDescription>
          </div>

          <Badge variant="success" className="self-start sm:self-auto py-1 px-3">
            <Award className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            <span>Tăng +{scoreDiff} điểm so với đầu vào</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Quick summary metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Điểm đầu vào</span>
            <span className="text-base sm:text-lg font-bold text-rose-600 font-mono">
              {baselineScore.toFixed(1)}
            </span>
          </div>
          <div className="border-x border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Test tại lớp</span>
            <span className="text-base sm:text-lg font-bold text-indigo-600 font-mono">
              {latestClassScore.toFixed(1)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Thi trên trường</span>
            <span className="text-base sm:text-lg font-bold text-amber-600 font-mono">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              
              <XAxis
                dataKey="period"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
              />

              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
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
                  fill: "#e11d48",
                  fontSize: 10,
                  fontWeight: 600,
                  offset: 8,
                }}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const point = payload[0]?.payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[160px]">
                        <div className="font-bold text-amber-400 border-b border-slate-700 pb-1 flex justify-between items-center">
                          <span>{label}</span>
                          {point?.note && (
                            <span className="text-[10px] text-slate-300 font-normal">Ghi chú</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-3 text-indigo-200">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-400" />
                            <span>Test tại lớp:</span>
                          </span>
                          <strong className="font-mono text-white text-sm">
                            {point?.classScore} / 10
                          </strong>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-amber-200">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            <span>Thi trên trường:</span>
                          </span>
                          <strong className="font-mono text-white text-sm">
                            {point?.schoolScore} / 10
                          </strong>
                        </div>
                        {point?.note && (
                          <div className="pt-1 text-[11px] text-slate-300 italic border-t border-slate-800">
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
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ fill: "#4f46e5", r: 4, strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 6, fill: "#4338ca", stroke: "#c7d2fe", strokeWidth: 3 }}
              />

              {/* Line 2: Điểm thi trên trường */}
              <Line
                name="Điểm thi trên trường"
                type="monotone"
                dataKey="schoolScore"
                stroke="#f59e0b"
                strokeWidth={2.5}
                strokeDasharray="4 2"
                dot={{ fill: "#f59e0b", r: 4, strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 6, fill: "#d97706", stroke: "#fef3c7", strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Footnote explanation for parents */}
        <div className="flex items-start gap-1.5 mt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
          <span>
            Đường nét đứt màu đỏ là <strong className="text-rose-600 font-semibold">Điểm chuẩn đầu vào</strong> khi con mới gia nhập lớp. Biểu đồ đi lên chứng minh sự thẩm thấu kiến thức và tính bền vững khi làm bài thi trên trường.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
