import { useState, useEffect } from 'react';
import placementStore from '../services/placementStore.js';

export function usePlacementData() {
  const [data, setData] = useState(() => placementStore.getData());

  useEffect(() => {
    // Listen to changes in the data access layer
    const unsubscribe = placementStore.subscribe(() => {
      setData({ ...placementStore.getData() });
    });
    return unsubscribe;
  }, []);

  return {
    data,
    store: placementStore,
    todayStudiedMinutes: placementStore.getTodayStudiedMinutes(),
    totalStudiedHours: placementStore.getTotalStudiedHours(),
    daysRemaining: placementStore.getDaysRemaining(),
    streakInfo: placementStore.getStreakInfo(),
    preparationCompletion: placementStore.getPreparationCompletion(),
    skillReadiness: placementStore.getSkillReadiness(),
    companyPreparation: placementStore.getTargetCompanyPreparation(),
    topPriorities: placementStore.getTopPriorities(),
    recommendedNextAction: placementStore.getRecommendedNextAction(),
    uniqueSolvedDsaCount: placementStore.getUniqueSolvedDsaCount()
  };
}

export default usePlacementData;
