// Rarity mode prompts.
// Each list is roughly ordered from most common to least common answer. That order is
// used as a starting guess for how popular an answer is, until real players' answers
// (stored in Supabase) take over.
import { normalize } from './questions.js?v=11';

const P = (id, emoji, text, items) => ({ id, emoji, text, items: items.split('|').map((s) => s.trim()).filter(Boolean) });

export const PROMPTS = [
  P('fruit', '🍎', 'Name a fruit',
    'apple|banana|orange|strawberry|grape|mango|pineapple|watermelon|blueberry|peach|pear|cherry|kiwi|lemon|raspberry|lime|plum|coconut|pomegranate|papaya|grapefruit|blackberry|apricot|cantaloupe|honeydew|tangerine|nectarine|fig|avocado|passion fruit|dragon fruit|guava|lychee|cranberry|clementine|mandarin|date|persimmon|starfruit|jackfruit|durian|gooseberry|elderberry|mulberry|boysenberry|quince|kumquat|rambutan|mangosteen|plantain|tomato|olive|currant|huckleberry|cloudberry|loganberry|yuzu|pomelo|ugli fruit|soursop|cherimoya|feijoa|salak|longan|tamarind|acai|goji berry|lingonberry|jujube|medlar|pawpaw|sapodilla|breadfruit|ackee|horned melon|miracle fruit|buddhas hand|blood orange|cactus pear|prickly pear|crabapple|sloe|bilberry|marionberry|physalis|kiwano|loquat|carambola|calamansi|bergamot|citron|finger lime|sugar apple|noni|jabuticaba|pitaya|santol|mamey'),
  P('vegetable', '🥕', 'Name a vegetable',
    'carrot|broccoli|potato|lettuce|tomato|cucumber|onion|spinach|corn|pepper|celery|cabbage|cauliflower|peas|green beans|zucchini|garlic|sweet potato|kale|asparagus|mushroom|eggplant|pumpkin|radish|beet|brussels sprouts|squash|artichoke|leek|turnip|bok choy|okra|parsnip|arugula|bell pepper|jalapeno|yam|chard|collard greens|rutabaga|fennel|kohlrabi|shallot|scallion|watercress|endive|radicchio|daikon|jicama|bamboo shoots|bean sprouts|snow peas|edamame|lima beans|butternut squash|acorn squash|spaghetti squash|chayote|taro|cassava|celeriac|horseradish|ginger|water chestnut|lotus root|mustard greens|dandelion greens|fiddlehead|romanesco|salsify|sunchoke|tomatillo|okra|nopales|kelp|seaweed|microgreens|sorrel|purslane|broccolini|rapini|napa cabbage|red cabbage|iceberg lettuce|romaine|chicory|wasabi|burdock|samphire|cardoon'),
  P('ocean', '🐙', 'Name an animal that lives in the ocean',
    'shark|whale|dolphin|octopus|jellyfish|starfish|crab|seal|turtle|squid|lobster|clownfish|stingray|shrimp|seahorse|orca|sea lion|walrus|eel|tuna|sea urchin|coral|manatee|swordfish|puffer fish|clam|oyster|mussel|krill|blue whale|narwhal|beluga|humpback whale|hammerhead shark|great white shark|manta ray|barracuda|anglerfish|sardine|salmon|cod|mackerel|anchovy|herring|halibut|flounder|marlin|sea otter|sea cucumber|sea anemone|barnacle|nudibranch|hermit crab|cuttlefish|nautilus|plankton|sponge|lionfish|moray eel|grouper|snapper|sunfish|parrotfish|angelfish|triggerfish|tang|sea snake|dugong|penguin|albatross|pelican|sperm whale|gray whale|whale shark|tiger shark|bull shark|mako shark|basking shark|sawfish|blobfish|goblin shark|vampire squid|giant squid|colossal squid|sea spider|sea slug|sea butterfly|leafy sea dragon|flying fish|oarfish|lanternfish|viperfish|gulper eel|frilled shark|coelacanth|horseshoe crab|king crab|spider crab|mantis shrimp|scallop|conch|abalone|limpet'),
  P('europe', '🇪🇺', 'Name a country in Europe',
    'france|germany|italy|spain|united kingdom|england|portugal|greece|netherlands|sweden|norway|switzerland|ireland|poland|russia|ukraine|belgium|austria|denmark|finland|iceland|scotland|wales|czech republic|hungary|croatia|romania|turkey|serbia|bulgaria|slovakia|slovenia|lithuania|latvia|estonia|belarus|bosnia and herzegovina|albania|north macedonia|montenegro|moldova|luxembourg|monaco|malta|cyprus|andorra|liechtenstein|san marino|vatican city|kosovo|northern ireland|georgia|armenia|azerbaijan|kazakhstan'),
  P('africa', '🌍', 'Name a country in Africa',
    'egypt|south africa|nigeria|kenya|morocco|ethiopia|ghana|madagascar|algeria|tanzania|uganda|zimbabwe|tunisia|libya|sudan|somalia|senegal|cameroon|rwanda|congo|democratic republic of the congo|angola|mozambique|namibia|botswana|zambia|mali|niger|chad|ivory coast|liberia|sierra leone|guinea|burkina faso|benin|togo|gabon|malawi|eritrea|djibouti|south sudan|mauritania|central african republic|equatorial guinea|lesotho|eswatini|burundi|gambia|guinea-bissau|cape verde|comoros|mauritius|seychelles|sao tome and principe'),
  P('states', '🇺🇸', 'Name a US state',
    'california|texas|florida|new york|hawaii|alaska|washington|arizona|colorado|nevada|ohio|georgia|michigan|illinois|oregon|pennsylvania|new jersey|massachusetts|north carolina|virginia|utah|tennessee|louisiana|kentucky|alabama|minnesota|wisconsin|indiana|missouri|maryland|south carolina|oklahoma|kansas|iowa|arkansas|mississippi|connecticut|maine|vermont|new hampshire|idaho|montana|wyoming|nebraska|new mexico|west virginia|delaware|rhode island|north dakota|south dakota'),
  P('color', '🎨', 'Name a color',
    'red|blue|green|yellow|purple|orange|pink|black|white|brown|gray|teal|turquoise|violet|cyan|magenta|indigo|gold|silver|maroon|navy|beige|lavender|lime|olive|peach|coral|crimson|tan|mint|burgundy|salmon|scarlet|ivory|aqua|cream|khaki|amber|charcoal|emerald|ruby|sapphire|mauve|lilac|periwinkle|chartreuse|fuchsia|plum|rust|mustard|ochre|sepia|taupe|vermilion|cerulean|cobalt|azure|jade|sage|mahogany|chestnut|bronze|copper|champagne|eggshell|sienna|umber|puce|celadon|aquamarine|cyan|lemon|cherry|raspberry|tangerine|apricot|sand|slate|pewter|ebony|onyx|pearl|seafoam|denim|cornflower|marigold|saffron|heliotrope|wisteria|orchid|zaffre|gamboge|falu red|smaragdine|glaucous|wenge|xanadu'),
  P('dog', '🐶', 'Name a dog breed',
    'golden retriever|labrador|german shepherd|poodle|bulldog|beagle|chihuahua|husky|pug|dachshund|rottweiler|corgi|boxer|shih tzu|pomeranian|border collie|great dane|yorkshire terrier|french bulldog|doberman|cocker spaniel|dalmatian|maltese|chow chow|bichon frise|shiba inu|samoyed|saint bernard|bernese mountain dog|australian shepherd|pit bull|greyhound|bloodhound|basset hound|jack russell terrier|newfoundland|akita|alaskan malamute|cavalier king charles spaniel|schnauzer|whippet|weimaraner|vizsla|boston terrier|collie|sheepdog|mastiff|shar pei|papillon|lhasa apso|havanese|afghan hound|bull terrier|scottish terrier|west highland terrier|irish setter|english setter|pointer|springer spaniel|cane corso|rhodesian ridgeback|basenji|saluki|borzoi|keeshond|komondor|puli|xoloitzcuintli|leonberger|tibetan mastiff|airedale|bedlington terrier|norwich terrier|otterhound|catahoula|plott hound|coonhound|lagotto romagnolo|kooikerhondje|azawakh|mudi|stabyhoun|thai ridgeback|chinook|dandie dinmont terrier|sloughi|bergamasco'),
  P('sport', '⚽', 'Name a sport',
    'soccer|basketball|football|baseball|tennis|swimming|golf|hockey|volleyball|boxing|running|cricket|rugby|skiing|snowboarding|badminton|table tennis|cycling|gymnastics|wrestling|surfing|skateboarding|bowling|lacrosse|softball|karate|fencing|archery|rowing|sailing|diving|track and field|figure skating|ice skating|martial arts|judo|taekwondo|water polo|handball|climbing|rock climbing|polo|equestrian|triathlon|marathon|canoeing|kayaking|squash|racquetball|pickleball|curling|bobsled|luge|skeleton|biathlon|weightlifting|powerlifting|darts|snooker|billiards|ultimate frisbee|disc golf|dodgeball|kickball|paintball|motocross|nascar|formula 1|mma|sumo|kendo|hurling|gaelic football|australian rules football|sepak takraw|kabaddi|jai alai|bandy|korfball|netball|floorball|underwater hockey|cheese rolling|chess boxing|quidditch|parkour|bouldering|canyoning|orienteering|pentathlon|decathlon|heptathlon|bossaball|teqball|footvolley|hurdles|pole vault|shot put|javelin|high jump|long jump'),
  P('instrument', '🎸', 'Name a musical instrument',
    'guitar|piano|drums|violin|flute|trumpet|saxophone|cello|clarinet|bass|harp|ukulele|trombone|keyboard|harmonica|tuba|banjo|accordion|xylophone|oboe|french horn|viola|tambourine|triangle|organ|bagpipes|mandolin|recorder|bassoon|double bass|electric guitar|synthesizer|cymbal|snare drum|bongos|maracas|glockenspiel|marimba|piccolo|harpsichord|sitar|didgeridoo|kazoo|steel drum|timpani|cowbell|castanets|djembe|tabla|bell|gong|ocarina|lute|zither|theremin|cajon|vibraphone|euphonium|flugelhorn|sousaphone|bugle|pan flute|shamisen|koto|erhu|balalaika|bouzouki|dulcimer|hurdy gurdy|kalimba|mbira|oud|santoor|sarangi|shakuhachi|tin whistle|bodhran|washboard|jaw harp|melodica|celesta|contrabassoon|cornet|banjolele|charango|guzheng|pipa|hang drum|handpan|udu|berimbau|sackbut|crumhorn|serpent|nyckelharpa|kora|duduk|hulusi'),
  P('body', '🦴', 'Name a part of the body',
    'hand|head|arm|leg|foot|eye|nose|mouth|ear|heart|brain|finger|toe|knee|elbow|shoulder|stomach|neck|hair|teeth|tongue|lips|chin|back|chest|hip|ankle|wrist|thumb|lungs|liver|kidney|skin|bone|skull|spine|ribs|forehead|cheek|eyebrow|eyelash|nail|belly button|thigh|calf|shin|heel|palm|knuckle|jaw|throat|muscle|blood|intestines|bladder|pancreas|spleen|gallbladder|appendix|tonsils|esophagus|uvula|collarbone|shoulder blade|sternum|pelvis|femur|tibia|fibula|humerus|radius|ulna|patella|cornea|retina|iris|pupil|eardrum|cochlea|diaphragm|thyroid|larynx|trachea|aorta|vein|artery|nerve|tendon|ligament|cartilage|armpit|eyelid|nostril|earlobe|temple|nape|philtrum|glabella|hallux|lunula|clavicle|scapula|coccyx|stapes|hippocampus|cerebellum|medulla'),
  P('topping', '🍕', 'Name a pizza topping',
    'pepperoni|cheese|mushrooms|sausage|onions|olives|bacon|pineapple|ham|green peppers|chicken|spinach|tomatoes|jalapenos|mozzarella|beef|basil|anchovies|garlic|bell peppers|parmesan|meatball|feta|salami|artichoke|broccoli|red onion|black olives|bbq chicken|buffalo chicken|prosciutto|arugula|ricotta|goat cheese|sun dried tomatoes|eggplant|zucchini|corn|shrimp|pesto|banana peppers|capers|egg|potato|truffle|figs|pear|gorgonzola|chorizo|pulled pork|steak|tuna|salmon|clams|squid|kale|cauliflower|sweet potato|hot honey|oregano|chili flakes|ranch|bbq sauce|alfredo|mac and cheese|french fries|taco meat|jalapeno poppers|pickles|kimchi|paneer|tandoori chicken|nduja|soppressata|calabrese|guanciale|lardo|speck|bresaola|burrata|stracciatella|taleggio|fontina|provolone|smoked gouda|brie|blue cheese|cheddar|duck|lamb|venison|caviar|lobster|crab'),
  P('bird', '🐦', 'Name a bird',
    'eagle|parrot|penguin|owl|robin|flamingo|crow|pigeon|hawk|duck|chicken|swan|ostrich|peacock|hummingbird|blue jay|cardinal|seagull|sparrow|toucan|turkey|goose|falcon|pelican|woodpecker|vulture|crane|stork|heron|raven|canary|parakeet|magpie|finch|emu|kiwi|dove|swallow|kingfisher|cockatoo|macaw|albatross|condor|puffin|roadrunner|bald eagle|blackbird|starling|wren|mockingbird|oriole|bluebird|warbler|quail|pheasant|partridge|grouse|osprey|kestrel|kite|harrier|sandpiper|plover|egret|ibis|spoonbill|cormorant|loon|grebe|tern|gannet|booby|frigatebird|petrel|shearwater|lyrebird|kookaburra|cassowary|rhea|kakapo|hoatzin|shoebill|secretary bird|hornbill|bee-eater|roller|hoopoe|nightjar|swift|treecreeper|nuthatch|chickadee|titmouse|junco|towhee|grackle|cowbird|bobolink|meadowlark|tanager|waxwing|shrike|vireo|dipper|ptarmigan|capercaillie'),
  P('insect', '🐞', 'Name an insect or bug',
    'ant|bee|butterfly|spider|fly|mosquito|ladybug|beetle|grasshopper|cockroach|dragonfly|moth|wasp|cricket|caterpillar|firefly|termite|flea|tick|centipede|scorpion|praying mantis|stick insect|bumblebee|hornet|gnat|louse|bed bug|earwig|silverfish|millipede|aphid|cicada|weevil|dung beetle|stink bug|horsefly|fruit fly|house fly|katydid|locust|water strider|walking stick|leaf insect|lacewing|mayfly|damselfly|caddisfly|stonefly|scarab|stag beetle|rhinoceros beetle|hercules beetle|goliath beetle|firebug|assassin bug|thrips|mealybug|scale insect|leafhopper|treehopper|froghopper|spittlebug|antlion|mantisfly|snakefly|scorpionfly|bot fly|tsetse fly|sawfly|velvet ant|cuckoo wasp|tarantula hawk|ichneumon wasp|bullet ant|army ant|leafcutter ant|carpenter ant|fire ant|harvestman|mite|chigger|springtail|bristletail|booklouse|webspinner|cockchafer|june bug|click beetle|glowworm|mole cricket|cave cricket|weta'),
  P('tree', '🌳', 'Name a kind of tree',
    'oak|pine|maple|palm|birch|apple|willow|cherry|redwood|christmas tree|spruce|fir|cedar|elm|ash|bamboo|banana|coconut|orange|lemon|sequoia|cypress|magnolia|dogwood|aspen|poplar|cottonwood|sycamore|beech|walnut|hickory|chestnut|olive|fig|eucalyptus|baobab|juniper|hemlock|larch|yew|holly|alder|hawthorn|linden|mahogany|teak|ebony|rosewood|acacia|mesquite|joshua tree|banyan|mangrove|jacaranda|ginkgo|tamarind|neem|sandalwood|cork oak|sweetgum|tulip tree|catalpa|locust|mulberry|persimmon|pawpaw|buckeye|horse chestnut|rowan|sassafras|tupelo|bald cypress|monkey puzzle|dragon blood tree|bristlecone pine|wollemi pine|kauri|rubber tree|cacao|cinnamon|nutmeg|clove|kapok|ceiba|balsa|lignum vitae|ironwood|hornbeam|hackberry|osage orange|paulownia|empress tree|araucaria|podocarpus|cycad|tree fern|dragon tree|quiver tree|bottle tree'),
  P('mammal', '🦁', 'Name a mammal',
    'dog|cat|lion|elephant|tiger|bear|horse|cow|monkey|giraffe|whale|dolphin|human|wolf|rabbit|mouse|pig|zebra|kangaroo|panda|fox|deer|gorilla|sheep|goat|bat|squirrel|koala|cheetah|hippo|rhino|leopard|camel|otter|raccoon|hamster|chimpanzee|polar bear|seal|walrus|moose|beaver|skunk|hedgehog|sloth|platypus|llama|alpaca|bison|buffalo|donkey|jaguar|hyena|meerkat|porcupine|armadillo|opossum|lemur|orangutan|baboon|antelope|gazelle|mole|ferret|weasel|badger|chipmunk|guinea pig|rat|lynx|cougar|wombat|wallaby|tapir|anteater|aardvark|pangolin|okapi|manatee|narwhal|capybara|chinchilla|gibbon|mandrill|tarsier|aye-aye|fossa|quokka|numbat|echidna|dugong|wolverine|marten|mink|ermine|caracal|serval|ocelot|binturong|kinkajou|coati|dik-dik|saiga|markhor|takin|pika|vicuna|guanaco|bongo|kudu|gerenuk|solenodon|desman|hyrax|colugo'),
  P('cheese', '🧀', 'Name a type of cheese',
    'cheddar|mozzarella|swiss|parmesan|brie|american|provolone|gouda|feta|blue cheese|pepper jack|monterey jack|cream cheese|ricotta|goat cheese|colby|camembert|gruyere|havarti|muenster|cottage cheese|string cheese|halloumi|burrata|mascarpone|manchego|gorgonzola|pecorino|asiago|roquefort|stilton|emmental|fontina|edam|paneer|queso fresco|cotija|limburger|jarlsberg|romano|wensleydale|red leicester|double gloucester|raclette|taleggio|comte|reblochon|epoisses|munster|boursin|port salut|bel paese|caciocavallo|scamorza|stracchino|robiola|grana padano|leerdammer|maasdam|tilsit|cambozola|danish blue|cashel blue|caerphilly|lancashire|cheshire|sage derby|shropshire blue|oaxaca|chihuahua|queso blanco|anejo|mimolette|morbier|tomme|vacherin|beaufort|abondance|mont d or|brillat savarin|chaource|langres|maroilles|pont l eveque|livarot|valencay|crottin|banon|casu marzu|bryndza|oscypek|kashkaval|labneh|chhena|nabulsi|akkawi|kasseri|graviera|kefalotyri|mizithra|manouri|gamalost|brunost'),
  P('language', '🗣️', 'Name a language',
    'english|spanish|french|chinese|mandarin|german|japanese|italian|russian|arabic|portuguese|korean|hindi|dutch|greek|latin|swedish|turkish|polish|hebrew|cantonese|vietnamese|thai|norwegian|danish|finnish|irish|welsh|bengali|urdu|punjabi|tagalog|filipino|indonesian|malay|swahili|persian|farsi|ukrainian|czech|hungarian|romanian|tamil|telugu|marathi|gujarati|kannada|malayalam|nepali|sinhala|burmese|khmer|lao|mongolian|tibetan|uzbek|kazakh|georgian|armenian|azerbaijani|albanian|serbian|croatian|bosnian|slovak|slovenian|bulgarian|macedonian|lithuanian|latvian|estonian|icelandic|catalan|basque|galician|scottish gaelic|breton|maltese|yiddish|esperanto|klingon|sanskrit|amharic|somali|yoruba|igbo|hausa|zulu|xhosa|afrikaans|shona|kinyarwanda|malagasy|hawaiian|maori|samoan|tongan|fijian|quechua|guarani|nahuatl|cherokee|navajo|inuktitut|greenlandic|sami|faroese|frisian|luxembourgish|romansh|occitan|sardinian|corsican|ladino|aramaic|coptic|tok pisin|bislama|sign language'),
  P('flower', '🌸', 'Name a flower',
    'rose|tulip|sunflower|daisy|lily|orchid|daffodil|lavender|carnation|dandelion|lilac|hibiscus|poppy|violet|peony|marigold|jasmine|iris|cherry blossom|lotus|chrysanthemum|hydrangea|magnolia|daylily|pansy|petunia|geranium|zinnia|dahlia|gardenia|camellia|azalea|begonia|bluebell|buttercup|clover|cosmos|crocus|forget-me-not|foxglove|freesia|gladiolus|honeysuckle|hyacinth|lily of the valley|morning glory|snapdragon|sweet pea|wisteria|amaryllis|anemone|aster|bougainvillea|calla lily|columbine|cornflower|delphinium|edelweiss|gerbera|heather|hollyhock|impatiens|larkspur|lupine|mimosa|nasturtium|oleander|periwinkle|plumeria|primrose|protea|ranunculus|rhododendron|salvia|snowdrop|statice|stephanotis|thistle|verbena|water lily|yarrow|bird of paradise|bleeding heart|black-eyed susan|coneflower|echinacea|gazania|lantana|lisianthus|alstroemeria|anthurium|bromeliad|clematis|corpse flower|rafflesia|ghost orchid|jade vine|kadupul|middlemist red|gentian|saxifrage|trillium'),
  P('vehicle', '🚗', 'Name a way to get around (a vehicle)',
    'car|bike|bus|train|airplane|boat|truck|motorcycle|helicopter|taxi|subway|scooter|skateboard|ship|van|tram|rocket|jeep|ambulance|fire truck|police car|tractor|bicycle|limousine|minivan|suv|pickup truck|golf cart|canoe|kayak|sailboat|yacht|ferry|submarine|jet ski|hot air balloon|blimp|glider|jet|cable car|gondola|monorail|trolley|segway|hoverboard|unicycle|tricycle|tandem bicycle|rickshaw|tuk tuk|horse|camel|elephant|sled|sleigh|snowmobile|snowboard|skis|roller skates|ice skates|wagon|carriage|stagecoach|chariot|go kart|dune buggy|atv|quad bike|moped|forklift|bulldozer|excavator|crane|tank|hovercraft|zeppelin|space shuttle|spaceship|paddleboard|raft|pedal boat|houseboat|cruise ship|tugboat|catamaran|longboat|zipline|elevator|escalator|funicular|chairlift|maglev|bullet train|pogo stick|jetpack|bobsled|dog sled|zorb|paraglider|hang glider|parachute|wingsuit'),
  P('element', '⚗️', 'Name a chemical element',
    'oxygen|hydrogen|carbon|gold|iron|helium|nitrogen|silver|copper|sodium|calcium|chlorine|uranium|aluminum|neon|lead|zinc|mercury|potassium|platinum|lithium|magnesium|sulfur|silicon|titanium|phosphorus|tin|nickel|plutonium|fluorine|argon|iodine|cobalt|radium|chromium|tungsten|boron|krypton|xenon|radon|manganese|beryllium|bromine|arsenic|cesium|francium|polonium|bismuth|barium|strontium|gallium|germanium|selenium|rubidium|zirconium|molybdenum|palladium|cadmium|indium|antimony|tellurium|lanthanum|cerium|neodymium|europium|gadolinium|iridium|osmium|thallium|thorium|americium|einsteinium|nobelium|scandium|vanadium|yttrium|niobium|technetium|ruthenium|rhodium|hafnium|tantalum|rhenium|astatine|actinium|protactinium|neptunium|curium|berkelium|californium|fermium|mendelevium|lawrencium|rutherfordium|dubnium|seaborgium|bohrium|hassium|meitnerium|darmstadtium|roentgenium|copernicium|nihonium|flerovium|moscovium|livermorium|tennessine|oganesson|praseodymium|promethium|samarium|terbium|dysprosium|holmium|erbium|thulium|ytterbium|lutetium'),
];

