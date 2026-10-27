/**
 * 24-Week Placement Preparation Roadmap Data
 * Tailored for Computer Engineering students preparing for software placements
 */

const DEFAULT_ROADMAP_WEEKS = [
  // MONTH 1: PROGRAMMING FOUNDATIONS
  {
    id: 1,
    monthNumber: 1,
    monthTitle: "Month 1 — Programming Foundations",
    weekNum: 1,
    title: "Week 1: Java Syntax, Variables, Data Types & Operators",
    subjectKey: "Programming Foundations",
    weight: 4,
    description: "Establish strong syntax and core primitive foundations in Java. Master JVM memory layout, data types, type casting, and standard I/O.",
    objectives: [
      "Configure JDK 17+ and setup a professional IDE (IntelliJ IDEA / VS Code)",
      "Understand JDK, JRE, and JVM architecture with stack vs heap memory",
      "Master primitive types (int, long, double, char, boolean) and type conversion",
      "Perform console I/O using Scanner and BufferedReader",
      "Apply arithmetic, relational, logical, bitwise and assignment operators"
    ],
    suggestedDailyTarget: "1.5–2 hours: 45m concept study + 4 fundamental programming exercises",
    resources: [
      { title: "Java Language Basics — Oracle Official Docs", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/" },
      { title: "Java Memory Management Fundamentals — Baeldung", url: "https://www.baeldung.com/java-stack-heap" }
    ],
    defaultTasks: [
      { id: "w1_t1", text: "Verify local Java development environment and write a Hello World CLI app", completed: false },
      { id: "w1_t2", text: "Implement arithmetic conversions and format currency/decimal outputs", completed: false },
      { id: "w1_t3", text: "Practice Scanner handling for mixed integer and multi-word string inputs", completed: false },
      { id: "w1_t4", text: "Implement bitwise manipulations (checking parity, power of two, bitmasking)", completed: false },
      { id: "w1_t5", text: "Solve 5 foundational syntax questions on HackerRank Java track", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 2,
    monthNumber: 1,
    monthTitle: "Month 1 — Programming Foundations",
    weekNum: 2,
    title: "Week 2: Conditions, Loops, Methods & Basic Programs",
    subjectKey: "Programming Foundations",
    weight: 4,
    description: "Build robust control flow logic and modular method construction. Solve classic mathematical and algorithmic problems.",
    objectives: [
      "Master conditional branching: if-else ladders and modern switch expressions",
      "Control flow loops: for, enhanced for-each, while, do-while, break, continue",
      "Method definitions, parameters, return types, and pass-by-value semantics",
      "Deconstruct algorithmic math: Prime test, GCD/LCM, Factorials, Fibonacci series",
      "Deconstruct nested loop executions via geometric and number patterns"
    ],
    suggestedDailyTarget: "2 hours daily: 3 math algorithms + 2 modular pattern generators",
    resources: [
      { title: "Java Methods & Variable Scope — GeeksforGeeks", url: "https://www.geeksforgeeks.org/methods-in-java/" },
      { title: "Euclidean Algorithm for GCD Explained", url: "https://en.wikipedia.org/wiki/Euclidean_algorithm" }
    ],
    defaultTasks: [
      { id: "w2_t1", text: "Write clean if-else logic for tax slabs and leap year edge cases", completed: false },
      { id: "w2_t2", text: "Implement prime check optimized to O(sqrt(N)) time complexity", completed: false },
      { id: "w2_t3", text: "Implement Euclid's GCD and LCM algorithms iteratively", completed: false },
      { id: "w2_t4", text: "Construct 4 nested loop pattern programs to build traversal discipline", completed: false },
      { id: "w2_t5", text: "Refactor code into clean, reusable static methods with descriptive naming", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 3,
    monthNumber: 1,
    monthTitle: "Month 1 — Programming Foundations",
    weekNum: 3,
    title: "Week 3: Arrays, Strings & Basic Problem-Solving",
    subjectKey: "Programming Foundations",
    weight: 4,
    description: "Transition to contiguous memory structures. Understand string immutability, the string constant pool, and basic search algorithms.",
    objectives: [
      "1D and 2D arrays: memory allocation, indexing, traversal, and bounds",
      "Understand String immutability, String Constant Pool, and StringBuilder vs StringBuffer",
      "Master essential String APIs: charAt, substring, split, indexOf, toCharArray",
      "Implement linear search and basic iterative binary search on sorted arrays",
      "Work with 2D matrices: row/column sums, transposition, and diagonal traversal"
    ],
    suggestedDailyTarget: "2 hours daily: 2 array operations + 2 string manipulation challenges",
    resources: [
      { title: "Java String Pool Deep Dive — Baeldung", url: "https://www.baeldung.com/java-string-pool" },
      { title: "Arrays and Multi-dimensional Data in Java", url: "https://www.geeksforgeeks.org/arrays-in-java/" }
    ],
    defaultTasks: [
      { id: "w3_t1", text: "Find maximum, minimum, and second largest elements in an array in O(N)", completed: false },
      { id: "w3_t2", text: "Reverse an array in-place using two pointer indices without extra memory", completed: false },
      { id: "w3_t3", text: "Implement palindrome verification on strings ignoring non-alphanumeric chars", completed: false },
      { id: "w3_t4", text: "Implement iterative binary search and document boundary conditions", completed: false },
      { id: "w3_t5", text: "Write matrix rotation and matrix transposition utilities", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 4,
    monthNumber: 1,
    monthTitle: "Month 1 — Programming Foundations",
    weekNum: 4,
    title: "Week 4: OOP, Classes, Objects, Inheritance & Polymorphism",
    subjectKey: "Programming Foundations",
    weight: 5,
    description: "Master Object-Oriented Programming fundamentals tested in technical interviews and required for scalable software engineering.",
    objectives: [
      "Class blueprints, object instances, references, constructors, and 'this'",
      "Encapsulation: private fields, getters/setters, validation, and access modifiers",
      "Inheritance: 'extends', super keyword, constructor chaining, and code reuse",
      "Polymorphism: Compile-time (overloading) vs Runtime (overriding & dynamic dispatch)",
      "Interfaces and Abstract classes: differences, contracts, and multiple inheritance"
    ],
    suggestedDailyTarget: "2 hours daily: 1 hour OOP architecture study + 1 domain modeling implementation",
    resources: [
      { title: "OOP Concepts in Java — Comprehensive Guide", url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/" },
      { title: "Abstract Classes vs Interfaces — Baeldung", url: "https://www.baeldung.com/java-interface-vs-abstract-class" }
    ],
    defaultTasks: [
      { id: "w4_t1", text: "Model an Employee hierarchy (Developer, Manager, Intern) with encapsulated fields", completed: false },
      { id: "w4_t2", text: "Demonstrate runtime polymorphism with an abstract PaymentGateway and UPI/Card implementations", completed: false },
      { id: "w4_t3", text: "Implement constructor overloading and constructor chaining using this() and super()", completed: false },
      { id: "w4_t4", text: "Override equals() and hashCode() and demonstrate contract preservation", completed: false },
      { id: "w4_t5", text: "Document Java access modifiers (public, protected, default, private) in notes", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },

  // MONTH 2: DSA FOUNDATIONS
  {
    id: 5,
    monthNumber: 2,
    monthTitle: "Month 2 — DSA Foundations",
    weekNum: 5,
    title: "Week 5: Array Traversal & Common Array Problems",
    subjectKey: "Data Structures & Algorithms",
    weight: 5,
    description: "Deep dive into core algorithmic array patterns asked consistently in company screening rounds.",
    objectives: [
      "Kadane's Algorithm for Maximum Subarray Sum",
      "Dutch National Flag 3-way partitioning algorithm (Sort Colors)",
      "Prefix Sum and Range Sum query techniques",
      "Finding missing and duplicate elements in 1-to-N ranges",
      "Array rotation algorithms (reversal method in O(1) space)"
    ],
    suggestedDailyTarget: "2 hours daily: 2 Easy LeetCode questions + 1 Medium LeetCode problem",
    resources: [
      { title: "NeetCode Roadmap — Arrays & Hashing", url: "https://neetcode.io/roadmap" },
      { title: "Kadane's Algorithm Proof and Explanation", url: "https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/" }
    ],
    defaultTasks: [
      { id: "w5_t1", text: "Solve Two Sum (LeetCode #1)", completed: false },
      { id: "w5_t2", text: "Solve Best Time to Buy and Sell Stock (LeetCode #121)", completed: false },
      { id: "w5_t3", text: "Solve Maximum Subarray using Kadane's Algorithm (LeetCode #53)", completed: false },
      { id: "w5_t4", text: "Solve Sort Colors using Dutch National Flag Algorithm (LeetCode #75)", completed: false },
      { id: "w5_t5", text: "Solve Rotate Array by K steps using 3-reversals (LeetCode #189)", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 6,
    monthNumber: 2,
    monthTitle: "Month 2 — DSA Foundations",
    weekNum: 6,
    title: "Week 6: Strings, Hashing & Frequency Counting",
    subjectKey: "Data Structures & Algorithms",
    weight: 5,
    description: "Master constant-time lookups, bucket hashing, collision resolution, and frequency analysis.",
    objectives: [
      "Internal mechanics of Java HashMap (buckets, hash code, equals, collision chaining, treeification)",
      "Frequency counting pattern using HashMaps and direct fixed-size ASCII arrays",
      "HashSet for uniqueness validation and set operations",
      "Anagrams and String canonical representation",
      "Subarray sum equals K pattern combining Prefix Sum with HashMap"
    ],
    suggestedDailyTarget: "2 hours daily: 3 Hashing and String algorithmic problems",
    resources: [
      { title: "Internal Working of HashMap in Java — Baeldung", url: "https://www.baeldung.com/java-hashmap-advanced" },
      { title: "Hashing Problem Patterns on LeetCode", url: "https://leetcode.com/discuss/study-guide/2001789/Collections-of-important-Hashmap-questions" }
    ],
    defaultTasks: [
      { id: "w6_t1", text: "Solve Contains Duplicate (LeetCode #217)", completed: false },
      { id: "w6_t2", text: "Solve Valid Anagram (LeetCode #242)", completed: false },
      { id: "w6_t3", text: "Solve Group Anagrams (LeetCode #49)", completed: false },
      { id: "w6_t4", text: "Solve Longest Consecutive Sequence using HashSet (LeetCode #128)", completed: false },
      { id: "w6_t5", text: "Solve Subarray Sum Equals K using Prefix Sum + Map (LeetCode #560)", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 7,
    monthNumber: 2,
    monthTitle: "Month 2 — DSA Foundations",
    weekNum: 7,
    title: "Week 7: Searching, Sorting & Time Complexity",
    subjectKey: "Data Structures & Algorithms",
    weight: 5,
    description: "Master Big-O asymptotic analysis, comparison sorting, and advanced binary search variants.",
    objectives: [
      "Calculate time and space complexity for nested loops and recursive relations",
      "Compare sorting algorithms: Bubble, Selection, Insertion vs Merge Sort, Quick Sort",
      "Understand stability, in-place behavior, best/worst/average complexities",
      "Binary search variations: Lower bound, upper bound, peak finding",
      "Search in rotated and modified sorted structures"
    ],
    suggestedDailyTarget: "2 hours daily: 1 sorting implementation from scratch + 2 Binary Search problems",
    resources: [
      { title: "Sorting Algorithms Visualizer", url: "https://visualgo.net/en/sorting" },
      { title: "Binary Search Template Guide — LeetCode Discuss", url: "https://leetcode.com/discuss/study-guide/786126/Python-Powerful-Ultimate-Binary-Search-Template" }
    ],
    defaultTasks: [
      { id: "w7_t1", text: "Implement Merge Sort and trace the call stack recursion tree", completed: false },
      { id: "w7_t2", text: "Implement Quick Sort using Lomuto/Hoare partitioning", completed: false },
      { id: "w7_t3", text: "Solve Binary Search (LeetCode #704)", completed: false },
      { id: "w7_t4", text: "Solve Search in Rotated Sorted Array (LeetCode #33)", completed: false },
      { id: "w7_t5", text: "Solve Find Minimum in Rotated Sorted Array (LeetCode #153)", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 8,
    monthNumber: 2,
    monthTitle: "Month 2 — DSA Foundations",
    weekNum: 8,
    title: "Week 8: Two Pointers, Sliding Window & Revision",
    subjectKey: "Data Structures & Algorithms",
    weight: 5,
    description: "Master multi-pointer and window techniques that optimize quadratic algorithms into linear time.",
    objectives: [
      "Opposite direction two pointers for sorted search and palindrome validation",
      "Fast and slow pointers for in-place modifications and cycle detection",
      "Fixed-size sliding window for rolling metric analysis",
      "Dynamic/variable-size sliding window for constraint satisfactions",
      "Month 2 cumulative DSA review and timed challenge"
    ],
    suggestedDailyTarget: "2.5 hours daily: 3 sliding window / two pointer problems + notes consolidation",
    resources: [
      { title: "Mastering Sliding Window Algorithm — LeetCode Study Guide", url: "https://leetcode.com/discuss/study-guide/3588942/Mastering-Sliding-Window" },
      { title: "Two Pointers Technique Overview", url: "https://www.geeksforgeeks.org/two-pointers-technique/" }
    ],
    defaultTasks: [
      { id: "w8_t1", text: "Solve Two Sum II - Input Array Is Sorted (LeetCode #167)", completed: false },
      { id: "w8_t2", text: "Solve Container With Most Water (LeetCode #11)", completed: false },
      { id: "w8_t3", text: "Solve 3Sum using sorting and bidirectional pointers (LeetCode #15)", completed: false },
      { id: "w8_t4", text: "Solve Longest Substring Without Repeating Characters (LeetCode #3)", completed: false },
      { id: "w8_t5", text: "Review and consolidate Month 2 DSA problem approaches into personal notes", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },

  // MONTH 3: DSA AND SQL
  {
    id: 9,
    monthNumber: 3,
    monthTitle: "Month 3 — DSA and SQL",
    weekNum: 9,
    title: "Week 9: Recursion & Linked Lists",
    subjectKey: "Data Structures & Algorithms",
    weight: 5,
    description: "Build confidence with dynamic node allocation, pointer manipulations, and recursive call frames.",
    objectives: [
      "Recursive foundations: base cases, recursive steps, and stack memory bounds",
      "Singly and doubly linked lists: structure, insertion, deletion, and traversal",
      "Floyd's Cycle Detection Algorithm (Slow and Fast pointer approach)",
      "In-place list reversal and dummy node patterns",
      "Merging and sorting linked structures"
    ],
    suggestedDailyTarget: "2 hours daily: Diagram pointer adjustments on paper + solve 2 linked list problems",
    resources: [
      { title: "Linked List Visualizer — VisuAlgo", url: "https://visualgo.net/en/list" },
      { title: "Floyd Cycle Detection Proof", url: "https://www.geeksforgeeks.org/how-does-floyds-slow-and-fast-pointers-approach-work/" }
    ],
    defaultTasks: [
      { id: "w9_t1", text: "Write clean recursive functions for power(x, n) and string reversal", completed: false },
      { id: "w9_t2", text: "Solve Reverse Linked List iteratively and recursively (LeetCode #206)", completed: false },
      { id: "w9_t3", text: "Solve Merge Two Sorted Lists (LeetCode #21)", completed: false },
      { id: "w9_t4", text: "Solve Linked List Cycle detection (LeetCode #141)", completed: false },
      { id: "w9_t5", text: "Solve Remove Nth Node From End of List using dual pointers (LeetCode #19)", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 10,
    monthNumber: 3,
    monthTitle: "Month 3 — DSA and SQL",
    weekNum: 10,
    title: "Week 10: Stacks & Queues",
    subjectKey: "Data Structures & Algorithms",
    weight: 5,
    description: "Understand LIFO and FIFO execution, monotonic stack patterns, and queue-based buffer implementations.",
    objectives: [
      "Stack and Queue abstract data types: Array vs LinkedList implementations",
      "Java collections: ArrayDeque, LinkedList, and PriorityQueue overview",
      "Parentheses and expression matching using LIFO Stacks",
      "Monotonic Stack pattern for Next Greater / Smaller element problems",
      "Implement Queue using Stacks and Stack using Queues"
    ],
    suggestedDailyTarget: "2 hours daily: 1 Stack concept study + 2 LeetCode problems",
    resources: [
      { title: "Monotonic Stack Pattern Guide — LeetCode Discuss", url: "https://leetcode.com/discuss/study-guide/2349997/monotonic-stack-all-in-one" },
      { title: "Java Stack vs Deque Best Practices", url: "https://www.baeldung.com/java-deque-vs-stack" }
    ],
    defaultTasks: [
      { id: "w10_t1", text: "Solve Valid Parentheses (LeetCode #20)", completed: false },
      { id: "w10_t2", text: "Solve Min Stack with O(1) minimum retrieval (LeetCode #155)", completed: false },
      { id: "w10_t3", text: "Solve Implement Queue using Stacks (LeetCode #232)", completed: false },
      { id: "w10_t4", text: "Solve Next Greater Element I (LeetCode #496)", completed: false },
      { id: "w10_t5", text: "Solve Daily Temperatures using Monotonic Decreasing Stack (LeetCode #739)", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 11,
    monthNumber: 3,
    monthTitle: "Month 3 — DSA and SQL",
    weekNum: 11,
    title: "Week 11: SQL Queries & Aggregate Functions",
    subjectKey: "DBMS and SQL",
    weight: 4,
    description: "Master relational schema querying. SQL syntax and data filtering are tested in virtually every technical assessment.",
    objectives: [
      "Relational foundations: tables, rows, columns, primary data types (VARCHAR, INT, DATE)",
      "Basic querying: SELECT, DISTINCT, WHERE, ORDER BY, LIMIT, OFFSET",
      "Logical operators: AND, OR, NOT, IN, BETWEEN, LIKE, IS NULL",
      "Aggregate computations: COUNT, SUM, AVG, MIN, MAX",
      "Grouping semantics: GROUP BY, HAVING, and query execution order"
    ],
    suggestedDailyTarget: "1.5 hours daily: Solve 5 SQL query exercises on LeetCode / HackerRank",
    resources: [
      { title: "SQLBolt — Interactive Browser SQL Lessons", url: "https://sqlbolt.com/" },
      { title: "SQL Query Execution Order Explained", url: "https://www.sisense.com/blog/sql-query-order-of-operations/" }
    ],
    defaultTasks: [
      { id: "w11_t1", text: "Set up local MySQL/PostgreSQL or create a HackerRank SQL practice account", completed: false },
      { id: "w11_t2", text: "Solve basic data retrieval and sorting challenges on HackerRank", completed: false },
      { id: "w11_t3", text: "Write queries grouping employees by department with aggregate salary statistics", completed: false },
      { id: "w11_t4", text: "Document the precise operational difference between WHERE and HAVING", completed: false },
      { id: "w11_t5", text: "Solve Duplicate Emails query (LeetCode #182)", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 12,
    monthNumber: 3,
    monthTitle: "Month 3 — DSA and SQL",
    weekNum: 12,
    title: "Week 12: JOINs, Subqueries, Keys, Normalization & Transactions",
    subjectKey: "DBMS and SQL",
    weight: 5,
    description: "Master relational joins, nested subqueries, database keys, normalization theory, and transaction safety.",
    objectives: [
      "Relational Joins: INNER, LEFT, RIGHT, FULL OUTER, CROSS, and Self-Joins",
      "Relational Keys: Primary, Foreign, Candidate, Super, and Composite keys",
      "Subqueries: Correlated vs Non-Correlated and Common Table Expressions (WITH)",
      "Database Normalization: 1NF, 2NF, 3NF, BCNF and anomaly mitigation",
      "Transactions: ACID properties (Atomicity, Consistency, Isolation, Durability)"
    ],
    suggestedDailyTarget: "2 hours daily: 3 complex SQL queries + 1 DBMS architectural theory topic",
    resources: [
      { title: "Visual Guide to SQL Joins", url: "https://www.w3schools.com/sql/sql_join.asp" },
      { title: "DBMS Normalization Guide — Gate Smashers", url: "https://www.geeksforgeeks.org/database-normalization-introduction/" }
    ],
    defaultTasks: [
      { id: "w12_t1", text: "Solve Combine Two Tables using LEFT JOIN (LeetCode #175)", completed: false },
      { id: "w12_t2", text: "Solve Second Highest Salary using subquery and DENSE_RANK() (LeetCode #176)", completed: false },
      { id: "w12_t3", text: "Solve Employees Earning More Than Their Managers with self-join (LeetCode #181)", completed: false },
      { id: "w12_t4", text: "Write clear conceptual notes on 1NF, 2NF, and 3NF anomalies", completed: false },
      { id: "w12_t5", text: "Document ACID properties with real banking transaction scenarios", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },

  // MONTH 4: CORE SUBJECTS AND PROJECTS
  {
    id: 13,
    monthNumber: 4,
    monthTitle: "Month 4 — Core Subjects and Projects",
    weekNum: 13,
    title: "Week 13: Java Collections, Exceptions & DBMS Core",
    subjectKey: "Core Computer Science",
    weight: 5,
    description: "Deepen enterprise programming readiness with Java Collections framework, robust exception propagation, and DB indexing.",
    objectives: [
      "Java Collections Framework: List, Set, Queue, Map hierarchies and tradeoffs",
      "Comparable vs Comparator interfaces for custom sorting orders",
      "Exception hierarchy: Throwable, Error, Checked vs Unchecked Exceptions",
      "try-catch-finally, try-with-resources, and custom domain exceptions",
      "Database indexing: B-Trees, Clustered vs Non-Clustered index tradeoffs"
    ],
    suggestedDailyTarget: "2 hours daily: 1 hour Collections coding + 1 hour DBMS indexing review",
    resources: [
      { title: "Java Collections Hierarchy Guide — Baeldung", url: "https://www.baeldung.com/java-collections" },
      { title: "Database Indexing Under the Hood — Use The Index, Luke!", url: "https://use-the-index-luke.com/" }
    ],
    defaultTasks: [
      { id: "w13_t1", text: "Implement custom sorting on complex student records using Comparator and lambda", completed: false },
      { id: "w13_t2", text: "Create custom application exceptions with proper error codes and message chaining", completed: false },
      { id: "w13_t3", text: "Compare ArrayList vs LinkedList memory overhead and performance characteristics", completed: false },
      { id: "w13_t4", text: "Study B-Tree search depth and indexing performance on high-volume tables", completed: false },
      { id: "w13_t5", text: "Document transaction isolation levels (Dirty Read, Non-repeatable, Phantom Read)", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 14,
    monthNumber: 4,
    monthTitle: "Month 4 — Core Subjects and Projects",
    weekNum: 14,
    title: "Week 14: Operating Systems",
    subjectKey: "Operating Systems",
    weight: 5,
    description: "Master OS concepts essential for technical interviews: processes, threads, CPU scheduling, synchronization, and memory.",
    objectives: [
      "Process vs Thread: PCB, memory layout, context switching overhead",
      "Process lifecycle states and state transition models",
      "CPU Scheduling algorithms: FCFS, SJF, Round Robin, Priority Scheduling",
      "Process Synchronization: Critical Section, Mutex vs Counting Semaphore",
      "Deadlocks: 4 Coffman conditions, prevention, avoidance (Banker's Algorithm)",
      "Memory management: Paging, Segmentation, Page Faults, and Virtual Memory"
    ],
    suggestedDailyTarget: "2 hours daily: 1 OS theory topic + calculate scheduling metrics & MCQs",
    resources: [
      { title: "Operating Systems Lecture Series — Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdPvP" },
      { title: "Operating Systems Concept Cheatsheet — GeeksforGeeks", url: "https://www.geeksforgeeks.org/operating-systems/" }
    ],
    defaultTasks: [
      { id: "w14_t1", text: "Draw and memorize the Process State Transition model", completed: false },
      { id: "w14_t2", text: "Calculate Turnaround Time and Waiting Time for Round Robin and SJF scheduling", completed: false },
      { id: "w14_t3", text: "Explain Mutex vs Binary Semaphore with clear coding analogies", completed: false },
      { id: "w14_t4", text: "Detail the 4 Deadlock conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait", completed: false },
      { id: "w14_t5", text: "Summarize Paging, Page Table address translation, and LRU Page Replacement in notes", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 15,
    monthNumber: 4,
    monthTitle: "Month 4 — Core Subjects and Projects",
    weekNum: 15,
    title: "Week 15: Computer Networks",
    subjectKey: "Computer Networks",
    weight: 5,
    description: "Understand end-to-end network communication from physical packets to application layer protocols.",
    objectives: [
      "OSI 7-Layer Model vs TCP/IP Protocol Stack roles and protocol mapping",
      "TCP vs UDP: 3-Way Handshake, reliability, flow control, headers",
      "IP Addressing: IPv4 classes, subnetting, CIDR notation, and private vs public IPs",
      "DNS Resolution: Complete walkthrough of domain name to IP lookup",
      "HTTP vs HTTPS: SSL/TLS handshake, certificates, and status codes (200, 301, 404, 500)",
      "Answer the classic interview question: 'What happens when you type google.com in a browser?'"
    ],
    suggestedDailyTarget: "2 hours daily: 1 network layer deep dive + interview flashcard review",
    resources: [
      { title: "What Happens When You Type google.com into Browser", url: "https://github.com/alex/what-happens-when" },
      { title: "Computer Networks Complete Roadmap — GeeksforGeeks", url: "https://www.geeksforgeeks.org/computer-network-tutorials/" }
    ],
    defaultTasks: [
      { id: "w15_t1", text: "Diagram the OSI vs TCP/IP models with corresponding protocols at each layer", completed: false },
      { id: "w15_t2", text: "Trace the TCP 3-Way Handshake (SYN, SYN-ACK, ACK) and 4-way connection termination", completed: false },
      { id: "w15_t3", text: "Step-by-step documentation of recursive and iterative DNS query resolution", completed: false },
      { id: "w15_t4", text: "Create a reference card of common ports (HTTP:80, HTTPS:443, SSH:22, DNS:53)", completed: false },
      { id: "w15_t5", text: "Practice speaking through the complete browser URL request flow out loud", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 16,
    monthNumber: 4,
    monthTitle: "Month 4 — Core Subjects and Projects",
    weekNum: 16,
    title: "Week 16: Project Architecture, Database Design & Git/GitHub",
    subjectKey: "Project & Engineering",
    weight: 5,
    description: "Establish the architecture for your flagship placement project: 'FindIt — Lost and Found Portal'. Setup version control and schemas.",
    objectives: [
      "Define project scope: user management, item reporting, search filters, verification flow",
      "Design normalized database schema (Users, Items, Categories, Claims, Notifications)",
      "Set up Git repository with clean .gitignore, branch protections, and commit conventions",
      "Establish tech stack: Backend (Java Spring Boot / Node.js), Frontend, and Relational Database",
      "Draft RESTful API contract and endpoint specifications"
    ],
    suggestedDailyTarget: "2.5 hours daily: System architecture planning + Git initialization + DDL scripts",
    resources: [
      { title: "Relational Database Design Best Practices — freeCodeCamp", url: "https://www.freecodecamp.org/news/database-design-best-practices/" },
      { title: "Professional GitHub Repository Standards", url: "https://github.com/othneildrew/Best-README-Template" }
    ],
    defaultTasks: [
      { id: "w16_t1", text: "Draft comprehensive requirements specification and user journey flows for FindIt", completed: false },
      { id: "w16_t2", text: "Create an Entity-Relationship (ER) diagram with foreign keys and unique constraints", completed: false },
      { id: "w16_t3", text: "Initialize Git repository with structured commit history and architectural notes", completed: false },
      { id: "w16_t4", text: "Write clean SQL DDL migration scripts for all database tables", completed: false },
      { id: "w16_t5", text: "Configure project workspace with proper dependency management", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },

  // MONTH 5: PRACTICAL DEVELOPMENT AND ASSESSMENTS
  {
    id: 17,
    monthNumber: 5,
    monthTitle: "Month 5 — Practical Development and Assessments",
    weekNum: 17,
    title: "Week 17: Project Core Features",
    subjectKey: "Project & Engineering",
    weight: 5,
    description: "Build user-facing modules: responsive navigation, lost/found item submission forms, and clean card feeds.",
    objectives: [
      "Build responsive home feed with item cards, status badges, and pagination",
      "Construct 'Report Lost Item' and 'Report Found Item' form workflows",
      "Implement client-side data validation and error feedback",
      "Build item details modal with location tags and claim submission trigger",
      "Maintain modular, clean component architecture and CSS design tokens"
    ],
    suggestedDailyTarget: "2.5 hours daily: Component engineering and UI flow integration",
    resources: [
      { title: "Modern Web Form Design Guidelines — web.dev", url: "https://web.dev/learn/forms/" },
      { title: "Responsive Layout Architecture Guide", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" }
    ],
    defaultTasks: [
      { id: "w17_t1", text: "Build responsive navbar, hero banner, and recent items listing components", completed: false },
      { id: "w17_t2", text: "Implement item reporting form with category selection, date picker, and location input", completed: false },
      { id: "w17_t3", text: "Add image preview thumbnail before file upload submission", completed: false },
      { id: "w17_t4", text: "Implement status tag styling (Lost, Found, Claimed, Returned)", completed: false },
      { id: "w17_t5", text: "Validate responsive behavior across mobile viewports (375px) and desktop", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 18,
    monthNumber: 5,
    monthTitle: "Month 5 — Practical Development and Assessments",
    weekNum: 18,
    title: "Week 18: Backend, Database Integration & Validation",
    subjectKey: "Project & Engineering",
    weight: 5,
    description: "Implement backend REST endpoints, database connection pooling, query parameter sanitization, and search filters.",
    objectives: [
      "Develop CRUD endpoints: GET /items, POST /items, GET /items/:id, PATCH /items/:id/status",
      "Connect backend to database with parameterized queries (SQL injection prevention)",
      "Multi-attribute search: filter by category, campus location, date range, and keyword",
      "Claim verification workflow: claimant provides secret proof of ownership",
      "Implement standardized HTTP status codes and centralized error handling"
    ],
    suggestedDailyTarget: "2.5 hours daily: API development + database integration testing",
    resources: [
      { title: "RESTful API Design Standards", url: "https://restfulapi.net/" },
      { title: "OWASP Top 10 — Injection Flaw Mitigation", url: "https://owasp.org/www-community/attacks/SQL_Injection" }
    ],
    defaultTasks: [
      { id: "w18_t1", text: "Implement GET /api/items supporting query parameters for category and status", completed: false },
      { id: "w18_t2", text: "Implement POST /api/items with backend validation and sanitize all inputs", completed: false },
      { id: "w18_t3", text: "Implement keyword search using SQL LIKE or full-text indexing", completed: false },
      { id: "w18_t4", text: "Develop claim submission flow with ownership verification proof", completed: false },
      { id: "w18_t5", text: "Test API payloads using Postman / cURL and document responses", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 19,
    monthNumber: 5,
    monthTitle: "Month 5 — Practical Development and Assessments",
    weekNum: 19,
    title: "Week 19: Testing, Deployment & Documentation",
    subjectKey: "Project & Engineering",
    weight: 5,
    description: "Deploy the project live to the cloud, configure production environment variables, and write a stellar GitHub README.",
    objectives: [
      "Manage environment variables (.env) securely without committing secrets",
      "Deploy frontend and backend + database live on cloud platforms (Vercel, Render, Railway)",
      "Perform end-to-end user journey smoke tests on production URLs",
      "Author comprehensive README: features, architecture diagram, setup guide, API endpoints",
      "Prepare a concise 3-minute technical project explanation for interviewers"
    ],
    suggestedDailyTarget: "2 hours daily: Cloud deployment + README authoring + live verification",
    resources: [
      { title: "Cloud Deployment Best Practices for Full-Stack Apps", url: "https://render.com/docs" },
      { title: "Structuring Tech Project Demos for Interviews", url: "https://www.youtube.com/watch?v=kRz_JjUe6q4" }
    ],
    defaultTasks: [
      { id: "w19_t1", text: "Configure production environment variables and verify no credentials exist in Git", completed: false },
      { id: "w19_t2", text: "Deploy live instance and test lost-and-found submission end-to-end on cloud URL", completed: false },
      { id: "w19_t3", text: "Capture high-resolution screenshots / GIF demo walkthrough for documentation", completed: false },
      { id: "w19_t4", text: "Document local setup instructions (prerequisites, installation, environment keys)", completed: false },
      { id: "w19_t5", text: "Record 3 specific technical challenges faced and how you solved them in your project tracker", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 20,
    monthNumber: 5,
    monthTitle: "Month 5 — Practical Development and Assessments",
    weekNum: 20,
    title: "Week 20: Coding Assessments, Aptitude Mocks & Revision",
    subjectKey: "Assessments & Mocks",
    weight: 5,
    description: "Simulate online assessment (OA) conditions. Practice speed-accuracy tradeoffs under timed pressure.",
    objectives: [
      "Quantitative speed drills: Time & Work, Speed & Distance, Percentages, Profit & Loss",
      "Logical reasoning drills: Syllogisms, Blood relations, Direction sense, Seating arrangements",
      "Timed coding assessments: 2 algorithmic problems in 60 minutes",
      "Analyze negative marking strategies and time allocation rules",
      "Log errors and maintain revision cards for tricky mathematical formulas"
    ],
    suggestedDailyTarget: "2 hours daily: 25 timed aptitude questions + 1 timed DSA challenge",
    resources: [
      { title: "IndiaBIX Quantitative Aptitude Practice Library", url: "https://www.indiabix.com/aptitude/questions-and-answers/" },
      { title: "Campus Placement Assessment Question Sets", url: "https://www.faceprep.in/" }
    ],
    defaultTasks: [
      { id: "w20_t1", text: "Complete a 30-minute timed aptitude test on Percentages, Profit & Loss", completed: false },
      { id: "w20_t2", text: "Practice Time & Work shortcut techniques (LCM method) for 15 problems", completed: false },
      { id: "w20_t3", text: "Solve 10 Logical Reasoning questions on Syllogisms and Blood Relations", completed: false },
      { id: "w20_t4", text: "Simulate a 60-minute coding assessment with 2 Medium problems", completed: false },
      { id: "w20_t5", text: "Record all incorrect attempts into the Aptitude Tracker mistake log", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },

  // MONTH 6: INTERVIEW READINESS
  {
    id: 21,
    monthNumber: 6,
    monthTitle: "Month 6 — Interview Readiness",
    weekNum: 21,
    title: "Week 21: Java, OOP, DBMS & SQL Interviews",
    subjectKey: "Interview Preparation",
    weight: 5,
    description: "Verbal technical articulation preparation. Practice explaining core concepts aloud with concise, accurate definitions.",
    objectives: [
      "Top 50 Java Interview Questions: String immutability, equals vs ==, final vs finally vs finalize",
      "OOP scenarios: Interface vs abstract class, diamond problem, composition vs inheritance",
      "DBMS interview questions: Indexing mechanisms, triggers, views, ACID transactions",
      "Live SQL whiteboard queries: 2nd highest salary, duplicate detection, department top earners",
      "Prepare summary revision flashcards for quick review before technical rounds"
    ],
    suggestedDailyTarget: "2 hours daily: Verbal interview question rehearsals + flashcard review",
    resources: [
      { title: "Top Core Java Interview Questions — JavaTpoint", url: "https://www.javatpoint.com/core-java-interview-questions" },
      { title: "Top 50 DBMS Interview Questions — GeeksforGeeks", url: "https://www.geeksforgeeks.org/dbms-interview-questions/" }
    ],
    defaultTasks: [
      { id: "w21_t1", text: "Practice answering 'Why is String immutable in Java?' verbally in under 90 seconds", completed: false },
      { id: "w21_t2", text: "Explain B-Tree indexing and how it optimizes SELECT queries without full table scans", completed: false },
      { id: "w21_t3", text: "Verbally explain the difference between Process and Thread with memory illustrations", completed: false },
      { id: "w21_t4", text: "Write 5 common SQL query patterns on paper without IDE autocomplete", completed: false },
      { id: "w21_t5", text: "Review JVM Garbage Collection algorithms and object lifecycle phases", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 22,
    monthNumber: 6,
    monthTitle: "Month 6 — Interview Readiness",
    weekNum: 22,
    title: "Week 22: DSA Revision & Timed Coding Tests",
    subjectKey: "Interview Preparation",
    weight: 5,
    description: "Re-solve flagged revision problems and practice identifying algorithmic patterns within the first 3 minutes of reading.",
    objectives: [
      "Rapid pattern identification across Arrays, Strings, HashMaps, and Windows",
      "Solve 15 flagged problems from your DSA Revision Queue",
      "Practice clean variable naming and edge case handling under pressure",
      "Review time and space complexity table across all primary data structures",
      "Evaluate progress against the 80 DSA questions target"
    ],
    suggestedDailyTarget: "2.5 hours daily: 3 mixed DSA problems from previous placement rounds",
    resources: [
      { title: "Striver's SDE Sheet — Curated Placement Problems", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" },
      { title: "Blind 75 Essential LeetCode Questions", url: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions" }
    ],
    defaultTasks: [
      { id: "w22_t1", text: "Re-solve all problems currently marked 'Needs Revision' in your DSA Tracker", completed: false },
      { id: "w22_t2", text: "Review time and space complexity reference table for all major data structures", completed: false },
      { id: "w22_t3", text: "Practice coding on a blank Google Doc without syntax highlighting or autocomplete", completed: false },
      { id: "w22_t4", text: "Solve 2 random Medium problems on LeetCode without looking at solutions for 30 minutes", completed: false },
      { id: "w22_t5", text: "Verify that your unique solved DSA question target has been achieved", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 23,
    monthNumber: 6,
    monthTitle: "Month 6 — Interview Readiness",
    weekNum: 23,
    title: "Week 23: Resume, Communication & Mock Interviews",
    subjectKey: "Interview Preparation",
    weight: 5,
    description: "Finalize ATS-compliant resume, structure behavioral answers using the STAR technique, and participate in mock interviews.",
    objectives: [
      "1-page clean ATS-friendly resume formatting with quantified achievements",
      "Master 'Tell me about yourself' with a 90-second structured narrative",
      "Structure behavioral answers using STAR (Situation, Task, Action, Result)",
      "Conduct 2 peer mock interviews covering technical walkthroughs and HR questions",
      "Prepare thoughtful questions to ask interviewers at the end of rounds"
    ],
    suggestedDailyTarget: "2 hours daily: Resume line-item reviews + behavioral answer scripting",
    resources: [
      { title: "Harvard ATS Resume Template & Action Verbs", url: "https://careerservices.fas.harvard.edu/resources/bullet-point-resume-template/" },
      { title: "The STAR Method for Behavioral Interviews", url: "https://www.thebalancecareers.com/what-is-the-star-interview-response-technique-2061629" }
    ],
    defaultTasks: [
      { id: "w23_t1", text: "Audit resume bullet points: begin every bullet with strong action verbs and metrics", completed: false },
      { id: "w23_t2", text: "Write structured STAR responses for teamwork, conflict, and technical setbacks", completed: false },
      { id: "w23_t3", text: "Practice answers for 'Why our company?', 'Greatest strength', and 'Area of improvement'", completed: false },
      { id: "w23_t4", text: "Verify resume compatibility through an ATS scanning tool", completed: false },
      { id: "w23_t5", text: "Participate in a 45-minute technical and behavioral mock interview session", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  },
  {
    id: 24,
    monthNumber: 6,
    monthTitle: "Month 6 — Interview Readiness",
    weekNum: 24,
    title: "Week 24: Company-Specific Revision & Placement Assessments",
    subjectKey: "Interview Preparation",
    weight: 5,
    description: "Final consolidation, company test pattern simulations, calm mindset calibration, and celebrating your placement readiness.",
    objectives: [
      "Simulate 2 full company placement assessments (Aptitude + CS Fundamentals + Coding)",
      "Review Core CS formula sheets and quick revision notes one final time",
      "Organize interview setup: quiet environment, clean backdrop, lighting, stable internet",
      "Stress management, sleep hygiene, and confidence calibration before test days",
      "Review target company profiles and customized role resumes"
    ],
    suggestedDailyTarget: "2 hours daily: 1 mock simulation + light revision + confidence affirmations",
    resources: [
      { title: "Company-Specific Placement Papers — GeeksforGeeks", url: "https://www.geeksforgeeks.org/company-preparation/" },
      { title: "Technical Interview Day Checklist for Students", url: "https://www.geeksforgeeks.org/last-minute-interview-tips-for-freshers/" }
    ],
    defaultTasks: [
      { id: "w24_t1", text: "Complete a full 90-minute mock test mimicking your primary target company's pattern", completed: false },
      { id: "w24_t2", text: "Review the 'FindIt' project architecture and practice the 3-minute project walkthrough", completed: false },
      { id: "w24_t3", text: "Skim personal Core CS notes (DBMS, OS, Networks, Java OOP)", completed: false },
      { id: "w24_t4", text: "Prepare 3 thoughtful questions to ask the interview panel", completed: false },
      { id: "w24_t5", text: "Mark your 24-week roadmap complete and review your final Placement Readiness score", completed: false }
    ],
    notes: "",
    completed: false,
    completedAt: null
  }
];

window.DEFAULT_ROADMAP_WEEKS = DEFAULT_ROADMAP_WEEKS;
