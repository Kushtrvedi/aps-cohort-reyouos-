import { useEffect, useRef } from 'react';

export function useTeamActivityMonitor(
  selectedTeamId: string,
  stageTitle: string,
  deps: any[] = []
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      const payload = {
        teamId: selectedTeamId,
        stage: stageTitle,
        timestamp: Date.now()
      };
      
      console.warn(`[ACTIVITY MONITOR] Inactivity detected for Team ${selectedTeamId} in "${stageTitle}". Dispatching event...`);
      
      // Set to localStorage with a cache-busting timestamp to guarantee cross-tab trigger
      localStorage.setItem('reyou-team-inactivity', JSON.stringify(payload));
      
      // Dispatch local event for same-window listeners
      window.dispatchEvent(new CustomEvent('reyou-team-inactivity-dispatch', {
        detail: payload
      }));
    }, 90000); // 90 seconds inactivity threshold
  };

  useEffect(() => {
    resetTimer();

    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'click', 'input', 'change'];
    const handleUserActivity = () => {
      resetTimer();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [selectedTeamId, stageTitle, ...deps]);
}
