---
title: "Exception Handling in C++: Best Practices for Writing Robust, Error-Free Code"
description: "Learn how to write robust C++ code with exception handling — covers try/catch/throw, custom exceptions, RAII guarantees, and when NOT to use exceptions."
pubDatetime: 2025-04-05T00:00:00Z
author: "Sahil"
tags: ["C++", "exceptions", "error handling", "RAII", "intermediate"]
draft: false
featured: false
---

# Exception Handling in C++: Best Practices for Writing Robust, Error-Free Code

## Introduction: Two Schools of Thought on Error Handling

The C++ community has a fascinating divide: some engineers think exceptions are terrible, others think they're essential. Both have points.

**The "exceptions are bad" camp** argues that:
- They're unpredictable (where will control flow go?)
- They add overhead (even if never thrown)
- They make code paths harder to reason about
- Embedded/gaming code needs to avoid them

**The "exceptions are good" camp** argues that:
- Error codes get ignored and propagate as bugs
- Exceptions force you to think about failures
- They cleanly separate error handling from normal logic
- Modern C++ (RAII) makes them safe and elegant

The truth: **both are right, depending on context**. High-performance games might avoid exceptions. Financial systems often embrace them. The key is understanding when each approach makes sense.

In this guide, we'll explore exception handling deeply, learn best practices, and understand the trade-offs. By the end, you'll know how to write robust error handling for your specific domain.

## What is an Exception? Mental Model

An exception is an **exceptional event that disrupts normal program flow**. It's a way of saying: "Something unexpected happened. I can't continue normally."

**Mental model**: A highway traffic controller. Normal operations follow planned routes (roads). An accident (exception) causes traffic (control flow) to be rerouted through alternative paths (exception handlers).

Key insight: Exceptions are for **truly exceptional situations** — not for normal flow control.

```cpp
// BAD: Using exceptions for normal control flow
try {
    while (true) {
        int value = get_next_int();
        if (value == -1) throw EndOfInputException();
        process(value);
    }
} catch (EndOfInputException&) {
    // Error handling
}

// GOOD: Use normal control flow for expected cases
int value;
while (get_next_int(value)) {  // Returns bool
    process(value);
}
```

Exceptions add overhead (stack unwinding, cleanup). If you know something is the normal case, don't treat it as exceptional.

## Basic Syntax: try, catch, throw

```cpp
#include <iostream>
#include <stdexcept>

void riskyOperation() {
    throw std::invalid_argument("Something went wrong!");
}

int main() {
    try {
        riskyOperation();
        std::cout << "This won't print\n";
    } catch (const std::invalid_argument& e) {
        std::cout << "Caught exception: " << e.what() << "\n";
    }

    std::cout << "Program continues normally\n";
    return 0;
}
```

**Key points:**

1. `throw` creates an exception object and interrupts normal flow
2. `try` blocks contain code that might throw
3. `catch` blocks handle specific exception types
4. Multiple catch blocks handle different exceptions
5. Control resumes after the catch block (or exits if uncaught)

```cpp
try {
    // Some code
} catch (const std::out_of_range& e) {
    // Handles out_of_range specifically
} catch (const std::runtime_error& e) {
    // Handles runtime_error and derived types
} catch (const std::exception& e) {
    // Catches any std::exception (base class)
} catch (...) {
    // Catches anything else (should rarely use this)
}
```

## Exception Types: The Standard Library Hierarchy

C++ provides a hierarchy of standard exceptions. Understanding this hierarchy helps you catch the right exceptions.

```
std::exception
  ├─ std::logic_error (programmer errors)
  │   ├─ std::invalid_argument
  │   ├─ std::out_of_range
  │   ├─ std::domain_error
  │   └─ std::length_error
  └─ std::runtime_error (runtime/environmental errors)
      ├─ std::range_error
      ├─ std::overflow_error
      └─ std::underflow_error
```

**Common exceptions:**

