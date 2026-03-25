import { Injectable } from "@nestjs/common";
import { PaymentWebhookEvent } from "./webhook-event";
import { RedisStoreService } from "../../infrastructure/cache/redis-store.service";

type WebhookRetryJob = {
  id: string;
  event: PaymentWebhookEvent;
  attempt: number;
  nextRunAt: number;
  lastError: string;
};

const RETRY_QUEUE_KEY = "payments:webhook:retry-queue";
const RETRY_QUEUE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class PaymentWebhookRetryService {
  constructor(private readonly redisStore: RedisStoreService) {}

  async schedule(event: PaymentWebhookEvent, attempt: number, lastError: string) {
    const backoffMs = this.getBackoffMs(attempt);
    const now = Date.now();
    const job: WebhookRetryJob = {
      id: this.buildJobId(event, attempt, now),
      event,
      attempt,
      nextRunAt: now + backoffMs,
      lastError,
    };

    const queue = await this.getQueue();
    queue.push(job);
    await this.saveQueue(queue);
    return job;
  }

  async popDue(limit: number): Promise<WebhookRetryJob[]> {
    const queue = await this.getQueue();
    const now = Date.now();
    const due = queue
      .filter((job) => job.nextRunAt <= now)
      .sort((a, b) => a.nextRunAt - b.nextRunAt)
      .slice(0, Math.max(1, limit));

    const dueIds = new Set(due.map((job) => job.id));
    for (let index = queue.length - 1; index >= 0; index -= 1) {
      if (dueIds.has(queue[index].id)) {
        queue.splice(index, 1);
      }
    }

    await this.saveQueue(queue);

    return due;
  }

  async size() {
    const queue = await this.getQueue();
    return queue.length;
  }

  getMaxAttempts() {
    return this.parsePositiveInt(process.env.PAYMENTS_WEBHOOK_MAX_RETRIES, 5);
  }

  private getBackoffMs(attempt: number) {
    const baseMs = this.parsePositiveInt(process.env.PAYMENTS_WEBHOOK_RETRY_BASE_MS, 2_000);
    const maxMs = this.parsePositiveInt(process.env.PAYMENTS_WEBHOOK_RETRY_MAX_MS, 60_000);
    const exponential = baseMs * 2 ** Math.max(0, attempt - 1);
    return Math.min(exponential, maxMs);
  }

  private buildJobId(event: PaymentWebhookEvent, attempt: number, now: number) {
    const eventPart = event.eventId?.trim() || `${event.reference}:${event.status}`;
    return `${eventPart}:attempt:${attempt}:at:${now}`;
  }

  private parsePositiveInt(value: string | undefined, fallback: number) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }

  private async getQueue() {
    const queue = await this.redisStore.getJson<WebhookRetryJob[]>(RETRY_QUEUE_KEY);
    return Array.isArray(queue) ? queue : [];
  }

  private async saveQueue(queue: WebhookRetryJob[]) {
    await this.redisStore.setJson(RETRY_QUEUE_KEY, queue, RETRY_QUEUE_TTL_MS);
  }
}
