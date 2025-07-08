"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import SmartCameraFeed from "./components/smart-camera-feed"
import SmartAttendance from "./components/smart-attendance"
import SmartMovement from "./components/smart-movement"
import SmartEmployeeManagement from "./components/smart-employee-management"
import ReportsSection from "./components/reports-section"
import SmartAlerts from "./components/smart-alerts"
import SystemControl from "./components/system-control"
import FaceRecognitionStatus from "./components/face-recognition-status"
import { Users, Camera, AlertTriangle, Clock } from "lucide-react"
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import GoogleLogin from "./components/google-login";

const heroBg = "bg-gradient-to-br from-blue-100 via-white to-blue-200";
const highlightCards = [
  {
    title: "Intelligent Surveillance",
    desc: "AI-powered monitoring for safety and efficiency.",
    icon: <Camera className="h-8 w-8 text-blue-600" />,
  },
  {
    title: "Smart Order Management",
    desc: "Automate and optimize your business workflows.",
    icon: <Users className="h-8 w-8 text-green-600" />,
  },
  {
    title: "Customer Insights",
    desc: "Unlock actionable data with AI analytics.",
    icon: <AlertTriangle className="h-8 w-8 text-yellow-600" />,
  },
  {
    title: "Facial Recognition Attendance",
    desc: "Seamless, real-time employee tracking.",
    icon: <Clock className="h-8 w-8 text-purple-600" />,
  },
  {
    title: "Retail Automation",
    desc: "Boost productivity with smart automation tools.",
    icon: <Badge className="h-8 w-8 text-pink-600" />,
  },
];

export default function HomePage() {
  // All hooks at the top!
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [unknownPersons, setUnknownPersons] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [isSystemActive, setIsSystemActive] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEmployees(Math.floor(Math.random() * 45) + 10);
      setTotalEmployees(55);
      setUnknownPersons(Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) {
    // Beautiful hero/landing page for unauthenticated users
    return (
      <div className={`min-h-screen ${heroBg} flex flex-col items-center justify-between`}>
        <header className="w-full flex justify-between items-center px-8 py-6">
          <div className="flex items-center space-x-3">
            <img src="/placeholder-logo.svg" alt="The AiR Co Logo" className="h-12 w-12" />
            <span className="text-2xl font-bold text-blue-900 tracking-tight">The AiR Co</span>
          </div>
          <div>
            <GoogleLogin />
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center w-full px-4">
          <div className="max-w-3xl text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-4 animate-fade-in-up">Artificial Intelligence Revolution Company</h1>
            <p className="text-lg md:text-2xl text-gray-700 mb-6 animate-fade-in-up delay-100">
              Welcome to <span className="font-bold text-blue-700">The AiR Co</span> — where innovation meets intelligence.<br/>
              We are building cutting-edge AI-powered solutions to shape the future of businesses, industries, and individuals.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-up delay-200">
              {highlightCards.map((card, i) => (
                <div key={i} className="bg-white/80 shadow-lg rounded-xl p-6 w-64 flex flex-col items-center hover:scale-105 transition-transform">
                  {card.icon}
                  <h3 className="mt-2 text-lg font-semibold text-blue-800">{card.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{card.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 rounded-xl p-6 shadow-md mb-8 animate-fade-in-up delay-300">
              <h2 className="text-2xl font-bold text-blue-800 mb-2">🚀 About Us</h2>
              <p className="text-gray-700 mb-2">
                <b>The AiR Co (Artificial Intelligence Revolution Company)</b> is a forward-thinking tech initiative by a passionate team focused on developing AI-driven platforms, applications, and tools that transform everyday tasks into intelligent experiences.
              </p>
              <p className="text-gray-700 mb-2">
                Funded and mentored by our visionary guide, our mission is to lead the AI revolution with real-world applications.
              </p>
              <p className="text-gray-700">
                We are currently working on several AI-powered modules and projects, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-left text-blue-700 mt-2">
                <li>Intelligent Surveillance Systems</li>
                <li>Smart Order Management Platforms</li>
                <li>AI-Powered Customer Insights</li>
                <li>Real-Time Facial Recognition Attendance</li>
                <li>Automation Tools for Retail & Businesses</li>
              </ul>
            </div>
            <div className="flex justify-center">
              <Button className="bg-blue-700 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:bg-blue-800 transition">Get Started with Google</Button>
            </div>
          </div>
        </main>
        <footer className="w-full text-center py-4 text-gray-500 text-sm bg-white/60 mt-8">
          &copy; {new Date().getFullYear()} The AiR Co. All rights reserved.
        </footer>
      </div>
    );
  }

  const systemStats = [
    {
      title: "Active Employees",
      value: activeEmployees,
      total: totalEmployees,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Camera Status",
      value: "8/8 Online",
      icon: Camera,
      color: "text-blue-600",
    },
    {
      title: "Unknown Persons",
      value: unknownPersons,
      icon: AlertTriangle,
      color: unknownPersons > 0 ? "text-red-600" : "text-green-600",
    },
    {
      title: "System Uptime",
      value: "99.8%",
      icon: Clock,
      color: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">TheAirCo System</h1>
            <p className="text-gray-600">AI-Powered Employee Monitoring & Security</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={isSystemActive ? "default" : "destructive"}>
              {isSystemActive ? "System Active" : "System Inactive"}
            </Badge>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {systemStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {typeof stat.value === "number" && stat.total ? `${stat.value}/${stat.total}` : stat.value}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="control">System Control</TabsTrigger>
            <TabsTrigger value="cameras">Live Cameras</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="movement">Movement</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SmartCameraFeed />
              </div>
              <div className="space-y-4">
                <SmartAlerts />
                <SmartAttendance />
              </div>
            </div>
            <FaceRecognitionStatus />
          </TabsContent>

          <TabsContent value="control">
            <SystemControl onSystemStateChange={setIsSystemActive} />
          </TabsContent>

          <TabsContent value="cameras">
            <SmartCameraFeed expanded />
          </TabsContent>

          <TabsContent value="attendance">
            <SmartAttendance expanded />
          </TabsContent>

          <TabsContent value="movement">
            <SmartMovement expanded />
          </TabsContent>

          <TabsContent value="employees">
            <SmartEmployeeManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
