import Link from "next/link";
import { FileText, Search, Tag, Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{" "}
              <span className="text-blue-600 dark:text-blue-400">Orban Labs</span>{" "}
              Notes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              A powerful note-taking application with advanced search and tagging capabilities. 
              Organize your thoughts, ideas, and knowledge efficiently.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/notes"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <FileText className="h-5 w-5" />
                Browse Notes
              </Link>
              <Link
                href="/notes"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create Note
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Powerful Search
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Find your notes instantly with full-text search across titles, content, and tags.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Tag className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Smart Tagging
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organize your notes with tags and filter by categories for better organization.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Clean Interface
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enjoy a distraction-free writing experience with a modern, responsive design.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Access your notes at{" "}
              <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm font-mono">
                http://localhost:3000/notes
              </code>
            </p>
            <Link
              href="/notes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4" />
              Go to Notes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
