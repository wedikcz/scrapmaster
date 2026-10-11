import { InverseTeardown } from '../types/scrap';

export const SAMPLE_TEARDOWNS: InverseTeardown[] = [
  {
    id: 'td-dvd-rw',
    title: 'DVD-RW Optical Drive Mechanical Sled Recovery',
    donorDevice: 'Samsung / LG 5.25" Desktop Optical Drive',
    difficulty: 'easy',
    dangerLevel: 'medium',
    keyYield: [
      '2x Micro Bipolar Stepper Motors with 3mm Pitch Lead Screws',
      '650nm Red Laser Diode (250mW pulsed)',
      'High-speed Brushless 3-phase Spindle Motor',
      '2x Optical Slot Interrupters / Limit Switches',
      'Neodymium Super-magnets (Voice coil focus lens)'
    ],
    safetyWarnings: [
      'LASER DANGER: Class 3B/4 invisible infrared & high power red laser diodes. Never apply power to optical diode without OD5+ safety goggles.',
      'Wear eye protection when prying metal casing clips to prevent flying springs.'
    ],
    frames: [
      {
        id: 'f1',
        timestamp: '00:15',
        title: 'Casing Removal & Eject Mechanism',
        action: 'Depress paperclip into emergency eject hole to open tray. Remove 4 Phillips screws from bottom plate.',
        toolRequired: 'PH1 Precision Screwdriver, Paperclip',
        extractedPart: 'Tray guide rail, Spring-loaded latch',
        salvageTips: 'Retain the miniature steel springs; they are ideal for 3D printer bed leveling or robotics tensioning.'
      },
      {
        id: 'f2',
        timestamp: '01:05',
        title: 'Optical Sled Sub-Assembly Isolation',
        action: 'Disconnect flexible flat cables (FFC) from logic board. Release the two polished steel guide shafts.',
        toolRequired: 'ESD Tweezers, Flathead 2.0mm',
        extractedPart: 'Dual Polished 3mm Steel Linear Shafts',
        salvageTips: 'These shafts have near-zero friction; ideal for mini CNC X-axis guides.'
      },
      {
        id: 'f3',
        timestamp: '02:40',
        title: 'Lead-Screw Stepper Extraction',
        action: 'Unscrew 2x tiny M1.4 screws holding stepper stator. Desolder 4-pin FPC ribbon using 300°C iron.',
        toolRequired: 'Soldering Iron, Flux, Desoldering Braid',
        extractedPart: 'PL15S Bipolar Stepper Motor (Lead screw attached)',
        caution: 'Heat ribbon pads for under 2 seconds to avoid peeling copper traces.',
        salvageTips: 'Measure resistance between pin pairs: ~10 ohms indicates a healthy phase coil.'
      },
      {
        id: 'f4',
        timestamp: '04:10',
        title: 'Laser Diode & Neodymium Magnet Harvesting',
        action: 'Carefully crack plastic optical prism bracket with flush cutters. Harvest the 2 tiny rectangular neodymium magnets.',
        toolRequired: 'Flush Cutters, Safety Glasses',
        extractedPart: 'TO-18 Laser Can + 2x N45 Rare-Earth Magnets',
        caution: 'Class 3B Laser radiation risk. Do not connect directly to power without constant-current driver.',
        salvageTips: 'The voice-coil lens actuator magnets are among the strongest miniature magnets available.'
      }
    ],
    revivalProjects: ['project-cnc-plotter', 'project-plant-watering']
  },
  {
    id: 'td-atx-psu',
    title: 'Desktop ATX Power Supply (500W) Disassembly & Conversion',
    donorDevice: 'Old ATX Desktop Computer Power Supply Unit',
    difficulty: 'moderate',
    dangerLevel: 'high',
    keyYield: [
      '12V 30A High Current Rail (360W capacity)',
      '5V 25A High Current Rail',
      '3.3V 20A Logic Rail',
      '120mm / 80mm High-Airflow Brushless Fan',
      'Ferrite Toroid Chokes & Power Shottky Rectifiers (e.g. STPS3045)',
      'Alps Power Switch & IEC C14 Mains Socket'
    ],
    safetyWarnings: [
      'FATAL VOLTAGE HAZARD: Primary side 200V-400V capacitors can store lethal electrical charge for days after being disconnected.',
      'Always test primary capacitors with a DC voltmeter and discharge safely through a 10k 5W ceramic resistor before touching!'
    ],
    frames: [
      {
        id: 'atx-f1',
        timestamp: '00:30',
        title: 'Safe Discharge & Opening Case',
        action: 'Verify AC cable disconnected. Measure voltage on big 400V cans. Discharge with high-wattage power resistor.',
        toolRequired: 'Multimeter, 10k 5W Bleeder Resistor, PH2 Screwdriver',
        extractedPart: 'Steel chassis, Fan guard grille',
        caution: 'Never short primary capacitor terminals with a screwdriver; explosive arc flash can cause blindness and PCB damage.',
        salvageTips: 'Check that meter reads under 1.0V DC before proceeding.'
      },
      {
        id: 'atx-f2',
        timestamp: '02:15',
        title: 'Wire Bundle Decoding & PS-ON Hookup',
        action: 'Locate Green wire (PS_ON#). Connect to any Black wire (GND) with a switch to initiate soft-start turn on.',
        toolRequired: 'Wire Strippers, Heat Shrink',
        extractedPart: 'Color-Coded 18AWG Copper Stranded Wire Harness',
        salvageTips: 'Green = PS-ON, Black = GND, Yellow = +12V, Red = +5V, Orange = +3.3V, Purple = +5VSB (always on standby).'
      },
      {
        id: 'atx-f3',
        timestamp: '04:30',
        title: 'Minimum Dummy Load Installation',
        action: 'Older ATX designs require a 5W load on the +5V rail (Red) to keep PWM chip regulated. Solder a 10 Ω 10W sand resistor.',
        toolRequired: 'Soldering Iron, Thermal Compound',
        extractedPart: 'Output Banana Jack Terminals',
        caution: 'Dummy load resistor will get warm; screw it to the aluminum casing for thermal dissipation.',
        salvageTips: 'Modern group-regulated supplies will stay active without dummy loads; test first with a fan load.'
      }
    ],
    revivalProjects: ['project-bench-psu']
  },
  {
    id: 'td-vape-rescue',
    title: 'Disposable Vape Lithium Cell & Sensor Harvesting',
    donorDevice: 'Discarded Disposable Vape (E-Waste)',
    difficulty: 'easy',
    dangerLevel: 'medium',
    keyYield: [
      '3.7V 550mAh - 850mAh Pure Cobalt Li-Po Pouch Cell',
      'Acoustic Airflow Pressure Switch (Microphone-activated switch)',
      'Sub-Ohm Nichrome Heating Element',
      'Silicon Gaskets and RGB Indicator LED'
    ],
    safetyWarnings: [
      'LITHIUM FIRE DANGER: Pouch cells have delicate aluminum foil packaging. Never use sharp metal tools or pry aggressively.',
      'Discard cells showing any physical swelling ("pillowing"), odor of sweet electrolyte, or voltage below 2.0V.'
    ],
    frames: [
      {
        id: 'vp-f1',
        timestamp: '00:20',
        title: 'Bottom Cap Removal without Puncturing',
        action: 'Grip outer aluminum cylinder with pliers wrapped in tape. Wiggle bottom silicone/plastic stopper until friction seal breaks.',
        toolRequired: 'Padded Pliers, Nitrile Gloves',
        extractedPart: 'Bottom Airflow Cap & Silicone Bumper',
        caution: 'Avoid crushing the inner battery canister.',
        salvageTips: 'Do not use a rotary tool or saw which might cut into the battery wall.'
      },
      {
        id: 'vp-f2',
        timestamp: '01:10',
        title: 'Slide Out Core Assembly & Cut Wires Individually',
        action: 'Push the sponge and battery core out. CUT THE WIRES ONE AT A TIME! Never cut both positive and negative wires together with flush cutters.',
        toolRequired: 'Flush Cutters, Kapton Tape',
        extractedPart: '3.7V Pouch Cell, Solder Tabs',
        caution: 'Cutting both wires at the same time with metal cutters will short-circuit the cell instantly, creating sparks and fire!',
        salvageTips: 'Immediately tape one lead with Kapton tape before handling the second lead.'
      },
      {
        id: 'vp-f3',
        timestamp: '02:00',
        title: 'Voltage Check & TP4056 Mating',
        action: 'Measure DC voltage with multimeter. Solder cell positive to B+ and negative to B- of TP4056 board.',
        toolRequired: 'DMM, TP4056 Module',
        extractedPart: 'Rechargeable Energy Core',
        salvageTips: 'If the cell reads 3.7V to 4.1V, it is in prime condition. Pair with small solar cell or 5V USB charger.'
      }
    ],
    revivalProjects: ['project-vape-powerbank']
  }
];
