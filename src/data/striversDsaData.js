/**
 * Striver's A2Z DSA Sheet Data
 * Source: https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet
 * Comprehensive 18-step curriculum for placement preparation
 */

export const STRIVERS_A2Z_STEPS = [
  {
    stepId: 'step-1',
    stepNumber: 1,
    title: 'Learn the Basics',
    description: 'Foundations of programming, basic recursion, math, and hashing',
    topics: [
      {
        topicId: 's1-t1',
        title: 'Things to Know in Programming (C++ / Java / Python)',
        problems: [
          { id: 'str_1_1_1', title: 'User Input / Output & Data Types', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/c/c-basics-syntax/' },
          { id: 'str_1_1_2', title: 'If-Else & Switch Statements', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/c/if-else-statements/' },
          { id: 'str_1_1_3', title: 'For Loops, While Loops, Do-While Loops', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/c/for-loops/' },
          { id: 'str_1_1_4', title: 'Functions (Pass by Value vs Reference)', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/c/functions-in-c/' },
          { id: 'str_1_1_5', title: 'Time and Space Complexity Analysis', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/data-structure/time-and-space-complexity/' }
        ]
      },
      {
        topicId: 's1-t2',
        title: 'Build-up Logical Thinking (Pattern Problems)',
        problems: [
          { id: 'str_1_2_1', title: 'Patterns 1 to 10 (Square, Triangle, Number Patterns)', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/strivers-a2z-dsa-course/must-do-pattern-problems-using-c-java-python/' },
          { id: 'str_1_2_2', title: 'Patterns 11 to 22 (Diamond, Hollow, Spiral Patterns)', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/strivers-a2z-dsa-course/must-do-pattern-problems-using-c-java-python/' }
        ]
      },
      {
        topicId: 's1-t3',
        title: 'Basic Maths for DSA',
        problems: [
          { id: 'str_1_3_1', title: 'Count Digits in a Number', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/find-numbers-with-even-number-of-digits/', tuf: 'https://takeuforward.org/data-structure/count-digits-in-a-number/' },
          { id: 'str_1_3_2', title: 'Reverse a Number', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/reverse-integer/', tuf: 'https://takeuforward.org/data-structure/reverse-a-number-in-c/' },
          { id: 'str_1_3_3', title: 'Check if a Number is Palindrome', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/palindrome-number/', tuf: 'https://takeuforward.org/data-structure/check-if-a-number-is-palindrome-or-not/' },
          { id: 'str_1_3_4', title: 'GCD or HCF (Euclidean Algorithm)', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/find-greatest-common-divisor-of-array/', tuf: 'https://takeuforward.org/data-structure/find-gcd-of-two-numbers/' },
          { id: 'str_1_3_5', title: 'Armstrong Numbers', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/maths/check-if-a-number-is-armstrong-number-or-not/' },
          { id: 'str_1_3_6', title: 'Print all Divisors of a Number', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/data-structure/print-all-divisors-of-a-given-number/' },
          { id: 'str_1_3_7', title: 'Check for Prime Number', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/count-primes/', tuf: 'https://takeuforward.org/data-structure/check-if-a-number-is-prime-or-not/' }
        ]
      },
      {
        topicId: 's1-t4',
        title: 'Basic Recursion',
        problems: [
          { id: 'str_1_4_1', title: 'Understand Recursion by printing 1 to N', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/recursion/print-1-to-n-using-recursion/' },
          { id: 'str_1_4_2', title: 'Sum of first N numbers & Factorial', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/data-structure/sum-of-first-n-natural-numbers/' },
          { id: 'str_1_4_3', title: 'Reverse an Array using Recursion', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/data-structure/reverse-a-given-array/' },
          { id: 'str_1_4_4', title: 'Check if a String is Palindrome (Recursive)', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/valid-palindrome/', tuf: 'https://takeuforward.org/data-structure/check-if-the-given-string-is-palindrome-or-not/' },
          { id: 'str_1_4_5', title: 'Fibonacci Number (Recursive)', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/fibonacci-number/', tuf: 'https://takeuforward.org/arrays/print-fibonacci-series-up-to-nth-term/' }
        ]
      },
      {
        topicId: 's1-t5',
        title: 'Basic Hashing',
        problems: [
          { id: 'str_1_5_1', title: 'Counting Frequencies of Array Elements', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/data-structure/count-frequency-of-each-element-in-the-array/' },
          { id: 'str_1_5_2', title: 'Find the highest / lowest frequency element', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/arrays/find-the-highest-lowest-frequency-element/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-2',
    stepNumber: 2,
    title: 'Learn Important Sorting Techniques',
    description: 'Bubble, Selection, Insertion, Merge, and Quick Sort algorithms',
    topics: [
      {
        topicId: 's2-t1',
        title: 'Sorting-I & Sorting-II',
        problems: [
          { id: 'str_2_1_1', title: 'Selection Sort', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/sorting/selection-sort-algorithm/' },
          { id: 'str_2_1_2', title: 'Bubble Sort', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/data-structure/bubble-sort-algorithm/' },
          { id: 'str_2_1_3', title: 'Insertion Sort', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/data-structure/insertion-sort-algorithm/' },
          { id: 'str_2_1_4', title: 'Merge Sort', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/sort-an-array/', tuf: 'https://takeuforward.org/data-structure/merge-sort-algorithm/' },
          { id: 'str_2_1_5', title: 'Recursive Bubble Sort & Insertion Sort', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/arrays/recursive-bubble-sort-algorithm/' },
          { id: 'str_2_1_6', title: 'Quick Sort', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/sort-an-array/', tuf: 'https://takeuforward.org/data-structure/quick-sort-algorithm/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-3',
    stepNumber: 3,
    title: 'Solve Problems on Arrays',
    description: 'Easy, Medium, and Hard level problems frequently asked in product company interviews',
    topics: [
      {
        topicId: 's3-t1',
        title: 'Easy Array Problems',
        problems: [
          { id: 'str_3_1_1', title: 'Largest Element in an Array', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/data-structure/find-the-largest-element-in-an-array/' },
          { id: 'str_3_1_2', title: 'Second Largest Element in an Array without sorting', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/data-structure/find-second-smallest-and-second-largest-element-in-an-array/' },
          { id: 'str_3_1_3', title: 'Check if Array is Sorted and Rotated', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/', tuf: 'https://takeuforward.org/data-structure/check-if-an-array-is-sorted/' },
          { id: 'str_3_1_4', title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', tuf: 'https://takeuforward.org/data-structure/remove-duplicates-in-place-from-sorted-array/' },
          { id: 'str_3_1_5', title: 'Left Rotate Array by K places', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/rotate-array/', tuf: 'https://takeuforward.org/data-structure/rotate-array-by-k-elements/' },
          { id: 'str_3_1_6', title: 'Move Zeroes to End', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/move-zeroes/', tuf: 'https://takeuforward.org/data-structure/move-all-zeros-to-the-end-of-the-array/' },
          { id: 'str_3_1_7', title: 'Linear Search & Union of Two Sorted Arrays', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/data-structure/union-of-two-sorted-arrays/' },
          { id: 'str_3_1_8', title: 'Find Missing Number in an Array', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/missing-number/', tuf: 'https://takeuforward.org/arrays/find-the-missing-number-in-an-array/' },
          { id: 'str_3_1_9', title: 'Max Consecutive Ones', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/max-consecutive-ones/', tuf: 'https://takeuforward.org/data-structure/count-maximum-consecutive-ones-in-the-array/' },
          { id: 'str_3_1_10', title: 'Single Number (Element appearing once)', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/single-number/', tuf: 'https://takeuforward.org/arrays/find-the-number-that-appears-once-and-the-other-numbers-twice/' }
        ]
      },
      {
        topicId: 's3-t2',
        title: 'Medium Array Problems',
        problems: [
          { id: 'str_3_2_1', title: '2 Sum Problem', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/two-sum/', tuf: 'https://takeuforward.org/data-structure/two-sum-check-if-a-pair-with-given-sum-exists-in-array/' },
          { id: 'str_3_2_2', title: 'Sort an array of 0s, 1s and 2s (Dutch National Flag)', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/sort-colors/', tuf: 'https://takeuforward.org/data-structure/sort-an-array-of-0s-1s-and-2s/' },
          { id: 'str_3_2_3', title: 'Majority Element (> n/2 times - Moore Voting)', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/majority-element/', tuf: 'https://takeuforward.org/data-structure/find-the-majority-element-that-occurs-more-than-n-2-times/' },
          { id: 'str_3_2_4', title: "Maximum Subarray Sum (Kadane's Algorithm)", difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/maximum-subarray/', tuf: 'https://takeuforward.org/data-structure/kadanes-algorithm-maximum-subarray-sum-in-an-array/' },
          { id: 'str_3_2_5', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', tuf: 'https://takeuforward.org/data-structure/stock-buy-and-sell/' },
          { id: 'str_3_2_6', title: 'Rearrange Array Elements by Sign', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/rearrange-array-elements-by-sign/', tuf: 'https://takeuforward.org/arrays/rearrange-array-elements-by-sign/' },
          { id: 'str_3_2_7', title: 'Next Permutation', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/next-permutation/', tuf: 'https://takeuforward.org/data-structure/next_permutation-find-next-lexicographically-greater-permutation/' },
          { id: 'str_3_2_8', title: 'Leaders in an Array', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/data-structure/leaders-in-an-array/' },
          { id: 'str_3_2_9', title: 'Longest Consecutive Sequence in an Array', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/longest-consecutive-sequence/', tuf: 'https://takeuforward.org/data-structure/longest-consecutive-sequence-in-an-array/' },
          { id: 'str_3_2_10', title: 'Set Matrix Zeroes', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/set-matrix-zeroes/', tuf: 'https://takeuforward.org/data-structure/set-matrix-zero/' },
          { id: 'str_3_2_11', title: 'Rotate Image / Matrix by 90 Degrees', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/rotate-image/', tuf: 'https://takeuforward.org/data-structure/rotate-image-by-90-degree/' },
          { id: 'str_3_2_12', title: 'Spiral Traversal of Matrix', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/spiral-matrix/', tuf: 'https://takeuforward.org/data-structure/spiral-traversal-of-matrix/' }
        ]
      },
      {
        topicId: 's3-t3',
        title: 'Hard Array Problems',
        problems: [
          { id: 'str_3_3_1', title: "Pascal's Triangle", difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/pascals-triangle/', tuf: 'https://takeuforward.org/data-structure/program-to-generate-pascals-triangle/' },
          { id: 'str_3_3_2', title: 'Majority Element II (> n/3 times)', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/majority-element-ii/', tuf: 'https://takeuforward.org/data-structure/majority-elementsn-3-times-find-the-elements-that-appears-more-than-n-3-times-in-the-array/' },
          { id: 'str_3_3_3', title: '3 Sum Problem', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/3sum/', tuf: 'https://takeuforward.org/data-structure/3-sum-find-triplets-that-add-up-to-a-zero/' },
          { id: 'str_3_3_4', title: '4 Sum Problem', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/4sum/', tuf: 'https://takeuforward.org/data-structure/4-sum-find-quads-that-add-up-to-a-target-value/' },
          { id: 'str_3_3_5', title: 'Largest Subarray with 0 Sum', difficulty: 'Medium', leetcode: '', tuf: 'https://takeuforward.org/data-structure/length-of-the-longest-subarray-with-zero-sum/' },
          { id: 'str_3_3_6', title: 'Merge Overlapping Subintervals', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/merge-intervals/', tuf: 'https://takeuforward.org/data-structure/merge-overlapping-sub-intervals/' },
          { id: 'str_3_3_7', title: 'Merge Two Sorted Arrays Without Extra Space', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/merge-sorted-array/', tuf: 'https://takeuforward.org/data-structure/merge-two-sorted-arrays-without-extra-space/' },
          { id: 'str_3_3_8', title: 'Find Missing and Repeating Number', difficulty: 'Medium', leetcode: '', tuf: 'https://takeuforward.org/data-structure/find-the-repeating-and-missing-numbers/' },
          { id: 'str_3_3_9', title: 'Count Inversions in an Array', difficulty: 'Medium', leetcode: '', tuf: 'https://takeuforward.org/data-structure/count-inversions-in-an-array/' },
          { id: 'str_3_3_10', title: 'Reverse Pairs', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/reverse-pairs/', tuf: 'https://takeuforward.org/data-structure/count-reverse-pairs/' },
          { id: 'str_3_3_11', title: 'Maximum Product Subarray', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/maximum-product-subarray/', tuf: 'https://takeuforward.org/data-structure/maximum-product-subarray-in-an-array/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-4',
    stepNumber: 4,
    title: 'Binary Search',
    description: 'Binary Search on 1D Arrays, BS on Answer Space, and BS in 2D Matrices',
    topics: [
      {
        topicId: 's4-t1',
        title: 'BS on 1D Arrays & Search Space',
        problems: [
          { id: 'str_4_1_1', title: 'Binary Search to find X in sorted array', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/binary-search/', tuf: 'https://takeuforward.org/data-structure/binary-search-explained/' },
          { id: 'str_4_1_2', title: 'Implement Lower Bound and Upper Bound', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/arrays/implement-lower-bound-bs-2/' },
          { id: 'str_4_1_3', title: 'Search Insert Position', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/search-insert-position/', tuf: 'https://takeuforward.org/arrays/search-insert-position/' },
          { id: 'str_4_1_4', title: 'First and Last Position of Element in Sorted Array', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/', tuf: 'https://takeuforward.org/data-structure/first-and-last-occurence-of-x/' },
          { id: 'str_4_1_5', title: 'Search in Rotated Sorted Array I & II', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', tuf: 'https://takeuforward.org/data-structure/search-element-in-a-rotated-sorted-array/' },
          { id: 'str_4_1_6', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', tuf: 'https://takeuforward.org/data-structure/minimum-in-rotated-sorted-array/' },
          { id: 'str_4_1_7', title: 'Single Element in a Sorted Array', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/single-element-in-a-sorted-array/', tuf: 'https://takeuforward.org/data-structure/search-single-element-in-a-sorted-array/' },
          { id: 'str_4_1_8', title: 'Find Peak Element', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/find-peak-element/', tuf: 'https://takeuforward.org/data-structure/peak-element-in-array/' }
        ]
      },
      {
        topicId: 's4-t2',
        title: 'BS on Answers (Allocation, Koko, Shipments)',
        problems: [
          { id: 'str_4_2_1', title: 'Find Square Root of a Number in log N', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/sqrtx/', tuf: 'https://takeuforward.org/binary-search/finding-sqrt-of-a-number-using-binary-search/' },
          { id: 'str_4_2_2', title: 'Koko Eating Bananas', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/koko-eating-bananas/', tuf: 'https://takeuforward.org/binary-search/koko-eating-bananas/' },
          { id: 'str_4_2_3', title: 'Minimum Days to Make M Bouquets', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/', tuf: 'https://takeuforward.org/binary-search/minimum-days-to-make-m-bouquets/' },
          { id: 'str_4_2_4', title: 'Find the Smallest Divisor given a Threshold', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/', tuf: 'https://takeuforward.org/binary-search/find-the-smallest-divisor-given-a-threshold/' },
          { id: 'str_4_2_5', title: 'Capacity to Ship Packages within D Days', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/', tuf: 'https://takeuforward.org/binary-search/capacity-to-ship-packages-within-d-days/' },
          { id: 'str_4_2_6', title: 'Aggressive Cows (Painter Partition / Book Allocation)', difficulty: 'Hard', leetcode: '', tuf: 'https://takeuforward.org/data-structure/aggressive-cows-detailed-solution/' },
          { id: 'str_4_2_7', title: 'Book Allocation Problem', difficulty: 'Hard', leetcode: '', tuf: 'https://takeuforward.org/data-structure/allocate-minimum-number-of-pages/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-5',
    stepNumber: 5,
    title: 'Strings [Basic and Medium]',
    description: 'String manipulation, palindromes, anagrams, and substring patterns',
    topics: [
      {
        topicId: 's5-t1',
        title: 'Core String Problems',
        problems: [
          { id: 'str_5_1_1', title: 'Remove Outermost Parentheses', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/remove-outermost-parentheses/', tuf: 'https://takeuforward.org/data-structure/remove-outermost-parentheses/' },
          { id: 'str_5_1_2', title: 'Reverse Words in a String', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/reverse-words-in-a-string/', tuf: 'https://takeuforward.org/data-structure/reverse-words-in-a-string/' },
          { id: 'str_5_1_3', title: 'Largest Odd Number in String', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/largest-odd-number-in-string/', tuf: 'https://takeuforward.org/strings/largest-odd-number-in-a-string/' },
          { id: 'str_5_1_4', title: 'Longest Common Prefix', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/longest-common-prefix/', tuf: 'https://takeuforward.org/data-structure/longest-common-prefix/' },
          { id: 'str_5_1_5', title: 'Isomorphic Strings', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/isomorphic-strings/', tuf: 'https://takeuforward.org/strings/isomorphic-string/' },
          { id: 'str_5_1_6', title: 'Check if two Strings are Anagrams', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/valid-anagram/', tuf: 'https://takeuforward.org/data-structure/check-if-two-strings-are-anagrams-of-each-other/' },
          { id: 'str_5_1_7', title: 'Sort Characters by Frequency', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/sort-characters-by-frequency/', tuf: 'https://takeuforward.org/strings/sort-characters-by-frequency/' },
          { id: 'str_5_1_8', title: 'String to Integer (atoi)', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/string-to-integer-atoi/', tuf: 'https://takeuforward.org/strings/string-to-integer-atoi/' },
          { id: 'str_5_1_9', title: 'Roman to Integer & Integer to Roman', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/roman-to-integer/', tuf: 'https://takeuforward.org/strings/roman-to-integer/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-6',
    stepNumber: 6,
    title: 'Learn LinkedList',
    description: 'Singly and Doubly Linked Lists, two-pointer fast-slow techniques, reversals',
    topics: [
      {
        topicId: 's6-t1',
        title: 'Single and Doubly LinkedList Core',
        problems: [
          { id: 'str_6_1_1', title: 'Introduction to LinkedList & Traversal', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/linked-list/introduction-to-linked-list/' },
          { id: 'str_6_1_2', title: 'Insert/Delete Node in LinkedList', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/delete-node-in-a-linked-list/', tuf: 'https://takeuforward.org/data-structure/delete-last-node-of-linked-list/' },
          { id: 'str_6_1_3', title: 'Middle of a LinkedList (Tortoise-Hare)', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/middle-of-the-linked-list/', tuf: 'https://takeuforward.org/data-structure/find-middle-element-in-a-linked-list/' },
          { id: 'str_6_1_4', title: 'Reverse a LinkedList (Iterative & Recursive)', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/reverse-linked-list/', tuf: 'https://takeuforward.org/data-structure/reverse-a-linked-list/' },
          { id: 'str_6_1_5', title: 'Detect a Cycle in LinkedList', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/linked-list-cycle/', tuf: 'https://takeuforward.org/data-structure/detect-a-cycle-in-a-linked-list/' },
          { id: 'str_6_1_6', title: 'Find the starting point of Cycle in LinkedList', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/linked-list-cycle-ii/', tuf: 'https://takeuforward.org/data-structure/starting-point-of-loop-in-a-linked-list/' },
          { id: 'str_6_1_7', title: 'Check if LinkedList is Palindrome', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/palindrome-linked-list/', tuf: 'https://takeuforward.org/data-structure/check-if-given-linked-list-is-plaindrome/' },
          { id: 'str_6_1_8', title: 'Segregate Odd and Even nodes in LinkedList', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/odd-even-linked-list/', tuf: 'https://takeuforward.org/data-structure/segregate-even-and-odd-nodes-in-linked-list/' },
          { id: 'str_6_1_9', title: 'Remove Nth Node from End of LinkedList', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', tuf: 'https://takeuforward.org/data-structure/delete-nth-node-from-end-of-a-linked-list/' },
          { id: 'str_6_1_10', title: 'Intersection Point of Two LinkedLists', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/intersection-of-two-linked-lists/', tuf: 'https://takeuforward.org/data-structure/find-intersection-of-two-linked-lists/' },
          { id: 'str_6_1_11', title: 'Add Two Numbers represented as LinkedLists', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/add-two-numbers/', tuf: 'https://takeuforward.org/data-structure/add-two-numbers-represented-as-linked-lists/' },
          { id: 'str_6_1_12', title: 'Merge Two Sorted LinkedLists', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/merge-two-sorted-lists/', tuf: 'https://takeuforward.org/data-structure/merge-two-sorted-linked-lists/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-7',
    stepNumber: 7,
    title: 'Recursion and Backtracking',
    description: 'Subsets, combinations, permutations, N-Queens, Sudoku solver',
    topics: [
      {
        topicId: 's7-t1',
        title: 'Subsequences & Patternwise Recursion',
        problems: [
          { id: 'str_7_1_1', title: 'Power(x, n)', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/powx-n/', tuf: 'https://takeuforward.org/data-structure/calculate-powxn/' },
          { id: 'str_7_1_2', title: 'Generate all Parentheses', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/generate-parentheses/', tuf: 'https://takeuforward.org/recursion/generate-all-balanced-parentheses/' },
          { id: 'str_7_1_3', title: 'Print all Subsequences (Power Set)', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/subsets/', tuf: 'https://takeuforward.org/data-structure/power-set-print-all-subsequences/' },
          { id: 'str_7_1_4', title: 'Combination Sum I & II', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/combination-sum/', tuf: 'https://takeuforward.org/data-structure/combination-sum-1/' },
          { id: 'str_7_1_5', title: 'Subset Sum I & II', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/subsets-ii/', tuf: 'https://takeuforward.org/data-structure/subset-sum-sum-of-all-subsets/' },
          { id: 'str_7_1_6', title: 'N-Queens Problem', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/n-queens/', tuf: 'https://takeuforward.org/data-structure/n-queen-problem-return-all-distinct-solutions-to-the-n-queens-puzzle/' },
          { id: 'str_7_1_7', title: 'Sudoku Solver', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/sudoku-solver/', tuf: 'https://takeuforward.org/data-structure/sudoku-solver/' },
          { id: 'str_7_1_8', title: 'Word Search in Grid', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/word-search/', tuf: 'https://takeuforward.org/data-structure/word-search-leetcode/' },
          { id: 'str_7_1_9', title: 'Rat in a Maze Problem', difficulty: 'Medium', leetcode: '', tuf: 'https://takeuforward.org/data-structure/rat-in-a-maze/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-8',
    stepNumber: 8,
    title: 'Bit Manipulation',
    description: 'Bitwise operations, XOR tricks, set/clear bits, subsets using bits',
    topics: [
      {
        topicId: 's8-t1',
        title: 'Bit Manipulation Tricks',
        problems: [
          { id: 'str_8_1_1', title: 'Check if ith bit is set or not', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/data-structure/check-if-the-i-th-bit-is-set-or-not/' },
          { id: 'str_8_1_2', title: 'Check if number is power of 2', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/power-of-two/', tuf: 'https://takeuforward.org/bit-manipulation/check-if-a-number-is-power-of-two-or-not/' },
          { id: 'str_8_1_3', title: 'Count set bits in integer', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/number-of-1-bits/', tuf: 'https://takeuforward.org/bit-manipulation/count-number-of-set-bits/' },
          { id: 'str_8_1_4', title: 'Two numbers with odd occurrences', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/single-number-iii/', tuf: 'https://takeuforward.org/bit-manipulation/two-numbers-with-odd-occurrences/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-9',
    stepNumber: 9,
    title: 'Stack and Queues',
    description: 'Implementations, Monotonic Stack, LRU Cache, prefix/infix/postfix',
    topics: [
      {
        topicId: 's9-t1',
        title: 'Stack & Queue Fundamentals & Monotonic Stack',
        problems: [
          { id: 'str_9_1_1', title: 'Implement Stack using Arrays & Queues', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/implement-stack-using-queues/', tuf: 'https://takeuforward.org/data-structure/implement-stack-using-array/' },
          { id: 'str_9_1_2', title: 'Check for Balanced Parentheses', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/valid-parentheses/', tuf: 'https://takeuforward.org/data-structure/check-for-balanced-parentheses/' },
          { id: 'str_9_1_3', title: 'Next Greater Element I & II', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/next-greater-element-i/', tuf: 'https://takeuforward.org/data-structure/next-greater-element-using-stack/' },
          { id: 'str_9_1_4', title: 'Trapping Rainwater', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/trapping-rain-water/', tuf: 'https://takeuforward.org/data-structure/trapping-rainwater/' },
          { id: 'str_9_1_5', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', tuf: 'https://takeuforward.org/data-structure/area-of-largest-rectangle-in-histogram/' },
          { id: 'str_9_1_6', title: 'Sliding Window Maximum', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/sliding-window-maximum/', tuf: 'https://takeuforward.org/data-structure/sliding-window-maximum/' },
          { id: 'str_9_1_7', title: 'Implement LRU Cache', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/lru-cache/', tuf: 'https://takeuforward.org/data-structure/lru-cache-implementation/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-10',
    stepNumber: 10,
    title: 'Sliding Window & Two Pointers',
    description: 'Constant window, variable window, longest substring without repeating characters',
    topics: [
      {
        topicId: 's10-t1',
        title: 'Sliding Window Patterns',
        problems: [
          { id: 'str_10_1_1', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', tuf: 'https://takeuforward.org/data-structure/length-of-longest-substring-without-any-repeating-character/' },
          { id: 'str_10_1_2', title: 'Max Consecutive Ones III', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/max-consecutive-ones-iii/', tuf: 'https://takeuforward.org/data-structure/max-consecutive-ones-iii/' },
          { id: 'str_10_1_3', title: 'Fruit Into Baskets', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/fruit-into-baskets/', tuf: 'https://takeuforward.org/data-structure/fruit-into-baskets/' },
          { id: 'str_10_1_4', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/longest-repeating-character-replacement/', tuf: 'https://takeuforward.org/data-structure/longest-repeating-character-replacement/' },
          { id: 'str_10_1_5', title: 'Minimum Window Substring', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/minimum-window-substring/', tuf: 'https://takeuforward.org/data-structure/minimum-window-substring/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-11',
    stepNumber: 11,
    title: 'Heaps & Priority Queue',
    description: 'Min-Heap, Max-Heap, Kth largest/smallest, Top K frequent elements, Median in stream',
    topics: [
      {
        topicId: 's11-t1',
        title: 'Heap Fundamentals & Advanced',
        problems: [
          { id: 'str_11_1_1', title: 'Kth Largest Element in an Array', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', tuf: 'https://takeuforward.org/data-structure/kth-largest-smallest-element-in-an-array/' },
          { id: 'str_11_1_2', title: 'Top K Frequent Elements', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/top-k-frequent-elements/', tuf: 'https://takeuforward.org/data-structure/top-k-frequent-elements/' },
          { id: 'str_11_1_3', title: 'Merge K Sorted Lists', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/merge-k-sorted-lists/', tuf: 'https://takeuforward.org/data-structure/merge-k-sorted-linked-lists/' },
          { id: 'str_11_1_4', title: 'Find Median from Data Stream', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/find-median-from-data-stream/', tuf: 'https://takeuforward.org/data-structure/find-median-from-data-stream/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-12',
    stepNumber: 12,
    title: 'Greedy Algorithms',
    description: 'Activity selection, N meetings in one room, Jump Game, Job Sequencing',
    topics: [
      {
        topicId: 's12-t1',
        title: 'Greedy Interview Patterns',
        problems: [
          { id: 'str_12_1_1', title: 'Assign Cookies', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/assign-cookies/', tuf: 'https://takeuforward.org/data-structure/assign-cookies/' },
          { id: 'str_12_1_2', title: 'Fractional Knapsack Problem', difficulty: 'Medium', leetcode: '', tuf: 'https://takeuforward.org/data-structure/fractional-knapsack-problem-greedy-approach/' },
          { id: 'str_12_1_3', title: 'N meetings in one room', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/data-structure/n-meetings-in-one-room/' },
          { id: 'str_12_1_4', title: 'Jump Game I & II', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/jump-game/', tuf: 'https://takeuforward.org/greedy/jump-game-i/' },
          { id: 'str_12_1_5', title: 'Minimum number of platforms required for railway', difficulty: 'Medium', leetcode: '', tuf: 'https://takeuforward.org/data-structure/minimum-number-of-platforms-required-for-a-railway/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-13',
    stepNumber: 13,
    title: 'Binary Trees',
    description: 'Traversals (Inorder, Preorder, Postorder, Level order), Height, Diameter, Views',
    topics: [
      {
        topicId: 's13-t1',
        title: 'Binary Tree Traversals & Properties',
        problems: [
          { id: 'str_13_1_1', title: 'Inorder, Preorder, Postorder & Level Order Traversal', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', tuf: 'https://takeuforward.org/data-structure/inorder-traversal-of-binary-tree/' },
          { id: 'str_13_1_2', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', tuf: 'https://takeuforward.org/data-structure/maximum-depth-of-a-binary-tree/' },
          { id: 'str_13_1_3', title: 'Diameter of Binary Tree', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/diameter-of-binary-tree/', tuf: 'https://takeuforward.org/data-structure/calculate-the-diameter-of-a-binary-tree/' },
          { id: 'str_13_1_4', title: 'Check for Balanced Binary Tree', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/balanced-binary-tree/', tuf: 'https://takeuforward.org/data-structure/check-if-the-binary-tree-is-balanced-binary-tree/' },
          { id: 'str_13_1_5', title: 'Lowest Common Ancestor for Two Nodes (LCA)', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', tuf: 'https://takeuforward.org/data-structure/lowest-common-ancestor-for-two-given-nodes/' },
          { id: 'str_13_1_6', title: 'Zig Zag / Spiral Traversal of Binary Tree', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/', tuf: 'https://takeuforward.org/data-structure/zig-zag-traversal-of-binary-tree/' },
          { id: 'str_13_1_7', title: 'Boundary Traversal & Top/Bottom Views', difficulty: 'Medium', leetcode: '', tuf: 'https://takeuforward.org/data-structure/boundary-traversal-of-a-binary-tree/' },
          { id: 'str_13_1_8', title: 'Right & Left View of Binary Tree', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/binary-tree-right-side-view/', tuf: 'https://takeuforward.org/data-structure/right-left-view-of-binary-tree/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-14',
    stepNumber: 14,
    title: 'Binary Search Trees (BST)',
    description: 'Search, Insert, Delete in BST, LCA in BST, Validate BST, Construct from Preorder',
    topics: [
      {
        topicId: 's14-t1',
        title: 'BST Concepts & Practice',
        problems: [
          { id: 'str_14_1_1', title: 'Search in a Binary Search Tree', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/search-in-a-binary-search-tree/', tuf: 'https://takeuforward.org/data-structure/search-in-a-binary-search-tree-bst/' },
          { id: 'str_14_1_2', title: 'Find Min and Max in BST', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/binary-search-tree/find-min-max-in-bst/' },
          { id: 'str_14_1_3', title: 'Validate Binary Search Tree', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/validate-binary-search-tree/', tuf: 'https://takeuforward.org/data-structure/check-if-a-tree-is-a-bst-or-bt-solve-with-code/' },
          { id: 'str_14_1_4', title: 'LCA in Binary Search Tree', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', tuf: 'https://takeuforward.org/data-structure/lca-in-binary-search-tree/' },
          { id: 'str_14_1_5', title: 'Kth Smallest / Largest Element in BST', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', tuf: 'https://takeuforward.org/data-structure/kth-largest-smallest-element-in-binary-search-tree/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-15',
    stepNumber: 15,
    title: 'Graphs',
    description: 'BFS, DFS, Cycle Detection, Topological Sort, Dijkstra, Bellman-Ford, Floyd Warshall, MST',
    topics: [
      {
        topicId: 's15-t1',
        title: 'Graph Traversals & Algorithms',
        problems: [
          { id: 'str_15_1_1', title: 'BFS and DFS Traversal', difficulty: 'Easy', leetcode: '', tuf: 'https://takeuforward.org/graph/breadth-first-search-bfs-level-order-traversal/' },
          { id: 'str_15_1_2', title: 'Number of Provinces (Connected Components)', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/number-of-provinces/', tuf: 'https://takeuforward.org/data-structure/number-of-provinces/' },
          { id: 'str_15_1_3', title: 'Rotten Oranges (Multi-source BFS)', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/rotting-oranges/', tuf: 'https://takeuforward.org/data-structure/rotton-oranges-min-time-to-rot-all-oranges-bfs/' },
          { id: 'str_15_1_4', title: 'Detect Cycle in Undirected & Directed Graph', difficulty: 'Medium', leetcode: '', tuf: 'https://takeuforward.org/data-structure/detect-cycle-in-an-undirected-graph-using-bfs/' },
          { id: 'str_15_1_5', title: 'Topological Sort (Kahn Algorithm)', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/course-schedule/', tuf: 'https://takeuforward.org/data-structure/topological-sort-bfs/' },
          { id: 'str_15_1_6', title: "Dijkstra's Algorithm (Shortest Path)", difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/network-delay-time/', tuf: 'https://takeuforward.org/data-structure/dijkstras-algorithm-using-priority-queue-g-32/' },
          { id: 'str_15_1_7', title: 'Disjoint Set (Union-Find by Rank / Size)', difficulty: 'Medium', leetcode: '', tuf: 'https://takeuforward.org/data-structure/disjoint-set-union-by-rank-union-by-size-path-compression-g-46/' },
          { id: 'str_15_1_8', title: "Prim's Algorithm / Kruskal's for Minimum Spanning Tree", difficulty: 'Hard', leetcode: '', tuf: 'https://takeuforward.org/data-structure/prims-algorithm-minimum-spanning-tree-c-and-java-g-45/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-16',
    stepNumber: 16,
    title: 'Dynamic Programming (DP)',
    description: '1D DP, 2D Grid DP, DP on Subsequences, DP on Strings, DP on Stocks, LIS, MCM',
    topics: [
      {
        topicId: 's16-t1',
        title: 'Core DP Mastery',
        problems: [
          { id: 'str_16_1_1', title: 'Climbing Stairs & Frog Jump', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/climbing-stairs/', tuf: 'https://takeuforward.org/data-structure/dynamic-programming-climbing-stairs/' },
          { id: 'str_16_1_2', title: 'House Robber I & II', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/house-robber/', tuf: 'https://takeuforward.org/data-structure/maximum-sum-of-non-adjacent-elements-dp-5/' },
          { id: 'str_16_1_3', title: 'Ninja Training (2D DP)', difficulty: 'Medium', leetcode: '', tuf: 'https://takeuforward.org/data-structure/dynamic-programming-ninjas-training-dp-7/' },
          { id: 'str_16_1_4', title: 'Grid Unique Paths I & II', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/unique-paths/', tuf: 'https://takeuforward.org/data-structure/grid-unique-paths-dp-on-grids-dp8/' },
          { id: 'str_16_1_5', title: '0/1 Knapsack Problem', difficulty: 'Medium', leetcode: '', tuf: 'https://takeuforward.org/data-structure/0-1-knapsack-dp-19/' },
          { id: 'str_16_1_6', title: 'Coin Change I & II', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/coin-change/', tuf: 'https://takeuforward.org/data-structure/coin-change-2-dp-22/' },
          { id: 'str_16_1_7', title: 'Longest Common Subsequence (LCS)', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/longest-common-subsequence/', tuf: 'https://takeuforward.org/data-structure/longest-common-subsequence-dp-25/' },
          { id: 'str_16_1_8', title: 'Edit Distance', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/edit-distance/', tuf: 'https://takeuforward.org/data-structure/edit-distance-dp-33/' },
          { id: 'str_16_1_9', title: 'Longest Increasing Subsequence (LIS - Binary Search O(N log N))', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/longest-increasing-subsequence/', tuf: 'https://takeuforward.org/data-structure/longest-increasing-subsequence-dp-41/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-17',
    stepNumber: 17,
    title: 'Tries',
    description: 'Prefix Tree, Insert, Search, StartsWith, Maximum XOR of two numbers',
    topics: [
      {
        topicId: 's17-t1',
        title: 'Trie Data Structure',
        problems: [
          { id: 'str_17_1_1', title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/implement-trie-prefix-tree/', tuf: 'https://takeuforward.org/data-structure/implement-trie-1/' },
          { id: 'str_17_1_2', title: 'Implement Trie II (Count Words & Prefix)', difficulty: 'Medium', leetcode: '', tuf: 'https://takeuforward.org/data-structure/implement-trie-ii/' },
          { id: 'str_17_1_3', title: 'Maximum XOR of Two Numbers in an Array', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/', tuf: 'https://takeuforward.org/data-structure/maximum-xor-of-two-numbers-in-an-array/' }
        ]
      }
    ]
  },
  {
    stepId: 'step-18',
    stepNumber: 18,
    title: 'Advanced Strings',
    description: 'KMP Algorithm, Rabin-Karp, Z-Algorithm, Longest Palindromic Substring',
    topics: [
      {
        topicId: 's18-t1',
        title: 'String Algorithms',
        problems: [
          { id: 'str_18_1_1', title: 'Longest Palindromic Substring', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/longest-palindromic-substring/', tuf: 'https://takeuforward.org/data-structure/longest-palindromic-substring/' },
          { id: 'str_18_1_2', title: 'Rabin Karp Algorithm', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/repeated-string-match/', tuf: 'https://takeuforward.org/data-structure/rabin-karp-algorithm-for-pattern-searching/' },
          { id: 'str_18_1_3', title: 'Z-Function / KMP Algorithm', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/', tuf: 'https://takeuforward.org/data-structure/kmp-algorithm-for-pattern-searching/' }
        ]
      }
    ]
  }
];
