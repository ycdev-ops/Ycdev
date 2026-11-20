import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePipelineMetrics,
  computeExplodedOffset,
  simulateIotStreamTick,
  simulateSecurityEvent,
  type IotStreamState,
  type SecurityStreamState,
} from './telemetrySimulation';

test('computeExplodedOffset interpolates and clamps explodeFactor cleanly', () => {
  assert.deepEqual(computeExplodedOffset([1, 2, 3], [0, 2, -1], 0), [1, 2, 3]);
  assert.deepEqual(computeExplodedOffset([1, 2, 3], [0, 2, -1], 0.5), [1, 3, 2.5]);
  assert.deepEqual(computeExplodedOffset([1, 2, 3], [0, 2, -1], 2), [1, 4, 2]);
  assert.deepEqual(computeExplodedOffset([1, 2, 3], [0, 2, -1], -1), [1, 2, 3]);
});

test('simulateIotStreamTick switches between normal streaming and edge failover mode', () => {
  const base: IotStreamState = {
    tick: 0,
    temperatureC: -18.5,
    humidityPct: 54,
    latencyMs: 14,
    activeNodes: 140,
    totalNodes: 140,
    bufferMode: 'STREAMING',
    historyTemp: [-18.5],
  };

  const normal = simulateIotStreamTick(base, false);
  assert.equal(normal.bufferMode, 'STREAMING');
  assert.equal(normal.activeNodes, 140);
  assert.ok(normal.temperatureC < -17);

  const anomaly = simulateIotStreamTick(normal, true);
  assert.equal(anomaly.bufferMode, 'EDGE_BUFFER_FAILOVER');
  assert.equal(anomaly.activeNodes, 138);
  assert.ok(anomaly.temperatureC > -13);
});

test('simulateSecurityEvent handles attack simulation and mTLS key rotation', () => {
  const initial: SecurityStreamState = {
    blockedProbes: 120,
    mitigationMs: 3,
    mtlsKeyAgeMinutes: 42,
    threatLevel: 'NOMINAL',
    latestLog: 'Init',
  };

  const underAttack = simulateSecurityEvent(initial, 'attack_test');
  assert.equal(underAttack.blockedProbes, 168);
  assert.equal(underAttack.threatLevel, 'ELEVATED_MITIGATED');
  assert.equal(underAttack.mitigationMs, 2);

  const rotated = simulateSecurityEvent(underAttack, 'rotate_mtls');
  assert.equal(rotated.mtlsKeyAgeMinutes, 0);
  assert.equal(rotated.threatLevel, 'NOMINAL');
});

test('calculatePipelineMetrics scales workers and memory deterministically across 5k-48k RPS', () => {
  const low = calculatePipelineMetrics(5000);
  const high = calculatePipelineMetrics(48000);

  assert.equal(low.targetRps, 5000);
  assert.equal(low.goWorkerCount, 8);
  assert.equal(low.kafkaLagMessages, 0);

  assert.equal(high.targetRps, 48000);
  assert.equal(high.goWorkerCount, 64);
  assert.ok(high.dbP99Ms > low.dbP99Ms);
  assert.ok(high.memoryFootprintMb > low.memoryFootprintMb);
});
