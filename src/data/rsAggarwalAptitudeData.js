/**
 * R.S. Aggarwal Quantitative Aptitude Curriculum
 * Sourced directly from R.S. Aggarwal Quantitative Aptitude Book Index:
 * SECTION-I : ARITHMETICAL ABILITY (Chapters 1 to 35, Pages 1–883)
 * SECTION-II : DATA INTERPRETATION (Chapters 36 to 39, Pages 885–952)
 */

export const RS_AGGARWAL_SECTIONS = [
  {
    id: 'section-1',
    name: 'Section I: Arithmetical Ability',
    pages: '1–883',
    description: 'Foundational quantitative aptitude, numbers, arithmetic, commercial math, and geometry.',
    chapters: [
      { id: 'rs_1', chapterNo: 1, title: 'Number System', pages: '3–50', formulas: 'Divisibility rules, unit digit calculation, remainders theorem, test of primes.' },
      { id: 'rs_2', chapterNo: 2, title: 'H.C.F. and L.C.M. of Numbers', pages: '51–68', formulas: 'Product of two numbers = HCF × LCM; Fractions HCF = HCF of Numerators / LCM of Denominators.' },
      { id: 'rs_3', chapterNo: 3, title: 'Decimal Fractions', pages: '69–94', formulas: 'Recurring decimals conversion to vulgar fractions: 0.bar(p) = p/9.' },
      { id: 'rs_4', chapterNo: 4, title: 'Simplification', pages: '95–179', formulas: 'VBODMAS Rule: Vinculum, Brackets, Of, Division, Multiplication, Addition, Subtraction.' },
      { id: 'rs_5', chapterNo: 5, title: 'Square Roots and Cube Roots', pages: '180–205', formulas: 'Last digit pattern of squares: 1, 4, 9, 6, 5, 6, 9, 4, 1, 0; Division method.' },
      { id: 'rs_6', chapterNo: 6, title: 'Average', pages: '206–239', formulas: 'Average = Sum of Observations / Number of Observations; Weighted Avg = (n1*A1 + n2*A2)/(n1+n2).' },
      { id: 'rs_7', chapterNo: 7, title: 'Problems on Numbers', pages: '240–263', formulas: 'Algebraic equation formulation from verbal problem statements.' },
      { id: 'rs_8', chapterNo: 8, title: 'Problems on Ages', pages: '264–277', formulas: 'If present age is x, age n years ago was (x-n) and after n years will be (x+n).' },
      { id: 'rs_9', chapterNo: 9, title: 'Surds and Indices', pages: '278–296', formulas: 'a^m × a^n = a^(m+n); (a^m)^n = a^(mn); Rationalisation of surds.' },
      { id: 'rs_10', chapterNo: 10, title: 'Logarithms', pages: '297–307', formulas: 'log(ab) = log a + log b; log(a/b) = log a - log b; log(a^k) = k log a; Change of base.' },
      { id: 'rs_11', chapterNo: 11, title: 'Percentage', pages: '308–373', formulas: 'Fraction to % shortcuts (1/2=50%, 1/3=33.33%, 1/7=14.28%); Successive % change: a + b + (ab/100).' },
      { id: 'rs_12', chapterNo: 12, title: 'Profit and Loss', pages: '374–425', formulas: 'Gain% = (Gain/CP)*100; SP = CP*(100+Gain%)/100; Marked Price & Discount: MP*(1 - D/100) = SP.' },
      { id: 'rs_13', chapterNo: 13, title: 'Ratio and Proportion', pages: '426–475', formulas: 'Compounded ratio, Duplicate ratio, Fourth proportional (a:b = c:d => ad = bc).' },
      { id: 'rs_14', chapterNo: 14, title: 'Partnership', pages: '476–492', formulas: 'Ratio of Profit = (Investment1 × Time1) : (Investment2 × Time2).' },
      { id: 'rs_15', chapterNo: 15, title: 'Chain Rule', pages: '493–509', formulas: '(M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2.' },
      { id: 'rs_16', chapterNo: 16, title: 'Pipes and Cisterns', pages: '510–525', formulas: 'Inlet pipe fills 1/x in 1 hr; Outlet pipe empties 1/y in 1 hr; Net part = 1/x - 1/y.' },
      { id: 'rs_17', chapterNo: 17, title: 'Time and Work', pages: '526–561', formulas: 'Total Work = Efficiency × Time; A does work in x days, 1 day work = 1/x; Together = (xy)/(x+y).' },
      { id: 'rs_18', chapterNo: 18, title: 'Time and Distance', pages: '562–599', formulas: 'Speed = Distance / Time; km/hr to m/s: multiply by 5/18; Average Speed = 2xy/(x+y).' },
      { id: 'rs_19', chapterNo: 19, title: 'Boats and Streams', pages: '600–611', formulas: 'Downstream speed u = B + S; Upstream speed v = B - S; Boat Speed B = (u+v)/2; Stream S = (u-v)/2.' },
      { id: 'rs_20', chapterNo: 20, title: 'Problems on Trains', pages: '612–632', formulas: 'Time to cross pole = Train length / Speed; Relative speed when opposite = S1 + S2; Same dir = S1 - S2.' },
      { id: 'rs_21', chapterNo: 21, title: 'Alligation or Mixture', pages: '633–640', formulas: '(Quantity of Cheaper) / (Quantity of Dearer) = (Price of Dearer - Mean Price) / (Mean Price - Price of Cheaper).' },
      { id: 'rs_22', chapterNo: 22, title: 'Simple Interest', pages: '641–662', formulas: 'SI = (P × R × T) / 100; Amount A = P + SI = P(1 + RT/100).' },
      { id: 'rs_23', chapterNo: 23, title: 'Compound Interest', pages: '663–687', formulas: 'A = P(1 + R/100)^n; CI for 2 yrs difference with SI = P(R/100)^2.' },
      { id: 'rs_24', chapterNo: 24, title: 'Area', pages: '688–765', formulas: 'Triangle, Rectangle, Square, Rhombus, Trapezium, Circle area = pi*r^2, Heron formula.' },
      { id: 'rs_25', chapterNo: 25, title: 'Volume and Surface Area', pages: '766–813', formulas: 'Cube, Cuboid, Cylinder (pi*r^2*h), Cone (1/3*pi*r^2*h), Sphere (4/3*pi*r^3).' },
      { id: 'rs_26', chapterNo: 26, title: 'Races and Games of Skill', pages: '814–818', formulas: 'A beats B by x meters or t seconds => B covers x meters in t seconds.' },
      { id: 'rs_27', chapterNo: 27, title: 'Calendar', pages: '819–822', formulas: 'Odd days: Ordinary year has 1 odd day, Leap year has 2 odd days; 100 years has 5 odd days.' },
      { id: 'rs_28', chapterNo: 28, title: 'Clocks', pages: '823–833', formulas: 'Angle theta = |(30H - (11/2)M)|; Minute hand gains 55 minutes over hour hand in 60 mins.' },
      { id: 'rs_29', chapterNo: 29, title: 'Stocks and Shares', pages: '834–840', formulas: 'Face value, Market value, Dividend = (Dividend% × Face Value); Yield% = (Dividend/MV)*100.' },
      { id: 'rs_30', chapterNo: 30, title: 'Permutations and Combinations', pages: '841–849', formulas: 'nPr = n! / (n-r)!; nCr = n! / (r! × (n-r)!); Circular permutation = (n-1)!.' },
      { id: 'rs_31', chapterNo: 31, title: 'Probability', pages: '850–860', formulas: 'P(E) = n(E)/n(S); Cards (52 cards, 4 suits), Dice throws, Coins, Independent events.' },
      { id: 'rs_32', chapterNo: 32, title: 'True Discount', pages: '861–865', formulas: 'PW = (Amount × 100) / (100 + R×T); TD = (PW × R × T) / 100.' },
      { id: 'rs_33', chapterNo: 33, title: "Banker's Discount", pages: '866–869', formulas: "BD = (Amount × R × T) / 100; Banker's Gain BG = BD - TD = (TD × R × T) / 100." },
      { id: 'rs_34', chapterNo: 34, title: 'Heights and Distances', pages: '870–876', formulas: 'Trigonometric ratios: sin, cos, tan 30 (1/sqrt(3)), 45 (1), 60 (sqrt(3)); Angles of elevation/depression.' },
      { id: 'rs_35', chapterNo: 35, title: 'Odd Man Out and Series', pages: '877–883', formulas: 'Arithmetic, Geometric, Fibonacci, Prime number and Square/Cube pattern identification.' }
    ]
  },
  {
    id: 'section-2',
    name: 'Section II: Data Interpretation',
    pages: '885–952',
    description: 'Data Interpretation sets tested heavily in campus placement aptitude rounds.',
    chapters: [
      { id: 'rs_36', chapterNo: 36, title: 'Tabulation', pages: '887–904', formulas: 'Cross-tabulation extraction, % share, row-wise growth, average computation.' },
      { id: 'rs_37', chapterNo: 37, title: 'Bar Graphs', pages: '905–922', formulas: 'Comparative multi-bar analysis, percentage change: ((Final - Initial)/Initial) × 100.' },
      { id: 'rs_38', chapterNo: 38, title: 'Pie Chart', pages: '923–936', formulas: 'Central angle = (Component value / Total value) × 360°; 1% corresponds to 3.6 degrees.' },
      { id: 'rs_39', chapterNo: 39, title: 'Line Graphs', pages: '937–952', formulas: 'Trend slopes, maximum rate of increase/decrease, year-on-year CAGR approximation.' }
    ]
  }
];