```cpp
#include <stdexcept>
#include <iostream>

int main() {
    // std::invalid_argument - wrong type of argument
    try {
        int value = std::stoi("not a number");
    } catch (const std::invalid_argument& e) {
        std::cout << "Invalid argument: " << e.what() << "\n";
    }

    // std::out_of_range - accessing out of bounds
    try {
        std::string s = "hello";
        char c = s.at(100);  // at() throws out_of_range
    } catch (const std::out_of_range& e) {
        std::cout << "Out of range: " << e.what() << "\n";
    }

    // std::runtime_error - generic runtime problem
    try {
        if (something_bad()) {
            throw std::runtime_error("Database connection failed");
        }
    } catch (const std::runtime_error& e) {
        std::cout << "Runtime error: " << e.what() << "\n";
    }

    return 0;
}
```

## Catching by Reference — Always Do This

Always catch exceptions by **const reference**, never by value:

```cpp
// WRONG - copies the exception object
try {
    throw std::runtime_error("error");
} catch (std::runtime_error e) {
    // e is a copy!
}

// RIGHT - reference to the exception object
try {
    throw std::runtime_error("error");
} catch (const std::runtime_error& e) {
    // e is a reference, no copy
    std::cout << e.what() << "\n";
}
```

**Why?**

1. **Efficiency**: No unnecessary copying
2. **Polymorphism**: Base class reference catches derived exceptions correctly
3. **Consistency**: Standard practice across C++ codebases

## Rethrowing Exceptions

Sometimes you want to catch an exception, do something (like logging), then rethrow it:

```cpp
void logAndRethrow() {
    try {
        riskyOperation();
    } catch (const std::exception& e) {
        std::cout << "Logging error: " << e.what() << "\n";
        throw;  // Rethrow the same exception
    }
}

int main() {
    try {
        logAndRethrow();
    } catch (const std::exception& e) {
        std::cout << "Caught at top level: " << e.what() << "\n";
    }
    return 0;
}
```

The bare `throw;` statement rethrows the **current exception** without creating a new one. This preserves the original exception type and state.

## Creating Custom Exception Classes

For complex applications, create your own exceptions:

```cpp
class DatabaseException : public std::runtime_error {
public:
    int error_code;

    DatabaseException(const std::string& message, int code)
        : std::runtime_error(message), error_code(code) {}
};

class ValidationException : public std::logic_error {
public:
    std::string field_name;

    ValidationException(const std::string& field, const std::string& reason)
        : std::logic_error(reason), field_name(field) {}
};

// Usage
void loadUserData(const std::string& id) {
    if (id.empty()) {
        throw ValidationException("user_id", "User ID cannot be empty");
    }

    if (!database.isConnected()) {
        throw DatabaseException("Connection lost", 42);
    }
}

int main() {
    try {
        loadUserData("");
    } catch (const ValidationException& e) {
        std::cout << "Validation failed on field: " << e.field_name << "\n";
        std::cout << "Reason: " << e.what() << "\n";
    } catch (const DatabaseException& e) {
        std::cout << "Database error code: " << e.error_code << "\n";
        std::cout << "Message: " << e.what() << "\n";
    }

    return 0;
}
```

**Best practices for custom exceptions:**

1. Inherit from `std::exception` or a standard exception
2. Override `what()` to return a descriptive message
3. Store additional context (error codes, failed operations, etc.)
4. Keep constructor simple and nothrow-safe

## Stack Unwinding: What Happens When an Exception is Thrown

When you throw an exception, several things happen:

```cpp
#include <iostream>

class Resource {
public:
    Resource(const std::string& name) : name(name) {
        std::cout << "Acquiring " << name << "\n";
    }

    ~Resource() {
        std::cout << "Releasing " << name << "\n";
    }

private:
    std::string name;
};

void level3() {
    Resource r3("level3");
    std::cout << "At level 3\n";
    throw std::runtime_error("Error at level 3!");
    std::cout << "This never executes\n";
}

void level2() {
    Resource r2("level2");
    std::cout << "At level 2\n";
    level3();
    std::cout << "Back to level 2\n";  // Never executes
}

void level1() {
    Resource r1("level1");
    std::cout << "At level 1\n";
    level2();
    std::cout << "Back to level 1\n";  // Never executes
}

int main() {
    try {
        level1();
    } catch (const std::exception& e) {
        std::cout << "Caught: " << e.what() << "\n";
    }

    return 0;
}
```

**Output:**
```
Acquiring level1
At level 1
Acquiring level2
At level 2
Acquiring level3
At level 3
Releasing level3
Releasing level2
Releasing level1
Caught: Error at level 3!
```

