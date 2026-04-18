---
title: "C++ Design Patterns Explained: Singleton, Factory, and Observer in Modern C++"
description: "Learn the most important C++ design patterns with modern C++17 code examples — Singleton, Factory Method, Observer, and more, explained clearly."
pubDatetime: 2025-04-05T00:00:00Z
author: "Sahil"
tags: ["C++", "design patterns", "advanced", "architecture", "modern C++"]
draft: false
featured: false
---

# C++ Design Patterns Explained: Singleton, Factory, and Observer in Modern C++

## Introduction: What Are Design Patterns and Why Should You Care?

Design patterns are proven solutions to common problems in software design. They're not code snippets you copy-paste—they're time-tested templates for solving recurring architectural challenges.

Think of design patterns like building blueprints. An architect doesn't invent a new foundation design for every building. Instead, they use proven patterns adapted to specific needs. The same applies to software design.

In C++, understanding design patterns is crucial because:

- **You avoid reinventing the wheel**: Someone has already solved this problem
- **Your code becomes more maintainable**: Other developers recognize the patterns
- **You design more flexibly**: Patterns help you anticipate future changes
- **You collaborate more effectively**: Shared vocabulary makes communication easier

In this guide, we'll explore the most important C++ design patterns with modern C++17 code examples, building mental models for when and how to use them.

## Design Pattern Categories: The Three Types

Design patterns fall into three broad categories:

**Creational Patterns** solve object creation problems. They decouple the creation of objects from their use.

**Structural Patterns** solve composition problems. They help you combine objects and classes into larger structures while keeping relationships clean and flexible.

**Behavioral Patterns** solve communication problems. They define how objects interact and distribute responsibility.

Let's explore the most important patterns in each category.

## Creational Patterns: How Objects Get Built

### The Singleton Pattern: Single Instance Guarantee

The Singleton pattern ensures a class has only one instance and provides global access to it. This is useful for resources that should exist only once: database connections, logging systems, configuration managers.

**The Problem**:

```cpp
class Logger {
private:
    // How do we prevent multiple instantiations?
    ofstream logFile;

public:
    Logger() {
        logFile.open("log.txt", ios::app);
    }

    void log(const string& message) {
        logFile << message << "\n";
    }
};

int main() {
    Logger log1;  // Creates first instance
    Logger log2;  // Creates second instance - BAD!
    Logger log3;  // Creates third instance - BAD!

    // Now we have three separate log files being written to!
    // This defeats the purpose of a central logger.

    return 0;
}
```

**The Singleton Solution**:

```cpp
// Modern C++ (thread-safe, elegant)
class Logger {
private:
    ofstream logFile;

    // Private constructor - prevents direct instantiation
    Logger() {
        logFile.open("log.txt", ios::app);
    }

    // Deleted copy operations
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;

public:
    // Public access point
    static Logger& getInstance() {
        static Logger instance;  // Created once, destroyed at program exit
        return instance;
    }

    void log(const string& message) {
        logFile << message << "\n";
    }

    ~Logger() {
        if (logFile.is_open()) {
            logFile.close();
        }
    }
};

// Usage
int main() {
    Logger::getInstance().log("Program started");

    // Both get the same instance
    Logger::getInstance().log("Message 1");
    Logger::getInstance().log("Message 2");

    // If you want a reference for repeated use
    Logger& logger = Logger::getInstance();
    logger.log("Message 3");

    return 0;
}
```

This uses C++'s **static initialization guarantee**: the `static` variable inside the function is initialized exactly once, even with multiple threads. This is the most elegant Singleton pattern in modern C++.

**Key advantages**:
- Guaranteed single instance
- Thread-safe (in C++11 and later)
- Lazy initialization (created when first accessed)
- No manual cleanup needed

**When to use it**:
- Logging systems
- Configuration managers
- Database connection pools
- Thread pools

**When NOT to use it**:
- When you need multiple instances for different contexts
- For testability issues (hard to mock)
- When simpler approaches work better

### The Factory Method Pattern: Creating Objects Without Specifying Their Type

