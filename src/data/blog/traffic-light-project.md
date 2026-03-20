---
title: "C++ Traffic Light Project - Detailed Explanation with Source Code"
description: "Learn how to build a C++ traffic light project using classes, bitwise operators, and command line arguments. Full source code included."
pubDatetime: 2024-10-02T00:00:00Z
author: "Sahil"
tags: ["C++", "OOP", "beginner", "project", "classes", "bitwise operators", "command line arguments"]
draft: false
featured: true
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/s_bZiyLZQDc" title="C++ Traffic Light Project" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

A C++ traffic light project is one of the best beginner exercises for learning object-oriented programming. In this tutorial, we implement a three-light traffic system — red, yellow, and green — where only one light is on at a time. The user controls the initial light and number of cycles via command line arguments.

## What You Will Learn

- Designing classes with public and private attributes
- Implementing classes with object-oriented principles
- Using bitwise operators to control hardware LEDs
- Control structures and for-loops
- Handling command line arguments in C++

## Designing Classes with Public and Private Attributes

Since we are working with hardware, it is important to have a private class to store the values of the PORTS being used, along with appropriate accessor functions to read and write to those ports. Private class variables store the current state of the traffic light to avoid conflicts.

## Implementing the Classes with Object-Oriented Principles

Once the classes are designed, we implement them using object-oriented principles. This includes constructors and overloaded constructors for the `TrafficLight` class.

### OUSB Class Implementation

The `OUSB` class handles communication with the hardware board via pipe commands.

```cpp
OUSB::OUSB() {
    PORTA = 0;
    PORTB = 0;
    PORTC = 0;
}

unsigned short OUSB::runOUSBcommand(char* command) {
    FILE *fpipe;
    char line[250] = {};
    fpipe = (FILE*)_popen(command, "r");
    if (fpipe != NULL) {
        while (fgets(line, sizeof(line), fpipe)) {}
        _pclose(fpipe);
    } else {
        cout << "Error, problems with pipe!\n";
    }
    int port = (int)atoi(line);
    return port;
}

unsigned short OUSB::readPORTA(unsigned short pinNumber) {
    OUSB ousb;
    PORTA = ousb.runOUSBcommand("ousb -r io porta");
    return PORTA;
}

unsigned short OUSB::readPORTB() {
    OUSB ousb;
    PORTB = ousb.runOUSBcommand("ousb -r io portb");
    return PORTB;
}

unsigned short OUSB::writePORTB(unsigned short newValue) {
    OUSB ousb;
    PORTB = ousb.runOUSBcommand("ousb -r io portb %d");
    return PORTB;
}

unsigned short OUSB::readPORTC() {
    OUSB ousb;
    PORTC = ousb.runOUSBcommand("ousb -r pin");
    return PORTC;
}
```

### TrafficLight Class Implementation

The `TrafficLight` class controls which light is active and handles state transitions.

```cpp
void TrafficLight::redOn() {
    OUSB ousb;
    ousb.runOUSBcommand("ousb -r io portb 1");
    cout << "Red\n";
}

bool TrafficLight::isREDon() {
    OUSB ousb;
    if (ousb.readPORTB() == 1) return true;
    else return false;
}

void TrafficLight::yellowOn() {
    OUSB ousb;
    ousb.runOUSBcommand("ousb -r io portb 3");
    cout << "Yellow\n";
}

bool TrafficLight::isYELLOWon() {
    OUSB ousb;
    if (ousb.readPORTB() == 3) return true;
    else return false;
}

void TrafficLight::greenOn() {
    OUSB ousb;
    ousb.runOUSBcommand("ousb -r io portb 2");
    cout << "Green\n";
}

bool TrafficLight::isGREENon() {
    OUSB ousb;
    if (ousb.readPORTB() == 2) return true;
    else return false;
}

void TrafficLight::changeTrafficLightState() {
    OUSB ousb;
    switch (ousb.readPORTB()) {
        case 1: greenOn(); break;
        case 2: yellowOn(); break;
        case 3: redOn(); break;
        default: cout << "Error\n";
    }
}
```

## Bitwise Operators

The three lights are controlled by setting bits on the hardware using bitwise operators. The bit values are sent via the `runOUSBcommand` function. Each light maps to a specific bit pattern on the OUSB board's 8 LEDs:

- Red = `1` (binary: `00000001`)
- Green = `2` (binary: `00000010`)
- Yellow = `3` (binary: `00000011`)

## Control Structures and Command Line Arguments

The `main()` function uses command line arguments to control the program. If one argument is passed, it prints "Traffic Light Program". If three arguments are passed, it sets the initial light and runs through the specified number of cycles using a for-loop.

```cpp
int main(int argc, char *argv[]) {
    if (argc == 1) {
        cout << "Traffic Light Program\n";
    }
    else if (argc == 3) {
        OUSB ousb;
        TrafficLight light;
        int num = atoi(argv[2]);
        if (num <= 50 && num >= 0) {
            if (argv[1][0] == 'R') {
                light.redOn();
            } else if (argv[1][0] == 'Y') {
                light.yellowOn();
            } else if (argv[1][0] == 'G') {
                light.greenOn();
            }
            // Cycle through the traffic lights
            for (int i = 0; i < num; i++) {
                Sleep(500);
                light.changeTrafficLightState();
            }
        } else {
            cout << "number out of range" << endl;
        }
    } else {
        cout << "wrong argument inputed" << endl;
    }
    return 0;
}
```

To run the program with green as the initial light and 5 cycles:

```bash
./trafficlight G 5
```

## Summary

This C++ traffic light project covers some of the most important concepts in embedded and object-oriented C++ programming — classes, bitwise operators, hardware communication, and command line argument handling. It is a great foundation before moving on to more complex hardware projects.

---

**Want to go deeper with C++?** [The C++ Better Explained book](https://start.cppbetterexplained.com/tw-sales-page) covers the fundamentals of C++ and much more — grab the book and start building real programs today.
