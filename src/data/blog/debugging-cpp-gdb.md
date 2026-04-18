---
title: "Debugging C++ with GDB: A Practical Step-by-Step Guide"
description: "Struggling to debug C++ programs? This practical GDB guide teaches you to set breakpoints, inspect variables, trace crashes, and debug segfaults — step by step."
pubDatetime: 2025-04-05T00:00:00Z
author: "Sahil"
tags: ["C++", "debugging", "GDB", "tools", "intermediate"]
draft: false
featured: false
---

# Debugging C++ with GDB: A Practical Step-by-Step Guide

## Introduction: Why Debugging Skill Separates Good Developers from Great Ones

Debugging is an art form. A program that crashes with a cryptic error message, a memory leak that only manifests under load, a segmentation fault that vanishes when you add print statements—these are the battles that separate developers who struggle from those who thrive.

Many developers rely on print statements and vague error messages. But with **GDB** (GNU Debugger), you gain a superpower: you can pause your program at any point, inspect the state of every variable, step through code line by line, and understand exactly what went wrong before the crash.

This guide teaches you GDB from scratch. We'll start with the fundamentals and work toward real-world debugging scenarios. You'll learn to debug segmentation faults, memory errors, and multithreaded programs with confidence.

## What is GDB and Why Use It?

GDB is a command-line tool that lets you control program execution and inspect its state. Think of it as a remote control for your program: you can pause it, step forward one line at a time, set checkpoints (breakpoints), and examine the contents of every variable.

**Why not just use print statements?**

- Print statements disappear in production code (or you forget to remove them)
- You can't inspect state without recompiling and re-running
- Print statements in multithreaded code create race conditions
- Some bugs only appear at runtime, not in controlled reruns

**Why not use an IDE debugger?**

IDEs like CLion and Visual Studio have graphical debuggers (which use GDB under the hood on Linux). But learning GDB directly teaches you how debugging actually works and makes you independent of any particular IDE. Plus, you'll often find yourself on a remote server where only GDB is available.

## Compiling with Debug Symbols (-g Flag)

Before you can debug, you must compile with the `-g` flag to include debug symbols. Without them, GDB doesn't know the correspondence between machine code and your source code.

```bash
# Without debug symbols (debugger can't help much)
g++ -O2 program.cpp -o program

# With debug symbols (what you want)
g++ -g -O0 program.cpp -o program
```

Note: Use `-O0` (no optimization) when debugging. Optimizations reorder code and skip variables, making the debugger confusing. Once you've fixed the bug, recompile with `-O2` or `-O3` for performance.

For CMake projects:

```cmake
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -g -O0")
```

## Starting GDB

Run GDB on your executable:

```bash
gdb ./program
```

GDB will start and display:

```
GNU gdb (GDB) 12.1
...
Reading symbols from ./program...
(gdb)
```

The `(gdb)` prompt is where you type commands. Type `quit` to exit.

### GDB Commands Cheat Sheet

Before we dive deep, here's a quick reference:

| Command | What it does |
|---------|------------|
| `run [args]` | Start the program (optionally with arguments) |
| `break` (or `b`) | Set a breakpoint |
| `continue` (or `c`) | Resume execution after a breakpoint |
| `next` (or `n`) | Execute one line (steps over function calls) |
| `step` (or `s`) | Execute one line (steps into function calls) |
| `print` (or `p`) | Display a variable's value |
| `backtrace` (or `bt`) | Show the call stack |
| `quit` | Exit GDB |

Now let's use these in practice.

## Setting Breakpoints: By Line Number, Function Name, and Conditionally

A **breakpoint** pauses execution at a specific location so you can inspect the state.

### Breakpoint by Line Number

```bash
(gdb) break program.cpp:42
Breakpoint 1 at 0x1234: file program.cpp, line 42.
```

When the program reaches line 42, it pauses.

### Breakpoint by Function Name

```bash
(gdb) break main
Breakpoint 1 at 0x1234: file program.cpp, line 15.
```

Breaks at the start of the `main()` function.

### Conditional Breakpoint

Pause only when a condition is true:

```bash
(gdb) break program.cpp:42 if x > 100
Breakpoint 1 at 0x1234: file program.cpp, line 42.
```

This breakpoint only triggers when `x > 100`. Extremely useful when you're looping and only interested in a specific iteration.

### Listing Breakpoints

```bash
(gdb) info break
Num     Type           Disp Enb Address    What
1       breakpoint     keep y   0x00001234 file program.cpp, line 42
```

### Deleting and Disabling Breakpoints

```bash
(gdb) delete 1        # Delete breakpoint 1
(gdb) disable 1       # Disable without deleting
(gdb) enable 1        # Re-enable
```

## Inspecting Variables and Memory

### The print Command

Display a variable's current value:

