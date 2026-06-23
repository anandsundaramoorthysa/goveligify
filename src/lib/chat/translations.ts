import type { LangCode } from "@/lib/types";

/**
 * Static UI strings for the chat screen's language selector.
 * Covers the welcome screen and composer only — bot replies stay in
 * English (the mock engine has no translation backend), matching the
 * app's existing "preview" framing for unfinished coverage.
 */

export const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "ml", label: "മലയാളം" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
  { code: "ur", label: "اردو" },
  { code: "sa", label: "संस्कृत" },
  { code: "bn", label: "বাংলা" },
];

/** BCP-47 locale used for speech recognition / synthesis per UI language. */
export const SPEECH_LOCALE: Record<LangCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  ml: "ml-IN",
  kn: "kn-IN",
  te: "te-IN",
  mr: "mr-IN",
  ur: "ur-IN",
  sa: "sa-IN",
  bn: "bn-IN",
};

interface Strings {
  welcomeTitle: string;
  welcomeSubtitle: string;
  personas: {
    farmer: string;
    student: string;
    senior: string;
    business: string;
    certificate: string;
  };
  examples: [string, string, string];
  freeNote: string;
  previewNote: string;
  composerPlaceholder: string;
  trustLine: string;
  searchPlaceholder: string;
  searchEmpty: string;
  micStart: string;
  micStop: string;
  micListening: string;
}

