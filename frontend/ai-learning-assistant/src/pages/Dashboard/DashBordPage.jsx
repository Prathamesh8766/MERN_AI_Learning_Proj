import { useEffect, useState } from "react";
import Spinner from "../../components/common/Spinner.jsx";
import progressService from "../../services/progresSerice.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  BookOpen,
  Brain,
  TrendingUp,
  Clock,
} from "lucide-react";

function DashBordPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await progressService.getDashboardData();
        setDashboardData(res.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spinner />;

  if (!dashboardData?.overview) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-500">
        <TrendingUp size={32} />
        <p className="ml-2">No dashboard data available</p>
      </div>
    );
  }

  const { overview, recentDocuments, recentQuizzes } = dashboardData;


  const stats = [
    {
      label: "Documents",
      value: overview.totalDocuments,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      to: "/documents",
    },
    {
      label: "Flashcards",
      value: overview.totalFlashcards,
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-500",
      to: "/flashcards",
    },
    {
      label: "Quizzes",
      value: overview.totalQuizzes,
      icon: Brain,
      gradient: "from-emerald-500 to-teal-500",
      to: "/statistics",
    },
    {
      label: "Avg Score",
      value: `${overview.averageScore}%`,
      icon: TrendingUp,
      gradient: "from-orange-500 to-yellow-500",
      to: "/dashboard",
    },
  ];


  return (
    <div className="min-h-full bg-neutral-200/60 p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-neutral-500">
          Track your learning and progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              onClick={() => navigate(stat.to)}
              className="
          cursor-pointer
          bg-white rounded-xl p-4 border
          shadow-md
          transition-all duration-300 ease-out
          hover:shadow-xl
          hover:-translate-y-[2px]
          hover:scale-[1.02]
        "
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                  {stat.label}
                </p>

                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient}
                        flex items-center justify-center text-white
                        shadow-lg shadow-black/25`}
                >
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-3 text-2xl font-semibold">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>


      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <div className="bg-white rounded-xl border p-4 shadow-lg min-h-[340px]">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} />
            <h3 className="font-medium">Recent Documents</h3>
          </div>

          {recentDocuments.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No recent documents
            </p>
          ) : (
            <ul className="space-y-3 max-h-64 overflow-y-auto hide-scrollbar scroll-smooth">
              {recentDocuments.map((doc) => (
                <li
                  key={doc._id}
                  className="
                            flex items-center justify-between
                            bg-neutral-50 rounded-lg p-3
                            shadow-sm
                            transition-all duration-200 ease-out

                            hover:bg-white
                            hover:shadow-md
                            hover:-translate-y-[1px]
                            hover:scale-[1.01]
                          "
                >
                  <div>
                    <p className="text-sm font-medium">
                      {doc.title}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {new Date(doc.lastAccessed).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    className="text-xs px-3 py-1 rounded-md
                               bg-blue-500 text-white
                               hover:bg-blue-600 transition"
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Quizzes */}
        <div className="bg-white rounded-xl border p-4 shadow-lg min-h-[340px]">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={18} />
            <h3 className="font-medium">Recent Quizzes</h3>
          </div>

          {recentQuizzes.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No recent quizzes
            </p>
          ) : (
            <ul className="space-y-3 max-h-64 overflow-y-auto hide-scrollbar scroll-smooth">
              {recentQuizzes.map((quiz) => (
                <li
                  key={quiz._id}
                  className="
                            flex items-center justify-between
                            bg-neutral-50 rounded-lg p-3
                            shadow-sm
                            transition-all duration-200 ease-out

                            hover:bg-white
                            hover:shadow-md
                            hover:-translate-y-[1px]
                            hover:scale-[1.01]
                          "
                >
                  <div>
                    <p className="text-sm font-medium">
                      {quiz.title}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Score: {quiz.score}/{quiz.totalQuestions}
                    </p>
                  </div>

                  <button
                    className="text-xs px-3 py-1 rounded-md
                               bg-emerald-500 text-white
                               hover:bg-emerald-600 transition"
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashBordPage;