```bash
(gdb) print x
$1 = 42

(gdb) print myVector
$2 = std::vector of length 3, capacity 4 = {1, 2, 3}

(gdb) print name
$3 = 0x1234567890ab "Alice"
```

Use `$N` to refer to the last N results:

```bash
(gdb) print x + 10
$5 = 52

(gdb) print $5 * 2
$6 = 104
```

### Watching Variables: display

The `display` command prints a variable every time execution pauses:

```bash
(gdb) display x
1: x = 42

(gdb) next
46     x = x + 1;

1: x = 43
```

Now `x` is shown after each `next` or `step` command. Use `undisplay N` to remove it.

### Examining Memory: examine Command

Directly inspect memory:

```bash
(gdb) examine/4x 0x1234  # Show 4 hex values starting at address 0x1234
0x1234:  0xdeadbeef  0xcafebabe  0xdeadbabe  0xfeedface
```

The format is `examine/[count][format] [address]`:
- Count: how many units to show
- Format: `x` (hex), `d` (decimal), `s` (string), `c` (char), `i` (instruction)

### Examining Data Structures

Pretty-print complex types using the Python API (if available):

```bash
(gdb) print -pretty-print myStruct
```

Or inspect members explicitly:

```bash
(gdb) print myStruct.member
(gdb) print myStruct->pointer_member
```

## Navigating the Call Stack with backtrace

When the program pauses, you're in a specific function at a specific line. But how did you get there? The **call stack** shows the chain of function calls.

```bash
(gdb) backtrace
#0  error_function () at program.cpp:50
#1  0x00001234 in middle_function () at program.cpp:30
#2  0x00005678 in main () at program.cpp:10
```

This means: `error_function` was called from `middle_function`, which was called from `main`.

Move up and down the stack to inspect variables in different contexts:

```bash
(gdb) up    # Move to the caller's frame (middle_function)
(gdb) print x    # x in middle_function's scope
(gdb) down  # Move back to error_function
```

This is incredibly useful when a crash happens deep in the call stack. You can trace back to understand the chain of events.

## Debugging Segmentation Faults: A Step-by-Step Walkthrough

Segmentation faults (segfaults) crash your program by accessing invalid memory. Let's debug one.

**Example buggy code:**

```cpp
#include <iostream>

void bad_function(int* ptr) {
    *ptr = 42;  // Dangerous!
}

int main() {
    int* null_ptr = nullptr;
    bad_function(null_ptr);  // Passing null pointer
    return 0;
}
```

**Compile with debug info:**

```bash
g++ -g -O0 segfault.cpp -o segfault
```

**Run in GDB:**

```bash
(gdb) run
Program received signal SIGSEGV, Segmentation fault.
0x000000000040111f in bad_function (ptr=0x0) at segfault.cpp:5
5         *ptr = 42;
```

GDB catches the segfault and shows exactly where it happened. The `ptr=0x0` tells us the pointer is null.

**Get the full picture:**

```bash
(gdb) backtrace
#0  0x000000000040111f in bad_function (ptr=0x0) at segfault.cpp:5
#1  0x0000000000401136 in main () at segfault.cpp:10

(gdb) frame 1   # Move to main's frame
(gdb) print null_ptr
$1 = (int *) 0x0
```

Now you can see the entire chain: `main` called `bad_function` with a null pointer, which dereferenced it and crashed.

## Debugging Memory Errors with AddressSanitizer (ASan)

GDB is great for catching crashes, but **AddressSanitizer** detects memory errors *before* they crash (or cause silent corruption).

Compile with `-fsanitize=address`:

```bash
g++ -g -O0 -fsanitize=address program.cpp -o program
./program
```

ASan will report heap overflows, use-after-free, and memory leaks:

```
=================================================================
    ERROR: AddressSanitizer: heap-buffer-overflow on unknown address 0x60200000dffc
```

Much clearer than a segfault! ASan tells you exactly what type of error and where the bad memory was allocated.

Pair ASan with GDB for even more detail:

```bash
gdb ./program
(gdb) run
(ASan detects error and program exits with info)
```

## Watchpoints: Breaking When a Variable Changes

A **watchpoint** breaks whenever a variable's value changes. Use this when you know a variable gets corrupted but can't find where.

```cpp
int x = 10;
// ... complex code ...
// x somehow becomes -5, but where?
```

**In GDB:**

```bash
(gdb) break program.cpp:10    # Pause in the function
(gdb) run
(gdb) watch x                 # Break when x changes
Watchpoint 1: x

(gdb) continue
Watchpoint 1: x changed: old value = 10, new value = -5
```

Now you know exactly where the corruption happened!

## Debugging Multithreaded Programs with GDB

Multithreading adds complexity to debugging. GDB can handle it:

