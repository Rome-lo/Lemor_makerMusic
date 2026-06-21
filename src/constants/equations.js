export const EQ_LIB = [
  // ── Clásicas / básicas ──────────────────────────────────────────────────
  'sin(t)',
  'cos(t)',
  '2*(t/(2*pi) - floor(t/(2*pi)+0.5))',                        // diente de sierra
  '1 - 2*abs(2*(t/(2*pi) - floor(t/(2*pi)+0.5)))',             // triángulo
  'sign(sin(t))',                                               // cuadrada pura
  'sign(sin(t))*sqrt(abs(sin(t)))',                             // cuadrada suavizada

  // ── Síntesis aditiva ────────────────────────────────────────────────────
  'sin(t) + sin(2*t)*0.8 + sin(3*t)*0.5 + sin(4*t)*0.3',
  'sin(t) + sin(3*t)/3 + sin(5*t)/5 + sin(7*t)/7',            // cuadrada fourier
  'sin(t) - sin(2*t)/2 + sin(3*t)/3 - sin(4*t)/4',            // sierra fourier
  'sin(t) + 0.5*sin(2*t+pi/4) + 0.25*sin(4*t)',
  '(sin(t) + sin(2*t) + sin(4*t) + sin(8*t)) / 4',
  'sin(t)*0.5 + sin(3*t)*0.3 + sin(5*t)*0.15 + sin(7*t)*0.05',
  '(sin(t) + sin(3*t)*0.45 + sin(5*t)*0.3 + sin(7*t)*0.2 + sin(9*t)*0.1) / 2',
  'sin(t) + sin(2.001*t) + sin(3.003*t)',                      // ligero detuning
  '(sin(t) + sin(t*1.5) + sin(t*2) + sin(t*3)) * 0.25',
  'sin(t) + sin(3*t+pi/3)*0.6 + sin(5*t)*0.3',

  // ── Modulación de fase (PM) ─────────────────────────────────────────────
  'sin(t + sin(3*t))',
  'sin(t + sin(t)*pi)',
  'sin(2*t + 3*sin(t))',
  'sin(t + 2*sin(2*t))',
  'sin(t + sin(3*t)*2 + sin(5*t)*0.5)',
  'sin(t + pi*sin(t/2))',
  'cos(t + sin(t + cos(t)))',
  'sin(t + cos(t*2)*0.8)',
  'sin(t + sin(sin(t)))',

  // ── Modulación de frecuencia (FM) ───────────────────────────────────────
  'sin(t * (1 + 0.5*sin(t/2)))',
  'sin(t * sin(t/2) * 2)',
  'sin(t * (2 + sin(t/3)))',
  'sin(t*floor(1+3*abs(sin(t/8))))',
  'sin(t*round(1 + abs(sin(t/4))*3))',
  'sin(t*floor(1 + 7*(0.5 + 0.5*sin(t/16))))',

  // ── Modulación de amplitud (AM) ─────────────────────────────────────────
  'sin(t) * (1 + sin(t*0.1)) * 0.5',
  'sin(t) * abs(sin(t/4))',
  'sin(t) * cos(t/3)^2',
  'sin(t) * (0.5 + 0.5*cos(2*t))',
  '(1 + 0.5*sin(t/2)) * sin(3*t)',
  'sin(t) * (1 + 0.5*cos(t*0.25))',
  'sin(t)*cos(t/2)',

  // ── Modulación de anillo (RM) ───────────────────────────────────────────
  'sin(t) * sin(3*t)',
  'sin(t) * sin(7*t)',
  'sin(t) * sin(1.41*t)',
  'sin(t)*cos(2*t) + sin(3*t)*0.25',
  'sin(t)*sin(2*t)*sin(3*t)',
  'cos(t) * sin(2*t) + sin(t) * cos(3*t)',

  // ── Saturación / clipping ───────────────────────────────────────────────
  'tanh(3*sin(t))',
  'tanh(5*sin(t))',
  'atan(5*sin(t)) * 2/pi',
  'atan(10*sin(t)) / (pi/2)',
  'sin(t) / (1 + abs(sin(t)))',
  'sin(t) * pow(abs(sin(t)), 0.3)',
  'pow(sin(t), 3)',

  // ── Distorsión suave / armónica ─────────────────────────────────────────
  '0.6*sin(t) + 0.3*sin(2*t+0.1) + 0.1*sin(3*t+0.2)',
  '(sin(t) + 0.3*sin(2*t) + 0.1*sin(3*t)) / 1.4',
  'sin(t) * (1 - 0.2*cos(t*0.1))',
  '(sin(t) + sin(2.8*t)*0.8 + sin(6.5*t)*0.3) / 2.1',         // formante vocal

  // ── Sub / bajo ──────────────────────────────────────────────────────────
  'sin(t) + sin(t*0.5)*0.5',
  'sin(t) + sin(t*0.5)*0.7 + sin(t*0.25)*0.3',

  // ── Glitch / bitcrusher ─────────────────────────────────────────────────
  'floor(sin(t)*4)/4',
  'floor(sin(t)*8)/8',
  'floor(sin(t)*2)/2',
  'round(sin(t)*3)/3',
  'sin(t) + sign(sin(2*t))*0.3',

  // ── Trémolo / pulso ─────────────────────────────────────────────────────
  'sin(t) * (0.5 + 0.5*abs(sin(t*0.2)))',
  'sin(t)*abs(cos(3*t))',
  'sin(t*2) * (1 - abs(sin(t/2)))',

  // ── Exponencial / envolvente ────────────────────────────────────────────
  'sin(t) * exp(-abs(t)/(2*pi))',
  'tanh(sin(t)*2) * cos(t*0.5)',

  // ── Caótico / complejo ──────────────────────────────────────────────────
  'sin(t * sin(t))',
  'sin(t + cos(t*2) + sin(t*3)*0.5)',
  '(sin(t) + sin(1.5*t)) * 0.5',
  'sin(t)*cos(2*t) + sin(3*t)*0.25',
  'sign(sin(t)) * pow(abs(sin(t)), 0.5)',
  'sin(t*2)*cos(t*3) - cos(t*2)*sin(t*3)',

  // ── Trigonométricas avanzadas ───────────────────────────────────────────
  'sin(t) * cos(t)',
  'sin(t)^2 - cos(t)^2',
  'sin(t) * (1 + sin(t/2)) * 0.5',
  'asin(sin(t)) / (pi/2)',                                      // diente de sierra lineal exacto
  '2*asin(sin(t)) / pi',
  'atan(sin(t)) * 4/pi',
  'cbrt(sin(t))',                                               // raíz cúbica del seno

  // ── Hiperbólicas ────────────────────────────────────────────────────────
  'sinh(sin(t)) / 1.18',
  'tanh(sin(t/2) * 3)',
  'sin(t)*cosh(0.5) - cos(t)*sinh(0.5)',

  // ── Ondas combinadas ricas ──────────────────────────────────────────────
  '(sin(t) + sin(5*t)*0.3) * cos(t*0.25)',
  '(sin(t) + sin(3*t+pi/3)*0.6 + sin(5*t)*0.3) / 1.9',
  'sin(t) + 0.5*sin(2*t+pi/4) + 0.25*sin(4*t)',
  'sin(t) + sin(1.5*t)*0.7 + sin(2.5*t)*0.3',
  'sin(t) + sin(2*t)*0.45 + sin(3*t)*0.3 + sin(4*t)*0.2 + sin(5*t)*0.1',

  // ── Latido / beating ────────────────────────────────────────────────────
  'sin(t)*sin(t*1.01)',                                         // latido lento
  'sin(t) + sin(t*1.02)',
  'sin(t)*cos(t*0.05)',
  'sin(20*t)*sin(t/20)',                                        // vibrato extremo
  'sin(t) * (1 + 0.3*cos(t*0.5 + pi/4))',

  // ── Matemáticas curiosas ────────────────────────────────────────────────
  'log(1 + abs(sin(t))) * sign(sin(t))',
  'sin(t) / (abs(t/(2*pi) - floor(t/(2*pi)+0.5)) + 0.1)',
  'sin(t) * log(2 + abs(sin(3*t)))',
  'sin(exp(0.1*sin(t)) * t)',
  'sin(t * (1 + 0.3*sin(t/4 + pi/3)))',

  // ── Sci-fi / alieno ─────────────────────────────────────────────────────
  'sin(t + cos(t*2)*2)',
  'sin(t) * sin(sin(t) + t)',
  'sin(t*2 + sin(t*3) + cos(t*5)*0.3)',
  'sin(t + sin(t*2) + cos(t/3)*0.5)',
  'cos(sin(t) * t)',
];

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