**What happened:**
1. Exception thrown at level 3
2. Stack unwinding begins — destructors called in reverse order
3. r3 destructor called (releases level3)
4. r2 destructor called (releases level2)
5. r1 destructor called (releases level1)
6. Exception caught at main level

**Critical insight**: Destructors run during stack unwinding. This is why RAII (Resource Acquisition Is Initialization) works so well with exceptions — your resources are automatically cleaned up.

## Exception Safety Guarantees: Levels of Commitment

Different functions provide different guarantees about exception safety:

### 1. No-Throw (noexcept) Guarantee

Function will **never throw an exception**. The exception stops the program if one occurs.

```cpp
void process(int x) noexcept {
    // This must not throw
    // If it does, std::terminate() is called
    int result = x * 2;
}

// Useful for cleanup functions
class Resource {
public:
    ~Resource() noexcept {
        // Destructors should never throw!
        cleanup();
    }
};
```

### 2. Basic Guarantee

If an exception is thrown, the program is in a **valid but unspecified state**. No resources leak, but data might be partially updated.

```cpp
class Account {
public:
    void transfer(Account& other, double amount) {
        // Basic guarantee: if exception occurs,
        // both accounts are in valid states
        // but money might not have transferred
        if (balance < amount) {
            throw std::insufficient_funds("Not enough balance");
        }

        balance -= amount;
        // If other.credit() throws here, we've already debited
        // Basic guarantee: both accounts are valid, just inconsistent
        other.credit(amount);
    }
};
```

### 3. Strong Guarantee (Transaction-Safe)

If an exception is thrown, the program is in the **same state as before** the function was called.

```cpp
class Account {
public:
    void transfer(Account& other, double amount) {
        // Strong guarantee: if exception occurs,
        // we roll back changes
        if (balance < amount) {
            throw std::insufficient_funds("Not enough balance");
        }

        double original_balance = balance;

        try {
            balance -= amount;
            other.credit(amount);  // Might throw
        } catch (...) {
            balance = original_balance;  // Roll back
            throw;  // Rethrow
        }
    }
};
```

Or use the copy-and-swap idiom for stronger guarantees:

```cpp
class Document {
private:
    std::string content;

public:
    void updateContent(const std::string& new_content) {
        // Copy-and-swap idiom: strong guarantee
        Document temp(*this);  // Copy (might throw)
        temp.content = new_content;  // Update copy
        swap(*this, temp);  // Swap is nothrow
        // If exception occurs before swap, original unchanged
    }
};
```

**Which guarantee to provide?**

- **No-throw**: Destructors, cleanup functions, rarely others
- **Basic**: Most functions (acceptable trade-off)
- **Strong**: Critical functions (transfers, transactions), but more expensive

## RAII and Exceptions: Why Smart Pointers Make Exception Handling Safe

RAII combined with exceptions is what makes modern C++ safe:

```cpp
#include <memory>
#include <iostream>

class Database {
public:
    Database() { std::cout << "Connection opened\n"; }
    ~Database() { std::cout << "Connection closed\n"; }

    void query(const std::string& sql) {
        if (sql.empty()) {
            throw std::invalid_argument("Empty query");
        }
        std::cout << "Executing: " << sql << "\n";
    }
};

void processData() {
    auto db = std::make_unique<Database>();  // RAII + smart pointer

    db->query("SELECT * FROM users");

    if (something_bad()) {
        throw std::runtime_error("Processing failed");
        // If exception thrown here:
        // 1. Stack unwinds
        // 2. db destructor called automatically
        // 3. Database connection closed
        // 4. No resource leak!
    }

    db->query("INSERT INTO log ...");
}

int main() {
    try {
        processData();
    } catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << "\n";
    }

    return 0;
}
```

**Why this is safe:**

