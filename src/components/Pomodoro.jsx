import React, { useEffect, useRef, useState } from "react";
import "../css/Promodoro.css";

const FOCUS_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 20 * 60;
const SESSIONS_BEFORE_LONG_BREAK = 4;

export default function Promodoro() {
  const [seconds, setSeconds] = useState(FOCUS_TIME);
  const [running, setRunning] = useState(false);
  const [isFocus, setIsFocus] = useState(true);
  const [sessionCount, setSessionCount] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [completedPhase, setCompletedPhase] = useState({});

  const timerRef = useRef(null);
  const beepIntervalRef = useRef(null);

  const playBeep = () => {
    if (!isSoundEnabled) return;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    osc.start();
    setTimeout(() => {
      osc.stop();
      audioCtx.close();
    }, 300);
  };

  const startBeepLoop = () => {
    stopBeepLoop();
    playBeep();
    beepIntervalRef.current = setInterval(playBeep, 700);
  };

  const stopBeepLoop = () => {
    if (beepIntervalRef.current) clearInterval(beepIntervalRef.current);
  };

  const toggleSound = () => setIsSoundEnabled((prev) => !prev);

  useEffect(() => {
    if (!running) return clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          startBeepLoop();
          setRunning(false);
          setCompletedPhase({
            type: isFocus ? "FOCUS" : "BREAK",
            isLongBreak:
              isFocus && (sessionCount + 1) % SESSIONS_BEFORE_LONG_BREAK === 0,
          });
          setShowCompletionPopup(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running, isFocus, sessionCount]);

  const handleNextSession = (startImmediately) => {
    stopBeepLoop();
    setShowCompletionPopup(false);

    if (completedPhase.type === "FOCUS") {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      const nextTime =
        newCount % SESSIONS_BEFORE_LONG_BREAK === 0 ? LONG_BREAK : SHORT_BREAK;
      setSeconds(nextTime);
      setIsFocus(false);
    } else {
      setSeconds(FOCUS_TIME);
      setIsFocus(true);
    }

    setCompletedPhase({});
    if (startImmediately) setRunning(true);
  };

  const handleSkip = () => handleNextSession(false);
  const start = () => { setShowCompletionPopup(false); setRunning(true); };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setSeconds(FOCUS_TIME);
    setIsFocus(true);
    setSessionCount(0);
    stopBeepLoop();
    setShowCompletionPopup(false);
    setCompletedPhase({});
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const totalTime = isFocus
    ? FOCUS_TIME
    : sessionCount % SESSIONS_BEFORE_LONG_BREAK === 0
      ? LONG_BREAK
      : SHORT_BREAK;
  const progress = ((totalTime - seconds) / totalTime) * 100;

  const getPopupUI = () => {
    const { type, isLongBreak } = completedPhase;
    if (!type) return null;
    const isFocusPhase = type === "FOCUS";
    const bgColor = isFocusPhase ? (isLongBreak ? "#e67e22" : "#2ecc71") : "#3498db";
    const title = isFocusPhase ? (isLongBreak ? "Long Break Time!" : "Short Break Time!") : "Time to Focus!";
    const message = isFocusPhase
      ? (isLongBreak ? "Excellent work! Take 20 minutes to recharge." : "Take a 5-minute break.")
      : "Break is over. Let's get back to work!";
    const primaryText = isFocusPhase
      ? `Start Break (${isLongBreak ? "20" : "5"} min)`
      : "Start Focus Session";

    return (
      <div className="popup" style={{ borderTopColor: bgColor }}>
        <h2 style={{ color: bgColor }}>{title}</h2>
        <p>{message}</p>
        <div className="popup-buttons">
          <button className="primary-btn" style={{ background: bgColor }} onClick={() => handleNextSession(true)}>
            {primaryText}
          </button>
          <button className="secondary-btn" onClick={handleSkip}>Skip</button>
        </div>
      </div>
    );
  };

  return (
    <section className="pomodoro-container">
      <div className="pomodoro-card">
        <h1 className={`pomodoro-title ${isFocus ? "focus" : "break"}`}>
          {isFocus ? "Focus Time" : "Break Time"}
        </h1>
        <p className="pomodoro-subtitle">{isFocus ? "Stay concentrated!" : "Relax and recharge"}</p>

        <div className="pomodoro-circle" style={{ background: `conic-gradient(${isFocus ? "#3498db" : "#2ecc71"} ${progress}%, #ecf0f1 0%)` }}>
          <span className="pomodoro-timer">{mm}:{ss}</span>
        </div>

        <div className="pomodoro-controls single-line">
          {!running ? <button className="start-btn" onClick={start}>Start</button> : <button className="pause-btn" onClick={pause}>Pause</button>}
          <button className={`sound-btn ${isSoundEnabled ? "on" : "off"}`} onClick={toggleSound}>
            {isSoundEnabled ? "🔊" : "🔇"}
          </button>
          <button className="reset-btn" onClick={reset}>Reset</button>
        </div>


        <div className="session-count">Completed Focus Sessions: <span>{sessionCount}</span></div>
      </div>

      {showCompletionPopup && <div className="modal-overlay">{getPopupUI()}</div>}
    </section>
  );
}
