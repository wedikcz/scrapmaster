import { ScrapComponent } from '../types/scrap';

export const INITIAL_SCRAP_DATABASE: ScrapComponent[] = [
  {
    id: 'comp-ne555',
    name: 'NE555 Precision Timer IC',
    partNumber: 'NE555P',
    category: 'ic',
    packageType: 'DIP-8 / SOIC-8',
    extractedFrom: 'Old CRT TV chassis / microwave control board / toy siren',
    condition: 'working',
    quantity: 4,
    pinCount: 8,
    pinout: [
      { pin: 1, name: 'GND', type: 'ground', desc: 'Ground reference (0V)' },
      { pin: 2, name: 'TRIG', type: 'input', desc: 'Trigger input (< 1/3 Vcc starts cycle)' },
      { pin: 3, name: 'OUT', type: 'output', desc: 'Output pin (can source/sink up to 200mA)' },
      { pin: 4, name: 'RESET', type: 'input', desc: 'Active-low reset (tie to Vcc if unused)' },
      { pin: 5, name: 'CTRL', type: 'analog', desc: 'Control voltage (bypass with 10nF to GND)' },
      { pin: 6, name: 'THRESH', type: 'input', desc: 'Threshold input (> 2/3 Vcc ends cycle)' },
      { pin: 7, name: 'DISCH', type: 'output', desc: 'Open-collector discharge pin' },
      { pin: 8, name: 'VCC', type: 'power', desc: 'Supply voltage (+4.5V to +16V)' }
    ],
    specs: {
      'Supply Voltage': '4.5V - 16V DC',
      'Max Output Current': '200 mA',
      'Timing Range': 'Microseconds to hours',
      'Operating Frequency': 'Up to 500 kHz'
    },
    testProcedure:
      'Set multimeter to Diode/Continuity. Pin 1 (GND) to Pin 8 (VCC) should measure ~0.6V-0.8V forward drop. With 5V applied and 100k pullup on pin 3, ground Pin 2 briefly; Pin 3 should latch HIGH (~4.8V).',
    salvageValueEstimate: 1.5,
    hazardLevel: 'safe',
    dateAdded: '2026-10-01'
  },
  {
    id: 'comp-lm317',
    name: 'LM317T Adjustable Voltage Regulator',
    partNumber: 'LM317T',
    category: 'power',
    packageType: 'TO-220',
    extractedFrom: 'Old PC power supply / Audio amplifier PSU / CRT board',
    condition: 'working',
    quantity: 3,
    pinCount: 3,
    pinout: [
      { pin: 1, name: 'ADJ', type: 'analog', desc: 'Adjust voltage reference pin (1.25V ref)' },
      { pin: 2, name: 'VOUT', type: 'power', desc: 'Regulated output voltage (Tab is also connected)' },
      { pin: 3, name: 'VIN', type: 'power', desc: 'Unregulated DC input (up to 40V)' }
    ],
    specs: {
      'Output Voltage Range': '1.25V - 37V DC',
      'Max Output Current': '1.5 A (with heatsink)',
      'Dropout Voltage': 'Typically 2.0V - 2.5V',
      'Thermal Protection': 'Internal thermal overload shutdown'
    },
    testProcedure:
      'Check resistance between ADJ and VOUT (nominal internal 1.25V bandgap circuit). Apply 12V to VIN and GND via a 240-ohm resistor between VOUT and ADJ; VOUT should stay at ~1.25V relative to ADJ.',
    salvageValueEstimate: 2.2,
    hazardLevel: 'caution',
    safetyWarning: 'Metal tab is electrically connected to Pin 2 (VOUT). Must insulate with mica washer if mounting to grounded chassis.',
    dateAdded: '2026-10-02'
  },
  {
    id: 'comp-18650',
    name: '18650 Li-Ion Rechargeable Cell (2200mAh)',
    partNumber: 'INR18650-22P',
    category: 'power',
    packageType: 'Cylindrical 18650 (18mm x 65mm)',
    extractedFrom: 'Dead Dell / Lenovo laptop battery pack',
    condition: 'working',
    quantity: 6,
    pinCount: 2,
    pinout: [
      { pin: 1, name: 'BATT+', type: 'power', desc: 'Positive raised top terminal (+3.7V nominal)' },
      { pin: 2, name: 'BATT-', type: 'ground', desc: 'Negative flat bottom terminal (0V)' }
    ],
    specs: {
      'Nominal Voltage': '3.6V - 3.7V',
      'Full Charge Voltage': '4.20V ± 0.05V',
      'Cutoff Discharge Voltage': '2.80V - 3.00V',
      'Estimated Capacity': '2100 - 2400 mAh',
      'Max Continuous Discharge': '5A'
    },
    testProcedure:
      'Measure resting open-circuit voltage with DMM. If cell reads < 2.0V, DO NOT fast-charge (dendrite short risk). If cell is > 3.0V, slow charge to 4.2V using dedicated TP4056 with temperature monitoring.',
    salvageValueEstimate: 5.5,
    hazardLevel: 'dangerous',
    safetyWarning: 'CRITICAL LITHIUM SAFETY: Inspect outer shrink wrap for tears. Never short terminals. Never puncture. Always charge through a BMS / TP4056 module with overcurrent cutoff.',
    dateAdded: '2026-10-04'
  },
  {
    id: 'comp-tp4056',
    name: 'TP4056 1A Li-Ion Charger Board with Protection',
    partNumber: 'TP4056-PROT',
    category: 'power',
    packageType: 'Mini PCB Module (Micro-USB / Type-C)',
    extractedFrom: 'Portable mini desk fan / rechargeable work light',
    condition: 'working',
    quantity: 2,
    pinCount: 6,
    pinout: [
      { pin: 1, name: 'IN+', type: 'power', desc: '+5V USB input power' },
      { pin: 2, name: 'IN-', type: 'ground', desc: 'USB input ground' },
      { pin: 3, name: 'BAT+', type: 'power', desc: 'Connect to 18650 positive (+)' },
      { pin: 4, name: 'BAT-', type: 'ground', desc: 'Connect to 18650 negative (-)' },
      { pin: 5, name: 'OUT+', type: 'power', desc: 'Protected load power output (+)' },
      { pin: 6, name: 'OUT-', type: 'ground', desc: 'Protected load power output (-)' }
    ],
    specs: {
      'Charge Current': '1000 mA (programmable via Rprog resistor)',
      'Charging Precision': '1.5%',
      'Over-discharge Cutoff': '2.5V (DW01 protection IC)',
      'Overcurrent Cutoff': '3A (FS8205A dual MOSFET)'
    },
    testProcedure:
      'Plug into 5V USB charger. Red LED lights indicating charging mode. Green/Blue LED lights when 4.2V battery reaches termination current (~100mA).',
    salvageValueEstimate: 1.8,
    hazardLevel: 'safe',
    dateAdded: '2026-10-05'
  },
  {
    id: 'comp-stepper-dvd',
    name: 'Mini Bipolar Stepper Motor (Linear Lead Screw)',
    partNumber: 'PL15S-020',
    category: 'motor',
    packageType: 'Sled Assembly with Lead Screw (4-wire)',
    extractedFrom: 'Dead Samsung DVD-RW drive optical sled',
    condition: 'working',
    quantity: 2,
    pinCount: 4,
    pinout: [
      { pin: 1, name: 'COIL_A1', type: 'io', desc: 'Phase A Terminal 1 (~10 ohms to A2)' },
      { pin: 2, name: 'COIL_A2', type: 'io', desc: 'Phase A Terminal 2' },
      { pin: 3, name: 'COIL_B1', type: 'io', desc: 'Phase B Terminal 1 (~10 ohms to B2)' },
      { pin: 4, name: 'COIL_B2', type: 'io', desc: 'Phase B Terminal 2' }
    ],
    specs: {
      'Rated Voltage': '5V DC',
      'Step Angle': '18 degrees (20 steps/rev)',
      'Lead Screw Pitch': '3mm travel per revolution',
      'Linear Resolution': '0.15mm per full step (microsteppable to 0.009mm)',
      'Coil Resistance': '10 to 12 Ohms'
    },
    testProcedure:
      'Use DMM set to Resistance (200 ohm range). Probe pin pairs to find two isolated circuits reading ~10 ohms each. Spin lead screw by hand while reading AC mV to verify internal coils produce back-EMF.',
    salvageValueEstimate: 7.0,
    hazardLevel: 'safe',
    dateAdded: '2026-10-03'
  },
  {
    id: 'comp-7805',
    name: 'L7805CV +5V Fixed Linear Regulator',
    partNumber: 'L7805CV',
    category: 'power',
    packageType: 'TO-220',
    extractedFrom: 'Vintage stereo receiver / Broken dot-matrix printer',
    condition: 'working',
    quantity: 4,
    pinCount: 3,
    pinout: [
      { pin: 1, name: 'INPUT', type: 'power', desc: 'Unregulated DC in (+7V to +25V)' },
      { pin: 2, name: 'GND', type: 'ground', desc: 'Common ground (tied to heat-sink tab)' },
      { pin: 3, name: 'OUTPUT', type: 'power', desc: 'Regulated +5.0V output' }
    ],
    specs: {
      'Output Voltage': '4.8V - 5.2V DC',
      'Output Current': '1.5 A max',
      'Dropout Voltage': '2.0V',
      'Short Circuit Protection': 'Internal current limit'
    },
    testProcedure:
      'Supply 9V battery to Pin 1 (IN) and Pin 2 (GND). Measure Pin 3 (OUT) with DMM in DC Volts mode; should read between 4.95V and 5.05V.',
    salvageValueEstimate: 1.2,
    hazardLevel: 'safe',
    dateAdded: '2026-10-02'
  },
  {
    id: 'comp-l298n',
    name: 'L298N Dual Full-Bridge Motor Driver',
    partNumber: 'L298HN',
    category: 'motor',
    packageType: 'Multiwatt-15',
    extractedFrom: 'RC toy car / industrial robotic actuator board',
    condition: 'working',
    quantity: 1,
    pinCount: 15,
    pinout: [
      { pin: 1, name: 'SEN_A', type: 'analog', desc: 'Current sensing resistor connection for Bridge A' },
      { pin: 2, name: 'OUT1', type: 'output', desc: 'Motor A Terminal 1' },
      { pin: 3, name: 'OUT2', type: 'output', desc: 'Motor A Terminal 2' },
      { pin: 4, name: 'VS', type: 'power', desc: 'Motor supply voltage (up to 46V)' },
      { pin: 5, name: 'IN1', type: 'input', desc: 'Logic control input 1' },
      { pin: 6, name: 'ENA', type: 'input', desc: 'Enable PWM speed control for Bridge A' },
      { pin: 7, name: 'IN2', type: 'input', desc: 'Logic control input 2' },
      { pin: 8, name: 'GND', type: 'ground', desc: 'Logic and power ground' },
      { pin: 9, name: 'VSS', type: 'power', desc: 'Logic power supply (+5V)' },
      { pin: 10, name: 'IN3', type: 'input', desc: 'Logic control input 3' },
      { pin: 11, name: 'ENB', type: 'input', desc: 'Enable PWM speed control for Bridge B' },
      { pin: 12, name: 'IN4', type: 'input', desc: 'Logic control input 4' },
      { pin: 13, name: 'OUT3', type: 'output', desc: 'Motor B Terminal 1' },
      { pin: 14, name: 'OUT4', type: 'output', desc: 'Motor B Terminal 2' },
      { pin: 15, name: 'SEN_B', type: 'analog', desc: 'Current sensing resistor connection for Bridge B' }
    ],
    specs: {
      'Operating Supply': 'Up to 46V DC',
      'Total DC Current': '4A peak (2A continuous per channel)',
      'Low Saturation Voltage': 'Bipolar Darlington outputs'
    },
    testProcedure:
      'Check resistance between OUT pins and GND/VS to ensure no shorted transistors. Power VSS with 5V, VS with 12V; pulse IN1/IN2 to check direction reversal on voltmeter.',
    salvageValueEstimate: 4.5,
    hazardLevel: 'caution',
    safetyWarning: 'Requires heatsink under > 0.8A load. Always install flyback diodes (e.g. 1N4007 or fast diodes) across motor terminals if not built into PCB.',
    dateAdded: '2026-10-06'
  },
  {
    id: 'comp-irfz44n',
    name: 'IRFZ44N N-Channel Power MOSFET (55V 49A)',
    partNumber: 'IRFZ44N',
    category: 'power',
    packageType: 'TO-220',
    extractedFrom: 'Car audio amplifier / UPS power inverter board',
    condition: 'working',
    quantity: 4,
    pinCount: 3,
    pinout: [
      { pin: 1, name: 'GATE', type: 'input', desc: 'Gate control (isolated oxide layer)' },
      { pin: 2, name: 'DRAIN', type: 'output', desc: 'Drain power terminal (connected to center pin & tab)' },
      { pin: 3, name: 'SOURCE', type: 'ground', desc: 'Source power terminal (connected to GND/load)' }
    ],
    specs: {
      'Drain-Source Voltage (Vdss)': '55V',
      'Continuous Drain Current (Id)': '49A at 25°C',
      'RDS(on)': '17.5 mOhm max',
      'Gate Threshold Voltage (Vgs(th))': '2.0V - 4.0V'
    },
    testProcedure:
      'Set DMM to Diode mode. Touch black probe to Source, red probe to Drain (reads infinite). Touch red probe momentarily to Gate to charge gate capacitance. Now touch red probe to Drain: MOSFET will show ON state (~0.1V)! Touch black probe to Gate to discharge: it turns OFF immediately.',
    salvageValueEstimate: 2.5,
    hazardLevel: 'safe',
    dateAdded: '2026-10-07'
  },
  {
    id: 'comp-400v-cap',
    name: '400V 470uF High-Voltage Primary Electrolytic Capacitor',
    partNumber: 'CAP-400V-470UF',
    category: 'hazard',
    packageType: 'Snap-in Radial Can (35mm x 50mm)',
    extractedFrom: 'PC ATX Power Supply / CRT TV primary switch-mode stage',
    condition: 'untested',
    quantity: 2,
    pinCount: 2,
    pinout: [
      { pin: 1, name: 'POS (+)', type: 'power', desc: 'Positive terminal' },
      { pin: 2, name: 'NEG (-)', type: 'ground', desc: 'Negative terminal (marked by wide white stripe with "-" signs)' }
    ],
    specs: {
      'Working Voltage': '400V DC (surge 450V)',
      'Capacitance': '470 uF ± 20%',
      'Stored Energy': '37.6 Joules (FATAL shock hazard)',
      'Temperature Rating': '105°C'
    },
    testProcedure:
      'STEP 1: NEVER TOUCH TERMINALS! STEP 2: Measure DC voltage with DMM across pins. If > 5V, discharge using a 10k 5W ceramic resistor for 30 seconds. Confirm 0.0V before continuing.',
    salvageValueEstimate: 3.5,
    hazardLevel: 'critical',
    safetyWarning: 'LETHAL STORED CHARGE WARNING: This capacitor can hold up to 340V DC long after the device was unplugged from the wall. Always verify discharge with voltmeter before soldering.',
    dateAdded: '2026-10-08'
  },
  {
    id: 'comp-1n4007',
    name: '1N4007 1000V 1A Silicon Rectifier Diode',
    partNumber: '1N4007',
    category: 'passive',
    packageType: 'DO-41 Axial',
    extractedFrom: 'Any AC-DC power adapter / toaster oven board / microwave',
    condition: 'working',
    quantity: 12,
    pinCount: 2,
    pinout: [
      { pin: 1, name: 'ANODE', type: 'passive', desc: 'Unmarked side (+) positive' },
      { pin: 2, name: 'CATHODE', type: 'passive', desc: 'Silver banded side (-) negative' }
    ],
    specs: {
      'Peak Reverse Voltage': '1000V',
      'Average Forward Current': '1.0A',
      'Forward Voltage Drop': '0.7V at 1A',
      'Reverse Leakage': '5 uA'
    },
    testProcedure:
      'Set DMM to Diode Test. Red to Anode, Black to Cathode (silver band) reads ~0.60V. Reverse probes reads "OL" (Over Limit). If reads 0.00V in both directions, diode is shorted.',
    salvageValueEstimate: 0.3,
    hazardLevel: 'safe',
    dateAdded: '2026-10-01'
  },
  {
    id: 'comp-optocoupler-pc817',
    name: 'PC817 4-Pin Phototransistor Optocoupler',
    partNumber: 'PC817C',
    category: 'ic',
    packageType: 'DIP-4',
    extractedFrom: 'Phone charger / SMPS power supply feedback loop',
    condition: 'working',
    quantity: 5,
    pinCount: 4,
    pinout: [
      { pin: 1, name: 'ANODE', type: 'input', desc: 'Infrared LED Anode (+)' },
      { pin: 2, name: 'CATHODE', type: 'ground', desc: 'Infrared LED Cathode (-)' },
      { pin: 3, name: 'EMITTER', type: 'output', desc: 'Phototransistor Emitter' },
      { pin: 4, name: 'COLLECTOR', type: 'power', desc: 'Phototransistor Collector' }
    ],
    specs: {
      'Isolation Voltage': '5000 Vrms',
      'Current Transfer Ratio (CTR)': '200% - 400%',
      'Collector-Emitter Voltage': '80V max'
    },
    testProcedure:
      'Pin 1-2 shows ~1.15V forward drop (IR LED). Connect DMM resistance mode between Pin 3-4 (reads open). Apply 5V through 1k resistor to Pins 1-2: Pin 3-4 resistance drops to < 50 ohms.',
    salvageValueEstimate: 0.8,
    hazardLevel: 'safe',
    dateAdded: '2026-10-02'
  },
  {
    id: 'comp-atmega328p',
    name: 'ATmega328P 8-Bit AVR Microcontroller (DIP-28)',
    partNumber: 'ATmega328P-PU',
    category: 'ic',
    packageType: 'DIP-28',
    extractedFrom: 'Old Arduino Uno clone / industrial controller board',
    condition: 'working',
    quantity: 1,
    pinCount: 28,
    pinout: [
      { pin: 1, name: 'RESET', type: 'input', desc: 'Active-low reset (pull high with 10k)' },
      { pin: 7, name: 'VCC', type: 'power', desc: '+5V Power' },
      { pin: 8, name: 'GND', type: 'ground', desc: 'Ground (0V)' },
      { pin: 9, name: 'XTAL1', type: 'input', desc: '16MHz Crystal oscillator pin 1' },
      { pin: 10, name: 'XTAL2', type: 'output', desc: '16MHz Crystal oscillator pin 2' },
      { pin: 17, name: 'MOSI (D11)', type: 'io', desc: 'SPI Master Out / Slave In' },
      { pin: 18, name: 'MISO (D12)', type: 'io', desc: 'SPI Master In / Slave Out' },
      { pin: 19, name: 'SCK (D13)', type: 'io', desc: 'SPI Clock (Built-in LED pin)' }
    ],
    specs: {
      'Flash Memory': '32 KB',
      'SRAM': '2 KB',
      'Clock Speed': 'Up to 20 MHz (typically 16MHz)',
      'Operating Voltage': '1.8V - 5.5V'
    },
    testProcedure:
      'Power pins 7 (+5V) and 8 (GND) with 100nF decoupling cap. Measure Pin 1 (RESET); ensure it is pulled up to 5V. Check for 16MHz clock oscillations or connect FTDI adapter to test bootloader response.',
    salvageValueEstimate: 4.8,
    newMarketPriceEstimate: 7.20,
    co2SavedKg: 0.15,
    hazardLevel: 'safe',
    dateAdded: '2026-10-09'
  },
  {
    id: 'comp-lm358',
    name: 'LM358 Dual Operational Amplifier',
    partNumber: 'LM358P',
    category: 'ic',
    packageType: 'DIP-8 / SOIC-8',
    extractedFrom: 'Audio pre-amp / analog sensor board / UPS inverter',
    condition: 'working',
    quantity: 3,
    pinCount: 8,
    pinout: [
      { pin: 1, name: 'OUT1', type: 'output', desc: 'Op-Amp 1 Output' },
      { pin: 2, name: 'IN1-', type: 'input', desc: 'Op-Amp 1 Inverting Input (-)' },
      { pin: 3, name: 'IN1+', type: 'input', desc: 'Op-Amp 1 Non-Inverting Input (+)' },
      { pin: 4, name: 'GND', type: 'ground', desc: 'Ground / Negative Rail (0V)' },
      { pin: 5, name: 'IN2+', type: 'input', desc: 'Op-Amp 2 Non-Inverting Input (+)' },
      { pin: 6, name: 'IN2-', type: 'input', desc: 'Op-Amp 2 Inverting Input (-)' },
      { pin: 7, name: 'OUT2', type: 'output', desc: 'Op-Amp 2 Output' },
      { pin: 8, name: 'VCC', type: 'power', desc: 'Positive Supply Rail (+3V to +32V)' }
    ],
    specs: {
      'Supply Voltage': 'Single Supply 3V - 32V (or Dual ±1.5V to ±16V)',
      'Gain Bandwidth Product': '1.1 MHz',
      'Input Offset Voltage': '2 mV typical',
      'Output Current': 'Up to 40 mA source'
    },
    testProcedure:
      'Connect pin 4 to GND and pin 8 to +5V. Wire as voltage follower (connect OUT1 pin 1 to IN1- pin 2). Apply 2.5V to IN1+ pin 3. Measure pin 1 OUT1: should read exactly 2.50V.',
    salvageValueEstimate: 1.2,
    newMarketPriceEstimate: 2.10,
    co2SavedKg: 0.05,
    hazardLevel: 'safe',
    dateAdded: '2026-10-10'
  },
  {
    id: 'comp-tl072',
    name: 'TL072 Low-Noise JFET-Input Dual Op-Amp',
    partNumber: 'TL072CP',
    category: 'ic',
    packageType: 'DIP-8',
    extractedFrom: 'Guitar pedal / studio audio mixer / synthesizer board',
    condition: 'working',
    quantity: 2,
    pinCount: 8,
    pinout: [
      { pin: 1, name: '1OUT', type: 'output', desc: 'Channel 1 Audio Output' },
      { pin: 2, name: '1IN-', type: 'input', desc: 'Channel 1 Inverting Input' },
      { pin: 3, name: '1IN+', type: 'input', desc: 'Channel 1 Non-Inverting Input' },
      { pin: 4, name: 'VCC-', type: 'ground', desc: 'Negative supply / GND rail' },
      { pin: 5, name: '2IN+', type: 'input', desc: 'Channel 2 Non-Inverting Input' },
      { pin: 6, name: '2IN-', type: 'input', desc: 'Channel 2 Inverting Input' },
      { pin: 7, name: '2OUT', type: 'output', desc: 'Channel 2 Audio Output' },
      { pin: 8, name: 'VCC+', type: 'power', desc: 'Positive supply (+7V to +36V)' }
    ],
    specs: {
      'Slew Rate': '13 V/µs high-speed audio',
      'Input Impedance': '10^12 Ohms (JFET input)',
      'Total Harmonic Distortion': '0.003%',
      'Bandwidth': '3 MHz'
    },
    testProcedure:
      'Provide dual supply ±9V. Check quiescent current (< 3mA). Connect sine wave 1kHz to non-inverting input with gain = 2; inspect output on oscilloscope for clean clipping-free wave.',
    salvageValueEstimate: 1.8,
    newMarketPriceEstimate: 3.40,
    co2SavedKg: 0.06,
    hazardLevel: 'safe',
    dateAdded: '2026-10-10'
  },
  {
    id: 'comp-2n7000',
    name: '2N7000 N-Channel Small-Signal MOSFET',
    partNumber: '2N7000',
    category: 'power',
    packageType: 'TO-92',
    extractedFrom: 'PC motherboard logic level shifter / telecom router',
    condition: 'working',
    quantity: 6,
    pinCount: 3,
    pinout: [
      { pin: 1, name: 'SOURCE', type: 'ground', desc: 'Source pin (GND/0V)' },
      { pin: 2, name: 'GATE', type: 'input', desc: 'Logic control Gate' },
      { pin: 3, name: 'DRAIN', type: 'output', desc: 'Drain connected to load / pull-up' }
    ],
    specs: {
      'Drain-Source Voltage': '60V',
      'Continuous Drain Current': '200 mA (500 mA pulsed)',
      'Gate Threshold Vgs(th)': '0.8V - 3.0V (3.3V logic compatible)',
      'RDS(on)': '5.0 Ohms max'
    },
    testProcedure:
      'Use DMM diode mode. Source to Drain reads ~0.65V (body diode). Touch Gate with positive probe to charge gate; Source-to-Drain conduction turns ON (< 10 ohms). Touch Gate to Source to turn OFF.',
    salvageValueEstimate: 0.5,
    newMarketPriceEstimate: 1.20,
    co2SavedKg: 0.02,
    hazardLevel: 'safe',
    dateAdded: '2026-10-10'
  },
  {
    id: 'comp-esp32-wroom',
    name: 'ESP32-WROOM-32 WiFi & Bluetooth Dual-Core MCU',
    partNumber: 'ESP32-WROOM-32D',
    category: 'ic',
    packageType: 'Module (38-Pin DevKit)',
    extractedFrom: 'Smart power plug / IoT smart bulb / broken 3D printer hub',
    condition: 'working',
    quantity: 2,
    pinCount: 38,
    pinout: [
      { pin: 1, name: '3V3', type: 'power', desc: '+3.3V Main Power Rail' },
      { pin: 2, name: 'EN (RST)', type: 'input', desc: 'Chip Enable / Reset (Pull HIGH)' },
      { pin: 3, name: 'GPIO36 (VP)', type: 'analog', desc: 'ADC1_CH0 Sensor Input only' },
      { pin: 4, name: 'GPIO39 (VN)', type: 'analog', desc: 'ADC1_CH3 Sensor Input only' },
      { pin: 6, name: 'GPIO34', type: 'analog', desc: 'ADC1_CH6 Input only' },
      { pin: 7, name: 'GPIO35', type: 'analog', desc: 'ADC1_CH7 Input only' },
      { pin: 8, name: 'GPIO32', type: 'io', desc: 'ADC1_CH4, Touch9, RTC GPIO' },
      { pin: 9, name: 'GPIO33', type: 'io', desc: 'ADC1_CH5, Touch8' },
      { pin: 10, name: 'GPIO25', type: 'output', desc: 'DAC1 analog audio output' },
      { pin: 11, name: 'GPIO26', type: 'output', desc: 'DAC2 analog audio output' },
      { pin: 12, name: 'GPIO27', type: 'io', desc: 'Touch7, PWM, SPI' },
      { pin: 13, name: 'GPIO14', type: 'io', desc: 'HSPI_CLK, Touch6' },
      { pin: 14, name: 'GPIO12', type: 'io', desc: 'HSPI_MISO (Strapping pin)' },
      { pin: 15, name: 'GND', type: 'ground', desc: 'System Ground (0V)' },
      { pin: 16, name: 'GPIO13', type: 'io', desc: 'HSPI_MOSI' },
      { pin: 21, name: 'GPIO21 (SDA)', type: 'io', desc: 'Default I2C Data line' },
      { pin: 22, name: 'GPIO22 (SCL)', type: 'io', desc: 'Default I2C Clock line' },
      { pin: 23, name: 'GPIO1 (TX0)', type: 'output', desc: 'UART0 Serial Debug TX' },
      { pin: 24, name: 'GPIO3 (RX0)', type: 'input', desc: 'UART0 Serial Debug RX' },
      { pin: 38, name: 'GND', type: 'ground', desc: 'System Ground' }
    ],
    specs: {
      'CPU': 'Xtensa Dual-Core 32-bit LX6 up to 240 MHz',
      'Wireless': 'Wi-Fi 802.11 b/g/n + Bluetooth 4.2 BR/EDR & BLE',
      'SRAM': '520 KB internal SRAM',
      'Flash': '4 MB SPI Flash',
      'Peripherals': 'Capacitive touch, ADCs, DACs, UART, SPI, I2C, PWM'
    },
    testProcedure:
      'Connect via USB to computer. Verify red power LED. Open WebSerial Terminal at 115200 baud; press RST button and observe ESP-IDF bootloader greeting banner "rst:0x1 (POWERON_RESET)".',
    salvageValueEstimate: 5.0,
    newMarketPriceEstimate: 9.80,
    co2SavedKg: 0.25,
    hazardLevel: 'safe',
    dateAdded: '2026-10-10'
  },
  {
    id: 'comp-attiny85',
    name: 'ATtiny85 8-Bit AVR Microcontroller (DIP-8)',
    partNumber: 'ATtiny85-20PU',
    category: 'ic',
    packageType: 'DIP-8',
    extractedFrom: 'Digispark USB key / mini LED flasher module',
    condition: 'working',
    quantity: 2,
    pinCount: 8,
    pinout: [
      { pin: 1, name: 'PB5 (RESET)', type: 'input', desc: 'Reset pin / ADC0' },
      { pin: 2, name: 'PB3', type: 'io', desc: 'XTAL1 / ADC3 / Analog Input 3' },
      { pin: 3, name: 'PB4', type: 'io', desc: 'XTAL2 / ADC2 / PWM / Analog Input 2' },
      { pin: 4, name: 'GND', type: 'ground', desc: 'Ground (0V)' },
      { pin: 5, name: 'PB0 (MOSI)', type: 'io', desc: 'SDA / PWM0 / SPI MOSI' },
      { pin: 6, name: 'PB1 (MISO)', type: 'io', desc: 'PWM1 / SPI MISO' },
      { pin: 7, name: 'PB2 (SCK)', type: 'io', desc: 'SCL / ADC1 / SPI Clock' },
      { pin: 8, name: 'VCC', type: 'power', desc: '+2.7V to +5.5V Supply' }
    ],
    specs: {
      'Flash Memory': '8 KB',
      'EEPROM': '512 Bytes',
      'SRAM': '512 Bytes',
      'Clock': 'Internal 8MHz / 16MHz PLL'
    },
    testProcedure:
      'Power pins 8 (VCC) and 4 (GND). Use Arduino as ISP or USBasp flasher to run avrdude signature check: signature must return 0x1e 0x93 0x0b.',
    salvageValueEstimate: 2.2,
    newMarketPriceEstimate: 4.50,
    co2SavedKg: 0.08,
    hazardLevel: 'safe',
    dateAdded: '2026-10-10'
  }
];
