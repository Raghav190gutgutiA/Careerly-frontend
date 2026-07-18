import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiPaperclip } from 'react-icons/fi';

const MessageInput = ({ onSend, onAttach, disabled }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setValue(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  };

  const submit = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="glass-panel flex items-end gap-2 rounded-2xl p-2">
      {onAttach && (
        <button
          type="button"
          onClick={onAttach}
          disabled={disabled}
          aria-label="Attach resume"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-200/60 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-700/60"
        >
          <FiPaperclip className="h-4.5 w-4.5" />
        </button>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder="Message Careerly..."
        className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={submit}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiSend className="h-4 w-4" />
      </motion.button>
    </div>
  );
};

export default MessageInput;
