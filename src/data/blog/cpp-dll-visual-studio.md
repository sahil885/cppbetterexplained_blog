---
title: "How to Create a C++ DLL in Visual Studio (Step by Step)"
description: "Learn how to create a C++ DLL in Visual Studio, export functions with __declspec(dllexport), and use the DLL from another app — a clear, beginner-friendly walkthrough."
modDatetime: 2026-07-05T00:00:00Z
pubDatetime: 2026-05-30T00:00:00Z
author: "Sahil"
tags: ["C++", "Visual Studio", "DLL", "Windows", "tutorial"]
draft: false
featured: false
faqSchema:
  - question: "What is a DLL in C++?"
    answer: "A DLL (Dynamic Link Library) is a compiled file containing functions and data that multiple programs can share at runtime. Instead of building the same code into every executable, you put it in a DLL once and link to it. This keeps programs smaller, lets you update shared code without recompiling every app, and allows different languages to use the same library."
  - question: "How do I create a DLL in Visual Studio?"
    answer: "In Visual Studio, choose File > New > Project, set the project type to Dynamic-link Library (DLL), and create it. Add a header that exports your functions using a macro built on __declspec(dllexport), implement the functions in a .cpp file, then build the solution. Visual Studio produces both a .dll file and a .lib import library."
  - question: "What is the difference between __declspec(dllexport) and __declspec(dllimport)?"
    answer: "__declspec(dllexport) marks a function or class as available for other programs to use — you apply it when building the DLL itself. __declspec(dllimport) tells the compiler that a function lives in an external DLL — you apply it when using the DLL from another program. The standard pattern uses a single macro that switches between the two automatically depending on whether you're building or consuming the DLL."
  - question: "Why does my program say it cannot find the DLL?"
    answer: "At runtime, Windows must be able to locate the .dll file. The most common fix is to copy the .dll into the same folder as your .exe. Windows also searches the system PATH and a few system folders. Note that the .lib import library is only needed at compile/link time, but the .dll itself is required when the program actually runs."
  - question: "What is the .lib file generated alongside the DLL?"
    answer: "When you build a DLL that exports symbols, Visual Studio generates an import library (.lib) in addition to the .dll. This small .lib file is not a static library — it just contains the information the linker needs to connect your client program to the functions inside the DLL. You link against the .lib at build time, and the .dll is loaded at run time."
---

# How to Create a C++ DLL in Visual Studio (Step by Step)

A DLL (Dynamic Link Library) lets you package C++ code into a reusable component that other programs can load at runtime. It's how Windows shares code between applications — and once you understand the pattern, it's straightforward.

This guide walks you through creating a C++ DLL in Visual Studio, exporting a function from it, and then calling that function from a separate program. We'll build a tiny math library as the example.

## What Is a DLL (and Why Use One)?

A DLL is a compiled file full of functions and data that multiple programs can use _without_ baking the code into each one. Think of it as a shared toolbox: write the tools once, then any program can open the box and use them.

Why bother?

- **Reuse.** Write a feature once and share it across several applications.
- **Smaller executables.** The shared code lives in the DLL, not duplicated in every `.exe`.
- **Update without recompiling everything.** Fix a bug in the DLL, ship the new DLL, and existing apps pick it up.
- **Language interop.** A C++ DLL can be called from other languages, including C#, Python, and more.

The trade-off is that the DLL has to be present and findable when the program runs — more on that pitfall later.

## What You'll Need

- **Visual Studio** (the free Community edition is fine) with the **Desktop development with C++** workload installed. If you don't have it yet, see the [C++ setup guide](/posts/cpp-setup-guide/).
- A basic grasp of [C++ functions](/posts/cpp-functions-tutorial/) and [header files](/posts/cpp-header-files/) — that's all the background this needs.

## Step 1: Create the DLL Project

