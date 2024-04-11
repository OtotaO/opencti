import { MeterProvider } from '@opentelemetry/sdk-metrics';
import type { ObservableResult } from '@opentelemetry/api-metrics';

export class TelemetryMeterManager {
  meterProvider: MeterProvider;

  private version = '0';

  private language = 'auto';

  private isEEActivated = false;

  private EEActivationDate = undefined as string | undefined;

  private numberOfInstances = 0;

  private activUsers = [] as {
    user_id: string, // user id
    lastActivSessionFoundDate: number, // last date when a session was found for the user
  }[];

  constructor(meterProvider: MeterProvider) {
    this.meterProvider = meterProvider;
  }

  setVersion(val: string) {
    this.version = val;
  }

  setLanguage(lang: string) {
    this.language = lang;
  }

  setIsEEActivated(EE: boolean) {
    this.isEEActivated = EE;
  }

  setEEActivationDate(date: string | null | undefined) {
    this.EEActivationDate = date ?? undefined;
  }

  setNumberOfInstances(n: number) {
    this.numberOfInstances = n;
  }

  setActivUsers(activUsersInput: string[], timestamp: number) {
    const newActivUsers = activUsersInput
      .filter((userId) => !this.activUsers.map((n) => n.user_id).includes((userId))) // activ users that were not registered in this.activUsers
      .map((userId) => ({ user_id: userId, lastActivSessionFoundDate: timestamp }));
    const updatedActivUsers = this.activUsers
      .map((activUser) => (activUsersInput.includes(activUser.user_id)
        ? { user_id: activUser.user_id, lastActivSessionFoundDate: timestamp } // update timestamp
        : activUser)) // keep registered user
      .concat(newActivUsers);
    const limitDate = new Date().getTime() - 3600000; // TODO to set (actual date - 1 hour)
    this.activUsers = updatedActivUsers.filter((user) => user.lastActivSessionFoundDate >= limitDate);
  }

  registerFiligranTelemetry() {
    const meter = this.meterProvider.getMeter('opencti');
    // - Gauges
    // number of instances
    const numberOfInstancesGauge = meter.createObservableGauge('opencti_numberOfInstances');
    numberOfInstancesGauge.addCallback((observableResult: ObservableResult) => {
      observableResult.observe(this.numberOfInstances);
    });
    // number of activ users
    const activUsersGauge = meter.createObservableGauge('opencti_numberOfActivUsers');
    activUsersGauge.addCallback((observableResult: ObservableResult) => {
      observableResult.observe(this.activUsers.length);
    });
  }
}
