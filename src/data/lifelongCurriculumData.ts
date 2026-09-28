import { LandCurriculum, CollegeDefinition, MasterPathwayDefinition, DoctoralArchiveTopic } from '../types/curriculum';
import { GradeLevel } from '../types/character';

export interface GradeMilestone {
  grade: GradeLevel;
  ageRange: string;
  focusDomain: string;
  targetWCPM: number;
  phonemicMilestones: string[];
  comprehensionMilestones: string[];
  masteryRequirements: string;
  scienceOfReadingAnchor: string;
}

export const GRADE_MILESTONES: Record<GradeLevel, GradeMilestone> = {
  'PreK3': {
    grade: 'PreK3',
    ageRange: 'Ages 3-4',
    focusDomain: 'Oral Language & Environmental Sounds',
    targetWCPM: 0,
    phonemicMilestones: ['Recognizes environmental sounds', 'Hears and repeats nursery rhymes', 'Identifies initial sounds in names'],
    comprehensionMilestones: ['Points to pictures in read-alouds', 'Retells familiar story events with picture cues'],
    masteryRequirements: 'Discriminates between sounds and identifies matching initial phonemes in familiar objects.',
    scienceOfReadingAnchor: 'Scarborough’s Rope: Background Knowledge & Phonological Sensitivity'
  },
  'PreK4': {
    grade: 'PreK4',
    ageRange: 'Ages 4-5',
    focusDomain: 'Phonological Awareness & Rhyming',
    targetWCPM: 0,
    phonemicMilestones: ['Claps syllable counts (1-3 syllables)', 'Generates simple rhyming pairs (cat/hat)', 'Isolates initial consonant sounds'],
    comprehensionMilestones: ['Answers simple who/what questions', 'Makes predictions from book cover illustrations'],
    masteryRequirements: 'Consistently segments 2-syllable compound words and blends onset-rimes (c-at).',
    scienceOfReadingAnchor: 'Phonological Sensitivity & Oral Language Vocabulary Architecture'
  },
  'Kindergarten': {
    grade: 'Kindergarten',
    ageRange: 'Ages 5-6',
    focusDomain: 'Letter-Sound Correspondence & CVC Blending',
    targetWCPM: 25,
    phonemicMilestones: ['Blends 3-phoneme CVC words orally (/s/-/a/-/t/)', 'Segments 3 phonemes into individual letter tiles', 'Identifies all 26 upper & lowercase letters + sounds'],
    comprehensionMilestones: ['Identifies characters, setting, and main event', 'Matches spoken words to decodable text'],
    masteryRequirements: 'Accurately decodes 25+ CVC short vowel words and recognizes 20 heart words.',
    scienceOfReadingAnchor: 'Grapheme-Phoneme Mapping & Linear Alphabetic Principle'
  },
  'Grade 1': {
    grade: 'Grade 1',
    ageRange: 'Ages 6-7',
    focusDomain: 'Blends, Digraphs & Silent E (CVCe)',
    targetWCPM: 60,
    phonemicMilestones: ['Decodes consonant digraphs (sh, ch, th, wh, ck)', 'Mastery of initial/final consonant blends (st, bl, nd)', 'Applies Silent-E long vowel rule (cap -> cape)'],
    comprehensionMilestones: ['Answers direct text-dependent questions', 'Identifies sequence of events (first, next, then, finally)'],
    masteryRequirements: 'Fluency in short vowels, consonant digraphs, and silent-e long vowel transformations.',
    scienceOfReadingAnchor: 'Orthographic Mapping of Common Spelling Patterns'
  },
  'Grade 2': {
    grade: 'Grade 2',
    ageRange: 'Ages 7-8',
    focusDomain: 'Vowel Teams, Diphthongs & Multisyllabic Words',
    targetWCPM: 90,
    phonemicMilestones: ['Decodes regular vowel teams (ai/ay, ee/ea, oa/ow)', 'Identifies diphthongs (oi/oy, ou/ow)', 'Segments two-syllable open & closed syllables (rab-bit, ro-bot)'],
    comprehensionMilestones: ['Infers character emotions and motives', 'Summarizes central moral or lesson of fables'],
    masteryRequirements: 'Reads grade-level decodable text with 95%+ accuracy and expressive prosody.',
    scienceOfReadingAnchor: 'Advanced Orthographic Mapping & Syllable Division Rules'
  },
  'Grade 3': {
    grade: 'Grade 3',
    ageRange: 'Ages 8-9',
    focusDomain: 'Morphology Basics, Affixes & Fluency',
    targetWCPM: 115,
    phonemicMilestones: ['Identifies common prefixes (un-, re-, dis-, pre-)', 'Identifies common suffixes (-ful, -less, -able, -ment)', 'Recognizes base words and inflectional endings'],
    comprehensionMilestones: ['Determines main idea with supporting key details', 'Uses context clues to define unfamiliar tier-2 vocabulary'],
    masteryRequirements: 'Transitions from "learning to read" to "reading to learn" with high automaticity.',
    scienceOfReadingAnchor: 'Morphological Awareness & Lexical Retrieval Speed'
  },
  'Grade 4': {
    grade: 'Grade 4',
    ageRange: 'Ages 9-10',
    focusDomain: 'Latin Roots & Complex Multisyllabic Words',
    targetWCPM: 130,
    phonemicMilestones: ['Recognizes high-frequency Latin roots (port, dict, struct, tract)', 'Decodes 3-4 syllable academic words (construction, transportable)', 'Understands hard/soft C and G rules across syllables'],
    comprehensionMilestones: ['Analyzes text structures (cause/effect, compare/contrast)', 'Distinguishes between first and third-person points of view'],
    masteryRequirements: 'Deconstructs multisyllabic Latin-derived academic terms into prefix + root + suffix.',
    scienceOfReadingAnchor: 'Etymological Morphology & Academic Register Acquisition'
  },
  'Grade 5': {
    grade: 'Grade 5',
    ageRange: 'Ages 10-11',
    focusDomain: 'Greek Roots & Disciplinary Vocabulary',
    targetWCPM: 145,
    phonemicMilestones: ['Recognizes Greek combining forms (bio, graph, phon, tele, geo)', 'Analyzes morphophonemic shifts (sign -> signal, nature -> natural)', 'Etymological spelling rules (ch = /k/ in Greek roots)'],
    comprehensionMilestones: ['Synthesizes information from multiple informational sources', 'Evaluates author purpose and bias in persuasive articles'],
    masteryRequirements: 'Mastery of morphological deconstruction for high-tier scientific and literary texts.',
    scienceOfReadingAnchor: 'Morphophonemic Fluency & Disciplinary Literacy'
  },
  'Grade 6': {
    grade: 'Grade 6',
    ageRange: 'Ages 11-12',
    focusDomain: 'Syntax Architecture & Sentence Crafting',
    targetWCPM: 155,
    phonemicMilestones: ['Analyzes compound-complex sentence mechanics', 'Applies punctuation for restrictive vs non-restrictive clauses', 'Mastery of active vs passive voice impact on semantics'],
    comprehensionMilestones: ['Cites textual evidence to support inferential claims', 'Traces argument validity and identifies unsupported assertions'],
    masteryRequirements: 'Syntactic parsing of complex subordinate clauses and persuasive rhetoric.',
    scienceOfReadingAnchor: 'Syntactic Awareness & Text Structure Knowledge'
  },
  'Grade 7': {
    grade: 'Grade 7',
    ageRange: 'Ages 12-13',
    focusDomain: 'Rhetorical Devices & Nuanced Diction',
    targetWCPM: 165,
    phonemicMilestones: ['Distinguishes denotation vs subtle emotional connotation', 'Decodes archaic and poetic contractions in historical texts', 'Analyzes cadence and meter in oratorical prose'],
    comprehensionMilestones: ['Analyzes how an author develops conflicting perspectives', 'Deconstructs extended allegories and metaphors'],
    masteryRequirements: 'Deconstructs rhetorical appeals (Ethos, Pathos, Logos) in historic speeches.',
    scienceOfReadingAnchor: 'Semantic Pragmatics & Cognitive Text Processing'
  },
  'Grade 8': {
    grade: 'Grade 8',
    ageRange: 'Ages 13-14',
    focusDomain: 'Argumentative Rigor & Counter-Claims',
    targetWCPM: 175,
    phonemicMilestones: ['Critiques logical fallacies (ad hominem, false dilemma)', 'Mastery of formal academic vocabulary transitions', 'Evaluates auditory prosody in formal debates'],
    comprehensionMilestones: ['Evaluates soundness of reasoning in opposing arguments', 'Identifies subtle nuances in author tone and mood'],
    masteryRequirements: 'Constructs evidence-based written and oral counter-arguments with formal citations.',
    scienceOfReadingAnchor: 'Argument Schema & Critical Thinking Integration'
  },
  'Grade 9': {
    grade: 'Grade 9',
    ageRange: 'Ages 14-15',
    focusDomain: 'Classical Literature & World Epics',
    targetWCPM: 185,
    phonemicMilestones: ['Analyzes iambic pentameter and poetic scansion', 'Traces historical shifts in Great Vowel Shift phonetics', 'Mastery of Latinate legal and political idioms'],
    comprehensionMilestones: ['Analyzes parallel thematic structures across world epics', 'Critiques character arcs through psychological archetype frameworks'],
    masteryRequirements: 'Deconstructs classical dramatic irony, tragic flaws, and structural motifs.',
    scienceOfReadingAnchor: 'Advanced Literary Cognitive Modeling & Archetypal Literacy'
  },
  'Grade 10': {
    grade: 'Grade 10',
    ageRange: 'Ages 15-16',
    focusDomain: 'World Literature & Cross-Cultural Semantics',
    targetWCPM: 195,
    phonemicMilestones: ['Analyzes sociolinguistic dialects and vernacular registers', 'Decodes loanwords from French, German, Arabic, Sanskrit', 'Understands phonological drift in translation studies'],
    comprehensionMilestones: ['Compares foundational texts across distinct global civilizations', 'Analyzes authorial voice across divergent cultural perspectives'],
    masteryRequirements: 'Synthesizes thematic discourse across translated world literature masterpieces.',
    scienceOfReadingAnchor: 'Cross-Linguistic Transfer & Sociolinguistic Awareness'
  },
  'Grade 11': {
    grade: 'Grade 11',
    ageRange: 'Ages 16-17',
    focusDomain: 'American Rhetoric, Historical Treatises & Satire',
    targetWCPM: 205,
    phonemicMilestones: ['Analyzes cadence, chiasmus, anaphora in monumental orations', 'Deconstructs subtle satirical irony and double entendres', 'Applies AP-level stylistic grammatical inversions'],
    comprehensionMilestones: ['Traces democratic foundational documents and Supreme Court opinions', 'Evaluates philosophical underpinnings of American Transcendentalism and Realism'],
    masteryRequirements: 'Rhetorical analysis essay synthesis matching collegiate AP/IB rigor.',
    scienceOfReadingAnchor: 'Rhetorical Analysis & Deep Syntactic Deconstruction'
  },
  'Grade 12': {
    grade: 'Grade 12',
    ageRange: 'Ages 17-18',
    focusDomain: 'Capstone Senior Thesis & Philosophical Discourse',
    targetWCPM: 215,
    phonemicMilestones: ['Mastery of academic register across multiple scientific & humanities genres', 'Advanced oratorical defense delivery and Q&A extemporaneous debate', 'Refinement of voice, authoritative persona, and precision diction'],
    comprehensionMilestones: ['Synthesizes scholarly peer-reviewed academic literature', 'Evaluates epistemological claims and foundational philosophical treatises'],
    masteryRequirements: 'Defends Senior Graduation Capstone before the High Council of Lexicon Empire.',
    scienceOfReadingAnchor: 'Disciplinary Literacy Synthesis & Epistemological Reading'
  },
  'College': {
    grade: 'College',
    ageRange: 'Undergraduate',
    focusDomain: 'Specialized Academic Colleges & Seminars',
    targetWCPM: 230,
    phonemicMilestones: ['Phonetics & IPA (International Phonetic Alphabet) transcriptions', 'Syntax parsing trees (Chomskyan Generative Grammar)', 'Diachronic sound change laws (Grimm’s Law, Verner’s Law)'],
    comprehensionMilestones: ['Critical deconstruction of primary research methodologies', 'Cross-disciplinary synthesis across humanities and cognitive science'],
    masteryRequirements: 'Completion of 120 credit units across 8 Phonixia Academy Colleges with an original Capstone.',
    scienceOfReadingAnchor: 'Theoretical Linguistics & Collegiate Research Competency'
  },
  'Graduate School': {
    grade: 'Graduate School',
    ageRange: 'Master’s Candidate',
    focusDomain: 'Master’s Practicum & Applied Literacy Scholarship',
    targetWCPM: 250,
    phonemicMilestones: ['Speech acoustic spectrogram analysis and formant frequency tracking', 'Diagnostic literacy intervention plan design (Orton-Gillingham / Wilson)', 'Neurolinguistic mapping of dyslexic vs neurotypical reading pathways'],
    comprehensionMilestones: ['Original quantitative and qualitative empirical research designs', 'Meta-analytic reviews of reading interventions and pedagogical efficacy'],
    masteryRequirements: 'Successful defense of a Master’s Thesis in one of 7 Specialized Literacy Pathways.',
    scienceOfReadingAnchor: 'Applied Clinical Reading Science & Master Pedagogy'
  },
  'Doctorate': {
    grade: 'Doctorate',
    ageRange: 'Doctoral Scholar (PhD)',
    focusDomain: 'The Celestial Archives: Paradigm-Shifting Literacy Discovery',
    targetWCPM: 275,
    phonemicMilestones: ['Neuroimaging fMRI correlates of graphemic representation', 'Computational linguistics, Transformer LLM semantic vector spaces', 'Decipherment and preservation of endangered ancient writing systems'],
    comprehensionMilestones: ['Creation of novel theoretical frameworks for human-machine literacy synthesis', 'Dissertation defense before the Celestial Senate of Flamekeepers'],
    masteryRequirements: 'Publication and peer-reviewed defense of Doctoral Dissertation earning the supreme title: MASTER OF PHONIXIA.',
    scienceOfReadingAnchor: 'Theoretical Neurolinguistics & Master of Phonixia Legacy'
  },
  'Adult Lifelong Learning': {
    grade: 'Adult Lifelong Learning',
    ageRange: 'Adults & Lifelong Scholars',
    focusDomain: 'Executive Communication, Creative Writing & Personal Mastery',
    targetWCPM: 240,
    phonemicMilestones: ['Professional eloquence in executive keynote and board presentations', 'Creative novel writing, dialogue cadence, and narrative pacing', 'Lifelong vocabulary expansion and etymological exploration'],
    comprehensionMilestones: ['Critical media literacy in the age of algorithmic and generative information', 'Philosophical contemplation of literature as a mirror of human experience'],
    masteryRequirements: 'Continuous mastery questing with self-directed inquiry and mentorship of new explorers.',
    scienceOfReadingAnchor: 'Andragogy & Lifelong Neuroplastic Literacy Enrichment'
  }
};

