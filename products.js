const products = [
  {
    id: 1,
    name: "Vestido Slip Dress de Seda",
    category: "vestidos",
    price: 389.90,
    description: "Confeccionado em seda pura de caimento fluido e sofisticado. Alças finas reguláveis, decote sutil em V e acabamento acetinado premium. A peça perfeita para noites elegantes ou um visual casual-chic descomplicado.",
    images: ["assets/images/vestido-seda.png"],
    sizes: ["P", "M", "G"],
    colors: [
      { name: "Champanhe", hex: "#E8D8C8" },
      { name: "Preto Absoluto", hex: "#1A1A1A" }
    ],
    rating: 4.9,
    details: [
      "100% Seda Premium",
      "Caimento evasê fluido",
      "Alças com reguladores metálicos dourados",
      "Lavagem manual ou lavagem a seco"
    ]
  },
  {
    id: 2,
    name: "Conjunto Riviera de Linho",
    category: "conjuntos",
    price: 459.90,
    description: "Conjunto premium composto por top cropped estruturado e calça pantalona de cintura alta. Feito em linho puro misto, proporcionando leveza, conforto e extrema sofisticação para os dias mais quentes.",
    images: ["assets/images/conjunto-linho.png"],
    sizes: ["P", "M", "G"],
    colors: [
      { name: "Bege Areia", hex: "#D2C2B1" },
      { name: "Verde Oliva", hex: "#5C6B5E" }
    ],
    rating: 4.8,
    details: [
      "70% Linho, 30% Viscose de alta qualidade",
      "Top cropped com fechamento por zíper invisível nas costas",
      "Pantalona com bolsos faca funcionais e pregas frontais",
      "Tecido respirável e pré-encolhido"
    ]
  },
  {
    id: 3,
    name: "Blazer Alfaiataria Milão",
    category: "blazers",
    price: 529.90,
    description: "Blazer estruturado com modelagem double-breasted e ombreiras suaves. Uma peça atemporal de alfaiataria premium na cor fendi/taupe, ideal para criar sobreposições elegantes e elegantes.",
    images: ["assets/images/blazer-alfaiataria.png"],
    sizes: ["P", "M", "G", "GG"],
    colors: [
      { name: "Taupe Fendi", hex: "#8F857D" },
      { name: "Preto Clássico", hex: "#1A1A1A" },
      { name: "Off-White", hex: "#F5F2EB" }
    ],
    rating: 5.0,
    details: [
      "Tecido crepe estruturado de alfaiataria",
      "Forro interno acetinado em tom correspondente",
      "Botões frontais decorativos e funcionais",
      "Bolsos frontais com lapela"
    ]
  },
  {
    id: 4,
    name: "Vestido Midi Canelado Tricot",
    category: "vestidos",
    price: 349.90,
    description: "Vestido de comprimento midi confeccionado em tricot canelado de toque ultra macio. Modela o corpo com sutileza, oferecendo conforto absoluto sem perder a sofisticação da marca.",
    images: ["assets/images/vestido-midi.png"],
    sizes: ["P", "M", "G"],
    colors: [
      { name: "Verde Sálvia", hex: "#7E8F7C" },
      { name: "Preto Clássico", hex: "#1A1A1A" }
    ],
    rating: 4.7,
    details: [
      "Tricot canelado premium com bastante elastano",
      "Fenda lateral discreta para facilitar o movimento",
      "Decote redondo fechado elegante",
      "Comprimento midi sofisticado"
    ]
  },
  {
    id: 5,
    name: "Camisa Alfaiataria em Linho",
    category: "blusas",
    price: 289.90,
    description: "Camisa de mangas longas confeccionada em linho misto de alta qualidade. Modelagem relaxed/oversized, colarinho clássico e botões em madrepérola. Perfeita para sobreposições elegantes.",
    images: ["assets/images/camisa-linho.png"],
    sizes: ["P", "M", "G"],
    colors: [
      { name: "Bege Areia", hex: "#D2C2B1" },
      { name: "Off-White", hex: "#F5F2EB" }
    ],
    rating: 4.9,
    details: [
      "55% Linho, 45% Viscose",
      "Modelagem levemente oversized",
      "Botões frontais e nos punhos",
      "Tecido respirável e de toque macio"
    ]
  },
  {
    id: 6,
    name: "Regata Riviera de Seda",
    category: "blusas",
    price: 199.90,
    description: "Blusa regata com corte reto e decote sutil em V. Confeccionada em seda acetinada de caimento impecável e toque ultra suave na pele. Um básico indispensável para composições premium.",
    images: ["assets/images/regata-seda.png"],
    sizes: ["P", "M", "G"],
    colors: [
      { name: "Champanhe", hex: "#E8D8C8" },
      { name: "Preto Absoluto", hex: "#1A1A1A" }
    ],
    rating: 4.8,
    details: [
      "100% Seda Acetinada Premium",
      "Alças finas delicadas",
      "Forro duplo no busto para evitar transparência",
      "Costuras invisíveis e acabamento premium"
    ]
  },
  {
    id: 7,
    name: "Blusa Tricot Canelado Sálvia",
    category: "blusas",
    price: 229.90,
    description: "Blusa de tricot canelado de gola alta suave (mock neck) e manga curta. Confeccionada em malha premium encorpada e de toque extremamente aconchegante, ideal para composições de meia estação.",
    images: ["assets/images/blusa-canelada.png"],
    sizes: ["P", "M", "G"],
    colors: [
      { name: "Verde Sálvia", hex: "#7E8F7C" },
      { name: "Off-White", hex: "#F5F2EB" }
    ],
    rating: 4.9,
    details: [
      "Fio de tricot macio com bastante elastano",
      "Modelagem gola mock neck moderna",
      "Manga curta ajustada e confortável",
      "Alta durabilidade e excelente retenção de cor"
    ]
  }
];

export default products;
