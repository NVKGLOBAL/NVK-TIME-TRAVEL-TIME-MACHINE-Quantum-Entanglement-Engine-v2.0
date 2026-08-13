import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChronoToolsProps {
    targetDateTime: Date | null;
    currentTime: Date;
}

const ChronoTools: React.FC<ChronoToolsProps> = ({ targetDateTime, currentTime }) => {
    // Timer State
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerInput, setTimerInput] = useState("00:00:00");

    // Alarm State
    const [alarmTime, setAlarmTime] = useState<string>("");
    const [isAlarmSet, setIsAlarmSet] = useState(false);
    const [alarmMessage, setAlarmMessage] = useState("");

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning && timerSeconds > 0) {
            interval = setInterval(() => {
                setTimerSeconds(prev => prev - 1);
            }, 1000);
        } else if (timerSeconds === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            alert("Timer Finished!");
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerSeconds]);

    const startTimer = () => {
        const [h, m, s] = timerInput.split(':').map(Number);
        const totalSeconds = (h * 3600) + (m * 60) + s;
        if (totalSeconds > 0) {
            setTimerSeconds(totalSeconds);
            setIsTimerRunning(true);
        }
    };

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // Countdown to Target Logic
    const getCountdownToTarget = useCallback(() => {
        if (!targetDateTime) return null;
        const diff = targetDateTime.getTime() - currentTime.getTime();
        const isPast = diff < 0;
        const absDiff = Math.abs(diff);

        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds, isPast };
    }, [targetDateTime, currentTime]);

    const countdown = getCountdownToTarget();

    // Alarm Logic
    useEffect(() => {
        if (isAlarmSet && alarmTime) {
            const [h, m] = alarmTime.split(':').map(Number);
            if (currentTime.getHours() === h && currentTime.getMinutes() === m && currentTime.getSeconds() === 0) {
                setAlarmMessage("ALARM ACTIVATED!");
                setIsAlarmSet(false);
                setTimeout(() => setAlarmMessage(""), 5000);
            }
        }
    }, [currentTime, isAlarmSet, alarmTime]);

    const getAlarmCountdown = () => {
        if (!isAlarmSet || !alarmTime) return null;
        const [h, m] = alarmTime.split(':').map(Number);
        const now = currentTime;
        const alarmDate = new Date(now);
        alarmDate.setHours(h, m, 0, 0);
        
        if (alarmDate <= now) {
            alarmDate.setDate(alarmDate.getDate() + 1);
        }

        const diff = alarmDate.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className="space-y-6">
            {/* Countdown to Target */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-500/30">
                <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2 font-orbitron">
                    <i className="ri-hourglass-2-line"></i> Temporal Distance to Target
                </h3>
                {countdown ? (
                    <div className="text-center">
                        <div className="grid grid-cols-4 gap-2 mb-2">
                            <div className="bg-black/40 p-2 rounded">
                                <div className="text-xl font-bold text-white">{countdown.days}</div>
                                <div className="text-[10px] text-gray-500 uppercase">Days</div>
                            </div>
                            <div className="bg-black/40 p-2 rounded">
                                <div className="text-xl font-bold text-white">{countdown.hours}</div>
                                <div className="text-[10px] text-gray-500 uppercase">Hours</div>
                            </div>
                            <div className="bg-black/40 p-2 rounded">
                                <div className="text-xl font-bold text-white">{countdown.minutes}</div>
                                <div className="text-[10px] text-gray-500 uppercase">Mins</div>
                            </div>
                            <div className="bg-black/40 p-2 rounded">
                                <div className="text-xl font-bold text-white">{countdown.seconds}</div>
                                <div className="text-[10px] text-gray-500 uppercase">Secs</div>
                            </div>
                        </div>
                        <p className={`text-xs ${countdown.isPast ? 'text-red-400' : 'text-green-400'}`}>
                            {countdown.isPast ? 'Target is in the past' : 'Time remaining until jump window'}
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-gray-500 text-sm italic mb-2">No target coordinates set in the Quantum Core.</p>
                        <p className="text-[10px] text-cyan-500/60 uppercase tracking-widest">Awaiting temporal coordinates from Navigation tab</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Timer Tool */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/30">
                    <h3 className="text-purple-400 font-semibold mb-3 flex items-center gap-2 font-orbitron">
                        <i className="ri-timer-line"></i> Chrono-Timer
                    </h3>
                    <div className="flex flex-col items-center">
                        <div className="text-3xl font-mono text-white mb-4 bg-black/60 px-4 py-2 rounded border border-purple-500/50">
                            {isTimerRunning ? formatTime(timerSeconds) : timerInput}
                        </div>
                        {!isTimerRunning ? (
                            <div className="flex flex-col gap-3 w-full">
                                <input 
                                    type="text" 
                                    value={timerInput} 
                                    onChange={(e) => setTimerInput(e.target.value)}
                                    className="bg-black/40 border border-gray-600 rounded px-3 py-2 text-white text-center font-mono focus:border-purple-500 outline-none"
                                    placeholder="HH:MM:SS"
                                />
                                <button 
                                    onClick={startTimer}
                                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-bold transition-all"
                                >
                                    START COUNTDOWN
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsTimerRunning(false)}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-bold transition-all"
                            >
                                ABORT TIMER
                            </button>
                        )}
                    </div>
                </div>

                {/* Alarm Tool */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-yellow-500/30">
                    <h3 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2 font-orbitron">
                        <i className="ri-alarm-line"></i> Temporal Alarm
                    </h3>
                    <div className="flex flex-col items-center">
                        <AnimatePresence>
                            {alarmMessage && (
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1.1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="absolute bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg z-10"
                                >
                                    {alarmMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <div className="w-full space-y-3">
                            <input 
                                type="time" 
                                value={alarmTime}
                                onChange={(e) => setAlarmTime(e.target.value)}
                                className="w-full bg-black/40 border border-gray-600 rounded px-3 py-2 text-white text-center font-mono focus:border-yellow-500 outline-none"
                                disabled={isAlarmSet}
                            />
                            
                            {isAlarmSet ? (
                                <div className="text-center">
                                    <p className="text-xs text-gray-400 mb-1">Your alarm will go off in:</p>
                                    <p className="text-lg font-mono text-yellow-400 mb-3">{getAlarmCountdown()}</p>
                                    <button 
                                        onClick={() => setIsAlarmSet(false)}
                                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded font-bold transition-all"
                                    >
                                        CANCEL ALARM
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsAlarmSet(true)}
                                    disabled={!alarmTime}
                                    className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white py-2 rounded font-bold transition-all"
                                >
                                    SET ALARM
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChronoTools;
