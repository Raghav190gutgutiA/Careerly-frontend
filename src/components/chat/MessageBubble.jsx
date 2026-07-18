import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiRefreshCw, FiThumbsUp, FiThumbsDown, FiShare2, FiDownload, FiUser } from 'react-icons/fi';
import MarkdownRenderer from './MarkdownRenderer.jsx';
import { useChat } from '../../hooks/useChat.js';
import { useToast } from '../../hooks/useToast.js';
import { useJobDescriptionGate } from '../../hooks/useJobDescriptionGate.js';
import JobRecommendationList from '../features/JobRecommendationList.jsx';
import CourseRecommendationList from '../features/CourseRecommendationList.jsx';
import RoadmapTimeline from '../features/RoadmapTimeline.jsx';
import InterviewQuestionBank from '../features/InterviewQuestionBank.jsx';
import ATSReport from '../features/ATSReport.jsx';
import CoverLetterView from '../features/CoverLetterView.jsx';
import PrepPlanView from '../features/PrepPlanView.jsx';

const FeaturePanel = ({ agentType, payload }) => {
  if (!payload) return null;
  switch (agentType) {
    case 'job_recommendation':
      return payload.jobs ? <JobRecommendationList jobs={payload.jobs} /> : null;
    case 'course_recommendation':
      return payload.courses ? <CourseRecommendationList courses={payload.courses} /> : null;
    case 'career_roadmap':
      return <RoadmapTimeline data={payload} />;
    case 'interview_prep':
      return <InterviewQuestionBank data={payload} />;
    case 'ats_review':
      return <ATSReport data={payload} />;
    case 'cover_letter':
      return <CoverLetterView data={payload} />;
    case 'job_prep_planner':
      return <PrepPlanView data={payload} />;
    default:
      return null;
  }
};

const ActionButton = ({ icon: Icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-slate-200/70 dark:hover:bg-slate-700/70 ${
      active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
    }`}
  >
    <Icon className="h-3.5 w-3.5" />
  </button>
);

const MessageBubble = ({ message }) => {
  const { sendMessage, runQuickAction, likeMessage } = useChat();
  const { addToast } = useToast();
  const { requestJobContext } = useJobDescriptionGate();
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const gated = message.structuredPayload?.requiresJobDescription;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: message.content });
      } catch {
        /* user cancelled the native share sheet */
      }
    } else {
      await navigator.clipboard.writeText(message.content);
      addToast('Copied to clipboard for sharing', 'success');
    }
  };

  const handleRegenerate = () => {
    if (message.agentType && message.agentType !== 'general_chat') {
      runQuickAction(message.agentType);
    } else {
      sendMessage('Please try that again with a fresh answer.');
    }
  };

  const handleProvideDetails = async () => {
    const context = await requestJobContext(message.structuredPayload.gatedIntent);
    if (context) runQuickAction(message.structuredPayload.gatedIntent, context);
  };

  const pdfUrl = message.structuredPayload?.pdfUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col gap-1.5 ${isUser ? 'items-end self-end' : 'items-start self-start'} max-w-[92%] sm:max-w-[85%]`}
    >
      <div
        className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {!isUser && (
          <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
            AI
          </div>
        )}
        {isUser && (
          <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-300 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            <FiUser className="h-3.5 w-3.5" />
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'rounded-br-sm bg-brand-600 text-white'
              : 'rounded-bl-sm bg-slate-200/70 text-slate-900 dark:bg-slate-800/70 dark:text-slate-100'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
          {gated && (
            <button onClick={handleProvideDetails} className="btn-primary mt-3 !py-1.5 !text-xs">
              Provide role or job description
            </button>
          )}
        </div>
      </div>

      {!isUser && <FeaturePanel agentType={message.agentType} payload={message.structuredPayload} />}

      {!isUser && !gated && (
        <div className="ml-9 flex items-center gap-0.5">
          <ActionButton icon={copied ? FiCheck : FiCopy} label="Copy" onClick={handleCopy} active={copied} />
          <ActionButton icon={FiRefreshCw} label="Regenerate" onClick={handleRegenerate} />
          <ActionButton
            icon={FiThumbsUp}
            label="Like"
            active={message.liked === true}
            onClick={() => likeMessage(message._id, message.liked === true ? null : true)}
          />
          <ActionButton
            icon={FiThumbsDown}
            label="Dislike"
            active={message.liked === false}
            onClick={() => likeMessage(message._id, message.liked === false ? null : false)}
          />
          <ActionButton icon={FiShare2} label="Share" onClick={handleShare} />
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Download PDF"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-600 dark:hover:bg-slate-700/70 dark:hover:text-slate-300"
            >
              <FiDownload className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MessageBubble;
