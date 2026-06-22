// Grouped equation library — each item has a short display label + the equation string
export const EQ_GROUPS = [
  {
    label: 'Clásicas / Básicas',
    items: [
      { label: 'Sine',                eq: 'sin(t)' },
      { label: 'Cosine',              eq: 'cos(t)' },
      { label: 'Sierra',              eq: '2*(t/(2*pi) - floor(t/(2*pi)+0.5))' },
      { label: 'Triángulo',           eq: '1 - 2*abs(2*(t/(2*pi) - floor(t/(2*pi)+0.5)))' },
      { label: 'Cuadrada',            eq: 'sign(sin(t))' },
      { label: 'Cuadrada suave',      eq: 'sign(sin(t))*sqrt(abs(sin(t)))' },
    ],
  },
  {
    label: 'Síntesis Aditiva',
    items: [
      { label: 'Armónicos desc.',     eq: 'sin(t) + sin(2*t)*0.8 + sin(3*t)*0.5 + sin(4*t)*0.3' },
      { label: 'Cuadrada Fourier',    eq: 'sin(t) + sin(3*t)/3 + sin(5*t)/5 + sin(7*t)/7' },
      { label: 'Sierra Fourier',      eq: 'sin(t) - sin(2*t)/2 + sin(3*t)/3 - sin(4*t)/4' },
      { label: 'Serie (4k+1) ×13',   eq: '(sin(t) + sin(5*t)/2 + sin(9*t)/3 + sin(13*t)/4 + sin(17*t)/5 + sin(21*t)/6 + sin(25*t)/7 + sin(29*t)/8 + sin(33*t)/9 + sin(37*t)/10 + sin(41*t)/11 + sin(45*t)/12 + sin(49*t)/13) / 3.23' },
      { label: 'Armónica impar ×12', eq: '6*(sin(3*t)/3 + sin(5*t)/5 + sin(7*t)/7 + sin(9*t)/9 + sin(11*t)/11 + sin(13*t)/13 + sin(15*t)/15 + sin(17*t)/17 + sin(19*t)/19 + sin(21*t)/21 + sin(23*t)/23 + sin(25*t)/25) / 7.59' },
      { label: 'Desfase armónico',    eq: 'sin(t) + 0.5*sin(2*t+pi/4) + 0.25*sin(4*t)' },
      { label: 'Octavas',             eq: '(sin(t) + sin(2*t) + sin(4*t) + sin(8*t)) / 4' },
      { label: 'Impar descendente',   eq: 'sin(t)*0.5 + sin(3*t)*0.3 + sin(5*t)*0.15 + sin(7*t)*0.05' },
      { label: 'Impar 5 voces',       eq: '(sin(t) + sin(3*t)*0.45 + sin(5*t)*0.3 + sin(7*t)*0.2 + sin(9*t)*0.1) / 2' },
      { label: 'Detune sutil',        eq: 'sin(t) + sin(2.001*t) + sin(3.003*t)' },
      { label: 'Quinta + octava',     eq: '(sin(t) + sin(t*1.5) + sin(t*2) + sin(t*3)) * 0.25' },
      { label: 'Impar desfasada',     eq: 'sin(t) + sin(3*t+pi/3)*0.6 + sin(5*t)*0.3' },
    ],
  },
  {
    label: 'Modulación de fase (PM)',
    items: [
      { label: 'PM simple',           eq: 'sin(t + sin(3*t))' },
      { label: 'PM profunda',         eq: 'sin(t + sin(t)*pi)' },
      { label: 'PM 2:1 fuerte',       eq: 'sin(2*t + 3*sin(t))' },
      { label: 'PM 2:1',             eq: 'sin(t + 2*sin(2*t))' },
      { label: 'PM múltiple',         eq: 'sin(t + sin(3*t)*2 + sin(5*t)*0.5)' },
      { label: 'PM lenta',            eq: 'sin(t + pi*sin(t/2))' },
      { label: 'PM recursiva',        eq: 'cos(t + sin(t + cos(t)))' },
      { label: 'PM asimétrica',       eq: 'sin(t + cos(t*2)*0.8)' },
      { label: 'PM auto',             eq: 'sin(t + sin(sin(t)))' },
    ],
  },
  {
    label: 'Modulación de frecuencia (FM)',
    items: [
      { label: 'FM vibrato',          eq: 'sin(t * (1 + 0.5*sin(t/2)))' },
      { label: 'FM compleja',         eq: 'sin(t * sin(t/2) * 2)' },
      { label: 'FM ratio 2',          eq: 'sin(t * (2 + sin(t/3)))' },
      { label: 'FM escalonada',       eq: 'sin(t*floor(1+3*abs(sin(t/8))))' },
      { label: 'FM discreta',         eq: 'sin(t*round(1 + abs(sin(t/4))*3))' },
      { label: 'FM barras',           eq: 'sin(t*floor(1 + 7*(0.5 + 0.5*sin(t/16))))' },
    ],
  },
  {
    label: 'Modulación de amplitud (AM)',
    items: [
      { label: 'AM lenta',            eq: 'sin(t) * (1 + sin(t*0.1)) * 0.5' },
      { label: 'AM envolvente',       eq: 'sin(t) * abs(sin(t/4))' },
      { label: 'AM cuadrada',         eq: 'sin(t) * cos(t/3)^2' },
      { label: 'AM doble',            eq: 'sin(t) * (0.5 + 0.5*cos(2*t))' },
      { label: 'AM 3a armónica',      eq: '(1 + 0.5*sin(t/2)) * sin(3*t)' },
      { label: 'AM muy lenta',        eq: 'sin(t) * (1 + 0.5*cos(t*0.25))' },
      { label: 'AM 1/2',             eq: 'sin(t)*cos(t/2)' },
    ],
  },
  {
    label: 'Modulación de anillo (RM)',
    items: [
      { label: 'RM 3a armónica',      eq: 'sin(t) * sin(3*t)' },
      { label: 'RM 7a armónica',      eq: 'sin(t) * sin(7*t)' },
      { label: 'RM inarmónica',       eq: 'sin(t) * sin(1.41*t)' },
      { label: 'RM mixta',            eq: 'sin(t)*cos(2*t) + sin(3*t)*0.25' },
      { label: 'RM triple',           eq: 'sin(t)*sin(2*t)*sin(3*t)' },
      { label: 'RM cruzada',          eq: 'cos(t) * sin(2*t) + sin(t) * cos(3*t)' },
    ],
  },
  {
    label: 'Saturación / Clipping',
    items: [
      { label: 'Soft clip ×3',        eq: 'tanh(3*sin(t))' },
      { label: 'Soft clip ×5',        eq: 'tanh(5*sin(t))' },
      { label: 'Arctan ×5',           eq: 'atan(5*sin(t)) * 2/pi' },
      { label: 'Arctan ×10',          eq: 'atan(10*sin(t)) / (pi/2)' },
      { label: 'Compresión suave',     eq: 'sin(t) / (1 + abs(sin(t)))' },
      { label: 'Asimetría leve',       eq: 'sin(t) * pow(abs(sin(t)), 0.3)' },
      { label: 'Cúbica',              eq: 'pow(sin(t), 3)' },
    ],
  },
  {
    label: 'Distorsión Armónica',
    items: [
      { label: 'Distorsión 3 arm.',   eq: '0.6*sin(t) + 0.3*sin(2*t+0.1) + 0.1*sin(3*t+0.2)' },
      { label: 'Armónica suave',      eq: '(sin(t) + 0.3*sin(2*t) + 0.1*sin(3*t)) / 1.4' },
      { label: 'Modulación lenta',    eq: 'sin(t) * (1 - 0.2*cos(t*0.1))' },
      { label: 'Formante vocal',      eq: '(sin(t) + sin(2.8*t)*0.8 + sin(6.5*t)*0.3) / 2.1' },
    ],
  },
  {
    label: 'Sub / Bajo',
    items: [
      { label: 'Sub + octava baja',   eq: 'sin(t) + sin(t*0.5)*0.5' },
      { label: 'Sub doble',           eq: 'sin(t) + sin(t*0.5)*0.7 + sin(t*0.25)*0.3' },
    ],
  },
  {
    label: 'Glitch / Bitcrusher',
    items: [
      { label: 'Crush 4 niveles',     eq: 'floor(sin(t)*4)/4' },
      { label: 'Crush 8 niveles',     eq: 'floor(sin(t)*8)/8' },
      { label: 'Crush 2 niveles',     eq: 'floor(sin(t)*2)/2' },
      { label: 'Cuantizar ×3',        eq: 'round(sin(t)*3)/3' },
      { label: 'Glitch cuadrado',     eq: 'sin(t) + sign(sin(2*t))*0.3' },
    ],
  },
  {
    label: 'Trémolo / Pulso',
    items: [
      { label: 'Trémolo lento',       eq: 'sin(t) * (0.5 + 0.5*abs(sin(t*0.2)))' },
      { label: 'Trémolo rápido',      eq: 'sin(t)*abs(cos(3*t))' },
      { label: 'Pulso ancho',         eq: 'sin(t*2) * (1 - abs(sin(t/2)))' },
    ],
  },
  {
    label: 'Exponencial / Envolvente',
    items: [
      { label: 'Campana decaída',     eq: 'sin(t) * exp(-abs(t)/(2*pi))' },
      { label: 'Envolvente suave',    eq: 'tanh(sin(t)*2) * cos(t*0.5)' },
    ],
  },
  {
    label: 'Caótico / Complejo',
    items: [
      { label: 'Auto-FM',             eq: 'sin(t * sin(t))' },
      { label: 'Caos 3 capas',        eq: 'sin(t + cos(t*2) + sin(t*3)*0.5)' },
      { label: 'Quinta',              eq: '(sin(t) + sin(1.5*t)) * 0.5' },
      { label: 'RM + armónica',       eq: 'sin(t)*cos(2*t) + sin(3*t)*0.25' },
      { label: 'Cuadrada √ abs',      eq: 'sign(sin(t)) * pow(abs(sin(t)), 0.5)' },
      { label: 'Diferencia senoidal', eq: 'sin(t*2)*cos(t*3) - cos(t*2)*sin(t*3)' },
    ],
  },
  {
    label: 'Trigonométricas Avanzadas',
    items: [
      { label: 'sin·cos',             eq: 'sin(t) * cos(t)' },
      { label: 'Cos doble ángulo',    eq: 'sin(t)^2 - cos(t)^2' },
      { label: 'Sin con sub',         eq: 'sin(t) * (1 + sin(t/2)) * 0.5' },
      { label: 'Sierra lineal exacta',eq: 'asin(sin(t)) / (pi/2)' },
      { label: 'Triángulo exacto',    eq: '2*asin(sin(t)) / pi' },
      { label: 'Arctan suave',        eq: 'atan(sin(t)) * 4/pi' },
      { label: 'Raíz cúbica',         eq: 'cbrt(sin(t))' },
    ],
  },
  {
    label: 'Hiperbólicas',
    items: [
      { label: 'Sinh(sin)',           eq: 'sinh(sin(t)) / 1.18' },
      { label: 'Tanh saturada',       eq: 'tanh(sin(t/2) * 3)' },
      { label: 'Rotación hiperbólica',eq: 'sin(t)*cosh(0.5) - cos(t)*sinh(0.5)' },
    ],
  },
  {
    label: 'Ondas Combinadas',
    items: [
      { label: 'AM con 5a armónica',  eq: '(sin(t) + sin(5*t)*0.3) * cos(t*0.25)' },
      { label: 'Impar norm. desfas.', eq: '(sin(t) + sin(3*t+pi/3)*0.6 + sin(5*t)*0.3) / 1.9' },
      { label: 'Octava desfasada',    eq: 'sin(t) + 0.5*sin(2*t+pi/4) + 0.25*sin(4*t)' },
      { label: 'Quinta + octava',     eq: 'sin(t) + sin(1.5*t)*0.7 + sin(2.5*t)*0.3' },
      { label: 'Armónicos 1–5',       eq: 'sin(t) + sin(2*t)*0.45 + sin(3*t)*0.3 + sin(4*t)*0.2 + sin(5*t)*0.1' },
    ],
  },
  {
    label: 'Latido / Beating',
    items: [
      { label: 'Latido muy lento',    eq: 'sin(t)*sin(t*1.01)' },
      { label: 'Latido rápido',       eq: 'sin(t) + sin(t*1.02)' },
      { label: 'Batido lento',        eq: 'sin(t)*cos(t*0.05)' },
      { label: 'Vibrato extremo',     eq: 'sin(20*t)*sin(t/20)' },
      { label: 'Latido desfasado',    eq: 'sin(t) * (1 + 0.3*cos(t*0.5 + pi/4))' },
    ],
  },
  {
    label: 'Matemáticas Curiosas',
    items: [
      { label: 'Logarítmica',         eq: 'log(1 + abs(sin(t))) * sign(sin(t))' },
      { label: 'Resonancia',          eq: 'sin(t) / (abs(t/(2*pi) - floor(t/(2*pi)+0.5)) + 0.1)' },
      { label: 'Log AM',              eq: 'sin(t) * log(2 + abs(sin(3*t)))' },
      { label: 'Exp FM',              eq: 'sin(exp(0.1*sin(t)) * t)' },
      { label: 'FM desfasada',        eq: 'sin(t * (1 + 0.3*sin(t/4 + pi/3)))' },
    ],
  },
  {
    label: 'Sci-fi / Alieno',
    items: [
      { label: 'Alienígena 1',        eq: 'sin(t + cos(t*2)*2)' },
      { label: 'Auto-PM',             eq: 'sin(t) * sin(sin(t) + t)' },
      { label: 'Triple PM',           eq: 'sin(t*2 + sin(t*3) + cos(t*5)*0.3)' },
      { label: 'PM compuesta',        eq: 'sin(t + sin(t*2) + cos(t/3)*0.5)' },
      { label: 'Whirl',               eq: 'cos(sin(t) * t)' },
    ],
  },
];

// Flat array kept for any code that needs it
export const EQ_LIB = EQ_GROUPS.flatMap(g => g.items.map(i => i.eq));

export const CHIPS = [
  // Trigonométricas básicas
  'sin',   'cos',   'tan',
  // Inversas
  'asin',  'acos',  'atan',
  // Hiperbólicas
  'sinh',  'cosh',  'tanh',
  'asinh', 'acosh', 'atanh',
  // Redondeo
  'floor', 'ceil',  'round', 'fix',
  // Potencia / raíz
  'sqrt',  'cbrt',  'pow',   'nthRoot',
  // Valor absoluto / signo
  'abs',   'sign',
  // Logaritmos
  'log',   'log2',  'log10', 'exp',
  // Aritmética
  'mod',   'min',   'max',   'hypot',
  // Constantes
  'pi',    'E',
];
