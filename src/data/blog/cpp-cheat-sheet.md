---
title: "C++ Cheat Sheet: Quick Reference for Syntax, STL, and OOP"
description: "A complete C++ cheat sheet covering syntax, data types, control flow, functions, OOP, pointers, STL containers, and modern C++ features. Bookmark this."
pubDatetime: 2026-04-20T00:00:00Z
author: "Sahil"
tags: ["C++", "beginner", "intermediate", "tutorial", "basics"]
draft: false
featured: false
faqSchema:
  - question: "What are the basic data types in C++?"
    answer: "The fundamental C++ data types are: int (integer numbers), double (floating-point numbers), float (single-precision floating-point), char (single character), bool (true/false), and void (no value). C++ also has size variants like short, long, and long long for integers, and unsigned versions of each."
  - question: "What is the difference between cout and cin in C++?"
    answer: "cout (character output) is used to print output to the console — you push data into it with the << operator. cin (character input) is used to read input from the keyboard — you pull data from it with the >> operator. Both are part of the <iostream> header."
  - question: "What are the most important STL containers in C++?"
    answer: "The most commonly used STL containers are: std::vector (dynamic array, use by default), std::string (text), std::map (key-value pairs, sorted), std::unordered_map (key-value pairs, O(1) lookup), std::set (unique sorted values), and std::queue / std::stack (FIFO and LIFO structures). Vector covers the majority of everyday use cases."
  - question: "What is the difference between struct and class in C++?"
    answer: "In C++, struct and class are nearly identical — the only difference is default access: struct members are public by default, class members are private by default. Conventionally, struct is used for simple data containers with no or minimal methods, while class is used for objects with behaviour and encapsulation."
---

# C++ Cheat Sheet: Quick Reference for Syntax, STL, and OOP

A quick-reference guide to the C++ features you'll use most. Bookmark this page and come back whenever you need a reminder on syntax, STL containers, or modern C++ patterns.

---

## Basics

### Program Structure

```cpp
#include <iostream>   // Include the iostream header for input/output
using namespace std;  // Optional: lets you write cout instead of std::cout

int main() {
    // Your code goes here
    cout << "Hello, World!" << endl;
    return 0;  // 0 = success
}
```

### Output and Input

```cpp
cout << "Hello";           // Print to console
cout << "Hello" << endl;   // Print with newline
cout << x << " " << y;    // Print multiple values

cin >> x;                  // Read one value from keyboard
cin >> x >> y;             // Read multiple values
getline(cin, str);         // Read entire line (including spaces)
```

---

## Data Types

```cpp
int x = 42;              // Integer (-2B to +2B on 32-bit)
long long big = 1e18;    // Large integer
double pi = 3.14159;     // Double-precision float (use this, not float)
float f = 3.14f;         // Single-precision float (less precise)
char c = 'A';            // Single character
bool flag = true;        // true or false
string s = "hello";      // Text — requires #include <string>
auto val = 42;           // Compiler infers the type (C++11)
```

### Type Conversions

```cpp
int x = (int)3.7;        // C-style cast → 3 (truncates)
int y = static_cast<int>(3.7);  // C++ style (preferred) → 3
double d = static_cast<double>(5) / 2;  // → 2.5 (not 2)
```

---

## Control Flow

### If / Else

```cpp
if (x > 0) {
    cout << "positive";
} else if (x < 0) {
    cout << "negative";
} else {
    cout << "zero";
}

// Ternary operator
string result = (x > 0) ? "positive" : "not positive";
```

### Switch

```cpp
switch (day) {
    case 1:
        cout << "Monday";
        break;
    case 2:
        cout << "Tuesday";
        break;
    default:
        cout << "Other";
        break;
}
```

### Loops

```cpp
// For loop
for (int i = 0; i < 10; i++) {
    cout << i << " ";
}

// Range-based for loop (C++11) — use this when possible
vector<int> nums = {1, 2, 3, 4, 5};
for (int n : nums) {
    cout << n << " ";
}
for (auto& n : nums) { n *= 2; }  // Modify with reference

// While loop
int i = 0;
while (i < 10) {
    cout << i++;
}

// Do-while loop
do {
    cout << i;
} while (i < 10);

// Loop control
break;      // Exit the loop immediately
continue;   // Skip to the next iteration
```

