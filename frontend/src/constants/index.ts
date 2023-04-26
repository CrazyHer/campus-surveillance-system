export default {
  userRole: { ADMIN: 'admin', USER: 'user' },
  cameraStatus: { NORMAL: 'normal', OFFLINE: 'offline', ALARM: 'alarm' },
  alarmRuleAlgorithmType: {
    BODY: 'body',
    VEHICLE: 'vehicle',
  },
  SHA256KEY: 'campus-surveillance-system',
  // FETCH_ROOT: '//localhost:3000',
  FETCH_ROOT: '',
  HLS_LOWLATENCY_OPTION: {
    enableWorker: true,
    liveSyncDurationCount: 2,
    liveMaxLatencyDurationCount: 4,
    liveDurationInfinity: true,
    highBufferWatchdogPeriod: 1,
    lowLatencyMode: true,
  },
};
