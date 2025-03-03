"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, TooltipProps, Cell } from "recharts";

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

const CustomTooltip: React.FC<TooltipProps<number, string> & { total: number }> = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload as ChartData; // Ensure correct typing
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

const Dashboard = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [facultyTodayData, setFacultyTodayData] = useState<ChartData[]>([]);
  const [majorTodayData, setMajorTodayData] = useState<ChartData[]>([]);
  const [studentsToday, setStudentsToday] = useState<StudentData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbwCGKp9PRF3PtmJX1326t16P9B92L0ZRgNptILBqON8V8PwVLwkqhXVy0vV0NmLmMuw/exec"
        );
        const json: Record<string, StudentData> = await res.json();
        const values: StudentData[] = Object.values(json);
        setStudents(values);

        const today = new Date().toISOString();
        const studentsTodayData = values
          .filter(student => student.Date === "2025-04-30T17:00:00.000Z") // TODO: Change to today's date
        setStudentsToday(studentsTodayData);

        // const facultyCounts: Record<string, number> = values.reduce((acc, entry) => {
        //   acc[entry.Faculty] = (acc[entry.Faculty] || 0) + 1;
        //   return acc;
        // }, {} as Record<string, number>);

        // const facultyChartData: ChartData[] = Object.keys(facultyCounts).map((key) => ({
        //   name: key,
        //   value: facultyCounts[key],
        // }));

        const majorCounts: Record<string, number> = studentsTodayData.reduce((acc, entry) => {
          acc[entry.Major] = (acc[entry.Major] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const majorChartData: ChartData[] = Object.keys(majorCounts).map((key) => ({
          name: key,
          value: majorCounts[key],
        }));

        const facultyTodayCounts: Record<string, number> = studentsTodayData.reduce((acc, entry) => {
          acc[entry.Faculty] = (acc[entry.Faculty] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const facultyTodayChartData: ChartData[] = Object.keys(facultyTodayCounts).map((key) => ({
          name: key,
          value: facultyTodayCounts[key],
        }));

        setFacultyTodayData(facultyTodayChartData);
        setMajorTodayData(majorChartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate percentages for faculties
  const totalStudentsToday = studentsToday.length;
  const facultiesWithPercentages = facultyTodayData.map((faculty) => ({
    ...faculty,
    percentage: ((faculty.value / totalStudentsToday) * 100).toFixed(2),
  }));

  // Sort faculties by percentage and get the top 5
  const topFaculties = [...facultiesWithPercentages]
    .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
    .slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-around items-center bg-white dark:bg-gray-900">
      <div className="flex flex-col justify-start items-start mt-6 md:-mt-24">
        <h1 className="text-2xl font-bold">Total students (all-time): {students.length}</h1>
        <h1 className="text-2xl font-bold mt-6">Total students (today): {studentsToday.length}</h1>

        {/* Table for Top 5 Faculties */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mt-12 mb-4 text-center">Top 5 Faculties (by Percentage)</h2>
          <table className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Rank</th>
                <th className="py-2 px-4 border-b">Faculty</th>
                <th className="py-2 px-4 border-b">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {topFaculties.map((faculty, index) => (
                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                  <td className="py-2 px-4 border-b">#{index+1}</td>
                  <td className="py-2 px-4 border-b">{faculty.name}</td>
                  <td className="py-2 px-4 border-b">{faculty.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center">
        {/* Faculty Pie Chart */}
        <div className="flex flex-col items-center">
          <PieChart width={600} height={300}>
            <Pie
              data={facultyTodayData}
              dataKey="value"
              nameKey="name"
              isAnimationActive={true}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(2)}%`} // Display name and percentage
            >
              {facultyTodayData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip total={facultyTodayData.reduce((sum, item) => sum + item.value, 0)} />} />
          </PieChart>
          <h3 className="text-lg font-semibold mb-4">Faculty</h3>
        </div>

        {/* Major Pie Chart */}
        <div className="flex flex-col items-center">
          <PieChart width={600} height={300}>
            <Pie
              data={majorTodayData}
              dataKey="value"
              nameKey="name"
              isAnimationActive={true}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(2)}%`} // Display name and percentage
            >
              {majorTodayData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip total={majorTodayData.reduce((sum, item) => sum + item.value, 0)} />} />
          </PieChart>
          <h3 className="text-lg font-semibold mb-4">Major</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;