---

## Functions

```cpp
// Basic function
int add(int a, int b) {
    return a + b;
}

// Default parameters
void greet(string name = "World") {
    cout << "Hello, " << name << "!";
}

// Pass by reference (modifies the original)
void increment(int& x) {
    x++;
}

// Pass by const reference (efficient, read-only)
void print(const string& s) {
    cout << s;
}

// Function overloading — same name, different parameters
double area(double radius);
double area(double width, double height);

// Inline function (hint to compiler)
inline int square(int x) { return x * x; }
```

---

## Pointers and References

```cpp
int x = 42;
int* ptr = &x;      // ptr holds the address of x
int val = *ptr;     // Dereference: val = 42
*ptr = 100;         // Modify x through the pointer: x is now 100

int& ref = x;       // ref is an alias for x
ref = 200;          // x is now 200

// Null pointer
int* p = nullptr;   // Always initialise to nullptr if no address yet
if (p != nullptr) { *p = 5; }  // Always check before dereferencing

// Pointer arithmetic
int arr[] = {10, 20, 30};
int* p = arr;       // Points to arr[0]
p++;                // Now points to arr[1]
cout << *p;         // 20
```

For a full explanation, see [How to Use Pointers in C++](/posts/pointers-in-cpp/).

---

## Arrays and Strings

```cpp
// C-style array (fixed size)
int nums[5] = {1, 2, 3, 4, 5};
int size = sizeof(nums) / sizeof(nums[0]);  // Get array length

// std::string
#include <string>
string s = "hello";
s += " world";          // Concatenation
s.length();             // 11
s.substr(0, 5);         // "hello"
s.find("world");        // 6
s[0];                   // 'h'
s.empty();              // false
to_string(42);          // "42"
stoi("42");             // 42 (string to int)
```

---

## OOP: Classes and Objects

```cpp
class Animal {
private:
    string name;    // Private: only accessible inside the class
    int age;

public:
    // Constructor
    Animal(string n, int a) : name(n), age(a) {}

    // Getter
    string getName() const { return name; }

    // Method
    void speak() const {
        cout << name << " makes a sound." << endl;
    }

    // Destructor (runs when object is destroyed)
    ~Animal() {}
};

// Inheritance
class Dog : public Animal {
public:
    Dog(string n, int a) : Animal(n, a) {}

    void speak() const override {    // override keyword (C++11)
        cout << getName() << " barks!" << endl;
    }
};

// Usage
Animal a("Cat", 3);
a.speak();

Dog d("Rex", 5);
d.speak();

// Polymorphism
Animal* ptr = new Dog("Buddy", 2);
ptr->speak();    // Calls Dog::speak() if speak() is virtual
delete ptr;
```

---

## Memory Management

```cpp
// Stack allocation (automatic, fast)
int x = 10;         // Created on the stack, destroyed when scope ends

// Heap allocation (manual)
int* p = new int(42);    // Allocate on heap
delete p;                // Must free manually
p = nullptr;             // Avoid dangling pointer

int* arr = new int[10];  // Heap array
delete[] arr;            // Use delete[] for arrays

// Smart pointers (C++11) — prefer these over raw new/delete
#include <memory>
auto uptr = make_unique<int>(42);     // unique_ptr: one owner
auto sptr = make_shared<int>(42);     // shared_ptr: shared ownership
// No delete needed — memory is freed automatically
```

See [Memory Management in C++](/posts/memory-management-cpp/) and [Smart Pointers in C++](/posts/smart-pointers-cpp/) for full guides.

---

## STL Containers

### vector (dynamic array — use this by default)

```cpp
#include <vector>
vector<int> v = {1, 2, 3};
v.push_back(4);         // Add to end
v.pop_back();           // Remove from end
v.size();               // Number of elements
v[0];                   // Access by index (no bounds check)
v.at(0);                // Access by index (with bounds check)
v.front(); v.back();    // First and last element
v.empty();              // true if empty
v.clear();              // Remove all elements

// Iterate
for (auto& x : v) { cout << x; }
```

### map (sorted key-value pairs)