export const STRINGS: Record<LangCode, Strings> = {
  en: {
    welcomeTitle: "What are you entitled to?",
    welcomeSubtitle:
      "Describe your situation in plain words and I'll find the government schemes, benefits, and certificates you may qualify for.",
    personas: {
      farmer: "I'm a farmer",
      student: "I'm a student",
      senior: "I'm a senior citizen",
      business: "I run a small business",
      certificate: "I need a certificate",
    },
    examples: [
      "What schemes help small farmers?",
      "Scholarships for college students",
      "Pension for senior citizens",
    ],
    freeNote: "Free · No login · Never submits applications for you.",
    previewNote:
      "Preview — answers use a small sample of schemes; full, verified coverage is coming soon.",
    composerPlaceholder: "Describe your situation…",
    trustLine:
      "Sample guidance — always verify on the official portal. We never submit applications for you.",
    searchPlaceholder: "Search this conversation…",
    searchEmpty: "No matches yet.",
    micStart: "Start voice input",
    micStop: "Stop voice input",
    micListening: "Listening…",
  },
  hi: {
    welcomeTitle: "आप किसके लिए पात्र हैं?",
    welcomeSubtitle:
      "अपनी स्थिति सरल शब्दों में बताएं और मैं उन सरकारी योजनाओं, लाभों और प्रमाणपत्रों को खोजूंगा जिनके लिए आप पात्र हो सकते हैं।",
    personas: {
      farmer: "मैं एक किसान हूं",
      student: "मैं एक छात्र हूं",
      senior: "मैं एक वरिष्ठ नागरिक हूं",
      business: "मैं एक छोटा व्यवसाय चलाता हूं",
      certificate: "मुझे एक प्रमाणपत्र चाहिए",
    },
    examples: [
      "छोटे किसानों की मदद करने वाली योजनाएं कौन सी हैं?",
      "कॉलेज छात्रों के लिए छात्रवृत्तियां",
      "वरिष्ठ नागरिकों के लिए पेंशन",
    ],
    freeNote: "मुफ़्त · कोई लॉगिन नहीं · आपके लिए कभी आवेदन जमा नहीं करता।",
    previewNote:
      "पूर्वावलोकन — उत्तर योजनाओं के एक छोटे नमूने का उपयोग करते हैं; पूर्ण, सत्यापित जानकारी जल्द आ रही है।",
    composerPlaceholder: "अपनी स्थिति बताएं…",
    trustLine:
      "नमूना मार्गदर्शन — हमेशा आधिकारिक पोर्टल पर सत्यापित करें। हम आपके लिए कभी आवेदन जमा नहीं करते।",
    searchPlaceholder: "इस बातचीत में खोजें…",
    searchEmpty: "अभी तक कोई मिलान नहीं।",
    micStart: "आवाज़ इनपुट शुरू करें",
    micStop: "आवाज़ इनपुट बंद करें",
    micListening: "सुन रहा है…",
  },
  ta: {
    welcomeTitle: "நீங்கள் எதற்கு தகுதியானவர்?",
    welcomeSubtitle:
      "உங்கள் சூழ்நிலையை எளிய வார்த்தைகளில் விவரிக்கவும், நீங்கள் தகுதியுள்ள அரசு திட்டங்கள், சலுகைகள் மற்றும் சான்றிதழ்களை நான் கண்டறிகிறேன்.",
    personas: {
      farmer: "நான் ஒரு விவசாயி",
      student: "நான் ஒரு மாணவன்",
      senior: "நான் ஒரு மூத்த குடிமகன்",
      business: "நான் ஒரு சிறு தொழில் நடத்துகிறேன்",
      certificate: "எனக்கு ஒரு சான்றிதழ் தேவை",
    },
    examples: [
      "சிறு விவசாயிகளுக்கு உதவும் திட்டங்கள் என்ன?",
      "கல்லூரி மாணவர்களுக்கான உதவித்தொகைகள்",
      "மூத்த குடிமக்களுக்கான ஓய்வூதியம்",
    ],
    freeNote: "இலவசம் · உள்நுழைவு தேவையில்லை · உங்களுக்காக விண்ணப்பங்களைச் சமர்ப்பிக்காது.",
    previewNote:
      "முன்னோட்டம் — பதில்கள் சிறிய மாதிரி திட்டங்களைப் பயன்படுத்துகின்றன; முழுமையான, சரிபார்க்கப்பட்ட தகவல் விரைவில் வரும்.",
    composerPlaceholder: "உங்கள் சூழ்நிலையை விவரிக்கவும்…",
    trustLine:
      "மாதிரி வழிகாட்டுதல் — அதிகாரப்பூர்வ போர்ட்டலில் எப்போதும் சரிபார்க்கவும். நாங்கள் உங்களுக்காக விண்ணப்பங்களைச் சமர்ப்பிக்க மாட்டோம்.",
    searchPlaceholder: "இந்த உரையாடலில் தேடுங்கள்…",
    searchEmpty: "இன்னும் பொருத்தங்கள் இல்லை.",
    micStart: "குரல் உள்ளீட்டைத் தொடங்கு",
    micStop: "குரல் உள்ளீட்டை நிறுத்து",
    micListening: "கேட்டுக்கொண்டிருக்கிறது…",
  },
  ml: {
    welcomeTitle: "നിങ്ങൾക്ക് എന്തിനൊക്കെ അർഹതയുണ്ട്?",
    welcomeSubtitle:
      "നിങ്ങളുടെ സാഹചര്യം ലളിതമായ വാക്കുകളിൽ വിവരിക്കുക, നിങ്ങൾക്ക് അർഹതയുള്ള സർക്കാർ പദ്ധതികളും ആനുകൂല്യങ്ങളും സർട്ടിഫിക്കറ്റുകളും ഞാൻ കണ്ടെത്താം.",
    personas: {
      farmer: "ഞാൻ ഒരു കർഷകനാണ്",
      student: "ഞാൻ ഒരു വിദ്യാർത്ഥിയാണ്",
      senior: "ഞാൻ ഒരു മുതിർന്ന പൗരനാണ്",
      business: "ഞാൻ ഒരു ചെറുകിട ബിസിനസ് നടത്തുന്നു",
      certificate: "എനിക്ക് ഒരു സർട്ടിഫിക്കറ്റ് വേണം",
    },
    examples: [
      "ചെറുകിട കർഷകർക്ക് സഹായകമായ പദ്ധതികൾ ഏതാണ്?",
      "കോളേജ് വിദ്യാർത്ഥികൾക്കുള്ള സ്കോളർഷിപ്പുകൾ",
      "മുതിർന്ന പൗരന്മാർക്കുള്ള പെൻഷൻ",
    ],
    freeNote: "സൗജന്യം · ലോഗിൻ വേണ്ട · നിങ്ങൾക്കായി ഒരിക്കലും അപേക്ഷകൾ സമർപ്പിക്കില്ല.",
    previewNote:
      "പ്രിവ്യൂ — മറുപടികൾ ചെറിയ സാമ്പിൾ പദ്ധതികൾ ഉപയോഗിക്കുന്നു; പൂർണ്ണവും സ്ഥിരീകരിച്ചതുമായ വിവരങ്ങൾ ഉടൻ വരുന്നു.",
    composerPlaceholder: "നിങ്ങളുടെ സാഹചര്യം വിവരിക്കുക…",
    trustLine:
      "സാമ്പിൾ മാർഗ്ഗനിർദ്ദേശം — ഔദ്യോഗിക പോർട്ടലിൽ എപ്പോഴും സ്ഥിരീകരിക്കുക. നിങ്ങൾക്കായി ഞങ്ങൾ ഒരിക്കലും അപേക്ഷകൾ സമർപ്പിക്കില്ല.",
    searchPlaceholder: "ഈ സംഭാഷണത്തിൽ തിരയുക…",
    searchEmpty: "ഇതുവരെ പൊരുത്തങ്ങളൊന്നുമില്ല.",
    micStart: "വോയ്സ് ഇൻപുട്ട് ആരംഭിക്കുക",
    micStop: "വോയ്സ് ഇൻപുട്ട് നിർത്തുക",
    micListening: "കേൾക്കുന്നു…",
  },
  kn: {
    welcomeTitle: "ನೀವು ಯಾವುದಕ್ಕೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ?",
    welcomeSubtitle:
      "ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯನ್ನು ಸರಳ ಪದಗಳಲ್ಲಿ ವಿವರಿಸಿ ಮತ್ತು ನೀವು ಅರ್ಹರಾಗಿರುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಸೌಲಭ್ಯಗಳು ಮತ್ತು ಪ್ರಮಾಣಪತ್ರಗಳನ್ನು ನಾನು ಕಂಡುಹಿಡಿಯುತ್ತೇನೆ.",
    personas: {
      farmer: "ನಾನು ಒಬ್ಬ ರೈತ",
      student: "ನಾನು ಒಬ್ಬ ವಿದ್ಯಾರ್ಥಿ",
      senior: "ನಾನು ಒಬ್ಬ ಹಿರಿಯ ನಾಗರಿಕ",
      business: "ನಾನು ಒಂದು ಸಣ್ಣ ವ್ಯಾಪಾರ ನಡೆಸುತ್ತಿದ್ದೇನೆ",
      certificate: "ನನಗೆ ಒಂದು ಪ್ರಮಾಣಪತ್ರ ಬೇಕು",
    },
    examples: [
      "ಸಣ್ಣ ರೈತರಿಗೆ ಸಹಾಯ ಮಾಡುವ ಯೋಜನೆಗಳು ಯಾವುವು?",
      "ಕಾಲೇಜು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು",
      "ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ಪಿಂಚಣಿ",
    ],
    freeNote: "ಉಚಿತ · ಲಾಗಿನ್ ಅಗತ್ಯವಿಲ್ಲ · ನಿಮಗಾಗಿ ಎಂದಿಗೂ ಅರ್ಜಿಗಳನ್ನು ಸಲ್ಲಿಸುವುದಿಲ್ಲ.",
    previewNote:
      "ಮುನ್ನೋಟ — ಉತ್ತರಗಳು ಸಣ್ಣ ಮಾದರಿ ಯೋಜನೆಗಳನ್ನು ಬಳಸುತ್ತವೆ; ಸಂಪೂರ್ಣ, ಪರಿಶೀಲಿತ ಮಾಹಿತಿ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ.",
    composerPlaceholder: "ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯನ್ನು ವಿವರಿಸಿ…",
    trustLine:
      "ಮಾದರಿ ಮಾರ್ಗದರ್ಶನ — ಯಾವಾಗಲೂ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ. ನಾವು ನಿಮಗಾಗಿ ಎಂದಿಗೂ ಅರ್ಜಿಗಳನ್ನು ಸಲ್ಲಿಸುವುದಿಲ್ಲ.",
    searchPlaceholder: "ಈ ಸಂಭಾಷಣೆಯಲ್ಲಿ ಹುಡುಕಿ…",
    searchEmpty: "ಇನ್ನೂ ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಗಳಿಲ್ಲ.",
    micStart: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಪ್ರಾರಂಭಿಸಿ",
    micStop: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ನಿಲ್ಲಿಸಿ",
    micListening: "ಕೇಳುತ್ತಿದೆ…",
  },
  te: {
    welcomeTitle: "మీరు దేనికి అర్హులు?",
    welcomeSubtitle:
      "మీ పరిస్థితిని సాధారణ పదాలలో వివరించండి, మీరు అర్హత పొందగల ప్రభుత్వ పథకాలు, ప్రయోజనాలు మరియు సర్టిఫికెట్లను నేను కనుగొంటాను.",
    personas: {
      farmer: "నేను ఒక రైతు",
      student: "నేను ఒక విద్యార్థి",
      senior: "నేను ఒక సీనియర్ సిటిజన్",
      business: "నేను ఒక చిన్న వ్యాపారం నడుపుతున్నాను",
      certificate: "నాకు ఒక సర్టిఫికెట్ కావాలి",
    },
    examples: [
      "చిన్న రైతులకు సహాయపడే పథకాలు ఏమిటి?",
      "కాలేజీ విద్యార్థుల కోసం స్కాలర్‌షిప్‌లు",
      "సీనియర్ సిటిజన్ల కోసం పెన్షన్",
    ],
    freeNote: "ఉచితం · లాగిన్ అవసరం లేదు · మీ కోసం ఎప్పుడూ దరఖాస్తులు సమర్పించదు.",
    previewNote:
      "ప్రివ్యూ — సమాధానాలు చిన్న నమూనా పథకాలను ఉపయోగిస్తాయి; పూర్తి, ధృవీకరించబడిన సమాచారం త్వరలో వస్తుంది.",
    composerPlaceholder: "మీ పరిస్థితిని వివరించండి…",
    trustLine:
      "నమూనా మార్గదర్శకత్వం — అధికారిక పోర్టల్‌లో ఎల్లప్పుడూ నిర్ధారించుకోండి. మేము మీ కోసం ఎప్పుడూ దరఖాస్తులు సమర్పించము.",
    searchPlaceholder: "ఈ సంభాషణలో శోధించండి…",
    searchEmpty: "ఇంకా సరిపోలికలు లేవు.",
    micStart: "వాయిస్ ఇన్‌పుట్ ప్రారంభించండి",
    micStop: "వాయిస్ ఇన్‌పుట్ ఆపండి",
    micListening: "వింటోంది…",
  },
  mr: {
    welcomeTitle: "तुम्ही कशासाठी पात्र आहात?",
    welcomeSubtitle:
      "तुमची परिस्थिती सोप्या शब्दांत सांगा आणि तुम्ही पात्र असलेल्या सरकारी योजना, लाभ आणि प्रमाणपत्रे मी शोधून काढेन.",
    personas: {
      farmer: "मी एक शेतकरी आहे",
      student: "मी एक विद्यार्थी आहे",
      senior: "मी एक ज्येष्ठ नागरिक आहे",
      business: "मी एक लहान व्यवसाय चालवतो",
      certificate: "मला एक प्रमाणपत्र हवे आहे",
    },
    examples: [
      "लहान शेतकऱ्यांना मदत करणाऱ्या योजना कोणत्या आहेत?",
      "महाविद्यालयीन विद्यार्थ्यांसाठी शिष्यवृत्ती",
      "ज्येष्ठ नागरिकांसाठी पेन्शन",
    ],
    freeNote: "मोफत · लॉगिनची गरज नाही · तुमच्यासाठी कधीही अर्ज सादर करत नाही.",
    previewNote:
      "पूर्वावलोकन — उत्तरे योजनांच्या एका लहान नमुन्याचा वापर करतात; संपूर्ण, सत्यापित माहिती लवकरच येत आहे.",
    composerPlaceholder: "तुमची परिस्थिती सांगा…",
    trustLine:
      "नमुना मार्गदर्शन — नेहमी अधिकृत पोर्टलवर पडताळणी करा. आम्ही तुमच्यासाठी कधीही अर्ज सादर करत नाही.",
    searchPlaceholder: "या संभाषणात शोधा…",
    searchEmpty: "अद्याप कोणतेही जुळणी नाही.",
    micStart: "आवाज इनपुट सुरू करा",
    micStop: "आवाज इनपुट थांबवा",
    micListening: "ऐकत आहे…",
  },
  ur: {
    welcomeTitle: "آپ کس چیز کے اہل ہیں؟",
    welcomeSubtitle:
      "اپنی صورتحال آسان الفاظ میں بیان کریں اور میں وہ سرکاری اسکیمیں، مفادات اور سرٹیفکیٹس تلاش کروں گا جن کے آپ اہل ہو سکتے ہیں۔",
    personas: {
      farmer: "میں ایک کسان ہوں",
      student: "میں ایک طالب علم ہوں",
      senior: "میں ایک بزرگ شہری ہوں",
      business: "میں ایک چھوٹا کاروبار چلاتا ہوں",
      certificate: "مجھے ایک سرٹیفکیٹ کی ضرورت ہے",
    },
    examples: [
      "چھوٹے کسانوں کی مدد کرنے والی اسکیمیں کون سی ہیں؟",
      "کالج طلباء کے لیے وظائف",
      "بزرگ شہریوں کے لیے پنشن",
    ],
    freeNote: "مفت · لاگ ان کی ضرورت نہیں · آپ کی طرف سے کبھی درخواست جمع نہیں کرتا۔",
    previewNote:
      "پیش منظر — جوابات اسکیموں کے ایک چھوٹے نمونے کا استعمال کرتے ہیں؛ مکمل، تصدیق شدہ معلومات جلد آ رہی ہیں۔",
    composerPlaceholder: "اپنی صورتحال بیان کریں…",
    trustLine:
      "نمونہ رہنمائی — ہمیشہ سرکاری پورٹل پر تصدیق کریں۔ ہم آپ کی طرف سے کبھی درخواست جمع نہیں کرتے۔",
    searchPlaceholder: "اس گفتگو میں تلاش کریں…",
    searchEmpty: "ابھی تک کوئی مماثلت نہیں۔",
    micStart: "صوتی ان پٹ شروع کریں",
    micStop: "صوتی ان پٹ بند کریں",
    micListening: "سن رہا ہے…",
  },
  sa: {
    welcomeTitle: "भवान् कस्मै पात्रः अस्ति?",
    welcomeSubtitle:
      "स्वस्थितिं सरलशब्दैः वर्णयन्तु, अहं भवद्योग्यानि सरकारी-योजनानि, लाभान्, प्रमाणपत्राणि च अन्वेषयिष्यामि।",
    personas: {
      farmer: "अहं कृषकः अस्मि",
      student: "अहं छात्रः अस्मि",
      senior: "अहं वृद्धः नागरिकः अस्मि",
      business: "अहं लघु-व्यवसायं सञ्चालयामि",
      certificate: "मम प्रमाणपत्रं आवश्यकम् अस्ति",
    },
    examples: [
      "लघु-कृषकान् साहाय्यं कुर्वन्ति याः योजनाः सन्ति?",
      "महाविद्यालय-छात्राणां शिष्यवृत्तयः",
      "वृद्ध-नागरिकेभ्यः निवृत्ति-वेतनम्",
    ],
    freeNote: "निःशुल्कम् · प्रवेशस्य आवश्यकता नास्ति · भवदर्थं कदापि आवेदनं न समर्पयति।",
    previewNote:
      "पूर्वावलोकनम् — उत्तराणि योजनानां लघु-नमूनां उपयुञ्जते; पूर्णं, सत्यापितं विवरणं शीघ्रम् आगमिष्यति।",
    composerPlaceholder: "स्वस्थितिं वर्णयन्तु…",
    trustLine:
      "नमूना-मार्गदर्शनम् — सदा अधिकृत-द्वारे सत्यापनं कुर्वन्तु। वयं भवदर्थं कदापि आवेदनं न समर्पयामः।",
    searchPlaceholder: "अस्मिन् संवादे अन्वेषणं कुर्वन्तु…",
    searchEmpty: "अद्यापि न किमपि सादृश्यम्।",
    micStart: "स्वर-निवेशं आरभन्तु",
    micStop: "स्वर-निवेशं स्थगयन्तु",
    micListening: "शृणोति…",
  },
  bn: {
    welcomeTitle: "আপনি কী কী সুবিধার জন্য যোগ্য?",
    welcomeSubtitle:
      "আপনার পরিস্থিতি সহজ ভাষায় বর্ণনা করুন, আমি আপনার জন্য উপযুক্ত সরকারি প্রকল্প, সুবিধা এবং সার্টিফিকেট খুঁজে দেব।",
    personas: {
      farmer: "আমি একজন কৃষক",
      student: "আমি একজন ছাত্র",
      senior: "আমি একজন প্রবীণ নাগরিক",
      business: "আমি একটি ছোট ব্যবসা চালাই",
      certificate: "আমার একটি সার্টিফিকেট প্রয়োজন",
    },
    examples: [
      "ছোট কৃষকদের সাহায্য করে এমন প্রকল্প কী কী?",
      "কলেজ ছাত্রদের জন্য বৃত্তি",
      "প্রবীণ নাগরিকদের জন্য পেনশন",
    ],
    freeNote: "ফ্রি · লগইনের প্রয়োজন নেই · আপনার পক্ষ থেকে কখনও আবেদন জমা দেয় না।",
    previewNote:
      "প্রিভিউ — উত্তরগুলি প্রকল্পের একটি ছোট নমুনা ব্যবহার করে; সম্পূর্ণ, যাচাইকৃত তথ্য খুব শীঘ্রই আসছে।",
    composerPlaceholder: "আপনার পরিস্থিতি বর্ণনা করুন…",
    trustLine:
      "নমুনা পরামর্শ — সর্বদা অফিসিয়াল পোর্টালে যাচাই করুন। আমরা আপনার পক্ষ থেকে কখনও আবেদন জমা দিই না।",
    searchPlaceholder: "এই কথোপকথনে অনুসন্ধান করুন…",
    searchEmpty: "এখনও কোনো মিল নেই।",
    micStart: "ভয়েস ইনপুট শুরু করুন",
    micStop: "ভয়েস ইনপুট বন্ধ করুন",
    micListening: "শুনছে…",
  },
};
