"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { PieChart, Pie, Tooltip, Cell, LabelList } from "recharts";

type StudentData = {
  QRCodeID: string;
  StudentID: number;
  Faculty: string;
  Major: string;
  Time: string;
  Date: string;
};

type ChartData = {
  name: string;
  value: number;
};

const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const CustomTooltip = ({ active, payload, total }: { active?: boolean; payload?: any[]; total: number }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    const percentage = ((value / total) * 100).toFixed(2);
    return (
      <div className="bg-white dark:bg-gray-700 p-2 rounded shadow">
        <p className="font-bold">{name}</p>
        <p>{`Count: ${value}`}</p>
        <p>{`Percentage: ${percentage}%`}</p>
      </div>
    );
  }
  return null;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919', '#19FF32', '#1932FF'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Dashboard = () => {
  const { theme } = useTheme();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [facultyData, setFacultyData] = useState<ChartData[]>([]);
  const [majorData, setMajorData] = useState<ChartData[]>([]);
  const [colorMap, setColorMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbwCGKp9PRF3PtmJX1326t16P9B92L0ZRgNptILBqON8V8PwVLwkqhXVy0vV0NmLmMuw/exec"
        );
        const json: Record<string, StudentData> = await res.json();
        const values: StudentData[] = Object.values(json);
        setStudents(values);

        const facultyCounts: Record<string, number> = values.reduce((acc, entry) => {
          acc[entry.Faculty] = (acc[entry.Faculty] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const facultyChartData: ChartData[] = Object.keys(facultyCounts).map((key) => ({
          name: key,
          value: facultyCounts[key],
        }));

        const majorCounts: Record<string, number> = values.reduce((acc, entry) => {
          acc[entry.Major] = (acc[entry.Major] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const majorChartData: ChartData[] = Object.keys(majorCounts).map((key) => ({
          name: key,
          value: majorCounts[key],
        }));

        // Generate colors for new names
        setColorMap((prevColors) => {
          const newColors = { ...prevColors };
          facultyChartData.forEach((entry) => {
            if (!newColors[entry.name]) {
              newColors[entry.name] = generateRandomColor();
            }
          });
          return newColors;
        });

        setFacultyData(facultyChartData);
        setMajorData(majorChartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold mt-6 mb-6">Pie Chart</h1>
      <h3 className="text-lg font-semibold mb-4">Total Students: {students.length}</h3>
      <div className="flex flex-row justify-between mr-12">
        {/* Faculty Pie Chart */}
        <div className="mt-10 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Faculty</h2>
          <h3 className="text-lg font-semibold mb-4">Total Faculties: {facultyData.length}</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={facultyData}
              dataKey="value"
              nameKey="name"
              isAnimationActive={true}
              cx="50%"
              cy="50%"
              outerRadius={130}
              label
            >
              <LabelList dataKey="name" position="right" style={{ fontSize: "14px" }} />
              {facultyData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip total={facultyData.reduce((sum, item) => sum + item.value, 0)} />} />
          </PieChart>
        </div>

        {/* Major Pie Chart */}
        <div className="mt-10 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Majors</h2>
          <h3 className="text-lg font-semibold mb-4">Total Majors: {majorData.length}</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={majorData}
              dataKey="value"
              nameKey="name"
              isAnimationActive={true}
              cx="50%"
              cy="50%"
              outerRadius={130}
              label
            >
              <LabelList dataKey="name" position="right" style={{ fontSize: "14px" }} />
              {majorData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip total={majorData.reduce((sum, item) => sum + item.value, 0)} />} />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
