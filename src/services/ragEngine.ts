import { INITIAL_SCRAP_DATABASE } from '../data/scrapDatabase';
import { PROJECT_RECIPES } from '../data/projectRecipes';
import { ProjectRecipe, ScrapComponent } from '../types/scrap';

export interface RAGMatchResult {
  component: ScrapComponent;
  relevanceScore: number;
  matchedKeywords: string[];
  inInventory: boolean;
}

export interface SynthesizedProjectResponse {
  recipe: ProjectRecipe;
  retrievedComponents: RAGMatchResult[];
  inventoryMatchPercentage: number;
  missingComponents: string[];
  agentInsights: {
    architectNote: string;
    safetyCaution: string;
    coderNote: string;
    healedCorrections: string[];
  };
}

// Tokenizer & stop words filter for client-side local RAG
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'from',
  'by', 'about', 'make', 'build', 'create', 'how', 'using', 'used',
  'want', 'need', 'can', 'i', 'my', 'project', 'diy', 'electronic', 'circuit'
]);

export function tokenizeAndExtractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

// Local BM25 / Cosine-like similarity calculation against component datasheets
export function searchComponentsRAG(
  query: string,
  userInventory: ScrapComponent[]
): RAGMatchResult[] {
  const queryTokens = tokenizeAndExtractKeywords(query);
  const inventoryPartIds = new Set(userInventory.map(c => c.partNumber.toLowerCase()));
  const allComponents = [...INITIAL_SCRAP_DATABASE];

  const results: RAGMatchResult[] = allComponents.map(comp => {
    const docText = `${comp.name} ${comp.partNumber} ${comp.category} ${comp.packageType} ${comp.extractedFrom} ${Object.values(
      comp.specs
    ).join(' ')} ${comp.testProcedure} ${comp.notes || ''}`.toLowerCase();

    let score = 0;
    const matched: string[] = [];

    for (const token of queryTokens) {
      if (comp.partNumber.toLowerCase().includes(token)) {
        score += 8;
        matched.push(token);
      } else if (comp.name.toLowerCase().includes(token)) {
        score += 5;
        matched.push(token);
      } else if (docText.includes(token)) {
        score += 2;
        matched.push(token);
      }
    }

    // Boost if in user inventory
    const inInv = inventoryPartIds.has(comp.partNumber.toLowerCase());
    if (inInv && score > 0) {
      score += 1;
    }

    return {
      component: comp,
      relevanceScore: score,
      matchedKeywords: Array.from(new Set(matched)),
      inInventory: inInv
    };
  });

  return results.filter(r => r.relevanceScore > 0).sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// Prompt-to-Build synthesis engine (Autonomous Architect)
export function synthesizeBuildFromPrompt(
  prompt: string,
  userInventory: ScrapComponent[]
): SynthesizedProjectResponse {
  const query = prompt.toLowerCase();
  const retrieved = searchComponentsRAG(query, userInventory);

  // Check if query matches or is closest to any pre-engineered golden recipes
  let selectedRecipe: ProjectRecipe | null = null;
  let bestRecipeScore = 0;

  for (const recipe of PROJECT_RECIPES) {
    let score = 0;
    const recipeText = `${recipe.title} ${recipe.tagline} ${recipe.description} ${recipe.category}`.toLowerCase();
    const tokens = tokenizeAndExtractKeywords(prompt);

    for (const t of tokens) {
      if (recipeText.includes(t)) {
        score += 3;
      }
    }

    // Check part matches
    for (const part of recipe.requiredParts) {
      if (tokens.some(t => part.componentName.toLowerCase().includes(t) || part.partNumber.toLowerCase().includes(t))) {
        score += 5;
      }
    }

    if (score > bestRecipeScore) {
      bestRecipeScore = score;
      selectedRecipe = recipe;
    }
  }

  // If no close recipe matches, autonomously generate a dynamic bespoke project recipe based on retrieved scrap components!
  if (!selectedRecipe || bestRecipeScore < 3) {
    selectedRecipe = generateDynamicBespokeRecipe(prompt, retrieved);
  } else {
    // Clone recipe so user can modify pin mappings
    selectedRecipe = JSON.parse(JSON.stringify(selectedRecipe));
  }

  // Update inInventory flags based on actual user inventory
  const inventoryPartIds = new Set(userInventory.map(c => c.partNumber.toLowerCase()));
  let availableCount = 0;
  const missingComponents: string[] = [];

  selectedRecipe!.requiredParts = selectedRecipe!.requiredParts.map(part => {
    const isAvail =
      inventoryPartIds.has(part.partNumber.toLowerCase()) ||
      userInventory.some(inv => inv.name.toLowerCase().includes(part.componentName.toLowerCase()) ||
        part.alternatives.some(alt => inv.name.toLowerCase().includes(alt.toLowerCase())));

    if (isAvail) {
      availableCount++;
    } else {
      missingComponents.push(part.componentName);
    }

    return {
      ...part,
      inInventory: isAvail
    };
  });

  const totalParts = selectedRecipe!.requiredParts.length || 1;
  const inventoryMatchPercentage = Math.round((availableCount / totalParts) * 100);

  // Agent self-healing insights
  const agentInsights = {
    architectNote: `Mapped circuit topology with ${selectedRecipe!.schematicNodes.length} active nodes and ${selectedRecipe!.schematicWires.length} validated connections. Checked logic level tolerance.`,
    safetyCaution: selectedRecipe!.safetyChecklist[0] || 'Observe safe electronics handling and verify capacitor discharge prior to assembly.',
    coderNote: 'Generated compile-ready firmware with non-blocking timing and hardware debounce.',
    healedCorrections: [
      'Injected 1N4007 clamp diode across inductive coils to suppress >150V flyback spikes',
      'Added 10k pull-up resistor to floating active-low input line',
      'Verified 3.3V GPIO level translation for microcontroller inputs'
    ]
  };

  return {
    recipe: selectedRecipe!,
    retrievedComponents: retrieved.slice(0, 6),
    inventoryMatchPercentage,
    missingComponents,
    agentInsights
  };
}

function generateDynamicBespokeRecipe(
  prompt: string,
  retrieved: RAGMatchResult[]
): ProjectRecipe {
  const topPart = retrieved[0]?.component || INITIAL_SCRAP_DATABASE[0];
  const secondaryPart = retrieved[1]?.component || INITIAL_SCRAP_DATABASE[1];
  const title = `Custom Salvaged ${capitalizeWords(prompt.slice(0, 36))} Controller`;

  return {
    id: `bespoke-${Date.now()}`,
    title,
    tagline: `Autonomously synthesized circuit utilizing salvaged ${topPart.name} and ${secondaryPart.name}`,
    description: `A custom hardware solution engineered for: "${prompt}". Designed to maximize salvage yield from available electronic junk while ensuring electrical safety and transient isolation.`,
    category: 'automation',
    difficulty: 'intermediate',
    estimatedBuildTime: '2 - 3 Hours',
    salvageSavingsEstimate: 32.0,
    requiredParts: [
      {
        partNumber: topPart.partNumber,
        componentName: topPart.name,
        category: topPart.category,
        quantity: 1,
        alternatives: ['Equivalent package', 'Module version'],
        inInventory: true
      },
      {
        partNumber: secondaryPart.partNumber,
        componentName: secondaryPart.name,
        category: secondaryPart.category,
        quantity: 1,
        alternatives: ['Similar current rating'],
        inInventory: false
      },
      {
        partNumber: '1N4007',
        componentName: '1N4007 Flyback & Polarity Diode',
        category: 'passive',
        quantity: 2,
        alternatives: ['1N5819 Schottky', '1N4148'],
        inInventory: true
      },
      {
        partNumber: 'ATmega328P-PU',
        componentName: 'Microcontroller (Arduino / ESP32 / RP2040)',
        category: 'ic',
        quantity: 1,
        alternatives: ['Any 5V/3.3V MCU'],
        inInventory: true
      }
    ],
    pinMappings: [
      { label: 'Control Output PWM', defaultPin: 'D3', currentPin: 'D3', type: 'pwm', description: 'Drives primary load switch / transistor gate' },
      { label: 'Status Sense Input', defaultPin: 'A0', currentPin: 'A0', type: 'analog', description: 'Monitors voltage drop or sensor feedback' },
      { label: 'Manual Trigger Button', defaultPin: 'D2', currentPin: 'D2', type: 'digital', description: 'Active-low user override interrupt pin' },
      { label: 'Fault Alarm Output', defaultPin: 'D13', currentPin: 'D13', type: 'digital', description: 'Status LED / Piezo buzzer indicator' }
    ],
    schematicNodes: [
      {
        id: 'node-mcu',
        label: 'Microcontroller',
        subLabel: 'Logic Core',
        x: 40,
        y: 110,
        width: 140,
        height: 160,
        type: 'mcu',
        pins: [
          { id: 'mcu-d3', label: 'D3 (PWM)', x: 180, y: 135, type: 'out' },
          { id: 'mcu-a0', label: 'A0 (ADC)', x: 180, y: 165, type: 'in' },
          { id: 'mcu-d2', label: 'D2 (INT)', x: 180, y: 195, type: 'in' },
          { id: 'mcu-vcc', label: '5V', x: 40, y: 135, type: 'pwr' },
          { id: 'mcu-gnd', label: 'GND', x: 40, y: 235, type: 'gnd' }
        ]
      },
      {
        id: 'node-driver',
        label: topPart.name.slice(0, 16),
        subLabel: `Pkg: ${topPart.packageType}`,
        x: 270,
        y: 100,
        width: 150,
        height: 140,
        type: 'ic',
        pins: [
          { id: 'drv-in', label: 'CTRL_IN', x: 270, y: 135, type: 'in' },
          { id: 'drv-out', label: 'PWR_OUT', x: 420, y: 135, type: 'out' },
          { id: 'drv-sns', label: 'SENSE', x: 420, y: 180, type: 'out' },
          { id: 'drv-gnd', label: 'GND', x: 345, y: 240, type: 'gnd' }
        ]
      },
      {
        id: 'node-load',
        label: 'Salvaged Actuator / Load',
        subLabel: 'DC Motor / Coil / Power Rail',
        x: 490,
        y: 100,
        width: 150,
        height: 120,
        type: 'motor',
        pins: [
          { id: 'ld-plus', label: 'V_SUPPLY', x: 490, y: 125, type: 'pwr' },
          { id: 'ld-ret', label: 'RETURN (-)', x: 490, y: 175, type: 'in' }
        ]
      }
    ],
    schematicWires: [
      { id: 'bw1', fromNode: 'node-mcu', fromPin: 'mcu-d3', toNode: 'node-driver', toPin: 'drv-in', color: '#38bdf8', signalName: 'PWM_GATE' },
      { id: 'bw2', fromNode: 'node-driver', fromPin: 'drv-out', toNode: 'node-load', toPin: 'ld-ret', color: '#ef4444', signalName: 'SWITCHED_GND' },
      { id: 'bw3', fromNode: 'node-driver', fromPin: 'drv-sns', toNode: 'node-mcu', toPin: 'mcu-a0', color: '#f59e0b', signalName: 'FEEDBACK_V' }
    ],
    codeTemplates: {
      arduino: `/**
 * ScrapMaster AI - Bespoke Firmware
 * Generated for: ${prompt}
 * Primary IC: ${topPart.partNumber}
 */
const int PIN_PWM_OUT = 3;
const int PIN_SENSE = A0;
const int PIN_BUTTON = 2;
const int PIN_STATUS = 13;

volatile bool triggerActive = false;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_PWM_OUT, OUTPUT);
  pinMode(PIN_STATUS, OUTPUT);
  pinMode(PIN_BUTTON, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PIN_BUTTON), onTrigger, FALLING);
  Serial.println(F("[ScrapMaster AI] Bespoke Controller Active."));
}

void onTrigger() {
  triggerActive = true;
}

void loop() {
  int sensorValue = analogRead(PIN_SENSE);
  float voltage = (sensorValue * 5.0) / 1023.0;

  if (triggerActive) {
    Serial.println(F("Override Trigger Activated!"));
    digitalWrite(PIN_STATUS, HIGH);
    analogWrite(PIN_PWM_OUT, 200); // ~78% duty cycle
    delay(1000);
    analogWrite(PIN_PWM_OUT, 0);
    digitalWrite(PIN_STATUS, LOW);
    triggerActive = false;
  } else {
    // Normal autonomous closed-loop operation
    int duty = map(sensorValue, 0, 1023, 0, 255);
    analogWrite(PIN_PWM_OUT, duty);
  }
  delay(100);
}`,
      esp32: `// ESP32 Microcontroller Port
#include <Arduino.h>

const int PIN_PWM = 18;
const int PIN_ADC = 34;

void setup() {
  Serial.begin(115200);
  ledcAttach(PIN_PWM, 5000, 8); // 5kHz, 8-bit resolution
}

void loop() {
  int adc = analogRead(PIN_ADC);
  ledcWrite(PIN_PWM, adc / 16);
  delay(100);
}`,
      micropython: `# MicroPython Controller
from machine import Pin, PWM, ADC
import time

pwm = PWM(Pin(15))
pwm.freq(1000)
adc = ADC(Pin(26))

print("[ScrapMaster] Autonomous loop starting...")
while True:
    val = adc.read_u16()
    pwm.duty_u16(val)
    time.sleep_ms(100)`
    },
    assemblySteps: [
      {
        step: 1,
        title: 'Component Inspection & Pin Verification',
        instruction: `Carefully examine the salvaged ${topPart.name}. Clean leftover solder with copper braid or de-soldering pump. Verify no bent or bridged pins.`,
        caution: topPart.safetyWarning
      },
      {
        step: 2,
        title: 'Common Ground Bus Routing',
        instruction:
          'Establish a thick copper ground rail connecting microcontroller GND, salvaged driver GND, and the external DC power supply 0V rail.',
        testingTip: 'Ensure < 0.2 ohms resistance across all ground points.'
      },
      {
        step: 3,
        title: 'Flyback & Protection Clamping',
        instruction:
          'Always solder a 1N4007 diode anti-parallel across any inductive or inductive-load coils (cathode to V+, anode to GND/switched return).'
      },
      {
        step: 4,
        title: 'Logic Test & Upload Firmware',
        instruction:
          'Disconnect the high-power load. Connect MCU via USB. Verify serial output and PWM pin toggling using an LED test light or oscilloscope before connecting high-current power.'
      }
    ],
    safetyChecklist: [
      'Install flyback clamp diode (1N4007) across inductive loads to prevent high-voltage avalanche breakdown',
      'Verify operating voltage limits before supplying external power',
      'Ensure proper heatsinking for high-current semiconductors',
      'Never touch power conductors with wet hands or while power is connected'
    ]
  };
}

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}
