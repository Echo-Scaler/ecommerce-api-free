import React, { useState, useEffect } from 'react';
import { LEARN_LESSONS } from '../../data/learn-lessons';
import { executeApiRequest } from '../../lib/api-client';
import { ApiResponseExecution } from '../../types/api';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BookOpen, 
  Code2, 
  BrainCircuit, 
  CheckCircle2, 
  Play, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  Award
} from 'lucide-react';

interface LearnPageProps {
  onNavigateToConsole?: (endpointId?: string) => void;
}

const STORAGE_PROGRESS_KEY = 'ecommerce_api_learn_completed_lessons';

export const LearnPage: React.FC<LearnPageProps> = ({ onNavigateToConsole }) => {
  const { t, isMyanmar } = useLanguage();
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LEARN_LESSONS[0].id);
  const [activeTab, setActiveTab] = useState<'theory' | 'exercise' | 'quiz'>('theory');
  
  // Progress tracking in localStorage
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROGRESS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Exercise Runner State
  const [exerciseToken, setExerciseToken] = useState<string>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.customer-token');
  const [isRunningExercise, setIsRunningExercise] = useState<boolean>(false);
  const [exerciseResponse, setExerciseResponse] = useState<ApiResponseExecution | null>(null);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const currentLesson = LEARN_LESSONS.find((l) => l.id === selectedLessonId) || LEARN_LESSONS[0];
  const currentIndex = LEARN_LESSONS.findIndex((l) => l.id === currentLesson.id);
  const isLessonCompleted = completedLessonIds.includes(currentLesson.id);

  // Reset exercise and quiz when switching lessons
  useEffect(() => {
    setActiveTab('theory');
    setExerciseResponse(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    document.querySelector('.app-main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedLessonId]);

  const toggleCompleteLesson = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      let updated: string[];
      if (prev.includes(lessonId)) {
        updated = prev.filter((id) => id !== lessonId);
      } else {
        updated = [...prev, lessonId];
      }
      try {
        localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save learn progress', e);
      }
      return updated;
    });
  };

  const handleRunExercise = async () => {
    setIsRunningExercise(true);
    setExerciseResponse(null);
    try {
      const response = await executeApiRequest({
        path: currentLesson.exercise.path,
        method: currentLesson.exercise.method,
        queryParams: currentLesson.exercise.defaultQueryParams,
        body: currentLesson.exercise.defaultBody,
        bearerToken: currentLesson.exercise.authRequired ? exerciseToken : undefined
      });
      setExerciseResponse(response);
    } catch (err: any) {
      setExerciseResponse({
        status: 500,
        statusText: 'Client Execution Error',
        durationMs: 40,
        headers: {},
        data: { success: false, error: err.message || 'Execution failed' },
        timestamp: new Date().toISOString(),
        isError: true
      });
    } finally {
      setIsRunningExercise(false);
    }
  };

  const handleCopyResponse = () => {
    if (exerciseResponse) {
      navigator.clipboard.writeText(JSON.stringify(exerciseResponse.data, null, 2));
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    currentLesson.quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: currentLesson.quiz.questions.length,
      passed: correct === currentLesson.quiz.questions.length
    };
  };

  const scoreResult = calculateScore();
  const progressPercent = Math.round((completedLessonIds.length / LEARN_LESSONS.length) * 100);

  return (
    <div className="learn-page-wrapper">
      {/* Top Banner & Progress */}
      <div className="learn-hero-banner">
        <div className="learn-hero-left">
          <div className="learn-hero-pill">
            <Sparkles size={14} />
            <span>{t('learnHeroBadge')}</span>
          </div>
          <h1 className="learn-hero-title">{t('learnHeroTitle')}</h1>
          <p className="learn-hero-subtitle">{t('learnHeroSubtitle')}</p>
        </div>

        <div className="learn-hero-progress-card">
          <div className="progress-card-top">
            <span className="progress-card-label">{t('learnProgressLabel')}</span>
            <span className="progress-card-badge">{completedLessonIds.length} / {LEARN_LESSONS.length} {isMyanmar ? 'ပြီးစီးပါပြီ' : 'Completed'}</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="progress-card-footer">
            <span>{progressPercent}% {isMyanmar ? 'တတ်မြောက်ပြီး' : 'Mastered'}</span>
            {progressPercent === 100 && (
              <span className="all-completed-badge">
                <Award size={14} /> {isMyanmar ? 'လက်မှတ်ရရှိပြီး' : 'Certified'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Learning Workspace Layout */}
      <div className="learn-workspace-layout">
        {/* Left Sidebar: Modules & Lessons */}
        <aside className="learn-modules-sidebar">
          <div className="modules-sidebar-header">
            <h3>{t('learnCurriculumTitle')}</h3>
            <span className="sidebar-count">{LEARN_LESSONS.length} {isMyanmar ? 'သင်ခန်းစာ' : 'Lessons'}</span>
          </div>

          <nav className="lesson-nav-list">
            {LEARN_LESSONS.map((lesson) => {
              const isSelected = lesson.id === selectedLessonId;
              const isDone = completedLessonIds.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`lesson-nav-item ${isSelected ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                >
                  <div className="lesson-item-icon-col">
                    <span className="lesson-emoji">{lesson.icon}</span>
                  </div>
                  <div className="lesson-item-text-col">
                    <div className="lesson-item-meta">
                      <span className="module-tag">{isMyanmar ? `မော်ဂျူး ${lesson.moduleNum}` : `Module ${lesson.moduleNum}`}</span>
                      <span className="time-tag"><Clock size={11} /> {lesson.durationMin}{isMyanmar ? 'မိနစ်' : 'm'}</span>
                    </div>
                    <div className="lesson-item-title">{lesson.title}</div>
                  </div>
                  <div className="lesson-item-status-col">
                    {isDone ? (
                      <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-100" />
                    ) : (
                      <div className="lesson-unread-dot" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Content Area: Lesson Viewer */}
        <main className="learn-content-main">
          {/* Lesson Header */}
          <div className="lesson-view-header">
            <div className="lesson-view-meta">
              <span className="module-pill">{isMyanmar ? `မော်ဂျူး ${currentLesson.moduleNum} / ${LEARN_LESSONS.length}` : `Module ${currentLesson.moduleNum} of ${LEARN_LESSONS.length}`}</span>
              <span className="duration-pill"><Clock size={12} /> ~{currentLesson.durationMin} {isMyanmar ? 'မိနစ်' : 'minutes'}</span>
              {isLessonCompleted && (
                <span className="completed-pill">
                  <CheckCircle2 size={13} /> {isMyanmar ? 'ပြီးစီးပြီး' : 'Completed'}
                </span>
              )}
            </div>
            <h2 className="lesson-view-title">{currentLesson.title}</h2>
            <p className="lesson-view-subtitle">{currentLesson.subtitle}</p>

            {/* Interactive Tabs */}
            <div className="lesson-tabs-bar">
              <button
                type="button"
                className={`lesson-tab-btn ${activeTab === 'theory' ? 'active' : ''}`}
                onClick={() => setActiveTab('theory')}
              >
                <BookOpen size={16} />
                <span>{t('learnTabTheory')}</span>
              </button>
              <button
                type="button"
                className={`lesson-tab-btn ${activeTab === 'exercise' ? 'active' : ''}`}
                onClick={() => setActiveTab('exercise')}
              >
                <Code2 size={16} />
                <span>{t('learnTabExercise')}</span>
              </button>
              <button
                type="button"
                className={`lesson-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => setActiveTab('quiz')}
              >
                <BrainCircuit size={16} />
                <span>{isMyanmar ? `🧠 ဉာဏ်စမ်း စစ်ဆေးမှု (${currentLesson.quiz.questions.length})` : `🧠 Knowledge Quiz (${currentLesson.quiz.questions.length})`}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Theory */}
          {activeTab === 'theory' && (
            <div className="lesson-tab-content theory-content">
              <div className="theory-summary-box">
                <div className="summary-icon"><Info size={20} /></div>
                <div className="summary-text">{currentLesson.theory.summary}</div>
              </div>

              {currentLesson.theory.sections.map((sec, idx) => (
                <section key={idx} className="theory-section">
                  <h3 className="theory-section-heading">{sec.heading}</h3>
                  <p className="theory-section-text">{sec.content}</p>

                  {sec.bulletPoints && (
                    <ul className="theory-bullet-list">
                      {sec.bulletPoints.map((pt, pIdx) => (
                        <li key={pIdx}>
                          <span className="bullet-dot" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.codeSnippet && (
                    <div className="theory-code-box">
                      <div className="code-box-header">
                        <span className="code-lang-tag">{sec.codeSnippet.language}</span>
                      </div>
                      <pre className="code-pre">
                        <code>{sec.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {sec.callout && (
                    <div className={`theory-callout callout-${sec.callout.type}`}>
                      <div className="callout-icon">
                        {sec.callout.type === 'tip' ? <Sparkles size={16} /> : <AlertTriangle size={16} />}
                      </div>
                      <div className="callout-text">{sec.callout.text}</div>
                    </div>
                  )}
                </section>
              ))}

              <div className="tab-bottom-cta">
                <button
                  type="button"
                  className="btn-next-tab"
                  onClick={() => setActiveTab('exercise')}
                >
                  <span>{t('learnBtnReadyExercise')}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Live Exercise */}
          {activeTab === 'exercise' && (
            <div className="lesson-tab-content exercise-content">
              <div className="exercise-card">
                <div className="exercise-header">
                  <div className="exercise-title-row">
                    <span className="exercise-badge">{t('learnChallengeTitle')}</span>
                    <h3 className="exercise-title">{currentLesson.exercise.title}</h3>
                  </div>
                  <div className="exercise-goal-box">
                    <strong>{t('learnGoalLabel')}</strong> {currentLesson.exercise.goal}
                  </div>
                </div>

                <p className="exercise-desc">{currentLesson.exercise.description}</p>

                {/* Request Bar */}
                <div className="exercise-request-bar">
                  <span className={`method-badge method-${currentLesson.exercise.method.toLowerCase()}`}>
                    {currentLesson.exercise.method}
                  </span>
                  <code className="exercise-path-text">{currentLesson.exercise.path}</code>
                </div>

                {/* Parameter / Header Inputs */}
                {currentLesson.exercise.authRequired && (
                  <div className="exercise-input-group">
                    <label className="exercise-input-label">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span>{isMyanmar ? 'စစ်မှန်ကြောင်း အတည်ပြု တိုကင် (Bearer Token):' : 'Authorization Header (Bearer Token):'}</span>
                    </label>
                    <input
                      type="text"
                      className="exercise-text-input"
                      value={exerciseToken}
                      onChange={(e) => setExerciseToken(e.target.value)}
                      placeholder={isMyanmar ? 'Bearer JWT တိုကင် ရိုက်ထည့်ပါ...' : 'Enter Bearer JWT token...'}
                    />
                  </div>
                )}

                {currentLesson.exercise.defaultQueryParams && (
                  <div className="exercise-params-preview">
                    <span className="params-label">{isMyanmar ? 'Query ပါရာမီတာများ:' : 'Query Parameters:'}</span>
                    <div className="params-tags">
                      {Object.entries(currentLesson.exercise.defaultQueryParams).map(([k, v]) => (
                        <span key={k} className="param-tag"><code>{k}</code> = <code>{v}</code></span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Execute Action */}
                <div className="exercise-actions">
                  <button
                    type="button"
                    className="btn-run-exercise"
                    onClick={handleRunExercise}
                    disabled={isRunningExercise}
                  >
                    {isRunningExercise ? (
                      <>
                        <span className="spinner" />
                        <span>{t('learnRunningBtn')}</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} className="fill-current" />
                        <span>{t('learnRunLiveBtn')}</span>
                      </>
                    )}
                  </button>

                  {onNavigateToConsole && (
                    <button
                      type="button"
                      className="btn-open-console"
                      onClick={() => onNavigateToConsole()}
                      title={isMyanmar ? 'ကွန်ဆိုးလ်အပြည့်တွင် ဖွင့်မည်' : 'Open full interactive tester console'}
                    >
                      <ExternalLink size={14} />
                      <span>{t('learnOpenFullConsoleBtn')}</span>
                    </button>
                  )}
                </div>

                {/* Live Response Box */}
                {exerciseResponse && (
                  <div className="exercise-response-viewer">
                    <div className="response-viewer-header">
                      <div className="response-status-group">
                        <span className={`status-pill ${exerciseResponse.status >= 200 && exerciseResponse.status < 300 ? 'status-ok' : 'status-err'}`}>
                          HTTP {exerciseResponse.status} {exerciseResponse.statusText}
                        </span>
                        <span className="time-pill">
                          <Clock size={12} /> {exerciseResponse.durationMs} ms
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-copy-response"
                        onClick={handleCopyResponse}
                      >
                        {copiedResponse ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedResponse ? (isMyanmar ? 'ကူးယူပြီး' : 'Copied') : (isMyanmar ? 'JSON ကူးယူမည်' : 'Copy JSON')}</span>
                      </button>
                    </div>

                    <pre className="response-json-box">
                      <code>{JSON.stringify(exerciseResponse.data, null, 2)}</code>
                    </pre>

                    <div className="exercise-explanation-note">
                      <div className="note-icon"><Sparkles size={16} /></div>
                      <div className="note-text">{currentLesson.exercise.explanationNote}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="tab-bottom-cta">
                <button
                  type="button"
                  className="btn-next-tab"
                  onClick={() => setActiveTab('quiz')}
                >
                  <span>{t('learnBtnReadyQuiz')}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Quiz */}
          {activeTab === 'quiz' && (
            <div className="lesson-tab-content quiz-content">
              <div className="quiz-card">
                <div className="quiz-card-header">
                  <div className="quiz-header-badge">{t('learnAssessmentTitle')}</div>
                  <h3 className="quiz-card-title">{currentLesson.quiz.title}</h3>
                  <p className="quiz-card-desc">{t('learnAssessmentDesc')}</p>
                </div>

                <div className="quiz-questions-list">
                  {currentLesson.quiz.questions.map((q, qIndex) => {
                    const selectedIdx = selectedAnswers[q.id];
                    const isCorrect = selectedIdx === q.correctIndex;

                    return (
                      <div key={q.id} className="quiz-question-item">
                        <div className="question-header">
                          <span className="question-number">Q{qIndex + 1}</span>
                          <h4 className="question-text">{q.question}</h4>
                        </div>

                        <div className="quiz-options-list">
                          {q.options.map((opt, optIdx) => {
                            const isSelectedOption = selectedIdx === optIdx;
                            let optionClass = 'quiz-option-btn';
                            if (isSelectedOption) optionClass += ' selected';
                            if (quizSubmitted) {
                              if (optIdx === q.correctIndex) {
                                optionClass += ' option-correct';
                              } else if (isSelectedOption && !isCorrect) {
                                optionClass += ' option-incorrect';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                className={optionClass}
                                onClick={() => handleSelectOption(q.id, optIdx)}
                                disabled={quizSubmitted}
                              >
                                <span className="option-letter">{String.fromCharCode(65 + optIdx)}</span>
                                <span className="option-text">{opt}</span>
                                {quizSubmitted && optIdx === q.correctIndex && (
                                  <CheckCircle2 size={16} className="text-emerald-500 ml-auto" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className={`quiz-explanation-box ${isCorrect ? 'explanation-correct' : 'explanation-incorrect'}`}>
                            <strong>{isCorrect ? (isMyanmar ? '✓ မှန်ကန်ပါသည်!' : '✓ Correct!') : (isMyanmar ? '✗ မှားယွင်းနေပါသည်:' : '✗ Incorrect:')}</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quiz Submission & Score */}
                <div className="quiz-footer-actions">
                  {!quizSubmitted ? (
                    <button
                      type="button"
                      className="btn-submit-quiz"
                      onClick={() => setQuizSubmitted(true)}
                      disabled={Object.keys(selectedAnswers).length < currentLesson.quiz.questions.length}
                    >
                      <BrainCircuit size={16} />
                      <span>{isMyanmar ? `အဖြေများ စစ်ဆေးမည် (${Object.keys(selectedAnswers).length} / ${currentLesson.quiz.questions.length})` : `Check My Answers (${Object.keys(selectedAnswers).length} / ${currentLesson.quiz.questions.length})`}</span>
                    </button>
                  ) : (
                    <div className="quiz-score-banner">
                      <div className="score-badge-col">
                        <span className={`score-badge ${scoreResult.passed ? 'score-pass' : 'score-retry'}`}>
                          {isMyanmar ? `${scoreResult.correct} / ${scoreResult.total} ခု မှန်ကန်သည် (${Math.round((scoreResult.correct / scoreResult.total) * 100)}%)` : `${scoreResult.correct} / ${scoreResult.total} Correct (${Math.round((scoreResult.correct / scoreResult.total) * 100)}%)`}
                        </span>
                      </div>
                      <div className="score-msg-col">
                        {scoreResult.passed ? (
                          <span>{isMyanmar ? '🎉 ထူးချွန်ပါသည်! သင်သည် ဤသင်ခန်းစာကို အပြည့်အဝ တတ်မြောက်သွားပါပြီ!' : '🎉 Outstanding! You have completely mastered this lesson!'}</span>
                        ) : (
                          <span>{isMyanmar ? 'ဆက်လက် လေ့ကျင့်ပါ! အထက်ပါ ရှင်းလင်းချက်များကို ပြန်လည်ဖတ်ရှုပြီး ထပ်မံကြိုးစားကြည့်ပါ။' : 'Keep practicing! Review the explanations above and try again.'}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn-retry-quiz"
                        onClick={() => {
                          setSelectedAnswers({});
                          setQuizSubmitted(false);
                        }}
                      >
                        <RotateCcw size={14} />
                        <span>{t('learnRetryQuizBtn')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Lesson Footer Navigation */}
          <div className="lesson-footer-nav">
            <button
              type="button"
              className="btn-nav-prev"
              disabled={currentIndex === 0}
              onClick={() => {
                if (currentIndex > 0) {
                  setSelectedLessonId(LEARN_LESSONS[currentIndex - 1].id);
                }
              }}
            >
              <ArrowLeft size={16} />
              <span>{t('learnBtnPrevLesson')}</span>
            </button>

            <button
              type="button"
              className={`btn-nav-complete ${isLessonCompleted ? 'is-completed' : ''}`}
              onClick={() => toggleCompleteLesson(currentLesson.id)}
            >
              <CheckCircle2 size={16} />
              <span>{isLessonCompleted ? t('learnBtnCompletedDone') : t('learnBtnMarkComplete')}</span>
            </button>

            <button
              type="button"
              className="btn-nav-next"
              disabled={currentIndex === LEARN_LESSONS.length - 1}
              onClick={() => {
                if (currentIndex < LEARN_LESSONS.length - 1) {
                  setSelectedLessonId(LEARN_LESSONS[currentIndex + 1].id);
                }
              }}
            >
              <span>{t('learnBtnNextLesson')}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
