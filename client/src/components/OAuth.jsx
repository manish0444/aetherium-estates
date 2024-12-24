import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = '/api/auth/google';
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
    >
      <img className="h-5 w-5" src="/google.svg" alt="Google logo" />
      <span>Continue with Google</span>
    </button>
  );
}
