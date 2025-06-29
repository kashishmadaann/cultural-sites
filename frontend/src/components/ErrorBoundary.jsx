import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-teal-100 p-6 flex items-center justify-center">
          <div className="max-w-2xl w-full mx-auto bg-white/90 p-8 rounded-3xl shadow-2xl border-2 border-rose-200">
            <div className="flex items-center mb-6">
              <svg className="w-10 h-10 text-rose-500 mr-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="#f43f5e" />
                <path stroke="#fff" strokeWidth="2.5" strokeLinecap="round" d="M12 8v4m0 4h.01" />
              </svg>
              <h1 className="text-3xl font-extrabold text-rose-600 tracking-wide">Oops! Something Broke</h1>
            </div>
            <p className="text-slate-700 mb-4 text-lg">
              {this.state.error?.message || "An unexpected error occurred. Please try reloading the page."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 text-white font-semibold shadow hover:from-teal-600 hover:to-emerald-500 transition-all"
            >
              Reload Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="bg-slate-100/80 border border-amber-200 p-4 rounded-xl overflow-auto text-xs mt-6 text-slate-800">
                {this.state.errorInfo?.componentStack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;