The Factory pattern lets you create objects without specifying the exact classes. This is powerful when you have a hierarchy of classes and need to create the right one based on input data.

**The Problem Without Factory**:

```cpp
class TransportServer {
public:
    void processOrder(int shippingMethod) {
        // We need different transport types based on input
        // Without factory, this gets messy:
        Transport* transport;

        if (shippingMethod == 1) {
            transport = new Truck();
        } else if (shippingMethod == 2) {
            transport = new Ship();
        } else if (shippingMethod == 3) {
            transport = new Plane();
        } else {
            throw runtime_error("Unknown shipping method");
        }

        transport->deliver();
        delete transport;
    }
};
```

Problems:
- Violates the Single Responsibility Principle
- Hard to add new transport types
- The creation logic is scattered everywhere you need transports

**The Factory Solution**:

```cpp
// Base class for all transports
class Transport {
public:
    virtual void deliver() = 0;
    virtual ~Transport() {}
};

class Truck : public Transport {
public:
    void deliver() override {
        cout << "Delivering by truck (land route)\n";
    }
};

class Ship : public Transport {
public:
    void deliver() override {
        cout << "Delivering by ship (sea route)\n";
    }
};

class Plane : public Transport {
public:
    void deliver() override {
        cout << "Delivering by plane (air route)\n";
    }
};

// The Factory - responsible for creation logic
class TransportFactory {
public:
    static unique_ptr<Transport> createTransport(int method) {
        switch (method) {
            case 1:
                return make_unique<Truck>();
            case 2:
                return make_unique<Ship>();
            case 3:
                return make_unique<Plane>();
            default:
                throw runtime_error("Unknown transport type");
        }
    }

    // Alternative: create from string identifiers
    static unique_ptr<Transport> createByName(const string& type) {
        if (type == "truck") return make_unique<Truck>();
        if (type == "ship") return make_unique<Ship>();
        if (type == "plane") return make_unique<Plane>();
        throw runtime_error("Unknown transport: " + type);
    }
};

class TransportServer {
public:
    void processOrder(int shippingMethod) {
        // Clean and simple
        unique_ptr<Transport> transport =
            TransportFactory::createTransport(shippingMethod);
        transport->deliver();

        // No manual cleanup needed with unique_ptr
    }
};

int main() {
    TransportServer server;

    server.processOrder(1);  // Truck
    server.processOrder(2);  // Ship
    server.processOrder(3);  // Plane

    // Creating directly from configuration
    auto transport = TransportFactory::createByName("plane");
    transport->deliver();

    return 0;
}
```

**Advanced Factory with Registration**:

For even more flexibility, factories can automatically register new types:

```cpp
class TransportFactory {
private:
    using Creator = function<unique_ptr<Transport>()>;
    static map<string, Creator>& getRegistry() {
        static map<string, Creator> registry;
        return registry;
    }

public:
    // Register a transport type
    template<typename T>
    static void registerType(const string& name) {
        getRegistry()[name] = []() { return make_unique<T>(); };
    }

    // Create from registered type
    static unique_ptr<Transport> create(const string& name) {
        auto& registry = getRegistry();
        auto it = registry.find(name);
        if (it == registry.end()) {
            throw runtime_error("Unknown transport: " + name);
        }
        return it->second();
    }
};

// Registration happens once, early in program
struct RegisterTransports {
    RegisterTransports() {
        TransportFactory::registerType<Truck>("truck");
        TransportFactory::registerType<Ship>("ship");
        TransportFactory::registerType<Plane>("plane");
    }
};

static RegisterTransports registerOnStartup;
```

### The Builder Pattern: Constructing Complex Objects Step by Step

Builder pattern helps construct complex objects step by step. It's ideal when objects have many optional parameters.

**The Problem Without Builder**:

```cpp
// Without builder - multiple constructors (constructor hell)
class DatabaseConnection {
public:
    // Which constructor do you use?
    DatabaseConnection(const string& host);
    DatabaseConnection(const string& host, int port);
    DatabaseConnection(const string& host, int port, const string& user);
    DatabaseConnection(const string& host, int port, const string& user,
                      const string& password);
    DatabaseConnection(const string& host, int port, const string& user,
                      const string& password, int timeout);
    // ... and so on
};

// Calling it is confusing
DatabaseConnection conn("localhost", 5432, "admin", "secret", 30);
// What do 30 mean? Timeout? Pool size? Unclear!
```

