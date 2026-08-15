import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentName, BellState, TravelMethod, QuantumState, EntanglementMetrics } from './types';
import TimeJumpVortex from './components/TimeJumpVortex';
import Notification from './components/Notification';
import QuantumCorePanel from './components/panels/QuantumCorePanel';
import WatchSelector from './components/WatchSelector';
import NexusPortal from './components/NexusPortal';
import { watchFaces } from './components/watch-faces/watchFaceRegistry';
import { 
  createBellPair, 
  calculateEntanglementMetrics,
  applyDecoherence,
  applyQuantumErrorCorrection,
  detectCTC,
  calculateWormholeParams
} from './lib/quantum';
import ParadoxShieldEffect from './components/ParadoxShieldEffect';
import TimeWarpedWatch from './components/TimeWarpedWatch';
import UIGlitchEffect from './components/UIGlitchEffect';
import DynamicTemporalBackground from './components/visuals/DynamicTemporalBackground';
import ChronoTools from './components/panels/ChronoTools';
import LongTermTemporalVisualizer from './components/panels/LongTermTemporalVisualizer';
import GlobalTimeDashboard from './components/panels/GlobalTimeDashboard';
import WatchFaceErrorBoundary from './components/watch-faces/WatchFaceErrorBoundary';
import { AIProvider, useAI } from './context/AIContext';
import AISettingsModal from './components/modals/AISettingsModal';
import AICommsPanel from './components/panels/AICommsPanel';


type NotificationType = {
  message: string;
  type: 'success' | 'error' | 'info';
};

const SHIELD_ACTIVATION_THRESHOLD = 0.9;
const SHIELD_FAILURE_THRESHOLD = 0.5;

const AIHeaderBadge: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { config } = useAI();
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 rounded-full text-xs font-mono text-cyan-300 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] mt-1.5"
      title="Click to swap AI Model / Provider"
    >
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="uppercase text-[10px] text-slate-400">{config.provider}:</span>
      <span className="font-bold">{config.modelName}</span>
      <i className="ri-settings-4-line text-cyan-400 ml-0.5" />
    </button>
  );
};

