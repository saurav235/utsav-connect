
export type BilingualText = {
  en: string;
  hi: string;
};

export type Ritual = {
  slug: string;
  name: BilingualText;
  title: BilingualText;
  summary: BilingualText;
  description: BilingualText;
  food: BilingualText;
  significance: BilingualText;
};

export type CultureTopic = {
  slug: string;
  title: BilingualText;
  summary: BilingualText;
  content: BilingualText;
};

export const rituals: Ritual[] = [
  {
    slug: "nahay-khay",
    name: {
      en: "Nahay Khay",
      hi: "नहाय-खाय",
    },
    title: {
      en: "A Beginning of Purity",
      hi: "पवित्रता की शुरुआत",
    },
    summary: {
      en: "The first day begins with cleanliness, simple food, and devotion.",
      hi: "पहला दिन स्वच्छता, सात्विक भोजन और भक्ति के साथ शुरू होता है।",
    },
    description: {
      en: "Devotees clean their homes, take a holy bath, and prepare a simple, pure meal. This day marks the beginning of the sacred Chhath observance.",
      hi: "व्रती घर की सफाई करते हैं, स्नान करते हैं और सात्विक भोजन बनाते हैं। यह दिन छठ के पवित्र अनुष्ठान की शुरुआत है।",
    },
    food: {
      en: "Kaddu Bhaat, prepared traditionally with pumpkin, rice, and simple ingredients.",
      hi: "कद्दू-भात, जिसे पारंपरिक रूप से कद्दू, चावल और सात्विक सामग्री से बनाया जाता है।",
    },
    significance: {
      en: "Purity of the body, mind, home, and food prepares devotees for the days ahead.",
      hi: "तन, मन, घर और भोजन की पवित्रता आने वाले दिनों के लिए व्रती को तैयार करती है।",
    },
  },
  {
    slug: "kharna",
    name: {
      en: "Kharna",
      hi: "खरना",
    },
    title: {
      en: "Faith, Discipline and Devotion",
      hi: "आस्था, अनुशासन और भक्ति",
    },
    summary: {
      en: "Devotees observe a day-long fast and conclude it with a sacred offering.",
      hi: "व्रती दिनभर उपवास रखते हैं और संध्या में प्रसाद ग्रहण करके इसे पूर्ण करते हैं।",
    },
    description: {
      en: "After a day of fasting, devotees worship and prepare traditional prasad, often including jaggery kheer, roti, and fruits. After the offering, the strict fast for the following period begins.",
      hi: "दिनभर उपवास के बाद व्रती पूजा करते हैं और गुड़ की खीर, रोटी तथा फल जैसे पारंपरिक प्रसाद तैयार करते हैं। प्रसाद ग्रहण करने के बाद कठिन निर्जला व्रत शुरू होता है।",
    },
    food: {
      en: "Jaggery kheer, roti, and seasonal fruits prepared with devotion.",
      hi: "गुड़ की खीर, रोटी और मौसमी फल, जिन्हें श्रद्धा से तैयार किया जाता है।",
    },
    significance: {
      en: "Kharna represents self-discipline, gratitude, simplicity, and spiritual preparation.",
      hi: "खरना आत्मसंयम, कृतज्ञता, सादगी और आध्यात्मिक तैयारी का प्रतीक है।",
    },
  },
  {
    slug: "sandhya-arghya",
    name: {
      en: "Sandhya Arghya",
      hi: "संध्या अर्घ्य",
    },
    title: {
      en: "Gratitude to the Setting Sun",
      hi: "अस्ताचलगामी सूर्य को कृतज्ञता",
    },
    summary: {
      en: "Families gather at the water's edge to offer arghya to the setting Sun.",
      hi: "परिवार और श्रद्धालु जलाशय के किनारे एकत्र होकर डूबते सूर्य को अर्घ्य अर्पित करते हैं।",
    },
    description: {
      en: "Devotees carry bamboo baskets filled with fruits, thekua, and other offerings to a river, pond, or designated water body. Together, they offer arghya to the setting Sun in an atmosphere of prayer and devotion.",
      hi: "व्रती फल, ठेकुआ और अन्य प्रसाद से भरे बाँस के सूप लेकर नदी, तालाब या निर्धारित जलाशय पर पहुँचते हैं। सभी मिलकर डूबते सूर्य को अर्घ्य अर्पित करते हैं।",
    },
    food: {
      en: "Thekua, seasonal fruits, sugarcane, and traditional offerings arranged in bamboo baskets.",
      hi: "ठेकुआ, मौसमी फल, गन्ना और बाँस के सूप में सजाए गए पारंपरिक प्रसाद।",
    },
    significance: {
      en: "Offering prayers to the setting Sun expresses gratitude for life's blessings and the natural cycle of life.",
      hi: "डूबते सूर्य को अर्घ्य देना जीवन के उपहारों और प्रकृति के चक्र के प्रति कृतज्ञता व्यक्त करता है।",
    },
  },
  {
    slug: "usha-arghya",
    name: {
      en: "Usha Arghya",
      hi: "उषा अर्घ्य",
    },
    title: {
      en: "A New Dawn of Hope",
      hi: "आशा की नई सुबह",
    },
    summary: {
      en: "At sunrise, devotees offer their final arghya and pray for health, peace, and prosperity.",
      hi: "सूर्योदय के समय व्रती अंतिम अर्घ्य अर्पित कर स्वास्थ्य, शांति और समृद्धि की प्रार्थना करते हैं।",
    },
    description: {
      en: "Before sunrise, families return to the water's edge. Devotees offer arghya to the rising Sun, complete the rituals, and conclude the fast with prayers and blessings.",
      hi: "सूर्योदय से पहले परिवार जलाशय के किनारे पहुँचते हैं। उगते सूर्य को अर्घ्य देने के बाद पूजा पूर्ण होती है और प्रार्थनाओं के साथ व्रत का समापन किया जाता है।",
    },
    food: {
      en: "Thekua, fruits, sugarcane, and other traditional prasad shared with family.",
      hi: "ठेकुआ, फल, गन्ना और अन्य पारंपरिक प्रसाद, जिन्हें परिवार के साथ बाँटा जाता है।",
    },
    significance: {
      en: "The rising Sun represents renewal, hope, well-being, and the continuation of life.",
      hi: "उगता सूर्य नई शुरुआत, आशा, कल्याण और जीवन की निरंतरता का प्रतीक है।",
    },
  },
];

