import { ProjectRecipe } from '../types/scrap';

export const PROJECT_RECIPES: ProjectRecipe[] = [
  {
    id: 'project-cnc-plotter',
    title: 'Mini 2-Axis CNC Laser / Pen Plotter',
    tagline: 'High-precision XY drawing robot built from 2 dead optical DVD drive steppers',
    description:
      'Transforms the ultra-precise lead-screw stepper mechanisms from two salvaged CD/DVD-RW drives into a functional 2-axis desktop plotter. Capable of drawing vector graphics, circuit board resists, or etching with a salvaged optical laser.',
    category: 'robotics',
    difficulty: 'intermediate',
    estimatedBuildTime: '3 - 4 Hours',
    salvageSavingsEstimate: 85.0,
    requiredParts: [
      {
        partNumber: 'PL15S-020',
        componentName: 'DVD Sled Stepper Motors (X & Y axis)',
        category: 'motor',
        quantity: 2,
        alternatives: ['Flatbed scanner stepper', 'Floppy disk stepper motor']
      },
      {
        partNumber: 'L298HN',
        componentName: 'L298N Dual H-Bridge or A4988 Drivers',
        category: 'motor',
        quantity: 1,
        alternatives: ['ULN2003 Driver', 'A4988 Stepper Driver', 'DRV8825']
      },
      {
        partNumber: 'ATmega328P-PU',
        componentName: 'Microcontroller (Arduino Uno/Nano or ESP32)',
        category: 'ic',
        quantity: 1,
        alternatives: ['ESP32 DevKit', 'RP2040 Pico', 'STM32 BluePill']
      },
      {
        partNumber: 'L7805CV',
        componentName: '5V Regulator for Logic & Motor Power',
        category: 'power',
        quantity: 1,
        alternatives: ['LM317 set to 5V', 'USB 5V 2A Phone Charger']
      },
      {
        partNumber: '1N4007',
        componentName: 'Flyback Diodes (Back-EMF clamp)',
        category: 'passive',
        quantity: 8,
        alternatives: ['1N4148 (low current)', 'FR107 fast diode']
      }
    ],
    pinMappings: [
      { label: 'X-Axis Coil A1', defaultPin: 'D2', currentPin: 'D2', type: 'digital', description: 'Step phase A1 for X axis' },
      { label: 'X-Axis Coil A2', defaultPin: 'D3', currentPin: 'D3', type: 'digital', description: 'Step phase A2 for X axis' },
      { label: 'X-Axis Coil B1', defaultPin: 'D4', currentPin: 'D4', type: 'digital', description: 'Step phase B1 for X axis' },
      { label: 'X-Axis Coil B2', defaultPin: 'D5', currentPin: 'D5', type: 'digital', description: 'Step phase B2 for X axis' },
      { label: 'Y-Axis Coil A1', defaultPin: 'D6', currentPin: 'D6', type: 'digital', description: 'Step phase A1 for Y axis' },
      { label: 'Y-Axis Coil A2', defaultPin: 'D7', currentPin: 'D7', type: 'digital', description: 'Step phase A2 for Y axis' },
      { label: 'Y-Axis Coil B1', defaultPin: 'D8', currentPin: 'D8', type: 'digital', description: 'Step phase B1 for Y axis' },
      { label: 'Y-Axis Coil B2', defaultPin: 'D9', currentPin: 'D9', type: 'digital', description: 'Step phase B2 for Y axis' },
      { label: 'Pen Lift Servo', defaultPin: 'D10', currentPin: 'D10', type: 'pwm', description: 'Micro servo for lifting pen off paper' }
    ],
    schematicNodes: [
      {
        id: 'node-mcu',
        label: 'ATmega328P / Nano',
        subLabel: 'Master Controller',
        x: 40,
        y: 120,
        width: 140,
        height: 190,
        type: 'mcu',
        pins: [
          { id: 'mcu-d2', label: 'D2', x: 180, y: 140, type: 'io' },
          { id: 'mcu-d3', label: 'D3', x: 180, y: 160, type: 'io' },
          { id: 'mcu-d4', label: 'D4', x: 180, y: 180, type: 'io' },
          { id: 'mcu-d5', label: 'D5', x: 180, y: 200, type: 'io' },
          { id: 'mcu-d6', label: 'D6', x: 180, y: 225, type: 'io' },
          { id: 'mcu-d7', label: 'D7', x: 180, y: 245, type: 'io' },
          { id: 'mcu-d8', label: 'D8', x: 180, y: 265, type: 'io' },
          { id: 'mcu-d9', label: 'D9', x: 180, y: 285, type: 'io' },
          { id: 'mcu-5v', label: '5V', x: 40, y: 150, type: 'pwr' },
          { id: 'mcu-gnd', label: 'GND', x: 40, y: 270, type: 'gnd' }
        ]
      },
      {
        id: 'node-driver-x',
        label: 'Driver X (L298N)',
        subLabel: 'Dual H-Bridge Channel A/B',
        x: 260,
        y: 80,
        width: 150,
        height: 120,
        type: 'ic',
        pins: [
          { id: 'drv-x-in1', label: 'IN1', x: 260, y: 100, type: 'in' },
          { id: 'drv-x-in2', label: 'IN2', x: 260, y: 120, type: 'in' },
          { id: 'drv-x-in3', label: 'IN3', x: 260, y: 145, type: 'in' },
          { id: 'drv-x-in4', label: 'IN4', x: 260, y: 165, type: 'in' },
          { id: 'drv-x-out1', label: 'M1+', x: 410, y: 105, type: 'out' },
          { id: 'drv-x-out2', label: 'M1-', x: 410, y: 125, type: 'out' },
          { id: 'drv-x-out3', label: 'M2+', x: 410, y: 150, type: 'out' },
          { id: 'drv-x-out4', label: 'M2-', x: 410, y: 170, type: 'out' }
        ]
      },
      {
        id: 'node-motor-x',
        label: 'DVD Stepper X',
        subLabel: 'PL15S Lead Screw',
        x: 480,
        y: 80,
        width: 120,
        height: 110,
        type: 'motor',
        pins: [
          { id: 'mot-x-a1', label: 'A1', x: 480, y: 105, type: 'in' },
          { id: 'mot-x-a2', label: 'A2', x: 480, y: 125, type: 'in' },
          { id: 'mot-x-b1', label: 'B1', x: 480, y: 150, type: 'in' },
          { id: 'mot-x-b2', label: 'B2', x: 480, y: 170, type: 'in' }
        ]
      },
      {
        id: 'node-driver-y',
        label: 'Driver Y (L298N)',
        subLabel: 'Dual H-Bridge Channel C/D',
        x: 260,
        y: 220,
        width: 150,
        height: 120,
        type: 'ic',
        pins: [
          { id: 'drv-y-in1', label: 'IN1', x: 260, y: 240, type: 'in' },
          { id: 'drv-y-in2', label: 'IN2', x: 260, y: 260, type: 'in' },
          { id: 'drv-y-in3', label: 'IN3', x: 260, y: 285, type: 'in' },
          { id: 'drv-y-in4', label: 'IN4', x: 260, y: 305, type: 'in' },
          { id: 'drv-y-out1', label: 'M1+', x: 410, y: 245, type: 'out' },
          { id: 'drv-y-out2', label: 'M1-', x: 410, y: 265, type: 'out' },
          { id: 'drv-y-out3', label: 'M2+', x: 410, y: 290, type: 'out' },
          { id: 'drv-y-out4', label: 'M2-', x: 410, y: 310, type: 'out' }
        ]
      },
      {
        id: 'node-motor-y',
        label: 'DVD Stepper Y',
        subLabel: 'PL15S Lead Screw',
        x: 480,
        y: 220,
        width: 120,
        height: 110,
        type: 'motor',
        pins: [
          { id: 'mot-y-a1', label: 'A1', x: 480, y: 245, type: 'in' },
          { id: 'mot-y-a2', label: 'A2', x: 480, y: 265, type: 'in' },
          { id: 'mot-y-b1', label: 'B1', x: 480, y: 290, type: 'in' },
          { id: 'mot-y-b2', label: 'B2', x: 480, y: 310, type: 'in' }
        ]
      }
    ],
    schematicWires: [
      { id: 'w1', fromNode: 'node-mcu', fromPin: 'mcu-d2', toNode: 'node-driver-x', toPin: 'drv-x-in1', color: '#38bdf8', signalName: 'X_IN1' },
      { id: 'w2', fromNode: 'node-mcu', fromPin: 'mcu-d3', toNode: 'node-driver-x', toPin: 'drv-x-in2', color: '#38bdf8', signalName: 'X_IN2' },
      { id: 'w3', fromNode: 'node-mcu', fromPin: 'mcu-d4', toNode: 'node-driver-x', toPin: 'drv-x-in3', color: '#38bdf8', signalName: 'X_IN3' },
      { id: 'w4', fromNode: 'node-mcu', fromPin: 'mcu-d5', toNode: 'node-driver-x', toPin: 'drv-x-in4', color: '#38bdf8', signalName: 'X_IN4' },
      { id: 'w5', fromNode: 'node-driver-x', fromPin: 'drv-x-out1', toNode: 'node-motor-x', toPin: 'mot-x-a1', color: '#fb923c' },
      { id: 'w6', fromNode: 'node-driver-x', fromPin: 'drv-x-out2', toNode: 'node-motor-x', toPin: 'mot-x-a2', color: '#fb923c' },
      { id: 'w7', fromNode: 'node-driver-x', fromPin: 'drv-x-out3', toNode: 'node-motor-x', toPin: 'mot-x-b1', color: '#fb923c' },
      { id: 'w8', fromNode: 'node-driver-x', fromPin: 'drv-x-out4', toNode: 'node-motor-x', toPin: 'mot-x-b2', color: '#fb923c' },
      { id: 'w9', fromNode: 'node-mcu', fromPin: 'mcu-d6', toNode: 'node-driver-y', toPin: 'drv-y-in1', color: '#4ade80', signalName: 'Y_IN1' },
      { id: 'w10', fromNode: 'node-mcu', fromPin: 'mcu-d7', toNode: 'node-driver-y', toPin: 'drv-y-in2', color: '#4ade80', signalName: 'Y_IN2' },
      { id: 'w11', fromNode: 'node-mcu', fromPin: 'mcu-d8', toNode: 'node-driver-y', toPin: 'drv-y-in3', color: '#4ade80', signalName: 'Y_IN3' },
      { id: 'w12', fromNode: 'node-mcu', fromPin: 'mcu-d9', toNode: 'node-driver-y', toPin: 'drv-y-in4', color: '#4ade80', signalName: 'Y_IN4' },
      { id: 'w13', fromNode: 'node-driver-y', fromPin: 'drv-y-out1', toNode: 'node-motor-y', toPin: 'mot-y-a1', color: '#a78bfa' },
      { id: 'w14', fromNode: 'node-driver-y', fromPin: 'drv-y-out2', toNode: 'node-motor-y', toPin: 'mot-y-a2', color: '#a78bfa' },
      { id: 'w15', fromNode: 'node-driver-y', fromPin: 'drv-y-out3', toNode: 'node-motor-y', toPin: 'mot-y-b1', color: '#a78bfa' },
      { id: 'w16', fromNode: 'node-driver-y', fromPin: 'drv-y-out4', toNode: 'node-motor-y', toPin: 'mot-y-b2', color: '#a78bfa' }
    ],
    codeTemplates: {
      arduino: `/**
 * ScrapMaster AI - Mini 2-Axis CNC Plotter (DVD Steppers)
 * Target: Arduino Uno / Nano (ATmega328P)
 * Salvaged parts: 2x DVD lead screw steppers + L298N drivers
 */
#include <Stepper.h>
#include <Servo.h>

const int STEPS_PER_REV = 20; // Standard DVD optical sled stepper (18 deg/step)
const int PEN_LIFT_PIN = 10;
const int PEN_DOWN_ANGLE = 90;
const int PEN_UP_ANGLE = 45;

// Initialize Stepper library for X and Y axes
// Sequence: IN1, IN3, IN2, IN4
Stepper stepperX(STEPS_PER_REV, 2, 4, 3, 5);
Stepper stepperY(STEPS_PER_REV, 6, 8, 7, 9);
Servo penServo;

void setup() {
  Serial.begin(115200);
  // Set speeds for DVD miniature steppers (RPM)
  stepperX.setSpeed(250);
  stepperY.setSpeed(250);
  penServo.attach(PEN_LIFT_PIN);
  penServo.write(PEN_UP_ANGLE);
  Serial.println(F("[ScrapMaster AI] CNC Plotter Initialized. Ready for G-code!"));
}

void loop() {
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    if (cmd == 'U') {
      penServo.write(PEN_UP_ANGLE);
      Serial.println(F("OK: Pen UP"));
    } else if (cmd == 'D') {
      penServo.write(PEN_DOWN_ANGLE);
      Serial.println(F("OK: Pen DOWN"));
    } else if (cmd == 'X') {
      int steps = Serial.parseInt();
      stepperX.step(steps);
      Serial.println(F("OK: Stepped X"));
    } else if (cmd == 'Y') {
      int steps = Serial.parseInt();
      stepperY.step(steps);
      Serial.println(F("OK: Stepped Y"));
    } else if (cmd == 'T') {
      // Self-test draw a square
      drawTestSquare();
    }
  }
}

void drawTestSquare() {
  Serial.println(F("Drawing 15mm calibration square..."));
  penServo.write(PEN_DOWN_ANGLE);
  delay(150);
  stepperX.step(100);
  delay(50);
  stepperY.step(100);
  delay(50);
  stepperX.step(-100);
  delay(50);
  stepperY.step(-100);
  delay(50);
  penServo.write(PEN_UP_ANGLE);
  Serial.println(F("Test square completed."));
}`,
      esp32: `/**
 * ScrapMaster AI - Mini 2-Axis CNC Plotter (ESP32 High-Speed)
 * Target: ESP32 DevKit V1
 */
#include <Arduino.h>

const int X_PINS[4] = {19, 21, 22, 23};
const int Y_PINS[4] = {25, 26, 27, 14};

// Full-step 4-phase sequence
const int STEP_SEQUENCE[4][4] = {
  {HIGH, LOW, HIGH, LOW},
  {LOW, HIGH, HIGH, LOW},
  {LOW, HIGH, LOW, HIGH},
  {HIGH, LOW, LOW, HIGH}
};

int stepIndexX = 0;
int stepIndexY = 0;

void setup() {
  Serial.begin(115200);
  for(int i=0; i<4; i++){
    pinMode(X_PINS[i], OUTPUT);
    pinMode(Y_PINS[i], OUTPUT);
  }
  Serial.println("[ScrapMaster ESP32] Dual Stepper Ready.");
}

void stepX(bool forward, int count, int delayUs = 2500) {
  for(int i=0; i<count; i++){
    stepIndexX = (stepIndexX + (forward ? 1 : -1) + 4) % 4;
    for(int p=0; p<4; p++){
      digitalWrite(X_PINS[p], STEP_SEQUENCE[stepIndexX][p]);
    }
    delayMicroseconds(delayUs);
  }
}

void loop() {
  // Demo back-and-forth scan
  stepX(true, 150);
  delay(200);
  stepX(false, 150);
  delay(500);
}`,
      micropython: `# ScrapMaster AI - DVD Stepper Controller in MicroPython
# Target: Raspberry Pi Pico / ESP32 running MicroPython
import machine
import time

x_pins = [machine.Pin(p, machine.Pin.OUT) for p in (2, 3, 4, 5)]
y_pins = [machine.Pin(p, machine.Pin.OUT) for p in (6, 7, 8, 9)]

step_seq = [
    [1, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 0, 1]
]

def step_axis(pins, steps, delay_ms=3):
    direction = 1 if steps > 0 else -1
    steps = abs(steps)
    idx = 0
    for _ in range(steps):
        idx = (idx + direction) % 4
        for p_idx, pin in enumerate(pins):
            pin.value(step_seq[idx][p_idx])
        time.sleep_ms(delay_ms)
    # De-energize coils to prevent heating
    for pin in pins:
        pin.value(0)

print("[ScrapMaster AI] Testing X axis travel...")
step_axis(x_pins, 100)
time.sleep(0.5)
step_axis(x_pins, -100)
print("Calibration sequence finished.")`
    },
    assemblySteps: [
      {
        step: 1,
        title: 'Teardown & Sled Extraction',
        instruction:
          'Unscrew the DVD drive top casing. Remove the optical pickup sled containing the tiny 4-wire stepper motor and threaded lead screw. Avoid bending the guide rails.',
        caution: 'Do NOT look directly into the red/infrared laser diode lens. Optical lasers are Class 3B/4.'
      },
      {
        step: 2,
        title: 'Identify Stepper Coil Pinouts',
        instruction:
          'Using your multimeter on 200 Ω resistance mode, identify which two pins belong to Coil A (reads ~10-12 Ω) and which belong to Coil B. Solder flexible header wires.',
        testingTip: 'If the motor vibrates instead of turning, swap the two wires of Coil A.'
      },
      {
        step: 3,
        title: 'Perpendicular Frame Mounting',
        instruction:
          'Mount the first sled horizontally onto a piece of scrap wood/acrylic for the X-axis. Mount the second sled vertically or cross-wise onto the moving carriage for the Y-axis.',
        caution: 'Ensure the carriages move freely by hand along the entire 38mm travel distance.'
      },
      {
        step: 4,
        title: 'Wiring to Motor Driver & Arduino',
        instruction:
          'Connect the 4 wires of X-motor to OUT1..OUT4 of the first L298N/A4988. Wire IN1..IN4 to Arduino pins D2, D3, D4, D5. Repeat for Y-axis on D6, D7, D8, D9.',
        caution: 'DVD stepper coils have low resistance (10 Ω). If running on 5V, they draw ~500mA. Add 10 Ω 1W series current limiting resistors or use PWM chopping.'
      },
      {
        step: 5,
        title: 'Upload Firmware & Calibrate Steps',
        instruction:
          'Upload the Arduino C++ sketch. Open Serial Monitor at 115200 baud. Send "T" command to verify square drawing and zero backlash.'
      }
    ],
    safetyChecklist: [
      'De-energize coils when stationary to prevent motor from overheating',
      'If using salvaged DVD laser diode instead of pen, MUST wear OD5+ 650nm laser safety goggles',
      'Common ground must connect Arduino GND, Driver GND, and External Power supply GND',
      'Do not back-drive stepper motor rapidly by hand when powered off to prevent inductive back-EMF spike'
    ]
  },
  {
    id: 'project-bench-psu',
    title: 'Precision 1.25V - 25V Bench Power Supply',
    tagline: 'Adjustable lab-grade DC power supply built from salvaged LM317 & transformer',
    description:
      'Turn an old laptop charger brick, printer AC-DC adapter, or salvaged transformer into a variable voltage laboratory power supply with current limiting, voltage readout, and short-circuit protection.',
    category: 'power',
    difficulty: 'beginner',
    estimatedBuildTime: '1.5 - 2 Hours',
    salvageSavingsEstimate: 45.0,
    requiredParts: [
      {
        partNumber: 'LM317T',
        componentName: 'LM317T Adjustable Voltage Regulator',
        category: 'power',
        quantity: 1,
        alternatives: ['LM338 (5A)', 'LM350 (3A)', 'XL4015 Buck module']
      },
      {
        partNumber: '1N4007',
        componentName: '1N4007 Protection Diodes (D1 & D2)',
        category: 'passive',
        quantity: 2,
        alternatives: ['1N5408', '1N5819 Schottky']
      },
      {
        partNumber: 'CAP-400V-470UF',
        componentName: 'Electrolytic Filter Capacitors (1000uF 35V & 100uF 25V)',
        category: 'passive',
        quantity: 2,
        alternatives: ['470uF 50V', '2200uF 35V']
      },
      {
        partNumber: 'POT-5K',
        componentName: '5k Ω Linear Potentiometer (Dial control)',
        category: 'passive',
        quantity: 1,
        alternatives: ['10k Potentiometer with 10k in parallel']
      }
    ],
    pinMappings: [
      { label: 'Voltage Monitor Analog Pin', defaultPin: 'A0', currentPin: 'A0', type: 'analog', description: 'Measures output voltage via 1:5 resistor divider' },
      { label: 'Current Shunt Analog Pin', defaultPin: 'A1', currentPin: 'A1', type: 'analog', description: 'Measures voltage drop across 0.1 ohm shunt' },
      { label: 'Over-Current Alarm Buzzer', defaultPin: 'D8', currentPin: 'D8', type: 'digital', description: 'Audible warning if current exceeds safe threshold' }
    ],
    schematicNodes: [
      {
        id: 'node-dc-in',
        label: 'DC Input (18V-24V)',
        subLabel: 'Salvaged Laptop Adapter',
        x: 40,
        y: 120,
        width: 130,
        height: 100,
        type: 'power',
        pins: [
          { id: 'in-vplus', label: 'V_IN+', x: 170, y: 140, type: 'pwr' },
          { id: 'in-gnd', label: 'GND', x: 170, y: 190, type: 'gnd' }
        ]
      },
      {
        id: 'node-lm317',
        label: 'LM317T Regulator',
        subLabel: 'TO-220 with Aluminum Heatsink',
        x: 240,
        y: 100,
        width: 160,
        height: 140,
        type: 'ic',
        pins: [
          { id: 'lm-vin', label: 'VIN (Pin 3)', x: 240, y: 140, type: 'in' },
          { id: 'lm-vout', label: 'VOUT (Pin 2)', x: 400, y: 140, type: 'out' },
          { id: 'lm-adj', label: 'ADJ (Pin 1)', x: 320, y: 240, type: 'io' }
        ]
      },
      {
        id: 'node-pot',
        label: '5k Ω Potentiometer',
        subLabel: 'Voltage Tuning Knob',
        x: 250,
        y: 290,
        width: 140,
        height: 90,
        type: 'passive',
        pins: [
          { id: 'pot-top', label: 'Wiper', x: 320, y: 290, type: 'in' },
          { id: 'pot-bottom', label: 'GND', x: 320, y: 380, type: 'gnd' }
        ]
      },
      {
        id: 'node-dc-out',
        label: 'Variable DC Out',
        subLabel: '1.25V - 22V (1.5A Max)',
        x: 470,
        y: 120,
        width: 140,
        height: 100,
        type: 'power',
        pins: [
          { id: 'out-vplus', label: 'V_OUT+', x: 470, y: 140, type: 'pwr' },
          { id: 'out-gnd', label: 'GND', x: 470, y: 190, type: 'gnd' }
        ]
      }
    ],
    schematicWires: [
      { id: 'w-p1', fromNode: 'node-dc-in', fromPin: 'in-vplus', toNode: 'node-lm317', toPin: 'lm-vin', color: '#ef4444', voltage: '+20V DC' },
      { id: 'w-p2', fromNode: 'node-lm317', fromPin: 'lm-vout', toNode: 'node-dc-out', toPin: 'out-vplus', color: '#10b981', voltage: '1.25V-22V' },
      { id: 'w-p3', fromNode: 'node-lm317', fromPin: 'lm-adj', toNode: 'node-pot', toPin: 'pot-top', color: '#f59e0b', signalName: 'Feedback Adj' },
      { id: 'w-p4', fromNode: 'node-dc-in', fromPin: 'in-gnd', toNode: 'node-dc-out', toPin: 'out-gnd', color: '#6b7280', signalName: 'GND Rail' }
    ],
    codeTemplates: {
      arduino: `/**
 * ScrapMaster AI - Bench Power Supply Voltmeter & Ammeter
 * Display: 16x2 I2C LCD or Serial Monitor
 */
const int PIN_VOLTS = A0;
const int PIN_AMPS = A1;
const int PIN_ALARM = 8;

// Voltage divider: 100k (R1) and 10k (R2) -> factor = (100+10)/10 = 11.0
const float VOLT_DIVIDER_RATIO = 11.0; 
const float SHUNT_RESISTANCE = 0.10; // 0.1 Ohm 5W current shunt resistor

void setup() {
  Serial.begin(115200);
  pinMode(PIN_ALARM, OUTPUT);
  Serial.println(F("[ScrapMaster AI] Bench Supply Digital Monitor Active."));
}

void loop() {
  int rawV = analogRead(PIN_VOLTS);
  float voltage = (rawV * (5.0 / 1023.0)) * VOLT_DIVIDER_RATIO;
  
  int rawI = analogRead(PIN_AMPS);
  float shuntVoltage = rawI * (5.0 / 1023.0);
  float currentAmps = shuntVoltage / SHUNT_RESISTANCE;
  float powerWatts = voltage * currentAmps;

  Serial.print(F("V: "));
  Serial.print(voltage, 2);
  Serial.print(F(" V | I: "));
  Serial.print(currentAmps, 3);
  Serial.print(F(" A | P: "));
  Serial.print(powerWatts, 2);
  Serial.println(F(" W"));

  // Over-current trip at 1.4 Amps to protect salvaged LM317
  if (currentAmps > 1.40) {
    digitalWrite(PIN_ALARM, HIGH);
    Serial.println(F("WARNING: OVER-CURRENT LIMIT EXCEEDED!"));
  } else {
    digitalWrite(PIN_ALARM, LOW);
  }
  delay(250);
}`,
      esp32: `/**
 * ScrapMaster AI - ESP32 Bench Monitor with OLED
 */
#include <Arduino.h>

const int ADC_VOLT = 34;
const int ADC_CURR = 35;
const int BUZZER = 18;

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER, OUTPUT);
}

void loop() {
  float v = (analogRead(ADC_VOLT) / 4095.0) * 3.3 * 11.0;
  float a = ((analogRead(ADC_CURR) / 4095.0) * 3.3) / 0.1;
  Serial.printf("Output: %.2f V | Current: %.2f A\\n", v, a);
  delay(300);
}`,
      micropython: `# ScrapMaster AI - MicroPython Power Monitor
from machine import ADC, Pin
import time

adc_v = ADC(Pin(26))
adc_i = ADC(Pin(27))
buzzer = Pin(15, Pin.OUT)

while True:
    raw_v = adc_v.read_u16()
    volts = (raw_v / 65535.0) * 3.3 * 11.0
    raw_i = adc_i.read_u16()
    amps = ((raw_i / 65535.0) * 3.3) / 0.1
    print(f"Output: {volts:.2f}V | {amps:.3f}A")
    if amps > 1.4:
        buzzer.value(1)
    else:
        buzzer.value(0)
    time.sleep(0.3)`
    },
    assemblySteps: [
      {
        step: 1,
        title: 'Thermal Heatsink Mounting',
        instruction:
          'Bolt the LM317T TO-220 package to a large salvaged aluminum heatsink using thermal paste. Ensure the metal tab does not touch the metal outer chassis.',
        caution: 'Without a heatsink, the LM317 will thermally shut down at only 300mA dissipation!'
      },
      {
        step: 2,
        title: 'Feedback Resistor Network',
        instruction:
          'Solder a 240 Ω resistor between VOUT (Pin 2) and ADJ (Pin 1). Connect the 5k Ω potentiometer between ADJ (Pin 1) and GND.',
        testingTip: 'Vout formula: Vout = 1.25 * (1 + Rpot / 240).'
      },
      {
        step: 3,
        title: 'Reverse Protection Diodes (CRITICAL)',
        instruction:
          'Solder a 1N4007 diode with cathode to VIN and anode to VOUT. Solder a second 1N4007 with cathode to VOUT and anode to ADJ. These protect against capacitor back-discharge when powered down.',
        caution: 'Without these diodes, turning off the power supply while connected to an inductive load or battery will instantly blow the LM317.'
      },
      {
        step: 4,
        title: 'Input & Output Filtering Capacitors',
        instruction:
          'Place a 1000uF 35V electrolytic capacitor on the input terminals to smooth ripple. Place a 10uF tantalum or electrolytic cap on the output for transient stability.'
      }
    ],
    safetyChecklist: [
      'Confirm polarity of all electrolytic capacitors. Reverse polarity will cause electrolytic explosion!',
      'Verify that LM317 tab is not shorted to the grounded chassis box',
      'Test unloaded output voltage with DMM before connecting sensitive microcontrollers or circuits',
      'Keep input voltage under 37V DC maximum differential limit'
    ]
  },
  {
    id: 'project-vape-powerbank',
    title: 'Salvaged 18650 / Vape Cell Emergency Power Bank & Torch',
    tagline: 'Safely recover lithium cells into an ultra-compact USB backup bank and emergency light',
    description:
      'Recovers tested 18650 cells from dead laptop batteries or discarded rechargeable vape cells (e-waste) and pairs them with a TP4056 charge-protection board and 5V step-up boost converter.',
    category: 'power',
    difficulty: 'beginner',
    estimatedBuildTime: '1 Hour',
    salvageSavingsEstimate: 28.0,
    requiredParts: [
      {
        partNumber: 'INR18650-22P',
        componentName: '18650 Lithium-Ion Cell (3.7V)',
        category: 'power',
        quantity: 2,
        alternatives: ['Lithium Polymer pouch cell > 500mAh']
      },
      {
        partNumber: 'TP4056-PROT',
        componentName: 'TP4056 Charge Controller with Protection IC',
        category: 'power',
        quantity: 1,
        alternatives: ['IP5306 Power Bank IC', 'MT3608 + TP4056 combo']
      },
      {
        partNumber: 'MOD-BOOST-5V',
        componentName: 'Mini 0.9V-5V to 5V USB Boost Step-Up Board',
        category: 'power',
        quantity: 1,
        alternatives: ['XL6009 Boost Converter', 'MT3608 Boost']
      },
      {
        partNumber: 'LED-WHITE-1W',
        componentName: 'Salvaged 1W High-Brightness White LED',
        category: 'passive',
        quantity: 1,
        alternatives: ['Standard 5mm white LEDs with 100 ohm resistor']
      }
    ],
    pinMappings: [
      { label: 'Torch Pushbutton Switch', defaultPin: 'D3', currentPin: 'D3', type: 'digital', description: 'Toggles between OFF, LOW, HIGH, and SOS Strobe' },
      { label: 'LED PWM Driver', defaultPin: 'D5', currentPin: 'D5', type: 'pwm', description: 'Drives MOSFET or transistor switching torch LED' },
      { label: 'Battery Fuel Gauge ADC', defaultPin: 'A0', currentPin: 'A0', type: 'analog', description: 'Reads battery cell voltage directly' }
    ],
    schematicNodes: [
      {
        id: 'node-cell',
        label: 'Salvaged 18650 Cell',
        subLabel: '3.7V Nominal (4.2V Max)',
        x: 40,
        y: 120,
        width: 140,
        height: 100,
        type: 'power',
        pins: [
          { id: 'cell-pos', label: 'BATT (+)', x: 180, y: 140, type: 'pwr' },
          { id: 'cell-neg', label: 'BATT (-)', x: 180, y: 190, type: 'gnd' }
        ]
      },
      {
        id: 'node-tp4056',
        label: 'TP4056 + DW01 Module',
        subLabel: 'CC/CV Charger & Cutoff',
        x: 250,
        y: 100,
        width: 160,
        height: 140,
        type: 'ic',
        pins: [
          { id: 'tp-bplus', label: 'B+', x: 250, y: 140, type: 'in' },
          { id: 'tp-bminus', label: 'B-', x: 250, y: 190, type: 'in' },
          { id: 'tp-outplus', label: 'OUT+', x: 410, y: 140, type: 'out' },
          { id: 'tp-outminus', label: 'OUT-', x: 410, y: 190, type: 'out' }
        ]
      },
      {
        id: 'node-boost',
        label: '5V Boost Step-Up',
        subLabel: 'USB-A 5.0V Output (1A)',
        x: 480,
        y: 110,
        width: 140,
        height: 120,
        type: 'power',
        pins: [
          { id: 'bst-vin', label: 'VIN+', x: 480, y: 140, type: 'in' },
          { id: 'bst-gnd', label: 'GND', x: 480, y: 190, type: 'gnd' },
          { id: 'bst-usb', label: '5V USB', x: 620, y: 155, type: 'pwr' }
        ]
      }
    ],
    schematicWires: [
      { id: 'wb1', fromNode: 'node-cell', fromPin: 'cell-pos', toNode: 'node-tp4056', toPin: 'tp-bplus', color: '#ef4444', voltage: '+3.7V' },
      { id: 'wb2', fromNode: 'node-cell', fromPin: 'cell-neg', toNode: 'node-tp4056', toPin: 'tp-bminus', color: '#111827', signalName: 'BATT-' },
      { id: 'wb3', fromNode: 'node-tp4056', fromPin: 'tp-outplus', toNode: 'node-boost', toPin: 'bst-vin', color: '#f59e0b', signalName: 'Protected V+' },
      { id: 'wb4', fromNode: 'node-tp4056', fromPin: 'tp-outminus', toNode: 'node-boost', toPin: 'bst-gnd', color: '#6b7280', signalName: 'Protected GND' }
    ],
    codeTemplates: {
      arduino: `/**
 * ScrapMaster AI - Intelligent Battery Fuel Gauge & SOS Torch
 */
const int PIN_BTN = 3;
const int PIN_LED = 5;
const int PIN_BATT_ADC = A0;

int torchMode = 0; // 0=OFF, 1=LOW, 2=HIGH, 3=SOS

void setup() {
  Serial.begin(115200);
  pinMode(PIN_BTN, INPUT_PULLUP);
  pinMode(PIN_LED, OUTPUT);
}

void loop() {
  // Read battery voltage
  float raw = analogRead(PIN_BATT_ADC);
  float battVolts = (raw * 5.0 / 1023.0);
  
  if (digitalRead(PIN_BTN) == LOW) {
    delay(50); // debounce
    if (digitalRead(PIN_BTN) == LOW) {
      torchMode = (torchMode + 1) % 4;
      while (digitalRead(PIN_BTN) == LOW); // wait for release
    }
  }

  // Handle Torch Modes
  if (torchMode == 0) {
    analogWrite(PIN_LED, 0);
  } else if (torchMode == 1) {
    analogWrite(PIN_LED, 40); // 15% brightness
  } else if (torchMode == 2) {
    analogWrite(PIN_LED, 255); // 100% brightness
  } else if (torchMode == 3) {
    // SOS Pattern (... --- ...)
    flashMorse();
  }
}

void flashMorse() {
  for(int i=0; i<3; i++){ analogWrite(PIN_LED, 255); delay(150); analogWrite(PIN_LED, 0); delay(150); }
  delay(300);
  for(int i=0; i<3; i++){ analogWrite(PIN_LED, 255); delay(450); analogWrite(PIN_LED, 0); delay(200); }
  delay(300);
  for(int i=0; i<3; i++){ analogWrite(PIN_LED, 255); delay(150); analogWrite(PIN_LED, 0); delay(150); }
  delay(1000);
}`,
      esp32: `// ESP32 Ultra-Low Power Torch & Battery Monitor
#include <Arduino.h>

void setup() {
  Serial.begin(115200);
  pinMode(4, OUTPUT);
}

void loop() {
  float v = (analogRead(34) / 4095.0) * 3.3 * 2.0;
  Serial.printf("Battery: %.2f V\\n", v);
  delay(1000);
}`,
      micropython: `# MicroPython Battery Power Bank Controller
from machine import Pin, PWM, ADC
import time

led = PWM(Pin(25))
led.freq(1000)
adc = ADC(Pin(26))

while True:
    volts = (adc.read_u16() / 65535.0) * 3.3 * 2.0
    print(f"Cell Voltage: {volts:.2f}V")
    time.sleep(1)`
    },
    assemblySteps: [
      {
        step: 1,
        title: 'Cell Health & Voltage Pre-Screening',
        instruction:
          'Measure open circuit voltage of the salvaged cell. If < 2.5V, reject the cell immediately due to copper shunting risk. If > 3.0V, charge slowly through TP4056 and monitor for excessive warmth.',
        caution: 'If cell gets warmer than 45°C during charging, disconnect immediately!'
      },
      {
        step: 2,
        title: 'Connect Battery to TP4056 Board',
        instruction:
          'Solder cell positive to "B+" pad and negative to "B-" pad. Keep soldering iron contact under 3 seconds on cell terminals if soldering directly, or preferably use a spot welder / battery holder clip.'
      },
      {
        step: 3,
        title: 'Wire Protected Output to 5V Step-Up Module',
        instruction:
          'Solder "OUT+" on the TP4056 to "VIN+" on the boost board. Solder "OUT-" to "GND". This routes battery power through the DW01 protection IC so the cell will never drop below 2.5V.'
      },
      {
        step: 4,
        title: 'Add Torch LED with Switch & Insulate Enclosure',
        instruction:
          'Place the completed assembly in a 3D-printed or salvaged Altoids tin lined with kapton / electrical insulation tape.'
      }
    ],
    safetyChecklist: [
      'NEVER short-circuit 18650 positive and negative terminals - instantaneous 30A current can cause thermal runaway',
      'Always use TP4056 WITH protection chip (DW01 + FS8205A) rather than bare 4-pin version',
      'Insulate inside of metal enclosure with non-conductive electrical tape',
      'Never charge unattended for the initial test cycle'
    ]
  },
  {
    id: 'project-plant-watering',
    title: 'Autonomous Soil Moisture Feeder with 555 Timer',
    tagline: 'Zero-microcontroller plant irrigation pump built with an astable 555 and printer solenoid',
    description:
      'A rugged, microcontroller-free automatic plant watering system utilizing a salvaged NE555 timer configured as an AC soil moisture impedance bridge, driving a salvaged printer solenoid or 5V mini water pump.',
    category: 'automation',
    difficulty: 'beginner',
    estimatedBuildTime: '1 Hour',
    salvageSavingsEstimate: 35.0,
    requiredParts: [
      {
        partNumber: 'NE555P',
        componentName: 'NE555 Precision Timer IC',
        category: 'ic',
        quantity: 1,
        alternatives: ['LM555', 'TLC555 CMOS timer']
      },
      {
        partNumber: 'IRFZ44N',
        componentName: 'IRFZ44N N-Channel Power MOSFET',
        category: 'power',
        quantity: 1,
        alternatives: ['TIP120 Darlington', '2N2222 (for tiny relays)']
      },
      {
        partNumber: '1N4007',
        componentName: '1N4007 Flyback Clamping Diode',
        category: 'passive',
        quantity: 1,
        alternatives: ['1N4148', '1N5819']
      },
      {
        partNumber: 'SOLENOID-12V',
        componentName: 'Salvaged 12V Solenoid Valve or 5V Submersible Pump',
        category: 'motor',
        quantity: 1,
        alternatives: ['Windshield washer pump', 'Coffee machine solenoid']
      }
    ],
    pinMappings: [
      { label: 'Soil Probe Excitation', defaultPin: 'D2', currentPin: 'D2', type: 'digital', description: 'AC square wave excitation to prevent soil probe galvanic corrosion' },
      { label: 'Pump Driver Gate', defaultPin: 'D4', currentPin: 'D4', type: 'digital', description: 'Triggers MOSFET gate to energize water valve' }
    ],
    schematicNodes: [
      {
        id: 'node-555',
        label: 'NE555 Timer',
        subLabel: 'Moisture Threshold Detector',
        x: 60,
        y: 110,
        width: 150,
        height: 160,
        type: 'ic',
        pins: [
          { id: 'p555-trig', label: 'TRIG (Pin 2)', x: 60, y: 150, type: 'in' },
          { id: 'p555-out', label: 'OUT (Pin 3)', x: 210, y: 150, type: 'out' },
          { id: 'p555-vcc', label: 'VCC (Pin 8)', x: 60, y: 125, type: 'pwr' },
          { id: 'p555-gnd', label: 'GND (Pin 1)', x: 60, y: 245, type: 'gnd' }
        ]
      },
      {
        id: 'node-mosfet',
        label: 'IRFZ44N MOSFET',
        subLabel: 'Low-Side Load Switch',
        x: 290,
        y: 120,
        width: 140,
        height: 120,
        type: 'power',
        pins: [
          { id: 'fet-gate', label: 'Gate', x: 290, y: 150, type: 'in' },
          { id: 'fet-drain', label: 'Drain', x: 430, y: 150, type: 'out' },
          { id: 'fet-source', label: 'Source', x: 360, y: 240, type: 'gnd' }
        ]
      },
      {
        id: 'node-pump',
        label: '12V Solenoid / Pump',
        subLabel: 'Salvaged Actuator + 1N4007 Diode',
        x: 500,
        y: 110,
        width: 150,
        height: 120,
        type: 'motor',
        pins: [
          { id: 'pump-pos', label: '12V (+)', x: 500, y: 130, type: 'pwr' },
          { id: 'pump-neg', label: 'Drain (-)', x: 500, y: 170, type: 'in' }
        ]
      }
    ],
    schematicWires: [
      { id: 'wp-1', fromNode: 'node-555', fromPin: 'p555-out', toNode: 'node-mosfet', toPin: 'fet-gate', color: '#38bdf8', signalName: 'Gate Drive' },
      { id: 'wp-2', fromNode: 'node-mosfet', fromPin: 'fet-drain', toNode: 'node-pump', toPin: 'pump-neg', color: '#ef4444', signalName: 'Switched GND' }
    ],
    codeTemplates: {
      arduino: `/**
 * Optional Microcontroller version if using Arduino Nano
 * Alternating AC excitation prevents probe corrosion
 */
const int PROBE_PINA = 2;
const int PROBE_PINB = 3;
const int PUMP_GATE = 4;

void setup() {
  Serial.begin(115200);
  pinMode(PUMP_GATE, OUTPUT);
}

int readSoilResistance() {
  // Pulse forward
  pinMode(PROBE_PINA, OUTPUT); digitalWrite(PROBE_PINA, HIGH);
  pinMode(PROBE_PINB, INPUT);
  int val1 = analogRead(A0);
  delay(10);
  // Pulse reverse to clean ions
  digitalWrite(PROBE_PINA, LOW);
  pinMode(PROBE_PINB, OUTPUT); digitalWrite(PROBE_PINB, LOW);
  return val1;
}

void loop() {
  int moisture = readSoilResistance();
  Serial.print("Soil Moisture Level: "); Serial.println(moisture);
  if (moisture < 300) { // Dry soil
    Serial.println("Activating pump for 3 seconds...");
    digitalWrite(PUMP_GATE, HIGH);
    delay(3000);
    digitalWrite(PUMP_GATE, LOW);
    delay(60000); // Wait 1 minute for water absorption
  }
  delay(5000);
}`,
      esp32: `// ESP32 Deep Sleep Moisture Monitor
#include <Arduino.h>

void setup() {
  Serial.begin(115200);
  pinMode(4, OUTPUT);
  int m = analogRead(34);
  if (m < 1500) { digitalWrite(4, HIGH); delay(2500); digitalWrite(4, LOW); }
  esp_deep_sleep(1000000ULL * 3600); // sleep for 1 hour
}
void loop() {}`,
      micropython: `# MicroPython Solar Plant Feeder
import machine, time

pump = machine.Pin(16, machine.Pin.OUT)
adc = machine.ADC(machine.Pin(26))

while True:
    moisture = adc.read_u16()
    print("Moisture:", moisture)
    if moisture < 20000:
        pump.value(1)
        time.sleep(2)
        pump.value(0)
    time.sleep(600)`
    },
    assemblySteps: [
      {
        step: 1,
        title: 'Construct Corrosive-Free Soil Probes',
        instruction:
          'Use two graphite pencils or gold-plated audio jack contacts as soil probes to prevent electrolytic dissolution from direct DC current.'
      },
      {
        step: 2,
        title: 'Install Flyback Clamp Diode on Solenoid (CRITICAL)',
        instruction:
          'Connect 1N4007 diode directly across the solenoid coils, with cathode (silver stripe) toward +12V and anode toward MOSFET drain.',
        caution: 'Without this diode, the collapsing magnetic field creates a > 200V spike that will punch through the MOSFET gate-drain oxide layer!'
      },
      {
        step: 3,
        title: 'Calibrate Trigger Potentiometer',
        instruction:
          'Insert probes into dry soil, adjust potentiometer until pump switches ON. Insert into damp soil and verify it switches OFF.'
      }
    ],
    safetyChecklist: [
      'Flyback diode across coil is mandatory to absorb inductive voltage spikes',
      'Keep water tubing isolated from high voltage and power boards',
      'Provide current limiting 1A fuse in series with 12V pump power supply'
    ]
  }
];
