import { Users, Share2, DollarSign } from "lucide-react";

const steps = [
  {
    step: "STEP 1",
    title: "Join",
    description: "Create your free account in minutes",
    icon: Users,
    iconBg: "bg-emerald-500",
  },
  {
    step: "STEP 2",
    title: "Share Leads",
    description: "Refer quality business leads from your network",
    icon: Share2,
    iconBg: "bg-amber-400",
  },
  {
    step: "STEP 3",
    title: "Earn Rewards",
    description: "Get paid commissions for every successful deal",
    icon: DollarSign,
    iconBg: "bg-emerald-500",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="features"
      className="bg-gray-100 flex flex-col items-center py-16 sm:py-30 px-4 sm:px-6"
    >
      <h2 className="text-2xl sm:text-4xl  font-bold text-gray-900 mb-2">
        How It Works
      </h2>

      <p className="text-gray-500 text-sm sm:text-base mb-12">
        Three simple steps to start earning
      </p>

      <div className="w-full max-w-6xl">
        {/* Mobile Scroll */}
        <div className="flex md:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth">
          {steps.map((s, i) => {
            const Icon = s.icon;

            return (
              <div
                key={i}
                className="min-w-55 bg-white rounded-xl shadow-sm p-5 snap-start"
              >
                <div
                  className={`${s.iconBg} w-12 h-12 rounded-2xl flex items-center justify-center mb-2`}
                >
                  <Icon className="text-white w-5 h-5" />
                </div>

                <p className="text-xs font-semibold text-gray-400 tracking-widest mb-1">
                  {s.step}
                </p>

                <h3 className="text-xl font-bold text-gray-900">
                  {s.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Desktop Timeline */}
        <div className="hidden md:flex flex-col items-center">
          {steps.map((s, i) => {
            const Icon = s.icon;

            return (
              <div key={i} className="flex flex-col items-center">
                <div className="w-120 bg-white rounded-3xl shadow-sm p-5 flex items-center gap-6">
                  <div className={`${s.iconBg} rounded-2xl p-4 shrink-0`}>
                    <Icon className="text-white w-6 h-6" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400 tracking-widest ">
                      {s.step}
                    </p>

                    <h3 className="text-xl font-bold text-gray-900">
                      {s.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {s.description}
                    </p>
                  </div>
                </div>

                {i < steps.length - 1 && (
                  <div className="h-20 flex items-center justify-center">
                    <span className="text-emerald-500 text-4xl">↓</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button className="mt-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xl px-14 py-3 rounded-2xl shadow-lg transition-all duration-200">
        Start Earning Today
      </button>
    </section>
  );
}