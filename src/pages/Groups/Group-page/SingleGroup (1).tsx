import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  Clock,
  MapPin,
  Check,
  X,
  HelpCircle,
  Trophy,
  Sparkles,
  ChevronLeft,
  Activity as ActivityIcon,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import "../styles/Groups.css";

type VoteStatus = "Da" | "Nu" | "Poate" | null;

interface EventAttribute {
  name: string;
  percentage: number;
  color: string;
}

interface ActivityData {
  id: string;
  title: string;
  type: string;
  location: string;
  time: string;
  score: number;
  imageUrl: string;
  votes: { da: number; nu: number; poate: number };
  myVote: VoteStatus;
  isWinning?: boolean;
  attributes: EventAttribute[];
}

const initialActivities: ActivityData[] = [
  {
    id: "a1",
    title: "[TITLU: ACTIVITATE 1]",
    type: "[Tip Activitate]",
    location: "[Locația, orașul strada]",
    time: "[dată, ziua, ora]",
    score: 95,
    imageUrl: "PLACEHOLDER",
    votes: { da: 4, nu: 0, poate: 1 },
    myVote: null,
    isWinning: true,
    attributes: [
      {
        name: "[Nume Preferință 1]",
        percentage: 85,
        color: "#9a4b56",
      },
      {
        name: "[Nume Preferință 2]",
        percentage: 95,
        color: "#f2ada4",
      },
      {
        name: "[Nume Preferință 3]",
        percentage: 35,
        color: "#edbd8c",
      },
    ],
  },
  {
    id: "a2",
    title: "Cină la Trattoria Il Forno",
    type: "Mâncare / Relaxare",
    location: "Piața Unirii, nr. 12",
    time: "Sâmbătă, 20:00",
    score: 88,
    imageUrl:
      "https://images.unsplash.com/photo-1634672192240-ed8e1e8c1cf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcmVzdGF1cmFudCUyMHBpenphJTIwcGFzdGF8ZW58MXx8fHwxNzc0OTYxMjA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    votes: { da: 3, nu: 1, poate: 1 },
    myVote: null,
    attributes: [
      {
        name: "Gastronomie",
        percentage: 100,
        color: "#e8998d",
      },
      { name: "Relaxare", percentage: 85, color: "#f2ada4" },
      { name: "Socializare", percentage: 90, color: "#edbd8c" },
    ],
  },
];

const mockMembers = [
  {
    id: 1,
    name: "Andrei",
    avatar:
      "https://images.unsplash.com/photo-1615327388641-203faee20165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMGZhY2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzU0OTMxOTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    isReal: true,
  },
  {
    id: 2,
    name: "nume",
    avatar: null,
    isReal: false,
  },
  {
    id: 3,
    name: "nume",
    avatar: null,
    isReal: false,
  },
  {
    id: 4,
    name: "nume",
    avatar: null,
    isReal: false,
  },
];

