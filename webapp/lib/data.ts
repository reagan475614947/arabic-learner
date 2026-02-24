export const DATA_VERSION = 2 as const;

export type Phrase = {
  id: string; // "p001"..."p100"
  topic: string;
  arabic: string;
  transliteration: string;
  meaning: string; // English
  audioKey: string; // placeholder for future audio mapping; currently equals id
};

export const PHRASES: Phrase[] = [
  // 1) Greetings & Farewells (15)
  { id: "p001", topic: "greetings", arabic: "مرحبا", transliteration: "marhaban", meaning: "Hello", audioKey: "p001" },
  { id: "p002", topic: "greetings", arabic: "أهلا", transliteration: "ahlan", meaning: "Hi", audioKey: "p002" },
  { id: "p003", topic: "greetings", arabic: "السلام عليكم", transliteration: "as-salamu alaykum", meaning: "Peace be upon you (hello)", audioKey: "p003" },
  { id: "p004", topic: "greetings", arabic: "وعليكم السلام", transliteration: "wa alaykum as-salam", meaning: "And upon you peace (reply)", audioKey: "p004" },
  { id: "p005", topic: "greetings", arabic: "صباح الخير", transliteration: "sabah al-khayr", meaning: "Good morning", audioKey: "p005" },
  { id: "p006", topic: "greetings", arabic: "مساء الخير", transliteration: "masa al-khayr", meaning: "Good evening", audioKey: "p006" },
  { id: "p007", topic: "greetings", arabic: "ليلة سعيدة", transliteration: "layla sa'ida", meaning: "Good night", audioKey: "p007" },
  { id: "p008", topic: "greetings", arabic: "كيف حالك؟", transliteration: "kayfa haluk?", meaning: "How are you?", audioKey: "p008" },
  { id: "p009", topic: "greetings", arabic: "بخير، شكرا", transliteration: "bikhayr, shukran", meaning: "Fine, thank you", audioKey: "p009" },
  { id: "p010", topic: "greetings", arabic: "تشرفنا", transliteration: "tasharrafna", meaning: "Nice to meet you", audioKey: "p010" },
  { id: "p011", topic: "greetings", arabic: "إلى اللقاء", transliteration: "ila al-liqa'", meaning: "Goodbye", audioKey: "p011" },
  { id: "p012", topic: "greetings", arabic: "مع السلامة", transliteration: "ma'a as-salama", meaning: "Goodbye / go in peace", audioKey: "p012" },
  { id: "p013", topic: "greetings", arabic: "أراك لاحقا", transliteration: "araka lahqan", meaning: "See you later", audioKey: "p013" },
  { id: "p014", topic: "greetings", arabic: "يوم سعيد", transliteration: "yawm sa'id", meaning: "Have a nice day", audioKey: "p014" },
  { id: "p015", topic: "greetings", arabic: "أهلا وسهلا", transliteration: "ahlan wa sahlan", meaning: "Welcome", audioKey: "p015" },

  // 2) Polite Basics (15)
  { id: "p016", topic: "polite", arabic: "من فضلك", transliteration: "min fadlak", meaning: "Please", audioKey: "p016" },
  { id: "p017", topic: "polite", arabic: "شكرا", transliteration: "shukran", meaning: "Thank you", audioKey: "p017" },
  { id: "p018", topic: "polite", arabic: "شكرا جزيلا", transliteration: "shukran jazilan", meaning: "Thank you very much", audioKey: "p018" },
  { id: "p019", topic: "polite", arabic: "عفوا", transliteration: "afwan", meaning: "You're welcome / Excuse me", audioKey: "p019" },
  { id: "p020", topic: "polite", arabic: "آسف", transliteration: "asif", meaning: "Sorry", audioKey: "p020" },
  { id: "p021", topic: "polite", arabic: "المعذرة", transliteration: "al-ma'dhira", meaning: "Excuse me", audioKey: "p021" },
  { id: "p022", topic: "polite", arabic: "نعم", transliteration: "na'am", meaning: "Yes", audioKey: "p022" },
  { id: "p023", topic: "polite", arabic: "لا", transliteration: "la", meaning: "No", audioKey: "p023" },
  { id: "p024", topic: "polite", arabic: "ربما", transliteration: "rubbama", meaning: "Maybe", audioKey: "p024" },
  { id: "p025", topic: "polite", arabic: "لا أفهم", transliteration: "la afham", meaning: "I don’t understand", audioKey: "p025" },
  { id: "p026", topic: "polite", arabic: "هل تتكلم الإنجليزية؟", transliteration: "hal tatakallam al-ingliziyya?", meaning: "Do you speak English?", audioKey: "p026" },
  { id: "p027", topic: "polite", arabic: "تكلم ببطء من فضلك", transliteration: "takallam bi-but' min fadlak", meaning: "Please speak slowly", audioKey: "p027" },
  { id: "p028", topic: "polite", arabic: "أعد من فضلك", transliteration: "a'id min fadlak", meaning: "Please repeat", audioKey: "p028" },
  { id: "p029", topic: "polite", arabic: "ما معنى هذا؟", transliteration: "ma ma'na hadha?", meaning: "What does this mean?", audioKey: "p029" },
  { id: "p030", topic: "polite", arabic: "أين الحمام؟", transliteration: "ayna al-hammam?", meaning: "Where is the bathroom?", audioKey: "p030" },

  // 3) Small Talk (10)
  { id: "p031", topic: "smalltalk", arabic: "ما اسمك؟", transliteration: "ma ismuk?", meaning: "What’s your name?", audioKey: "p031" },
  { id: "p032", topic: "smalltalk", arabic: "اسمي ...", transliteration: "ismi ...", meaning: "My name is ...", audioKey: "p032" },
  { id: "p033", topic: "smalltalk", arabic: "من أين أنت؟", transliteration: "min ayna anta?", meaning: "Where are you from?", audioKey: "p033" },
  { id: "p034", topic: "smalltalk", arabic: "أنا من ...", transliteration: "ana min ...", meaning: "I’m from ...", audioKey: "p034" },
  { id: "p035", topic: "smalltalk", arabic: "كم عمرك؟", transliteration: "kam umruk?", meaning: "How old are you?", audioKey: "p035" },
  { id: "p036", topic: "smalltalk", arabic: "أنا طالب", transliteration: "ana talib", meaning: "I am a student", audioKey: "p036" },
  { id: "p037", topic: "smalltalk", arabic: "أنا أتعلم العربية", transliteration: "ana ata'allam al-arabiyya", meaning: "I’m learning Arabic", audioKey: "p037" },
  { id: "p038", topic: "smalltalk", arabic: "هذا جميل", transliteration: "hadha jamil", meaning: "That’s nice", audioKey: "p038" },
  { id: "p039", topic: "smalltalk", arabic: "لا مشكلة", transliteration: "la mushkila", meaning: "No problem", audioKey: "p039" },
  { id: "p040", topic: "smalltalk", arabic: "بالتوفيق", transliteration: "bi-tawfiq", meaning: "Good luck", audioKey: "p040" },

  // 4) Café & Restaurant (15)
  { id: "p041", topic: "food", arabic: "أريد ...", transliteration: "urid ...", meaning: "I want ...", audioKey: "p041" },
  { id: "p042", topic: "food", arabic: "هل عندكم قائمة؟", transliteration: "hal indakum qa'ima?", meaning: "Do you have a menu?", audioKey: "p042" },
  { id: "p043", topic: "food", arabic: "قائمة الطعام من فضلك", transliteration: "qa'imat at-ta'am min fadlak", meaning: "The menu, please", audioKey: "p043" },
  { id: "p044", topic: "food", arabic: "ما الذي تنصح به؟", transliteration: "ma alladhi tansah bihi?", meaning: "What do you recommend?", audioKey: "p044" },
  { id: "p045", topic: "food", arabic: "أريد قهوة", transliteration: "urid qahwa", meaning: "I’d like coffee", audioKey: "p045" },
  { id: "p046", topic: "food", arabic: "أريد شاي", transliteration: "urid shay", meaning: "I’d like tea", audioKey: "p046" },
  { id: "p047", topic: "food", arabic: "بدون سكر", transliteration: "bidun sukkar", meaning: "Without sugar", audioKey: "p047" },
  { id: "p048", topic: "food", arabic: "مع سكر", transliteration: "ma'a sukkar", meaning: "With sugar", audioKey: "p048" },
  { id: "p049", topic: "food", arabic: "ماء من فضلك", transliteration: "ma' min fadlak", meaning: "Water, please", audioKey: "p049" },
  { id: "p050", topic: "food", arabic: "الفاتورة من فضلك", transliteration: "al-fatura min fadlak", meaning: "The bill, please", audioKey: "p050" },
  { id: "p051", topic: "food", arabic: "كم السعر؟", transliteration: "kam as-si'r?", meaning: "How much is it?", audioKey: "p051" },
  { id: "p052", topic: "food", arabic: "لذيذ جدا", transliteration: "ladhidh jiddan", meaning: "Very delicious", audioKey: "p052" },
  { id: "p053", topic: "food", arabic: "أنا نباتي", transliteration: "ana nabati", meaning: "I’m vegetarian", audioKey: "p053" },
  { id: "p054", topic: "food", arabic: "لدي حساسية من ...", transliteration: "ladi hasasiyya min ...", meaning: "I’m allergic to ...", audioKey: "p054" },
  { id: "p055", topic: "food", arabic: "هل هذا حلال؟", transliteration: "hal hadha halal?", meaning: "Is this halal?", audioKey: "p055" },

  // 5) Shopping (10)
  { id: "p056", topic: "shopping", arabic: "أبحث عن ...", transliteration: "abhath an ...", meaning: "I’m looking for ...", audioKey: "p056" },
  { id: "p057", topic: "shopping", arabic: "هل عندكم هذا؟", transliteration: "hal indakum hadha?", meaning: "Do you have this?", audioKey: "p057" },
  { id: "p058", topic: "shopping", arabic: "كم هذا؟", transliteration: "kam hadha?", meaning: "How much is this?", audioKey: "p058" },
  { id: "p059", topic: "shopping", arabic: "غالي جدا", transliteration: "ghali jiddan", meaning: "Too expensive", audioKey: "p059" },
  { id: "p060", topic: "shopping", arabic: "هل يمكن تخفيض السعر؟", transliteration: "hal yumkin takhfid as-si'r?", meaning: "Can you lower the price?", audioKey: "p060" },
  { id: "p061", topic: "shopping", arabic: "أريد هذا", transliteration: "urid hadha", meaning: "I want this", audioKey: "p061" },
  { id: "p062", topic: "shopping", arabic: "مقاس صغير", transliteration: "maqas saghir", meaning: "Small size", audioKey: "p062" },
  { id: "p063", topic: "shopping", arabic: "مقاس كبير", transliteration: "maqas kabir", meaning: "Large size", audioKey: "p063" },
  { id: "p064", topic: "shopping", arabic: "أين الصندوق؟", transliteration: "ayna as-sunduq?", meaning: "Where is the cashier?", audioKey: "p064" },
  { id: "p065", topic: "shopping", arabic: "أحتاج إيصال", transliteration: "ahtaj isal", meaning: "I need a receipt", audioKey: "p065" },

  // 6) Directions & Transport (15)
  { id: "p066", topic: "directions", arabic: "أين ...؟", transliteration: "ayna ...?", meaning: "Where is ...?", audioKey: "p066" },
  { id: "p067", topic: "directions", arabic: "كيف أذهب إلى ...؟", transliteration: "kayfa adhhab ila ...?", meaning: "How do I get to ...?", audioKey: "p067" },
  { id: "p068", topic: "directions", arabic: "قريب أم بعيد؟", transliteration: "qarib am ba'id?", meaning: "Is it near or far?", audioKey: "p068" },
  { id: "p069", topic: "directions", arabic: "على اليمين", transliteration: "ala al-yamin", meaning: "On the right", audioKey: "p069" },
  { id: "p070", topic: "directions", arabic: "على اليسار", transliteration: "ala al-yasar", meaning: "On the left", audioKey: "p070" },
  { id: "p071", topic: "directions", arabic: "مستقيم", transliteration: "mustaqim", meaning: "Straight ahead", audioKey: "p071" },
  { id: "p072", topic: "transport", arabic: "توقف هنا من فضلك", transliteration: "tawaqqaf huna min fadlak", meaning: "Stop here, please", audioKey: "p072" },
  { id: "p073", topic: "transport", arabic: "إلى المطار من فضلك", transliteration: "ila al-matar min fadlak", meaning: "To the airport, please", audioKey: "p073" },
  { id: "p074", topic: "transport", arabic: "إلى الفندق من فضلك", transliteration: "ila al-funduq min fadlak", meaning: "To the hotel, please", audioKey: "p074" },
  { id: "p075", topic: "transport", arabic: "كم تستغرق؟", transliteration: "kam tastaghriq?", meaning: "How long does it take?", audioKey: "p075" },
  { id: "p076", topic: "transport", arabic: "أريد سيارة أجرة", transliteration: "urid sayyarat ujra", meaning: "I need a taxi", audioKey: "p076" },
  { id: "p077", topic: "transport", arabic: "أين موقف سيارات الأجرة؟", transliteration: "ayna mawqif sayyarat al-ujra?", meaning: "Where is the taxi stand?", audioKey: "p077" },
  { id: "p078", topic: "transport", arabic: "أين محطة الحافلات؟", transliteration: "ayna mahattat al-hafilat?", meaning: "Where is the bus station?", audioKey: "p078" },
  { id: "p079", topic: "help", arabic: "هل يمكنك مساعدتي؟", transliteration: "hal yumkinuk musa'adati?", meaning: "Can you help me?", audioKey: "p079" },
  { id: "p080", topic: "help", arabic: "أنا تائه", transliteration: "ana ta'ih", meaning: "I’m lost", audioKey: "p080" },

  // 7) Time & Scheduling (10)
  { id: "p081", topic: "time", arabic: "ما الوقت الآن؟", transliteration: "ma al-waqt al-an?", meaning: "What time is it now?", audioKey: "p081" },
  { id: "p082", topic: "time", arabic: "اليوم", transliteration: "al-yawm", meaning: "Today", audioKey: "p082" },
  { id: "p083", topic: "time", arabic: "غدا", transliteration: "ghadan", meaning: "Tomorrow", audioKey: "p083" },
  { id: "p084", topic: "time", arabic: "أمس", transliteration: "ams", meaning: "Yesterday", audioKey: "p084" },
  { id: "p085", topic: "time", arabic: "الآن", transliteration: "al-an", meaning: "Now", audioKey: "p085" },
  { id: "p086", topic: "time", arabic: "لاحقا", transliteration: "lahqan", meaning: "Later", audioKey: "p086" },
  { id: "p087", topic: "time", arabic: "صباحا", transliteration: "sabahan", meaning: "In the morning", audioKey: "p087" },
  { id: "p088", topic: "time", arabic: "مساء", transliteration: "masa'an", meaning: "In the evening", audioKey: "p088" },
  { id: "p089", topic: "time", arabic: "متى؟", transliteration: "mata?", meaning: "When?", audioKey: "p089" },
  { id: "p090", topic: "time", arabic: "أراك غدا", transliteration: "araka ghadan", meaning: "See you tomorrow", audioKey: "p090" },

  // 8) Emergencies & Health (10)
  { id: "p091", topic: "emergency", arabic: "ساعدني!", transliteration: "sa'idni!", meaning: "Help me!", audioKey: "p091" },
  { id: "p092", topic: "emergency", arabic: "اتصل بالشرطة", transliteration: "ittasil bil-shurta", meaning: "Call the police", audioKey: "p092" },
  { id: "p093", topic: "emergency", arabic: "اتصل بالإسعاف", transliteration: "ittasil bil-is'af", meaning: "Call an ambulance", audioKey: "p093" },
  { id: "p094", topic: "health", arabic: "أين المستشفى؟", transliteration: "ayna al-mustashfa?", meaning: "Where is the hospital?", audioKey: "p094" },
  { id: "p095", topic: "health", arabic: "أنا مريض", transliteration: "ana marid", meaning: "I’m sick", audioKey: "p095" },
  { id: "p096", topic: "health", arabic: "أشعر بألم هنا", transliteration: "ash'ur bi-alam huna", meaning: "I feel pain here", audioKey: "p096" },
  { id: "p097", topic: "health", arabic: "لدي حساسية", transliteration: "ladi hasasiyya", meaning: "I have an allergy", audioKey: "p097" },
  { id: "p098", topic: "health", arabic: "أنا لا أستطيع التنفس", transliteration: "ana la astati' at-tanaffus", meaning: "I can’t breathe", audioKey: "p098" },
  { id: "p099", topic: "emergency", arabic: "فقدت هاتفي", transliteration: "faqadtu hatifi", meaning: "I lost my phone", audioKey: "p099" },
  { id: "p100", topic: "safety", arabic: "هل هذا آمن؟", transliteration: "hal hadha amin?", meaning: "Is this safe?", audioKey: "p100" },
];