1. `unique_ptr` (RAII) owns the database connection
2. When exception is thrown, stack unwinds
3. Destructors run automatically (including unique_ptr's)
4. Database connection is closed regardless of how we exit
5. No resource leaks

**This is the power of RAII + exceptions**: You write normal code, and resources are cleaned up automatically, even in error cases.

## noexcept Specifier: When and How to Use It

`noexcept` is a function specification saying "this function will not throw an exception."

```cpp
// Function that doesn't throw
void swap(int& a, int& b) noexcept {
    int temp = a;
    a = b;
    b = temp;  // Simple operations, can't throw
}

// Function that might throw
void divide(int a, int b) {  // Not marked noexcept
    if (b == 0) {
        throw std::division_by_zero();
    }
    return a / b;
}

// Can be conditional
template <typename T>
void move_if_noexcept(T& src, T& dst) noexcept(std::is_nothrow_move_constructible_v<T>) {
    // Only noexcept if T's move constructor doesn't throw
}
```

**When to use noexcept:**

```cpp
// YES - these should be noexcept
class Widget {
public:
    ~Widget() noexcept { }           // Destructors ALWAYS noexcept
    void swap(Widget& other) noexcept { }  // Simple operations

private:
    int data = 0;
};

// NO - these should NOT be noexcept
void parseJSON(const std::string& json) {  // Can fail
    // Parse and throw if invalid
}

std::string loadFile(const std::string& path) {  // Can fail
    // File I/O can throw
}
```

**Benefits of noexcept:**

1. Enables compiler optimizations
2. Communicates to users: "This won't throw"
3. Some functions require noexcept (move constructors in containers)

## When NOT to Use Exceptions

### 1. Performance-Critical Code

Exceptions have overhead: stack unwinding, allocating exception objects, etc. In tight loops, this matters.

```cpp
// NOT performance-critical: exceptions fine
void loadConfig() {
    if (file.open() fails) {
        throw ConfigurationException();
    }
}

// Performance-critical: avoid exceptions
void renderFrame() {
    // 60 FPS = 16.6ms per frame
    // Can't afford exception overhead
    for (int i = 0; i < 1000000; ++i) {
        if (validate_input(i)) {  // Use bool return, not exceptions
            process(i);
        }
    }
}
```

### 2. Destructors

Never throw exceptions in destructors. If a destructor throws while another exception is being handled, the program terminates.

```cpp
// WRONG
class FileHandle {
public:
    ~FileHandle() {
        if (!file.close()) {  // If this fails
            throw std::runtime_error("Failed to close");  // WRONG!
        }
    }
};

// RIGHT
class FileHandle {
public:
    ~FileHandle() noexcept {
        try {
            file.close();
        } catch (...) {
            // Log error, but don't throw from destructor
            std::cerr << "Warning: failed to close file\n";
        }
    }
};
```

### 3. C++ Interfacing with C

C doesn't understand exceptions. Wrap C functions:

```cpp
#include <cstdlib>

// C library function (doesn't throw)
extern "C" int c_compute(int x);

// C++ wrapper
int compute(int x) {
    int result = c_compute(x);
    if (result < 0) {
        throw std::runtime_error("Computation failed");
    }
    return result;
}
```

### 4. Code Where Error Codes Are Acceptable

Sometimes error codes are clearer:

```cpp
// Exceptions
try {
    User user = database.findUser(id);
} catch (const UserNotFoundException& e) {
    // handle
}

// Error codes
User user;
if (!database.findUser(id, user)) {
    // handle
}
```

For simple cases, error codes can be clearer. For complex code, exceptions usually win.

## Exception Handling vs Error Codes: Honest Trade-Offs

| Aspect | Exceptions | Error Codes |
|--------|-----------|-----------|
| **Clarity** | Separates happy path from error path | All paths mixed together |
| **Propagation** | Automatic, explicit | Must manually check and propagate |
| **Performance** | Overhead when used, zero when not thrown | Minimal overhead |
| **Debugging** | Stack trace preserved | Lost in function returns |
| **Forgetting to handle** | Obvious (exception propagates) | Easy to miss error code |
| **Complex cleanup** | Automatic (RAII) | Manual |
| **C compatibility** | Limited | Perfect |

**When to choose exceptions:**
- Complex operations with many failure points
- Cleanup must be automatic (RAII)
- Propagating errors through call stack

**When to choose error codes:**
- Simple operations with few failure modes
- C integration required
- Performance critical (tight loops)
- Embedded systems with strict requirements

## Common Mistakes with Exception Handling

### Mistake 1: Catching Too Broadly

```cpp
// WRONG - catches everything, hides bugs
try {
    processData();
} catch (...) {
    std::cout << "Something went wrong\n";
}

// BETTER - catch specific exceptions
try {
    processData();
} catch (const ValidationException& e) {
    std::cout << "Validation failed: " << e.what() << "\n";
} catch (const DatabaseException& e) {
    std::cout << "Database error: " << e.what() << "\n";
} catch (const std::exception& e) {
    std::cout << "Unexpected error: " << e.what() << "\n";
}
```

Catching everything hides bugs and makes debugging hard.

### Mistake 2: Not Using RAII

```cpp
// WRONG - manual cleanup
void processFile() {
    FILE* file = fopen("data.txt", "r");
    if (!file) {
        throw FileOpenException();  // Oops, file not closed
    }

    // Process file...

    fclose(file);  // Might not execute if exception thrown
}

// RIGHT - RAII cleanup
void processFile() {
    auto file = std::make_unique<FileStream>("data.txt");
    // Process file...
    // File automatically closed when function exits
}
```

### Mistake 3: Throwing in Destructors

```cpp
// WRONG
~Resource() {
    cleanup();  // If cleanup() throws, program terminates
}

// RIGHT
~Resource() noexcept {
    try {
        cleanup();
    } catch (...) {
        // Log, don't throw
    }
}
```

### Mistake 4: Catching by Value

```cpp
// WRONG - copies exception
try {
    operation();
} catch (std::exception e) {  // Copy!
    // e is a copy of the original
}

// RIGHT - reference, no copy
try {
    operation();
} catch (const std::exception& e) {  // Reference
    // e is reference to original
}
```

### Mistake 5: Not Using Custom Exceptions

```cpp
// WEAK - generic exceptions
throw std::runtime_error("User not found");
throw std::runtime_error("Invalid email");
throw std::runtime_error("Database connection failed");

// Caller can't distinguish types of errors
try {
    operation();
} catch (const std::runtime_error& e) {
    // Which error was it?
}

// STRONG - custom exceptions
class UserNotFoundException : public std::runtime_error { };
class InvalidEmailException : public std::runtime_error { };
class DatabaseException : public std::runtime_error { };

try {
    operation();
} catch (const UserNotFoundException& e) {
    // Specific handling
} catch (const InvalidEmailException& e) {
    // Different handling
}
```

## Conclusion: Exceptions Are a Tool, Not a Silver Bullet

Exception handling is a powerful feature of modern C++, but it's not a cure-all. The best error handling strategy depends on your context:

**Use exceptions when:**
- Operations can fail in multiple ways
- Errors need to propagate through many functions
- Cleanup is complex (RAII makes it automatic)
- You want to separate happy path from error path

**Use error codes when:**
- Simple operations with few failure modes
- Performance critical (tight loops)
- Interfacing with C
- You need predictable control flow

**Best practices:**

✓ Catch by const reference
✓ Inherit custom exceptions from std::exception
✓ Never throw in destructors
✓ Use RAII for automatic cleanup
✓ Make exception guarantees explicit
✓ Mark nothrow functions with noexcept
✓ Catch specific exceptions before generic ones
✓ Always use smart pointers with exceptions

Modern C++ combines exceptions with RAII to give you automatic, safe resource management. When used correctly, exceptions lead to cleaner, more maintainable code. When used carelessly, they create hard-to-debug control flow.

**Challenge yourself**: Take an existing function that uses error codes and rewrite it with exceptions. Compare the clarity and complexity. Which approach feels more natural for your use case?

The best code is robust code. Whether you achieve that with exceptions or error codes is less important than making a conscious, informed choice. Now you have the knowledge to make that choice wisely.

---

## Ready to Master C++ Completely?

Writing robust, error-safe C++ is a skill that sets professionals apart. The ebook has you covered.

**The C++ Better Explained Ebook** covers everything from fundamentals to advanced C++ — written in the same clear, practical style as this article. For just **$19**, you get:

- In-depth explanations of every core C++ concept
- Real-world code examples you can use immediately
- Chapters on memory management, OOP, templates, STL, and more
- Lifetime access and free updates

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles

Continue building your C++ knowledge with these guides:

- [Smart Pointers in Modern C++: unique_ptr, shared_ptr, and weak_ptr Explained](https://cppbetterexplained.com/posts/smart-pointers-cpp/)
- [Memory Management in C++: Heap vs Stack, new/delete, and Memory Leaks](https://cppbetterexplained.com/posts/memory-management-cpp/)
