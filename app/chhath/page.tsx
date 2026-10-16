const days = [
  {
    number: "01",
    name: "Nahay Khay",
    hindi: "नहाय-खाय",
    subtitle: "Purity begins at home",
    description:
      "The preparation begins with cleanliness, bathing, and a simple sattvic meal. Families clean their homes and prepare for the days of devotion ahead.",
    traditions: [
      "Clean the home and prepare the puja space.",
      "Take a ritual bath and prepare a simple vegetarian meal.",
      "Lauki, chana dal, and rice are traditional foods in many families.",
    ],
  },
  {
    number: "02",
    name: "Kharna",
    hindi: "खरना",
    subtitle: "Faith, patience and discipline",
    description:
      "The vrat begins with a day of fasting. In the evening, the devotee offers prasad and then eats according to the family's tradition. A more rigorous fast generally follows.",
    traditions: [
      "Prepare prasad, commonly jaggery kheer and roti.",
      "Offer prayers in a clean and peaceful space.",
      "Share prasad with family and neighbours.",
    ],
  },
  {
    number: "03",
    name: "Sandhya Arghya",
    hindi: "संध्या अर्घ्य",
    subtitle: "Gratitude to the setting sun",
    description:
      "Families gather at a river, pond, or designated ghat to offer arghya to the setting sun. Soop, daura, fruits, thekua, sugarcane, diyas, and traditional songs create the festival's unmistakable atmosphere.",
    traditions: [
      "Arrange offerings in bamboo baskets and soop.",
      "Offer arghya to the setting sun.",
      "Sing traditional Chhath geet with family and community.",
      "Some families also observe the Kosi ritual.",
    ],
  },
  {
    number: "04",
    name: "Usha Arghya",
    hindi: "उषा अर्घ्य",
    subtitle: "A new morning, renewed hope",
    description:
      "Before sunrise, devotees return to the water's edge to offer arghya to the rising sun. The ritual concludes with parana and the sharing of prasad.",
    traditions: [
      "Gather before sunrise at the chosen ghat.",
      "Offer arghya to the rising sun.",
      "Complete the fast according to the family's tradition.",
      "Distribute prasad and celebrate together.",
    ],
  },
];

const traditions = [
  {
    title: "Surya Dev",
    hindi: "सूर्य देव",
    description:
      "The Sun is honoured as the source of light, energy, and life.",
  },
  {
    title: "Chhathi Maiya",
    hindi: "छठी मईया",
    description:
      "Devotees pray to Chhathi Maiya for family well-being, protection, and blessings.",
  },
  {
    title: "Nature and gratitude",
    hindi: "प्रकृति के प्रति आभार",
    description:
      "Water, sunlight, seasonal fruits, and simple offerings remind us of our connection with nature.",
  },
];

const prasad = [
  {
    name: "Thekua",
    hindi: "ठेकुआ",
    description:
      "A much-loved traditional sweet, commonly prepared with wheat flour and jaggery or sugar.",
  },
  {
    name: "Kheer and roti",
    hindi: "खीर और रोटी",
    description:
      "Often prepared for Kharna prasad, with ingredients and methods varying by household.",
  },
  {
    name: "Seasonal fruits",
    hindi: "मौसमी फल",
    description:
      "Fruits such as bananas, coconuts, and other seasonal produce are arranged as offerings.",
  },
  {
    name: "Soop and daura",
    hindi: "सूप और दउरा",
    description:
      "Traditional baskets used to carry and arrange offerings for the rituals.",
  },
];

