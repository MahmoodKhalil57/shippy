export class Queue<T> {
  readonly failures: unknown[] = [];
  private items: T[] = [];
  private active = 0;
  private waiters: (() => void)[] = [];
  private readonly consumers: number;
  private readonly work: (item: T) => Promise<void>;

  constructor(consumers: number, work: (item: T) => Promise<void>) {
    this.consumers = consumers;
    this.work = work;
  }

  push(item: T) {
    this.items.push(item);
    if (this.active < this.consumers) void this.consume();
  }

  private async consume() {
    this.active++;
    try {
      for (let item = this.items.shift(); item !== undefined; item = this.items.shift()) {
        try {
          await this.work(item);
        } catch (error) {
          this.failures.push(error);
        }
      }
    } finally {
      this.active--;
      if (!this.active) for (const wake of this.waiters.splice(0)) wake();
    }
  }

  async drained(): Promise<void> {
    if (this.active || this.items.length) await new Promise<void>((resolve) => this.waiters.push(resolve));
  }
}