export const PHONIXIA_COLLEGES: CollegeDefinition[] = [
  {
    id: 'linguistics',
    name: 'College of Linguistics',
    deityDean: 'Dean Phonemius',
    motto: 'Vox Humana, Lux Mentis (The Human Voice, The Light of Mind)',
    focus: 'Phonology, Phonetics, Syntax Trees, Morphology, and Historical Sound Shifts',
    courses: ['LIN-101: International Phonetic Alphabet', 'LIN-204: Indo-European Roots & Grimm’s Law', 'LIN-350: Generative Syntax & Tree Parsing', 'LIN-490: Acoustic Spectrography of Vowels'],
    careerOutcomes: ['Linguist', 'Speech Scientist', 'Language Preservationist', 'NLP Engineer'],
    capstoneProject: 'Constructing an entire reconstructed proto-language with phonemic laws.',
    color: '#3b82f6'
  },
  {
    id: 'storycraft',
    name: 'College of Storycraft',
    deityDean: 'Arch-Narrator Celine',
    motto: 'Fabulam Tessere Mundum Creare (To Weave a Tale is to Create a World)',
    focus: 'Creative Writing, Narrative Architecture, Hero’s Journey, Character Psychology',
    courses: ['STR-102: Archetypes of the Underworld', 'STR-215: Prose Cadence & Sensory Texture', 'STR-330: Nonlinear Storytelling & Tension Arcs', 'STR-495: Epic Worldbuilding Workshop'],
    careerOutcomes: ['Novelist', 'Screenwriter', 'Game Narrative Designer', 'Creative Director'],
    capstoneProject: 'A full-length published manuscript exploring the mythos of the Golden Phonix.',
    color: '#8b5cf6'
  },
  {
    id: 'rhetoric',
    name: 'College of Rhetoric',
    deityDean: 'Chancellor Demosthenes',
    motto: 'Veritas per Eloquentiam (Truth Through Eloquence)',
    focus: 'Classical Rhetoric, Parliamentary Debate, Persuasion, Fallacy Deconstruction',
    courses: ['RHT-105: The Aristotelian Triad', 'RHT-220: Forensic Debate & Cross-Examination', 'RHT-340: Political Discourse & Propaganda Analysis', 'RHT-480: The Art of the Keynote Orator'],
    careerOutcomes: ['Constitutional Attorney', 'Diplomat', 'Policy Advocate', 'Executive Orator'],
    capstoneProject: 'Live Parliamentary Oratorical Defense before the Senate of Lexicon Empire.',
    color: '#ef4444'
  },
  {
    id: 'literature',
    name: 'College of Literature',
    deityDean: 'High Scholar Beatrice',
    motto: 'Tempora Mutantur, Libri Manent (Times Change, Books Remain)',
    focus: 'Comparative World Literature, Critical Theory, Hermeneutics, Allegory',
    courses: ['LIT-110: Epic Poetry from Gilgamesh to Dante', 'LIT-235: The Rise of the Novel in Global Contexts', 'LIT-360: Post-Colonial Narratives & Subversion', 'LIT-490: Hermeneutics & Semiotic Analysis'],
    careerOutcomes: ['Literary Critic', 'University Professor', 'Editor-in-Chief', 'Curator of Rare Texts'],
    capstoneProject: 'Critical Monograph deconstructing the symbolic evolution of mythological flame.',
    color: '#f59e0b'
  },
  {
    id: 'etymology',
    name: 'College of Etymology',
    deityDean: 'Elder Philologus',
    motto: 'Radices Verborum, Radices Animarum (Roots of Words, Roots of Souls)',
    focus: 'Greek, Latin, Old English, Sanskrit, Language Archaeology, Paleography',
    courses: ['ETY-101: The Classical Greek Lexicon', 'ETY-210: Imperial Latin Legal & Scientific Inscriptions', 'ETY-325: Runes, Glyphs, and Cuneiform Decipherment', 'ETY-475: Semantic Drift Across Millennia'],
    careerOutcomes: ['Etymologist', 'Paleographer', 'Museum Curator', 'Historical Lexicographer'],
    capstoneProject: 'Excavation and translation of a lost ancient tablet from Whispering Peaks.',
    color: '#10b981'
  },
  {
    id: 'grammar-arcanum',
    name: 'College of Grammar Arcanum',
    deityDean: 'Grand Syntactician Kam',
    motto: 'Ordo Verborum Constellatio Veritatis (The Order of Words is the Constellation of Truth)',
    focus: 'Deep Syntax, Transformational Grammar, Punctuation Mastery, Sentence Diagramming',
    courses: ['GRM-101: Foundations of Structural Parsing', 'GRM-212: Reed-Kellogg vs Chomskyan Diagrams', 'GRM-345: Stylistic Inversions & Elliptical Clauses', 'GRM-488: Computational Syntax of Ambiguous Sentences'],
    careerOutcomes: ['Grammarian', 'Technical Editor', 'Linguistic Taxonomist', 'Language AI Architect'],
    capstoneProject: 'Creation of a complete generative grammar parser for magical enchantments.',
    color: '#06b6d4'
  },
  {
    id: 'professional-writing',
    name: 'College of Professional Writing',
    deityDean: 'Director Julian',
    motto: 'Claritas in Negotio (Clarity in Purpose and Action)',
    focus: 'Technical Communication, Journalism, Investigative Reporting, Grant Writing',
    courses: ['PWR-105: Journalism Ethics & Fact-Checking', 'PWR-225: White Papers & Technical Documentation', 'PWR-350: Science Communication for the Public', 'PWR-470: Executive Strategy & Crisis Communications'],
    careerOutcomes: ['Investigative Journalist', 'Chief Communications Officer', 'Lead Technical Writer'],
    capstoneProject: 'An investigative dossier uncovering real-world literacy access across regions.',
    color: '#ec4899'
  },
  {
    id: 'research',
    name: 'College of Research',
    deityDean: 'Dean Rosalind',
    motto: 'Ad Fontes et Ultra (To the Sources and Beyond)',
    focus: 'Qualitative & Quantitative Methodologies, Citation Rigor, Meta-Analysis',
    courses: ['RES-101: Academic Integrity & Primary Sources', 'RES-220: Statistical Significance in Literacy Trials', 'RES-340: Longitudinal Cognitive Studies', 'RES-499: Peer Review & Scholarly Publication'],
    careerOutcomes: ['Principal Investigator', 'Director of Educational Research', 'Think Tank Fellow'],
    capstoneProject: 'Peer-reviewed published paper on multisensory phonics intervention efficacy.',
    color: '#84cc16'
  }
];