**The Builder Solution**:

```cpp
class DatabaseConnection {
private:
    string host;
    int port;
    string user;
    string password;
    int timeout;
    bool useSSL;
    int poolSize;

    // Private constructor - only Builder can call it
    DatabaseConnection(const string& h, int p, const string& u,
                      const string& pw, int t, bool ssl, int size)
        : host(h), port(p), user(u), password(pw),
          timeout(t), useSSL(ssl), poolSize(size) {}

    friend class Builder;

public:
    // Getters
    const string& getHost() const { return host; }
    int getPort() const { return port; }
    // ... etc

    // The Builder class
    class Builder {
    private:
        string host = "localhost";
        int port = 5432;
        string user = "admin";
        string password;
        int timeout = 30;
        bool useSSL = false;
        int poolSize = 10;

    public:
        Builder& setHost(const string& h) {
            host = h;
            return *this;  // Return reference for chaining
        }

        Builder& setPort(int p) {
            port = p;
            return *this;
        }

        Builder& setUser(const string& u) {
            user = u;
            return *this;
        }

        Builder& setPassword(const string& pw) {
            password = pw;
            return *this;
        }

        Builder& setTimeout(int t) {
            timeout = t;
            return *this;
        }

        Builder& enableSSL() {
            useSSL = true;
            return *this;
        }

        Builder& setPoolSize(int size) {
            poolSize = size;
            return *this;
        }

        // Build the actual object
        DatabaseConnection build() {
            if (password.empty()) {
                throw runtime_error("Password must be set");
            }
            return DatabaseConnection(host, port, user, password,
                                     timeout, useSSL, poolSize);
        }
    };
};

// Usage - clear and flexible
int main() {
    DatabaseConnection conn = DatabaseConnection::Builder()
        .setHost("db.example.com")
        .setPort(3306)
        .setUser("appuser")
        .setPassword("secret123")
        .setTimeout(60)
        .enableSSL()
        .setPoolSize(20)
        .build();

    cout << "Connected to " << conn.getHost()
         << ":" << conn.getPort() << "\n";

    return 0;
}
```

**Advantages**:
- Clear, readable construction
- Optional parameters without overloading
- Parameter validation in `build()`
- Easy to add new parameters
- Fluent interface (method chaining)

## Structural Patterns: Composing Objects Elegantly

### The Adapter Pattern: Making Incompatible Interfaces Work Together

Adapter pattern converts the interface of one class into another interface clients expect. It's useful when you have existing code that you can't modify but need to work with incompatible interfaces.

**The Problem**:

```cpp
// Old legacy system
class OldPaymentSystem {
public:
    void processPayment(double amount, const string& cardNumber) {
        cout << "Old system processing $" << amount << "\n";
    }
};

// New system you're building
class NewPaymentProcessor {
public:
    virtual void executeTransaction(const string& id, double value) = 0;
    virtual ~NewPaymentProcessor() {}
};

// Problem: Old system doesn't implement NewPaymentProcessor interface
// We need to adapt it!
```

**The Adapter Solution**:

```cpp
// Adapter - converts old interface to new interface
class PaymentSystemAdapter : public NewPaymentProcessor {
private:
    OldPaymentSystem oldSystem;

public:
    void executeTransaction(const string& id, double value) override {
        // Convert new interface to old interface
        cout << "Adapter translating request...\n";
        oldSystem.processPayment(value, id);  // Map parameters
    }
};

// Now old system works with new code
int main() {
    vector<unique_ptr<NewPaymentProcessor>> processors;

    // Mix old and new systems seamlessly
    processors.push_back(make_unique<PaymentSystemAdapter>());

    for (auto& processor : processors) {
        processor->executeTransaction("CARD-12345", 99.99);
    }

    return 0;
}
```

