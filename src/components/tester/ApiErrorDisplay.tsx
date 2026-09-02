import React from 'react';
import { ParsedApiError } from '../../lib/api-errors';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Key, 
  FileQuestion, 
  ListX, 
  ServerCrash, 
  WifiOff, 
  TimerOff,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface ApiErrorDisplayProps {
  error: ParsedApiError;
}

export const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({ error }) => {
  const { openAuthModal } = useAuth();
  const { isMyanmar } = useLanguage();

  const getErrorIcon = () => {
    switch (error.type) {
      case '401':
        return <ShieldAlert size={22} className="error-icon text-amber-400" />;
      case '403':
        return <Key size={22} className="error-icon text-red-400" />;
      case '404':
        return <FileQuestion size={22} className="error-icon text-blue-400" />;
      case '422':
        return <ListX size={22} className="error-icon text-orange-400" />;
      case '500':
        return <ServerCrash size={22} className="error-icon text-red-400" />;
      case 'timeout':
        return <TimerOff size={22} className="error-icon text-purple-400" />;
      case 'network':
        return <WifiOff size={22} className="error-icon text-red-400" />;
      default:
        return <AlertTriangle size={22} className="error-icon text-amber-400" />;
    }
  };

  return (
    <div className={`api-error-card error-type-${error.type}`}>
      <div className="api-error-header">
        <div className="api-error-icon-wrapper">
          {getErrorIcon()}
        </div>
        <div className="api-error-title-group">
          <div className="api-error-type-tag">{isMyanmar ? 'အမှား အသေးစိတ် စစ်ဆေးမှု အစီရင်ခံစာ' : 'DIAGNOSTIC ERROR REPORT'}</div>
          <h3 className="api-error-title">{error.title}</h3>
        </div>
      </div>

      <div className="api-error-body">
        <p className="api-error-message">{error.message}</p>

        {error.details && (
          <div className="api-error-details-row">
            <span className="error-details-label">{isMyanmar ? 'အကြောင်းရင်း:' : 'Cause:'}</span>
            <span className="error-details-text">{error.details}</span>
          </div>
        )}

        {/* Validation Errors List */}
        {error.validationErrors && error.validationErrors.length > 0 && (
          <div className="api-error-validation-list">
            <div className="validation-header">{isMyanmar ? 'အချက်အလက် စစ်ဆေးမှု အမှားများ:' : 'Field Validation Errors:'}</div>
            {error.validationErrors.map((valErr, idx) => (
              <div key={idx} className="validation-item">
                <code className="validation-field">{valErr.field}</code>
                <span className="validation-msg">{valErr.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Suggested Fix Action Box */}
        <div className="api-error-fix-box">
          <div className="fix-box-header">
            <HelpCircle size={15} />
            <span>{isMyanmar ? 'အကြံပြုထားသော ဖြေရှင်းနည်း:' : 'Recommended Fix:'}</span>
          </div>
          <div className="fix-box-content">
            <p className="fix-box-text">{error.suggestedFix}</p>

            {(error.type === '401' || error.type === '403') && (
              <button
                type="button"
                className="error-fix-action-btn"
                onClick={openAuthModal}
              >
                <span>{isMyanmar ? 'စစ်မှန်ကြောင်း အတည်ပြုစနစ်ကို ဖွင့်မည်' : 'Open Authentication Manager'}</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

