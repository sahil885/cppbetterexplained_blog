---
title: "C++ Segmentation Fault: What It Is and How to Fix It"
description: "Learn what causes segmentation faults in C++ and how to fix them. Covers null pointer dereference, array out of bounds, stack overflow, dangling pointers, and how to use AddressSanitizer to find memory bugs."
pubDatetime: 2026-05-16T00:00:00Z
author: "Sahil"
tags: ["C++", "debugging", "pointers", "errors", "tutorial"]
faqSchema:
  - question: "What is a segmentation fault in C++?"
    answer: "A segmentation fault (segfault) is a runtime error that occurs when a program tries to access memory it doesn't own — such as dereferencing a null pointer, reading past the end of an array, or accessing freed memory. The OS detects the illegal memory access and terminates the program."
  - question: "How do I fix a segmentation fault in C++?"
    answer: "The most common fixes are: check pointers for null before dereferencing, ensure array indices are within bounds, avoid accessing memory after it's been freed, and initialize all pointers. Use AddressSanitizer (-fsanitize=address) to pinpoint the exact line causing the segfault."
  - question: "What is AddressSanitizer and how do I use it?"
    answer: "AddressSanitizer (ASan) is a memory error detector built into GCC and Clang. Compile with: g++ -fsanitize=address -g your_file.cpp -o program. When a memory error occurs, ASan prints a detailed report showing the exact line, type of error, and stack trace — making segfaults much easier to diagnose."
draft: false
featured: false
---

# C++ Segmentation Fault: What It Is and How to Fix It

A segmentation fault (often shortened to "segfault") is one of the most common runtime errors in C++. Your program crashes with no useful message — just `Segmentation fault (core dumped)`.

This happens when your program tries to access memory it doesn't own. The operating system catches this and terminates your program immediately.

This guide explains the most common causes, how to find them, and how to fix them.

---

## What Causes a Segmentation Fault?

Segfaults all come down to one thing: **illegal memory access**. Here are the most common ways it happens.

---

### 1. Null Pointer Dereference

Dereferencing a pointer that is `nullptr` (or uninitialized) is the most common cause:

```cpp
int* p = nullptr;
*p = 42;  // Segfault — p points to address 0, which you don't own
```

```cpp
int* p;   // Uninitialized — contains garbage address
*p = 42;  // Segfault — accessing random memory
```

**Fix:** Always initialize pointers. Check for null before dereferencing:
```cpp
int* p = nullptr;
if (p != nullptr) {
    *p = 42;
}
```

---

### 2. Array Out of Bounds

C++ doesn't check array bounds. Accessing past the end of an array reads (or writes) memory that belongs to something else:

```cpp
int arr[5] = {1, 2, 3, 4, 5};
cout << arr[10];  // Undefined behavior — may segfault, may print garbage
arr[100] = 99;    // Very likely to segfault
```

**Fix:** Always verify indices are within [0, size):
```cpp
int index = 10;
if (index >= 0 && index < 5) {
    cout << arr[index];
}
```

Or use `std::vector` with `.at()` which throws `std::out_of_range`:
```cpp
vector<int> v = {1, 2, 3, 4, 5};
cout << v.at(10);  // Throws exception instead of silently reading garbage
```

---

### 3. Stack Overflow (Infinite Recursion)

Every function call takes up stack space. Infinite recursion fills the stack completely, causing a segfault:

```cpp
int forever(int n) {
    return forever(n - 1);  // No base case — segfault after ~10,000 calls
}
```

**Fix:** Make sure every recursive function has a reachable base case:
```cpp
int factorial(int n) {
    if (n == 0) return 1;       // Base case — recursion stops here
    return n * factorial(n - 1);
}
```

---

### 4. Dangling Pointer (Accessing Freed Memory)

Using a pointer after the memory it points to has been freed:

```cpp
int* p = new int(42);
delete p;          // Memory freed
cout << *p;        // Dangling pointer — segfault or garbage
```

```cpp
int* p;
{
    int x = 10;
    p = &x;        // p points to local variable x
}
// x is now out of scope and destroyed
cout << *p;        // Dangling pointer — segfault
```

**Fix:** Set pointers to `nullptr` after deleting, and don't return addresses of local variables:
```cpp
int* p = new int(42);
delete p;
p = nullptr;       // Safe — dereferencing nullptr is detectable
```

---

### 5. Writing to Read-Only Memory

```cpp
char* str = "hello";  // String literal — stored in read-only memory
str[0] = 'H';         // Segfault — can't write to read-only memory
```

**Fix:** Use an array or `std::string` instead:
```cpp
char str[] = "hello";   // Array — writable copy
str[0] = 'H';           // Fine

// Or:
string s = "hello";
s[0] = 'H';             // Fine
```

---

## How to Find a Segfault

### AddressSanitizer (Best Option)

Compile with `-fsanitize=address -g` and run your program. When a memory error occurs, ASan prints exactly what went wrong and where:

```bash
g++ -fsanitize=address -g program.cpp -o program
./program
```

Output looks like this:
```
==12345==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x...
READ of size 4 at 0x... thread T0
    #0 0x... in main program.cpp:8
```

It tells you the type of error, the file, and the line number. This is by far the fastest way to find memory bugs.

---

### GDB (GNU Debugger)

GDB can show you the exact line where a segfault occurred:

```bash
g++ -g program.cpp -o program   # Compile with debug symbols
gdb ./program                   # Start GDB
(gdb) run                       # Run program
(gdb) backtrace                 # Show call stack when crash occurred
```

The backtrace shows every function call leading to the crash.

---

### Valgrind

Valgrind catches memory errors including segfaults and reports them in detail:

```bash
valgrind ./program
```

It's slower than ASan but catches some errors that ASan misses.

---

## Common Segfault Checklist

When you get a segfault, check these in order:

1. **Are you dereferencing a null or uninitialized pointer?** Add null checks before every `*p` or `->`.
2. **Are your array indices in bounds?** Check every `arr[i]` — is `i` between 0 and size-1?
3. **Do you have infinite recursion?** Check that every recursive function has a reachable base case.
4. **Are you using a pointer after `delete`?** Set pointers to `nullptr` after freeing them.
5. **Are you returning a reference or pointer to a local variable?** Don't — local variables are destroyed when the function returns.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## Quick Examples

**Segfault:**
```cpp
int* p = nullptr;
cout << *p;   // ❌ Crash
```

**Fixed:**
```cpp
int x = 42;
int* p = &x;
cout << *p;   // ✅ Prints 42
```

---

**Segfault:**
```cpp
int arr[3];
arr[5] = 10;  // ❌ Out of bounds
```

**Fixed:**
```cpp
int arr[3];
if (5 < 3) arr[5] = 10;  // ✅ Bounds check (won't execute)
```

---

## Related Articles

- [C++ Error Messages Explained](/posts/cpp-error-messages/) — understanding what the compiler tells you
- [How to Use Pointers in C++](/posts/pointers-in-cpp/) — avoiding pointer bugs from the start
- [Memory Management in C++](/posts/memory-management-cpp/) — heap, stack, new/delete
- [C++ Recursion Tutorial](/posts/cpp-recursion-tutorial/) — avoid infinite recursion

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
