---
title: "Union in C++: What It Is and When You Should Use One"
description: "Learn what a union is in C++, how it shares one block of memory between members, how it differs from a struct, and when a tagged union is the safe choice."
pubDatetime: 2026-08-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "memory", "tutorial"]
faqSchema:
  - question: "What is a union in C++?"
    answer: "A union is a user-defined type whose members all share the same block of memory. Only one member holds a valid value at a time, and writing to one member overwrites the others. Its size equals the size of its largest member."
  - question: "What is the difference between a struct and a union in C++?"
    answer: "A struct gives every member its own storage, so all members hold valid values at once and its size is roughly the sum of its members. A union gives all members the same storage, so only one is valid at a time and its size matches the largest member."
  - question: "Is it safe to read a different union member than the one you wrote?"
    answer: "No. In C++ reading a member you did not write is undefined behaviour, even though many compilers appear to allow it. Store a separate tag telling you which member is active, or use std::variant, which enforces this for you."
draft: false
featured: false
---

# Union in C++: What It Is and When You Should Use One

A `struct` is like a chest of drawers — every member gets its own drawer, and they all hold something at once. A `union` is like a single drawer with a label that changes: everything shares one space, and only one thing can be in there at a time.

That sounds like a downgrade until you hit the problem unions solve: a value that could be *one of several types*, where you'd rather not pay for all of them.

---

## Declaring and Using a Union

The syntax looks exactly like a `struct`, with one keyword changed:

```cpp
#include <iostream>

union Value {
    int i;
    float f;
    char c;
};

int main() {
    Value v;

    v.i = 65;
    std::cout << "As int: " << v.i << "\n";

    v.c = 'A';                       // overwrites the same bytes
    std::cout << "As char: " << v.c << "\n";

    std::cout << "sizeof(Value) = " << sizeof(Value) << "\n";
}
```

Output on a typical system:

```
As int: 65
As char: A
sizeof(Value) = 4
```

Three members, but only 4 bytes total — the size of the largest one (`int` and `float` are both 4 bytes here; `char` is 1). The equivalent `struct` would be 12 bytes, because each member gets its own storage.

---

## Union vs Struct: The Memory Picture

This is the whole difference, and it's worth seeing side by side:

```cpp
#include <iostream>

struct AsStruct { int a; int b; };
union  AsUnion  { int a; int b; };

int main() {
    AsStruct s;
    s.a = 10;
    s.b = 20;
    std::cout << "struct: a=" << s.a << " b=" << s.b << "\n";

    AsUnion u;
    u.a = 10;
    u.b = 20;                        // clobbers a — same bytes
    std::cout << "union:  a=" << u.a << " b=" << u.b << "\n";
}
```

```
struct: a=10 b=20
union:  a=20 b=20
```

The struct kept both. The union has one `int` worth of memory that you can spell two ways, so writing `b` changed `a` too. This is not a bug — it is the entire point.

<div class="inline-cta">If you're looking to go deeper with C++, the <a href="https://start.cppbetterexplained.com/tw-sales-page">C++ Better Explained Ebook</a> is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just $19.</div>

---

## The Rule Everyone Breaks

Here is the part most tutorials skip: **in C++, reading a union member other than the one you last wrote is undefined behaviour.**

```cpp
union Value { int i; float f; };

Value v;
v.f = 3.14f;
std::cout << v.i;      // UNDEFINED BEHAVIOUR — do not do this
```

It will usually "work" and print some large meaningless integer, because the compiler just reinterprets the bytes. But undefined behaviour means the compiler is free to assume it never happens, and optimised builds can do genuinely surprising things. Don't rely on it.

(Type punning like this *is* legal in C, which is why so much advice about it is wrong when applied to C++. In C++ use `std::bit_cast` in C++20, or `std::memcpy` before that.)

---

## The Safe Pattern: A Tagged Union

Since the union can't tell you which member is active, you store that yourself — a small `enum` alongside it:

```cpp
#include <iostream>
#include <string>

struct Field {
    enum class Kind { Int, Double, Char } kind;

    union {
        int    i;
        double d;
        char   c;
    };
};

void print(const Field& f) {
    switch (f.kind) {
        case Field::Kind::Int:    std::cout << "int: "    << f.i << "\n"; break;
        case Field::Kind::Double: std::cout << "double: " << f.d << "\n"; break;
        case Field::Kind::Char:   std::cout << "char: "   << f.c << "\n"; break;
    }
}

int main() {
    Field a;
    a.kind = Field::Kind::Int;
    a.i = 42;

    Field b;
    b.kind = Field::Kind::Double;
    b.d = 2.5;

    print(a);
    print(b);
}
```

```
int: 42
double: 2.5
```

Now every read goes through the tag, so you can never read the wrong member — as long as you remember to set the tag every time you write. That "as long as you remember" is the weak point, and it's exactly what the standard library fixed.

---

## The Modern Replacement: `std::variant`

Since C++17 you rarely need a raw union. `std::variant` is a tagged union that maintains the tag for you and throws if you ask for the wrong type:

```cpp
#include <iostream>
#include <variant>
#include <string>

int main() {
    std::variant<int, double, std::string> v;

    v = 42;
    std::cout << std::get<int>(v) << "\n";

    v = std::string("hello");
    std::cout << std::get<std::string>(v) << "\n";

    // std::get<int>(v);   // throws std::bad_variant_access — caught, not silent
}
```

`std::variant` also handles members with constructors and destructors, which a raw union cannot do without you calling them by hand. For new code, reach for `std::variant` first.

---

## When Is a Raw Union Still the Right Answer?

Three cases, all fairly specialised:

- **Memory-constrained code** — embedded systems where the few bytes saved genuinely matter.
- **Interoperating with C APIs** — many C libraries pass tagged unions in their structs, and you must match their layout exactly.
- **Reading binary file or network formats** — where a header field means different things depending on a type byte.

Outside of those, a `struct`, an `enum`, or a `std::variant` will express what you mean more clearly and more safely.

---

## Related Articles

- [C++ Structs Explained](/posts/cpp-structs-explained/)
- [struct vs class in C++: What's the Difference?](/posts/cpp-struct-vs-class/)
- [C++ Enum Tutorial: Named Constants and enum class Explained](/posts/cpp-enum-tutorial/)
- [C++ sizeof Operator Explained](/posts/cpp-sizeof-operator/)
- [C++ Variables and Data Types: A Complete Beginner's Guide](/posts/cpp-variables-data-types/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