```bash
(gdb) info threads        # List all threads
  Id   Target Id           Frame
  1    Thread 0x123 "main" main () at program.cpp:20
  2    Thread 0x456 "worker" worker_func () at program.cpp:50
* 3    Thread 0x789 "worker" worker_func () at program.cpp:55

(gdb) thread 2            # Switch to thread 2
(gdb) backtrace           # Show thread 2's call stack
(gdb) print thread_local_var  # Inspect thread 2's variables
```

Set breakpoints that trigger for specific threads:

```bash
(gdb) break program.cpp:50 thread 2    # Break in thread 2 only
```

Or break when all threads hit a point:

```bash
(gdb) set scheduler-locking on         # Stop all threads at breakpoints
(gdb) set scheduler-locking step       # Stop all threads only during step
(gdb) set scheduler-locking off        # Let other threads run (default)
```

## Core Dump Analysis

When a program crashes, the OS can save a memory snapshot called a **core dump**. Analyze it with GDB even after the crash:

**Enable core dumps (Linux):**

```bash
ulimit -c unlimited
```

**Run program:**

```bash
./program
Segmentation fault (core dumped)
```

**Analyze the core dump:**

```bash
gdb ./program core
(gdb) backtrace    # See where it crashed
(gdb) print x      # Inspect variables at crash time
```

Core dumps are invaluable for post-mortem debugging—you don't need to rerun the program.

## GDB with VS Code and CLion Integration

Modern IDEs integrate GDB for point-and-click debugging:

**VS Code:**
- Install the C/C++ extension
- Set breakpoints by clicking the line number
- Debug with F5 (requires `.vscode/launch.json` configuration)

**CLion:**
- Built-in debugger wraps GDB
- Set breakpoints visually
- Inspect variables in the GUI
- Less typing, same power

While GDB is powerful from the command line, IDEs make the workflow faster for iterative development.

## Tips for Faster Debugging Workflows

1. **Use abbreviations**: Type `b` for `break`, `c` for `continue`, `n` for `next`

2. **Rerun with different arguments**: Use the `run` command repeatedly
   ```bash
   (gdb) run arg1 arg2
   (program crashes)
   (gdb) run arg3 arg4    # Different args
   ```

3. **Define custom commands**: Automate repeated debugging sequences
   ```bash
   (gdb) define debug_loop
   break program.cpp:42
   run
   print x
   end
   ```

4. **Use .gdbinit**: Put your GDB customizations in `~/.gdbinit`
   ```bash
   # ~/.gdbinit
   set pagination off        # Don't pause output
   set print pretty on       # Pretty-print STL containers
   ```

5. **Record and replay (for tricky bugs)**:
   ```bash
   (gdb) record       # Start recording execution
   (run some steps)
   (gdb) reverse-step # Go backwards in time!
   ```

   Record/replay is slow but incredibly useful for intermittent bugs.

6. **Scripting GDB**: Automate debugging with Python
   ```bash
   (gdb) python
   > print("Analyzing threads...")
   > continue
   ```

## Practical Debugging Scenario: Finding a Memory Leak

Imagine a program that slowly leaks memory. The code runs fine for the first minute, then gets progressively slower.

**Strategy:**

1. Compile with ASan: `g++ -g -O0 -fsanitize=address program.cpp -o program`
2. Run: `./program`
3. ASan reports: `ERROR: LeakSanitizer: detected memory leaks`
4. Check the allocation stack: ASan shows which line allocated the leaked memory
5. Use GDB to set a breakpoint on that line and inspect the context

**Without ASan**, you'd need:
1. Add breakpoints at suspected leak sites
2. Print variable lifetimes
3. Manually inspect when pointers are freed
4. Much harder and slower

This is why modern C++ debugging combines GDB with tools like ASan.

## Conclusion

GDB transforms debugging from guesswork into a methodical process. You don't have to recompile, add print statements, or hope the error reproduces. Instead, you pause execution, inspect state, and understand exactly what went wrong.

Master these techniques:
- Breakpoints (line, function, conditional)
- Stepping and stack navigation
- Variable inspection and watchpoints
- Multithreading support
- Integrating with AddressSanitizer

Combine GDB with modern tools and your IDE's graphical interface, and you'll debug faster and more confidently than developers relying on print statements.

**What's the most frustrating bug you've had to track down? Try using GDB next time—you might be surprised how quickly you find it.**

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles
- [How to Fix Undefined Reference Errors in C++ (Linker Errors Explained)](/posts/undefined-reference-linker-errors-cpp/) — linker errors are among the most confusing bugs in C++; learn to fix them systematically.
- [Breakdown of a Simple C++ Program Step by Step](/posts/breakdown-simple-cpp-program/) — understanding the compilation pipeline helps you debug faster.
- [Exception Handling in C++: Best Practices for Writing Robust, Error-Free Code](/posts/exception-handling-cpp/) — combine GDB debugging skills with exception handling to write bulletproof C++ code.

