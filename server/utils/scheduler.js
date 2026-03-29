// Scheduler for AI News Dashboard
// Implements task scheduling functionality for periodic operations

class Scheduler {
  constructor() {
    this.tasks = new Map(); // Store scheduled tasks
    this.runningTasks = new Map(); // Track currently running tasks
  }

  /**
   * Schedule a task to run at specified intervals
   * @param {string} taskId - Unique identifier for the task
   * @param {Function} taskFn - Function to execute
   * @param {number} interval - Interval in milliseconds
   * @param {Object} options - Additional options (e.g., immediate execution)
   * @returns {string} Task ID
   */
  scheduleTask(taskId, taskFn, interval, options = {}) {
    if (typeof taskFn !== 'function') {
      throw new Error('Task function must be provided');
    }

    if (this.tasks.has(taskId)) {
      throw new Error(`Task with ID "${taskId}" already exists`);
    }

    // Validate interval
    if (typeof interval !== 'number' || interval <= 0) {
      throw new Error('Interval must be a positive number');
    }

    // Wrap the task function with error handling
    const wrappedTask = async () => {
      try {
        if (!this.runningTasks.has(taskId)) {
          this.runningTasks.set(taskId, Date.now());

          await taskFn();

          this.runningTasks.delete(taskId);
        } else {
          console.warn(`Task "${taskId}" is already running, skipping execution`);
        }
      } catch (error) {
        console.error(`Error executing scheduled task "${taskId}":`, error);
        this.runningTasks.delete(taskId);
      }
    };

    // Create the interval
    const intervalId = setInterval(wrappedTask, interval);

    // Execute immediately if requested
    if (options.immediate === true) {
      // Use setImmediate to execute after the current event loop cycle
      setImmediate(async () => {
        try {
          if (!this.runningTasks.has(taskId)) {
            this.runningTasks.set(taskId, Date.now());

            await taskFn();

            this.runningTasks.delete(taskId);
          }
        } catch (error) {
          console.error(`Error executing immediate task "${taskId}":`, error);
          this.runningTasks.delete(taskId);
        }
      });
    }

    // Store task reference
    this.tasks.set(taskId, {
      id: taskId,
      fn: taskFn,
      interval: interval,
      intervalId: intervalId,
      createdAt: new Date(),
      options: options
    });

    console.log(`Scheduled task "${taskId}" to run every ${interval}ms`);

    return taskId;
  }

  /**
   * Cancel a scheduled task
   * @param {string} taskId - Task ID to cancel
   * @returns {boolean} Success status
   */
  cancelTask(taskId) {
    if (!this.tasks.has(taskId)) {
      console.warn(`Task "${taskId}" not found`);
      return false;
    }

    const task = this.tasks.get(taskId);
    clearInterval(task.intervalId);

    this.tasks.delete(taskId);

    // Stop running task if it's currently executing
    if (this.runningTasks.has(taskId)) {
      console.log(`Waiting for task "${taskId}" to finish before removing`);
    }

    console.log(`Cancelled task "${taskId}"`);

    return true;
  }

  /**
   * Cancel all scheduled tasks
   */
  cancelAllTasks() {
    for (const [taskId] of this.tasks) {
      this.cancelTask(taskId);
    }
  }

  /**
   * Get task status
   * @param {string} taskId - Task ID to check
   * @returns {Object|null} Task information or null if not found
   */
  getTaskInfo(taskId) {
    if (!this.tasks.has(taskId)) {
      return null;
    }

    const task = this.tasks.get(taskId);
    const isRunning = this.runningTasks.has(taskId);

    return {
      id: task.id,
      interval: task.interval,
      createdAt: task.createdAt,
      isRunning: isRunning,
      runningSince: isRunning ? this.runningTasks.get(taskId) : null,
      options: task.options
    };
  }

  /**
   * Get all scheduled tasks
   * @returns {Array<Object>} Array of task information
   */
  getAllTasks() {
    const tasks = [];

    for (const [taskId] of this.tasks) {
      tasks.push(this.getTaskInfo(taskId));
    }

    return tasks;
  }

  /**
   * Run a one-time delayed task
   * @param {Function} taskFn - Function to execute
   * @param {number} delay - Delay in milliseconds
   * @returns {string} Timeout ID
   */
  runDelayedTask(taskFn, delay) {
    if (typeof taskFn !== 'function') {
      throw new Error('Task function must be provided');
    }

    return setTimeout(async () => {
      try {
        await taskFn();
      } catch (error) {
        console.error('Error executing delayed task:', error);
      }
    }, delay);
  }

  /**
   * Check if a task is currently running
   * @param {string} taskId - Task ID to check
   * @returns {boolean} Whether the task is running
   */
  isTaskRunning(taskId) {
    return this.runningTasks.has(taskId);
  }
}

// Create singleton instance
const scheduler = new Scheduler();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down scheduler...');
  scheduler.cancelAllTasks();
});

process.on('SIGINT', () => {
  console.log('Shutting down scheduler...');
  scheduler.cancelAllTasks();
});

module.exports = scheduler;