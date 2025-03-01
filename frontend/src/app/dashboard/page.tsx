"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"];

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

const Dashboard = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [facultyData, setFacultyData] = useState<ChartData[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [majorData, setMajorData] = useState<ChartData[]>([]);

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

        setFacultyData(facultyChartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const totalStudents = students.length;

    const facultySet = new Set(students.map((s) => s.Faculty));
    const totalFaculties = facultySet.size;

    const majorSet = new Set(
      students.filter((s) => s.Faculty === selectedFaculty).map((s) => s.Major)
    );
    const totalMajors = majorSet.size;
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleFacultyClick = (faculty: string) => {
    setSelectedFaculty(faculty);

    const filteredStudents = students.filter((s) => s.Faculty === faculty);

    const majorCounts: Record<string, number> = filteredStudents.reduce((acc, entry) => {
      acc[entry.Major] = (acc[entry.Major] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const majorChartData: ChartData[] = Object.keys(majorCounts).map((key) => ({
      name: key,
      value: majorCounts[key],
    }));

    setMajorData(majorChartData);
  };

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
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              stroke="none"
              label={false}
              onClick={(_, index) => handleFacultyClick(facultyData[index].name)}
            >
              {facultyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip total={facultyData.reduce((sum, item) => sum + item.value, 0)} />} />
          </PieChart>
        </div>

        {/* Show Major Pie Chart when Faculty is Selected */}
        {selectedFaculty && (
          <div className="mt-10 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Majors in {selectedFaculty}</h2>
            <h3 className="text-lg font-semibold mb-4">Total Majors: {majorData.length}</h3>
            <PieChart width={400} height={400}>
              <Pie
                data={majorData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#82ca9d"
                stroke="none"
                label={false}
              >
                {majorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={majorData.reduce((sum, item) => sum + item.value, 0)} />} />
            </PieChart>
          </div>
        )}
      </div>
      {selectedFaculty && (
        <button
          className="mt-4 mb-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => setSelectedFaculty(null)}
        >
          Back to Faculty Chart
        </button>
      )}
    </div>
  );
};

export default Dashboard;
