import { Injectable, Logger } from "@nestjs/common";

type FailureSource = "webhook" | "retry" | "reconciliation";

@Injectable()
export class PaymentMetricsService {
  private readonly logger = new Logger(PaymentMetricsService.name);
  private readonly counters = {
    processed: 0,
    duplicates: 0,
    failed: 0,
    retriesScheduled: 0,
    retriesExecuted: 0,
    retriesExhausted: 0,
    reconciliationsRun: 0,
    reconciledPaid: 0,
    reconciledCancelled: 0,
  };
  private readonly failedEvents: Array<{ at: number; source: FailureSource }> = [];

  markProcessed() {
    this.counters.processed += 1;
  }

  markDuplicate() {
    this.counters.duplicates += 1;
  }

  markFailed(source: FailureSource, errorMessage: string) {
    this.counters.failed += 1;
    this.failedEvents.push({ at: Date.now(), source });
    this.trimFailuresWindow();

    this.logger.warn(`[${source}] Payment flow failed: ${errorMessage}`);
    this.maybeRaiseFailureAlert();
  }

  markRetryScheduled() {
    this.counters.retriesScheduled += 1;
  }

  markRetryExecuted() {
    this.counters.retriesExecuted += 1;
  }

  markRetryExhausted() {
    this.counters.retriesExhausted += 1;
  }

  markReconciliationRun() {
    this.counters.reconciliationsRun += 1;
  }

  markReconciledPaid() {
    this.counters.reconciledPaid += 1;
  }

  markReconciledCancelled() {
    this.counters.reconciledCancelled += 1;
  }

  getSnapshot() {
    this.trimFailuresWindow();

    return {
      ...this.counters,
      recentFailuresLast5Min: this.failedEvents.length,
      generatedAt: new Date().toISOString(),
    };
  }

  private maybeRaiseFailureAlert() {
    const threshold = this.parsePositiveInt(process.env.PAYMENTS_ALERT_FAILED_THRESHOLD, 5);
    if (this.failedEvents.length < threshold) {
      return;
    }

    this.logger.error(
      `ALERT: High payment failure volume detected (${this.failedEvents.length} failures in last 5 minutes)`
    );
  }

  private trimFailuresWindow() {
    const now = Date.now();
    const fiveMinutesMs = 5 * 60 * 1000;

    while (this.failedEvents.length > 0) {
      const head = this.failedEvents[0];
      if (now - head.at <= fiveMinutesMs) {
        break;
      }
      this.failedEvents.shift();
    }
  }

  private parsePositiveInt(value: string | undefined, fallback: number) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }
}