export const MASTER_PATHWAYS: MasterPathwayDefinition[] = [
  {
    id: 'master-author',
    title: 'Master Author',
    disciplines: ['Advanced Narrative Structure', 'Poetic Cadence', 'World Mythos Weaving'],
    practicumRequirement: 'Publish a multi-volume literary saga and mentor 5 apprentice scribes.',
    thesisTopic: 'Resonance of Archetypal Heroes in Children’s Decodable Literature',
    loreMasterTitle: 'Weaver of Realities',
    color: '#8b5cf6'
  },
  {
    id: 'master-educator',
    title: 'Master Educator',
    disciplines: ['Structured Literacy Pedagogy', 'Universal Design for Learning', 'Montessori Tactile Phonics'],
    practicumRequirement: 'Conduct 200 clinical intervention hours with struggling readers.',
    thesisTopic: 'Optimizing Multisensory Feedback in Early Alphabetic Orthographic Mapping',
    loreMasterTitle: 'Illuminator of Minds',
    color: '#3b82f6'
  },
  {
    id: 'master-researcher',
    title: 'Master Researcher',
    disciplines: ['Psycholinguistics', 'Randomized Control Trials in Literacy', 'Neuroimaging of Reading'],
    practicumRequirement: 'Design and execute a multi-district literacy growth meta-study.',
    thesisTopic: 'Longitudinal Impact of Systematic Synthetic Phonics vs Balanced Literacy',
    loreMasterTitle: 'Keeper of Empirical Truth',
    color: '#10b981'
  },
  {
    id: 'master-linguist',
    title: 'Master Linguist',
    disciplines: ['Diachronic Phonology', 'Morphosyntax', 'Sociolinguistic Dialectology'],
    practicumRequirement: 'Document an endangered indigenous language dialect and its phonetic rules.',
    thesisTopic: 'Phonological Drift and the Great Vowel Shift’s Impact on Modern English Orthography',
    loreMasterTitle: 'Custodian of Tongues',
    color: '#06b6d4'
  },
  {
    id: 'master-communicator',
    title: 'Master Communicator',
    disciplines: ['Crisis Rhetoric', 'Digital Media Literacy', 'Cross-Cultural Discourse'],
    practicumRequirement: 'Direct a global communication campaign uniting divergent factions.',
    thesisTopic: 'Algorithmic Information Framing and the Erosion of Nuanced Reading Comprehension',
    loreMasterTitle: 'Bridge of Understanding',
    color: '#f59e0b'
  },
  {
    id: 'master-literacy-specialist',
    title: 'Master Literacy Specialist',
    disciplines: ['Dyslexia Diagnosis & Remediation', 'Orton-Gillingham Fellow Standards', 'MTSS Tier 3 Interventions'],
    practicumRequirement: 'Guide 50 children diagnosed with severe phonological dyslexia to grade-level reading fluency.',
    thesisTopic: 'Neuroplastic Rehabilitation of Left-Hemisphere Temporal-Parietal Reading Networks',
    loreMasterTitle: 'Healer of the Printed Word',
    color: '#ec4899'
  },
  {
    id: 'master-orator',
    title: 'Master Orator',
    disciplines: ['Extemporaneous Speech', 'Voice Modulation & Prosody', 'Classical Dialectic'],
    practicumRequirement: 'Deliver a transformative 45-minute address to the Assembly of Nations.',
    thesisTopic: 'The Neurobiology of Auditory Prosody and Emotional Persuasion in Public Oratory',
    loreMasterTitle: 'Voice of the Eternal Flame',
    color: '#ef4444'
  }
];