```cpp
#include <map>
map<string, int> scores;
scores["Alice"] = 95;
scores["Bob"] = 87;
scores.count("Alice");  // 1 if key exists, 0 if not
scores.erase("Bob");

for (auto& [key, val] : scores) {   // C++17 structured binding
    cout << key << ": " << val;
}
```

### unordered_map (O(1) average lookup)

```cpp
#include <unordered_map>
unordered_map<string, int> freq;
freq["hello"]++;
freq.find("hello") != freq.end();  // Check if key exists
```

### set (unique sorted values)

```cpp
#include <set>
set<int> s = {3, 1, 4, 1, 5};  // Duplicates removed: {1, 3, 4, 5}
s.insert(2);
s.count(3);    // 1 if present, 0 if not
s.erase(3);
```

### queue and stack

```cpp
#include <queue>
queue<int> q;
q.push(1); q.push(2);
q.front();    // Access front element (1)
q.pop();      // Remove front element

#include <stack>
stack<int> st;
st.push(1); st.push(2);
st.top();     // Access top element (2)
st.pop();     // Remove top element
```

---

## Modern C++ Features (C++11 and Beyond)

```cpp
// auto type inference
auto x = 42;           // int
auto s = "hello"s;     // std::string
auto v = vector<int>{1,2,3};

// Lambda expressions
auto add = [](int a, int b) { return a + b; };
cout << add(3, 4);    // 7

// Lambda capturing variables
int mult = 3;
auto triple = [mult](int x) { return x * mult; };

// Range-based for with structured bindings (C++17)
map<string, int> m = {{"a", 1}, {"b", 2}};
for (auto& [key, val] : m) {
    cout << key << "=" << val;
}

// nullptr (use instead of NULL)
int* p = nullptr;

// Initialiser lists
vector<int> v = {1, 2, 3, 4, 5};

// Move semantics
vector<int> v2 = std::move(v);  // Transfer v's data to v2; v is now empty

// constexpr (compile-time constant)
constexpr int MAX = 100;
constexpr int square(int x) { return x * x; }
```

---

## Useful Standard Library Headers

```cpp
#include <iostream>    // cout, cin, endl
#include <string>      // std::string
#include <vector>      // std::vector
#include <map>         // std::map
#include <unordered_map> // std::unordered_map
#include <set>         // std::set
#include <queue>       // std::queue, std::priority_queue
#include <stack>       // std::stack
#include <algorithm>   // sort, find, min, max, reverse, etc.
#include <cmath>       // sqrt, pow, abs, floor, ceil
#include <cstdlib>     // rand, srand, exit
#include <ctime>       // time (for seeding rand)
#include <fstream>     // File I/O
#include <sstream>     // stringstream
#include <memory>      // unique_ptr, shared_ptr, make_unique, make_shared
#include <thread>      // std::thread
#include <mutex>       // std::mutex
```

---

## Common Algorithms (`<algorithm>`)

```cpp
#include <algorithm>
vector<int> v = {3, 1, 4, 1, 5, 9};

sort(v.begin(), v.end());               // Ascending sort
sort(v.begin(), v.end(), greater<int>()); // Descending sort

auto it = find(v.begin(), v.end(), 5);  // Find element
if (it != v.end()) { /* found */ }

int count = count(v.begin(), v.end(), 1); // Count occurrences

reverse(v.begin(), v.end());

int mx = *max_element(v.begin(), v.end());
int mn = *min_element(v.begin(), v.end());
```

---

## Quick Lookup: Common Mistakes

| Mistake | Problem | Fix |
|---|---|---|
| `if (x = 5)` | Assignment, not comparison | `if (x == 5)` |
| `int arr[5]; arr[5] = 1;` | Out-of-bounds access | Use valid indices 0–4 |
| `int* p; *p = 5;` | Uninitialized pointer | `int* p = nullptr;` first |
| `delete ptr; *ptr = 1;` | Dangling pointer | `ptr = nullptr` after delete |
| `new int[10]; delete p;` | Wrong delete for array | Use `delete[]` |
| Integer division: `5/2 = 2` | Truncates decimals | `5.0/2` or cast to double |
| Missing `break` in switch | Falls through to next case | Add `break` after each case |

---

Ready to go deeper? Follow the [structured C++ learning roadmap →](/learn-cpp/)

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**
