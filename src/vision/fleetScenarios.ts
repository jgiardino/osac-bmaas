import type { VisionGatewayFilter, VisionGatewayId, VisionOrgFilter } from './fleetWorld'

export type VisionScenarioId =
  | 'default'
  | 'nsb-only'
  | 'bluesolace-only'
  | 'nsb-retail-gateway'
  | 'unavailable-cluster'
  | 'empty-grid'

export type VisionScenarioSeed = {
  orgFilter: VisionOrgFilter
  gatewayFilter: VisionGatewayFilter
  selectedClusterId: string | null
  selectedPresetId: string | null
  selectedGatewayId: VisionGatewayId | null
  emptyGrid: boolean
}

const SCENARIO_SEEDS: Record<VisionScenarioId, VisionScenarioSeed> = {
  default: {
    orgFilter: 'all',
    gatewayFilter: 'all',
    selectedClusterId: null,
    selectedPresetId: null,
    selectedGatewayId: null,
    emptyGrid: false,
  },
  'nsb-only': {
    orgFilter: 'nsb',
    gatewayFilter: 'all',
    selectedClusterId: null,
    selectedPresetId: null,
    selectedGatewayId: null,
    emptyGrid: false,
  },
  'bluesolace-only': {
    orgFilter: 'bluesolace',
    gatewayFilter: 'all',
    selectedClusterId: null,
    selectedPresetId: null,
    selectedGatewayId: null,
    emptyGrid: false,
  },
  'nsb-retail-gateway': {
    orgFilter: 'nsb',
    gatewayFilter: 'all',
    selectedClusterId: null,
    selectedPresetId: null,
    selectedGatewayId: 'nsb-retail',
    emptyGrid: false,
  },
  'unavailable-cluster': {
    orgFilter: 'all',
    gatewayFilter: 'all',
    selectedClusterId: 'ocp-us-east-gpu',
    selectedPresetId: null,
    selectedGatewayId: null,
    emptyGrid: false,
  },
  'empty-grid': {
    orgFilter: 'all',
    gatewayFilter: 'all',
    selectedClusterId: null,
    selectedPresetId: null,
    selectedGatewayId: null,
    emptyGrid: true,
  },
}

export const getVisionScenarioId = (searchParams: URLSearchParams): VisionScenarioId => {
  const raw = searchParams.get('scenario')
  if (raw && raw in SCENARIO_SEEDS) {
    return raw as VisionScenarioId
  }
  return 'default'
}

export const getVisionScenarioSeed = (searchParams: URLSearchParams): VisionScenarioSeed =>
  SCENARIO_SEEDS[getVisionScenarioId(searchParams)]
