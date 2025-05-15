// A shared high-priority queue for managing and awaiting batches of Promises
class HighPriorityQueue {
    constructor() {
        this.queue = [];
    }

    add(promise) {
        this.queue.push(promise);
    }

    async wait() {
        if (this.queue.length === 0) return;
        console.log("this.queue:", this.queue.length);
        const results = await Promise.allSettled(this.queue);
        this.queue = [];
        return results;
    }

    clear() {
        this.queue.length = 0;
    }

    get length() {
        return this.queue.length;
    }
}

const highPriorityQueue = new HighPriorityQueue();
export default highPriorityQueue;
