import { DetectedBox, ScrapComponent } from '../types/scrap';
import { INITIAL_SCRAP_DATABASE } from '../data/scrapDatabase';

export interface SampleBoard {
  id: string;
  name: string;
  donorSource: string;
  description: string;
  category: 'consumer' | 'power' | 'computing' | 'appliance';
  hazardsFound: number;
  salvageScore: number;
  previewUrl: string;
  boxes: DetectedBox[];
}

export const SAMPLE_BOARDS: SampleBoard[] = [
  {
    id: 'board-dvd-sled',
    name: 'DVD-RW Optical Pickup & Stepper Sled',
    donorSource: 'Dead Samsung 5.25" PC Optical Drive',
    description: 'Precision mechanical sled featuring dual linear rails, bipolar stepper motor, high power optical pickup, and limit sensors.',
    category: 'computing',
    hazardsFound: 1,
    salvageScore: 92,
    previewUrl: 'dvd-sled',
    boxes: [
      {
        id: 'box-dvd-1',
        x: 18,
        y: 22,
        width: 32,
        height: 28,
        label: 'PL15S Bipolar Stepper Motor',
        category: 'motor',
        confidence: 0.96,
        component: INITIAL_SCRAP_DATABASE.find(c => c.id === 'comp-stepper-dvd')!,
        hazardLevel: 'safe'
      },
      {
        id: 'box-dvd-2',
        x: 54,
        y: 20,
        width: 30,
        height: 34,
        label: 'Optical Diode Assembly (Class 3B)',
        category: 'hazard',
        confidence: 0.91,
        component: {
          id: 'comp-laser-diode',
          name: '650nm High-Power Laser Diode (TO-18)',
          partNumber: 'RLD65PZB5',
          category: 'hazard',
          packageType: 'TO-18 Can (5.6mm)',
          extractedFrom: 'DVD Optical Pickup',
          condition: 'working',
          quantity: 1,
          pinCount: 3,
          pinout: [
            { pin: 1, name: 'LD_ANODE', type: 'input', desc: 'Laser Diode Anode' },
            { pin: 2, name: 'CASE_GND', type: 'ground', desc: 'Case Common Pin' },
            { pin: 3, name: 'PD_CATHODE', type: 'output', desc: 'Internal Photodiode Monitor' }
          ],
          specs: {
            'Wavelength': '650nm (Deep Red)',
            'Optical Power': '250mW pulsed (Dangerous)',
            'Operating Current': '150mA - 220mA',
            'Forward Voltage': '2.2V - 2.8V'
          },
          testProcedure:
            'Do NOT test directly with battery. Use adjustable bench supply with current limit set to 30mA first. Must wear OD5+ laser safety glasses.',
          salvageValueEstimate: 8.5,
          hazardLevel: 'dangerous',
          safetyWarning: 'CLASS 3B LASER RADIATION: Reflected beam causes instant, permanent retinal blindness. Wear certified 650nm safety goggles!',
          dateAdded: '2026-10-09'
        },
        hazardLevel: 'dangerous',
        hazardNotice: 'High-power optical emission risk. Never stare directly into lens.'
      },
      {
        id: 'box-dvd-3',
        x: 24,
        y: 62,
        width: 25,
        height: 22,
        label: 'Subminiature Limit Switch',
        category: 'switch',
        confidence: 0.94,
        component: {
          id: 'comp-microswitch',
          name: 'Carriage Endstop Microswitch',
          partNumber: 'MSW-SMD-SPST',
          category: 'switch',
          packageType: 'SMD SPST-NO',
          extractedFrom: 'DVD sled homing switch',
          condition: 'working',
          quantity: 2,
          pinCount: 2,
          pinout: [
            { pin: 1, name: 'COM', type: 'passive', desc: 'Common contact' },
            { pin: 2, name: 'NO', type: 'passive', desc: 'Normally open contact' }
          ],
          specs: {
            'Rating': '12V 50mA',
            'Actuation Force': '0.74 N',
            'Travel': '0.5 mm'
          },
          testProcedure: 'Multimeter continuity buzzer sounds when mechanical lever is pressed.',
          salvageValueEstimate: 1.0,
          hazardLevel: 'safe',
          dateAdded: '2026-10-09'
        },
        hazardLevel: 'safe'
      },
      {
        id: 'box-dvd-4',
        x: 58,
        y: 60,
        width: 28,
        height: 25,
        label: 'Neodymium Voice Coil Magnets',
        category: 'passive',
        confidence: 0.98,
        component: {
          id: 'comp-neo-magnets',
          name: 'N45 Sintered Neodymium Magnets',
          partNumber: 'MAG-NEO-PAIR',
          category: 'passive',
          packageType: 'Rectangular Prism (8x4x2mm)',
          extractedFrom: 'Lens voice-coil actuator',
          condition: 'working',
          quantity: 2,
          pinCount: 0,
          pinout: [],
          specs: {
            'Grade': 'N45 Rare Earth',
            'Pull Force': '~1.2 kg each',
            'Coating': 'Triple Ni-Cu-Ni plating'
          },
          testProcedure: 'Extreme magnetic pull force on ferrous metals.',
          salvageValueEstimate: 3.0,
          hazardLevel: 'safe',
          dateAdded: '2026-10-09'
        },
        hazardLevel: 'safe'
      }
    ]
  },
  {
    id: 'board-atx-psu',
    name: '500W Switch-Mode PC Power Supply Board',
    donorSource: 'Discarded Cooler Master ATX PC Power Supply',
    description: 'High-power AC-DC conversion stage with mains rectification, high-voltage filter cans, and high-current 12V/5V secondary outputs.',
    category: 'power',
    hazardsFound: 2,
    salvageScore: 88,
    previewUrl: 'atx-psu',
    boxes: [
      {
        id: 'box-atx-1',
        x: 10,
        y: 15,
        width: 32,
        height: 38,
        label: '400V 470uF Primary Capacitor',
        category: 'hazard',
        confidence: 0.98,
        component: INITIAL_SCRAP_DATABASE.find(c => c.id === 'comp-400v-cap')!,
        hazardLevel: 'critical',
        hazardNotice: 'FATAL SHOCK RISK: Capacitor stores up to 340V DC. Must discharge with 10k 5W resistor before contact!'
      },
      {
        id: 'box-atx-2',
        x: 48,
        y: 18,
        width: 24,
        height: 32,
        label: 'LM317 / 7805 TO-220 Regulators',
        category: 'power',
        confidence: 0.93,
        component: INITIAL_SCRAP_DATABASE.find(c => c.id === 'comp-lm317')!,
        hazardLevel: 'caution'
      },
      {
        id: 'box-atx-3',
        x: 75,
        y: 20,
        width: 20,
        height: 30,
        label: 'PC817 Optocouplers (4-Pin DIP)',
        category: 'ic',
        confidence: 0.95,
        component: INITIAL_SCRAP_DATABASE.find(c => c.id === 'comp-optocoupler-pc817')!,
        hazardLevel: 'safe'
      },
      {
        id: 'box-atx-4',
        x: 35,
        y: 58,
        width: 30,
        height: 32,
        label: '1N4007 High-Voltage Diodes',
        category: 'passive',
        confidence: 0.96,
        component: INITIAL_SCRAP_DATABASE.find(c => c.id === 'comp-1n4007')!,
        hazardLevel: 'safe'
      },
      {
        id: 'box-atx-5',
        x: 70,
        y: 56,
        width: 25,
        height: 34,
        label: 'IRFZ44N / Switching MOSFETs',
        category: 'power',
        confidence: 0.92,
        component: INITIAL_SCRAP_DATABASE.find(c => c.id === 'comp-irfz44n')!,
        hazardLevel: 'caution'
      }
    ]
  },
  {
    id: 'board-microwave-ctrl',
    name: 'Microwave Oven Control & Relay Board',
    donorSource: 'Defective Panasonic Countertop Microwave',
    description: 'Industrial control board containing high-current 16A relays, 555 timer sub-circuit, piezo buzzer, and digital rotary encoder.',
    category: 'appliance',
    hazardsFound: 1,
    salvageScore: 85,
    previewUrl: 'microwave-ctrl',
    boxes: [
      {
        id: 'box-mw-1',
        x: 20,
        y: 18,
        width: 28,
        height: 30,
        label: 'NE555 Timer IC (DIP-8)',
        category: 'ic',
        confidence: 0.97,
        component: INITIAL_SCRAP_DATABASE.find(c => c.id === 'comp-ne555')!,
        hazardLevel: 'safe'
      },
      {
        id: 'box-mw-2',
        x: 55,
        y: 16,
        width: 35,
        height: 36,
        label: '12V 16A High-Power Relay',
        category: 'switch',
        confidence: 0.94,
        component: {
          id: 'comp-relay-12v',
          name: '12VDC 16A SPST Power Relay',
          partNumber: 'G5Q-14-12VDC',
          category: 'switch',
          packageType: 'Sealed Sugar Cube PCB Relay',
          extractedFrom: 'Microwave magnetron trigger circuit',
          condition: 'working',
          quantity: 2,
          pinCount: 5,
          pinout: [
            { pin: 1, name: 'COIL_1', type: 'input', desc: 'Relay Coil 12V (+)' },
            { pin: 2, name: 'COIL_2', type: 'ground', desc: 'Relay Coil GND (-)' },
            { pin: 3, name: 'COM', type: 'passive', desc: 'Common switch terminal' },
            { pin: 4, name: 'NO', type: 'passive', desc: 'Normally Open contact (16A 250VAC)' },
            { pin: 5, name: 'NC', type: 'passive', desc: 'Normally Closed contact' }
          ],
          specs: {
            'Coil Voltage': '12V DC (~33mA coil current)',
            'Contact Rating': '16A 250V AC / 30V DC',
            'Coil Resistance': '360 Ohms',
            'Isolation': '4000 VAC dielectric strength'
          },
          testProcedure: 'Apply 12V to coil pins; distinct audible mechanical click. Continuity between COM and NO pins.',
          salvageValueEstimate: 3.2,
          hazardLevel: 'caution',
          safetyWarning: 'When switching AC mains with salvaged relays, ensure trace creepage clearance > 3mm.',
          dateAdded: '2026-10-09'
        },
        hazardLevel: 'caution'
      },
      {
        id: 'box-mw-3',
        x: 22,
        y: 56,
        width: 26,
        height: 28,
        label: 'High-Volume Piezo Buzzer',
        category: 'passive',
        confidence: 0.96,
        component: {
          id: 'comp-piezo',
          name: 'Resonant Piezoelectric Transducer',
          partNumber: 'PKM22EPPH4001',
          category: 'passive',
          packageType: 'Radial Disk (22mm)',
          extractedFrom: 'Microwave alert sounder',
          condition: 'working',
          quantity: 1,
          pinCount: 2,
          pinout: [
            { pin: 1, name: 'POS (+)', type: 'input', desc: 'Piezo positive drive' },
            { pin: 2, name: 'NEG (-)', type: 'ground', desc: 'Ground return' }
          ],
          specs: {
            'Resonant Frequency': '4.0 kHz ± 0.5 kHz',
            'Sound Pressure': '85 dB at 10cm',
            'Max Operating Voltage': '30 Vp-p'
          },
          testProcedure: 'Pulse with 4kHz square wave from Arduino pin; emits crisp 85dB tone.',
          salvageValueEstimate: 1.2,
          hazardLevel: 'safe',
          dateAdded: '2026-10-09'
        },
        hazardLevel: 'safe'
      },
      {
        id: 'box-mw-4',
        x: 58,
        y: 58,
        width: 30,
        height: 30,
        label: 'Rotary Pulse Encoder with Pushbutton',
        category: 'sensor',
        confidence: 0.92,
        component: {
          id: 'comp-rotary-enc',
          name: 'Incremental Quadrature Rotary Encoder',
          partNumber: 'EC11-PUSH',
          category: 'sensor',
          packageType: 'D-Shaft Panel Mount (11mm)',
          extractedFrom: 'Timer dial knob',
          condition: 'working',
          quantity: 1,
          pinCount: 5,
          pinout: [
            { pin: 1, name: 'ENC_A', type: 'output', desc: 'Channel A quadrature signal' },
            { pin: 2, name: 'ENC_COM', type: 'ground', desc: 'Common Ground pin' },
            { pin: 3, name: 'ENC_B', type: 'output', desc: 'Channel B quadrature signal' },
            { pin: 4, name: 'SW_1', type: 'passive', desc: 'Pushbutton terminal 1' },
            { pin: 5, name: 'SW_2', type: 'passive', desc: 'Pushbutton terminal 2' }
          ],
          specs: {
            'Pulses Per Revolution': '20 PPR with detents',
            'Life Expectancy': '30,000 cycles',
            'Shaft Type': '6mm Flatted D-Shaft'
          },
          testProcedure: 'Read Channel A & B with oscilloscope or Arduino pin interrupts while rotating.',
          salvageValueEstimate: 2.5,
          hazardLevel: 'safe',
          dateAdded: '2026-10-09'
        },
        hazardLevel: 'safe'
      }
    ]
  },
  {
    id: 'board-vape-pcb',
    name: 'Disposable Vape Lithium Subsystem',
    donorSource: 'Street Salvage / E-Waste Rechargeable Vape',
    description: 'Compact energy storage pack containing 3.7V pure cobalt LiPo cell, microphone airflow trigger, and USB-C port.',
    category: 'consumer',
    hazardsFound: 1,
    salvageScore: 94,
    previewUrl: 'vape-pcb',
    boxes: [
      {
        id: 'box-vp-1',
        x: 15,
        y: 20,
        width: 42,
        height: 55,
        label: '3.7V 550mAh LiPo Pouch Cell',
        category: 'hazard',
        confidence: 0.99,
        component: INITIAL_SCRAP_DATABASE.find(c => c.id === 'comp-18650')!,
        hazardLevel: 'dangerous',
        hazardNotice: 'Puncture & Short Circuit Risk. Never use metal tools to pry pouch cell.'
      },
      {
        id: 'box-vp-2',
        x: 62,
        y: 22,
        width: 26,
        height: 32,
        label: 'Acoustic Airflow Pressure Switch',
        category: 'sensor',
        confidence: 0.93,
        component: {
          id: 'comp-vape-mic',
          name: 'Electret Pressure Airflow Switch ASIC',
          partNumber: 'S085-ASIC',
          category: 'sensor',
          packageType: 'Cylindrical Microphone Can (6mm)',
          extractedFrom: 'Disposable vape airflow tube',
          condition: 'working',
          quantity: 1,
          pinCount: 3,
          pinout: [
            { pin: 1, name: 'VDD', type: 'power', desc: '+3.7V battery supply' },
            { pin: 2, name: 'GND', type: 'ground', desc: 'Battery ground' },
            { pin: 3, name: 'GATE_OUT', type: 'output', desc: 'Internal power MOSFET drain (switches to GND upon air suction)' }
          ],
          specs: {
            'Threshold Pressure': '50 - 150 Pa suction',
            'Integrated MOSFET': 'Low RDS(on) 3A switch',
            'Standby Current': '< 3 uA'
          },
          testProcedure: 'Apply 3.7V. Blow gently into hole; pin 3 switches to ground and illuminates LED.',
          salvageValueEstimate: 2.0,
          hazardLevel: 'safe',
          dateAdded: '2026-10-09'
        },
        hazardLevel: 'safe'
      },
      {
        id: 'box-vp-3',
        x: 62,
        y: 60,
        width: 25,
        height: 25,
        label: 'Type-C USB Charging Receptacle',
        category: 'power',
        confidence: 0.96,
        component: {
          id: 'comp-usbc-port',
          name: 'USB Type-C 16-Pin Receptacle',
          partNumber: 'USBC-16P-SMD',
          category: 'power',
          packageType: 'SMD Mid-Mount Receptacle',
          extractedFrom: 'Vape bottom endcap',
          condition: 'working',
          quantity: 1,
          pinCount: 4,
          pinout: [
            { pin: 1, name: 'VBUS', type: 'power', desc: '+5V Power pin' },
            { pin: 2, name: 'GND', type: 'ground', desc: 'Return Ground pin' },
            { pin: 3, name: 'CC1', type: 'passive', desc: '5.1k pull-down configuration' },
            { pin: 4, name: 'CC2', type: 'passive', desc: '5.1k pull-down configuration' }
          ],
          specs: {
            'Current Rating': '3.0A at 5V',
            'Mating Cycles': '10,000 cycles'
          },
          testProcedure: 'Check 5.0V with USB cable plugged into wall adapter.',
          salvageValueEstimate: 1.5,
          hazardLevel: 'safe',
          dateAdded: '2026-10-09'
        },
        hazardLevel: 'safe'
      }
    ]
  }
];

export async function queryLocalOllamaVision(
  endpoint: string,
  modelName: string,
  base64Image: string,
  prompt: string
): Promise<{ text: string; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout
    const res = await fetch(`${endpoint.replace(/\/$/, '')}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        images: [base64Image.replace(/^data:image\/[a-z]+;base64,/, '')],
        stream: false
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      return { text: '', error: `HTTP ${res.status}: ${res.statusText}` };
    }
    const data = await res.json();
    return { text: data.response || '' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Connection failed';
    return {
      text: '',
      error: `Local Ollama unreachable at ${endpoint}: ${message}`
    };
  }
}
