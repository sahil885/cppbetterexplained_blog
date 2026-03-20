title: "C++ Traffic Light Project - Detailed Explanation with Source Code"
description: "A detailed walkthrough of building a traffic light simulation in C++ using classes, bitwise operators, and command line arguments."
pubDatetime: 2024-10-02T00:00:00Z
author: "Sahil"
tags: ["C++", "OOP", "beginner", "project", "classes"]
draft: false
featured: false
Recently a major task I did was to implement a C++ traffic light project. Three lights were included: red, yellow, and green. Basically, only one lamp could be on at a time. The user had to use command line arguments to set the initial traffic light and the number of cycles the three lights would display.
The concepts applied in this C++ traffic light project included the following:

Designing classes with public and private attributes
Implementing the classes with object-orientated principles
Bitwise Operators
Control Structures
Command Line Arguments

Designing Classes with Public and Private Attributes
Since we are working with hardware, it would be wise to have a private class to store the values of the PORTS that are used. As well as appropriate accessor functions that could read and write to the ports. Also, private class variables to store the current state of the traffic light would also be a safe thing to implement, to avoid conflict problems.
Implementing the Classes with Object-Orientated Principles
After the classes were created, we could now implement the class functions with object-orientated principles. Also, the use of constructors and advanced concepts including overloading constructors for the TrafficLight class can be implemented.
OUSB Class Implementation
cppOUSB::OUSB() {
    PORTA = 0;
    PORTB = 0;
    PORTC = 0;
}

unsigned short OUSB::runOUSBcommand(char* command) {
    FILE *fpipe;
    char line[250] = {};
    fpipe = (FILE*)_popen(command,"r");
    if( fpipe != NULL ) {
        while( fgets(line, sizeof(line), fpipe) ) {}
        _pclose(fpipe);
    }
    else cout << "Error, problems with pipe!\n";
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
TrafficLight Class Implementation
cppvoid TrafficLight::redOn() {
    OUSB ousb;
    ousb.runOUSBcommand("ousb -r io portb 1");
    cout << "Red\n";
}

bool TrafficLight::isREDon() {
    OUSB ousb;
    if(ousb.readPORTB() == 1) return true;
    else return false;
}

void TrafficLight::yellowOn() {
    OUSB ousb;
    ousb.runOUSBcommand("ousb -r io portb 3");
    cout << "Yellow\n";
}

bool TrafficLight::isYELLOWon() {
    OUSB ousb;
    if(ousb.readPORTB() == 3) return true;
    else return false;
}

void TrafficLight::greenOn() {
    OUSB ousb;
    ousb.runOUSBcommand("ousb -r io portb 2");
    cout << "Green\n";
}

bool TrafficLight::isGREENon() {
    OUSB ousb;
    if(ousb.readPORTB() == 2) return true;
    else return false;
}

void TrafficLight::changeTrafficLightState() {
    OUSB ousb;
    switch(ousb.readPORTB()) {
        case 1: greenOn(); break;
        case 2: yellowOn(); break;
        case 3: redOn(); break;
        default: cout << "Error\n";
    }
}
Bitwise Operators
The way the three lights are turned on is by setting the bits on the hardware with the help of bitwise operators. The set bits are sent using commands to the hardware via the runOUSBcommand function. We can see this in the TrafficLight class implementation in redOn(), yellowOn(), and greenOn(). The bits programmed for the traffic lights correspond to the 8 LEDs on the OUSB Board.
Control Structures and Command Line Arguments
The control structure in the main() function handles the command line arguments. If one argument is entered, it outputs "Traffic Light Program". If three arguments are set, it runs through the initial light entered and the number of cycles specified. A for-loop controls the number of times the traffic lights cycle through.
cppint main(int argc, char *argv[]) {
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
            for (int i = 0; i < num; i++) {
                Sleep(500);
                light.changeTrafficLightState();
            }
        }
        else cout << "number out of range" << endl;
    }
    else cout << "wrong argument inputed" << endl;
    return 0;
}

Want to learn more C++ projects like this? Check out C++ Better Explained — the book that walks you through real-world C++ from the ground up.