const faqs = [
  {
    question: "Why do devotees worship both the setting and rising sun?",
    answer:
      "Chhath expresses gratitude to the Sun and the life it sustains. Offering arghya at sunset and sunrise is a distinctive part of the festival.",
  },
  {
    question: "Where is Chhath Puja celebrated?",
    answer:
      "It is especially associated with Bihar, eastern Uttar Pradesh, and Jharkhand, and is celebrated by Bihari communities across India and abroad.",
  },
  {
    question: "What is the significance of Chhath songs?",
    answer:
      "Traditional folk songs carry prayers, memories, family traditions, and the cultural heritage of generations.",
  },
  {
    question: "Is there only one story about the origin of Chhath?",
    answer:
      "Different devotional narratives and family traditions explain the festival. They should be understood as religious and cultural traditions rather than one conclusively established historical account.",
  },
  {
    question: "Does every family follow exactly the same rituals?",
    answer:
      "No. Details can vary by family, region, and tradition. Follow guidance from your family or community for specific observances.",
  },
];

export default function ChhathPage() {
  return (
    <main className="min-h-screen bg-[#f8f6ef] text-[#20392d]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#183d2e] px-6 py-24 text-center text-white md:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-emerald-300 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
            Bihar Ki Bhavna · Wonderwall
          </p>

          <p className="mb-4 text-2xl text-amber-100 md:text-3xl">
            जय छठी मईया
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Chhath Puja
            <span className="mt-2 block font-medium text-amber-300">
              छठ महापर्व
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
            A festival of faith, purity, discipline, nature, and gratitude.
            A tradition that brings families together and keeps Bihar close
            to the heart, wherever life takes us.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href="#four-days"
              className="rounded-full bg-amber-300 px-6 py-3 font-semibold text-[#183d2e] transition hover:bg-amber-200"
            >
              Explore the four days ↓
            </a>
            <a
              href="/stories"
              className="rounded-full border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Community stories →
            </a>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
              More than a festival
            </p>
            <h2 className="text-3xl font-bold leading-tight md:text-4xl">
              Aastha, tradition aur apnapan.
            </h2>
            <p className="mt-6 leading-8 text-[#526157]">
              Chhath Puja is a deeply cherished festival dedicated to Surya
              Dev and Chhathi Maiya. It is observed with prayer, ritual
              purity, fasting, and offerings to the setting and rising sun.
            </p>
            <p className="mt-4 leading-8 text-[#526157]">
              For many Bihari families, Chhath means returning home, preparing
              prasad together, hearing familiar folk songs, visiting the ghat,
              and passing traditions from one generation to the next.
            </p>
          </div>

          <div className="rounded-3xl border border-[#e5dfcf] bg-white p-7 shadow-sm md:p-10">
            <p className="text-2xl font-semibold">छठ हमें सिखाता है</p>
            <ul className="mt-6 space-y-4 text-[#526157]">
              <li>☀️ Gratitude for the energy that sustains life.</li>
              <li>🙏 Faith, patience, discipline, and humility.</li>
              <li>🌿 Respect for nature and the environment.</li>
              <li>🏡 The value of family, community, and shared traditions.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Four days */}
      <section id="four-days" className="bg-[#efece1] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
              The four-day journey
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              From preparation to prayer
            </h2>
            <p className="mt-4 leading-7 text-[#526157]">
              Each day has its own meaning. Practices can differ between
              families and communities.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {days.map((day) => (
              <article
                key={day.number}
                className="rounded-3xl border border-[#e0dac9] bg-[#fffdf8] p-7 shadow-sm md:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#183d2e] text-lg font-bold text-amber-300">
                    {day.number}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold">{day.name}</h3>
                    <p className="mt-1 text-lg text-amber-700">{day.hindi}</p>
                    <p className="mt-2 font-medium text-[#526157]">
                      {day.subtitle}
                    </p>
                  </div>
                </div>

                <p className="mt-6 leading-7 text-[#526157]">
                  {day.description}
                </p>

                <ul className="mt-5 space-y-3">
                  {day.traditions.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 leading-6 text-[#526157]"
                    >
                      <span className="font-bold text-amber-700">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Significance */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
            Faith and significance
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">
            What does Chhath mean to devotees?
          </h2>
          <p className="mt-4 leading-7 text-[#526157]">
            The festival brings together devotion, gratitude, family
            well-being, and reverence for the natural world.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {traditions.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-[#e5dfcf] bg-white p-7"
            >
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-1 text-amber-700">{item.hindi}</p>
              <p className="mt-4 leading-7 text-[#526157]">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-[#183d2e] p-7 text-white md:p-10">
          <h3 className="text-2xl font-bold">Stories of origin</h3>
          <p className="mt-4 leading-8 text-white/85">
            Chhath is associated with ancient traditions of sun worship.
            Devotional stories connected with figures such as Karna and
            Draupadi are also shared in popular retellings. These stories
            form part of the festival's religious and cultural memory, but
            there is no single, conclusively established historical account
            that settles every question about its origin.
          </p>
        </div>
      </section>

      {/* Food and offerings */}
      <section className="bg-[#efece1] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
              Prasad and preparations
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              The taste of tradition
            </h2>
            <p className="mt-4 leading-7 text-[#526157]">
              Chhath preparations are often made with great care. Ingredients,
              recipes, and customs vary by household.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {prasad.map((item) => (
              <article
                key={item.name}
                className="rounded-3xl border border-[#e0dac9] bg-[#fffdf8] p-6"
              >
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="mt-1 text-amber-700">{item.hindi}</p>
                <p className="mt-4 leading-7 text-[#526157]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Songs */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
              Folk songs and memories
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              घाट पर गूंजते छठ के गीत
            </h2>
            <p className="mt-5 leading-8 text-[#526157]">
              Chhath geet are an essential part of the atmosphere for many
              families. Their melodies carry devotion, longing, gratitude,
              and memories of home.
            </p>
            <p className="mt-4 leading-8 text-[#526157]">
              For Biharis living away from their hometowns, hearing these
              songs can bring back memories of family preparations, crowded
              ghats, the glow of diyas, and mornings spent waiting for sunrise.
            </p>
          </div>

          <div className="rounded-3xl border border-[#e5dfcf] bg-white p-8">
            <p className="text-2xl font-bold">A little piece of home</p>
            <p className="mt-4 leading-8 text-[#526157]">
              What is the Chhath song your family plays every year? Which
              memory comes back whenever you hear it? Share your story with
              the Bihar Ki Bhavna community.
            </p>
            <a
              href="/stories/submit"
              className="mt-7 inline-flex rounded-full bg-[#183d2e] px-6 py-3 font-semibold text-white transition hover:bg-[#285640]"
            >
              Share your memory →
            </a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
              Common questions
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              Chhath Puja FAQs
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-[#e5dfcf] p-5"
              >
                <summary className="cursor-pointer list-none font-semibold">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-xl text-amber-700 transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 leading-7 text-[#526157]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Sources and closing CTA */}
      <section className="bg-[#183d2e] px-6 py-16 text-white md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-2xl text-amber-300">जय छठी मईया 🙏</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Bihar is not just a place. It is a feeling.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/80">
            Wherever we live, our traditions connect us to our roots.
            Let us preserve our memories, songs, stories, and the spirit
            of Chhath for the next generation.
          </p>
          <a
            href="/stories"
            className="mt-8 inline-flex rounded-full bg-amber-300 px-7 py-3 font-semibold text-[#183d2e] transition hover:bg-amber-200"
          >
            Explore community stories →
          </a>

          <div className="mt-12 border-t border-white/20 pt-6 text-left text-sm leading-6 text-white/70">
            <p className="font-semibold text-white">Further reading</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="https://tourism.bihar.gov.in/en/experiences/festivals-and-fairs/festivals/chhath-puja"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:text-amber-300"
                >
                  Bihar Tourism — Chhath Puja
                </a>
              </li>
              <li>
                <a
                  href="https://www.incredibleindia.gov.in/en/festivals-and-events/chhath-puja"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:text-amber-300"
                >
                  Incredible India — Chhath Puja
                </a>
              </li>
              <li>
                <a
                  href="https://utsav.gov.in/public/view-event/chhath-puja-2"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:text-amber-300"
                >
                  Government of India — Utsav
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}