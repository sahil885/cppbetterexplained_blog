---
title: "C++ Concurrency & Mutex: Thread Safety Explained"
description: "Learn C++ concurrency and mutex with clear examples. Covers std::thread, std::mutex, lock_guard, and how to write thread-safe code."
pubDatetime: 2026-04-19T00:00:00Z
author: "Sahil"
tags: ["C++", "concurrency", "threads", "mutex", "C++11", "tutorial"]
faqSchema:
  - question: "What is a mutex in C++?"
    answer: "A mutex (mutual exclusion) is a synchronisation primitive that prevents multiple threads from accessing shared data simultaneously. In C++, std::mutex from <mutex> provides a lock() and unlock() interface. Use std::lock_guard for automatic unlocking to avoid deadlocks."
  - question: "What is a race condition in C++?"
    answer: "A race condition occurs when two or more threads access shared data concurrently and at least one thread modifies it, producing unpredictable results. Race conditions are prevented by using mutexes or other synchronisation mechanisms to serialise access to shared resources."
  - question: "When should you use std::mutex vs std::atomic in C++?"
    answer: "Use std::atomic for simple shared variables like counters where you just need increment/read operations — it's faster than a mutex. Use std::mutex when you need to protect a block of code or more complex data structures that require multiple operations to complete atomically."
draft: false
featured: false
---

# C++ Concurrency Tutorial: Threads, Mutex, and Thread Safety Explained

Modern computers have multiple CPU cores. A single-threaded program uses one core while the rest sit idle. Concurrency lets your program run multiple tasks simultaneously — downloading a file while processing data, handling multiple network connections at once, or parallelising computation across all your CPU cores.

C++11 introduced a standard threading library, making concurrent programming portable and practical. This tutorial covers the essentials: creating threads, protecting shared data with mutexes, and writing thread-safe code.

---

## What Is a Thread?

A **thread** is an independent sequence of execution within a program. Every program starts with one thread (the main thread). You can create additional threads that run concurrently — potentially in parallel on multiple CPU cores.

```
Main thread:   Task A ─────────────────────────── done
Thread 2:           Task B ───────────────── done
Thread 3:           Task C ────────── done
                    ↕ Running at the same time
```

---

## Creating Threads with std::thread

Include `<thread>` and construct a `std::thread` with a callable (function, lambda, or functor):

```cpp
#include <iostream>
#include <thread>

void printMessage(const std::string& msg) {
    std::cout << msg << "\n";
}

int main() {
    std::thread t1(printMessage, "Hello from thread 1");
    std::thread t2(printMessage, "Hello from thread 2");

    t1.join();  // Wait for t1 to finish
    t2.join();  // Wait for t2 to finish

    std::cout << "Both threads finished.\n";
    return 0;
}
```

`join()` blocks the calling thread until the target thread finishes. Always join (or detach) a thread before it goes out of scope — not joining causes `std::terminate()`.

### Using lambdas

```cpp
int main() {
    std::thread t([]() {
        std::cout << "Lambda running in a thread\n";
    });
    t.join();
    return 0;
}
```

### Passing arguments

```cpp
void compute(int id, int n) {
    int result = 0;
    for (int i = 0; i < n; i++) result += i;
    std::cout << "Thread " << id << " result: " << result << "\n";
}

int main() {
    std::thread t1(compute, 1, 1000);
    std::thread t2(compute, 2, 2000);

    t1.join();
    t2.join();
    return 0;
}
```

Arguments after the function are forwarded to it. Note: they are copied by default. Use `std::ref()` to pass by reference:

```cpp
void increment(int& counter) { counter++; }

int main() {
    int value = 0;
    std::thread t(increment, std::ref(value));
    t.join();
    std::cout << value << "\n";  // 1
    return 0;
}
```

---

## The Problem: Data Races

When two or more threads access the same data concurrently and at least one writes, you have a **data race** — undefined behavior that causes crashes, corruption, or silently wrong results.

A classic example:

```cpp
#include <iostream>
#include <thread>

int counter = 0;

void increment() {
    for (int i = 0; i < 100000; i++) {
        counter++;  // NOT thread-safe!
    }
}

int main() {
    std::thread t1(increment);
    std::thread t2(increment);

    t1.join();
    t2.join();

    std::cout << "Counter: " << counter << "\n";  // Should be 200000
    // But you might get 143821 or 187654 — different every run!
    return 0;
}
```