// Small spelling helpers (same idea as the trivia autocorrect).
const squash = (t) => t.replace(/[ ,.\-']/g, '');
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
const isPlural = (g, t) => g === t + 's' || g === t + 'es' || (t.endsWith('y') && g === t.slice(0, -1) + 'ies');

// Find which list item someone meant. Returns { item, fixed } or null if it's not on the list.
export function findItem(input, items) {
  const g = squash(normalize(input));
  if (!g) return null;
  for (const it of items) {
    const t = squash(normalize(it));
    if (g === t || isPlural(g, t)) return { item: it, fixed: false };
  }
  let best = null; let bestD = Infinity;
  for (const it of items) {
    const t = squash(normalize(it));
    // Typos almost always keep the first letter; "dark oak" is not a typo of "cork oak".
    if (g[0] !== t[0]) continue;
    const allow = t.length < 4 ? 0 : Math.max(1, Math.floor(t.length * 0.34));
    const d = lev(g, t);
    if (d <= allow && d < bestD) { best = it; bestD = d; }
  }
  return best ? { item: best, fixed: true } : null;
}

// Starting guess for how popular each answer is (common answers first in the list).
export function priorShare(items, item) {
  const idx = items.indexOf(item);
  if (idx < 0) return 0;
  let sum = 0;
  for (let r = 0; r < items.length; r++) sum += 1 / (r + 1);
  return 1 / (idx + 1) / sum;
}

// Turn real counts + the starting guess into floors (0 to 100).
// Obvious answers barely move you; answers almost nobody gives take you up 100 floors.
const PSEUDO = 30; // how much the starting guess counts, in "imaginary players"
export function rarityScore({ count, total, prior }) {
  const share = (count + PSEUDO * prior) / (total + PSEUDO);
  const s = (Math.log10(1 / Math.max(share, 1e-9)) - 0.5) / 2;
  return Math.max(5, Math.min(100, Math.round(s * 100)));
}
export function rarityLabel(points) {
  if (points >= 90) return { name: 'LEGENDARY', emoji: '🌟', tier: 4 };
  if (points >= 70) return { name: 'Super rare', emoji: '💎', tier: 3 };
  if (points >= 45) return { name: 'Rare', emoji: '🔷', tier: 2 };
  if (points >= 25) return { name: 'Uncommon', emoji: '🟢', tier: 1 };
  return { name: 'Common', emoji: '⚪', tier: 0 };
}
