'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '../marketplace-provider';

const passwordRules = [
  ['length', '8+ characters'],
  ['number', 'At least 1 number'],
  ['case', 'Upper & lowercase letters'],
];

export default function LoginPage() {
  const router = useRouter();
  const { signIn, register, resetPassword, authError } = useMarketplace();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'reset'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const passwordStatus = {
    length: password.length >= 8,
    number: /\d/.test(password),
    case: /[a-z]/.test(password) && /[A-Z]/.test(password),
  };

  function changeMode(nextMode) {
    setMode(nextMode);
    setError('');
    setNotice('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setNotice('');

    if (mode === 'reset') {
      if (password.length < 8) return setError('Use at least 8 characters for your new password.');
      const result = await resetPassword(email, password);
      if (!result.ok) return setError(result.error);
      setNotice('Password updated successfully. You can sign in now.');
      setMode('signin');
      setPassword('');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) return setError('Please enter your display name.');
      if (!passwordStatus.length || !passwordStatus.number || !passwordStatus.case) {
        return setError('Please satisfy all password security requirements.');
      }
      const result = await register({ name, email, password, remember });
      if (!result.ok) return setError(result.error || authError);
      router.push('/profile');
      return;
    }

    // Sign in mode
    const result = await signIn(email, password, remember);
    if (!result.ok) return setError(result.error || authError);
    router.push('/profile');
  }

  async function handleGoogleSignIn() {
    const result = await register({
      name: 'Google Collector',
      email: 'google.collector@example.com',
      password: 'GoogleDemoPassword99!',
      remember: true
    });
    if (!result.ok && result.error?.includes('already exists')) {
      await signIn('google.collector@example.com', 'GoogleDemoPassword99!', true);
    }
    router.push('/profile');
  }

  return (
    <div className="login-page-container fade-in">
      <div className="login-card">
        {/* Left Form Column */}
        <div className="login-form">
          <div className="auth-tabs">
            <button
              className={mode === 'signin' ? 'active' : ''}
              onClick={() => changeMode('signin')}
            >
              Sign In
            </button>
            <button
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => changeMode('signup')}
            >
              Create Account
            </button>
          </div>

          <p className="eyebrow">
            {mode === 'reset' ? 'Account Recovery' : mode === 'signup' ? 'Join the Network' : 'Welcome Back'}
          </p>

          <h1>
            {mode === 'reset'
              ? 'Reset your password.'
              : mode === 'signup'
              ? 'Start your Web3 collection.'
              : 'Sign in to your portfolio.'}
          </h1>

          <p className="login-intro">
            {mode === 'reset'
              ? 'Enter your account email and specify a new secure password.'
              : mode === 'signup'
              ? 'Join over 240,000 collectors and creators shaping digital culture.'
              : 'Access your favorite drops, saved items, and wallet transactions.'}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <label>
                Display Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  required
                />
              </label>
            )}

            <label>
              Email Address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              {mode === 'reset' ? 'New Password' : 'Password'}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                minLength={8}
                required
              />
            </label>

            {mode !== 'reset' && (
              <div className="form-meta">
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Keep me signed in
                </label>
                <button
                  type="button"
                  className="inline-button"
                  onClick={() => changeMode('reset')}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {(error || authError) && <p className="form-error">{error || authError}</p>}
            {notice && <p className="form-success">{notice}</p>}

            {(mode === 'signup' || mode === 'reset') && (
              <div className="password-rules">
                {passwordRules.map(([key, label]) => (
                  <span className={passwordStatus[key] ? 'valid' : ''} key={key}>
                    {passwordStatus[key] ? '✓' : '○'} {label}
                  </span>
                ))}
              </div>
            )}

            <button className="primary-button login-submit" type="submit">
              {mode === 'reset' ? 'Update Password' : mode === 'signup' ? 'Create Free Account' : 'Sign In'} <span>↗</span>
            </button>
          </form>

          {mode === 'signin' && (
            <>
              <div className="login-divider">
                <span>or</span>
              </div>
              <button className="social-button" type="button" onClick={handleGoogleSignIn}>
                ⚡ Continue with Google Demo Account
              </button>
            </>
          )}

          <p className="register-prompt">
            {mode === 'reset' ? (
              <button className="inline-button" onClick={() => changeMode('signin')}>
                ← Back to Sign In
              </button>
            ) : mode === 'signin' ? (
              <>
                New to NFT.com?{' '}
                <button className="inline-button" onClick={() => changeMode('signup')}>
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button className="inline-button" onClick={() => changeMode('signin')}>
                  Sign in here
                </button>
              </>
            )}
          </p>
        </div>

        {/* Right Art Graphic Column */}
        <div className="login-art">
          <img src="/assets/blue_illusion.webp" alt="Abstract Web3 Art" />
          <div className="login-art-caption">
            <span>Pak · Blue Illusion #707</span>
            <p>Own a piece of the digital future.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