Why? `counter++` compiles to three operations:
1. Read counter from memory
2. Add 1
3. Write counter back to memory

If both threads read the same value before either writes, one increment is lost. This is a classic race condition.

---

## std::mutex: Protecting Shared Data

A **mutex** (mutual exclusion) is a lock. Only one thread can hold it at a time. Other threads that try to acquire it will block until the holder releases it.

```cpp
#include <iostream>
#include <thread>
#include <mutex>

int counter = 0;
std::mutex mtx;

void increment() {
    for (int i = 0; i < 100000; i++) {
        mtx.lock();    // Acquire the lock
        counter++;     // Safe — only one thread here at a time
        mtx.unlock();  // Release the lock
    }
}

int main() {
    std::thread t1(increment);
    std::thread t2(increment);

    t1.join();
    t2.join();

    std::cout << "Counter: " << counter << "\n";  // Always 200000
    return 0;
}
```

The section between `lock()` and `unlock()` is called a **critical section** — code that only one thread executes at a time.

**Never use `lock()` / `unlock()` directly in real code.** If an exception is thrown between them, the mutex is never unlocked and the program deadlocks. Use RAII wrappers instead.

---

## std::lock_guard: Exception-Safe Locking

`std::lock_guard` is an RAII wrapper that acquires the mutex on construction and releases it on destruction — automatically, even if an exception is thrown.

```cpp
#include <mutex>

std::mutex mtx;
int counter = 0;

void increment() {
    for (int i = 0; i < 100000; i++) {
        std::lock_guard<std::mutex> lock(mtx);  // Lock acquired here
        counter++;
        // Lock released automatically at end of scope
    }
}
```

This is the idiomatic way to use a mutex in modern C++. The lock is always released when `lock` goes out of scope — no exceptions, no forgetting.

---

## std::unique_lock: More Flexible Locking

`std::unique_lock` is similar to `std::lock_guard` but more flexible. Use it when you need to:

- Defer locking
- Unlock and re-lock within a scope
- Use with condition variables

```cpp
#include <mutex>

std::mutex mtx;

void example() {
    std::unique_lock<std::mutex> lock(mtx);  // Locks immediately

    // Do work...

    lock.unlock();   // Manually unlock mid-scope
    // Do non-critical work...
    lock.lock();     // Re-lock

    // lock releases on scope exit
}
```

For simple cases, prefer `lock_guard`. For condition variables or deferred locking, use `unique_lock`.

---

## Avoiding Deadlock

A **deadlock** occurs when two or more threads each hold a lock the other needs — and both wait forever.

```
Thread 1: holds mutex A, waiting for mutex B
Thread 2: holds mutex B, waiting for mutex A
→ Both wait forever
```

To avoid deadlock:
- Always acquire multiple mutexes in the same order across all threads
- Or use `std::lock()` to acquire multiple mutexes atomically:

```cpp
std::mutex mtxA, mtxB;

void safeTransfer() {
    // Acquires both locks atomically — no deadlock
    std::lock(mtxA, mtxB);
    std::lock_guard<std::mutex> lockA(mtxA, std::adopt_lock);
    std::lock_guard<std::mutex> lockB(mtxB, std::adopt_lock);

    // Both protected now
}
```

---

## Condition Variables: Waiting for Events

A **condition variable** lets a thread wait until another thread signals that some condition is true. It pairs with a `unique_lock`.

Classic producer-consumer example:

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>

std::queue<int> dataQueue;
std::mutex mtx;
std::condition_variable cv;
bool done = false;

void producer() {
    for (int i = 0; i < 5; i++) {
        {
            std::lock_guard<std::mutex> lock(mtx);
            dataQueue.push(i);
            std::cout << "Produced: " << i << "\n";
        }
        cv.notify_one();  // Wake up the consumer
    }

    {
        std::lock_guard<std::mutex> lock(mtx);
        done = true;
    }
    cv.notify_one();
}

void consumer() {
    while (true) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, []{ return !dataQueue.empty() || done; });

        while (!dataQueue.empty()) {
            int value = dataQueue.front();
            dataQueue.pop();
            std::cout << "Consumed: " << value << "\n";
        }

        if (done) break;
    }
}

