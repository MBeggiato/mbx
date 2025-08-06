import { useState } from "react";
import { Gamepad2, Play, Trophy, Clock, Star } from "lucide-react";

const games = [
  {
    id: 1,
    name: "Mbx Solitaire",
    category: "Cards",
    rating: 4.5,
    playTime: "2h 34m",
    status: "installed",
    description: "Classic solitaire card game with beautiful animations",
  },
  {
    id: 2,
    name: "Minesweeper Classic",
    category: "Puzzle",
    rating: 4.2,
    playTime: "1h 18m",
    status: "installed",
    description: "The timeless logic puzzle game",
  },
  {
    id: 3,
    name: "Space Invaders",
    category: "Arcade",
    rating: 4.8,
    playTime: "45m",
    status: "available",
    description: "Defend Earth from invading alien forces",
  },
  {
    id: 4,
    name: "Chess Master",
    category: "Strategy",
    rating: 4.6,
    playTime: "3h 22m",
    status: "available",
    description: "Challenge the AI in this classic strategy game",
  },
  {
    id: 5,
    name: "Tetris Classic",
    category: "Puzzle",
    rating: 4.9,
    playTime: "5h 12m",
    status: "installed",
    description: "The legendary falling blocks puzzle game",
  },
  {
    id: 6,
    name: "Pinball Dreams",
    category: "Arcade",
    rating: 4.3,
    playTime: "1h 45m",
    status: "available",
    description: "Experience the thrill of digital pinball",
  },
];

const achievements = [
  { name: "First Win", game: "Mbx Solitaire", unlocked: true },
  { name: "Speed Demon", game: "Minesweeper", unlocked: true },
  { name: "High Score", game: "Tetris Classic", unlocked: false },
  { name: "Chess Grandmaster", game: "Chess Master", unlocked: false },
];

export default function GamesApp() {
  const [activeTab, setActiveTab] = useState<
    "library" | "store" | "achievements"
  >("library");

  const installedGames = games.filter((game) => game.status === "installed");
  const availableGames = games.filter((game) => game.status === "available");

  const playGame = (gameName: string) => {
    alert(`Launching ${gameName}...`);
  };

  const installGame = (gameName: string) => {
    alert(`Installing ${gameName}...`);
  };

  return (
    <div className="p-6 h-full bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden flex flex-col">
      <div className="flex items-center space-x-2 mb-6">
        <Gamepad2 className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-900">Game Center</h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-200 rounded-lg p-1">
        {(["library", "store", "achievements"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {/* Library Tab */}
        {activeTab === "library" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Games
              </h3>
              <span className="text-sm text-gray-500">
                {installedGames.length} installed
              </span>
            </div>

            <div className="grid gap-4">
              {installedGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Gamepad2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {game.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {game.category}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {game.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">
                            {game.rating}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {game.playTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => playGame(game.name)}
                      className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Play</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Store Tab */}
        {activeTab === "store" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Game Store
              </h3>
              <span className="text-sm text-gray-500">
                {availableGames.length} available
              </span>
            </div>

            <div className="grid gap-4">
              {availableGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Gamepad2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {game.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {game.category}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {game.description}
                      </p>
                      <div className="flex items-center space-x-1 mt-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">
                          {game.rating}
                        </span>
                        <span className="text-sm text-gray-400">• Free</span>
                      </div>
                    </div>
                    <button
                      onClick={() => installGame(game.name)}
                      className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Install
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Achievements
              </h3>
              <span className="text-sm text-gray-500">
                {achievements.filter((a) => a.unlocked).length} of{" "}
                {achievements.length} unlocked
              </span>
            </div>

            <div className="grid gap-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 ${
                    !achievement.unlocked ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.unlocked
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {achievement.game}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <div className="text-green-600 font-medium text-sm">
                        Unlocked
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
