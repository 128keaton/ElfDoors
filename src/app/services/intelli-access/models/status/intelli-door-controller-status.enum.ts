export enum IntelliDoorControllerStatus {
  idle = 'Idle',
  online = 'Online',
  offine = 'Offline',
  takenOffline = 'TakenOffline',
  needsUpdate = 'NeedsUpdate',
  updatingServices = 'UpdatingServices',
  updatingCredentials = 'UpdatingCredentials',
  updatingFirmware = 'UpdatingFirmware',
  errorLastUpdate = 'ErrorOnUpdate',
  errorLastFirmwareUpdate = 'ErrorOnFirmwareUpdate',
  initializing = 'Initializing',
  unknown = 'Unknown'
}