1. Open Visual Studio and choose **File > New > Project**.
2. In the **Create a new project** dialog, set **Language** to **C++**, **Platform** to **Windows**, and **Project type** to **Library**.
3. From the filtered list, select **Dynamic-link Library (DLL)** and click **Next**.
4. Name the project `MathLibrary`, leave the default location, and click **Create**.

Visual Studio generates the project with a couple of helper files (a precompiled header, `pch.h` / `pch.cpp`). You don't need to touch those for now.

## Step 2: Add a Header That Exports Your Function

A DLL is only useful if other programs can see its functions. You make a function visible — or _exported_ — using `__declspec(dllexport)`.

Add a header file: right-click the project, choose **Add > New Item**, select **Header File (.h)**, and name it `MathLibrary.h`. Then add this:

```cpp
#pragma once

#ifdef MATHLIBRARY_EXPORTS
#define MATHLIBRARY_API __declspec(dllexport)
#else
#define MATHLIBRARY_API __declspec(dllimport)
#endif

extern "C" MATHLIBRARY_API double Add(double a, double b);
```

This little block is the heart of building a DLL, so let's unpack it.

### Understanding the export macro

You want the _same_ header to work in two situations: when **building** the DLL, and when **using** it from another program. The macro handles both:

- When you build the DLL, Visual Studio automatically defines `MATHLIBRARY_EXPORTS` (it's `PROJECTNAME_EXPORTS` for any DLL project). So `MATHLIBRARY_API` becomes `__declspec(dllexport)` — "make this function available to others."
- When another program includes the header, that symbol is **not** defined, so `MATHLIBRARY_API` becomes `__declspec(dllimport)` — "this function lives in an external DLL."

One header, two behaviors, no manual switching. That's the standard Windows DLL pattern.

### What does `extern "C"` do here?

C++ "mangles" function names (encodes parameter info into the symbol name). `extern "C"` turns that off so the exported name stays clean and predictable — which makes the DLL much easier to call from other languages and tools. For a simple C-style function like `Add`, it's the safe choice. If you're new to how declarations and definitions split across files, the [header files guide](/posts/cpp-header-files/) is worth a read.

## Step 3: Implement the Function

Open `MathLibrary.cpp` (or add it) and write the actual code. Include the precompiled header if your project uses one, then your own header:

```cpp
#include "pch.h"        // remove this line if your project has no pch
#include "MathLibrary.h"

double Add(double a, double b)
{
    return a + b;
}
```

Notice the implementation itself has no `__declspec` on it — the export attribute belongs on the **declaration** in the header.

## Step 4: Build the DLL

Choose **Build > Build Solution** (or press **Ctrl+Shift+B**). When it succeeds, look in your project's output folder (for example, `x64\Debug`). You'll find two files that matter:

- **`MathLibrary.dll`** — the actual library that gets loaded at runtime.
- **`MathLibrary.lib`** — the _import library_. This is **not** a static library; it's a small file that tells the linker how to connect a client program to the functions inside the DLL.

Hold on to both. You'll use the `.lib` when compiling the client, and the `.dll` when running it.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

## Step 5: Create a Program That Uses the DLL

Now let's call `Add` from a separate application.

1. Add a new project to the solution: **File > Add > New Project**, choose **Console App** (C++), and name it `MathClient`.
2. Write code that uses the function:

```cpp
#include <iostream>
#include "MathLibrary.h"

int main()
{
    double result = Add(3.5, 4.0);
    std::cout << "3.5 + 4.0 = " << result << "\n";
    return 0;
}
```

For this to compile and run, you need to connect three things: the **header**, the **`.lib`**, and the **`.dll`**.

### Point the client at the header

In the client project's properties, under **C/C++ > General > Additional Include Directories**, add the folder that contains `MathLibrary.h`. (Alternatively, just copy the header into the client project.)

### Link against the import library

The cleanest way is to let Visual Studio handle it: right-click the client project, choose **Add > Reference**, and check **MathLibrary**. Visual Studio then links the `.lib` automatically.

If you prefer to wire it up manually:

- **Linker > General > Additional Library Directories** → the folder containing `MathLibrary.lib`.
- **Linker > Input > Additional Dependencies** → add `MathLibrary.lib`.

### Make the DLL findable at runtime

This is the step everyone forgets. The `.lib` gets you through compiling, but when the program _runs_, Windows still needs the actual `MathLibrary.dll`.

The simplest fix: **copy `MathLibrary.dll` into the same folder as your client `.exe`** (its output folder, e.g. `x64\Debug`). You can automate this with a post-build step, but copying it by hand is fine while you're learning.

Set `MathClient` as the startup project and run it. You should see:

```text
3.5 + 4.0 = 7.5
```

That's a working DLL, called from a separate program.

## Common Problems and Fixes

**"Cannot find MathLibrary.dll" at runtime.** The `.dll` isn't next to your `.exe`. Copy it into the executable's output folder. Remember: the `.lib` is a _compile-time_ dependency; the `.dll` is a _run-time_ one.

**"Unresolved external symbol" when linking.** The client found the header (so it knows `Add` exists) but not the import library. Double-check the reference to the DLL project, or that `MathLibrary.lib` is listed in **Additional Dependencies** with the correct library directory.

**The function name looks mangled / other languages can't call it.** You likely dropped `extern "C"`. Add it to keep C-style linkage for exported functions.

**Architecture mismatch (x86 vs x64).** The DLL and the client must target the same platform. If the DLL is x64, build the client as x64 too. Mixing them causes load failures.

**You changed the DLL but the client still uses the old behavior.** Rebuild the DLL, then copy the **new** `.dll` next to the `.exe` again. It's easy to keep running a stale copy.

## How Do You Compile C++ Code Into a DLL?

In Visual Studio: create a **Dynamic-link Library (DLL)** project, mark the functions you want to expose with `__declspec(dllexport)`, and build — the compiler produces a `.dll` (the library) and a `.lib` (the import library used at link time). Steps 1–4 above walk through it with full code.

## How Do You Add an Existing DLL to a Visual Studio Project?

Three things are required: point the project at the DLL's **header file** (Properties → C/C++ → Additional Include Directories), link against its **`.lib` import library** (Properties → Linker → Input → Additional Dependencies), and make sure the **`.dll` file sits next to your `.exe`** at runtime (or on the PATH). Step 5 above shows each setting.

## Quick Recap

Creating a C++ DLL in Visual Studio comes down to five moves:

1. Create a **Dynamic-link Library (DLL)** project.
2. Export functions with a macro built on **`__declspec(dllexport)` / `__declspec(dllimport)`**.
3. Implement the functions in a `.cpp` file.
4. **Build** to produce the `.dll` and its `.lib` import library.
5. In the client, **include the header, link the `.lib`, and place the `.dll` next to the `.exe`.**

Once that loop clicks, you can package anything — math routines, file utilities, whole class libraries — into reusable DLLs.

Want to strengthen the fundamentals that DLLs build on, like functions, headers, and how compilation and linking actually work? That's exactly what this site is for:

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

## Watch the Video Tutorial

Some people learn better by watching. Here's a video walkthrough that covers the same material:

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZPss6v6vMwc?si=7XYEc-g6fqLZVT2B" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Related Guides

- [How to Set Up C++: Install a Compiler and Write Your First Program](/posts/cpp-setup-guide/) — get Visual Studio and a working C++ environment ready.
- [C++ Header Files Explained: Splitting Code into .h and .cpp](/posts/cpp-header-files/) — the declaration-vs-definition idea that DLL exports rely on.
- [C++ Functions Tutorial: How to Write and Use Functions](/posts/cpp-functions-tutorial/) — the building blocks you'll be exporting.
- [Undefined Reference and Linker Errors in C++: How to Fix Them](/posts/undefined-reference-linker-errors-cpp/) — for when linking the DLL goes wrong.
- [Learn C++ from Scratch: The Complete Beginner Roadmap](/learn-cpp/) — the full structured learning path.