### RAII as a Structural Pattern

Resource Acquisition Is Initialization (RAII) is a fundamental C++ pattern that combines object creation with resource management.

```cpp
// Without RAII - manual management (error-prone)
void processFile() {
    FILE* file = fopen("data.txt", "r");
    if (!file) return;

    // If any of this throws, file is never closed!
    char buffer[1024];
    fgets(buffer, sizeof(buffer), file);
    cout << buffer << "\n";

    fclose(file);
}

// With RAII - automatic management (safe)
class FileManager {
private:
    FILE* file;

public:
    FileManager(const string& filename) {
        file = fopen(filename.c_str(), "r");
        if (!file) {
            throw runtime_error("Failed to open file");
        }
    }

    // Resource is cleaned up when object destroyed
    ~FileManager() {
        if (file) fclose(file);
    }

    // Delete copying to avoid double-close
    FileManager(const FileManager&) = delete;
    FileManager& operator=(const FileManager&) = delete;

    string readline() {
        char buffer[1024];
        if (fgets(buffer, sizeof(buffer), file)) {
            return string(buffer);
        }
        return "";
    }
};

void processFile() {
    FileManager file("data.txt");  // Acquires resource

    cout << file.readline() << "\n";

    // Resource automatically released when file goes out of scope
    // Even if exception is thrown!
}
```

## Behavioral Patterns: Defining How Objects Interact

### The Observer Pattern: Pub-Sub Communication

Observer pattern defines one-to-many dependency between objects. When one object changes state, all observers are notified automatically. It's fundamental to event-driven programming.

**The Problem Without Observer**:

```cpp
// Without observer - tight coupling
class StockPrice {
private:
    double price;
    vector<EmailAlert*> alerts;  // Tightly coupled!

public:
    void setPrice(double p) {
        price = p;

        // Tight coupling - StockPrice knows about specific alerts
        for (auto alert : alerts) {
            alert->sendEmail();  // What if we need SMS? Slack? Log file?
        }
    }
};
```

**The Observer Solution**:

```cpp
// Observer interface
class PriceObserver {
public:
    virtual void onPriceChanged(double newPrice) = 0;
    virtual ~PriceObserver() {}
};

// Concrete observers
class EmailAlert : public PriceObserver {
public:
    void onPriceChanged(double newPrice) override {
        cout << "Email: Stock price changed to $" << newPrice << "\n";
    }
};

class SMSAlert : public PriceObserver {
public:
    void onPriceChanged(double newPrice) override {
        cout << "SMS: Stock price changed to $" << newPrice << "\n";
    }
};

class LoggingAlert : public PriceObserver {
public:
    void onPriceChanged(double newPrice) override {
        cout << "LOG: Price changed to $" << newPrice << "\n";
    }
};

// Subject (Observable)
class StockPrice {
private:
    double price = 0;
    vector<unique_ptr<PriceObserver>> observers;

public:
    void attach(unique_ptr<PriceObserver> observer) {
        observers.push_back(move(observer));
    }

    void setPrice(double newPrice) {
        if (newPrice == price) return;  // No change

        price = newPrice;
        notifyObservers();
    }

private:
    void notifyObservers() {
        for (auto& observer : observers) {
            observer->onPriceChanged(price);
        }
    }
};

int main() {
    StockPrice apple;

    // Add observers - can add as many as needed
    apple.attach(make_unique<EmailAlert>());
    apple.attach(make_unique<SMSAlert>());
    apple.attach(make_unique<LoggingAlert>());

    cout << "Setting price to $150\n";
    apple.setPrice(150.0);

    cout << "\nSetting price to $155\n";
    apple.setPrice(155.0);

    return 0;
}
```

Output:
```
Setting price to $150
Email: Stock price changed to $150
SMS: Stock price changed to $150
LOG: Price changed to $150

Setting price to $155
Email: Stock price changed to $155
SMS: Stock price changed to $155
LOG: Price changed to $155
```

**Modern C++ with std::function**:

