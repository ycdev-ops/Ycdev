export interface IotStreamState {
  tick: number;
  temperatureC: number;
  humidityPct: number;
  latencyMs: number;
  activeNodes: number;
  totalNodes: number;
  bufferMode: 'STREAMING' | 'EDGE_BUFFER_FAILOVER';
  historyTemp: number[];
}

export interface SecurityStreamState {
  blockedProbes: number;
  mitigationMs: number;
  mtlsKeyAgeMinutes: number;
  threatLevel: 'NOMINAL' | 'ELEVATED_MITIGATED';
  latestLog: string;
}

export interface PipelineMetrics {
  targetRps: number;
  goWorkerCount: number;
  dbP99Ms: number;
  kafkaLagMessages: number;
  cacheHitRatePct: number;
  memoryFootprintMb: number;
}

export function computeExplodedOffset(
  basePos: [number, number, number],
  explodeVector: [number, number, number],
  explodeFactor: number
): [number, number, number] {
  const clamped = Math.min(1, Math.max(0, explodeFactor));
  return [
    basePos[0] + explodeVector[0] * clamped,
    basePos[1] + explodeVector[1] * clamped,
    basePos[2] + explodeVector[2] * clamped,
  ];
}

export function simulateIotStreamTick(
  prev: IotStreamState,
  anomalyActive: boolean
): IotStreamState {
  const nextTick = prev.tick + 1;
  const wave = Math.sin(nextTick * 0.65) * 0.35;
  const temp = anomalyActive
    ? Number((-12.4 + Math.abs(wave) * 1.4).toFixed(1))
    : Number((-18.5 + wave).toFixed(1));
  const humidity = anomalyActive ? 68 : Math.round(54 + Math.cos(nextTick * 0.5) * 2);
  const latency = anomalyActive ? 34 + (nextTick % 7) : 13 + (nextTick % 4);
  const activeNodes = anomalyActive ? prev.totalNodes - 2 : prev.totalNodes;
  const historyTemp = [...prev.historyTemp.slice(-15), temp];

  return {
    tick: nextTick,
    temperatureC: temp,
    humidityPct: humidity,
    latencyMs: latency,
    activeNodes,
    totalNodes: prev.totalNodes,
    bufferMode: anomalyActive ? 'EDGE_BUFFER_FAILOVER' : 'STREAMING',
    historyTemp,
  };
}

export function simulateSecurityEvent(
  prev: SecurityStreamState,
  action: 'tick' | 'attack_test' | 'rotate_mtls'
): SecurityStreamState {
  if (action === 'rotate_mtls') {
    return {
      ...prev,
      mtlsKeyAgeMinutes: 0,
      threatLevel: 'NOMINAL',
      latestLog: 'Rotasi sertifikat mTLS X.509 & kunci Vault selesai tanpa downtime.',
    };
  }

  if (action === 'attack_test') {
    return {
      blockedProbes: prev.blockedProbes + 48,
      mitigationMs: 2,
      mtlsKeyAgeMinutes: prev.mtlsKeyAgeMinutes + 1,
      threatLevel: 'ELEVATED_MITIGATED',
      latestLog: 'Pengujian burst credential-stuffing (48 req) diisolasi dalam 2 ms oleh eBPF filter.',
    };
  }

  return {
    blockedProbes: prev.blockedProbes + 1,
    mitigationMs: 3,
    mtlsKeyAgeMinutes: prev.mtlsKeyAgeMinutes + 1,
    threatLevel: 'NOMINAL',
    latestLog: 'Pemindaian endpoint OWASP bersih · Sesi mTLS terverifikasi.',
  };
}

export function calculatePipelineMetrics(targetRps: number): PipelineMetrics {
  const clampedRps = Math.min(48000, Math.max(5000, Math.round(targetRps)));
  const ratio = (clampedRps - 5000) / (48000 - 5000);
  const goWorkerCount = Math.round(8 + ratio * 56);
  const dbP99Ms = Number((4.2 + ratio * 8.6).toFixed(1));
  const kafkaLagMessages = clampedRps > 38000 ? Math.round((clampedRps - 38000) * 0.015) : 0;
  const cacheHitRatePct = Number((98.9 - ratio * 1.4).toFixed(1));
  const memoryFootprintMb = Math.round(180 + ratio * 460);

  return {
    targetRps: clampedRps,
    goWorkerCount,
    dbP99Ms,
    kafkaLagMessages,
    cacheHitRatePct,
    memoryFootprintMb,
  };
}
