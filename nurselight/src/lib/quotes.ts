export interface Quote {
  text: string;
  author: string;
  category: "stoicism" | "compassion" | "resilience" | "mindfulness" | "purpose" | "healing";
}

export const quotes: Quote[] = [
  // Stoicism & Inner Strength
  {
    text: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    category: "stoicism",
  },
  {
    text: "The soul becomes dyed with the colour of its thoughts.",
    author: "Marcus Aurelius",
    category: "stoicism",
  },
  {
    text: "It is not that we have a short time to live, but that we waste a great deal of it.",
    author: "Seneca",
    category: "stoicism",
  },
  {
    text: "We suffer more often in imagination than in reality.",
    author: "Seneca",
    category: "stoicism",
  },
  {
    text: "Man is not worried by real problems so much as by his imagined anxieties about real problems.",
    author: "Epictetus",
    category: "stoicism",
  },
  {
    text: "First say to yourself what you would be; and then do what you have to do.",
    author: "Epictetus",
    category: "stoicism",
  },

  // Compassion & Healing
  {
    text: "If you want others to be happy, practice compassion. If you want to be happy, practice compassion.",
    author: "Dalai Lama",
    category: "compassion",
  },
  {
    text: "The wound is the place where the Light enters you.",
    author: "Rumi",
    category: "compassion",
  },
  {
    text: "What you seek is seeking you.",
    author: "Rumi",
    category: "compassion",
  },
  {
    text: "Carry out a random act of kindness, with no expectation of reward, safe in the knowledge that one day someone might do the same for you.",
    author: "Princess Diana",
    category: "compassion",
  },
  {
    text: "Too often we underestimate the power of a touch, a smile, a kind word, a listening ear, an honest compliment, or the smallest act of caring.",
    author: "Leo Buscaglia",
    category: "compassion",
  },
  {
    text: "Where there is great love, there are always miracles.",
    author: "Willa Cather",
    category: "compassion",
  },

  // Resilience
  {
    text: "The oak fought the wind and was broken, the willow bent when it must and survived.",
    author: "Robert Jordan",
    category: "resilience",
  },
  {
    text: "Out of suffering have emerged the strongest souls; the most massive characters are seared with scars.",
    author: "Kahlil Gibran",
    category: "resilience",
  },
  {
    text: "You were given this life because you are strong enough to live it.",
    author: "Ain Eineziz",
    category: "resilience",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "resilience",
  },
  {
    text: "She stood in the storm, and when the wind did not blow her way, she adjusted her sails.",
    author: "Elizabeth Edwards",
    category: "resilience",
  },
  {
    text: "The human spirit is stronger than anything that can happen to it.",
    author: "C.C. Scott",
    category: "resilience",
  },

  // Mindfulness & Presence
  {
    text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
    author: "Thich Nhat Hanh",
    category: "mindfulness",
  },
  {
    text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.",
    author: "Thich Nhat Hanh",
    category: "mindfulness",
  },
  {
    text: "Almost everything will work again if you unplug it for a few minutes — including you.",
    author: "Anne Lamott",
    category: "mindfulness",
  },
  {
    text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.",
    author: "Hermann Hesse",
    category: "mindfulness",
  },
  {
    text: "Be where you are, not where you think you should be.",
    author: "Unknown",
    category: "mindfulness",
  },
  {
    text: "Silence is not empty. It is full of answers.",
    author: "Unknown",
    category: "mindfulness",
  },

  // Purpose & Meaning
  {
    text: "To know even one life has breathed easier because you have lived. This is to have succeeded.",
    author: "Ralph Waldo Emerson",
    category: "purpose",
  },
  {
    text: "The best way to find yourself is to lose yourself in the service of others.",
    author: "Mahatma Gandhi",
    category: "purpose",
  },
  {
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    category: "purpose",
  },
  {
    text: "Nursing is not just a profession, it is a calling of the heart.",
    author: "Unknown",
    category: "purpose",
  },
  {
    text: "They may forget your name, but they will never forget how you made them feel.",
    author: "Maya Angelou",
    category: "purpose",
  },
  {
    text: "Not all of us can do great things. But we can do small things with great love.",
    author: "Mother Teresa",
    category: "purpose",
  },

  // Healing & Self-Care
  {
    text: "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit. Then get back to work.",
    author: "Ralph Marston",
    category: "healing",
  },
  {
    text: "Caring for myself is not self-indulgence, it is self-preservation, and that is an act of political warfare.",
    author: "Audre Lorde",
    category: "healing",
  },
  {
    text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.",
    author: "Buddha",
    category: "healing",
  },
  {
    text: "Healing takes courage, and we all have courage, even if we have to dig a little to find it.",
    author: "Tori Amos",
    category: "healing",
  },
  {
    text: "Your calm mind is the ultimate weapon against your challenges.",
    author: "Bryant McGill",
    category: "healing",
  },
  {
    text: "Be gentle with yourself, you are doing the best you can.",
    author: "Unknown",
    category: "healing",
  },
];

export function getDailyQuote(): Quote {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return quotes[dayOfYear % quotes.length];
}

export function getRandomQuote(category?: Quote["category"]): Quote {
  const filtered = category ? quotes.filter((q) => q.category === category) : quotes;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function shuffleQuotes(arr: Quote[]): Quote[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const categoryLabels: Record<Quote["category"], string> = {
  stoicism: "Inner Strength",
  compassion: "Compassion",
  resilience: "Resilience",
  mindfulness: "Mindfulness",
  purpose: "Purpose",
  healing: "Healing",
};

export const categoryEmoji: Record<Quote["category"], string> = {
  stoicism: "🏛️",
  compassion: "💛",
  resilience: "🌱",
  mindfulness: "🧘",
  purpose: "✨",
  healing: "🌿",
};
