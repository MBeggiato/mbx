import { Mail, Settings, Code, User } from "lucide-react";

export default function ContactApp() {
  return (
    <div className="p-8 h-full overflow-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
      <div className="space-y-6">
        <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">Email</p>
            <p className="text-gray-600 text-lg">marcel@mbx.sh</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Code className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">GitHub</p>
            <p className="text-gray-600 text-lg">github.com/MBeggiato</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-lg mb-2">
                Available for New Opportunities!
              </p>
              <p className="text-gray-700 leading-relaxed">
                I'm currently open to new projects and collaborations. Whether
                you're looking for a full-time developer or need help with a
                specific project, I'd love to hear from you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