```cpp
class StockPrice {
private:
    double price = 0;
    vector<function<void(double)>> observers;

public:
    void attach(function<void(double)> callback) {
        observers.push_back(callback);
    }

    void setPrice(double newPrice) {
        if (newPrice == price) return;
        price = newPrice;

        // Notify all observers
        for (auto& callback : observers) {
            callback(price);
        }
    }
};

int main() {
    StockPrice apple;

    // Attach lambda functions - much more flexible!
    apple.attach([](double p) {
        cout << "Email alert: $" << p << "\n";
    });

    apple.attach([](double p) {
        cout << "SMS alert: $" << p << "\n";
    });

    apple.setPrice(150.0);

    return 0;
}
```

### The Strategy Pattern: Swappable Algorithms

Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable.

**The Problem Without Strategy**:

```cpp
class PaymentProcessor {
private:
    int paymentMethod;  // 1=Credit, 2=PayPal, 3=Bitcoin

public:
    bool process(double amount) {
        if (paymentMethod == 1) {
            // Credit card logic
            cout << "Processing credit card...\n";
        } else if (paymentMethod == 2) {
            // PayPal logic
            cout << "Processing PayPal...\n";
        } else if (paymentMethod == 3) {
            // Bitcoin logic
            cout << "Processing Bitcoin...\n";
        }
        return true;
    }
};

// Problem: Adding new payment methods requires modifying this class
```

**The Strategy Solution**:

```cpp
// Strategy interface
class PaymentStrategy {
public:
    virtual bool process(double amount) = 0;
    virtual ~PaymentStrategy() {}
};

// Concrete strategies
class CreditCardStrategy : public PaymentStrategy {
public:
    bool process(double amount) override {
        cout << "Processing credit card payment of $" << amount << "\n";
        cout << "Validating card details...\n";
        return true;
    }
};

class PayPalStrategy : public PaymentStrategy {
public:
    bool process(double amount) override {
        cout << "Processing PayPal payment of $" << amount << "\n";
        cout << "Redirecting to PayPal...\n";
        return true;
    }
};

class BitcoinStrategy : public PaymentStrategy {
public:
    bool process(double amount) override {
        cout << "Processing Bitcoin payment of $" << amount << "\n";
        cout << "Generating wallet address...\n";
        return true;
    }
};

// Context - uses strategies
class PaymentProcessor {
private:
    unique_ptr<PaymentStrategy> strategy;

public:
    void setPaymentStrategy(unique_ptr<PaymentStrategy> s) {
        strategy = move(s);
    }

    bool processPayment(double amount) {
        if (!strategy) {
            throw runtime_error("Payment strategy not set");
        }
        return strategy->process(amount);
    }
};

int main() {
    PaymentProcessor processor;

    // Choose strategy at runtime
    processor.setPaymentStrategy(make_unique<CreditCardStrategy>());
    processor.processPayment(99.99);

    cout << "\n";

    processor.setPaymentStrategy(make_unique<PayPalStrategy>());
    processor.processPayment(49.99);

    cout << "\n";

    processor.setPaymentStrategy(make_unique<BitcoinStrategy>());
    processor.processPayment(0.005);

    return 0;
}
```

### The Command Pattern: Encapsulating Requests as Objects

Command pattern encapsulates a request as an object, allowing parameterization and queuing of requests.

```cpp
// Command interface
class Command {
public:
    virtual void execute() = 0;
    virtual ~Command() {}
};

// Receiver - the object that performs the work
class Light {
public:
    void turnOn() { cout << "Light is ON\n"; }
    void turnOff() { cout << "Light is OFF\n"; }
};

// Concrete commands
class TurnOnCommand : public Command {
private:
    Light& light;
public:
    TurnOnCommand(Light& l) : light(l) {}
    void execute() override { light.turnOn(); }
};

class TurnOffCommand : public Command {
private:
    Light& light;
public:
    TurnOffCommand(Light& l) : light(l) {}
    void execute() override { light.turnOff(); }
};

// Invoker - executes commands
class RemoteControl {
private:
    vector<unique_ptr<Command>> commands;

public:
    void addCommand(unique_ptr<Command> cmd) {
        commands.push_back(move(cmd));
    }

    void executeAll() {
        for (auto& cmd : commands) {
            cmd->execute();
        }
    }
};

int main() {
    Light light;
    RemoteControl remote;

    // Build sequence of commands
    remote.addCommand(make_unique<TurnOnCommand>(light));
    remote.addCommand(make_unique<TurnOffCommand>(light));
    remote.addCommand(make_unique<TurnOnCommand>(light));

    // Execute all at once
    remote.executeAll();

    return 0;
}
```

