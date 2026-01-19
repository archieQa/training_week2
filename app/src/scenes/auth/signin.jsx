import React, { useState } from "react"
import toast from "react-hot-toast"
import validator from "validator"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { FiEye, FiEyeOff } from "react-icons/fi"

import Loader from "../../components/loader"

import api from "../../services/api"
import store from "@/services/store"

export default function Signin() {
  const [email, setEmail] = useState("")
  const [userExists, setUserExists] = useState(null)
  const [forgotPassword, setForgotPassword] = useState(false)

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 p-12 items-center justify-center border-r border-gray-200">
        <div className="max-w-lg">
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">EventHub</h1>
            <p className="text-gray-600">Your Event Management Platform</p>
          </div>

          {!email && !forgotPassword && (
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">📚 Learning Point: Smart Auth Pattern</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  This is a <strong>single-form authentication</strong> pattern. Instead of separate signup/signin pages, we check the email first.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 text-sm font-medium flex-shrink-0 mt-0.5">1.</span>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">User enters email</p>
                    <p className="text-xs text-gray-500 mt-1">We don't ask "Do you have an account?" - we figure it out</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-gray-400 text-sm font-medium flex-shrink-0 mt-0.5">2.</span>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Check if email exists</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Backend: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">POST /user/check-email</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-gray-400 text-sm font-medium flex-shrink-0 mt-0.5">3.</span>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Show correct form</p>
                    <p className="text-xs text-gray-500 mt-1">Password field (signin) or name + password (signup)</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-2">Why this matters:</p>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Reduces support tickets by ~40%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Better conversion rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Used by: Slack, Linear, Notion</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {!userExists && email && !forgotPassword && (
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">📚 Learning Point: Frictionless Signup</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Minimize form fields and remove unnecessary friction to increase conversion rates.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 text-sm font-medium flex-shrink-0 mt-0.5">1.</span>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">No "Confirm Password"</p>
                    <p className="text-xs text-gray-500 mt-1">Users can reset if they make a typo. Better conversion over perfect prevention.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-gray-400 text-sm font-medium flex-shrink-0 mt-0.5">2.</span>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Show password toggle</p>
                    <p className="text-xs text-gray-500 mt-1">Lets users verify their password without needing a confirmation field</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-gray-400 text-sm font-medium flex-shrink-0 mt-0.5">3.</span>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Only essential fields</p>
                    <p className="text-xs text-gray-500 mt-1">Email, name, password. That's it. Collect more later if needed.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-2">Impact:</p>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Reduces signup abandonment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Faster time to value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Mobile-friendly (less typing)</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {userExists && email && !forgotPassword && (
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">📚 Welcome Back!</h3>
                <p className="text-sm text-gray-600 leading-relaxed">We found your account. Just enter your password to continue.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 text-sm font-medium flex-shrink-0 mt-0.5">💡</span>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Email is pre-filled</p>
                    <p className="text-xs text-gray-500 mt-1">We already know you have an account, so we skip the "new user" flow</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-gray-400 text-sm font-medium flex-shrink-0 mt-0.5">🔒</span>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Forgot password?</p>
                    <p className="text-xs text-gray-500 mt-1">Reset link available if needed - no need to remember which email you used</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {forgotPassword && (
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">📚 Password Reset Flow</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Simple and secure password recovery via email.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 text-sm font-medium flex-shrink-0 mt-0.5">1.</span>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Send reset email</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Backend: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">POST /user/forgot_password</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-gray-400 text-sm font-medium flex-shrink-0 mt-0.5">2.</span>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Email contains secure token</p>
                    <p className="text-xs text-gray-500 mt-1">One-time use, expires after 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-gray-400 text-sm font-medium flex-shrink-0 mt-0.5">3.</span>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">User sets new password</p>
                    <p className="text-xs text-gray-500 mt-1">Token is consumed, old password is replaced</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {!email && !forgotPassword && <EmailCheck setEmail={setEmail} setUserExists={setUserExists} />}
          {userExists && email && !forgotPassword && <SignIn email={email} setForgotPassword={setForgotPassword} />}
          {!userExists && email && !forgotPassword && <SignUp email={email} />}
          {forgotPassword && <ForgotPassword setForgotPassword={setForgotPassword} email={email} />}
        </div>
      </div>
    </div>
  )
}

const EmailCheck = ({ setEmail, setUserExists }) => {
  const [loading, setLoading] = useState(false)
  const [email, setEmailValue] = useState("")
  const [error, setError] = useState("")
  const [searchParams] = useSearchParams()

  const handleSubmit = async e => {
    try {
      e.preventDefault()
      if (!email) return setError("Email is required")
      if (!validator.isEmail(email)) return setError("Invalid email address")
      if (typeof window !== "undefined" && window.trackSignupStart) window.trackSignupStart()

      setLoading(true)

      const { exists, isGoogleUser } = await api.post("/user/check-email", { email })
      if (isGoogleUser) return toast.error("This email is associated with a Google account. Please sign in with Google.")
      setEmail(email)
      setUserExists(exists)
    } catch (e) {
      if (e.code === "INVITATION_NOT_ACCEPTED") return toast.error(e.code)
      toast.error(e.code)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">

      <div className="lg:hidden mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">EventHub</h1>
        <p className="text-sm text-gray-500">Your Event Management Platform</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">Welcome</h2>
        <p className="text-sm text-gray-600">Enter your email to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-700 mb-2 block">Email</label>
          <input
            id="email-input"
            className="w-full px-3 py-2 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
            name="email"
            type="email"
            value={email}
            onChange={e => {
              setEmailValue(e.target.value)
              setError("")
            }}
            onFocus={() => {
              if (typeof window !== "undefined" && window.trackSignupStart) window.trackSignupStart()
            }}
            placeholder="you@example.com"
          />
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        </div>

        <button id="email-submit" className="w-full py-2 rounded text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50" type="submit" disabled={loading}>
          {loading ? <Loader size="small" color="white" /> : "Continue"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <a href="https://waalego.selego.co/terms-privacy" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="https://waalego.selego.co/terms-privacy" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline">
            Privacy
          </a>
        </p>
      </div>
    </div>
  )
}

const SignIn = ({ email, setForgotPassword }) => {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [seePassword, setSeePassword] = useState(false)

  const { setUser } = store()

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get("redirect")

  const handleSubmit = async e => {
    try {
      e.preventDefault()
      if (!password) return setError("Password is required")
      setLoading(true)

      const { user, token } = await api.post(`/user/signin`, { email, password })
      if (token) api.setToken(token)
      if (user) setUser(user)

      if (typeof window !== "undefined" && window.onSigninSuccess) window.onSigninSuccess("email")

      if (redirect) navigate(redirect)
      else navigate("/")
    } catch (e) {
      toast.error(e.code)
    }
    setLoading(false)
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Welcome back</h1>
        <p className="text-sm text-gray-600">Enter your password to continue</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-700 mb-2 block">Email</label>
          <input className="w-full px-3 py-2 rounded bg-gray-50 border border-gray-300 text-gray-600 text-sm" name="email" type="email" value={email} disabled />
        </div>
        <div>
          <label className="text-sm text-gray-700 mb-2 block">Password</label>
          <div className="relative">
            <input
              className="w-full px-3 py-2 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
              name="password"
              type={seePassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button type="button" onClick={() => setSeePassword(!seePassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900">
              {seePassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          <div className="text-right mt-2">
            <button type="button" onClick={() => setForgotPassword(true)} className="text-xs text-gray-600 hover:text-gray-900">
              Forgot password?
            </button>
          </div>
        </div>
        <button className="w-full py-2 rounded text-sm font-medium text-white bg-gray-900 hover:bg-gray-800" type="submit">
          {loading ? <Loader size="small" color="white" /> : "Sign in"}
        </button>
      </div>
    </form>
  )
}

const ForgotPassword = ({ setForgotPassword, email }) => {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [emailValue, setEmailValue] = useState(email || "")
  const [error, setError] = useState("")

  const validateEmail = value => {
    if (!validator.isEmail(value)) {
      return "Invalid email address"
    }
    return ""
  }

  const handleSubmit = async e => {
    try {
      e.preventDefault()
      const validationError = validateEmail(emailValue)
      if (validationError) {
        setError(validationError)
        return
      }

      setLoading(true)
      await api.post("/user/forgot_password", { email: emailValue })
      toast.success("Password recovery link has been sent to your email")
      setDone(true)
    } catch (e) {
      toast.error(e.code)
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Check your email</h1>
          <p className="text-sm text-gray-600">We've sent a password reset link to your email.</p>
        </div>
        <button onClick={() => setForgotPassword(false)} className="w-full py-2 rounded text-sm font-medium text-white bg-gray-900 hover:bg-gray-800">
          Back to Sign In
        </button>
      </div>
    )
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Reset password</h1>
        <p className="text-sm text-gray-600">Enter your email to receive a reset link</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-700 mb-2 block">Email</label>
          <input
            className="w-full px-3 py-2 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
            name="email"
            type="email"
            value={emailValue}
            onChange={e => {
              setEmailValue(e.target.value)
              setError("")
            }}
            placeholder="you@example.com"
          />
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        </div>
        <button className="w-full py-2 rounded text-sm font-medium text-white bg-gray-900 hover:bg-gray-800" type="submit">
          {loading ? <Loader size="small" color="white" /> : "Send Reset Link"}
        </button>
        <button type="button" onClick={() => setForgotPassword(false)} className="w-full py-2 rounded text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">
          Back to Sign In
        </button>
      </div>
    </form>
  )
}

const SignUp = ({ email }) => {
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState({ email, password: "", name: "" })
  const [errors, setErrors] = useState({ password: "", name: "" })
  const [seePassword, setSeePassword] = useState(false)
  const navigate = useNavigate()

  const { setUser } = store()

  const handleChange = e => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
    setErrors({ ...errors, [name]: "" })
  }

  const handleSubmit = async e => {
    try {
      e.preventDefault()
      if (!values.name) return setErrors({ ...errors, name: "Name is required" })
      if (!values.password) return setErrors({ ...errors, password: "Password is required" })
      setLoading(true)

      const { user, token } = await api.post("/user/signup", values)

      if (token) api.setToken(token)
      if (user) setUser(user)

      navigate("/")
      toast.success("Account created successfully!")
    } catch (e) {
      toast.error(e.code)
    }
    setLoading(false)
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Create account</h1>
        <p className="text-sm text-gray-600">Fill in your details to get started</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-700 mb-2 block">Email</label>
          <input className="w-full px-3 py-2 rounded bg-gray-50 border border-gray-300 text-gray-600 text-sm" name="email" type="email" value={email} disabled />
        </div>
        <div>
          <label className="text-sm text-gray-700 mb-2 block">Name</label>
          <input
            className="w-full px-3 py-2 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            placeholder="Your name"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-700 mb-2 block">Password</label>
          <div className="relative">
            <input
              className="w-full px-3 py-2 rounded border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
              name="password"
              type={seePassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange}
              placeholder="Choose a password"
            />
            <button type="button" onClick={() => setSeePassword(!seePassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900">
              {seePassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
        </div>
        <button className="w-full py-2 rounded text-sm font-medium text-white bg-gray-900 hover:bg-gray-800" type="submit">
          {loading ? <Loader size="small" color="white" /> : "Create Account"}
        </button>
      </div>
    </form>
  )
}