export function SingleGroup() {
  const { id } = useParams();
  const [activities, setActivities] = useState<ActivityData[]>(
    initialActivities,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const groupName = `Grup ${id}`;
  const totalMembers = mockMembers.length;

  const handleVote = (activityId: string, vote: VoteStatus) => {
    setActivities((prev) =>
      prev
        .map((act) => {
          if (act.id === activityId) {
            let noileVoturi = { ...act.votes };
            if (act.myVote) {
              if (act.myVote === "Da") noileVoturi.da -= 1;
              if (act.myVote === "Nu") noileVoturi.nu -= 1;
              if (act.myVote === "Poate") noileVoturi.poate -= 1;
            }

            if (vote === "Da") noileVoturi.da += 1;
            if (vote === "Nu") noileVoturi.nu += 1;
            if (vote === "Poate") noileVoturi.poate += 1;

            return { ...act, myVote: vote, votes: noileVoturi };
          }
          return act;
        })
        .sort((a, b) => {
          const aScore = a.votes.da - a.votes.nu;
          const bScore = b.votes.da - b.votes.nu;
          return bScore - aScore;
        })
        .map((act, index) => ({
          ...act,
          isWinning: index === 0 && act.votes.da > 0,
        })),
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#eee1de] flex justify-center p-6 md:p-12 font-sans text-[#4b2f27]">
        <div className="w-full max-w-[540px] pb-12">
          {/* Header */}
          <div className="flex items-center mb-8 relative">
            <Link
              to="/"
              className="absolute left-0 p-2 text-[#8a6b63] hover:bg-[#f7f5f4] rounded-full transition-colors"
            >
              <ChevronLeft className="w-7 h-7" />
            </Link>
            <h1 className="text-3xl font-bold w-full text-center m-0 text-[#4b2f27]">
              {groupName}
            </h1>
          </div>

          {/* Participants Section */}
          <div className="bg-[#f7f5f4] rounded-[1.45rem] p-5 mb-6 shadow-sm border border-[#e8dfdc]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#4b2f27]">
                Membrii grupului
              </h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-semibold text-[#8a6b63] hover:text-[#4b2f27] bg-[#eee1de] hover:bg-[#e8dfdc] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                Vezi toți membrii
              </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {mockMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16"
                >
                  <div className={`w-14 h-14 rounded-full overflow-hidden border-2 shadow-sm ring-2 ${member.isReal ? 'border-white ring-[#f2ada4]' : 'border-dashed border-[#d5c3be] ring-transparent bg-[#eee1de] flex items-center justify-center'}`}>
                    {member.isReal ? (
                      <img
                        src={member.avatar!}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-medium text-[#8a6b63] tracking-wide">(poza)</span>
                    )}
                  </div>
                  <span className={`text-[11px] font-semibold text-center w-full truncate ${member.isReal ? 'text-[#5f443d]' : 'text-[#8a6b63]'}`}>
                    {member.name}
                  </span>
                </div>
              ))}
              <button className="flex flex-col items-center gap-1.5 flex-shrink-0 ml-1 group w-16">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#eee1de] border-2 border-dashed border-[#d5c3be] text-[#8a6b63] group-hover:bg-[#f2ada4] group-hover:text-white group-hover:border-[#f2ada4] transition-all">
                  <span className="text-xl font-medium">+</span>
                </div>
                <span className="text-[11px] font-semibold text-[#8a6b63] group-hover:text-[#4b2f27] text-center w-full">
                  Invită
                </span>
              </button>
            </div>
          </div>

          {/* Activities Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#4b2f27]">
              Activități propuse
            </h2>
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#f2ada4] to-[#edbd8c] text-[#4b2f27] px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              AI Matched
            </div>
          </div>

          {/* Activities List */}
          <div className="flex flex-col gap-6">
            {activities.map((activity, index) => {
              const totalVotes = activity.votes.da + activity.votes.nu + activity.votes.poate;
              const daPercent = totalVotes ? (activity.votes.da / totalVotes) * 100 : 0;
              const poatePercent = totalVotes ? (activity.votes.poate / totalVotes) * 100 : 0;
              const nuPercent = totalVotes ? (activity.votes.nu / totalVotes) * 100 : 0;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col rounded-[1.45rem] bg-[#f7f5f4] shadow-sm border overflow-hidden ${
                    activity.isWinning
                      ? "border-[#f2ada4] ring-2 ring-[#f2ada4]/30"
                      : "border-[#e8dfdc]"
                  }`}
                >
                  {/* Image Area */}
                  <div className="relative h-44 w-full overflow-hidden bg-[#eee1de]">
                    {activity.imageUrl === "PLACEHOLDER" ? (
                      <div className="w-full h-full bg-gradient-to-br from-[#d5c3be]/40 to-[#e8dfdc]/60 flex items-center justify-center border-b border-[#e8dfdc]">
                        <div className="bg-white/40 backdrop-blur-sm px-6 py-2.5 rounded-2xl border border-white/50 shadow-sm">
                          <span className="text-[#8a6b63] font-bold tracking-widest text-[13px]">[POZA EVENIMENT]</span>
                        </div>
                      </div>
                    ) : (
                      <ImageWithFallback
                        src={activity.imageUrl}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {activity.isWinning && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-[#f2ada4] to-[#edbd8c] text-[#4b2f27] text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg gap-1.5 backdrop-blur-md">
                        <Trophy className="w-3.5 h-3.5" />
                        Activitate Câștigătoare
                      </div>
                    )}

                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#4b2f27] text-[11px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#f2ada4]" />
                      Scor AI: {activity.score}%
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex flex-col gap-4">
                    <div>
                      <h3 className="text-[1.35rem] font-bold text-[#4b2f27] leading-tight mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-sm font-medium text-[#886c63]">
                        {activity.type}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-[15px] font-medium text-[#5f443d]">
                        <MapPin className="w-[18px] h-[18px] mr-2.5 text-[#d5c3be]" />
                        {activity.location}
                      </div>
                      <div className="flex items-center text-[15px] font-medium text-[#5f443d]">
                        <Clock className="w-[18px] h-[18px] mr-2.5 text-[#d5c3be]" />
                        {activity.time}
                      </div>
                    </div>

                    {/* Profilul Evenimentului (Event Attribute Match Schema) */}
                    <div className="bg-[#eee1de]/60 p-3.5 rounded-2xl space-y-3 mt-1 border border-[#e8dfdc]">
                      <div className="flex items-center gap-1.5 text-[#5f443d]">
                        <ActivityIcon className="w-4 h-4 text-[#8a6b63]" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a6b63]">
                          Profilul & Preferințele Tale
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {activity.attributes.map((attr, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col gap-1.5"
                          >
                            <div className="flex justify-between text-[11px] font-bold text-[#5f443d]">
                              <span>{attr.name}</span>
                              <span>{attr.percentage}% Match</span>
                            </div>
                            <div className="w-full h-[6px] bg-[#d5c3be]/40 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${attr.percentage}%`,
                                }}
                                transition={{
                                  duration: 1,
                                  delay: 0.2 + idx * 0.1,
                                }}
                                className="h-full rounded-full"
                                style={{
                                  backgroundColor: attr.color,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Voting System */}
                    <div className="pt-2 border-t border-[#e8dfdc] space-y-4">
                      {/* Dynamic Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                          <span className="text-xs font-bold text-[#886c63] uppercase tracking-wide">
                            Rezultatele Votului
                          </span>
                          <span className="text-[11px] font-bold text-[#8a6b63] bg-[#eee1de] px-2 py-0.5 rounded-md">
                            {totalVotes} Voturi
                          </span>
                        </div>
                        
                        <div className="flex w-full h-4 rounded-full overflow-hidden bg-[#eee1de] p-[2px] shadow-inner relative">
                          <div className="flex w-full h-full rounded-full overflow-hidden relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${daPercent}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] relative overflow-hidden shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            >
                              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_2s_infinite_linear]"></div>
                            </motion.div>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${poatePercent}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] relative overflow-hidden shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                            >
                              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_2s_infinite_linear]"></div>
                            </motion.div>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${nuPercent}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-[#ef4444] to-[#f87171] relative overflow-hidden shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                            >
                              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_2s_infinite_linear]"></div>
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      {/* Modern Voting Buttons (Fluid Fill + Inner Pulse) */}
                      <div className="flex items-center gap-2.5 relative">
                        {/* DA Button */}
                        <button
                          onClick={() => handleVote(activity.id, "Da")}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 relative overflow-hidden ${
                            activity.myVote === "Da"
                              ? "bg-white text-[#047857] shadow-[inset_0_3px_6px_rgba(4,120,87,0.1)] transform scale-[0.98] border-transparent"
                              : activity.myVote !== null 
                                ? "bg-white/50 text-[#5f443d]/60 border-[#e8dfdc]/60 grayscale-[50%] opacity-70 border"
                                : "bg-white text-[#5f443d] border-[#e8dfdc] border hover:bg-[#d1fae5]/50 hover:text-[#047857] hover:border-[#34d399]/50 hover:shadow-sm"
                          }`}
                        >
                          {activity.myVote === "Da" && (
                            <>
                              {/* Fluid Fill */}
                              <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-[#10b981]/30 to-[#34d399]/20 origin-bottom animate-[fluidRise_0.5s_ease-out]">
                                <div className="absolute -top-3 left-0 w-[200%] h-6 bg-white/40 rounded-[50%] animate-[waveSmooth_3s_linear_infinite]"></div>
                              </div>
                              {/* Inner Pulse */}
                              <div className="absolute inset-0 rounded-2xl animate-[innerRippleSmooth_1.5s_ease-out_infinite] border-[1.5px] border-[#10b981]/50 z-10 pointer-events-none"></div>
                              {/* Particles */}
                              <div className="absolute inset-0 pointer-events-none z-10">
                                <Check className="absolute bottom-2 left-[20%] w-3 h-3 text-[#10b981] opacity-70 animate-[floatUp_2s_linear_infinite]" />
                                <Sparkles className="absolute bottom-4 right-[30%] w-2.5 h-2.5 text-[#10b981] opacity-60 animate-[floatUp_2.5s_linear_infinite_0.5s]" />
                                <Check className="absolute bottom-1 right-[15%] w-2 h-2 text-[#10b981] opacity-50 animate-[floatUp_1.8s_linear_infinite_1s]" />
                              </div>
                            </>
                          )}
                          <span className="relative z-20 flex items-center gap-1.5">
                            <Check className={`w-4 h-4 ${activity.myVote === "Da" ? "text-[#10b981] drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" : "text-current"}`} strokeWidth={3} /> Da
                          </span>
                        </button>
                        
                        {/* POATE Button */}
                        <button
                          onClick={() => handleVote(activity.id, "Poate")}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 relative overflow-hidden ${
                            activity.myVote === "Poate"
                              ? "bg-white text-[#b45309] shadow-[inset_0_3px_6px_rgba(180,83,9,0.1)] transform scale-[0.98] border-transparent"
                              : activity.myVote !== null && activity.myVote !== "Poate"
                                ? "bg-white/50 text-[#5f443d]/60 border-[#e8dfdc]/60 grayscale-[50%] opacity-70 border"
                                : "bg-white text-[#5f443d] border-[#e8dfdc] border hover:bg-[#fef3c7]/50 hover:text-[#b45309] hover:border-[#fbbf24]/50 hover:shadow-sm"
                          }`}
                        >
                          {activity.myVote === "Poate" && (
                            <>
                              {/* Fluid Fill */}
                              <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-[#f59e0b]/30 to-[#fbbf24]/20 origin-bottom animate-[fluidRise_0.8s_ease-out]">
                                <div className="absolute -top-4 left-[-10%] w-[220%] h-8 bg-white/40 rounded-[40%] animate-[waveSlow_4s_ease-in-out_infinite_alternate]"></div>
                              </div>
                              {/* Inner Pulse */}
                              <div className="absolute inset-0 rounded-2xl animate-[innerRippleSlow_2.5s_ease-in-out_infinite] border-[1.5px] border-[#f59e0b]/40 z-10 pointer-events-none"></div>
                              {/* Particles */}
                              <div className="absolute inset-0 pointer-events-none z-10">
                                <span className="absolute bottom-3 left-[25%] text-[#f59e0b] font-bold text-xs opacity-70 animate-[floatUp_3s_ease-in-out_infinite]">.</span>
                                <span className="absolute bottom-2 left-[30%] text-[#f59e0b] font-bold text-xs opacity-70 animate-[floatUp_3s_ease-in-out_infinite_0.2s]">.</span>
                                <span className="absolute bottom-4 left-[35%] text-[#f59e0b] font-bold text-xs opacity-70 animate-[floatUp_3s_ease-in-out_infinite_0.4s]">.</span>
                                <div className="absolute bottom-2 right-[25%] w-1.5 h-1.5 rounded-full bg-[#f59e0b]/60 shadow-[0_0_5px_#f59e0b] animate-[floatUp_4s_linear_infinite_1s]"></div>
                                <div className="absolute bottom-5 right-[15%] w-2 h-2 rounded-full bg-[#f59e0b]/50 shadow-[0_0_6px_#f59e0b] animate-[floatUp_3.5s_linear_infinite_0.5s]"></div>
                              </div>
                            </>
                          )}
                          <span className="relative z-20 flex items-center gap-1.5">
                            <HelpCircle className={`w-4 h-4 ${activity.myVote === "Poate" ? "text-[#f59e0b] drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" : "text-current"}`} strokeWidth={3} /> Poate
                          </span>
                        </button>
                        
                        {/* NU Button */}
                        <button
                          onClick={() => handleVote(activity.id, "Nu")}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 relative overflow-hidden ${
                            activity.myVote === "Nu"
                              ? "bg-white text-[#b91c1c] shadow-[inset_0_3px_6px_rgba(185,28,28,0.1)] transform scale-[0.98] border-transparent"
                              : activity.myVote !== null && activity.myVote !== "Nu"
                                ? "bg-white/50 text-[#5f443d]/60 border-[#e8dfdc]/60 grayscale-[50%] opacity-70 border"
                                : "bg-white text-[#5f443d] border-[#e8dfdc] border hover:bg-[#fee2e2]/50 hover:text-[#b91c1c] hover:border-[#f87171]/50 hover:shadow-sm"
                          }`}
                        >
                          {activity.myVote === "Nu" && (
                            <>
                              {/* Fluid Fill */}
                              <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-[#ef4444]/30 to-[#f87171]/20 origin-bottom animate-[fluidRise_0.4s_ease-out]">
                                <div className="absolute -top-2 left-[-20%] w-[250%] h-5 bg-white/40 rounded-[30%] animate-[waveJagged_2s_linear_infinite]"></div>
                              </div>
                              {/* Inner Pulse */}
                              <div className="absolute inset-0 rounded-2xl animate-[innerRippleSharp_1s_ease-out_infinite] border-[1.5px] border-[#ef4444]/50 z-10 pointer-events-none"></div>
                              {/* Particles */}
                              <div className="absolute inset-0 pointer-events-none z-10">
                                <X className="absolute bottom-3 left-[25%] w-2 h-2 text-[#ef4444] opacity-70 animate-[floatUp_1.5s_linear_infinite]" />
                                <div className="absolute bottom-1 right-[30%] w-1 h-1 bg-[#ef4444] opacity-80 animate-[floatUp_1.2s_linear_infinite_0.3s]"></div>
                                <X className="absolute bottom-4 right-[20%] w-2.5 h-2.5 text-[#ef4444] opacity-60 animate-[floatUp_1.8s_linear_infinite_0.6s]" />
                                <div className="absolute bottom-2 left-[40%] w-1.5 h-1.5 bg-[#ef4444]/70 rotate-45 animate-[floatUp_1.4s_linear_infinite_0.8s]"></div>
                              </div>
                            </>
                          )}
                          <span className="relative z-20 flex items-center gap-1.5">
                            <X className={`w-4 h-4 ${activity.myVote === "Nu" ? "text-[#ef4444] drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" : "text-current"}`} strokeWidth={3} /> Nu
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Glassmorphism Members Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          >
            {/* Backdrop with strong blur */}
            <div 
              className="absolute inset-0 bg-[#4b2f27]/20 backdrop-blur-md transition-opacity"
              onClick={() => setIsModalOpen(false)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[540px] max-h-[85vh] flex flex-col bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_16px_40px_rgba(75,47,39,0.15)] rounded-[2.5rem] overflow-hidden"
            >
              <div className="p-7 sm:p-8 flex-shrink-0 border-b border-white/30">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-[#4b2f27] drop-shadow-sm">Toți Membrii</h2>
                    <p className="text-[15px] font-medium text-[#5f443d] mt-1">{totalMembers} membri în grup</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-3 bg-white/40 hover:bg-white/80 rounded-full text-[#5f443d] hover:text-[#4b2f27] transition-all shadow-sm border border-white/50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-7 sm:p-8 pt-4 space-y-4">
                {mockMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="group flex items-center gap-5 p-4 rounded-[1.25rem] bg-white/30 hover:bg-white/70 border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-default"
                  >
                    <div className={`w-14 h-14 rounded-full overflow-hidden border-[3px] shadow-sm transition-transform duration-300 group-hover:scale-105 ${member.isReal ? 'border-white ring-2 ring-[#f2ada4]' : 'border-dashed border-[#d5c3be] bg-[#eee1de]/60 flex items-center justify-center'}`}>
                      {member.isReal ? (
                        <img
                          src={member.avatar!}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[11px] font-bold text-[#8a6b63] tracking-wide">(poza)</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-[17px] font-bold ${member.isReal ? 'text-[#4b2f27]' : 'text-[#8a6b63]'}`}>
                        {member.name}
                      </h4>
                      <span className="text-xs font-semibold text-[#8a6b63] uppercase tracking-wider mt-0.5 block">
                        MEMBRU {member.id}
                      </span>
                    </div>
                  </div>
                ))}
                
                <button className="w-full mt-4 flex items-center justify-center gap-3 p-4 rounded-[1.25rem] bg-gradient-to-r from-[#f2ada4]/20 to-[#edbd8c]/20 border border-[#f2ada4]/40 hover:from-[#f2ada4]/30 hover:to-[#edbd8c]/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 shadow-sm text-[#f2ada4] group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-medium leading-none mb-1">+</span>
                  </div>
                  <span className="font-bold text-[#4b2f27] text-[16px]">Invită un prieten nou</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}