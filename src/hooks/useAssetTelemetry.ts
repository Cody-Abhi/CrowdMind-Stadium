import { useState, useEffect } from 'react';
import { AssetData } from '../types';
import { equipmentService } from '../services/equipmentService';

export function useAssetTelemetry(initialAsset = 'C-204') {
  const [selectedAsset, setSelectedAsset] = useState<string>(initialAsset);
  const [assetHistory, setAssetHistory] = useState<AssetData | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingHistory(true);
    setError(null);
    equipmentService.getEquipmentHistory(selectedAsset)
      .then(res => {
        if (res.success && res.data) {
          setAssetHistory(res.data);
        } else {
          setError(res.error || 'Failed to fetch equipment history');
        }
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => setLoadingHistory(false));
  }, [selectedAsset]);

  return {
    selectedAsset,
    setSelectedAsset,
    assetHistory,
    loadingHistory,
    error
  };
}