## Modern C++ Features That Improve Patterns

Modern C++ gives us powerful tools that simplify pattern implementation:

**Smart Pointers**:
```cpp
// Old way - manual memory management
Shape* shape = new Circle(5.0);
// ... remember to delete later

// Modern way - automatic cleanup
unique_ptr<Shape> shape = make_unique<Circle>(5.0);
// Automatically deleted when out of scope
```

**Lambdas**:
```cpp
// Observer with lambda - no need for separate classes
subject.attach([](double price) {
    cout << "Price is now: " << price << "\n";
});
```

**std::variant** (C++17):
```cpp
// Type-safe variant instead of void pointers
variant<int, double, string> value;
value = 42;
// Get type-safe access
if (holds_alternative<int>(value)) {
    cout << get<int>(value) << "\n";
}
```

**std::function**:
```cpp
// Flexible callback storage
vector<function<void(int)>> callbacks;
callbacks.push_back([](int x) { cout << x << "\n"; });
```

## Anti-Patterns: What to Avoid

### The Singleton Anti-Pattern

Singletons are overused. Consider these alternatives:

```cpp
// Problem: Singleton is a global variable in disguise
Logger& logger = Logger::getInstance();

// Better: Pass as dependency
void processData(Logger& logger) {
    logger.log("Processing...");
}

// Best: Use dependency injection
class DataProcessor {
private:
    Logger& logger;
public:
    DataProcessor(Logger& l) : logger(l) {}
    void process() { logger.log("Processing..."); }
};
```

### The Abstract Factory Explosion

Don't create factories for everything:

```cpp
// Over-engineered
class ShapeFactoryFactory {
public:
    ShapeFactory* createFactory(const string& type);
};

// Often simpler direct approach works fine
unique_ptr<Shape> createShape(const string& type);
```

## Conclusion: Mastering Design Patterns

Design patterns are mental models for solving common problems. They're not rules—they're guidelines. Use them when they solve a problem, not because they're in a textbook.

Key takeaways:

1. **Understand the problem first**: Why do you need this pattern?
2. **Know the trade-offs**: Patterns add complexity
3. **Use modern C++**: Smart pointers, lambdas, and `std::function` simplify pattern implementation
4. **Refactor toward patterns**: Don't design with patterns; refactor into them
5. **Avoid over-engineering**: The simplest solution is often best

The three patterns we explored—Singleton, Factory, and Observer—are among the most useful. Master these, and you'll handle most architectural challenges.

**Ready to take your C++ architecture to the next level?** Design patterns combine with virtual functions to create flexible, maintainable systems. What pattern does your codebase need most?

---

## Take Your C++ Further

If you're looking to go deeper with C++, the **[C++ Better Explained Ebook](https://start.cppbetterexplained.com/tw-sales-page)** is perfect for you — whether you're a complete beginner or looking to solidify your understanding. Just **$19**.

👉 **[Get the C++ Better Explained Ebook — $19](https://start.cppbetterexplained.com/tw-sales-page)**

---

## Related Articles
- [Object-Oriented Programming in C++: Classes, Objects, and Constructors Explained](/posts/oop-in-cpp/) — design patterns build directly on OOP fundamentals; master classes and inheritance first.
- [Virtual Functions and Polymorphism in C++: How Runtime Dispatch Actually Works](/posts/virtual-functions-polymorphism-cpp/) — polymorphism powers many design patterns, including Factory and Observer.
- [C++ Templates From Scratch: Generic Programming Explained Simply](/posts/cpp-templates-explained/) — templates enable powerful generic versions of classic patterns.

