// ─── Love notes & interactive object definitions ────────────────────────────
export const LOVE_NOTES = {
  BEACH: [
    {
      id: 'beach-1',
      type: 'shell',
      title: 'First Date Beach',
      message:
        "I remember being so nervous I almost said the wrong name to the waiter. You laughed, and somehow that made it easy. I knew within the hour I wanted a thousand more evenings exactly like that one.",
    },
    {
      id: 'beach-2',
      type: 'bottle',
      title: 'A Note in a Bottle',
      message:
        "If future-us ever forgets: it started with cold fries, a borrowed jacket, and you pretending you weren't cold so we could stay a little longer.",
    },
    {
      id: 'beach-3',
      type: 'starfish',
      title: 'Low Tide',
      message:
        "You collect the ugliest shells and love them the most. I think that's the whole secret to how you love people too.",
    },
  ],
  FOREST: [
    {
      id: 'forest-1',
      type: 'heart',
      title: 'Memory Forest',
      message:
        "Every tree here is a night we stayed up too late talking about nothing and everything. I planted this one for the time you called me at 2am just to read me a poem.",
    },
    {
      id: 'forest-2',
      type: 'lantern',
      title: 'The Path We Took',
      message:
        "Getting lost with you on that hiking trail remains, somehow, one of my favorite afternoons ever. Wrong turns are better with the right person.",
    },
    {
      id: 'forest-3',
      type: 'firefly',
      title: 'Quiet Woods',
      message:
        "You once said silence with me never feels empty. That might be the nicest thing anyone's ever told me.",
    },
    {
      id: 'forest-4',
      type: 'heart',
      title: 'Underneath the Pines',
      message:
        "I like who I am when I'm around you. Steadier. Softer. More myself, somehow, than when I'm alone.",
    },
  ],
  HOME: [
    {
      id: 'home-1',
      type: 'envelope',
      title: 'Home Hill',
      message:
        "This is the house in my head when I think of 'someday.' Messy kitchen, your socks always missing, both of us arguing sweetly about what to watch. Someday looks a lot like you.",
    },
    {
      id: 'home-2',
      type: 'flowerheart',
      title: 'Sunday Mornings',
      message:
        "Pancakes that always come out a little burnt, coffee that's always a little too strong, and you humming off-key in the kitchen. I want a hundred more Sundays like that.",
    },
    {
      id: 'home-3',
      type: 'envelope',
      title: 'Little Things',
      message:
        "You remember how I take my tea. You save me the last bite. You text 'landed safe' every single time. Love is built entirely out of things this small.",
    },
  ],
  CITY: [
    {
      id: 'city-1',
      type: 'star',
      title: 'Future City',
      message:
        "This is where we're headed — whatever it looks like, however far off. New places, new chapters, still choosing each other on purpose, every time.",
    },
    {
      id: 'city-2',
      type: 'heart',
      title: 'Someday, Somewhere',
      message:
        "I don't know exactly what our future holds, but I know I want you standing next to me for all of it, wherever 'there' ends up being.",
    },
    {
      id: 'city-3',
      type: 'lantern',
      title: 'City Lights',
      message:
        "Every skyline we haven't seen yet, every language we haven't butchered together, every apartment we haven't argued about decorating — I can't wait for all of it, with you.",
    },
  ],
}

export function getAllNotesFlat() {
  return Object.entries(LOVE_NOTES).flatMap(([zoneKey, notes]) =>
    notes.map((n) => ({ ...n, zoneKey }))
  )
}
