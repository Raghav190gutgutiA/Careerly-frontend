import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    className="prose prose-sm max-w-none prose-slate dark:prose-invert prose-p:leading-relaxed prose-pre:bg-transparent prose-pre:p-0"
    components={{
      code({ inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        if (inline) {
          return (
            <code className="rounded bg-slate-200/70 px-1.5 py-0.5 text-[0.85em] dark:bg-slate-700/70" {...props}>
              {children}
            </code>
          );
        }
        return (
          <SyntaxHighlighter
            language={match?.[1] || 'text'}
            style={oneDark}
            customStyle={{ borderRadius: '0.75rem', fontSize: '0.85em', margin: 0 }}
            wrapLongLines
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        );
      },
      table({ children }) {
        return (
          <div className="overflow-x-auto">
            <table>{children}</table>
          </div>
        );
      },
      a({ children, ...props }) {
        return (
          <a {...props} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline dark:text-brand-400">
            {children}
          </a>
        );
      }
    }}
  >
    {content || ''}
  </ReactMarkdown>
);

export default MarkdownRenderer;
