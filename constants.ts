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
  {
    code: 'MA3354',
    name: 'Discrete Mathematics',
    department: Department.CSE,
    semester: 3,
    syllabus_overview: 'Full syllabus detailed across five units covering Logic and Proofs, Combinatorics, Graphs, Algebraic Structures, and Lattices and Boolean Algebra',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Logic and Proofs',
        content: 'Covers Propositional logic – Propositional equivalences - Predicates and quantifiers – Nested quantifiers – Rules of inference - Introduction to proofs – Proof methods and strategy.'
      },
      {
        unitNumber: 'II',
        title: 'Combinatorics',
        content: 'Includes Mathematical induction – Strong induction and well ordering – The basics of counting – The pigeonhole principle – Permutations and combinations – Recurrence relations – Solving linear recurrence relations – Generating functions – Inclusion and exclusion principle and its applications.'
      },
      {
        unitNumber: 'III',
        title: 'Graphs',
        content: 'Details Graphs and graph models – Graph terminology and special types of graphs – Matrix representation of graphs and graph isomorphism – Connectivity – Euler and Hamilton paths.'
      },
      {
        unitNumber: 'IV',
        title: 'Algebraic Structures',
        content: 'Focuses on Algebraic systems – Semi groups and monoids - Groups – Subgroups – Homomorphism’s – Normal subgroup and cosets – Lagrange’s theorem – Definitions and examples of Rings and Fields.'
      },
      {
        unitNumber: 'V',
        title: 'Lattices and Boolean Algebra',
        content: 'Covers Partial ordering – Posets – Lattices as posets and as algebraic systems – Properties of lattices - Sub lattices – Direct product and homomorphism – Some special lattices – Boolean algebra – Sub Boolean Algebra – Boolean Homomorphism.'
      }
    ]
  },
  { 
    code: 'CS3351', 
    name: 'Digital Principles and Computer Organization', 
    department: Department.CSE, 
    semester: 3, 
    syllabus_overview: 'Combinational Circuits, Synchronous Sequential Circuits, Computer Fundamentals...',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Combinational Logic',
        content: 'Covers Karnaugh Map, Analysis and Design Procedures, Binary Adder – Subtractor, Decimal Adder, Magnitude Comparator, Decoder, Encoder, Multiplexers, and Demultiplexers.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'Synchronous Sequential Logic',
        content: 'Includes Introduction to Sequential Circuits, Flip-Flops (operation and excitation tables, Triggering of FF), Analysis and design of clocked sequential circuits, Design using Moore/Mealy models, state minimization, Registers, and Counters.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Computer Fundamentals',
        content: 'Focuses on Functional Units of a Digital Computer (Von Neumann Architecture), Operation and Operands of Computer Hardware Instruction, Instruction Set Architecture (ISA), Memory Location, Addressing Modes, Encoding of Machine Instruction, and Interaction between Assembly and High Level Language.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'Processor',
        content: 'Details Instruction Execution, Building a Data Path, Designing a Control Unit (Hardwired Control, Microprogrammed Control), Pipelining, Data Hazard, and Control Hazards.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'Memory and I/O',
        content: 'Covers Memory Concepts and Hierarchy, Memory Management, Cache Memories (Mapping and Replacement Techniques), Virtual Memory, DMA, I/O Accessing (Parallel and Serial Interface), Interrupt I/O, and Interconnection Standards (USB, SATA).',
        periods: 9
      }
    ]
  },
  { 
    code: 'CS3352', 
    name: 'Data Structures', 
    department: Department.CSE, 
    semester: 3, 
    syllabus_overview: 'Full syllabus provided across five units: Lists, Stacks and Queues, Trees, Multiway Search Trees and Graphs, and Searching, Sorting and Hashing Techniques',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Lists, Stacks, and Queues',
        content: 'Abstract Data Types (ADTs) – List ADT – Array-based implementation – Linked list implementation – Singly linked lists – Circularly linked lists – Doubly-linked lists – All operations (Insertion, Deletion, Merge, Traversal) – Applications of lists – Polynomial Manipulation – Stack ADT – Operations – Applications – Evaluating arithmetic expressions – Conversion of Infix to postfix expression – Queue ADT – Operations – Circular Queue – Priority Queue - deQueue – Applications of queues.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'Trees',
        content: 'Tree ADT – Tree traversals – Binary Tree ADT – Expression trees – Applications of trees – Binary search tree ADT – Threaded Binary Trees – AVL Trees – B-Tree – B+ Tree – Heap – Applications of heap.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Multiway Search Trees and Graphs',
        content: 'M-Way Search Trees – B-Trees – B+ Trees – Graph Definition – Representation of Graphs – Types of Graph – Breadth-first traversal – Depth-first traversal – Topological Sort – Bi-connectivity – Cut vertex – Euler circuits – Applications of graphs.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'Searching, Sorting and Hashing Techniques',
        content: 'Searching- Linear Search – Binary Search. Sorting - Bubble sort – Selection sort – Insertion sort – Shell sort – Radix sort. Hashing- Hash Functions – Separate Chaining – Open Addressing – Rehashing – Extendible Hashing.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'Advanced Data Structures',
        content: 'Tries – Binary Tries – Compressed Tries – Suffix Tries – String Matching: KMP Algorithm – Boyer-Moore Algorithm – Pattern Matching and Tries – Huffman Coding.',
        periods: 9
      }
    ]
  },
  { 
    code: 'CS3353', 
    name: 'Foundations of Data Science', 
    department: Department.CSE, 
    semester: 3, 
    syllabus_overview: 'Data Analysis, Python, Statistics, Machine Learning Basics...',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Introduction',
        content: 'Data Science: Benefits and uses – facets of data – Data Science Process: Overview – Defining research goals – Retrieving data – Data preparation - Exploratory Data analysis – build the model – presenting findings and building applications - Data Mining - Data Warehousing – Basic Statistical descriptions of Data.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'Describing Data',
        content: 'Types of Data - Types of Variables - Describing Data with Tables and Graphs – Describing Data with Averages - Describing Variability - Normal Distributions and Standard (z) Scores.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Describing Relationships',
        content: 'Correlation – Scatter plots – correlation coefficient for quantitative data – computational formula for correlation coefficient – Regression – regression line – least squares regression line – Standard error of estimate – interpretation of r 2 – multiple regression equations – regression towards the mean.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'Python Libraries for Data Wrangling',
        content: 'Basics of Numpy arrays – aggregations – computations on arrays – comparisons, masks, boolean logic – fancy indexing – structured arrays – Data manipulation with Pandas – data indexing and selection – operating on data – missing data – Hierarchical indexing – combining datasets – aggregation and grouping – pivot tables.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'Data Visualization',
        content: 'Importing Matplotlib – Line plots – Scatter plots – visualizing errors – density and contour plots – Histograms – legends – colors – subplots – text and annotation – customization – three dimensional plotting - Geographic Data with Basemap - Visualization with Seaborn.',
        periods: 9
      }
    ]
  },
    { 
    code: 'CS3391', 
    name: 'Object Oriented Programming', 
    department: Department.CSE, 
    semester: 3, 
    syllabus_overview: 'Java, Inheritance, Polymorphism, Exception Handling...',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Introduction to OOP and Java',
        content: 'Overview of OOP (paradigms, features) – Java Buzzwords – Overview of Java – Data Types, Variables and Arrays – Operators – Control Statements – Programming Structures – Defining classes – Constructors – Methods – Access specifiers – Static members – Java Doc comments.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'Inheritance, Packages and Interfaces',
        content: 'Overloading Methods – Objects as Parameters – Static, Nested and Inner Classes. Inheritance: Basics, Types of Inheritance, Super keyword, Method Overriding, Dynamic Method Dispatch, Abstract Classes, final with Inheritance. Packages and Interfaces: Packages, Member Access, Importing Packages, Interfaces.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Exception Handling and Multithreading',
        content: 'Exception Handling basics – Multiple catch Clauses – Nested try Statements – Java’s Built-in Exceptions – User defined Exception. Multithreaded Programming: Java Thread Model – Creating a Thread and Multiple Threads – Priorities – Synchronization – Inter Thread Communication – Suspending, Resuming, and Stopping Threads – Wrappers – Auto boxing.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'I/O, Generics, String Handling',
        content: 'I/O Basics – Reading and Writing Console I/O – Reading and Writing Files. Generics: Generic Programming, Generic classes, Generic Methods, Bounded Types, Restrictions and Limitations. Strings: Basic String class, methods and String Buffer Class.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'JAVAFX Event Handling, Controls and Components',
        content: 'JAVAFX Events and Controls: Event Basics – Handling Key and Mouse Events. Controls: Checkbox, ToggleButton, RadioButtons, ListView, ComboBox, ChoiceBox, Text Controls, ScrollPane. Layouts: FlowPane, HBox and VBox, BorderPane, StackPane, GridPane. Menus: Basics, Menu, Menu bars, MenuItem',
        periods: 9
      }
    ]
  },

  // CSE Sem 4
  { code: 'CS3451', name: 'Introduction to Operating Systems', department: Department.CSE, semester: 4, syllabus_overview: 'Processes, Threads, Scheduling, Deadlocks, Memory Management...' },
  { code: 'CS3452', name: 'Theory of Computation', department: Department.CSE, semester: 4, syllabus_overview: 'Automata Theory, Regular Languages, Context-Free Grammars, Turing Machines, Computability...' },
  { code: 'CS3491', name: 'Artificial Intelligence and Machine Learning', department: Department.CSE, semester: 4, syllabus_overview: 'Search strategies, Game playing, Supervised Learning, Neural Networks...' },

  // ECE Sem 1 (Same as CSE Sem 1)
  {
    code: 'HS3151',
    name: 'Professional English - I',
    department: Department.ECE,
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
    department: Department.ECE,
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
        content: 'Focuses on Partial differentiation, Homogeneous functions and Eulers theorem, Total derivative, Change of variables, Jacobians, Partial differentiation of implicit functions, Taylors series for functions of two variables, and Applications like Maxima and minima of functions of two variables and Lagranges method of undetermined multipliers.',
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
    department: Department.ECE,
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
        content: 'Focuses on Maxwells equations, wave equation, Plane electromagnetic waves in vacuum, properties of electromagnetic waves (speed, amplitude, phase, orientation and waves in matter), polarization, Producing electromagnetic waves, Energy and momentum in EM waves (Intensity, radiation pressure), Cell-phone reception, and Reflection and transmission of electromagnetic waves from a non-conducting medium-vacuum interface for normal incidence.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Oscillations, Optics and Lasers',
        content: 'Topics include Simple harmonic motion, resonance, analogy between electrical and mechanical oscillating systems, waves on a string (standing waves, traveling waves, Energy transfer), sound waves, Doppler effect. Also covers Reflection and refraction of light waves, total internal reflection, interference, Michelson interferometer, Theory of air wedge and experiment. Concludes with the Theory of laser (characteristics, Spontaneous and stimulated emission, Einsteins coefficients, population inversion), types of lasers (Nd-YAG laser, CO2 laser, semiconductor laser), and basic applications of lasers in industry.',
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
        content: 'Covers the harmonic oscillator (qualitative), Barrier penetration and quantum tunneling (qualitative), Tunneling microscope, Resonant diode, Finite potential wells (qualitative), Blochs theorem for particles in a periodic potential, and Basics of Kronig-Penney model and origin of energy bands',
        periods: 9
      }
    ]
  },
  {
    code: 'CY3151',
    name: 'Engineering Chemistry',
    department: Department.ECE,
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
    department: Department.ECE,
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
        content: 'Files and exceptions (text files, reading and writing files, format operator), command line arguments, errors and exceptions, handling exceptions, modules, packages. Illustrative programs: word count, copy file, Voters age validation, Marks range validation (0-100)',
        periods: 9
      }
    ]
  },

  // ECE Sem 3
  { code: 'EC3354', name: 'Signals and Systems', department: Department.ECE, semester: 3, syllabus_overview: 'Continuous Time Signals, Fourier Series, Laplace Transform...' },
  { code: 'EC3351', name: 'Control Systems', department: Department.ECE, semester: 3, syllabus_overview: 'Transfer function, Time response analysis, Frequency response...' },

  // MECH Sem 1 (Same as CSE Sem 1)
  {
    code: 'HS3151',
    name: 'Professional English - I',
    department: Department.MECH,
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
    department: Department.MECH,
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
        content: 'Focuses on Partial differentiation, Homogeneous functions and Eulers theorem, Total derivative, Change of variables, Jacobians, Partial differentiation of implicit functions, Taylors series for functions of two variables, and Applications like Maxima and minima of functions of two variables and Lagranges method of undetermined multipliers.',
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
    department: Department.MECH,
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
        content: 'Focuses on Maxwells equations, wave equation, Plane electromagnetic waves in vacuum, properties of electromagnetic waves (speed, amplitude, phase, orientation and waves in matter), polarization, Producing electromagnetic waves, Energy and momentum in EM waves (Intensity, radiation pressure), Cell-phone reception, and Reflection and transmission of electromagnetic waves from a non-conducting medium-vacuum interface for normal incidence.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Oscillations, Optics and Lasers',
        content: 'Topics include Simple harmonic motion, resonance, analogy between electrical and mechanical oscillating systems, waves on a string (standing waves, traveling waves, Energy transfer), sound waves, Doppler effect. Also covers Reflection and refraction of light waves, total internal reflection, interference, Michelson interferometer, Theory of air wedge and experiment. Concludes with the Theory of laser (characteristics, Spontaneous and stimulated emission, Einsteins coefficients, population inversion), types of lasers (Nd-YAG laser, CO2 laser, semiconductor laser), and basic applications of lasers in industry.',
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
        content: 'Covers the harmonic oscillator (qualitative), Barrier penetration and quantum tunneling (qualitative), Tunneling microscope, Resonant diode, Finite potential wells (qualitative), Blochs theorem for particles in a periodic potential, and Basics of Kronig-Penney model and origin of energy bands',
        periods: 9
      }
    ]
  },
  {
    code: 'CY3151',
    name: 'Engineering Chemistry',
    department: Department.MECH,
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
    department: Department.MECH,
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
        content: 'Files and exceptions (text files, reading and writing files, format operator), command line arguments, errors and exceptions, handling exceptions, modules, packages. Illustrative programs: word count, copy file, Voters age validation, Marks range validation (0-100)',
        periods: 9
      }
    ]
  },

  // CIVIL Sem 1 (Same as CSE Sem 1)
  {
    code: 'HS3151',
    name: 'Professional English - I',
    department: Department.CIVIL,
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
    department: Department.CIVIL,
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
        content: 'Focuses on Partial differentiation, Homogeneous functions and Eulers theorem, Total derivative, Change of variables, Jacobians, Partial differentiation of implicit functions, Taylors series for functions of two variables, and Applications like Maxima and minima of functions of two variables and Lagranges method of undetermined multipliers.',
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
    department: Department.CIVIL,
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
        content: 'Focuses on Maxwells equations, wave equation, Plane electromagnetic waves in vacuum, properties of electromagnetic waves (speed, amplitude, phase, orientation and waves in matter), polarization, Producing electromagnetic waves, Energy and momentum in EM waves (Intensity, radiation pressure), Cell-phone reception, and Reflection and transmission of electromagnetic waves from a non-conducting medium-vacuum interface for normal incidence.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Oscillations, Optics and Lasers',
        content: 'Topics include Simple harmonic motion, resonance, analogy between electrical and mechanical oscillating systems, waves on a string (standing waves, traveling waves, Energy transfer), sound waves, Doppler effect. Also covers Reflection and refraction of light waves, total internal reflection, interference, Michelson interferometer, Theory of air wedge and experiment. Concludes with the Theory of laser (characteristics, Spontaneous and stimulated emission, Einsteins coefficients, population inversion), types of lasers (Nd-YAG laser, CO2 laser, semiconductor laser), and basic applications of lasers in industry.',
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
        content: 'Covers the harmonic oscillator (qualitative), Barrier penetration and quantum tunneling (qualitative), Tunneling microscope, Resonant diode, Finite potential wells (qualitative), Blochs theorem for particles in a periodic potential, and Basics of Kronig-Penney model and origin of energy bands',
        periods: 9
      }
    ]
  },
  {
    code: 'CY3151',
    name: 'Engineering Chemistry',
    department: Department.CIVIL,
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
    department: Department.CIVIL,
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
        content: 'Files and exceptions (text files, reading and writing files, format operator), command line arguments, errors and exceptions, handling exceptions, modules, packages. Illustrative programs: word count, copy file, Voters age validation, Marks range validation (0-100)',
        periods: 9
      }
    ]
  },

  // EEE Sem 1 (Same as CSE Sem 1)
  {
    code: 'HS3151',
    name: 'Professional English - I',
    department: Department.EEE,
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
    department: Department.EEE,
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
        content: 'Focuses on Partial differentiation, Homogeneous functions and Eulers theorem, Total derivative, Change of variables, Jacobians, Partial differentiation of implicit functions, Taylors series for functions of two variables, and Applications like Maxima and minima of functions of two variables and Lagranges method of undetermined multipliers.',
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
    department: Department.EEE,
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
        content: 'Focuses on Maxwells equations, wave equation, Plane electromagnetic waves in vacuum, properties of electromagnetic waves (speed, amplitude, phase, orientation and waves in matter), polarization, Producing electromagnetic waves, Energy and momentum in EM waves (Intensity, radiation pressure), Cell-phone reception, and Reflection and transmission of electromagnetic waves from a non-conducting medium-vacuum interface for normal incidence.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Oscillations, Optics and Lasers',
        content: 'Topics include Simple harmonic motion, resonance, analogy between electrical and mechanical oscillating systems, waves on a string (standing waves, traveling waves, Energy transfer), sound waves, Doppler effect. Also covers Reflection and refraction of light waves, total internal reflection, interference, Michelson interferometer, Theory of air wedge and experiment. Concludes with the Theory of laser (characteristics, Spontaneous and stimulated emission, Einsteins coefficients, population inversion), types of lasers (Nd-YAG laser, CO2 laser, semiconductor laser), and basic applications of lasers in industry.',
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
        content: 'Covers the harmonic oscillator (qualitative), Barrier penetration and quantum tunneling (qualitative), Tunneling microscope, Resonant diode, Finite potential wells (qualitative), Blochs theorem for particles in a periodic potential, and Basics of Kronig-Penney model and origin of energy bands',
        periods: 9
      }
    ]
  },
  {
    code: 'CY3151',
    name: 'Engineering Chemistry',
    department: Department.EEE,
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
    department: Department.EEE,
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
        content: 'Files and exceptions (text files, reading and writing files, format operator), command line arguments, errors and exceptions, handling exceptions, modules, packages. Illustrative programs: word count, copy file, Voters age validation, Marks range validation (0-100)',
        periods: 9
      }
    ]
  },

  // EEE Sem 2
  {
    code: 'HS3252',
    name: 'Professional English - II',
    department: Department.EEE,
    semester: 2,
    syllabus_overview: 'Making Comparisons, Expressing Causal Relations, Problem Solving, Reporting of Events and Research, and The Ability to Put Ideas or Information Cogently',
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
    name: 'Statistics and Numerical Methods',
    department: Department.EEE,
    semester: 2,
    syllabus_overview: 'Testing of Hypothesis, Design of Experiments, Solution of Equations and Eigenvalue Problems, Interpolation and Numerical Differentiation, Numerical Solution of Ordinary Differential Equations',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Testing of Hypothesis',
        content: 'Covers Sampling distributions, Tests for single mean, proportion, and difference of means (Large and small samples), Tests for single variance and equality of variances, Chi square test for goodness of fit, and Independence of attributes.',
        periods: 12
      },
      {
        unitNumber: 'II',
        title: 'Design of Experiments',
        content: 'Focuses on One way and two way classifications, Completely randomized design, Randomized block design, Latin square design, and 2^2 factorial design.',
        periods: 12
      },
      {
        unitNumber: 'III',
        title: 'Solution of Equations and Eigenvalue Problems',
        content: 'Includes solution methods for algebraic and transcendental equations (Fixed point iteration, Newton Raphson method), solution of linear system of equations (Gauss elimination, Pivoting, Gauss Jordan, Iterative methods like Gauss Jacobi and Gauss Seidel), and Eigenvalues of a matrix by Power method and Jacobis method for symmetric matrices.',
        periods: 12
      },
      {
        unitNumber: 'IV',
        title: 'Interpolation, Numerical Differentiation and Numerical Integration',
        content: 'Details Lagranges and Newtons divided difference interpolations, Newtons forward and backward difference interpolation, Approximation of derivates using interpolation polynomials, and Numerical single and double integrations using Trapezoidal and Simpsons 1/3 rules.',
        periods: 12
      },
      {
        unitNumber: 'V',
        title: 'Numerical Solution of Ordinary Differential Equations',
        content: 'Covers Single step methods (Taylors series, Eulers, Modified Eulers, Fourth order Runge-Kutta method) and Multi step methods (Milnes and Adams - Bash forth predictor corrector methods) for solving first order differential equations.',
        periods: 12
      }
    ]
  },
  {
    code: 'PH3202',
    name: 'Physics for Electrical Engineering',
    department: Department.EEE,
    semester: 2,
    syllabus_overview: 'Electromagnetic theory, principles of quantum mechanics, semiconductor physics, magnetic and dielectric materials, and photonic devices',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Electromagnetic Theory',
        content: 'Electromagnetic field theory fundamentals, Maxwells equations in differential and integral forms, Electromagnetic wave propagation, Poynting vector and energy flow, Reflection and refraction of electromagnetic waves.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'Quantum Mechanics',
        content: 'Introduction to quantum mechanics, Wave-particle duality, Schrodinger wave equation, Particle in a box, Quantum tunneling, Hydrogen atom.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Semiconductor Physics',
        content: 'Energy bands in solids, Intrinsic and extrinsic semiconductors, Carrier concentration, Fermi level, Hall effect, p-n junction, Solar cells.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'Magnetic and Dielectric Materials',
        content: 'Magnetic materials classification, Ferromagnetism, Magnetic domains, Hysteresis, Dielectric materials, Polarization, Ferroelectric materials, Applications.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'Photonic Devices',
        content: 'Lasers principle and types, LED, Photodetectors, Optical fibers, Fiber optic communication systems, Applications of photonics in electrical engineering.',
        periods: 9
      }
    ]
  },
  {
    code: 'BE3255',
    name: 'Basic Civil and Mechanical Engineering',
    department: Department.EEE,
    semester: 2,
    syllabus_overview: 'Building components, Construction materials, Survey fundamentals, Thermodynamics basics, Power generation, and Engineering mechanics',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Building Components and Materials',
        content: 'Building components (Foundation, Walls, Floors, Roofs), Construction materials (Cement, Aggregates, Concrete), Properties and testing of materials.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'Surveying',
        content: 'Principles of surveying, Linear and angular measurements, Leveling, Theodolite, Total station, GPS applications in surveying.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'Thermodynamics',
        content: 'Thermodynamic systems, Laws of thermodynamics, Thermodynamic processes, Heat engines, Refrigeration cycles, Heat transfer modes.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'Power Generation',
        content: 'Steam power plants, Gas turbine power plants, Hydroelectric power plants, Nuclear power plants, Renewable energy sources.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'Engineering Mechanics',
        content: 'Force systems, Equilibrium of forces, Friction, Center of gravity, Moment of inertia, Simple machines.',
        periods: 9
      }
    ]
  },
  {
    code: 'GE3251',
    name: 'Engineering Graphics',
    department: Department.EEE,
    semester: 2,
    syllabus_overview: 'Plane Curves and Freehand Sketching, Projection of Points/Lines/Plane Surface, Projection of Solids, Projection of Sectioned Solids and Development of Surfaces, and Isometric and Perspective Projections',
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
    code: 'EE3251',
    name: 'Electric Circuit Analysis',
    department: Department.EEE,
    semester: 2,
    syllabus_overview: 'Basic Circuits Analysis, Network Reduction and Theorems, Transient Response Analysis, Resonance and Coupled Circuits, and Three Phase Circuits',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'Basic Circuits Analysis',
        content: 'Fundamentals concepts of R, L and C elements. Energy Sources. Ohms Law - Kirchhoffs Laws. DC Circuits – Resistors in series and parallel circuits. A.C Circuits – Average and RMS Value – Complex Impedance – Phasor diagram - Real and Reactive Power, Power Factor, Energy. Mesh current and node voltage methods of analysis for D.C and A.C Circuits.',
        periods: 12
      },
      {
        unitNumber: 'II',
        title: 'Network Reduction and Theorems for DC and AC Circuits',
        content: 'Network reduction: voltage and current division, source transformation – star delta conversion. Theorems – Superposition, Thevenins and Nortons Theorem. Maximum power transfer theorem – Reciprocity Theorem – Millmans theorem- Tellegens Theorem. Statement and application of all theorems to DC and AC Circuits.',
        periods: 12
      },
      {
        unitNumber: 'III',
        title: 'Transient Response Analysis',
        content: 'Introduction – Laplace transforms and inverse Laplace transforms. Standard test signals. Transient response of RL, RC and RLC circuits using Laplace transform for: Source free input, Step input, and Sinusoidal input.',
        periods: 12
      },
      {
        unitNumber: 'IV',
        title: 'Resonance and Coupled Circuits',
        content: 'Series and parallel resonance – frequency response – Quality factor and Bandwidth. Self and mutual inductance. Coefficient of coupling – Dot rule. Analysis of coupled circuits – Single Tuned circuits.',
        periods: 12
      },
      {
        unitNumber: 'V',
        title: 'Three Phase Circuits',
        content: 'Analysis of three phase 3-wire and 4-wire circuits with star and delta connected loads, which can be balanced and unbalanced. Phasor diagram of voltages and currents. Power measurement in three phase circuits. Power Factor Calculations.',
        periods: 12
      }
    ]
  },

  // EEE Sem 3
  {
    code: 'MA3303',
    name: 'Probability and Complex Functions',
    department: Department.EEE,
    semester: 3,
    syllabus_overview: 'Axioms of probability – Conditional probability – Bayes theorem - Discrete and continuous random variables – Moments – Distributions – Analytic functions – Conformal mapping – Complex integration – Taylor and Laurent series – Residue theorem – Ordinary Differential Equations.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'PROBABILITY AND RANDOM VARIABLES',
        content: 'Axioms of probability – Conditional probability – Bayes theorem - Discrete and continuous random variables – Moments – Moment generating functions – Binomial, Poisson, Geometric, Uniform, Exponential and Normal distributions – Functions of a random variable.',
        periods: 12
      },
      {
        unitNumber: 'II',
        title: 'TWO-DIMENSIONAL RANDOM VARIABLES',
        content: 'Joint distributions – Marginal and conditional distributions – Covariance – Correlation and linear regression – Transformation of random variables – Central limit theorem (for independent and identically distributed random variables).',
        periods: 12
      },
      {
        unitNumber: 'III',
        title: 'ANALYTIC FUNCTIONS',
        content: 'Analytic functions – Necessary and sufficient conditions for analyticity in Cartesian and polar coordinates - Properties – Harmonic conjugates – Construction of analytic function - Conformal mapping – Mapping by functions w = z^2, w = 1/z, w = cz + c, w = z - Bilinear transformation.',
        periods: 12
      },
      {
        unitNumber: 'IV',
        title: 'COMPLEX INTEGRATION',
        content: 'Line integral - Cauchys integral theorem – Cauchys integral formula – Taylors and Laurents series – Singularities – Residues – Residue theorem – Application of residue theorem for evaluation of real integrals – Applications of circular contour and semicircular contour (with poles NOT on real axis).',
        periods: 12
      },
      {
        unitNumber: 'V',
        title: 'ORDINARY DIFFERENTIAL EQUATIONS',
        content: 'Higher order linear differential equations with constant coefficients - Method of variation of parameters – Homogenous equation of Eulers and Legendres type – System of simultaneous linear first order differential equations with constant coefficients - Method of undetermined coefficients.',
        periods: 12
      }
    ]
  },
  {
    code: 'EE3301',
    name: 'Electromagnetic Fields',
    department: Department.EEE,
    semester: 3,
    syllabus_overview: 'Sources and effects of electromagnetic fields – Coordinate Systems – Coulombs Law – Gausss law – Electric potential – Dielectric polarization – Lorentz force – Biot-Savarts Law - Amperes Circuit Law – Faradays law – Maxwells equations – Electromagnetic wave generation and equations – Plane wave reflection and refraction.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'ELECTROSTATICS - I',
        content: 'Sources and effects of electromagnetic fields – Coordinate Systems – Vector fields – Gradient, Divergence, Curl – theorems and applications - Coulombs Law – Electric field intensity – Field due to discrete and continuous charges – Gausss law and applications.',
        periods: 12
      },
      {
        unitNumber: 'II',
        title: 'ELECTROSTATICS - II',
        content: 'Electric potential – Electric field and equipotential plots, Uniform and Non-Uniform field, Utilization factor – Electric field in free space, conductors, dielectrics - Dielectric polarization – Dielectric strength - Electric field in multiple dielectrics – Boundary conditions, Poissons and Laplaces equations, Capacitance, Energy density, Applications.',
        periods: 12
      },
      {
        unitNumber: 'III',
        title: 'MAGNETOSTATICS',
        content: 'Lorentz force, magnetic field intensity (H) – Biot–Savarts Law - Amperes Circuit Law – H due to straight conductors, circular loop, infinite sheet of current, Magnetic flux density (B) – B in free space, conductor, magnetic materials – Magnetization, Magnetic field in multiple media – Boundary conditions, scalar and vector potential, Poissons Equation, Magnetic force, Torque, Inductance, Energy density, Applications.',
        periods: 12
      },
      {
        unitNumber: 'IV',
        title: 'ELECTRODYNAMIC FIELDS',
        content: 'Magnetic Circuits - Faradays law – Transformer and motional EMF – Displacement current - Maxwells equations (differential and integral form) – Relation between field theory and circuit theory – Applications.',
        periods: 12
      },
      {
        unitNumber: 'V',
        title: 'ELECTROMAGNETIC WAVES',
        content: 'Electromagnetic wave generation and equations – Wave parameters; velocity, intrinsic impedance, propagation constant – Waves in free space, lossy and lossless dielectrics, conductors- skin depth - Poynting vector – Plane wave reflection and refraction.',
        periods: 12
      }
    ]
  },
  {
    code: 'EE3302',
    name: 'Digital Logic Circuits',
    department: Department.EEE,
    semester: 3,
    syllabus_overview: 'Number system, error detection, corrections & codes conversions, Boolean algebra – switching functions and minimization - Digital Logic Families - Combinational logic - multiplexers and de multiplexers - code converters, adders, subtractors - Sequential logic - flip flops - counters - Shift registers - Asynchronous sequential logic - Programmability Logic Devices - VHDL.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'NUMBER SYSTEMS AND DIGITAL LOGIC FAMILIES',
        content: 'Number system, error detection, corrections & codes conversions, Boolean algebra: De Morgans theorem, switching functions and minimization using K-maps & Quine McCluskey method - Digital Logic Families - comparison of RTL, DTL, TTL, ECL and MOS families operation, characteristics of digital logic family.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'COMBINATIONAL CIRCUITS',
        content: 'Combinational logic - representation of logic functions-SOP and POS forms, K-map representations - minimization using K maps - simplification and implementation of combinational logic – multiplexers and de multiplexers - code converters, adders, subtractors, Encoders and Decoders.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'SYNCHRONOUS SEQUENTIAL CIRCUITS',
        content: 'Sequential logic- SR, JK, D and T flip flops - level triggering and edge triggering - counters - asynchronous and synchronous type - Modulo counters - Shift registers - design of synchronous sequential circuits – Moore and Mealy models- Counters, state diagram; state reduction; state assignment.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'ASYNCHRONOUS SEQUENTIAL CIRCUITS AND PROGRAMMABILITY LOGIC DEVICES',
        content: 'Asynchronous sequential logic Circuits-Transition stability, flow stability-race conditions, hazards & errors in digital circuits; analysis of asynchronous sequential logic circuits introduction to Programmability Logic Devices: PROM – PLA – PAL, CPLD-FPGA.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'VHDL',
        content: 'RTL Design – combinational logic – Sequential circuit – Operators – Introduction to Packages – Subprograms – Test bench. (Simulation /Tutorial Examples: adders, counters, flip flops, Multiplexers & De multiplexers).',
        periods: 9
      }
    ]
  },
  {
    code: 'EC3301',
    name: 'Electron Devices and Circuits',
    department: Department.EEE,
    semester: 3,
    syllabus_overview: 'PN junction diode - Clipping & Clamping circuits - Rectifiers - LED, Laser diodes, Zener diode - BJT, JFET, MOSFET - UJT, Thyristors and IGBT - BJT and MOSFET amplifiers - Multistage amplifiers - Differential amplifier - Feedback amplifiers - Oscillators.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'PN JUNCTION DEVICES',
        content: 'PN junction diode – structure, operation and V-I characteristics, diffusion and transition capacitance Clipping & Clamping circuits - Rectifiers – Half Wave and Full Wave Rectifier– Display devices- LED, Laser diodes, Zener diode characteristics- Zener diode Reverse characteristics – Zener diode as regulator.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'TRANSISTORS AND THYRISTORS',
        content: 'BJT, JFET, MOSFET- structure, operation, characteristics and Biasing UJT, Thyristors and IGBT - Structure and characteristics.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'AMPLIFIERS',
        content: 'BJT small signal model – Analysis of CE, CB, CC amplifiers- Gain and frequency response – MOSFET small signal model– Analysis of CS and Source follower – Gain and frequency response- High frequency analysis.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'MULTISTAGE AMPLIFIERS AND DIFFERENTIAL AMPLIFIER',
        content: 'BIMOS cascade amplifier, Differential amplifier – Common mode and Difference mode analysis – FET input stages – Single tuned amplifiers – Gain and frequency response – Neutralization methods, power amplifiers – Types (Qualitative analysis).',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'FEEDBACK AMPLIFIERS AND OSCILLATORS',
        content: 'Advantages of negative feedback – voltage / current, series, Shunt feedback – positive feedback – Condition for oscillations, phase shift – Wien bridge, Hartley, Colpitts and Crystal oscillators.',
        periods: 9
      }
    ]
  },
  {
    code: 'EE3303',
    name: 'Electrical Machines - I',
    department: Department.EEE,
    semester: 3,
    syllabus_overview: 'Fundamentals of Magnetic circuits - Principle of electromechanical energy conversion - Indian Standard Specifications - DC Generators - DC Motors - Testing of DC Machines - Single Phase Transformer - Three Phase Transformer - Autotransformer.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'ELECTROMECHANICAL ENERGY CONVERSION',
        content: 'Fundamentals of Magnetic circuits- Statically and dynamically induced EMF - Principle of electromechanical energy conversion forces and torque in magnetic field systems- energy balance in magnetic circuits- magnetic force- co-energy in singly excited and multi excited magnetic field system mmf of distributed windings – Winding Inductances-, magnetic fields in rotating machines- magnetic saturation and leakage fluxes. Introduction to Indian Standard Specifications (ISS) - Role and significance in testing.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'DC GENERATORS',
        content: 'Principle of operation, constructional details, armature windings and its types, EMF equation, wave shape of induced emf, armature reaction, demagnetizing and cross magnetizing Ampere turns, compensating winding, commutation, methods of improving commutation, interpoles, OCC and load characteristics of different types of DC Generators. Parallel operation of DC Generators, equalizing connections- applications of DC Generators.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'DC MOTORS',
        content: 'Principle of operation, significance of back emf, torque equations and power developed by armature, speed control of DC motors, starting methods of DC motors, load characteristics of DC motors, losses and efficiency in DC machine, condition for maximum efficiency. Testing of DC Machines: Brake test, Swinburnes test, Hopkinsons test, Field test, Retardation test, Separation of core losses-applications of DC motors.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'SINGLE PHASE TRANSFORMER',
        content: 'Construction and principle of operation, equivalent circuit, phasor diagrams, testing - polarity test, open circuit and short circuit tests, voltage regulation, losses and efficiency, all day efficiency, back-to-back test, separation of core losses, parallel operation of single-phase transformers, applications of single-phase transformer.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'AUTOTRANSFORMER AND THREE PHASE TRANSFORMER',
        content: 'Construction and working of auto transformer, comparison with two winding transformers, applications of autotransformer. Three Phase Transformer- Construction, types of connections and their comparative features, Scott connection, applications of Scott connection.',
        periods: 9
      }
    ]
  },
  {
    code: 'CS3354',
    name: 'Data Structures and OOPS',
    department: Department.EEE,
    semester: 3,
    syllabus_overview: 'Data Types – Variables – Operations – Expressions and Statements – Conditional Statements – Functions – Recursive Functions – Arrays - Structures – Union – Pointers - File Handling - Abstract Data Types (ADTs) – List ADT – Linked List – Stack ADT – Queue ADT - Trees – Binary Trees – Binary Search Tree – Hashing - Sorting and Searching.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'C PROGRAMMING FUNDAMENTALS',
        content: 'Data Types – Variables – Operations – Expressions and Statements – Conditional Statements – Functions – Recursive Functions – Arrays – Single and Multi-Dimensional Arrays.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'C PROGRAMMING - ADVANCED FEATURES',
        content: 'Structures – Union – Enumerated Data Types – Pointers: Pointers to Variables, Arrays and Functions – File Handling – Preprocessor Directives.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'LINEAR DATA STRUCTURES',
        content: 'Abstract Data Types (ADTs) – List ADT – Array-Based Implementation – Linked List – Doubly- Linked Lists – Circular Linked List – Stack ADT – Implementation of Stack – Applications – Queue ADT – Priority Queues – Queue Implementation – Applications.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'NON-LINEAR DATA STRUCTURES',
        content: 'Trees – Binary Trees – Tree Traversals – Expression Trees – Binary Search Tree – Hashing - Hash Functions – Separate Chaining – Open Addressing – Linear Probing– Quadratic Probing – Double Hashing – Rehashing.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'SORTING AND SEARCHING TECHNIQUES',
        content: 'Insertion Sort – Quick Sort – Heap Sort – Merge Sort – Linear Search – Binary Search.',
        periods: 9
      }
    ]
  },

  // EEE Sem 4
  {
    code: 'GE3451',
    name: 'Environmental Sciences and Sustainability',
    department: Department.EEE,
    semester: 4,
    syllabus_overview: 'Definition, scope and importance of environment – Eco-system and Energy flow – Types of biodiversity – Environmental Pollution – Renewable Sources of Energy – Sustainability and Management – Sustainability Practices.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'ENVIRONMENT AND BIODIVERSITY',
        content: 'Definition, scope and importance of environment – need for public awareness. Eco-system and Energy flow– ecological succession. Types of biodiversity: genetic, species and ecosystem diversity– values of biodiversity, India as a mega-diversity nation – hot-spots of biodiversity – threats to biodiversity: habitat loss, poaching of wildlife, man-wildlife conflicts – endangered and endemic species of India – conservation of biodiversity: In-situ and ex-situ.',
        periods: 6
      },
      {
        unitNumber: 'II',
        title: 'ENVIRONMENTAL POLLUTION',
        content: 'Causes, Effects and Preventive measures of Water, Soil, Air and Noise Pollutions. Solid, Hazardous and E-Waste management. Case studies on Occupational Health and Safety Management system (OHASMS). Environmental protection, Environmental protection acts.',
        periods: 6
      },
      {
        unitNumber: 'III',
        title: 'RENEWABLE SOURCES OF ENERGY',
        content: 'Energy management and conservation, New Energy Sources: Need of new sources. Different types new energy sources. Applications of- Hydrogen energy, Ocean energy resources, Tidal energy conversion. Concept, origin and power plants of geothermal energy.',
        periods: 6
      },
      {
        unitNumber: 'IV',
        title: 'SUSTAINABILITY AND MANAGEMENT',
        content: 'Development, GDP, Sustainability- concept, needs and challenges-economic, social and aspects of sustainability-from unsustainability to sustainability-millennium development goals, and protocols - Sustainable Development Goals-targets, indicators and intervention areas Climate change- Global, Regional and local environmental issues and possible solutions-case studies. Concept of Carbon Credit, Carbon Footprint. Environmental management in industry-A case study.',
        periods: 6
      },
      {
        unitNumber: 'V',
        title: 'SUSTAINABILITY PRACTICES',
        content: 'Zero waste and R concept, Circular economy, ISO 14000 Series, Material Life cycle assessment, Environmental Impact Assessment. Sustainable habitat: Green buildings, Green materials, Energy efficiency, Sustainable transports. Sustainable energy: Non-conventional Sources, Energy Cycles carbon cycle, emission and sequestration, Green Engineering: Sustainable urbanization- Socio economical and technological change.',
        periods: 6
      }
    ]
  },
  {
    code: 'EE3401',
    name: 'Transmission and Distribution',
    department: Department.EEE,
    semester: 4,
    syllabus_overview: 'Structure of electric power system – Parameters of transmission lines – Modelling and Performance of Transmission lines – Sag Calculation and Line Supports – Underground Cables – Distribution Systems – Trends in Transmission and Distribution.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'TRANSMISSION LINE PARAMETERS',
        content: 'Structure of electric power system - Parameters of single and three phase transmission lines with single and double circuits -Resistance, inductance, and capacitance of solid, stranded, and bundled conductors - Typical configuration, conductor types - Symmetrical and unsymmetrical spacing and transposition – application of self and mutual GMD; skin and proximity effects - Effects of earth on the capacitance of the transmission line - interference with neighboring communication circuits.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'MODELLING AND PERFORMANCE OF TRANSMISSION LINES',
        content: 'Performance of Transmission lines – short line, medium line and long line – equivalent circuits, phasor diagram, attenuation constant, phase constant, surge impedance – transmission efficiency and voltage regulation, real and reactive power flow in lines – Power Circle diagrams – Ferranti effect – Formation of Corona – Critical Voltages – Effect on line Performance.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'SAG CALCULATION AND LINE SUPPORTS',
        content: 'Mechanical design of overhead lines – Line Supports – Types of towers – Tension and Sag Calculation for different weather conditions – Methods of grounding - Insulators: Types, voltage distribution in insulator string, improvement of string efficiency, testing of insulators.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'UNDERGROUND CABLES',
        content: 'Underground cables – Types of cables – Construction of single-core and 3-core belted cables – Insulation Resistance – Potential Gradient – Capacitance of single-core and 3-core belted cables – Grading of cables – Power factor and heating of cables– DC cables.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'DISTRIBUTION SYSTEMS',
        content: 'Distribution Systems – General Aspects – Kelvins Law – AC and DC distributions – Concentrated and Distributed loading- Techniques of Voltage Control and Power factor improvement – Distribution Loss Types of Substations – Trends in Transmission and Distribution: EHVAC, HVDC and FACTS (Qualitative treatment only).',
        periods: 9
      }
    ]
  },
  {
    code: 'EE3402',
    name: 'Linear Integrated Circuits',
    department: Department.EEE,
    semester: 4,
    syllabus_overview: 'IC Fabrication – Characteristics of Op-amp – Applications of Op-amp – Instrumentation amplifier – Active filters – Function generator – Special ICs: 555 Timer, PLL, VCO – Application ICs: Voltage regulators, Analog multiplier.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'IC FABRICATION',
        content: 'IC classification, fundamental of monolithic IC technology, epitaxial growth, masking and etching, diffusion of impurities. Realisation of monolithic ICs and packaging. Fabrication of diodes, capacitance, resistance, FETs and PV Cell.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'CHARACTERISTICS OF OPAMP',
        content: 'Ideal OP-AMP characteristics, DC characteristics, AC characteristics, differential amplifier; frequency response of OP-AMP; Voltage-shunt feedback and inverting amplifier - Voltage series feedback: and Non-Inverting Amplifier - Basic applications of op-amp –, summer, differentiator and Integrator-V/I & I/V converters.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'APPLICATIONS OF OPAMP',
        content: 'Instrumentation amplifier and its applications for transducer Bridge, Log and Antilog Amplifiers- Analog multiplier & Divider, first and second order active filters, comparators, multi vibrators, waveform generators, clippers, clampers, peak detector, S/H circuit, D/A converter (R- 2R ladder and weighted resistor types), A/D converters using OP-AMPs.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'SPECIAL ICs',
        content: 'Functional block, characteristics of 555 Timer and its PWM application - IC-566 voltage controlled oscillator IC; 565-phase locked loop IC, AD633 Analog multiplier ICs.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'APPLICATION ICs',
        content: 'AD623 Instrumentation Amplifier and its application as load cell weight measurement - IC voltage regulators –LM78XX, LM79XX; Fixed voltage regulators its application as Linear power supply - LM317, 723 Variability voltage regulators, switching regulator- SMPS - ICL 8038 function generator IC.',
        periods: 9
      }
    ]
  },
  {
    code: 'EE3403',
    name: 'Measurements and Instrumentation',
    department: Department.EEE,
    semester: 4,
    syllabus_overview: 'Instruments classification and characteristics – Static and dynamic characteristics – Errors in measurement – Measurement of parameters in electrical systems – AC/DC Bridges – Instrumentation Amplifiers – Transducers – Digital Instrumentation.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'CONCEPTS OF MEASUREMENTS',
        content: 'Instruments: classification, applications – Elements of a generalized measurement system - Static and dynamic characteristics - Errors in measurement - Statistical evaluation of measurement data.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'MEASUREMENT OF PARAMETERS IN ELECTRICAL SYSTEMS',
        content: 'Classification of instruments – moving coil and moving iron meters – Induction type, dynamometer type watt meters – Energy meter – Megger – Instrument transformers (CT & PT).',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'AC/DC BRIDGES AND INSTRUMENTATION AMPLIFIERS',
        content: 'Wheatstone bridge, Kelvin double bridge - Maxwell, Hay, Wien and Schering bridges – Errors and compensation in A.C. bridges - Instrumentation Amplifiers.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'TRANSDUCERS FOR MEASUREMENT OF NON-ELECTRICAL PARAMETERS',
        content: 'Classification of transducers – Measurement of pressure, temperature, displacement, flow, angular velocity – Digital transducers – Smart Sensors.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'DIGITAL INSTRUMENTATION',
        content: 'A/D converters: types and characteristics – Sampling, Errors- Measurement of voltage, Current, frequency and phase - D/A converters: types and characteristics- DSO- Data Loggers – Basics of PLC programming and Introduction to Virtual Instrumentation - Instrument standards.',
        periods: 9
      }
    ]
  },
  {
    code: 'EE3404',
    name: 'Microprocessor and Microcontroller',
    department: Department.EEE,
    semester: 4,
    syllabus_overview: '8085 Architecture – Memory interfacing – I/O ports – Timing Diagram – Interrupt structure – Instruction set and Programming – Interfacing ICs: 8255, 8259, 8251, 8279, 8254 – 8051 Microcontroller – PIC16/18 architecture.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'INTRODUCTION TO 8085 ARCHITECTURE',
        content: 'Functional block diagram – Memory interfacing–I/O ports and data transfer concepts – Timing Diagram – Interrupt structure.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: '8085 INSTRUCTION SET AND PROGRAMMING',
        content: 'Instruction format and addressing modes – Assembly language format – Data transfer, data manipulation & control instructions – Programming: Loop structure with counting & Indexing - Look up table - Subroutine instructions, stack.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'INTERFACING BASICS AND ICS',
        content: 'Study of Architecture and programming of ICs: 8255 PPI, 8259PIC, 8251USART, 8279 Keyboard display controller and 8254 Timer/Counter – Interfacing with 8085 -A/D and D/A converter interfacing.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'INTRODUCTION TO 8051 MICROCONTROLLER',
        content: 'Functional block diagram - Instruction format and addressing modes – Interrupt structure – Timer – I/O ports – Serial communication, Simple programming – keyboard and display interface – Temperature control system – stepper motor control - Usage of IDE for assembly language programming.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'INTRODUCTION TO RISC BASED ARCHITECTURE',
        content: 'PIC16 /18 architecture, Memory organization – Addressing modes – Instruction set - Programming techniques – Timers – I/O ports – Interrupt programming.',
        periods: 9
      }
    ]
  },
  {
    code: 'EE3405',
    name: 'Electrical Machines - II',
    department: Department.EEE,
    semester: 4,
    syllabus_overview: 'Synchronous Generator – Synchronous Motor – Three Phase Induction Motor – Starting and Speed Control of Three Phase Induction Motor – Single Phase Induction Motors and Special Machines.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'SYNCHRONOUS GENERATOR',
        content: 'Constructional details – Types of rotors – winding factors- EMF equation – Synchronous reactance – Armature reaction – Phasor diagrams of non-salient pole synchronous generator connected to infinite bus--Synchronizing and parallel operation – Synchronizing torque -Change of excitation and mechanical input- Voltage regulation – EMF, MMF, ZPF and A.S.A method – steady state power- angle characteristics– Two reaction theory – slip test -short circuit transients - Capability Curves.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'SYNCHRONOUS MOTOR',
        content: 'Principle of operation – Torque equation – Operation on infinite bus bars - V and Inverted V curves – Power input and power developed equations – Starting methods – Current loci for constant power input, constant excitation and constant power Developed-Hunting – natural frequency of oscillations – damper windings- synchronous condenser.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'THREE PHASE INDUCTION MOTOR',
        content: 'Constructional details – Types of rotors –- Principle of operation – Slip – cogging and crawling- Equivalent circuit – Torque-Slip characteristics - Condition for maximum torque – Losses and efficiency – Load test - No load and blocked rotor tests - Circle diagram – Separation of losses – Double cage induction motors – Induction generators – Synchronous induction motor.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'STARTING AND SPEED CONTROL OF THREE PHASE INDUCTION MOTOR',
        content: 'Need for starting – Types of starters – DOL, Rotor resistance, Autotransformer and Star delta starters – Speed control – Voltage control, Frequency control and pole changing – Cascaded Connection-V/f control – Slip power recovery Scheme-Braking of three phase induction motor: Plugging, dynamic braking and regenerative braking.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'SINGLE PHASE INDUCTION MOTORS AND SPECIAL MACHINES',
        content: 'Constructional details of single phase induction motor – Double field revolving theory and operation – Equivalent circuit – No load and blocked rotor test – Performance analysis – Starting methods of single-phase induction motors – Capacitor-start capacitor run Induction motor- Shaded pole induction motor - Linear induction motor – Repulsion motor - Hysteresis motor - AC series motor- Servo motors- Stepper motors - introduction to magnetic levitation systems.',
        periods: 9
      }
    ]
  },

  // EEE Sem 5
  {
    code: 'EE3501',
    name: 'Power System Analysis',
    department: Department.EEE,
    semester: 5,
    syllabus_overview: 'Power system components, network modeling, load flow analysis, fault analysis, symmetrical components, unsymmetrical faults, power system stability, and economic operation.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'POWER SYSTEM COMPONENTS AND REPRESENTATION',
        content: 'Structure of power systems - Single line diagram - Per unit representation - Impedance diagram - Reactance diagram - Representation of generators, transformers, transmission lines and loads - Formation of bus admittance and impedance matrices.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'LOAD FLOW ANALYSIS',
        content: 'Importance of load flow studies - Bus classification - Formation of Y-bus matrix - Gauss-Seidel method - Newton-Raphson method - Fast decoupled load flow method - Comparison of methods - DC load flow - Voltage control methods.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'SYMMETRICAL FAULT ANALYSIS',
        content: 'Transients in power systems - Short circuit analysis - Assumptions in fault analysis - Symmetrical three phase faults - Fault analysis using bus impedance matrix - Selection of circuit breakers.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'UNSYMMETRICAL FAULT ANALYSIS',
        content: 'Symmetrical components - Sequence impedances and sequence networks of generators, transformers and transmission lines - Analysis of unsymmetrical faults: LG, LL, LLG faults - Open conductor faults.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'POWER SYSTEM STABILITY',
        content: 'Steady state stability - Swing equation - Equal area criterion - Critical clearing angle and time - Transient stability - Point by point method - Modified Euler method - Runge-Kutta method - Factors affecting stability - Methods to improve stability.',
        periods: 9
      }
    ]
  },
  {
    code: 'EE3591',
    name: 'Power Electronics',
    department: Department.EEE,
    semester: 5,
    syllabus_overview: 'Power semiconductor devices, phase controlled rectifiers, AC voltage controllers, choppers, inverters, and applications of power electronics.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'POWER SEMICONDUCTOR DEVICES',
        content: 'Power diodes - Power transistors: BJT, MOSFET, IGBT - Thyristors: SCR, TRIAC, GTO, MCT - Characteristics and specifications - Gate triggering circuits - Protection circuits - Series and parallel operation.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'PHASE CONTROLLED RECTIFIERS',
        content: 'Single phase half wave and full wave controlled rectifiers with R, RL, RLE loads - Three phase half wave and full wave controlled rectifiers - Six pulse and twelve pulse converters - Dual converters - Effect of source inductance - Power factor and harmonics.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'AC VOLTAGE CONTROLLERS',
        content: 'Principle of AC voltage controller - Single phase voltage controllers with R and RL loads - Three phase voltage controllers - Sequence control - Integral cycle control - Applications.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'DC TO DC CONVERTERS (CHOPPERS)',
        content: 'Principle of chopper - Step down and step up choppers - Classification of choppers - Switching techniques - Multi-phase choppers - Applications.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'INVERTERS',
        content: 'Principle of inverter operation - Single phase voltage source inverters - Three phase voltage source inverters - PWM techniques - Sinusoidal PWM - Current source inverters - Resonant inverters - Applications.',
        periods: 9
      }
    ]
  },
  {
    code: 'EE3503',
    name: 'Control Systems',
    department: Department.EEE,
    semester: 5,
    syllabus_overview: 'Systems and their representation, time response analysis, frequency response analysis, stability analysis, state variable analysis, and compensator design.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'SYSTEMS AND THEIR REPRESENTATION',
        content: 'Classification of systems - Mathematical modeling of physical systems - Transfer function - Block diagram representation - Signal flow graphs - Masons gain formula.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'TIME RESPONSE ANALYSIS',
        content: 'Standard test signals - Time response of first and second order systems - Time domain specifications - Steady state errors and error constants - P, PI, PD and PID controllers - Effects of controllers on system performance.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'FREQUENCY RESPONSE ANALYSIS',
        content: 'Frequency domain specifications - Bode plots - Polar plots - Nyquist plots - Determination of transfer function from Bode plot - All pass and minimum phase systems.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'STABILITY ANALYSIS',
        content: 'Concept of stability - Routh-Hurwitz criterion - Root locus technique - Construction rules - Stability analysis using Nyquist criterion - Relative stability - Gain margin and phase margin.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'STATE VARIABLE ANALYSIS AND COMPENSATORS',
        content: 'State space representation - State transition matrix - Controllability and observability - Pole placement by state feedback - Compensator design: Lead, lag and lag-lead compensators.',
        periods: 9
      }
    ]
  },

  // EEE Sem 6
  {
    code: 'EE8602',
    name: 'Protection and Switchgear',
    department: Department.EEE,
    semester: 6,
    syllabus_overview: 'Principles and need for protective schemes - nature and causes of faults - Electromagnetic Relays - Apparatus Protection - Static relays and Numerical Protection - Circuit Breakers and arc interruption.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'PROTECTION SCHEMES',
        content: 'Principles and need for protective schemes — nature and causes of faults — types of faults — Methods of Grounding — Zones of protection and essential qualities of protection — Protection scheme.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'ELECTROMAGNETIC RELAYS',
        content: 'Operating principles of relays — the Universal relay — Torque equation — R-X diagram — Electromagnetic Relays — Over current, Directional, Distance, Differential, Negative sequence and Under frequency relays.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'APPARATUS PROTECTION',
        content: 'Current transformers and Potential transformers and their applications in protection schemes — Protection of transformer, generator, motor, bus bars and transmission line.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'STATIC RELAYS AND NUMERICAL PROTECTION',
        content: 'Static relays — Phase, Amplitude Comparators — Synthesis of various relays using Static Comparators — Block diagram of Numerical relays — Over current protection, transformer differential protection, distant protection of transmission lines.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'CIRCUIT BREAKERS',
        content: 'Physics of arcing phenomenon and arc interruption — DC and AC circuit breaking — re-striking voltage and recovery voltage — rate of rise of recovery voltage — resistance switching — current chopping — interruption of capacitive current — Types of circuit breakers — air blast, air break, oil, SF6, MCBs, MCCBs and vacuum circuit breakers — comparison of different circuit breakers — Rating and selection of Circuit breakers.',
        periods: 9
      }
    ]
  },
  {
    code: 'EE8702',
    name: 'Power System Operation and Control',
    department: Department.EEE,
    semester: 6,
    syllabus_overview: 'Power scenario in Indian grid - Load dispatching centers - Load Frequency Control - Reactive Power Voltage Control - Economic Operation of Power System - Computer Control of Power Systems - SCADA and EMS.',
    detailed_syllabus: [
      {
        unitNumber: 'I',
        title: 'PRELIMINARIES ON POWER SYSTEM OPERATION AND CONTROL',
        content: 'Power scenario in Indian grid – National and Regional load dispatching centers – requirements of good power system – necessity of voltage and frequency regulation – real power vs frequency and reactive power vs voltage control loops – system load variation, load curves and basic concepts of load dispatching – load forecasting – Basics of speed governing mechanisms and modeling – speed load characteristics – regulation of two generators in parallel.',
        periods: 9
      },
      {
        unitNumber: 'II',
        title: 'REAL POWER – FREQUENCY CONTROL',
        content: 'Load Frequency Control (LFC) of single area system-static and dynamic analysis of uncontrolled and controlled cases – LFC of two area system – tie line modeling – block diagram representation of two area system – static and dynamic analysis – tie line with frequency bias control – state variability model – integration of economic dispatch control with LFC.',
        periods: 9
      },
      {
        unitNumber: 'III',
        title: 'REACTIVE POWER – VOLTAGE CONTROL',
        content: 'Generation and absorption of reactive power – basics of reactive power control – Automatic Voltage Regulator (AVR) – brushless AC excitation system – block diagram representation of AVR loop – static and dynamic analysis – stability compensation – voltage drop in transmission line – methods of reactive power injection – tap changing transformer, SVC (TCR + TSC) and STATCOM for voltage control.',
        periods: 9
      },
      {
        unitNumber: 'IV',
        title: 'ECONOMIC OPERATION OF POWER SYSTEM',
        content: 'Statement of economic dispatch problem – input and output characteristics of thermal plant – incremental cost curve – optimal operation of thermal units without and with transmission losses (no derivation of transmission loss coefficients) – base point and participation factors method – statement of unit commitment (UC) problem – constraints on UC problem – solution of UC problem using priority list – special aspects of short term and long term hydrothermal problems.',
        periods: 9
      },
      {
        unitNumber: 'V',
        title: 'COMPUTER CONTROL OF POWER SYSTEMS',
        content: 'Need of computer control of power systems-concept of energy control centers and functions – PMU – system monitoring, data acquisition and controls – System hardware configurations – SCADA and EMS functions – state estimation problem – measurements and errors – weighted least square estimation – various operating states – state transition diagram.',
        periods: 9
      }
    ]
  },

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