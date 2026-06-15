function Input({ label, type = 'text', error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-neutral-300">{label}</label>}
      <input
        type={type}
        className={`bg-neutral-800 border ${
          error ? 'border-red-500' : 'border-neutral-700'
        } rounded-md px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 transition`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

export default Input;