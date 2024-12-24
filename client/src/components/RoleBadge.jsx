import { Crown, Badge, User, Shield } from 'lucide-react';

export const RoleBadge = ({ role }) => {
  const badges = {
    admin: {
      class: "bg-gradient-to-r from-red-500 via-purple-500 to-blue-500",
      animation: "animate-shimmer-fast",
      border: "border-red-300",
      text: "Administrator"
    },
    manager: {
      class: "bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600",
      animation: "animate-shimmer-medium",
      border: "border-purple-300",
      text: "Manager"
    },
    agent: {
      class: "bg-gradient-to-r from-blue-400 via-teal-500 to-blue-600",
      animation: "animate-shimmer-medium",
      border: "border-blue-300",
      text: "Agent"
    },
    user: {
      class: "bg-gradient-to-r from-green-400 to-blue-400",
      animation: "animate-shimmer-slow",
      border: "border-green-300",
      text: "User"
    }
  };

  const badge = badges[role] || badges.user;

  return (
    <div className="relative overflow-hidden rounded-full">
      <div className={`
        ${badge.class} ${badge.animation}
        px-4 py-1 rounded-full border ${badge.border}
        text-white font-medium shadow-lg
        flex items-center gap-2
      `}>
        {role === 'admin' && <Crown className="w-4 h-4" />}
        {role === 'manager' && <Shield className="w-4 h-4" />}
        {role === 'agent' && <Badge className="w-4 h-4" />}
        {role === 'user' && <User className="w-4 h-4" />}
        {badge.text}
      </div>
    </div>
  );
}; 