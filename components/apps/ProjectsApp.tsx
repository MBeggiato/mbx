import { Code } from "lucide-react";

export default function ProjectsApp() {
  return (
    <div className="p-8 h-full overflow-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Featured Projects
      </h2>
      <div className="grid gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              E-Commerce Platform
            </h3>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            A full-featured e-commerce solution built with React, Node.js, and
            PostgreSQL. Features include user authentication, payment
            processing, and admin dashboard.
          </p>
          <div className="flex space-x-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
              React
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
              Node.js
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">
              PostgreSQL
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-300">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Task Management App
            </h3>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            A collaborative task management application with real-time updates,
            team collaboration features, and advanced project tracking
            capabilities.
          </p>
          <div className="flex space-x-3">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full font-medium">
              Vue.js
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium">
              Socket.io
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-medium">
              Redis
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-300">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              AI-Powered Analytics
            </h3>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            An intelligent analytics dashboard that uses machine learning to
            provide insights and predictions for business data.
          </p>
          <div className="flex space-x-3">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">
              Python
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
              TensorFlow
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full font-medium">
              Docker
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
