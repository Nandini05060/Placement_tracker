/**
 * Term End (Semester V) Examination Syllabus & Timetable Data
 * Extracted directly from syllabus.pdf
 */

export const TERM_END_SUBJECTS = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    shortName: 'AI',
    code: 'CS501',
    examDate: '2026-11-19',
    displayDate: '19 Nov',
    dayName: 'Thursday',
    timeSlot: '10:00 AM – 1:00 PM',
    color: '#C98F88',
    iconEmoji: '🤖',
    accentBg: 'rgba(201, 143, 136, 0.12)',
    accentBorder: 'rgba(201, 143, 136, 0.35)',
    summary: '6 Units • Search Algorithms, Knowledge Representation, CSP, Learning & Expert Systems',
    highYieldTips: [
      'Heuristic Search: Understand admissibility condition h(n) <= h*(n) and consistency for A*',
      'Minimax & Alpha-Beta Pruning: Practice tree tracing with alpha & beta cutoffs',
      'CSP: Master Backtracking + MRV (Minimum Remaining Values) + Degree heuristic & Forward Checking',
      'First Order Logic: Convert English sentences to FOL and solve Resolution refutation problems',
      'Decision Tree: Information Gain formula and ID3 split calculations'
    ],
    units: [
      {
        id: 'ai_u1',
        number: 1,
        title: 'Unit 1: Introduction to Artificial Intelligence',
        description: 'Definitions, Agent architectures, Rationality, and PEAS environment properties',
        topics: [
          'Definitions of AI and Applications of Artificial Intelligence',
          'Concept of Modeling, Inference and Learning',
          'Introduction to Machine Learning and Deep Learning as a subset of AI',
          'Intelligent agents, concept of rationality, structure of agents',
          'Environment and Properties of task environment (PEAS)',
          'Real world Examples of agents and environments'
        ]
      },
      {
        id: 'ai_u2',
        number: 2,
        title: 'Unit 2: Solving Problems by Searching',
        description: 'Uninformed & Informed search, Hill Climbing, Genetic Algorithms, Minimax & Alpha-beta pruning',
        topics: [
          'Problem solving agents, searching for solutions',
          'Uninformed Search: Breadth First Search (BFS), Depth First Search (DFS), Uniform Cost Search (UCS)',
          'Informed Search Strategies: Greedy Best First Search, A* search',
          'Hill Climbing and problems: Local Maxima, Plateau, Ridge',
          'Genetic Algorithm fundamentals and pipeline',
          'Adversarial Search: Introduction to Domain of a Game, optimal decisions in games',
          'Minimax algorithm and Alpha-beta pruning'
        ]
      },
      {
        id: 'ai_u3',
        number: 3,
        title: 'Unit 3: Knowledge Representation',
        description: 'Propositional & First-Order Logic, Inference, Forward & Backward chaining, Resolution',
        topics: [
          'Propositional logic (Syntax, Semantics, Truth tables)',
          'Theory of first order logic (FOL), predicates and quantifiers',
          'Inference in First Order Logic',
          'Forward & Backward chaining inference algorithms',
          'Resolution principle and refutation proofs'
        ]
      },
      {
        id: 'ai_u4',
        number: 4,
        title: 'Unit 4: Constraint Satisfaction Problem (CSP)',
        description: 'CSP formulation, Backtracking, MRV/Degree heuristics, AC-3 constraint propagation & Cryptarithmetic',
        topics: [
          'Constraint satisfaction problems definition and formulation',
          'Backtracking search for CSPs, variables and value ordering',
          'Propagating information through constraints (Forward checking, AC-3)',
          'Intelligent backtracking and Local search for CSP',
          'Cryptarithmetic problem formulation and solution',
          'Case study on CSP applications'
        ]
      },
      {
        id: 'ai_u5',
        number: 5,
        title: 'Unit 5: Learning',
        description: 'Inductive learning, Supervised decision trees, Unsupervised K-means clustering',
        topics: [
          'Inductive learning principles',
          'Types of learning (Supervised, Unsupervised, Reinforcement)',
          'Supervised learning: Decision trees classification',
          'Unsupervised learning: K-means clustering algorithm and distance measures'
        ]
      },
      {
        id: 'ai_u6',
        number: 6,
        title: 'Unit 6: Expert System',
        description: 'Architecture, Inference engine, Knowledge base, Lifecycle, and real-world systems',
        topics: [
          'Definition, model, and characteristics of Expert Systems',
          'Architecture of Expert Systems (Knowledge base, Inference engine, User interface)',
          'Expert system development process and lifecycle',
          'Limitations and challenges of expert systems',
          'Real world examples of expert systems (MYCIN, DENDRAL, etc.)'
        ]
      }
    ]
  },
  {
    id: 'se',
    name: 'Software Engineering',
    shortName: 'SE',
    code: 'CS502',
    examDate: '2026-11-23',
    displayDate: '23 Nov',
    dayName: 'Monday',
    timeSlot: '10:00 AM – 1:00 PM',
    color: '#8B967C',
    iconEmoji: '💻',
    accentBg: 'rgba(139, 150, 124, 0.12)',
    accentBorder: 'rgba(139, 150, 124, 0.35)',
    summary: '7 Units • Agile & Prescriptive Models, UML Modelling, Requirement Analysis, Architecture & Testing',
    highYieldTips: [
      'UML Diagrams: Practice drawing State, Activity, Sequence, and Class diagrams with proper notations',
      'Agile Frameworks: SCRUM ceremonies (Sprint Planning, Daily Standup, Review, Retrospective) & XP practices',
      'CMMI: Memorize the 5 Capability Maturity Levels (Initial, Managed, Defined, Quantitatively Managed, Optimizing)',
      'Testing: Differentiate Unit vs Integration (Top-Down/Bottom-Up) vs System Testing; Verification vs Validation',
      'UI Design: Memorize Theo Mandel\'s 3 Golden Rules of User Interface Design'
    ],
    units: [
      {
        id: 'se_u1',
        number: 1,
        title: 'Unit 1: Introduction to Problem Solving Skills',
        description: 'Role of software, legacy software, software myths, and prescriptive process models',
        topics: [
          'Importance of Software Engineering and discussion on prerequisites',
          'Introduction to Software Engineering and discussion of importance',
          'Discussion on various roles of software and categories of software',
          'Understanding legacy software through case study',
          'Discussion on software myths (Management myths, Customer myths, Practitioner myths)',
          'Prescriptive Process Models and discussion on roles of process models',
          'Prescriptive Process Models: Understanding process models through case studies'
        ]
      },
      {
        id: 'se_u2',
        number: 2,
        title: 'Unit 2: Process Models, Agile & UML Class Modelling',
        description: 'Waterfall/Spiral vs Agile, CMMI, XP, SCRUM, and Class Diagrams',
        topics: [
          'Prescriptive Process Models & Comparison of different process models',
          'Discussion on Capability Maturity Model Integration (CMMI)',
          'Agile Process Models & understanding the need of agile methodology',
          'Understanding difference between agile methodology and prescriptive process models',
          'Discussion on Agile Process Models – Agility, Agile Process, Agile Principles',
          'Adaptive Software Development (ASD) in Agile Environment',
          'Extreme Programming (XP) in Agile Environment',
          'SCRUM Framework in Software Engineering (Sprints, Backlog, Scrum Master, Product Owner)',
          'UML Modelling: Visual modelling with UML and Use case model',
          'Modelling with classes, identifying classes and objects of real-world problems',
          'UML Modelling: Defining events and attributes, process of creating class diagram'
        ]
      },
      {
        id: 'se_u3',
        number: 3,
        title: 'Unit 3: UML Dynamic Modelling',
        description: 'State diagrams, Activity diagrams, Interaction behaviour, and Sequence diagrams',
        topics: [
          'UML Modelling: Unified Modelling Language overview',
          'UML Drawing State Diagram (States, Transitions, Events, Guards)',
          'UML Drawing Activity Diagram (Swimlanes, Decision points, Fork/Join)',
          'Identifying Modelling Interaction and Behaviour',
          'UML Drawing Sequence Diagram (Lifelines, Messages, Synchronous/Asynchronous calls)'
        ]
      },
      {
        id: 'se_u4',
        number: 4,
        title: 'Unit 4: Requirement Analysis & Architectural Design',
        description: 'Requirements engineering, Analysis model, DFD, CFD, and Architectural styles',
        topics: [
          'Requirement Analysis & Design: Requirement Engineering Tasks',
          'Elements of Analysis Model (Scenario-based, Class-based, Behavioral)',
          'Data Modeling Concepts and Application for Case Study',
          'Discussion on Data Flow Model Development for Case Study (DFD Level 0, 1, 2)',
          'Discussion on Control Flow Model Development for Case Study (CFD)',
          'Architectural Design and Software Architecture concepts',
          'Data Design and Architectural Styles of Software (Layered, Client-Server, Pipe & Filter)'
        ]
      },
      {
        id: 'se_u5',
        number: 5,
        title: 'Unit 5: Architecture Mapping & UI Design',
        description: 'Data flow mapping to software architecture and Golden Rules of UI Design',
        topics: [
          'Architectural Design: Mapping Data Flow into a Software Architecture',
          'Transform Mapping and Transaction Mapping techniques',
          'User Interface Design principles and interface analysis',
          'Golden Rules for User Interface Design in Software Engineering (Theo Mandel)'
        ]
      },
      {
        id: 'se_u6',
        number: 6,
        title: 'Unit 6: Testing Strategies & Software Quality',
        description: 'Strategic testing approach, Verification & Validation, Unit, Integration and System testing',
        topics: [
          'Testing Strategies & Software Quality overview',
          'Test Strategies for Software and Strategic Approach',
          'Verification & Validation Testing (V&V model)',
          'Unit Testing (Drivers and Stubs, Boundary value analysis)',
          'Integration Testing (Top-Down, Bottom-Up, Sandwich, Regression testing)',
          'System Testing (Recovery, Security, Stress, Performance testing)'
        ]
      },
      {
        id: 'se_u7',
        number: 7,
        title: 'Unit 7: Software Quality Assurance (SQA) & Process Review',
        description: 'SQA activities, CMMI assessment, legacy software refactoring and case studies',
        topics: [
          'Testing Strategies & Software Quality: SQA Activities and Quality Metrics',
          'Capability Maturity Model Integration (CMMI) Assessment',
          'Importance of Software Engineering & discussion on prerequisites',
          'Comprehensive review of software roles, categories, and myths',
          'Understanding Legacy Software using Case Study',
          'Prescriptive Process Models review and process models via Case Studies'
        ]
      }
    ]
  },
  {
    id: 'os',
    name: 'Operating Systems',
    shortName: 'OS',
    code: 'CS503',
    examDate: '2026-11-25',
    displayDate: '25 Nov',
    dayName: 'Wednesday',
    timeSlot: '10:00 AM – 1:00 PM',
    color: '#A5A58A',
    iconEmoji: '⚙️',
    accentBg: 'rgba(165, 165, 138, 0.12)',
    accentBorder: 'rgba(165, 165, 138, 0.35)',
    summary: '7 Units • Process Scheduling, Concurrency, Deadlock, Memory Management, I/O & Files',
    highYieldTips: [
      'Banker\'s Algorithm: Practice safety check algorithm and resource-request algorithm step-by-step',
      'CPU Scheduling: Compute Waiting Time & Turnaround Time for FCFS, SJF, SRTF, and Round Robin (draw Gantt chart)',
      'Page Replacement: Solve FIFO, LRU, and Optimal page replacement numericals with page frames',
      'Classical IPC: Code the Semaphore solution for Producer-Consumer and Readers-Writers problem',
      'Disk Scheduling: Calculate total seek time for SSTF, SCAN, C-SCAN, LOOK, C-LOOK'
    ],
    units: [
      {
        id: 'os_u1',
        number: 1,
        title: 'Unit 1: Operating System Overview',
        description: 'OS objectives, functions, evolution, system calls, and layered vs monolithic structure',
        topics: [
          'Operating system objectives and functions',
          'Evolution of operating systems (Batch, Multi-programmed, Time-sharing, Distributed)',
          'Basic concepts: Processes, Files, System calls',
          'Layered structure v/s Monolithic structure of OS'
        ]
      },
      {
        id: 'os_u2',
        number: 2,
        title: 'Unit 2: Process and Process Scheduling',
        description: 'PCB, Threads vs processes, Preemptive & Non-preemptive scheduling algorithms',
        topics: [
          'Process description and process state transitions',
          'Process Control Block (PCB) structure and contents',
          'Threads, thread management, comparison between Processes and threads',
          'Process scheduling: Types (Long-term, Medium-term, Short-term)',
          'Study and comparison of various scheduling algorithms (FCFS, SJF, Priority, Round Robin)'
        ]
      },
      {
        id: 'os_u3',
        number: 3,
        title: 'Unit 3: Process Concurrency & Synchronization',
        description: 'Mutual exclusion, Semaphores, Monitors, Classical IPC problems',
        topics: [
          'Principles of concurrency and Critical Section Problem',
          'Mutual exclusion: hardware approaches (TestAndSet, Swap)',
          'Semaphores (Counting & Binary semaphores, wait and signal operations)',
          'Monitors and Condition Variables',
          'Message passing mechanisms',
          'Classical IPC problems: Readers/Writers Problem',
          'Classical IPC problems: Producer/Consumer Problem (Bounded Buffer)'
        ]
      },
      {
        id: 'os_u4',
        number: 4,
        title: 'Unit 4: Deadlock',
        description: 'Deadlock conditions, Prevention, Banker\'s avoidance algorithm, Detection & Dining Philosophers',
        topics: [
          'Principles of deadlock and 4 Coffman conditions',
          'Deadlock prevention strategies (Negating conditions)',
          'Deadlock avoidance: Banker\'s algorithm (Safety and Resource Request algorithms)',
          'Deadlock detection and recovery methods',
          'Dining Philosopher problem and synchronization solutions'
        ]
      },
      {
        id: 'os_u5',
        number: 5,
        title: 'Unit 5: Memory Management System',
        description: 'Memory partitioning, Paging, Segmentation, TLB, Virtual Memory, and Page Replacement',
        topics: [
          'Memory management requirements (Relocation, Protection, Sharing, Organization)',
          'Memory partitioning (Fixed, Dynamic, Internal & External Fragmentation)',
          'Paging mechanism, Page Table structure, TLB',
          'Segmentation mechanism and Segment Table',
          'Page replacement algorithms (FIFO, Optimal, LRU, Second-chance)'
        ]
      },
      {
        id: 'os_u6',
        number: 6,
        title: 'Unit 6: I/O Management and Disk Scheduling',
        description: 'I/O function organization, Buffering, Disk geometry, and Disk scheduling algorithms',
        topics: [
          'I/O devices, organization of the I/O function (Programmed, Interrupt, DMA)',
          'I/O buffering (Single, Double, Circular buffer)',
          'Disk structure and geometry',
          'Disk scheduling algorithms (FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK)'
        ]
      },
      {
        id: 'os_u7',
        number: 7,
        title: 'Unit 7: File Management',
        description: 'File organization, directory hierarchies, file sharing, and access control',
        topics: [
          'Overview of file system, file attributes, file operations',
          'File organization and access methods',
          'File directories (Single level, Two level, Tree structured, DAG)',
          'File sharing and protection mechanisms'
        ]
      }
    ]
  },
  {
    id: 'ivp',
    name: 'Image and Video Processing',
    shortName: 'IVP',
    code: 'CS504',
    examDate: '2026-11-27',
    displayDate: '27 Nov',
    dayName: 'Friday',
    timeSlot: '10:00 AM – 1:00 PM',
    color: '#B87973',
    iconEmoji: '🖼️',
    accentBg: 'rgba(184, 121, 115, 0.12)',
    accentBorder: 'rgba(184, 121, 115, 0.35)',
    summary: '8 Units • Unit-wise Marks Blueprint (Marks +- 5 ka margin)! Heavyweights: Enhancement (25M) & Video (25M)',
    weightageNote: 'Marks +- 5 ka margin',
    highYieldTips: [
      '★ CRITICAL WEIGHTAGE: Unit 2 (25M) & Unit 8 (25M) make 50 MARKS! Unit 4 (20M), 6 (20M), 7 (20M) make 60 MARKS!',
      'Histogram Equalization: Step-by-step PDF, CDF, s_k = round((L-1)*CDF(r_k)) calculation',
      'Distance Measures: Euclidean distance d_e, City-block d_4, Chessboard d_8, and m-path connectivity',
      'Morphology: Dilation expands foreground, Erosion shrinks; Opening (Erode->Dilate) removes noise, Closing (Dilate->Erode) bridges gaps',
      'Video Compression: I (Intra), P (Predicted), B (Bi-directional) frames; Motion estimation 3-Step Search algorithm'
    ],
    units: [
      {
        id: 'ivp_u1',
        number: 1,
        title: 'Unit 1: Image Fundamentals',
        marks: 10,
        marksBadge: '10 Marks',
        description: 'Digital image representation, colour image basics, spatial/gray resolution, distance measures, file formats',
        topics: [
          'Representation of digital image: image as a matrix, image as a function',
          'Basics of colour image',
          'Spatial and gray level resolution',
          'Distance measures: Euclidean distance, City block (D4), Chessboard (D8), and m-path',
          'Image file formats: TIFF, PNG, JPEG compression formats'
        ]
      },
      {
        id: 'ivp_u2',
        number: 2,
        title: 'Unit 2: Image Enhancement',
        marks: 25,
        marksBadge: '⭐ 25 Marks (Highest Weightage)',
        isHeavyweight: true,
        description: 'Point processing, Contrast stretching, Log/Power law, Smoothing/Sharpening spatial filters, Histogram equalization, Frequency domain',
        topics: [
          'Point processing techniques: Linear - digital negative',
          'Piecewise linear - contrast stretching, thresholding, intensity level slicing',
          'Nonlinear transformations: Log transformation, Power law (Gamma) transformation',
          'Neighborhood processing techniques: Smoothing spatial filters (Box/Mean filter)',
          'Sharpening spatial filters (Laplacian, High-boost filter)',
          'Median filters, Gaussian filtering',
          'Histogram processing: Histogram equalization (Derivation and Numericals)',
          'Image in Frequency domain: Fourier spectrum, Fourier analysis, filtering in frequency domain'
        ]
      },
      {
        id: 'ivp_u3',
        number: 3,
        title: 'Unit 3: Image Transforms',
        marks: 10,
        marksBadge: '10 Marks',
        description: 'Discrete Fourier Transform (DFT), Hadamard transform, Discrete Cosine Transform (DCT) for compression',
        topics: [
          'Discrete Fourier Transform (DFT) & 2D-DFT properties',
          'Hadamard transform matrix and properties',
          'Discrete Cosine Transform (DCT) and its applications for image compression (JPEG)'
        ]
      },
      {
        id: 'ivp_u4',
        number: 4,
        title: 'Unit 4: Morphological Image Processing',
        marks: 20,
        marksBadge: '⭐ 20 Marks',
        isHeavyweight: true,
        description: 'Dilation, Erosion, Opening, Closing, Hit-or-Miss transform, Boundary extraction, Thinning, Gray scale morphology',
        topics: [
          'Dilation and erosion operations with structuring elements',
          'Opening and closing operations and properties',
          'Hit–or-Miss transformation',
          'Basic morphological algorithms: Boundary extraction on binary images',
          'Thinning and Thickening algorithms',
          'Gray scale morphology'
        ]
      },
      {
        id: 'ivp_u5',
        number: 5,
        title: 'Unit 5: Edge Detection',
        marks: 10,
        marksBadge: '10 Marks',
        description: '1st & 2nd order derivatives, Prewitt, Sobel, Laplacian, Laplacian of Gaussian (LoG), Canny edge detector',
        topics: [
          'Gradient based edge detection: First order and second order derivative',
          'Edge detection operators: Prewitt operator',
          'Edge detection operators: Sobel operator',
          'Laplacian and Laplacian of Gaussian (LoG / Marr-Hildreth)',
          'Canny edge detector (Gaussian smoothing, Gradient, Non-maxima suppression, Hysteresis thresholding)'
        ]
      },
      {
        id: 'ivp_u6',
        number: 6,
        title: 'Unit 6: Image Segmentation',
        marks: 20,
        marksBadge: '⭐ 20 Marks',
        isHeavyweight: true,
        description: 'Pixel relationships, Component labeling (4/8/m), Thresholding, Otsu method, Region growing & split/merge',
        topics: [
          'Basic relationships between pixels, Component labeling (4, 8 and m connectivity)',
          'Segmentation using thresholding (Global, Local, Adaptive)',
          'Bayesian classification of foreground and background pixels',
          'Expectation-Maximization (EM) theorem for binarization',
          'Otsu method for optimal global thresholding',
          'Region-based segmentation: Region growing',
          'Region-based segmentation: Region splitting and merging'
        ]
      },
      {
        id: 'ivp_u7',
        number: 7,
        title: 'Unit 7: Colour Image Processing',
        marks: 20,
        marksBadge: '⭐ 20 Marks',
        isHeavyweight: true,
        description: 'Colour fundamentals, Models (RGB, CMY, CMYK, HSI, YUV, HSV), Transformations, Colour slicing, Histogram processing',
        topics: [
          'Colour fundamentals and colour models: RGB, CMY, CMYK',
          'Colour models: HSI, YUV, HSV models',
          'Model transformation (RGB to HSI and conversion formulas)',
          'Colour slicing and tone correction',
          'Histogram processing of colour images'
        ]
      },
      {
        id: 'ivp_u8',
        number: 8,
        title: 'Unit 8: Fundamentals of Digital Video and Its Compression',
        marks: 25,
        marksBadge: '⭐ 25 Marks (Highest Weightage)',
        isHeavyweight: true,
        description: 'Temporal correlation, I/P/B frame classification, Motion estimation, Exhaustive search, 2D-log, 3-step search',
        topics: [
          'Video representation: Temporal correlation in video',
          'Video frame classifications: I (Intra), P (Predicted), and B (Bi-directional) frames',
          'Fundamentals of motion estimation and block matching criteria (MAD, MSE)',
          'Motion estimation algorithms: Exhaustive search block matching',
          'Motion estimation algorithms: 2D-log search method',
          'Motion estimation algorithms: 3 step search (3SS) method'
        ]
      }
    ]
  },
  {
    id: 'set',
    name: 'Sustainable Energy and technology',
    shortName: 'SET',
    code: 'CS505',
    examDate: '2026-12-02',
    displayDate: '2 Dec',
    dayName: 'Wednesday',
    timeSlot: '10:00 AM – 1:00 PM',
    color: '#59634F',
    iconEmoji: '🌱',
    accentBg: 'rgba(89, 99, 79, 0.12)',
    accentBorder: 'rgba(89, 99, 79, 0.35)',
    summary: '5 Units • Energy Management, Audits, Boilers, Waste Heat Recovery, Green Buildings & Smart Grids',
    highYieldTips: [
      'Energy Audit: Walk-through vs Detailed audit methodology and 10 audit phases',
      'Energy Management: Top management commitment, energy policy, Monitoring & Targeting (M&T)',
      'Waste Heat Recovery: Recuperators, Regenerators, Heat Pipe exchangers, Economizers',
      'Boiler Efficiency: Direct method vs Indirect method (losses calculation)',
      'Green Building & Smart Grids: GRIHA/LEED benchmarks, EV charging infrastructure, Microgrids'
    ],
    units: [
      {
        id: 'set_u1',
        number: 1,
        title: 'Unit 1: Introduction',
        description: 'Global & Indian energy scenario, SDGs, policies, capital investments, time value of money',
        topics: [
          'Energy scenario in India and across the globe',
          'Sustainable Development Goals (SDGs), energy and climate change',
          'The value of energy management, acts and policies (Energy Conservation Act)',
          'Economic considerations for energy management – capital investments, sources of funds, time value of money, tax considerations'
        ]
      },
      {
        id: 'set_u2',
        number: 2,
        title: 'Unit 2: Energy Management Practices',
        description: 'Management commitment, Energy planning and budget, M&T, Energy management systems (ISO 50001)',
        topics: [
          'Top Management commitment, support and policy',
          'Energy planning and budget allocation',
          'Energy monitoring and targeting (M&T system, CUSUM analysis)',
          'Energy management systems (EnMS framework)'
        ]
      },
      {
        id: 'set_u3',
        number: 3,
        title: 'Unit 3: Energy Audit',
        description: 'Audit types, benchmarking, optimizing input energy, equipment efficiency, fuel substitution',
        topics: [
          'Introduction, Types of energy audits (Preliminary / Walk-through, Detailed)',
          'Components of energy audit and instrumentation',
          'Benchmarking and optimizing input energy requirement',
          'Improvements in operations and operating equipment near its best efficiency',
          'More efficient equipment and preventive maintenance for energy efficiency',
          'High frequency equipments, energy efficient process technologies, fuel and energy substitution'
        ]
      },
      {
        id: 'set_u4',
        number: 4,
        title: 'Unit 4: Energy Efficiency in Utilities',
        description: 'Boilers, Steam systems, Waste heat recovery, Cogeneration, Building envelope, HVAC, Electrical storage',
        topics: [
          'Key elements for increasing energy efficiencies of boilers and fire systems',
          'Steam and condensate systems, waste heat recovery devices',
          'Cogeneration (Combined Heat and Power - Topping & Bottoming cycles)',
          'Building envelope, HVAC systems efficiency',
          'Electrical energy management, power factor correction, lighting and energy storage'
        ]
      },
      {
        id: 'set_u5',
        number: 5,
        title: 'Unit 5: Innovative Applications for Sustainable Energy',
        description: 'Conservation innovations, Green Buildings (LEED/GRIHA), Green vehicles, Green fuels, Smart grids',
        topics: [
          'Innovations encouraging energy conservation and systems integrations',
          'Green Building concepts, standards, and energy efficient architecture',
          'Green vehicles, electric vehicles (EVs), hybrid systems',
          'Green fuels (Hydrogen, Biofuels, clean alternatives)',
          'Smart grids, Microgrids, and renewable integration'
        ]
      }
    ]
  },
  {
    id: 'lls',
    name: 'Leading through Life Skills',
    shortName: 'LLS',
    code: 'CS506',
    examDate: '2026-12-03',
    displayDate: '3 Dec',
    dayName: 'Thursday',
    timeSlot: '10:00 AM – 1:00 PM',
    color: '#D4A39D',
    iconEmoji: '✨',
    accentBg: 'rgba(212, 163, 157, 0.12)',
    accentBorder: 'rgba(212, 163, 157, 0.35)',
    summary: '10 Units • Self-Awareness (Johari), Time/Stress Management, Active Listening, Six Thinking Hats & Ethics',
    highYieldTips: [
      'Johari Window: 4 quadrants - Open Self, Blind Self, Hidden Self, Unknown Self with examples',
      'Stress Management: Selye\'s General Adaptation Syndrome (GAS) model: Alarm, Resistance, Exhaustion',
      'Time Management: Eisenhower Matrix (Urgent vs Important) & dealing with procrastination',
      'Edward de Bono\'s Six Thinking Hats: White (Facts), Red (Emotions), Black (Risks), Yellow (Benefits), Green (Creativity), Blue (Process)',
      'Leadership: Servant Leadership (Robert Greenleaf) vs Spiritual Leadership vs Value-driven Authentic Leadership'
    ],
    units: [
      {
        id: 'lls_u1',
        number: 1,
        title: 'Unit 1: Self-Awareness',
        description: 'Self Concept, Body Image, Self Esteem, Johari Window model, SWOT Analysis',
        topics: [
          'Definition and Types of Self – Self Concept, Body Image, Self Esteem',
          'Techniques Used for Self Awareness: Johari Window (Open, Blind, Hidden, Unknown quadrants)',
          'SWOT Analysis for personal assessment'
        ]
      },
      {
        id: 'lls_u2',
        number: 2,
        title: 'Unit 2: Self-Management',
        description: 'Mindfulness, Trustworthiness, Adaptability, Agility, Innovation, Self-Motivation',
        topics: [
          'Mindfulness and daily presence',
          'Trustworthiness, integrity, and accountability',
          'Adaptability and agility in dynamic situations',
          'Innovation, curiosity, and creative drive',
          'Self-Motivation and intrinsic drive'
        ]
      },
      {
        id: 'lls_u3',
        number: 3,
        title: 'Unit 3: Time Management',
        description: 'Goal setting (SMART), Organizing, Energy levels, Prioritization, Procrastination',
        topics: [
          'Set Goals (SMART goals framework)',
          'Organize and manage personal schedules',
          'Energy Levels management throughout the day',
          'Prioritize tasks (Eisenhower Matrix)',
          'Deal with Distractions and Overcoming Procrastination'
        ]
      },
      {
        id: 'lls_u4',
        number: 4,
        title: 'Unit 4: Stress Management',
        description: 'Stressors, General Adaptive Syndrome (GAS) model of stress, Coping strategies, Resilience',
        topics: [
          'Definition, Stressors, and Sources of Stress',
          'The General Adaptive Syndrome (GAS) Model of Stress (Alarm, Resistance, Exhaustion stages)',
          'Coping Strategies and practical stress reduction',
          'Building Resilience and emotional toughness'
        ]
      },
      {
        id: 'lls_u5',
        number: 5,
        title: 'Unit 5: Interpersonal Skills',
        description: 'Love, Compassion, Gratitude, and Empathy in human relationships',
        topics: [
          'Love, Compassion, and Humanity',
          'Practicing Gratitude and positive emotions',
          'Empathy vs Sympathy, and understanding other perspectives'
        ]
      },
      {
        id: 'lls_u6',
        number: 6,
        title: 'Unit 6: Listening as an Active Skill',
        description: 'Types of listeners, Listening for content vs info, Intensive listening, Barriers',
        topics: [
          'Types of Listeners (Active, Passive, Evaluative, Empathetic)',
          'Listening for General Content and Listening to Fill Up Information',
          'Intensive Listening and Listening for Specific Information',
          'Developing Effective Listening Skills',
          'Barriers to Effective Listening Skills and how to overcome them'
        ]
      },
      {
        id: 'lls_u7',
        number: 7,
        title: 'Unit 7: Art of Persuasion',
        description: 'Importance, Persuasion principles, Ethos/Pathos/Logos, Influence techniques',
        topics: [
          'Importance of Persuasion in professional and personal leadership',
          'Techniques of persuasion (Ethos, Pathos, Logos, Reciprocity, Social Proof)'
        ]
      },
      {
        id: 'lls_u8',
        number: 8,
        title: 'Unit 8: Creative Problem Solving',
        description: 'Six thinking hats, Mind mapping, Forced Connections',
        topics: [
          'Edward de Bono\'s Six Thinking Hats technique (White, Red, Black, Yellow, Green, Blue)',
          'Mind mapping for ideation and structuring solutions',
          'Forced Connections and lateral thinking exercises'
        ]
      },
      {
        id: 'lls_u9',
        number: 9,
        title: 'Unit 9: Righteousness',
        description: 'Moral teachings from Mahabharata, Ramayan, Guru Nanak Dev, Kabir, and Jesus Christ',
        topics: [
          'Learnings from Mahabharata (Dharma, Karma, Moral duty)',
          'Learnings from Ramayan (Virtue, Character, Truth)',
          'Teachings of Guru Nanak Dev (Kirat Karo, Naam Japo, Vand Chhako)',
          'Teachings and Dohas of Kabir (Simplicity, Inner truth, Harmony)',
          'Teachings of Jesus Christ (Love, Forgiveness, Compassion)'
        ]
      },
      {
        id: 'lls_u10',
        number: 10,
        title: 'Unit 10: Leadership',
        description: 'Spiritual leadership, Servant leadership, and Value-driven authentic leadership',
        topics: [
          'Spiritual Leadership (Inner values, higher purpose, transcendence)',
          'Servant Leadership (Prioritizing team growth and well-being)',
          'Value-driven Authentic Leadership (Leading by ethics, self-awareness, and trust)'
        ]
      }
    ]
  }
];

export const MOTIVATIONAL_EXAM_QUOTES = [
  "“Consistency in semester exams builds the unshakable foundation for your placement interviews!” 🌸",
  "“One concept at a time, Nandini. You have the intellect, the discipline, and the focus to ace every single paper!” ✨",
  "“Believe in the hours you put in. Your future self will look back and thank you for today's dedication!” 🍵",
  "“Clear concepts, neat diagrams, calm mind. Victory is yours in Semester V!” 🌟",
  "“Treat each subject as a puzzle to conquer. Stay curious, stay calm, and shine bright!” 💫"
];

