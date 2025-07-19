import { useCallback } from 'react';
import { setSelectedMapId } from '../store/slices/mapSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const useMap = () => {
  const dispatch = useAppDispatch();
  const currentMapId = useAppSelector((state) => state.map.selectedMapId);

  const setMap = useCallback((mapId: string) => {
    dispatch(setSelectedMapId(mapId));
  }, [dispatch]);

  return {
    currentMapId,
    setMap,
  };
}; 