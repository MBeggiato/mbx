import React, { useState, useEffect } from "react";

const SecretApp: React.FC = () => {
  const [revealedSecrets, setRevealedSecrets] = useState<string[]>([]);
  const [currentSecret, setCurrentSecret] = useState(0);

  const secrets = [
    "🎉 Congratulations! You found the secret window!",
    "🕵️ Here are some hidden easter eggs you might have missed:",
    "⌨️ Try the Konami Code: ↑↑↓↓←→←→BA",
    "⌨️ Press Ctrl+Alt+D for a desktop flip",
    "🖱️ Click the taskbar logo 15 times",
    "🕐 Visit at different times of day for special messages",
    "🤖 Check the console for Matrix rain when you activate Konami code",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentSecret < secrets.length - 1) {
        setCurrentSecret((prev) => prev + 1);
        setRevealedSecrets((prev) => [...prev, secrets[currentSecret]]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentSecret, secrets]);

  return (
    <div className="p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white min-h-full">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
          🔍 Secret Developer Console 🔍
        </h1>
        <p className="text-gray-300">You've unlocked the hidden secrets!</p>
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto">
        {revealedSecrets.map((secret, index) => (
          <div
            key={index}
            className="p-3 bg-black/30 rounded-lg border border-cyan-500/30 animate-pulse"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="font-mono text-sm text-cyan-300">
              [{new Date().toLocaleTimeString()}] SECRET_LOG:
            </div>
            <div className="mt-1">{secret}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          Created with ❤️ by a developer who loves easter eggs
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Keep exploring - there might be more secrets hidden! 🤫
        </p>
      </div>
    </div>
  );
};

export default SecretApp;
