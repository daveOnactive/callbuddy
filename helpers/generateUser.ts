function getRandomElement(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomNickname() {
  const adjectives = [
    "Proud",
    "Brave",
    "Radiant",
    "Vibrant",
    "Bold",
    "Courageous",
    "Fabulous",
    "Glittering",
    "Resilient",
    "Fierce",
    "Dazzling",
    "Joyful",
    "Sparkling",
    "Luminous",
    "Euphoric",
    "Empowered",
    "Passionate",
    "Triumphant",
    "Majestic",
    "Graceful",
    "Daring",
    "Confident",
    "Luminous",
    "Radiant",
    "Dazzling",
  ];

  const nouns = [
    "Rainbow",
    "Unicorn",
    "Phoenix",
    "Warrior",
    "Star",
    "Butterfly",
    "Dragon",
    "Hero",
    "Mermaid",
    "Phoenix",
    "Harmony",
    "Celebration",
    "Spirit",
    "Blaze",
    "Glimmer",
    "Echo",
    "Beacon",
    "Wonder",
    "Cherub",
    "Glory",
    "Blossom",
    "Marvel",
    "Spark",
    "Twinkle",
    "Gem",
  ];

  const adjective = getRandomElement(adjectives);
  const noun = getRandomElement(nouns);
  return `${adjective} ${noun}`;
}

function generateRandomAvatar() {
  const avatars = [
    "Bandit",
    "Snuggles",
    "Callie",
    "Lola",
    "Cookie",
    "Bob",
    "Molly",
    "Charlie",
    "Miss kitty",
    "Chester",
    "Buddy",
    "Trouble",
    "Scooter",
    "Oliver",
    "Simon",
    "Tigger",
    "Abby",
    "Baby",
    "Dusty",
    "Boots",
  ];

  return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${getRandomElement(avatars)}`;
}

export function generateUser() {
  return {
    name: generateRandomNickname(),
    avatarUrl: generateRandomAvatar(),
  };
}
