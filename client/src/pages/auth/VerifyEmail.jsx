import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../redux/user/userSlice';

export default function VerifyEmail() {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadSession = () => {
      // Try to get session data from location state first
      const stateData = location.state;
      console.log('Location state:', stateData);

      if (stateData?.email && stateData?.sessionId) {
        console.log('Using session from location state');
        setSessionData(stateData);
        return true;
      }

      // If not in location state, try localStorage
      const storedSession = localStorage.getItem('verificationSession');
      console.log('Stored session:', storedSession);
      
      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession);
          // Check if session is less than 10 minutes old
          if (Date.now() - parsedSession.timestamp < 10 * 60 * 1000) {
            console.log('Using session from localStorage');
            setSessionData(parsedSession);
            return true;
          }
          console.log('Session expired in localStorage');
          localStorage.removeItem('verificationSession');
        } catch (error) {
          console.error('Error parsing stored session:', error);
          localStorage.removeItem('verificationSession');
        }
      }

      return false;
    };

    if (!loadSession()) {
      console.log('No valid session found, redirecting to signup');
      navigate('/sign-up');
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting verification with session data:', sessionData);
    
    if (!sessionData?.email || !sessionData?.sessionId) {
      console.log('Missing session data:', sessionData);
      setError('Session expired. Please sign up again.');
      navigate('/sign-up');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check session status first
      const statusRes = await fetch('/api/auth/session-status', {
        credentials: 'include'
      });
      const statusData = await statusRes.json();
      console.log('Session status:', statusData);

      const payload = {
        email: sessionData.email,
        code: verificationCode,
        sessionId: sessionData.sessionId
      };
      console.log('Sending verification request:', payload);

      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Verification response:', data);

      if (!res.ok) {
        if (res.status === 400 && data.message.includes('Session expired')) {
          localStorage.removeItem('verificationSession');
          navigate('/sign-up');
        }
        throw new Error(data.message || 'Verification failed');
      }

      if (!data.success) {
        setError(data.message || 'Verification failed. Please try again.');
        return;
      }

      // Clear verification session
      localStorage.removeItem('verificationSession');
      
      dispatch(signInSuccess(data.user));
      navigate('/');
      
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.message || 'Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!sessionData?.email || !sessionData?.sessionId) {
      setError('Session expired. Please sign up again.');
      navigate('/sign-up');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        email: sessionData.email,
        sessionId: sessionData.sessionId
      };
      console.log('Sending resend request:', payload);

      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Resend response:', data);

      if (!res.ok) {
        if (res.status === 400 && data.message.includes('Session expired')) {
          localStorage.removeItem('verificationSession');
          navigate('/sign-up');
        }
        throw new Error(data.message || 'Failed to resend code');
      }

      if (!data.success) {
        setError(data.message || 'Failed to resend code.');
        return;
      }

      // Update session with new data if provided
      if (data.sessionId) {
        const newSessionData = {
          ...sessionData,
          sessionId: data.sessionId,
          timestamp: Date.now()
        };
        setSessionData(newSessionData);
        localStorage.setItem('verificationSession', JSON.stringify(newSessionData));
      }

      alert('New verification code sent!');
    } catch (error) {
      console.error('Resend error:', error);
      setError(error.message || 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!sessionData) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We sent a verification code to {sessionData.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="code" className="sr-only">
              Verification Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter verification code"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
