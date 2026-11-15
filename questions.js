// Trivia bank.
//   d   = difficulty: 1 Easy, 2 Medium, 3 Hard, 4 Impossible
//   a   = answers; the FIRST one is correct (choices are shuffled at runtime)
//   alt = extra spellings accepted in "Type your answer" mode
//   nt  = "no typing": only makes sense as multiple choice
const Q = (d, c, q, a, extra = {}) => ({ d, c, q, a, ...extra });

export const QUESTIONS = [
  // ---------------- Science ----------------
  Q(1, 'Science', 'What is H₂O more commonly called?', ['Water', 'Salt', 'Hydrogen peroxide', 'Ammonia']),
  Q(1, 'Science', 'What force keeps us on the ground?', ['Gravity', 'Magnetism', 'Friction', 'Inertia']),
  Q(1, 'Science', 'Water boils at what temperature (°C) at sea level?', ['100', '90', '110', '120']),
  Q(1, 'Science', 'What gas do plants absorb from the air for photosynthesis?', ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Helium'], { alt: ['co2'] }),
  Q(1, 'Science', 'What is the largest organ of the human body?', ['Skin', 'Liver', 'Lungs', 'Brain']),
  Q(2, 'Science', 'What is the chemical symbol for gold?', ['Au', 'Ag', 'Gd', 'Go']),
  Q(2, 'Science', 'How many bones are in the adult human body?', ['206', '186', '226', '256']),
  Q(2, 'Science', 'What is the hardest natural substance?', ['Diamond', 'Quartz', 'Granite', 'Titanium']),
  Q(2, 'Science', 'What part of the cell is known as its powerhouse?', ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi body'], { alt: ['mitochondrion'] }),
  Q(2, 'Science', 'Which element has the atomic number 1?', ['Hydrogen', 'Helium', 'Oxygen', 'Carbon']),
  Q(2, 'Science', 'Which blood type is known as the universal donor?', ['O negative', 'AB positive', 'A positive', 'B negative'], { alt: ['o-', 'o neg', 'type o negative'] }),
  Q(2, 'Science', 'Sound travels fastest through which of these?', ['Steel', 'Air', 'Water', 'A vacuum'], { nt: true }),
  Q(2, 'Science', 'What is the most abundant gas in Earth\'s atmosphere?', ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Argon']),
  Q(2, 'Science', 'Which metal is liquid at room temperature?', ['Mercury', 'Lead', 'Aluminium', 'Tin']),
  Q(3, 'Science', 'What is the chemical symbol for tungsten?', ['W', 'Tu', 'Tn', 'Wo']),
  Q(3, 'Science', 'What is the SI unit of electrical resistance?', ['Ohm', 'Volt', 'Ampere', 'Watt'], { alt: ['ohms'] }),
  Q(3, 'Science', 'What is the longest bone in the human body?', ['Femur', 'Tibia', 'Humerus', 'Spine'], { alt: ['thigh bone', 'thighbone'] }),
  Q(3, 'Science', 'How many chromosomes do humans normally have?', ['46', '23', '44', '48']),
  Q(3, 'Science', 'Which element has the chemical symbol K?', ['Potassium', 'Krypton', 'Calcium', 'Phosphorus']),
  Q(3, 'Science', 'Which organ produces insulin?', ['Pancreas', 'Liver', 'Kidney', 'Stomach']),
  Q(3, 'Science', 'What does DNA stand for?', ['Deoxyribonucleic acid', 'Dinitrogen acid', 'Dual nucleic acid', 'Deoxyribose nitrate'], { nt: true }),
  Q(4, 'Science', 'What is the atomic number of gold?', ['79', '47', '82', '78']),
  Q(4, 'Science', 'What is the smallest bone in the human body?', ['Stapes', 'Incus', 'Malleus', 'Coccyx'], { alt: ['stirrup'] }),
  Q(4, 'Science', 'What is the chemical symbol for antimony?', ['Sb', 'An', 'Am', 'At']),
  Q(4, 'Science', 'Avogadro\'s number is about 6.022 × 10 to the power of…?', ['23', '22', '24', '32']),
  Q(4, 'Science', 'What is the rarest of the 8 main blood types?', ['AB negative', 'O negative', 'B negative', 'AB positive'], { alt: ['ab-', 'ab neg'] }),

  // ---------------- Space ----------------
  Q(1, 'Space', 'Which planet is known as the Red Planet?', ['Mars', 'Venus', 'Jupiter', 'Mercury']),
  Q(1, 'Space', 'What is the largest planet in our solar system?', ['Jupiter', 'Saturn', 'Neptune', 'Earth']),
  Q(1, 'Space', 'What is the name of our galaxy?', ['The Milky Way', 'Andromeda', 'Triangulum', 'Sombrero'], { alt: ['milky way galaxy'] }),
  Q(1, 'Space', 'Which planet has the most famous ring system?', ['Saturn', 'Uranus', 'Mars', 'Mercury']),
  Q(2, 'Space', 'Which planet is closest to the Sun?', ['Mercury', 'Venus', 'Mars', 'Earth']),
  Q(2, 'Space', 'Who was the first person to walk on the Moon?', ['Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'John Glenn'], { alt: ['armstrong'] }),
  Q(2, 'Space', 'Roughly how long does light from the Sun take to reach Earth?', ['8 minutes', '8 seconds', '8 hours', '8 days'], { alt: ['eight minutes', '8 min', '8'] }),
  Q(2, 'Space', 'What is the hottest planet in our solar system?', ['Venus', 'Mercury', 'Mars', 'Jupiter']),
  Q(2, 'Space', 'Who was the first human in space?', ['Yuri Gagarin', 'Neil Armstrong', 'Alan Shepard', 'Valentina Tereshkova'], { alt: ['gagarin'] }),
  Q(2, 'Space', 'In what year did humans first land on the Moon?', ['1969', '1965', '1972', '1959']),
  Q(3, 'Space', 'What is the largest moon of Saturn?', ['Titan', 'Europa', 'Ganymede', 'Enceladus']),
  Q(3, 'Space', 'What do we call a huge exploding star?', ['Supernova', 'Quasar', 'Pulsar', 'Nebula']),
  Q(3, 'Space', 'Which planet spins on its side?', ['Uranus', 'Neptune', 'Saturn', 'Venus']),
  Q(4, 'Space', 'Which planet has a day that is longer than its year?', ['Venus', 'Mercury', 'Mars', 'Neptune']),
  Q(4, 'Space', 'What is the speed of light in a vacuum, roughly, in km per second?', ['299,792', '186,282', '343,000', '150,000'], { alt: ['299792', '300000', '300,000'] }),
  Q(4, 'Space', 'What is the name of the largest volcano in the solar system?', ['Olympus Mons', 'Mauna Kea', 'Maxwell Montes', 'Elysium Mons']),

  // ---------------- Geography ----------------
  Q(1, 'Geography', 'What is the capital of Japan?', ['Tokyo', 'Kyoto', 'Osaka', 'Seoul']),
  Q(1, 'Geography', 'Which is the largest ocean on Earth?', ['Pacific', 'Atlantic', 'Indian', 'Arctic'], { alt: ['pacific ocean'] }),
  Q(1, 'Geography', 'Which country is shaped like a boot?', ['Italy', 'Greece', 'Portugal', 'Chile']),
  Q(1, 'Geography', 'How many continents are there?', ['7', '5', '6', '8'], { alt: ['seven'] }),
  Q(1, 'Geography', 'Which US state is made up entirely of islands?', ['Hawaii', 'Alaska', 'Florida', 'Rhode Island']),
  Q(2, 'Geography', 'What is the capital of Australia?', ['Canberra', 'Sydney', 'Melbourne', 'Perth']),
  Q(2, 'Geography', 'Which country has the largest population (2024)?', ['India', 'China', 'USA', 'Indonesia']),
  Q(2, 'Geography', 'What is the longest river in South America?', ['Amazon', 'Paraná', 'Orinoco', 'Magdalena'], { alt: ['amazon river'] }),
  Q(2, 'Geography', 'What is the capital of Canada?', ['Ottawa', 'Toronto', 'Vancouver', 'Montreal']),
  Q(2, 'Geography', 'Which is the largest country by area?', ['Russia', 'Canada', 'China', 'USA']),
  Q(2, 'Geography', 'Which desert is the largest hot desert in the world?', ['Sahara', 'Gobi', 'Kalahari', 'Mojave'], { alt: ['sahara desert'] }),
  Q(2, 'Geography', 'What is the capital of Egypt?', ['Cairo', 'Alexandria', 'Giza', 'Luxor']),
  Q(2, 'Geography', 'What is the smallest country in the world?', ['Vatican City', 'Monaco', 'San Marino', 'Liechtenstein'], { alt: ['vatican', 'the vatican'] }),
  Q(3, 'Geography', 'Mount Everest sits on the border of Nepal and which other country?', ['China', 'India', 'Bhutan', 'Pakistan'], { alt: ['tibet'] }),
  Q(3, 'Geography', 'What is the capital of New Zealand?', ['Wellington', 'Auckland', 'Christchurch', 'Queenstown']),
  Q(3, 'Geography', 'What is the capital of Kazakhstan?', ['Astana', 'Almaty', 'Tashkent', 'Bishkek']),
  Q(3, 'Geography', 'In which ocean is the Mariana Trench?', ['Pacific', 'Atlantic', 'Indian', 'Southern'], { alt: ['pacific ocean'] }),
  Q(3, 'Geography', 'What is the largest desert on Earth, counting cold deserts?', ['Antarctica', 'Sahara', 'Arctic', 'Gobi'], { alt: ['antarctic', 'antarctic desert'] }),
  Q(3, 'Geography', 'What is the deepest lake in the world?', ['Lake Baikal', 'Lake Superior', 'Lake Tanganyika', 'Caspian Sea'], { alt: ['baikal'] }),
  Q(3, 'Geography', 'Which country has the most natural lakes?', ['Canada', 'Russia', 'Finland', 'USA']),
  Q(4, 'Geography', 'What is the capital of Mongolia?', ['Ulaanbaatar', 'Astana', 'Bishkek', 'Hohhot'], { alt: ['ulan bator'] }),
  Q(4, 'Geography', 'What is the capital of Bhutan?', ['Thimphu', 'Kathmandu', 'Paro', 'Dhaka']),
  Q(4, 'Geography', 'What is the capital of Burkina Faso?', ['Ouagadougou', 'Bamako', 'Niamey', 'Lomé']),
  Q(4, 'Geography', 'What is the capital of Liechtenstein?', ['Vaduz', 'Schaan', 'Bern', 'Luxembourg']),
  Q(4, 'Geography', 'How many time zones does Russia have?', ['11', '9', '7', '13'], { alt: ['eleven'] }),
  Q(4, 'Geography', 'Which country has the most islands in the world?', ['Sweden', 'Indonesia', 'Philippines', 'Canada']),
  Q(4, 'Geography', 'Which letter does not appear in any US state name?', ['Q', 'Z', 'X', 'J']),

  // ---------------- History ----------------
  Q(1, 'History', 'Who was the first President of the United States?', ['George Washington', 'Abraham Lincoln', 'Thomas Jefferson', 'John Adams'], { alt: ['washington'] }),
  Q(1, 'History', 'Which ancient civilization built the pyramids of Giza?', ['Egyptians', 'Romans', 'Mayans', 'Greeks'], { alt: ['egypt', 'egyptian', 'ancient egyptians'] }),
  Q(1, 'History', 'Who painted the Mona Lisa?', ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Van Gogh'], { alt: ['da vinci', 'leonardo'] }),
  Q(1, 'History', 'Which country gifted the Statue of Liberty to the USA?', ['France', 'England', 'Spain', 'Italy']),
  Q(1, 'History', 'The Great Wall was built mainly to protect which country?', ['China', 'Japan', 'Mongolia', 'Korea']),
  Q(2, 'History', 'In what year did World War II end?', ['1945', '1939', '1918', '1950']),
  Q(2, 'History', 'The Titanic sank in which year?', ['1912', '1905', '1921', '1898']),
  Q(2, 'History', 'The Berlin Wall fell in which year?', ['1989', '1991', '1979', '1961']),
  Q(2, 'History', 'Which empire was ruled by Julius Caesar?', ['Roman', 'Ottoman', 'Persian', 'Mongol'], { alt: ['rome', 'roman empire', 'roman republic'] }),
  Q(2, 'History', 'Who invented the telephone (first US patent)?', ['Alexander Graham Bell', 'Thomas Edison', 'Nikola Tesla', 'Samuel Morse'], { alt: ['graham bell', 'bell'] }),
  Q(2, 'History', 'Who was the first woman to win a Nobel Prize?', ['Marie Curie', 'Rosalind Franklin', 'Ada Lovelace', 'Florence Nightingale'], { alt: ['curie'] }),
  Q(2, 'History', 'Which explorer\'s 1492 voyage reached the Americas?', ['Christopher Columbus', 'Ferdinand Magellan', 'Vasco da Gama', 'James Cook'], { alt: ['columbus'] }),
  Q(3, 'History', 'In what year was the Battle of Hastings?', ['1066', '1215', '1415', '966']),
  Q(3, 'History', 'Who was the first Roman emperor?', ['Augustus', 'Julius Caesar', 'Nero', 'Caligula'], { alt: ['octavian', 'caesar augustus'] }),
  Q(3, 'History', 'In what year did Constantinople fall to the Ottomans?', ['1453', '1492', '1204', '1517']),
  Q(3, 'History', 'Who painted "The Starry Night"?', ['Vincent van Gogh', 'Claude Monet', 'Pablo Picasso', 'Salvador Dalí'], { alt: ['van gogh'] }),
  Q(4, 'History', 'In what year was the Peace of Westphalia signed?', ['1648', '1618', '1713', '1555']),
  Q(4, 'History', 'Which US president served two non-consecutive terms in the 1800s?', ['Grover Cleveland', 'Benjamin Harrison', 'Chester Arthur', 'Ulysses Grant'], { alt: ['cleveland'] }),
  Q(4, 'History', 'Which British monarch reigned the longest?', ['Elizabeth II', 'Victoria', 'George III', 'Henry VIII'], { alt: ['queen elizabeth ii', 'elizabeth 2', 'queen elizabeth', 'elizabeth'] }),

  // ---------------- Animals ----------------
  Q(1, 'Animals', 'How many legs does a spider have?', ['8', '6', '10', '12'], { alt: ['eight'] }),
  Q(1, 'Animals', 'What do pandas mostly eat?', ['Bamboo', 'Fish', 'Berries', 'Insects']),
  Q(1, 'Animals', 'Which bird is known for mimicking human speech?', ['Parrot', 'Penguin', 'Owl', 'Flamingo']),
  Q(1, 'Animals', 'Which animal is known as the "Ship of the Desert"?', ['Camel', 'Horse', 'Lizard', 'Ostrich']),
  Q(1, 'Animals', 'What is the largest mammal on Earth?', ['Blue whale', 'African elephant', 'Giraffe', 'Orca']),
  Q(2, 'Animals', 'What is the fastest land animal?', ['Cheetah', 'Lion', 'Pronghorn', 'Greyhound']),
  Q(2, 'Animals', 'A group of lions is called a…', ['Pride', 'Pack', 'Herd', 'School']),
  Q(2, 'Animals', 'A baby kangaroo is called a…', ['Joey', 'Kit', 'Cub', 'Calf']),
  Q(2, 'Animals', 'Which of these is NOT a mammal?', ['Shark', 'Dolphin', 'Bat', 'Whale'], { nt: true }),
  Q(2, 'Animals', 'What gives flamingos their pink color?', ['Their diet', 'Sunlight', 'Their genes only', 'Cold water'], { nt: true }),
  Q(3, 'Animals', 'How many hearts does an octopus have?', ['3', '1', '2', '4'], { alt: ['three'] }),
  Q(3, 'Animals', 'What is a group of crows called?', ['A murder', 'A flock', 'A parliament', 'A gaggle'], { alt: ['murder'] }),
  Q(3, 'Animals', 'What is the only mammal capable of true flight?', ['Bat', 'Flying squirrel', 'Sugar glider', 'Colugo'], { alt: ['bats'] }),
  Q(4, 'Animals', 'What is the national animal of Scotland?', ['Unicorn', 'Red deer', 'Golden eagle', 'Highland cow']),
  Q(4, 'Animals', 'Which animal has the largest eyes of any animal?', ['Colossal squid', 'Blue whale', 'Ostrich', 'Giant octopus'], { alt: ['giant squid'] }),

  // ---------------- Food ----------------
  Q(1, 'Food', 'Guacamole is made mainly from which fruit?', ['Avocado', 'Lime', 'Tomato', 'Mango'], { alt: ['avocados'] }),
  Q(1, 'Food', 'Which country is famous for inventing pizza?', ['Italy', 'Greece', 'USA', 'France']),
  Q(1, 'Food', 'What fruit is dried to make raisins?', ['Grapes', 'Plums', 'Figs', 'Cherries'], { alt: ['grape'] }),
  Q(1, 'Food', 'Sushi is most associated with which country?', ['Japan', 'China', 'Korea', 'Thailand']),
  Q(2, 'Food', 'Which nut is used to make marzipan?', ['Almond', 'Peanut', 'Cashew', 'Walnut'], { alt: ['almonds'] }),
  Q(2, 'Food', 'What is the main ingredient in hummus?', ['Chickpeas', 'Lentils', 'Black beans', 'Peas'], { alt: ['chickpea', 'garbanzo', 'garbanzo beans'] }),
  Q(2, 'Food', 'What type of food is Brie?', ['Cheese', 'Bread', 'Wine', 'Sausage']),
  Q(2, 'Food', 'Kimchi is a traditional dish from which country?', ['Korea', 'Japan', 'Vietnam', 'China'], { alt: ['south korea'] }),
  Q(2, 'Food', 'What is tofu made from?', ['Soybeans', 'Rice', 'Wheat', 'Corn'], { alt: ['soy', 'soybean', 'soya', 'soy beans'] }),
  Q(3, 'Food', 'Which spice is the most expensive by weight?', ['Saffron', 'Vanilla', 'Cinnamon', 'Pepper']),
  Q(3, 'Food', 'Which country produces the most coffee?', ['Brazil', 'Colombia', 'Vietnam', 'Ethiopia']),
  Q(4, 'Food', 'What is the hottest chili pepper on record (Guinness, 2023)?', ['Pepper X', 'Carolina Reaper', 'Ghost pepper', 'Trinidad Scorpion']),

  // ---------------- Sports ----------------
  Q(1, 'Sports', 'How many players are on a soccer team on the field?', ['11', '9', '10', '12'], { alt: ['eleven'] }),
  Q(1, 'Sports', 'In which sport would you perform a slam dunk?', ['Basketball', 'Volleyball', 'Tennis', 'Baseball']),
  Q(1, 'Sports', 'How many rings are on the Olympic flag?', ['5', '4', '6', '7'], { alt: ['five'] }),
  Q(2, 'Sports', 'How often are the Summer Olympics usually held?', ['Every 4 years', 'Every 2 years', 'Every year', 'Every 5 years'], { alt: ['4 years', 'four years', '4'] }),
  Q(2, 'Sports', 'What sport uses the terms "love", "deuce" and "ace"?', ['Tennis', 'Golf', 'Cricket', 'Badminton']),
  Q(2, 'Sports', 'In bowling, what is it called when you knock down all pins on the first throw?', ['Strike', 'Spare', 'Split', 'Turkey']),
  Q(2, 'Sports', 'How many points is a touchdown worth in American football?', ['6', '3', '7', '2'], { alt: ['six'] }),
  Q(3, 'Sports', 'What is the maximum score in a single game of ten-pin bowling?', ['300', '250', '200', '360']),
  Q(3, 'Sports', 'Which country hosted the 2016 Summer Olympics?', ['Brazil', 'China', 'UK', 'Japan']),
  Q(3, 'Sports', 'How long is a marathon, in miles (to one decimal)?', ['26.2', '24.8', '28.1', '30']),
  Q(4, 'Sports', 'What is the highest possible break in snooker (without a free ball)?', ['147', '155', '140', '167']),

  // ---------------- Entertainment ----------------
  Q(1, 'Entertainment', 'What is the name of the toy cowboy in Toy Story?', ['Woody', 'Buzz', 'Jessie', 'Rex']),
  Q(1, 'Entertainment', 'In "Frozen", what is the name of the snowman?', ['Olaf', 'Sven', 'Kristoff', 'Hans']),
  Q(1, 'Entertainment', 'What is Mario\'s brother\'s name?', ['Luigi', 'Wario', 'Toad', 'Yoshi']),
  Q(1, 'Entertainment', 'What color is SpongeBob\'s best friend Patrick?', ['Pink', 'Yellow', 'Blue', 'Green']),
  Q(2, 'Entertainment', 'Which wizard school does Harry Potter attend?', ['Hogwarts', 'Durmstrang', 'Beauxbatons', 'Ilvermorny']),
  Q(2, 'Entertainment', 'Which band sang "Hey Jude"?', ['The Beatles', 'The Rolling Stones', 'Queen', 'ABBA'], { alt: ['beatles'] }),
  Q(2, 'Entertainment', 'Which superhero is also known as the "Man of Steel"?', ['Superman', 'Iron Man', 'Batman', 'Captain America']),
  Q(2, 'Entertainment', 'How many strings does a standard guitar have?', ['6', '4', '5', '8'], { alt: ['six'] }),
  Q(2, 'Entertainment', 'In The Lion King, who is Simba\'s father?', ['Mufasa', 'Scar', 'Rafiki', 'Zazu']),
  Q(2, 'Entertainment', 'Which instrument has 88 keys?', ['Piano', 'Organ', 'Accordion', 'Harp']),
  Q(3, 'Entertainment', 'Who wrote "One Hundred Years of Solitude"?', ['Gabriel García Márquez', 'Jorge Luis Borges', 'Isabel Allende', 'Pablo Neruda'], { alt: ['garcia marquez', 'marquez'] }),
  Q(3, 'Entertainment', 'Who composed the "Moonlight Sonata"?', ['Beethoven', 'Mozart', 'Bach', 'Chopin'], { alt: ['ludwig van beethoven'] }),

  // ---------------- Tech ----------------
  Q(1, 'Tech', 'Which company makes the iPhone?', ['Apple', 'Samsung', 'Google', 'Sony']),
  Q(1, 'Tech', 'What symbol is used in every email address?', ['@', '#', '&', '%'], { alt: ['at', 'at sign'] }),
  Q(1, 'Tech', 'What does "Wi-Fi" let you do?', ['Connect to a network wirelessly', 'Charge a phone', 'Print documents', 'Store files offline'], { nt: true }),
  Q(2, 'Tech', 'What does "CPU" stand for?', ['Central Processing Unit', 'Computer Personal Unit', 'Central Power Utility', 'Core Program Unit']),
  Q(2, 'Tech', 'How many bits are in a byte?', ['8', '4', '16', '10'], { alt: ['eight'] }),
  Q(2, 'Tech', 'Who co-founded Microsoft with Paul Allen?', ['Bill Gates', 'Steve Jobs', 'Larry Page', 'Mark Zuckerberg'], { alt: ['gates'] }),
  Q(2, 'Tech', 'Binary code is made up of which two digits?', ['0 and 1', '1 and 2', '0 and 9', '1 and 10'], { alt: ['1 and 0', '0 1', 'zero and one', '01'] }),
  Q(3, 'Tech', 'What does "HTML" stand for?', ['HyperText Markup Language', 'HighText Machine Language', 'Hyperlink Tool Markup Language', 'Home Tool Making Language']),
  Q(3, 'Tech', 'Which programming language was created by Guido van Rossum?', ['Python', 'Java', 'Ruby', 'C++']),
  Q(3, 'Tech', 'In what year was the first iPhone released?', ['2007', '2005', '2008', '2010']),
  Q(4, 'Tech', 'What is the binary number 101010 in decimal?', ['42', '40', '52', '38']),
  Q(4, 'Tech', 'What was the first general-purpose electronic computer (1945) called?', ['ENIAC', 'UNIVAC', 'Colossus', 'Altair']),

  // ---------------- Buildings (on theme!) ----------------
  Q(1, 'Buildings', 'In which city is the Eiffel Tower?', ['Paris', 'Lyon', 'Brussels', 'Rome']),
  Q(1, 'Buildings', 'In the UK, what is an elevator usually called?', ['A lift', 'A hoist', 'A riser', 'A climber'], { alt: ['lift'] }),
  Q(1, 'Buildings', 'The Leaning Tower is located in which Italian city?', ['Pisa', 'Rome', 'Venice', 'Florence']),
  Q(2, 'Buildings', 'What is the tallest building in the world (as of 2024)?', ['Burj Khalifa', 'Shanghai Tower', 'Empire State Building', 'Taipei 101']),
  Q(2, 'Buildings', 'Which floor number do many Western buildings skip due to superstition?', ['13', '7', '4', '11'], { alt: ['thirteen'] }),
  Q(2, 'Buildings', 'What city is the Empire State Building in?', ['New York City', 'Chicago', 'Boston', 'Philadelphia'], { alt: ['new york', 'nyc'] }),
  Q(3, 'Buildings', 'Elisha Otis is famous for inventing what elevator feature?', ['The safety brake', 'The call button', 'Elevator music', 'Automatic doors'], { alt: ['safety brake', 'brake', 'safety elevator'] }),
  Q(3, 'Buildings', 'In many East Asian buildings, which floor number is skipped because it sounds like "death"?', ['4', '8', '9', '6'], { alt: ['four'] }),
  Q(4, 'Buildings', 'How tall is the Burj Khalifa, to the nearest 10 meters?', ['830', '730', '930', '1,010'], { alt: ['828'] }),
  Q(4, 'Buildings', 'In which city did the first passenger elevator with a safety brake open, in 1857?', ['New York City', 'Chicago', 'London', 'Paris'], { alt: ['new york', 'nyc'] }),

  // ---------------- Words & Numbers ----------------
  Q(1, 'Words', 'What is the opposite of "ascend"?', ['Descend', 'Climb', 'Rise', 'Elevate']),
  Q(1, 'Words', 'How many letters are in the English alphabet?', ['26', '24', '28', '25'], { alt: ['twenty six'] }),
  Q(1, 'Words', 'How many sides does a hexagon have?', ['6', '5', '7', '8'], { alt: ['six'] }),
  Q(1, 'Words', 'Which month has the fewest days?', ['February', 'April', 'June', 'November'], { alt: ['feb'] }),
  Q(1, 'Words', 'Which word is a synonym for "happy"?', ['Joyful', 'Gloomy', 'Angry', 'Tired'], { nt: true }),
  Q(2, 'Words', 'What is 12 × 12?', ['144', '124', '132', '156']),
  Q(2, 'Words', 'What is the square root of 81?', ['9', '8', '7', '11'], { alt: ['nine'] }),
  Q(2, 'Words', 'How many minutes are in 3 hours?', ['180', '120', '160', '300']),
  Q(2, 'Words', 'What is the plural of "mouse" (the animal)?', ['Mice', 'Mouses', 'Meese', 'Mousen']),
  Q(2, 'Words', 'What is 15% of 200?', ['30', '15', '25', '35']),
  Q(3, 'Words', 'What is a word that reads the same forwards and backwards?', ['Palindrome', 'Anagram', 'Homonym', 'Acronym']),
  Q(3, 'Words', 'What is the smallest prime number?', ['2', '1', '3', '0'], { alt: ['two'] }),
  Q(3, 'Words', 'Which language has the most native speakers?', ['Mandarin Chinese', 'English', 'Spanish', 'Hindi'], { alt: ['mandarin', 'chinese'] }),
  Q(4, 'Words', 'What is the 10th digit of pi after the decimal point?', ['5', '3', '9', '8']),
  Q(4, 'Words', 'What is 17 × 23?', ['391', '381', '401', '371']),
  Q(4, 'Words', 'What is the square root of 1,764?', ['42', '38', '44', '46']),
  Q(4, 'Words', 'The fear of long words is called…', ['Hippopotomonstrosesquippedaliophobia', 'Logophobia', 'Verbophobia', 'Sesquiphobia'], { nt: true }),
];

export const CATEGORIES = ['All', ...Array.from(new Set(QUESTIONS.map((q) => q.c)))];

// Difficulty modes.
//   tiers   = question difficulties used first; fill = used if there aren't enough
//   penalty = levels lost on a wrong answer
//   roof    = how many floors tall the tower is (display only)
export const MODES = {
  easy:       { label: 'Easy',       emoji: '🟢', tiers: [1], fill: [2],    penalty: 0, roof: 100,  roofName: '100',        blurb: 'Easy questions, no penalty for wrong answers. Roof: 100 floors.' },
  medium:     { label: 'Medium',     emoji: '🟡', tiers: [2], fill: [1, 3], penalty: 0, roof: 1e3,  roofName: '1,000',      blurb: 'Trickier questions. Roof: 1,000 floors.' },
  hard:       { label: 'Hard',       emoji: '🔴', tiers: [3], fill: [2, 4], penalty: 1, roof: 1e6,  roofName: '1 MILLION',  blurb: 'Hard questions. A wrong answer drops you a level. Roof: 1,000,000 floors.' },
  impossible: { label: 'Impossible', emoji: '💀', tiers: [4], fill: [3],    penalty: 2, roof: 1e15, roofName: '1 KRILLION', blurb: 'Brutal questions. A wrong answer drops you TWO levels. Roof: 1 KRILLION floors.' },
};

// ---------- Typed-answer checking ----------
export function normalize(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9.@\-+ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(the|a|an) /, '');
}
function lev(a, b) {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0]; dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
}
// True if `input` matches any accepted answer (small typos forgiven, numbers must be exact).
export function checkTyped(input, accepted) {
  const g = normalize(input);
  if (!g) return false;
  return accepted.some((ans) => {
    const t = normalize(ans);
    if (g === t || g.replace(/,/g, '') === t.replace(/,/g, '')) return true;
    if (/^[\d.,]+$/.test(t)) return false;
    const allow = t.length >= 12 ? 2 : t.length >= 5 ? 1 : 0;
    return lev(g, t) <= allow;
  });
}
