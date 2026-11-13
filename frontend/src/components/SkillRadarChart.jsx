import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export default function SkillRadarChart({ skills = [] }) {
  if (!skills || skills.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-gray-400">
        No skill data available to render radar chart.
      </div>
    );
  }

  // Format skills for Radar chart
  const chartData = skills.slice(0, 7).map((s) => ({
    subject: s.skill_name || s.name,
    studentScore: s.score || (s.student_score ?? 70),
    benchmark: 85,
    fullMark: 100
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="#E9DEFF" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#4C1D95', fontSize: 11, fontWeight: 500 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#C4B5FD" />
          <Radar
            name="Your Proficiency"
            dataKey="studentScore"
            stroke="#7C3AED"
            fill="#8B5CF6"
            fillOpacity={0.45}
          />
          <Radar
            name="Industry Benchmark"
            dataKey="benchmark"
            stroke="#93C5FD"
            fill="#3B82F6"
            fillOpacity={0.15}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderColor: '#EDE9FE',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.1)',
              fontSize: '11px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