int main() {
    std::thread t1(producer);
    std::thread t2(consumer);

    t1.join();
    t2.join();
    return 0;
}
```

`cv.wait(lock, predicate)` atomically releases the lock and waits. When `notify_one()` is called, it reacquires the lock and checks the predicate. If true, it continues; if false, it waits again. Always pass a predicate to handle spurious wakeups.

---

## std::atomic: Lightweight Synchronisation

For simple shared variables like counters or flags, `std::atomic` provides thread-safe access without a mutex:

```cpp
#include <atomic>
#include <thread>
#include <iostream>

std::atomic<int> counter{0};

void increment() {
    for (int i = 0; i < 100000; i++) {
        counter++;  // Atomic increment — thread-safe, no mutex needed
    }
}

int main() {
    std::thread t1(increment);
    std::thread t2(increment);

    t1.join();
    t2.join();

    std::cout << "Counter: " << counter << "\n";  // Always 200000
    return 0;
}
```

`std::atomic` operations are lock-free on most platforms and significantly faster than mutex-protected operations for simple types. Use it for:
- Counters (`atomic<int>`)
- Flags (`atomic<bool>`)
- Shared state variables between threads

---

## Practical Example: Parallel Sum

Split a large computation across multiple threads:

```cpp
#include <iostream>
#include <thread>
#include <vector>
#include <numeric>

void partialSum(const std::vector<int>& data, int start, int end, long long& result) {
    result = 0;
    for (int i = start; i < end; i++) {
        result += data[i];
    }
}

int main() {
    const int SIZE = 1000000;
    std::vector<int> data(SIZE, 1);  // 1 million 1s

    long long sum1 = 0, sum2 = 0;
    int mid = SIZE / 2;

    // Split work across two threads
    std::thread t1(partialSum, std::cref(data), 0, mid, std::ref(sum1));
    std::thread t2(partialSum, std::cref(data), mid, SIZE, std::ref(sum2));

    t1.join();
    t2.join();

    long long total = sum1 + sum2;
    std::cout << "Total: " << total << "\n";  // 1000000
    return 0;
}
```

Each thread operates on a separate portion of the array — no shared writes, no mutex needed. This is the ideal pattern for parallel computation.

---

## Hardware Concurrency

Check how many threads your hardware can run truly in parallel:

```cpp
unsigned int cores = std::thread::hardware_concurrency();
std::cout << "Hardware threads: " << cores << "\n";  // e.g., 8
```

Creating far more threads than CPU cores doesn't speed things up — the OS has to context-switch between them, adding overhead.

---

## Common Mistakes

### Forgetting to join a thread

```cpp
void doWork() { /* ... */ }

int main() {
    std::thread t(doWork);
    // Forgot t.join() or t.detach() — std::terminate() called!
    return 0;
}
```

Always call `join()` or `detach()` before the thread object is destroyed.

### Accessing moved-from thread object

```cpp
std::thread t(doWork);
std::thread t2 = std::move(t);  // t is now empty

t.join();   // BUG: t no longer owns the thread
t2.join();  // CORRECT
```

### Holding a lock longer than necessary

```cpp
// BAD: lock held during slow I/O
void processFile() {
    std::lock_guard<std::mutex> lock(mtx);
    auto data = readFileFromDisk();  // Slow! Other threads blocked during entire I/O
    processData(data);
}

// GOOD: lock held only during data access
void processFile() {
    auto data = readFileFromDisk();  // No lock during slow I/O
    std::lock_guard<std::mutex> lock(mtx);
    processData(data);  // Lock only for the critical section
}
```

Keep critical sections as short as possible.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

## Summary

C++ concurrency starts with `std::thread` for running code in parallel. The core challenge is protecting shared data — use `std::mutex` with `std::lock_guard` (never raw `lock()`/`unlock()`). Use `std::condition_variable` for thread coordination when one thread needs to wait for another. For simple shared counters and flags, `std::atomic` is faster and simpler than a mutex.

The golden rule: if multiple threads touch the same data and any of them writes, you need synchronisation.

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles
- [C++ Move Semantics Explained: rvalue References, std::move, and Performance](/posts/cpp-move-semantics/) — concurrent code benefits greatly from move semantics for passing data between threads efficiently.
- [Smart Pointers in Modern C++: unique_ptr, shared_ptr, and weak_ptr Explained](/posts/smart-pointers-cpp/) — `std::shared_ptr` uses atomic reference counting; it's thread-safe for the pointer itself, though not for the pointed-to data.
- [Memory Management in C++: Heap vs Stack, new/delete, and How to Prevent Memory Leaks](/posts/memory-management-cpp/) — threads share the heap; understanding memory ownership is critical for safe concurrent code.
