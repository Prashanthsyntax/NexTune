function Button({ children, loading, className = '', ...props }) {
  return (
    <button
      disabled={loading}
      className={`bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-full py-2.5 transition ${className}`}
      {...props}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
}

export default Button;