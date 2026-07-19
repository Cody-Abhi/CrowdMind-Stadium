import { ApiResponse, AssetData, KnowledgeGraphData } from '../types';

export const equipmentService = {
  /**
   * Fetches the operational maintenance history for a given equipment tag.
   */
  async getEquipmentHistory(tag: string): Promise<ApiResponse<AssetData>> {
    try {
      const response = await fetch(`/api/v1/equipment/${encodeURIComponent(tag)}/history`);
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : `Failed to load history for asset ${tag}`
      };
    }
  },

  /**
   * Fetches the local Knowledge Graph neighborhood for a given equipment entity ID.
   */
  async getKnowledgeGraph(entityId: string): Promise<ApiResponse<KnowledgeGraphData>> {
    try {
      const response = await fetch(`/api/v1/knowledge-graph/${encodeURIComponent(entityId)}`);
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : `Failed to load knowledge graph for ${entityId}`
      };
    }
  }
};