export const cultureTopics: CultureTopic[] = [
  {
    slug: "meaning-of-chhath",
    title: {
      en: "What Is Chhath Puja?",
      hi: "छठ पूजा क्या है?",
    },
    summary: {
      en: "A festival of devotion, gratitude, purity, and harmony with nature.",
      hi: "भक्ति, कृतज्ञता, पवित्रता और प्रकृति के साथ सामंजस्य का महापर्व।",
    },
    content: {
      en: "Chhath Puja is an ancient festival especially celebrated in Bihar, Jharkhand, eastern Uttar Pradesh, and parts of Nepal. Devotees worship Surya Dev, the Sun God, and Chhathi Maiya. The festival is known for its disciplined fasting, traditional offerings, and prayers at sunrise and sunset.",
      hi: "छठ पूजा एक प्राचीन पर्व है, जिसे विशेष रूप से बिहार, झारखंड, पूर्वी उत्तर प्रदेश और नेपाल के कुछ क्षेत्रों में मनाया जाता है। श्रद्धालु सूर्य देव और छठी मैया की उपासना करते हैं। यह पर्व कठिन व्रत, पारंपरिक प्रसाद और सूर्योदय तथा सूर्यास्त के समय अर्घ्य देने के लिए प्रसिद्ध है।",
    },
  },
  {
    slug: "surya-dev",
    title: {
      en: "Why Do We Worship the Sun?",
      hi: "हम सूर्य देव की पूजा क्यों करते हैं?",
    },
    summary: {
      en: "The Sun sustains life and reminds us to be grateful for nature.",
      hi: "सूर्य जीवन का आधार हैं और हमें प्रकृति के प्रति कृतज्ञ रहना सिखाते हैं।",
    },
    content: {
      en: "The Sun provides light and warmth and supports life on Earth. During Chhath, devotees express gratitude for these gifts and pray for the health and happiness of their families.",
      hi: "सूर्य हमें प्रकाश और ऊर्जा देते हैं तथा पृथ्वी पर जीवन को संभव बनाते हैं। छठ के दौरान श्रद्धालु इन उपहारों के प्रति कृतज्ञता व्यक्त करते हैं और अपने परिवार के स्वास्थ्य एवं सुख की प्रार्थना करते हैं।",
    },
  },
  {
    slug: "chhathi-maiya",
    title: {
      en: "Who Is Chhathi Maiya?",
      hi: "छठी मैया कौन हैं?",
    },
    summary: {
      en: "The revered divine mother associated with protection, well-being, and blessings.",
      hi: "संरक्षण, कल्याण और आशीर्वाद से जुड़ी पूजनीय देवी।",
    },
    content: {
      en: "Chhathi Maiya holds a special place in the faith and traditions of Chhath devotees. Families pray to her for the well-being of children, good health, and happiness. Beliefs and stories associated with her may vary across communities.",
      hi: "छठ व्रत करने वाले श्रद्धालुओं की आस्था में छठी मैया का विशेष स्थान है। परिवार बच्चों के कल्याण, अच्छे स्वास्थ्य और सुख-समृद्धि के लिए उनसे प्रार्थना करते हैं। उनसे जुड़ी मान्यताएँ और कथाएँ अलग-अलग समुदायों में भिन्न हो सकती हैं।",
    },
  },
  {
    slug: "thekua",
    title: {
      en: "Thekua: The Taste of Tradition",
      hi: "ठेकुआ: परंपरा का स्वाद",
    },
    summary: {
      en: "A beloved traditional prasad prepared with devotion during Chhath.",
      hi: "छठ के दौरान श्रद्धा से बनाया जाने वाला प्रिय पारंपरिक प्रसाद।",
    },
    content: {
      en: "Thekua is a traditional sweet commonly prepared for Chhath Puja using wheat flour, jaggery or sugar, and other simple ingredients. Its preparation is part of the festival's shared family traditions, and it is offered as prasad.",
      hi: "ठेकुआ छठ पूजा का एक लोकप्रिय पारंपरिक मीठा प्रसाद है, जिसे आमतौर पर गेहूँ के आटे, गुड़ या चीनी और अन्य साधारण सामग्री से बनाया जाता है। इसे तैयार करना परिवार की साझा परंपराओं का हिस्सा है और पूजा में प्रसाद के रूप में अर्पित किया जाता है।",
    },
  },
  {
    slug: "bamboo-soop",
    title: {
      en: "The Bamboo Soop and Daura",
      hi: "बाँस का सूप और दौरा",
    },
    summary: {
      en: "Traditional baskets that carry offerings and connect generations.",
      hi: "प्रसाद सजाने वाले पारंपरिक पात्र, जो पीढ़ियों को जोड़ते हैं।",
    },
    content: {
      en: "Bamboo soop and daura are widely used to arrange and carry Chhath offerings. They reflect traditional craftsmanship, natural materials, and the passing of cultural practices from one generation to the next.",
      hi: "बाँस के सूप और दौरा का उपयोग छठ के प्रसाद को सजाने और ले जाने के लिए किया जाता है। ये पारंपरिक कारीगरी, प्राकृतिक सामग्री और एक पीढ़ी से दूसरी पीढ़ी तक पहुँचती सांस्कृतिक परंपराओं को दर्शाते हैं।",
    },
  },
  {
    slug: "chhath-in-bengaluru",
    title: {
      en: "Chhath Away from Bihar",
      hi: "बिहार से दूर, छठ के करीब",
    },
    summary: {
      en: "How Bihari families keep their traditions alive in Bengaluru.",
      hi: "बेंगलुरु में बिहारी परिवार अपनी परंपराओं को कैसे जीवित रखते हैं।",
    },
    content: {
      en: "For families living away from Bihar, Chhath is more than a festival. It is a connection to home, childhood memories, family values, and community. Celebrating Chhath together in Bengaluru gives neighbours an opportunity to share the culture, welcome new generations, and keep these traditions alive.",
      hi: "बिहार से दूर रहने वाले परिवारों के लिए छठ केवल एक त्योहार नहीं, बल्कि अपने घर, बचपन की यादों, पारिवारिक मूल्यों और समुदाय से जुड़ने का माध्यम है। बेंगलुरु में मिलकर छठ मनाना पड़ोसियों को संस्कृति साझा करने, नई पीढ़ी को परंपराओं से जोड़ने और विरासत को जीवित रखने का अवसर देता है।",
    },
  },
  {
    slug: "bihari-identity",
    title: {
      en: "Bihar Ki Bhavna",
      hi: "बिहार की भावना",
    },
    summary: {
      en: "A feeling of home, belonging, and pride that travels with every Bihari.",
      hi: "अपनापन, अपनी मिट्टी और गर्व की वह भावना जो हर बिहारी के साथ चलती है।",
    },
    content: {
      en: "Bihar Ki Bhavna celebrates the language, food, folk traditions, festivals, music, and stories that connect Biharis across generations and places. Whether at home in Bihar or far away in Bengaluru, culture lives through the traditions we practise and share.",
      hi: "बिहार की भावना उस भाषा, खान-पान, लोक परंपराओं, त्योहारों, संगीत और कहानियों का उत्सव है, जो बिहारियों को पीढ़ियों और दूरियों के पार जोड़ती हैं। चाहे बिहार अपना घर हो या बेंगलुरु, संस्कृति उन परंपराओं में जीवित रहती है जिन्हें हम निभाते और साझा करते हैं।",
    },
  },
  {
    slug: "eco-friendly-chhath",
    title: {
      en: "Celebrating Chhath Responsibly",
      hi: "जिम्मेदारी के साथ छठ का उत्सव",
    },
    summary: {
      en: "Preserve the spirit of devotion while caring for our surroundings.",
      hi: "भक्ति की भावना के साथ अपने आसपास के वातावरण का भी ध्यान रखें।",
    },
    content: {
      en: "We can celebrate Chhath by keeping the worship area clean, avoiding single-use plastic, disposing of waste responsibly, and following local safety instructions. Collective care helps preserve the beauty and meaning of the festival for everyone.",
      hi: "हम पूजा स्थल को साफ रखकर, एकल-उपयोग प्लास्टिक से बचकर, कचरे का सही निपटान करके और स्थानीय सुरक्षा निर्देशों का पालन करके छठ मना सकते हैं। सामूहिक जिम्मेदारी इस पर्व की सुंदरता और भावना को सभी के लिए बनाए रखती है।",
    },
  },
];
