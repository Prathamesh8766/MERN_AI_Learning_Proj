import { Bell, User, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";


export function Header({ toggleSidebar }) {
    const { user } = useAuth();


    return (
        <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
            <div className="flex items-center justify-between px-4 h-16">

                {/* Left: Menu + App name */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                        className="p-2 rounded-lg hover:bg-neutral-100 transition"
                    >
                        <Menu size={22} />
                    </button>

                    <h1 className="font-semibold text-neutral-800 hidden sm:block">
                        AI Learning Assistant
                    </h1>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">

                    {/* Notification */}
                    <button className="relative p-2 rounded-lg hover:bg-neutral-100 transition">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </button>

                    {/* User Profile */}
                    <div className="relative">
                        <div
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition cursor-default"
                        >
                            <div className="w-9 h-9 flex items-center justify-center bg-slate-200 rounded-full">
                                <User size={18} />
                            </div>

                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-neutral-800">
                                    {user?.username || "User"}
                                </p>
                                <p className="text-xs text-neutral-500">
                                    {user?.email || "email@example.com"}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
}
