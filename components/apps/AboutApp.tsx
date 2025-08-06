export default function AboutApp() {
  return (
    <div className="p-8 space-y-6 h-full overflow-auto">
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-gradient-to-br from-blue-500 to-purple-600">
          <img
            src="https://avatars.githubusercontent.com/u/15524763?v=4"
            alt="Marcel Beggiato"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Marcel Beggiato
          </h2>
          <p className="text-xl text-gray-600">Full Stack Developer</p>
        </div>
      </div>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p className="text-lg">
          Welcome to my personal homepage! I'm a passionate developer with over
          5 years of experience in web development and software engineering.
        </p>
        <p className="text-lg">
          I specialize in modern web technologies and love creating
          user-friendly, performant applications that solve real-world problems.
        </p>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Skills & Technologies
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              "JavaScript",
              "React",
              "Next.js",
              "TypeScript",
              "Node.js",
              "C#",
              "Bun",
              "Deno",
              "Svelte",
              "SvelteKit",
              "Tailwind CSS",
              "CSS",
            ].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 rounded-full text-sm font-medium border border-gray-200 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