export const DOCTORAL_ARCHIVE_TOPICS: DoctoralArchiveTopic[] = [
  {
    id: 'reading-science',
    title: 'Cognitive Science of Reading & The Reading Brain',
    subfields: ['Scarborough’s Reading Rope', 'Stanislas Dehaene’s Neuronal Recycling Hypothesis', 'The Four-Part Processing Model (Seidenberg & McClelland)'],
    researchExpedition: 'Expedition to the Synaptic Labyrinth: Tracking how the visual word form area (VWFA) maps letters to sounds in milliseconds.',
    dissertationDefenseChallenge: 'Synthesize the neurobiological architecture of reading into a universal model that eradicates preventable literacy failure.',
    masterySeal: 'Seal of the Cognitive Luminary'
  },
  {
    id: 'language-acquisition',
    title: 'Universal Language Acquisition & Neurolinguistics',
    subfields: ['Chomskyan Universal Grammar', 'Statistical Learning in Infancy', 'Critical Period Plasticity'],
    researchExpedition: 'Expedition to the Cradle of Tongues: Analyzing how 12-month-old human infants filter acoustic phonemes into native language categories.',
    dissertationDefenseChallenge: 'Formulate a unified developmental framework for infant-to-adult multi-language acquisition.',
    masterySeal: 'Seal of the Primordial Voice'
  },
  {
    id: 'historical-linguistics',
    title: 'Historical Linguistics & The Evolution of Writing',
    subfields: ['Proto-Indo-European Reconstructions', 'Phoenician Alphabet Origins', 'Cuneiform, Egyptian Hieroglyphs & Mayan Logograms'],
    researchExpedition: 'Expedition to the Ancient Citadel of Ashurbanipal: Deciphering the transition from pictograms to phonetic alphabets.',
    dissertationDefenseChallenge: 'Prove the genealogical link between ancient phonetic scripts and modern orthographies.',
    masterySeal: 'Seal of the Eternal Scribe'
  },
  {
    id: 'ai-and-language',
    title: 'Artificial Intelligence, LLMs & Human Literacy Symbiosis',
    subfields: ['Transformer Attention Mechanisms', 'Semantic Embedding Spaces', 'Human vs Machine Reading Comprehension'],
    researchExpedition: 'Expedition to the Neural Horizon: Comparing artificial neural network latent representations with human fMRI brain activations during narrative reading.',
    dissertationDefenseChallenge: 'Design the paradigm for human intellectual empowerment in the era of generative language models.',
    masterySeal: 'Seal of the Digital Oracle'
  },
  {
    id: 'language-preservation',
    title: 'Language Preservation & Global Linguistic Ecology',
    subfields: ['Endangered Language Revitalization', 'Oral Traditions Documentation', 'Ethnolinguistic Cognitive Diversity'],
    researchExpedition: 'Expedition to the Whispering Glades: Recording the last 3 speakers of an ancient oral dialect and constructing a living interactive curriculum.',
    dissertationDefenseChallenge: 'Establish the international legal and technological infrastructure to safeguard all 7,000 living human languages.',
    masterySeal: 'Seal of the Global Flamekeeper'
  }
];

export const MASTER_OF_PHONIXIA_CREED = `
"By the flame of sound, by the architecture of letters,
by the heart of the irregular word, by the roots of our ancestors,
and by the majestic empire of thought and rhetoric:
I stand as Master of Phonixia.
Language is not merely a tool; it is the sacred bond of humanity,
the light against darkness, and the eternal spark of freedom."
`;
