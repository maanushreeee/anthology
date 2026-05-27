"""
Run this script from your backend root:
    python seed_new_users_articles.py
"""

from pymongo import MongoClient
from datetime import datetime, timezone
from uuid import uuid4
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = MongoClient(MONGO_URI)
db = client["publishing_platform"]
articles_collection = db["articles"]

def now():
    return datetime.now(timezone.utc)

def dt(year, month, day, hour=10):
    return datetime(year, month, day, hour, 0, tzinfo=timezone.utc)

all_articles = [

    # ─────────────────────────────────────────
    # sam_writes
    # ─────────────────────────────────────────
    {
        "id": str(uuid4()), "owner_id": "sam_writes",
        "title": "The Silence of Forests",
        "content": "Old growth forests are not silent. They hum, creak, drip, and breathe. What we call silence is just the absence of human noise — and that absence, it turns out, is extraordinarily loud...",
        "status": "draft", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": ["Environment"],
    },
    {
        "id": str(uuid4()), "owner_id": "sam_writes",
        "title": "Notes on grief I never finished",
        "content": "Started writing this three times. Each time it turned into something else. Maybe that is the point.",
        "status": "idea", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": [],
    },
    {
        "id": str(uuid4()), "owner_id": "sam_writes",
        "title": "What Tide Pools Taught Me About Ecosystems",
        "content": "A tide pool is a complete world in a few square feet. Predator and prey, competition and symbiosis, boom and collapse — all visible in a single afternoon if you know where to look.\n\nEcologists study tide pools because they are legible. The relationships are slow enough to observe and small enough to map. The same dynamics exist in rainforests and coral reefs, but at a scale that defeats human attention.\n\nMost complex systems are tide pools we have not learned to read yet.",
        "status": "completed", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": ["Science", "Environment"],
    },
    {
        "id": str(uuid4()), "owner_id": "sam_writes",
        "title": "In Praise of Walking Slowly",
        "content": "The flaneur is an old idea — the urban wanderer who walks without destination, attentive to everything, committed to nothing. Walter Benjamin wrote about it. Baudelaire practised it.\n\nWe have largely abandoned it. Walking is now exercise, or commuting, or both. It has a pace, a route, a purpose.\n\nBut something is only visible at a slow walk. The texture of a neighbourhood. The way light falls on a particular corner at a particular hour. The face of a stranger caught in a moment of unguarded thought. Speed erases all of this.",
        "status": "published", "created_at": dt(2026, 2, 3), "updated_at": dt(2026, 2, 3),
        "publication_id": None, "published_at": dt(2026, 2, 3), "scheduled_publish_at": None,
        "likes": ["johnny", "alice", "priya_k"],
        "tags": ["Culture", "Opinion"],
    },
    {
        "id": str(uuid4()), "owner_id": "sam_writes",
        "title": "The Intelligence of Plants",
        "content": "Plants do not have brains. They also do not need them. Over millions of years, they have evolved solutions to problems that would require considerable intelligence in animals — navigating toward light, defending against predators, communicating through chemical signals.\n\nWhether this constitutes intelligence depends on how you define the word. But it should at least complicate our assumption that cognition requires neurons.\n\nThe more we study non-animal life, the more intelligence looks less like a special property of certain organisms and more like a general feature of living systems.",
        "status": "published", "created_at": dt(2026, 3, 2), "updated_at": dt(2026, 3, 2),
        "publication_id": None, "published_at": dt(2026, 3, 2), "scheduled_publish_at": None,
        "likes": ["maanushree", "zara_t"],
        "tags": ["Science", "Philosophy"],
    },

    # ─────────────────────────────────────────
    # priya_k
    # ─────────────────────────────────────────
    {
        "id": str(uuid4()), "owner_id": "priya_k",
        "title": "Draft: The burden of health data",
        "content": "We now have more data about our own bodies than any previous generation. Sleep scores, heart rate variability, blood glucose trends. Does having this data actually make us healthier, or just more anxious?",
        "status": "draft", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": ["Health", "Technology"],
    },
    {
        "id": str(uuid4()), "owner_id": "priya_k",
        "title": "Essay on what we owe future generations",
        "content": "Climate policy, national debt, depleted aquifers — we are making decisions whose consequences will be borne by people who do not yet exist and cannot vote. What are our obligations to them?",
        "status": "idea", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": [],
    },
    {
        "id": str(uuid4()), "owner_id": "priya_k",
        "title": "The Problem with Wellness Culture",
        "content": "Wellness has become an industry, which means it has become a product. And like most products, it is sold primarily to people who already have enough — enough money, enough time, enough security to worry about optimising.\n\nThis is not an argument against taking care of yourself. It is an argument against mistaking individual behaviour change for systemic solutions.\n\nYou cannot meditate your way out of a broken healthcare system. At some point, wellness culture becomes a distraction from the conditions that make people unwell.",
        "status": "completed", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": ["Health", "Opinion"],
    },
    {
        "id": str(uuid4()), "owner_id": "priya_k",
        "title": "What I Learned from Six Months Without a Smartphone",
        "content": "I did not do it for a challenge or a book deal. My phone broke and I could not afford to replace it immediately. Six months passed.\n\nHere is what I noticed: I was bored more. I was also present more. I read more books and had more conversations. I got lost more often and discovered things I would never have found by following directions.\n\nI eventually got a new phone. But I use it differently now. The absence taught me what I was actually using it for — and most of it, I did not need.",
        "status": "published", "created_at": dt(2026, 1, 28), "updated_at": dt(2026, 1, 28),
        "publication_id": None, "published_at": dt(2026, 1, 28), "scheduled_publish_at": None,
        "likes": ["anish25", "leon_m", "maanushree"],
        "tags": ["Health", "Opinion"],
    },
    {
        "id": str(uuid4()), "owner_id": "priya_k",
        "title": "The Quiet Crisis in Rural Healthcare",
        "content": "Urban hospitals get the headlines. The real story is quieter and harder to see — clinics closing in small towns, doctors who serve thousands of square kilometres, patients who drive four hours for a specialist appointment.\n\nRural healthcare is not a niche problem. In most countries, a significant portion of the population lives outside cities, and they live, on average, shorter and sicker lives.\n\nThe solutions are not mysterious. They require political will, sustained funding, and the recognition that geography should not determine health outcomes. What is missing is attention.",
        "status": "published", "created_at": dt(2026, 2, 22), "updated_at": dt(2026, 2, 22),
        "publication_id": None, "published_at": dt(2026, 2, 22), "scheduled_publish_at": None,
        "likes": ["sam_writes", "johnny"],
        "tags": ["Health", "Politics"],
    },

    # ─────────────────────────────────────────
    # leon_m
    # ─────────────────────────────────────────
    {
        "id": str(uuid4()), "owner_id": "leon_m",
        "title": "Unfinished thoughts on brutalism",
        "content": "Brutalist buildings are either loved or hated. Rarely anything in between. I have been trying to understand why. Something about the honesty of exposed concrete — it refuses to hide what it is.",
        "status": "draft", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": ["Art"],
    },
    {
        "id": str(uuid4()), "owner_id": "leon_m",
        "title": "The street as commons",
        "content": "Streets are the original public space. Before parks, before plazas, before the internet — the street was where public life happened. What does it mean that we have handed most of it to cars?",
        "status": "idea", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": [],
    },
    {
        "id": str(uuid4()), "owner_id": "leon_m",
        "title": "Why Good Cities Are Boring to Drive Through",
        "content": "The best cities in the world are terrible for driving. Narrow streets, no parking, one-way systems that seem designed to confuse.\n\nThis is not a bug. It is the consequence of designing for humans rather than vehicles. When cities prioritise pedestrians, they become denser, more mixed-use, more legible at walking pace.\n\nThe experience of driving through Amsterdam or Bologna is frustrating. The experience of being in them is extraordinary. The two things are related.",
        "status": "completed", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": ["Culture", "Opinion"],
    },
    {
        "id": str(uuid4()), "owner_id": "leon_m",
        "title": "The Architecture of Trust",
        "content": "Buildings communicate before anyone speaks. A bank with marble floors and high ceilings says: we are stable, permanent, serious. A startup office with exposed pipes and ping pong tables says: we are informal, creative, anti-hierarchical.\n\nArchitects know this. So do the people who commission buildings. Space is rhetoric.\n\nThe most interesting question is not what buildings say, but whether what they say is true — and what happens when the architecture lies.",
        "status": "published", "created_at": dt(2026, 2, 7), "updated_at": dt(2026, 2, 7),
        "publication_id": None, "published_at": dt(2026, 2, 7), "scheduled_publish_at": None,
        "likes": ["maanushree", "sam_writes", "alice"],
        "tags": ["Art", "Philosophy"],
    },
    {
        "id": str(uuid4()), "owner_id": "leon_m",
        "title": "What Housing Policy Gets Wrong About Home",
        "content": "Policymakers talk about housing in units. How many units are needed. How many units were built. The unit is a useful abstraction for spreadsheets and it is completely useless for understanding what people actually need.\n\nHome is not a unit. It is a relationship — with neighbours, with streets, with the particular quality of light through a particular window at a particular time of year.\n\nPolicy that ignores this produces housing that solves the quantitative problem and misses the point entirely.",
        "status": "published", "created_at": dt(2026, 3, 6), "updated_at": dt(2026, 3, 6),
        "publication_id": None, "published_at": dt(2026, 3, 6), "scheduled_publish_at": None,
        "likes": ["priya_k", "anish25"],
        "tags": ["Politics", "Opinion"],
    },

    # ─────────────────────────────────────────
    # zara_t
    # ─────────────────────────────────────────
    {
        "id": str(uuid4()), "owner_id": "zara_t",
        "title": "The novel I keep starting",
        "content": "Three chapters in. Again. The problem is not the idea — the idea is good. The problem is the voice. Every time I find it, I lose it by chapter two.",
        "status": "draft", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": ["Fiction"],
    },
    {
        "id": str(uuid4()), "owner_id": "zara_t",
        "title": "Shapeshifters across world mythology",
        "content": "Every culture has them. Kitsune in Japan. Selkies in Scotland. Nagas in India. Werewolves in Europe. The shapeshifter is one of the oldest archetypes in human storytelling. Why?",
        "status": "idea", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": [],
    },
    {
        "id": str(uuid4()), "owner_id": "zara_t",
        "title": "On Writing Villains You Understand",
        "content": "The most frightening villains are not the ones who want to destroy the world. They are the ones whose logic you can follow, step by step, until you suddenly realise where you are.\n\nWriting a convincing villain requires a kind of empathy that feels uncomfortable. You have to understand the internal coherence of a worldview you find repugnant. You have to make their choices feel, from the inside, like the only reasonable option.\n\nThis is also, I think, one of the things fiction is for.",
        "status": "completed", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": ["Fiction", "Literature"],
    },
    {
        "id": str(uuid4()), "owner_id": "zara_t",
        "title": "The Folklore of Thresholds",
        "content": "Every culture has rules about doorways. Do not stand in them. Carry the bride across. Hang something above them. Leave an offering at them.\n\nThe threshold is neither inside nor outside. It is the boundary itself — and boundaries, in folklore, are where the rules of the normal world become unreliable.\n\nThis is why so many monsters live at edges. Shorelines. Forests. Dusk. The threshold is the place where what you know stops being a reliable guide.",
        "status": "published", "created_at": dt(2026, 2, 12), "updated_at": dt(2026, 2, 12),
        "publication_id": None, "published_at": dt(2026, 2, 12), "scheduled_publish_at": None,
        "likes": ["sam_writes", "maanushree", "alice"],
        "tags": ["History", "Culture"],
    },
    {
        "id": str(uuid4()), "owner_id": "zara_t",
        "title": "Why Ghost Stories Are Always About the Living",
        "content": "Ghosts haunt because they are unfinished. Unresolved love. Unavenged death. Unspoken truth. The ghost does not need anything for itself — it needs something from the living.\n\nThis is why ghost stories endure. They are not really about death. They are about what we carry from the dead — the obligations, the guilt, the love that does not have anywhere to go once its object is gone.\n\nEvery haunting is a relationship that has not ended yet.",
        "status": "published", "created_at": dt(2026, 3, 7), "updated_at": dt(2026, 3, 7),
        "publication_id": None, "published_at": dt(2026, 3, 7), "scheduled_publish_at": None,
        "likes": ["johnny", "leon_m", "priya_k"],
        "tags": ["Fiction", "Culture"],
    },

    # ─────────────────────────────────────────
    # dev_notes
    # ─────────────────────────────────────────
    {
        "id": str(uuid4()), "owner_id": "dev_notes",
        "title": "Refactoring notes — auth module",
        "content": "The current auth implementation works but it is doing too much. Token generation, user lookup, and session management are all tangled together. Draft plan for splitting these out...",
        "status": "draft", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": ["Technology"],
    },
    {
        "id": str(uuid4()), "owner_id": "dev_notes",
        "title": "Write about debugging as a practice, not a skill",
        "content": "Everyone teaches debugging as a set of tools. I think it is closer to a mindset — a particular way of holding uncertainty while systematically narrowing the space of possible explanations.",
        "status": "idea", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": [],
    },
    {
        "id": str(uuid4()), "owner_id": "dev_notes",
        "title": "The Case for Boring Technology",
        "content": "The most reliable systems I have worked on were built with boring technology. Postgres. Redis. A few well-understood libraries. No cutting-edge frameworks, no experimental runtimes.\n\nBoring technology is well-understood. Its failure modes are documented. Its community is large enough that someone has already solved your problem and written about it.\n\nThe cost of interesting technology is paid at 2am when something breaks in production and the error message returns zero results on the internet.",
        "status": "completed", "created_at": now(), "updated_at": now(),
        "publication_id": None, "published_at": None, "scheduled_publish_at": None,
        "likes": [], "tags": ["Technology", "Opinion"],
    },
    {
        "id": str(uuid4()), "owner_id": "dev_notes",
        "title": "What I Wish I Knew Before My First Production Outage",
        "content": "The alert came at 3am. The service was down. I had been an engineer for eight months.\n\nThe first thing I learned: stay calm, because panic makes you stupid. The second thing: read the logs before you touch anything. The third thing: tell someone immediately — hiding an outage makes it worse.\n\nThe outage was fixed in forty minutes. The post-mortem took two hours and taught me more than the previous six months of normal work. Production is the best classroom there is, and also the most expensive.",
        "status": "published", "created_at": dt(2026, 2, 1), "updated_at": dt(2026, 2, 1),
        "publication_id": None, "published_at": dt(2026, 2, 1), "scheduled_publish_at": None,
        "likes": ["maanushree", "anish25", "johnny"],
        "tags": ["Technology", "Education"],
    },
    {
        "id": str(uuid4()), "owner_id": "dev_notes",
        "title": "On Writing Code for the Next Person",
        "content": "The next person to read your code is probably you, six months from now, with no memory of writing it.\n\nThis reframe changes how I write code. Not just correct, not just fast — but legible. Variable names that say what a thing is. Functions that do one thing. Comments that explain why, not what.\n\nCode is communication. The computer does not care how readable it is. The human does. Writing for the human is not a luxury — it is the job.",
        "status": "published", "created_at": dt(2026, 2, 25), "updated_at": dt(2026, 2, 25),
        "publication_id": None, "published_at": dt(2026, 2, 25), "scheduled_publish_at": None,
        "likes": ["maanushree", "alice"],
        "tags": ["Technology", "Opinion"],
    },
]

result = articles_collection.insert_many(all_articles)
print(f"✅ Inserted {len(result.inserted_ids)} articles across 5 users")
client.close()