const NVKTimeMachine = () => {
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [location, setLocation] = useState('');
  const [activeTab, setActiveTab] = useState('navigation');
  
  const [timelineIntegrity, setTimelineIntegrity] = useState(0.0);
  const [safetyStatus, setSafetyStatus] = useState('SAFE');
  const [paradoxRisk, setParadoxRisk] = useState(0);
  const [travelLog, setTravelLog] = useState<any[]>([]);
  const [isJumping, setIsJumping] = useState(false);
  const [temporalAnchor, setTemporalAnchor] = useState<any>(null);
  const [observations, setObservations] = useState<any[]>([]);
  
  // New Quantum State
  const [quantumAnchor, setQuantumAnchor] = useState<QuantumState | null>(null);
  const [quantumDevice, setQuantumDevice] = useState<QuantumState | null>(null);
  const [entanglementMetrics, setEntanglementMetrics] = useState<EntanglementMetrics>({ concurrence: 0, fidelity: 0, negativity: 0 });
  const [selectedBellState, setSelectedBellState] = useState<BellState>(BellState.PHI_PLUS);
  const [travelMethod, setTravelMethod] = useState<TravelMethod>('warp');
  const [ctcStatus, setCtcStatus] = useState({ detected: false, reason: 'SYSTEM READY' });
  const [wormholeParams, setWormholeParams] = useState<any>(null);
  const [isParadoxShieldActive, setIsParadoxShieldActive] = useState(false);
  const [isShieldActivating, setIsShieldActivating] = useState(false);

  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [viewMode, setViewMode] = useState<'timeMachine' | 'watchSelector'>('watchSelector');
  const [selectedFaceIndex, setSelectedFaceIndex] = useState(0);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);

  const showNotification = useCallback((message: string, type: NotificationType['type']) => {
    setNotification({ message, type });
  }, []);

  // Quantum Core Initialization & Maintenance Loop
  const recalibrateEntanglement = useCallback((bonusCoherence = 0) => {
    const [anchorState, deviceState] = createBellPair(selectedBellState);
    
    // Apply bonus from mini-game
    const enhancedDeviceState = {
        ...deviceState,
        coherenceLevel: Math.min(1.0, deviceState.coherenceLevel + bonusCoherence)
    };
    
    setQuantumAnchor(anchorState);
    setQuantumDevice(enhancedDeviceState);
    showNotification(`Entanglement recalibrated to Bell State: ${selectedBellState}${bonusCoherence > 0 ? ` (Resonance Bonus: +${Math.round(bonusCoherence*100)}%)` : ''}`, 'info');
  }, [selectedBellState, showNotification]);

  useEffect(() => {
    recalibrateEntanglement();
  }, [recalibrateEntanglement]);
  
  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    const maintenanceInterval = setInterval(() => {
      setQuantumDevice(prevDevice => {
        if (!prevDevice || isJumping) return prevDevice;
        
        let newDevice = applyDecoherence(prevDevice, 1000, isParadoxShieldActive ? 0.01 : undefined);
        
        if (newDevice.coherenceLevel < 0.95 && !isParadoxShieldActive) {
          newDevice = applyQuantumErrorCorrection(newDevice);
        }

        // Auto-deactivate shield if coherence drops too low
        if (isParadoxShieldActive && newDevice.coherenceLevel < SHIELD_FAILURE_THRESHOLD) {
            setIsParadoxShieldActive(false);
            showNotification('Paradox shield failed! Coherence levels critical.', 'error');
        }

        return newDevice;
      });
    }, 1000);
    return () => {
        clearInterval(timeInterval);
        clearInterval(maintenanceInterval);
    };
  }, [isJumping, isParadoxShieldActive, showNotification]);

  // Update metrics whenever quantum states change
  useEffect(() => {
    if (quantumAnchor && quantumDevice) {
      const metrics = calculateEntanglementMetrics(quantumAnchor, quantumDevice);
      setEntanglementMetrics(metrics);
    }
  }, [quantumAnchor, quantumDevice]);


  const calculateParadoxRisk = useCallback((target: string) => {
    if (!target) return 0;
    const targetYear = new Date(target).getFullYear();
    const currentYear = currentTime.getFullYear();
    const yearDiff = Math.abs(targetYear - currentYear);
    
    if (yearDiff > 100) return Math.min(75, yearDiff / 10);
    if (yearDiff > 50) return Math.min(50, yearDiff / 15);
    return Math.min(25, yearDiff / 20);
  }, [currentTime]);

  // Pre-jump analysis based on selected method
  useEffect(() => {
    const risk = calculateParadoxRisk(targetDate);
    setParadoxRisk(risk);

    if(targetDate) {
      const ctcResult = detectCTC(currentTime, new Date(targetDate), quantumDevice);
      setCtcStatus(ctcResult);

      if (travelMethod === 'wormhole' && quantumDevice) {
        setWormholeParams(calculateWormholeParams(currentTime, new Date(targetDate), quantumDevice.coherenceLevel, entanglementMetrics));
      } else {
        setWormholeParams(null);
      }
    } else {
        setCtcStatus({ detected: false, reason: 'AWAITING TARGET' });
        setWormholeParams(null);
    }
  }, [targetDate, travelMethod, quantumDevice, currentTime, calculateParadoxRisk, entanglementMetrics]);


  const initiateTimeJump = () => {
    if (!targetDate || !targetTime || !location) {
      showNotification('Please set target date, time, and location', 'error');
      return;
    }
    
    if (ctcStatus.detected) {
       setSafetyStatus('CTC DETECTED');
       showNotification(`CHRONOLOGY PROTECTION: ${ctcStatus.reason}`, 'error');
       return;
    }
    
    if (travelMethod === 'wormhole' && (!wormholeParams || wormholeParams.stability < 0.7)) {
        showNotification('Wormhole unstable! Entanglement coherence too low.', 'error');
        return;
    }

    if (quantumDevice && quantumDevice.coherenceLevel < 0.7) {
      showNotification('Insufficient quantum coherence - Please wait for error correction', 'error');
      return;
    }

    setIsJumping(true);
    setSafetyStatus('JUMPING');

    if (!temporalAnchor) {
      setTemporalAnchor({
        date: currentTime.toISOString(),
        location: 'Origin Point',
      });
    }

    setTimeout(() => {
      const jumpRecord = {
        from: currentTime.toISOString(),
        to: `${targetDate} ${targetTime}`,
        location: location,
        timestamp: new Date().toISOString(),
        entropyBefore: timelineIntegrity,
        method: travelMethod,
        shielded: isParadoxShieldActive
      };
      setTravelLog(prev => [jumpRecord, ...prev]);

      if (isParadoxShieldActive) {
          showNotification(`Paradox Shielded! Jump successful via ${travelMethod}.`, 'success');
          setQuantumDevice(prev => prev ? {...prev, coherenceLevel: Math.max(0, prev.coherenceLevel - 0.3) } : null); // Major coherence cost
          setIsParadoxShieldActive(false); // Shield is consumed by the jump
          setTimelineIntegrity(prev => Math.min(1.0, prev + paradoxRisk / 1000)); // Mitigated damage
      } else {
          showNotification(`Jump successful via ${travelMethod}! Arrived at ${targetDate}`, 'success');
          setTimelineIntegrity(prev => Math.min(1.0, prev + paradoxRisk / 150)); 
      }

      setIsJumping(false);
      setSafetyStatus('SAFE');
    }, 5000);
  };

  const emergencyReturn = () => {
    if (!temporalAnchor) {
      showNotification('No temporal anchor established!', 'error');
      return;
    }
    
    setIsJumping(true);
    setSafetyStatus('EMERGENCY RETURN');
    
    setTimeout(() => {
      setIsJumping(false);
      setSafetyStatus('SAFE');
      setTimelineIntegrity(0.0);
      setQuantumDevice(prev => prev ? {...prev, coherenceLevel: Math.max(0.2, prev.coherenceLevel - 0.15)}: null);
      showNotification('Quantum Teleportation successful! Returned to origin timeline.', 'info');
    }, 4000);
  };

  const recordObservation = () => {
    const obs = {
      timestamp: currentTime.toISOString(),
      note: `Observation at ${location || 'unknown location'}`,
      id: Date.now()
    };
    setObservations(prev => [obs, ...prev]);
  };

  const setTargetByYears = (years: number) => {
    const futureDate = new Date(currentTime);
    futureDate.setFullYear(futureDate.getFullYear() + years);
    
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const day = String(futureDate.getDate()).padStart(2, '0');
    const hour = String(futureDate.getHours()).padStart(2, '0');
    const minute = String(futureDate.getMinutes()).padStart(2, '0');

    setTargetDate(`${year}-${month}-${day}`);
    setTargetTime(`${hour}:${minute}`);
    setLocation(`Future Era (+${years}y)`);
    showNotification(`Temporal coordinates locked to +${years} years.`, 'success');
  };
  
  const handleEntanglementSwapping = () => {
    if (!targetDate || !location) {
        showNotification("Set a target date and location to create the intermediate anchor.", 'error');
        return;
    }
    if (quantumDevice && quantumDevice.coherenceLevel < 0.9) {
        showNotification("Coherence too low for stable entanglement swapping.", 'error');
        return;
    }
    setTemporalAnchor({
        date: `${targetDate}T${targetTime || '00:00:00'}`,
        location: location,
    });
    recalibrateEntanglement();
    showNotification(`Entanglement Swapped! New temporal anchor set at ${location}.`, 'success');
  }

  const toggleParadoxShield = () => {
    if (isParadoxShieldActive) {
        setIsParadoxShieldActive(false);
        showNotification('Paradox Shielding deactivated.', 'info');
    } else {
        if (quantumDevice && quantumDevice.coherenceLevel >= SHIELD_ACTIVATION_THRESHOLD) {
            setIsShieldActivating(true);
            setIsParadoxShieldActive(true);
            showNotification('Paradox Shielding engaged. Coherence is draining.', 'success');
            setTimeout(() => {
                setIsShieldActivating(false);
            }, 1500);
        } else {
            showNotification(`Insufficient coherence to activate shield. Requires >${SHIELD_ACTIVATION_THRESHOLD*100}%.`, 'error');
        }
    }
  };

  const handleRandomSafeJump = () => {
    if (isJumping) return;

    const locations = [
        'Lunar Colony 7',
        'Mariana Trench - Deep Lab Alpha',
        'Neo-Kyoto Skyscraper 1138',
        'Amazonis Planitia, Mars',
        'Floating City of Aethel',
        'Grand Library of Alexandria (Restored)',
        'ISS Armstrong Orbital Station',
        'Europa - Sub-ice Research Outpost',
    ];

    const futureDate = new Date();
    const randomDays = Math.floor(Math.random() * (365 * 5000)) + 1;
    futureDate.setDate(futureDate.getDate() + randomDays);
    
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const day = String(futureDate.getDate()).padStart(2, '0');

    const randomHour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
    const randomMinute = String(Math.floor(Math.random() * 60)).padStart(2, '0');

    const randomLocation = locations[Math.floor(Math.random() * locations.length)];

    setTargetDate(`${year}-${month}-${day}`);
    setTargetTime(`${randomHour}:${randomMinute}`);
    setLocation(randomLocation);

    showNotification('Random safe coordinates locked in!', 'success');
  };


  const TabButton = ({ name, iconClass, label }: { name: string, iconClass: string, label: string }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs md:text-sm ${
        activeTab === name 
          ? 'bg-cyan-500 text-white shadow-lg' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      <i className={iconClass}></i>
      <span className="font-medium">{label}</span>
    </button>
  );

  const SelectedWatchFace = watchFaces[selectedFaceIndex].Component;
  const selectedWatchFaceProps = watchFaces[selectedFaceIndex].props;
  
  const targetDateTime = useMemo(() => {
    if (!targetDate || !targetTime) return null;
    return new Date(`${targetDate}T${targetTime}`);
  }, [targetDate, targetTime]);
  
  const glitchIntensity = useMemo(() => {
    const damage = timelineIntegrity * 2; 
    const riskFactor = paradoxRisk / 100; 
    return Math.min(1, damage + riskFactor * 0.2); 
  }, [timelineIntegrity, paradoxRisk]);

  return (
    <>
      <DynamicTemporalBackground watchFaceName={watchFaces[selectedFaceIndex].name} />
      <ParadoxShieldEffect isActive={isParadoxShieldActive} isActivating={isShieldActivating} />
      <TimeJumpVortex isJumping={isJumping} isEmergency={safetyStatus === 'EMERGENCY RETURN'} method={safetyStatus === 'EMERGENCY RETURN' ? 'teleportation' : travelMethod} />
      <NexusPortal 
        isOpen={isOpeningPortal} 
        onComplete={() => { window.location.href = 'https://nvk-808043325057.us-west1.run.app/'; }} 
      />
      <Notification notification={notification} onClear={() => setNotification(null)} />
      <AnimatePresence mode="wait">
        {viewMode === 'timeMachine' ? (
          <motion.div key="timeMachine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <UIGlitchEffect intensity={glitchIntensity} />
            <div className="min-h-screen bg-transparent p-2 md:p-4 font-rajdhani text-slate-100">
              <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 md:p-6 mb-4 border border-cyan-500/30 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4 mt-2">
                     <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setViewMode('watchSelector')}
                            className="text-3xl text-gray-400 hover:text-white transition-colors"
                            aria-label="Back to watch selector"
                        >
                            <i className="ri-arrow-left-circle-line"></i>
                        </button>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-1 font-orbitron">TIME MACHINE</h1>
                                <a
                                  id="shop-nvk-smartwatches-btn-timemachine"
                                  href="https://www.nvk.global/collections/nvk-time"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:via-orange-500/30 hover:to-amber-500/30 border border-amber-400/60 hover:border-amber-300 text-amber-300 hover:text-amber-100 font-orbitron font-bold text-xs rounded-full transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:shadow-[0_0_20px_rgba(245,158,11,0.45)] whitespace-nowrap mb-1"
                                  title="Shop Official NVK Smartwatches & Timepieces"
                                >
                                  <i className="ri-shopping-bag-3-line text-amber-400" />
                                  <span>Shop NVK Smartwatches</span>
                                  <i className="ri-external-link-line text-xs opacity-75" />
                                </a>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-gray-400 text-sm">Quantum Entanglement Engine v2.0</p>
                                <AIHeaderBadge onClick={() => setIsAISettingsOpen(true)} />
                            </div>
                        </div>
                    </div>
                    <div
                        className="cursor-pointer group"
                        onDoubleClick={() => setViewMode('watchSelector')}
                        title="Double-click to return to watch selector"
                    >
                        <div className="flex gap-4 md:gap-6 items-start text-center">
                            {/* Anchor Watch */}
                            <div className="flex flex-col items-center">
                                <p className="text-xs text-cyan-400 font-orbitron mb-2">CHRONO-ANCHOR</p>
                                <div className="w-24 h-24 md:w-28 md:h-28 relative">
                                    <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                                        <WatchFaceErrorBoundary faceName={watchFaces[selectedFaceIndex]?.name}>
                                            <SelectedWatchFace time={currentTime} {...selectedWatchFaceProps} />
                                        </WatchFaceErrorBoundary>
                                    </div>
                                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/0 group-hover:border-cyan-500/50 animate-pulse transition-all pointer-events-none"></div>
                                </div>
                                <div className="text-[10px] text-gray-500 mt-1 font-mono">{currentTime.toLocaleDateString()}</div>
                            </div>

                            {/* Separator */}
                            <div className="h-24 md:h-28 flex items-center text-2xl text-cyan-600">
                              <i className="ri-arrow-right-double-line"></i>
                            </div>
                            
                             {/* Target Watch */}
                            <div className="flex flex-col items-center">
                                <p className="text-xs text-purple-400 font-orbitron mb-2">TIME-WARPED TARGET</p>
                                <div className="w-24 h-24 md:w-28 md:h-28 relative">
                                     <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                                        {targetDateTime ? (
                                            <TimeWarpedWatch>
                                                <WatchFaceErrorBoundary faceName={watchFaces[selectedFaceIndex]?.name}>
                                                    <SelectedWatchFace time={targetDateTime} {...selectedWatchFaceProps} />
                                                </WatchFaceErrorBoundary>
                                            </TimeWarpedWatch>
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-black/50 border-2 border-dashed border-gray-600 flex items-center justify-center">
                                                <span className="font-mono text-gray-500 text-sm">NO TARGET</span>
                                            </div>
                                        )}
                                    </div>
                                    {targetDateTime && <div className="absolute inset-0 rounded-full border-2 border-purple-500/70 animate-pulse-fast transition-all pointer-events-none"></div>}
                                </div>
                                <div className="text-[10px] text-gray-500 mt-1 font-mono">
                                    {targetDateTime ? targetDateTime.toLocaleDateString() : '---'}
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-500 font-sans text-xs mt-2 text-center">Double tap to change watch style</p>
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <i className="ri-links-line text-green-400"></i>
                        <span className="text-xs text-gray-400">Entanglement Coherence</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-400 h-2 rounded-full transition-all"
                            style={{ width: `${(quantumDevice?.coherenceLevel || 0) * 100}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-bold">{((quantumDevice?.coherenceLevel || 0) * 100).toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <i className="ri-heart-pulse-line text-purple-400"></i>
                        <span className="text-xs text-gray-400">Timeline Integrity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-400 h-2 rounded-full transition-all"
                            style={{ width: `${(1-timelineIntegrity) * 100}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-bold">{(1-timelineIntegrity).toFixed(3)}%</span>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <i className="ri-alert-line text-yellow-400"></i>
                        <span className="text-xs text-gray-400">Paradox Risk</span>
                      </div>
                      <div className="text-white text-lg font-bold">{paradoxRisk.toFixed(1)}%</div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <i className={`ri-shield-line ${safetyStatus === 'SAFE' ? 'text-green-400' : 'text-red-400'}`}></i>
                        <span className="text-xs text-gray-400">Safety Status</span>
                      </div>
                      <div className={`text-sm font-bold ${
                        safetyStatus === 'SAFE' ? 'text-green-400' : 
                        safetyStatus.includes('DANGER') || safetyStatus.includes('CTC') ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {safetyStatus}
                      </div>
                    </div>
                  </div>
                </header>

                {/* Tab Navigation */}
                <div className="flex gap-1 md:gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                  <TabButton name="navigation" iconClass="ri-compass-3-line" label="Navigation" />
                  <TabButton name="ai_core" iconClass="ri-brain-line" label="AI Engine" />
                  <TabButton name="dashboard" iconClass="ri-dashboard-3-line" label="Dashboard" />
                  <TabButton name="quantum_core" iconClass="ri-bubble-chart-line" label="Quantum Core" />
                  <TabButton name="safety" iconClass="ri-shield-check-line" label="Safety" />
                  <TabButton name="tools" iconClass="ri-tools-line" label="Tools" />
                  <TabButton name="logs" iconClass="ri-history-line" label="Logs" />
                </div>

                {/* Main Content Area */}
                <main className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-cyan-500/30 min-h-[500px]">
                  {activeTab === 'ai_core' && (
                    <AICommsPanel onOpenModelSettings={() => setIsAISettingsOpen(true)} />
                  )}

                  {activeTab === 'dashboard' && (
                    <GlobalTimeDashboard />
                  )}

                  {activeTab === 'navigation' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-orbitron">Temporal Navigation</h2>
                      
                      <div>
                          <label className="block text-gray-300 text-sm mb-2">Travel Method</label>
                          <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
                              {(['warp', 'wormhole'] as TravelMethod[]).map(method => (
                                  <button key={method} onClick={() => setTravelMethod(method)} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${travelMethod === method ? 'bg-cyan-500 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-700'}`}>
                                      {method.charAt(0).toUpperCase() + method.slice(1)}
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label htmlFor="target-date-input" className="block text-gray-300 text-sm">Target Date</label>
                            <button 
                              onClick={handleRandomSafeJump} 
                              disabled={isJumping}
                              className="p-1 rounded-md bg-gray-700 text-cyan-300 hover:bg-cyan-600 hover:text-white transition-all disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                              title="Generate Random Safe Coordinates"
                            >
                              <i className="ri-dice-line"></i>
                            </button>
                          </div>
                          <input id="target-date-input" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)}
                            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-cyan-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Target Time</label>
                          <input type="time" value={targetTime} onChange={(e) => setTargetTime(e.target.value)}
                            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-cyan-500 outline-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Location Coordinates</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., New York City, USA"
                          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-cyan-500 outline-none" />
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-cyan-400 font-semibold mb-2 font-orbitron">Pre-Jump Analysis</h3>
                        <div className="space-y-2 text-sm">
                          {travelMethod === 'wormhole' ? (
                              <>
                                <div className="flex justify-between"><span className="text-gray-400">Wormhole Stability:</span><span className={`font-mono ${wormholeParams?.stability > 0.7 ? 'text-green-400' : 'text-red-400'}`}>{((wormholeParams?.stability || 0) * 100).toFixed(1)}%</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Throat Radius:</span><span className="text-white font-mono">{wormholeParams?.throatRadius || 'N/A'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Est. Traversal Time:</span><span className="text-white font-mono">{wormholeParams?.traversalTime || 'N/A'}</span></div>
                              </>
                          ) : (
                              <>
                                <div className="flex justify-between"><span className="text-gray-400">Temporal Distance:</span><span className="text-white font-mono">{targetDate ? `${Math.abs(new Date(targetDate).getFullYear() - currentTime.getFullYear())} years` : 'N/A'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Required Coherence:</span><span className="text-white font-mono">{'>70%'}</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Causality Impact:</span><span className={paradoxRisk > 50 ? 'text-red-400' : 'text-green-400'}>{paradoxRisk > 50 ? 'High Risk' : 'Low Risk'}</span></div>
                              </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <button onClick={initiateTimeJump} disabled={isJumping}
                              className={`flex-1 py-3 rounded-lg font-bold transition-all disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed
                                ${isJumping ? 'bg-gray-600 text-gray-400' : 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg hover:shadow-cyan-500/50'}`}>
                              {isJumping ? 'JUMPING...' : 'INITIATE TIME JUMP'}
                            </button>
                            <button onClick={emergencyReturn} disabled={isJumping || !temporalAnchor}
                              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all disabled:bg-gray-600 disabled:text-gray-400">
                              EMERGENCY RETURN
                            </button>
                        </div>
                        <button 
                            onClick={() => setIsOpeningPortal(true)}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
                        >
                            <i className="ri-portal-line"></i> GO TO THE NEXUS
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'quantum_core' && (
                      <QuantumCorePanel
                          quantumAnchor={quantumAnchor}
                          quantumDevice={quantumDevice}
                          metrics={entanglementMetrics}
                          selectedBellState={selectedBellState}
                          onBellStateChange={setSelectedBellState}
                          onRecalibrate={recalibrateEntanglement}
                      />
                  )}
                  
                  {activeTab === 'safety' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-orbitron">Safety & Paradox Prevention</h2>
                      
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2 font-orbitron"><i className="ri-shield-cross-line"></i>Chronology Protection System</h3>
                        <div className={`p-3 rounded-lg border ${ctcStatus.detected ? 'border-red-500 bg-red-900/30' : 'border-green-500 bg-green-900/20'}`}>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold">{ctcStatus.detected ? 'CTC DETECTED' : 'NO CTC DETECTED'}</span>
                                <div className={`w-3 h-3 rounded-full ${ctcStatus.detected ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                            </div>
                            <p className="text-xs text-gray-300 mt-1">{ctcStatus.reason}</p>
                        </div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-cyan-400 font-semibold mb-3 font-orbitron"><i className="ri-shield-star-line"></i>Paradox Shielding System</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold">Shield Status:</span>
                                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                                        isParadoxShieldActive ? 'bg-green-500/30 text-green-300' :
                                        (quantumDevice?.coherenceLevel || 0) < SHIELD_ACTIVATION_THRESHOLD ? 'bg-red-500/30 text-red-300' : 'bg-gray-600/30 text-gray-300'
                                    }`}>
                                        {isParadoxShieldActive ? 'ACTIVE' : (quantumDevice?.coherenceLevel || 0) < SHIELD_ACTIVATION_THRESHOLD ? 'LOW POWER' : 'INACTIVE'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs text-gray-400">Charge:</span>
                                    <div className="flex-1 bg-gray-700 rounded-full h-2.5">
                                    <div 
                                        className={`h-2.5 rounded-full transition-all ${isParadoxShieldActive ? 'bg-green-400 animate-pulse' : 'bg-green-400'}`}
                                        style={{ width: `${(quantumDevice?.coherenceLevel || 0) * 100}%` }}
                                    />
                                    </div>
                                    <span className="text-white text-sm font-bold">{((quantumDevice?.coherenceLevel || 0) * 100).toFixed(1)}%</span>
                                </div>
                                <p className="text-xs text-gray-400">Consumes quantum coherence to mitigate paradox damage during time jumps.</p>
                            </div>
                            <button onClick={toggleParadoxShield} disabled={!isParadoxShieldActive && (quantumDevice?.coherenceLevel || 0) < SHIELD_ACTIVATION_THRESHOLD}
                                className={`w-full py-3 rounded-lg font-bold text-white transition-all disabled:cursor-not-allowed
                                ${isParadoxShieldActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                                disabled:bg-gray-600 disabled:text-gray-400
                                `}>
                                {isParadoxShieldActive ? 'DEACTIVATE SHIELD' : 'ACTIVATE SHIELD'}
                            </button>
                        </div>
                      </div>


                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2"><i className="ri-anchor-line"></i>Temporal Anchor Status</h3>
                        {temporalAnchor ? (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-400">Origin Point:</span><span className="text-green-400">Established</span></div>
                            <div className="flex justify-between text-xs"><span className="text-gray-400">Anchor Date:</span><span className="text-white font-mono">{new Date(temporalAnchor.date).toLocaleDateString()} {new Date(temporalAnchor.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Location:</span><span className="text-white">{temporalAnchor.location}</span></div>
                          </div>
                        ) : (
                          <div className="text-yellow-400">No temporal anchor established. Will be created on first jump.</div>
                        )}
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-cyan-400 font-semibold mb-3">Causality Violation Risk Assessment</h3>
                        <div>
                            <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">Current Risk Level</span><span className="text-white">{paradoxRisk.toFixed(1)}%</span></div>
                            <div className="bg-gray-700 rounded-full h-3">
                              <div className={`h-3 rounded-full transition-all ${paradoxRisk > 60 ? 'bg-red-500' : paradoxRisk > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${paradoxRisk}%` }} />
                            </div>
                          </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'tools' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-orbitron">Quantum & Temporal Tools</h2>
                      
                      <ChronoTools targetDateTime={targetDateTime} currentTime={currentTime} />

                      <LongTermTemporalVisualizer 
                        currentTime={currentTime} 
                        targetDateTime={targetDateTime} 
                        onSetTarget={setTargetByYears} 
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button onClick={() => recalibrateEntanglement()} className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-left transition-all border border-gray-600 hover:border-cyan-500">
                              <div className="flex items-center gap-3 mb-2"><i className="ri-refresh-line text-cyan-400 text-2xl"></i><h3 className="text-white font-semibold">Recalibrate Entanglement</h3></div>
                              <p className="text-gray-400 text-sm">Create a new, maximally entangled Bell pair to restore full coherence.</p>
                          </button>
                          <button onClick={handleEntanglementSwapping} className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-left transition-all border border-gray-600 hover:border-cyan-500">
                              <div className="flex items-center gap-3 mb-2"><i className="ri-swap-line text-cyan-400 text-2xl"></i><h3 className="text-white font-semibold">Entanglement Swapping</h3></div>
                              <p className="text-gray-400 text-sm">Establish a new temporal anchor at the target coordinates without traveling.</p>
                          </button>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2"><i className="ri-camera-line"></i>Recent Observations</h3>
                        <button onClick={recordObservation} className="w-full mb-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-all">Record New Observation</button>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                          {observations.length === 0 ? (
                            <div className="text-gray-500 text-sm text-center py-4">No observations recorded yet</div>
                          ) : (
                            observations.map((obs) => (
                              <div key={obs.id} className="bg-gray-700/50 rounded p-2 text-sm">
                                <div className="text-white">{obs.note}</div>
                                <div className="text-gray-400 text-xs">{new Date(obs.timestamp).toLocaleString('en-US')}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'logs' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-orbitron">Travel Logs</h2>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                          {travelLog.length === 0 ? ( <div className="text-gray-500 text-center py-8">No time jumps recorded yet</div>
                          ) : ( travelLog.map((log, idx) => (
                              <div key={idx} className={`bg-gray-700/50 rounded-lg p-3 border-l-4 ${log.shielded ? 'border-green-400' : 'border-cyan-500'}`}>
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <div className="text-white font-semibold flex items-center gap-2">
                                        Jump #{travelLog.length - idx}
                                        {log.shielded && <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full">SHIELDED</span>}
                                    </div>
                                    <div className="text-gray-400 text-sm">{log.location} <span className="text-xs text-cyan-300 ml-2">({log.method})</span></div>
                                  </div>
                                  <div className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div><span className="text-gray-400">From: </span><span className="text-white">{new Date(log.from).toLocaleString('en-US')}</span></div>
                                  <div><span className="text-gray-400">To: </span><span className="text-white">{log.to}</span></div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </main>

                {/* Footer Info */}
                <footer className="mt-4 text-center text-gray-500 text-xs md:text-sm flex flex-col sm:flex-row items-center justify-between gap-2 px-2">
                  <p>NVK Time Machine - Quantum Core v2.0 | All temporal jumps logged and monitored</p>
                  <a
                    id="shop-nvk-smartwatches-btn-footer"
                    href="https://www.nvk.global/collections/nvk-time"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-orbitron text-xs font-semibold"
                  >
                    <i className="ri-shopping-bag-3-line text-xs" />
                    <span>Shop NVK Smartwatches</span>
                    <i className="ri-external-link-line text-[10px] opacity-80" />
                  </a>
                </footer>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="watchSelector" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <WatchSelector 
              currentTime={currentTime} 
              initialIndex={selectedFaceIndex}
              onSelect={(index) => {
                setSelectedFaceIndex(index);
                setViewMode('timeMachine');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AISettingsModal isOpen={isAISettingsOpen} onClose={() => setIsAISettingsOpen(false)} />
    </>
  );
};

export const App = () => (
  <AIProvider>
    <NVKTimeMachine />
  </AIProvider>
);
