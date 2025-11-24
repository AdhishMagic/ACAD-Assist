import { Department, Subject } from './types';

export const COLORS = {
  bg: '#F6F0F0',
  paper: '#F2E2B1',
  accent: '#D5C7A3',
  primary: '#BDB395',
  dark: '#5A5340',
};

export const SUBJECTS: Subject[] = [
  // CSE Sem 1
  {
    code: 'HS3151',
    name: 'Professional English - I',
    department: Department.CSE,
    semester: 1,
    syllabus_overview: 'Introduction to Fundamentals of Communication, Narration and Summation, Description of a Process/Product, Classification and Recommendations, and Expression.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Introduction to Fundamentals of Communication',
        content: 'Listening: For general information, specific details, telephone conversation, listening to voicemail/messages, and filling a form. Speaking: Self-introduction, introducing a friend, conversation (politeness strategies), and asking for information. Reading: Reading brochures (technical context), telephone messages/social media messages, and emails. Writing: Writing emails/letters introducing oneself. Grammar: Present Tense (simple and progressive), and Question types (Wh/Yes or No/Tags). Vocabulary: Synonyms, One word substitution, and Abbreviations & Acronyms (as used in technical contexts).',
        periods: 11
      },
      {
        unitNumber: 'II',
        title: 'Narration and Summation',
        content: 'Listening: Podcasts, anecdotes/stories/event narration, documentaries, and interviews with celebrities. Speaking: Narrating personal experiences/events, interviewing a celebrity, and reporting/summarizing documentaries/podcasts/interviews. Reading: Biographies, travelogues, newspaper reports, excerpts from literature, and travel & technical blogs. Writing: Guided writing, Paragraph writing, and Short Report on an event (e.g., field trip). Grammar: Past tense (simple), Subject-Verb Agreement, and Prepositions. Vocabulary: Word forms (prefixes & suffixes), Synonyms and Antonyms, and Phrasal verbs.',
        periods: 12
      },
      {
        unitNumber: 'III',
        title: 'Description of a Process/Product',
        content: 'Listening: Product and process descriptions, a classroom lecture, and advertisements about products. Speaking: Picture description, giving instruction to use the product, presenting a product, and summarizing a lecture. Reading: Advertisements, gadget reviews, and user manuals. Writing: Writing definitions, instructions, and Product/Process description. Grammar: Imperatives, Adjectives, Degrees of comparison, and Present & Past Perfect Tenses. Vocabulary: Compound Nouns, Homonyms and Homophones, and discourse markers (connectives & sequence words).',
        periods: 12
      },
      {
        unitNumber: 'IV',
        title: 'Classification and Recommendations',
        content: 'Listening: TED Talks, scientific lectures, and educational videos. Speaking: Small Talk, Mini presentations, and making recommendations. Reading: Newspaper articles, Journal reports, and Non Verbal Communication (tables, pie charts etc.). Writing: Note-making/Note-taking (Study skills to be taught, not tested), Writing recommendations, and Transferring information from non verbal (chart, graph etc, to verbal mode). Grammar: Articles, and Pronouns (Possessive & Relative pronouns). Vocabulary: Collocations, Fixed/Semi fixed expressions.',
        periods: 12
      },
      {
        unitNumber: 'V',
        title: 'Expression',
        content: 'Listening: Debates/discussions, different viewpoints on an issue, and panel discussions. Speaking: Group discussions, Debates, and Expressing opinions through Simulations & Role play. Reading: Editorials and Opinion Blogs. Writing: Essay Writing (Descriptive or narrative). Grammar: Future Tenses, Punctuation, Negation (Statements & Questions), and Simple, Compound & Complex Sentences. Vocabulary: Cause & Effect Expressions – Content vs Function words.',
        periods: 12
      }
    ]
  },
  {
    code: 'MA3151',
    name: 'Matrices and Calculus',
    department: Department.CSE,
    semester: 1,
    syllabus_overview: 'Matrices (Eigenvalues, Eigenvectors), Differential Calculus, Functions of Several Variables, Integral Calculus, and Multiple Integrals.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Matrices',
        content: 'Covers Eigenvalues and Eigenvectors of a real matrix, Characteristic equation, Properties of Eigenvalues and Eigenvectors, Cayley - Hamilton theorem, Diagonalization of matrices by orthogonal transformation, Reduction of a quadratic form to canonical form by orthogonal transformation, Nature of quadratic forms, and Applications such as Stretching of an elastic membrane.',
        periods: 12
      },
      {
        unitNumber: 'II',
        title: 'Differential Calculus',
        content: 'Includes Representation of functions, Limit of a function, Continuity, Derivatives, Differentiation rules (sum, product, quotient, chain rules), Implicit differentiation, Logarithmic differentiation, and Applications such as Maxima and Minima of functions of one variable.',
        periods: 12
      },
      {
        unitNumber: 'III',
        title: 'Functions of Several Variables',
        content: 'Focuses on Partial differentiation, Homogeneous functions and Euler’s theorem, Total derivative, Change of variables, Jacobians, Partial differentiation of implicit functions, Taylor’s series for functions of two variables, and Applications like Maxima and minima of functions of two variables and Lagrange’s method of undetermined multipliers.',
        periods: 12
      },
      {
        unitNumber: 'IV',
        title: 'Integral Calculus',
        content: 'Detailed topics include Definite and Indefinite integrals, Substitution rule, Techniques of Integration (Integration by parts, Trigonometric integrals, Trigonometric substitutions, Integration of rational functions by partial fraction, Integration of irrational functions), Improper integrals, and Applications such as Hydrostatic force and pressure, and moments and centres of mass.',
        periods: 12
      },
      {
        unitNumber: 'V',
        title: 'Multiple Integrals',
        content: 'Covers Double integrals, Change of order of integration, Double integrals in polar coordinates, Area enclosed by plane curves, Triple integrals, Volume of solids, Change of variables in double and triple integrals, and Applications like Moments and centres of mass, and moment of inertia.',
        periods: 12
      }
    ]
  },
  {
    code: 'PH3151',
    name: 'Engineering Physics',
    department: Department.CSE,
    semester: 1,
    syllabus_overview: 'Mechanics, Electromagnetic Waves, Oscillations, Optics and Lasers, Basic Quantum Mechanics, and Applied Quantum Mechanics.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Mechanics',
        content: 'Covers Multi-particle dynamics (Center of mass, motion of CM, kinetic energy) and Rotation of rigid bodies (Rotational kinematics, kinetic energy, moment of inertia theorems, M.I. of continuous bodies and diatomic molecule, torque, rotational dynamics, conservation of angular momentum, rotational energy state, gyroscope, torsional pendulum, double pendulum), and Introduction to nonlinear oscillations.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'Electromagnetic Waves',
        content: 'Focuses on Maxwell’s equations, wave equation, Plane electromagnetic waves in vacuum, properties of electromagnetic waves (speed, amplitude, phase, orientation and waves in matter), polarization, Producing electromagnetic waves, Energy and momentum in EM waves (Intensity, radiation pressure), Cell-phone reception, and Reflection and transmission of electromagnetic waves from a non-conducting medium-vacuum interface for normal incidence.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Oscillations, Optics and Lasers',
        content: 'Topics include Simple harmonic motion, resonance, analogy between electrical and mechanical oscillating systems, waves on a string (standing waves, traveling waves, Energy transfer), sound waves, Doppler effect. Also covers Reflection and refraction of light waves, total internal reflection, interference, Michelson interferometer, Theory of air wedge and experiment. Concludes with the Theory of laser (characteristics, Spontaneous and stimulated emission, Einstein’s coefficients, population inversion), types of lasers (Nd-YAG laser, CO2 laser, semiconductor laser), and basic applications of lasers in industry.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'Basic Quantum Mechanics',
        content: 'Details Photons and light waves, Electrons and matter waves, Compton effect, The Schrodinger equation (Time dependent and time independent forms), meaning of wave function, Normalization, Free particle, and particle in an infinite potential well (1D, 2D and 3D Boxes, Normalization, probabilities and the correspondence principle).',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'Applied Quantum Mechanics',
        content: 'Covers the harmonic oscillator (qualitative), Barrier penetration and quantum tunneling (qualitative), Tunneling microscope, Resonant diode, Finite potential wells (qualitative), Bloch’s theorem for particles in a periodic potential, and Basics of Kronig-Penney model and origin of energy bands',
        periods: 9
      }
    ]
  },
  {
    code: 'CY3151',
    name: 'Engineering Chemistry',
    department: Department.CSE,
    semester: 1,
    syllabus_overview: 'Water and Its Treatment, Nanochemistry, Phase Rule and Composites, Fuels and Combustion, and Energy Sources and Storage Devices.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Water and Its Treatment',
        content: 'Covers Water Sources and impurities, Water quality parameters (color, odour, turbidity, pH, hardness, alkalinity, TDS, COD, BOD, fluoride, arsenic), Municipal water treatment (primary treatment, disinfection—UV, Ozonation, break-point chlorination), Desalination (Reverse Osmosis), Boiler troubles (Scale and sludge, corrosion, embrittlement, Priming & foaming), and Treatment of boiler feed water (Internal: phosphate, colloidal, sodium aluminate, calgon conditioning; External: Ion exchange demineralization and zeolite process).',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'Nanochemistry',
        content: 'Basics include distinction between molecules, nanomaterials and bulk materials, and Size-dependent properties (optical, electrical, mechanical, magnetic). Covers types of nanomaterials (nanoparticle, nanocluster, nanorod, nanowire, nanotube), Preparation methods (sol-gel, solvothermal, laser ablation, chemical vapour deposition, electrochemical deposition, electro spinning), and Applications in medicine, agriculture, energy, electronics, and catalysis.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Phase Rule and Composites',
        content: 'Phase rule: Introduction, definition of terms, One component system (water system), Reduced phase rule, construction of a simple eutectic phase diagram (Thermal analysis), Two component system (lead-silver system, Pattinson process). Composites: Definition and Need, Constitution (Matrix materials: Polymer, metal, ceramic; and Reinforcement: fiber, particulates, flakes, whiskers). Properties and applications of Metal matrix composites (MMC), Ceramic matrix composites, Polymer matrix composites, and Hybrid composites.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'Fuels and Combustion',
        content: 'Fuels: Classification, Coal and coke (proximate and ultimate analysis, Carbonization, Otto Hoffmann method), Petroleum and Diesel (synthetic petrol manufacture via Bergius process, Knocking, octane/cetane number, Power alcohol, biodiesel). Combustion of fuels: Calorific value (higher/lower, theoretical calculation), Ignition temperature (spontaneous ignition temperature, Explosive range), Flue gas analysis (ORSAT Method), and CO₂ emission and carbon footprint.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'Energy Sources and Storage Devices',
        content: 'Covers Stability of nucleus (mass defect, binding energy), Nuclear energy (light water nuclear power plant, breeder reactor). Solar energy conversion (Principle, working, applications of solar cells, recent developments). Includes Wind energy, Geothermal energy, Batteries (Primary: dry cell; Secondary: lead acid, lithium-ion-battery), Electric vehicles, Fuel cells (H₂-O₂ fuel cell, microbial fuel cell), and Supercapacitors (Storage principle, types).',
        periods: 9
      }
    ]
  },
  {
    code: 'GE3151',
    name: 'Problem Solving and Python Programming (Theory)',
    department: Department.CSE,
    semester: 1,
    syllabus_overview: 'The syllabus includes Computational Thinking and Problem Solving, Data Types, Expressions, Statements, Control Flow, Functions, Strings, Lists, Tuples, Dictionaries, and Files, Modules, Packages',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Computational Thinking and Problem Solving',
        content: 'Fundamentals of Computing, Identification of Computational Problems, Algorithms (building blocks: statements, state, control flow, functions), notation (pseudo code, flow chart, programming language), algorithmic problem solving, simple strategies for developing algorithms (iteration, recursion). Illustrative problems include: find minimum in a list, insert a card in a list of sorted cards, guess an integer number in a range, and Towers of Hanoi.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'Data Types, Expressions, Statements',
        content: 'Python interpreter and interactive mode, debugging, values and types (int, float, boolean, string, list), variables, expressions, statements, tuple assignment, precedence of operators, comments. Illustrative programs: exchange the values of two variables, circulate the values of n variables, distance between two points.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Control Flow, Functions, Strings',
        content: 'Conditionals (Boolean values/operators, if, if-else, if-elif-else), Iteration (while, for, break, continue, pass), Fruitful functions (return values, parameters, scope, recursion, composition), Strings (slices, immutability, functions/methods, string module), Lists as arrays. Illustrative programs: square root, gcd, exponentiation, sum an array of numbers, linear search, binary search.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'Lists, Tuples, Dictionaries',
        content: 'Lists (operations, slices, methods, loop, mutability, aliasing, cloning, parameters), Tuples (assignment, return value), Dictionaries (operations and methods), advanced list processing (list comprehension). Illustrative programs: simple sorting, histogram, Students marks statement, Retail bill preparation.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'Files, Modules, Packages',
        content: 'Files and exceptions (text files, reading and writing files, format operator), command line arguments, errors and exceptions, handling exceptions, modules, packages. Illustrative programs: word count, copy file, Voter’s age validation, Marks range validation (0-100)',
        periods: 9
      }
    ]
  },

  // CSE Sem 2
  {
    code: 'HS3251',
    name: 'Professional English - II',
    department: Department.CSE,
    semester: 2,
    syllabus_overview: 'The full syllabus is provided across five units, covering topics such as Making Comparisons, Expressing Causal Relations, Problem Solving, Reporting of Events and Research, and The Ability to Put Ideas or Information Cogently',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Making Comparisons',
        content: 'Listening: Evaluative Listening (Advertisements, Product Descriptions), Audio/Video, Listening and filling a Graphic Organiser (Choosing a product or service by comparison). Speaking: Marketing a product, Persuasive Speech Techniques. Reading: Advertisements, user manuals, brochures. Writing: Professional emails, Email etiquette, Compare and Contrast Essay. Grammar: Mixed Tenses, Prepositional phrases. Vocabulary: Contextual meaning of words.',
        periods: 12
      },
      {
        unitNumber: 'II',
        title: 'Expressing Causal Relations in Speaking and Writing',
        content: 'Listening: Longer technical talks (gap filling), technical information from podcasts, process/event descriptions to identify cause & effects. Speaking: Describing and discussing reasons for accidents or disasters based on news reports. Reading: Longer technical texts, Cause and Effect Essays, Letters/emails of complaint. Writing: Writing responses to complaints. Grammar: Active Passive Voice transformations, Infinitive and Gerunds. Vocabulary: Word Formation (Noun-Verb-Adj-Adv), Adverbs.',
        periods: 12
      },
      {
        unitNumber: 'III',
        title: 'Problem Solving',
        content: 'Listening: Movie scenes/documentaries depicting a technical problem and suggesting solutions. Speaking: Group Discussion (based on case studies), techniques and strategies. Reading: Case Studies, excerpts from literary texts, news reports. Writing: Letter to the Editor, Checklists, Problem solution essay / Argumentative Essay. Grammar: Error correction, If conditional sentences. Vocabulary: Compound Words, Sentence Completion.',
        periods: 12
      },
      {
        unitNumber: 'IV',
        title: 'Reporting of Events and Research',
        content: 'Listening: Listening Comprehension based on news reports and documentaries, Precis writing, Summarising. Speaking: Interviewing, Presenting an oral report, Mini presentations. Reading: Newspaper articles. Writing: Recommendations, Transcoding, Accident Report, Survey Report. Grammar: Reported Speech, Modals. Vocabulary: Conjunctions, use of prepositions.',
        periods: 12
      },
      {
        unitNumber: 'V',
        title: 'The Ability to Put Ideas or Information Cogently',
        content: 'Listening: TED Talks, Presentations, Formal job interviews (analysis of the interview performance). Speaking: Participating in a Role play (interview/telephone interview), virtual interviews, Making presentations with visual aids. Reading: Company profiles, Statement of Purpose (SOP), interview excerpts. Writing: Job / Internship application, Cover letter & Resume. Grammar: Numerical adjectives, Relative Clauses. Vocabulary: Idioms.',
        periods: 12
      }
    ]
  },
  {
    code: 'MA3251',
    name: 'Statistics and Numerical Methods (BSC)',
    department: Department.CSE,
    semester: 2,
    syllabus_overview: 'The full syllabus covers five units: Testing of Hypothesis, Design of Experiments, Solution of Equations and Eigenvalue Problems, Interpolation, and Numerical Solution of Ordinary Differential Equations',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Testing of Hypothesis',
        content: 'Covers Sampling distributions, Tests for single mean, proportion, and difference of means (Large and small samples), Tests for single variance and equality of variances, Chi square test for goodness of fit, and Independence of attributes.'
      },
      {
        unitNumber: 'II',
        title: 'Design of Experiments',
        content: 'Focuses on One way and two way classifications, Completely randomized design, Randomized block design, Latin square design, and 2^2 factorial design.'
      },
      {
        unitNumber: 'III',
        title: 'Solution of Equations and Eigenvalue Problems',
        content: 'Includes solution methods for algebraic and transcendental equations (Fixed point iteration, Newton Raphson method), solution of linear system of equations (Gauss elimination, Pivoting, Gauss Jordan, Iterative methods like Gauss Jacobi and Gauss Seidel), and Eigenvalues of a matrix by Power method and Jacobi’s method for symmetric matrices.'
      },
      {
        unitNumber: 'IV',
        title: 'Interpolation, Numerical Differentiation and Numerical Integration',
        content: 'Details Lagrange’s and Newton’s divided difference interpolations, Newton’s forward and backward difference interpolation, Approximation of derivates using interpolation polynomials, and Numerical single and double integrations using Trapezoidal and Simpson’s 1/3 rules.'
      },
      {
        unitNumber: 'V',
        title: 'Numerical Solution of Ordinary Differential Equations',
        content: 'Covers Single step methods (Taylor’s series, Euler’s, Modified Euler’s, Fourth order Runge-Kutta method) and Multi step methods (Milne’s and Adams - Bash forth predictor corrector methods) for solving first order differential equations.'
      }
    ]
  },
  {
    code: 'PH3256',
    name: 'Physics for Information Science (BSC)',
    department: Department.CSE,
    semester: 2,
    syllabus_overview: 'The syllabus is structured into five units: Electrical Properties of Materials, Semiconductor Physics, Magnetic Properties of Materials, Optical Properties of Materials, and Nanodevices and Quantum Computing',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Electrical Properties of Materials',
        content: 'Covers the Classical free electron theory, the expression for electrical conductivity, Wiedemann-Franz law (including its success and failures), Fermi-Dirac statistics, Density of energy states, and the concept of the Energy bands in solids (including the tight binding approximation, electron effective mass, and the concept of a hole).',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'Semiconductor Physics',
        content: 'Focuses on Intrinsic and Extrinsic Semiconductors, Energy band diagrams (direct and indirect band gap), Carrier concentration, the variation of Fermi level, Carrier transport (random motion, drift, mobility, and diffusion), Hall effect and devices, Ohmic contacts, and the Schottky diode.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Magnetic Properties of Materials',
        content: 'Discusses atomic magnetic moments, magnetic permeability and susceptibility, and material classification (diamagnetism, paramagnetism, ferromagnetism, antiferromagnetism, ferrimagnetism). It details Ferromagnetism (origin, exchange interaction, saturation magnetization, Curie temperature, Domain Theory), and the application of magnetic principles in computer data storage (Magnetic hard disc/GMR sensor).',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'Optical Properties of Materials',
        content: 'Covers the classification of optical materials, carrier generation and recombination processes, light absorption, emission and scattering (concepts only), photo current in a P-N diode, solar cell, LED, Organic LED, Laser diodes, and Optical data storage techniques.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'Nanodevices and Quantum Computing',
        content: 'Introduces quantum confinement and quantum structures (wells, wires, and dots), Tunneling phenomena, Single electron phenomena (Coulomb blockade, resonant-tunneling diode, single electron transistor, quantum cellular automata). It concludes with the basics of Quantum system for information processing (quantum states, classical bits, qubits, CNOT gate, Bloch sphere, quantum gates, and the advantage of quantum computing over classical computing).',
        periods: 9
      }
    ]
  },
  {
    code: 'BE3251',
    name: 'Basic Electrical and Electronics Engineering (ESC)',
    department: Department.CSE,
    semester: 2,
    syllabus_overview: 'This subject includes five units covering Electrical Circuits, Electrical Machines, Analog Electronics, Digital Electronics, and Measurements and Instrumentation',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Electrical Circuits',
        content: 'Covers DC Circuits: Circuit Components (Conductor, Resistor, Inductor, Capacitor), Ohm’s Law, Kirchhoff’s Laws, Independent and Dependent Sources, Nodal Analysis, Mesh analysis (with Independent sources only in Steady state). Introduction to AC Circuits and Parameters (Waveforms, Average value, RMS Value, Instantaneous/real/reactive/apparent power, power factor), and Steady state analysis of RLC circuits (Simple problems only).',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'Electrical Machines',
        content: 'Focuses on Construction and Working principle of DC Separately and Self excited Generators (EMF equation, Types and Applications). Working Principle of DC motors (Torque Equation, Types and Applications). Construction, Working principle and Applications of Transformer, Three phase Alternator, Synchronous motor, and Three Phase Induction Motor.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Analog Electronics',
        content: 'Includes Resistor, Inductor and Capacitor in Electronic Circuits, Semiconductor Materials (Silicon & Germanium), PN Junction Diodes, Zener Diode (Characteristics and Applications), Bipolar Junction Transistor (Biasing), JFET, SCR, MOSFET, IGBT (Types, I-V Characteristics and Applications), Rectifier, and Inverters.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'Digital Electronics',
        content: 'Covers Review of number systems, binary codes, error detection and correction codes, Combinational logic (representation of logic functions, SOP and POS forms), and K-map representations (minimization using K maps, Simple Problems only).',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'Measurements and Instrumentation',
        content: 'Details Functional elements of an instrument, Standards and calibration, Operating Principle, types of Moving Coil and Moving Iron meters, Measurement of three phase power, Energy Meter, Instrument Transformers (CT and PT), DSO (Block diagram, Data acquisition).',
        periods: 9
      }
    ]
  },
  {
    code: 'GE3251',
    name: 'Engineering Graphics (ESC)',
    department: Department.CSE,
    semester: 2,
    syllabus_overview: 'The syllabus details five units: Plane Curves and Freehand Sketching, Projection of Points/Lines/Plane Surface, Projection of Solids, Projection of Sectioned Solids and Development of Surfaces, and Isometric and Perspective Projections',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Plane Curves and Freehand Sketching',
        content: 'Covers Basic Geometrical constructions, and curves used in engineering practices, specifically: Conics (Construction of ellipse, parabola and hyperbola by eccentricity method), Construction of cycloid, Construction of involutes of square and circle, and Drawing of tangents and normal to these curves.',
        periods: 18
      },
      {
        unitNumber: 'II',
        title: 'Projection of Points, Lines and Plane Surface',
        content: 'Focuses on Orthographic projection principles, Principal planes, First angle projection, projection of points, Projection of straight lines inclined to both the principal planes (by rotating line method and traces), and Projection of planes inclined to both the principal planes (by rotating object method).',
        periods: 18
      },
      {
        unitNumber: 'III',
        title: 'Projection of Solids',
        content: 'Details the Projection of simple solids (prisms, pyramids, cylinder, cone, and truncated solids) when the axis is inclined to one principal plane and parallel to the other (by rotating object method). Also includes Visualization concepts, Free Hand sketching of multiple views from pictorial views of objects, and practicing three-dimensional modeling by CAD Software (Not for examination).',
        periods: 18
      },
      {
        unitNumber: 'IV',
        title: 'Projection of Sectioned Solids and Development of Surfaces',
        content: 'Involves the Sectioning of solids in simple vertical position when the cutting plane is inclined to one principal plane and perpendicular to the other, and obtaining the true shape of the section. Also covers the Development of lateral surfaces of simple and sectioned solids (Prisms, pyramids, cylinders, and cones). Practicing three-dimensional modeling by CAD Software is mentioned (Not for examination).',
        periods: 18
      },
      {
        unitNumber: 'V',
        title: 'Isometric and Perspective Projections',
        content: 'Focuses on Principles of isometric projection, isometric scale, isometric projections of simple solids, truncated solids, and the combination of two solid objects. Also includes Perspective projection of simple solids (Prisms, pyramids and cylinders by visual ray method). Practicing three-dimensional modeling of isometric projection by CAD Software is included (Not for examination).',
        periods: 18
      }
    ]
  },
  {
    code: 'CS3251',
    name: 'Programming in C (PCC)',
    department: Department.CSE,
    semester: 2,
    syllabus_overview: 'The syllabus is divided into five units: Basics of C Programming, Arrays and Strings, Functions and Pointers, Structures and Union, and File Processing',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Basics of C Programming',
        content: 'Introduction to programming paradigms, Applications of C Language, Structure of C program, Data Types, Constants (including Enumeration Constants), Keywords, Operators (Precedence and Associativity), Expressions, Input/Output statements, Assignment statements, Decision making statements (including Switch statement), Looping statements, Preprocessor directives, and the Compilation process.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'Arrays and Strings',
        content: 'Introduction to Arrays: Declaration and Initialization (One dimensional array, Two dimensional arrays). String operations: length, compare, concatenate, copy. Includes the implementation of Selection sort, linear search, and binary search.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Functions and Pointers',
        content: 'Focuses on Modular programming, Function prototype, definition, and call, Built-in functions (string functions, math functions), Recursion, Binary Search using recursive functions, Pointers, Pointer operators and arithmetic, Arrays and pointers, Array of pointers, and Parameter passing (Pass by value, Pass by reference).',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'Structures and Union',
        content: 'Covers the concepts of Structure, Nested structures, Pointer and Structures, Array of structures, Self referential structures, Dynamic memory allocation, Singly linked list, typedef, Union, Storage classes and Visibility.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'File Processing',
        content: 'Covers Files, Types of file processing (Sequential access, Random access), Sequential access file, Random access file, and Command line arguments.',
        periods: 9
      }
    ]
  },

  // CSE Sem 3
  { code: 'CS3351', name: 'Digital Principles and Computer Organization', department: Department.CSE, semester: 3, syllabus_overview: 'Combinational Circuits, Synchronous Sequential Circuits, Computer Fundamentals...' },
  { code: 'CS3352', name: 'Foundations of Data Science', department: Department.CSE, semester: 3, syllabus_overview: 'Data Analysis, Python, Statistics, Machine Learning Basics...' },
  { code: 'CS3391', name: 'Object Oriented Programming', department: Department.CSE, semester: 3, syllabus_overview: 'Java, Inheritance, Polymorphism, Exception Handling...' },

  // CSE Sem 4
  { code: 'CS3451', name: 'Introduction to Operating Systems', department: Department.CSE, semester: 4, syllabus_overview: 'Processes, Threads, Scheduling, Deadlocks, Memory Management...' },
  { code: 'CS3491', name: 'Artificial Intelligence and Machine Learning', department: Department.CSE, semester: 4, syllabus_overview: 'Search strategies, Game playing, Supervised Learning, Neural Networks...' },

  // ECE Sem 3
  { code: 'EC3354', name: 'Signals and Systems', department: Department.ECE, semester: 3, syllabus_overview: 'Continuous Time Signals, Fourier Series, Laplace Transform...' },
  { code: 'EC3351', name: 'Control Systems', department: Department.ECE, semester: 3, syllabus_overview: 'Transfer function, Time response analysis, Frequency response...' },

  // MECH Sem 5
  { code: 'ME3591', name: 'Design of Machine Elements', department: Department.MECH, semester: 5, syllabus_overview: 'Stress, Strain, Shafts, Couplings, Bearings, Gears...' },
  { code: 'ME3592', name: 'Metrology and Measurements', department: Department.MECH, semester: 5, syllabus_overview: 'Linear measurements, Angular measurements, Laser metrology...' },
];

export const MOCK_IMPORTANT_QS = [
  "Explain the architecture of 8086 microprocessor with a neat diagram. (16 Marks)",
  "What is the difference between process and thread? (2 Marks)",
  "Derive the expression for efficiency of a Transformer. (16 Marks)",
  "Define normalization. List the types of normal forms. (2 Marks)"
];

export const MOCK_REFERENCES = [
  { title: "NPTEL Video Lectures", link: "https://nptel.ac.in" },
  { title: "Anna University Official Notes", link: "#" },
  { title: "GeeksforGeeks Topic Summary", link: "#" },
];