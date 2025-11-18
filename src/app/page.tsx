"use client"

import { useState, useEffect } from "react"
import { Trophy, Star, TrendingUp, ShoppingBag, Users, Zap, Target, Award, ChevronRight, Coins, DollarSign, User, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type PlayerAppearance = {
  skinTone: string
  hairStyle: string
  hairColor: string
  facialHair: string
  tattoos: string
  earrings: string
  eyeColor: string
  bodyType: string
}

type Player = {
  name: string
  overall: number
  pace: number
  shooting: number
  passing: number
  dribbling: number
  defending: number
  physical: number
  position: string
  team: string
  salary: number
  xp: number
  level: number
  appearance: PlayerAppearance
}

type Team = {
  id: string
  name: string
  league: string
  prestige: number
  salary: number
}

type Offer = {
  id: string
  team: Team
  salary: number
  duration: string
  bonus: number
}

type Pack = {
  id: string
  name: string
  price: number
  currency: "coins" | "real"
  items: string[]
  rarity: "common" | "rare" | "epic" | "legendary"
}

type Match = {
  opponent: string
  difficulty: number
  reward: number
}

const TEAMS: Team[] = [
  { id: "1", name: "FC Barcelona", league: "La Liga", prestige: 95, salary: 50000 },
  { id: "2", name: "Real Madrid", league: "La Liga", prestige: 96, salary: 55000 },
  { id: "3", name: "Manchester City", league: "Premier League", prestige: 94, salary: 60000 },
  { id: "4", name: "Bayern Munich", league: "Bundesliga", prestige: 93, salary: 52000 },
  { id: "5", name: "PSG", league: "Ligue 1", prestige: 92, salary: 58000 },
  { id: "6", name: "Liverpool", league: "Premier League", prestige: 91, salary: 48000 },
  { id: "7", name: "Juventus", league: "Serie A", prestige: 89, salary: 45000 },
  { id: "8", name: "Inter Milan", league: "Serie A", prestige: 88, salary: 43000 },
]

const PACKS: Pack[] = [
  {
    id: "1",
    name: "Pack Iniciante",
    price: 500,
    currency: "coins",
    items: ["+2 Velocidade", "+1 Finalização", "+1 Drible"],
    rarity: "common"
  },
  {
    id: "2",
    name: "Pack Profissional",
    price: 1500,
    currency: "coins",
    items: ["+5 Velocidade", "+3 Finalização", "+4 Passe", "+3 Drible"],
    rarity: "rare"
  },
  {
    id: "3",
    name: "Pack Elite",
    price: 5000,
    currency: "coins",
    items: ["+8 Velocidade", "+7 Finalização", "+6 Passe", "+7 Drible", "+5 Físico"],
    rarity: "epic"
  },
  {
    id: "4",
    name: "Pack Lendário",
    price: 10,
    currency: "real",
    items: ["+15 Todas Habilidades", "Boost XP 2x", "Desbloqueio Especial"],
    rarity: "legendary"
  },
  {
    id: "5",
    name: "Pack Mega Boost",
    price: 25,
    currency: "real",
    items: ["+25 Todas Habilidades", "Boost XP 5x", "Contrato Premium"],
    rarity: "legendary"
  }
]

const APPEARANCE_OPTIONS = {
  skinTones: [
    { id: "light", name: "Clara", color: "#FFE0BD" },
    { id: "medium", name: "Média", color: "#D4A574" },
    { id: "tan", name: "Morena", color: "#C68642" },
    { id: "dark", name: "Escura", color: "#8D5524" },
    { id: "deep", name: "Negra", color: "#5C3317" }
  ],
  hairStyles: [
    { id: "short", name: "Curto" },
    { id: "medium", name: "Médio" },
    { id: "long", name: "Longo" },
    { id: "mohawk", name: "Moicano" },
    { id: "bald", name: "Careca" },
    { id: "afro", name: "Afro" },
    { id: "dreadlocks", name: "Dreadlocks" },
    { id: "fade", name: "Degradê" }
  ],
  hairColors: [
    { id: "black", name: "Preto", color: "#1a1a1a" },
    { id: "brown", name: "Castanho", color: "#4a2511" },
    { id: "blonde", name: "Loiro", color: "#f4d03f" },
    { id: "red", name: "Ruivo", color: "#c0392b" },
    { id: "white", name: "Branco", color: "#ecf0f1" },
    { id: "blue", name: "Azul", color: "#3498db" },
    { id: "green", name: "Verde", color: "#27ae60" },
    { id: "pink", name: "Rosa", color: "#e91e63" }
  ],
  facialHair: [
    { id: "none", name: "Sem barba" },
    { id: "stubble", name: "Por fazer" },
    { id: "goatee", name: "Cavanhaque" },
    { id: "full", name: "Barba cheia" },
    { id: "mustache", name: "Bigode" },
    { id: "soul", name: "Soul patch" }
  ],
  tattoos: [
    { id: "none", name: "Sem tatuagens" },
    { id: "arm-left", name: "Braço esquerdo" },
    { id: "arm-right", name: "Braço direito" },
    { id: "both-arms", name: "Ambos braços" },
    { id: "chest", name: "Peito" },
    { id: "back", name: "Costas" },
    { id: "full-sleeve", name: "Manga completa" },
    { id: "full-body", name: "Corpo inteiro" }
  ],
  earrings: [
    { id: "none", name: "Sem brincos" },
    { id: "stud-left", name: "Argola esquerda" },
    { id: "stud-right", name: "Argola direita" },
    { id: "both-studs", name: "Ambas argolas" },
    { id: "hoop-left", name: "Aro esquerdo" },
    { id: "hoop-right", name: "Aro direito" },
    { id: "both-hoops", name: "Ambos aros" },
    { id: "diamond", name: "Diamante" }
  ],
  eyeColors: [
    { id: "brown", name: "Castanho", color: "#5C4033" },
    { id: "blue", name: "Azul", color: "#5DADE2" },
    { id: "green", name: "Verde", color: "#52BE80" },
    { id: "hazel", name: "Mel", color: "#A0826D" },
    { id: "gray", name: "Cinza", color: "#95A5A6" },
    { id: "amber", name: "Âmbar", color: "#D68910" }
  ],
  bodyTypes: [
    { id: "slim", name: "Magro" },
    { id: "athletic", name: "Atlético" },
    { id: "muscular", name: "Musculoso" },
    { id: "bulky", name: "Forte" }
  ]
}

export default function FootballCareerGame() {
  const [mounted, setMounted] = useState(false)
  const [player, setPlayer] = useState<Player>({
    name: "Seu Jogador",
    overall: 65,
    pace: 70,
    shooting: 65,
    passing: 60,
    dribbling: 68,
    defending: 45,
    physical: 62,
    position: "ST",
    team: "Clube Inicial",
    salary: 5000,
    xp: 0,
    level: 1,
    appearance: {
      skinTone: "medium",
      hairStyle: "short",
      hairColor: "black",
      facialHair: "none",
      tattoos: "none",
      earrings: "none",
      eyeColor: "brown",
      bodyType: "athletic"
    }
  })

  const [coins, setCoins] = useState(1000)
  const [offers, setOffers] = useState<Offer[]>([])
  const [showOffers, setShowOffers] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [achievements, setAchievements] = useState<string[]>([])
  const [tempName, setTempName] = useState(player.name)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Gerar ofertas aleatórias
  useEffect(() => {
    if (!mounted) return
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && offers.length < 3) {
        const randomTeam = TEAMS[Math.floor(Math.random() * TEAMS.length)]
        const salaryMultiplier = 1 + (player.overall - 65) / 100
        
        const newOffer: Offer = {
          id: Date.now().toString(),
          team: randomTeam,
          salary: Math.floor(randomTeam.salary * salaryMultiplier),
          duration: ["1 ano", "2 anos", "3 anos"][Math.floor(Math.random() * 3)],
          bonus: Math.floor(Math.random() * 50000) + 10000
        }
        
        setOffers(prev => [...prev, newOffer])
        toast.success(`Nova proposta de ${randomTeam.name}!`, {
          description: `Salário: $${newOffer.salary.toLocaleString()}/mês`
        })
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [offers.length, player.overall, mounted])

  // Gerar partidas
  useEffect(() => {
    if (matches.length === 0) {
      generateMatches()
    }
  }, [matches.length])

  const generateMatches = () => {
    const newMatches: Match[] = [
      { opponent: "Time Local A", difficulty: 1, reward: 200 },
      { opponent: "Time Local B", difficulty: 2, reward: 350 },
      { opponent: "Time Regional", difficulty: 3, reward: 500 },
      { opponent: "Time Nacional", difficulty: 4, reward: 750 },
      { opponent: "Time Internacional", difficulty: 5, reward: 1200 },
    ]
    setMatches(newMatches)
  }

  const acceptOffer = (offer: Offer) => {
    setPlayer(prev => ({
      ...prev,
      team: offer.team.name,
      salary: offer.salary
    }))
    setCoins(prev => prev + offer.bonus)
    setOffers(prev => prev.filter(o => o.id !== offer.id))
    toast.success(`Contrato assinado com ${offer.team.name}!`, {
      description: `Bônus de $${offer.bonus.toLocaleString()} recebido!`
    })
    
    if (offer.team.prestige >= 90 && !achievements.includes("elite")) {
      setAchievements(prev => [...prev, "elite"])
      toast.success("🏆 Conquista desbloqueada: Jogador de Elite!")
    }
  }

  const rejectOffer = (offerId: string) => {
    setOffers(prev => prev.filter(o => o.id !== offerId))
    toast.info("Proposta recusada")
  }

  const playMatch = (match: Match) => {
    setSelectedMatch(match)
    setIsPlaying(true)

    setTimeout(() => {
      const playerSkill = player.overall
      const matchDifficulty = match.difficulty * 15
      const randomFactor = Math.random() * 20
      
      const playerScore = playerSkill + randomFactor
      const opponentScore = matchDifficulty + Math.random() * 20

      const won = playerScore > opponentScore
      
      if (won) {
        const xpGained = match.difficulty * 50
        const coinsGained = match.reward
        
        setCoins(prev => prev + coinsGained)
        setPlayer(prev => {
          const newXp = prev.xp + xpGained
          const newLevel = Math.floor(newXp / 500) + 1
          const leveledUp = newLevel > prev.level
          
          if (leveledUp) {
            toast.success("🎉 Level Up!", {
              description: `Você alcançou o nível ${newLevel}!`
            })
            return {
              ...prev,
              xp: newXp,
              level: newLevel,
              overall: Math.min(99, prev.overall + 1)
            }
          }
          
          return { ...prev, xp: newXp, level: newLevel }
        })
        
        toast.success("🎯 Vitória!", {
          description: `+${coinsGained} moedas | +${xpGained} XP`
        })
      } else {
        const xpGained = match.difficulty * 20
        setPlayer(prev => ({ ...prev, xp: prev.xp + xpGained }))
        toast.error("😔 Derrota", {
          description: `+${xpGained} XP de experiência`
        })
      }
      
      setIsPlaying(false)
      setSelectedMatch(null)
      generateMatches()
    }, 3000)
  }

  const buyPack = (pack: Pack) => {
    if (pack.currency === "coins") {
      if (coins < pack.price) {
        toast.error("Moedas insuficientes!")
        return
      }
      setCoins(prev => prev - pack.price)
    } else {
      toast.info("Pagamento real simulado - Pack adquirido!")
    }

    // Aplicar melhorias
    const boostAmount = pack.rarity === "legendary" ? 15 : 
                       pack.rarity === "epic" ? 8 : 
                       pack.rarity === "rare" ? 5 : 2

    setPlayer(prev => ({
      ...prev,
      pace: Math.min(99, prev.pace + boostAmount),
      shooting: Math.min(99, prev.shooting + boostAmount),
      passing: Math.min(99, prev.passing + boostAmount),
      dribbling: Math.min(99, prev.dribbling + boostAmount),
      physical: Math.min(99, prev.physical + boostAmount),
      overall: Math.min(99, prev.overall + Math.floor(boostAmount / 2))
    }))

    toast.success(`${pack.name} adquirido!`, {
      description: `Suas habilidades aumentaram!`
    })

    if (pack.rarity === "legendary" && !achievements.includes("legendary")) {
      setAchievements(prev => [...prev, "legendary"])
      toast.success("🏆 Conquista: Colecionador Lendário!")
    }
  }

  const updateAppearance = (category: keyof PlayerAppearance, value: string) => {
    setPlayer(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [category]: value
      }
    }))
  }

  const saveName = () => {
    if (tempName.trim()) {
      setPlayer(prev => ({ ...prev, name: tempName.trim() }))
      toast.success("Nome atualizado!")
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "from-yellow-500 to-orange-600"
      case "epic": return "from-purple-500 to-pink-600"
      case "rare": return "from-blue-500 to-cyan-600"
      default: return "from-gray-500 to-gray-600"
    }
  }

  const xpToNextLevel = 500
  const xpProgress = (player.xp % xpToNextLevel) / xpToNextLevel * 100

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 md:p-8 mb-6 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
                <Trophy className="w-8 h-8 md:w-12 md:h-12" />
                Football Career
              </h1>
              <p className="text-green-100 text-lg">Modo Carreira Online</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <Coins className="w-6 h-6 text-yellow-300 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{coins.toLocaleString()}</p>
                <p className="text-xs text-green-100">Moedas</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <Star className="w-6 h-6 text-yellow-300 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{player.level}</p>
                <p className="text-xs text-green-100">Nível</p>
              </div>
            </div>
          </div>
        </div>

        {/* Player Card */}
        <Card className="mb-6 bg-gradient-to-br from-slate-900 to-slate-800 border-green-500/30 shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl md:text-3xl text-white flex items-center gap-2">
                  {player.name}
                  <Badge className="bg-green-600">{player.position}</Badge>
                </CardTitle>
                <CardDescription className="text-green-300 text-lg mt-1">
                  {player.team} • ${player.salary.toLocaleString()}/mês
                </CardDescription>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowCustomization(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Customizar
                </Button>
                
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-center shadow-lg">
                  <p className="text-5xl font-bold text-white">{player.overall}</p>
                  <p className="text-sm text-white/90 font-semibold">OVERALL</p>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-green-300 mb-2">
                <span>XP: {player.xp % xpToNextLevel}/{xpToNextLevel}</span>
                <span>Próximo Nível: {player.level + 1}</span>
              </div>
              <Progress value={xpProgress} className="h-3 bg-slate-700" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Velocidade", value: player.pace, icon: Zap },
                { label: "Finalização", value: player.shooting, icon: Target },
                { label: "Passe", value: player.passing, icon: Users },
                { label: "Drible", value: player.dribbling, icon: TrendingUp },
                { label: "Defesa", value: player.defending, icon: Award },
                { label: "Físico", value: player.physical, icon: Trophy }
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-4 h-4 text-green-400" />
                    <p className="text-xs text-green-300">{stat.label}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={stat.value} className="h-2 flex-1 bg-slate-700" />
                    <span className="text-sm font-bold text-white w-8">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-1">
            <TabsTrigger value="matches" className="data-[state=active]:bg-green-600">
              <Trophy className="w-4 h-4 mr-2" />
              Partidas
            </TabsTrigger>
            <TabsTrigger value="offers" className="data-[state=active]:bg-green-600 relative">
              <Users className="w-4 h-4 mr-2" />
              Propostas
              {offers.length > 0 && (
                <Badge className="ml-2 bg-red-600 text-white">{offers.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:bg-green-600">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Loja
            </TabsTrigger>
          </TabsList>

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-4">
            <Card className="bg-slate-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-green-400" />
                  Partidas Disponíveis
                </CardTitle>
                <CardDescription className="text-green-300">
                  Jogue partidas para ganhar XP e moedas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/50 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-800 transition-all"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{match.opponent}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                          Dificuldade: {match.difficulty}/5
                        </Badge>
                        <Badge variant="outline" className="border-green-500 text-green-400">
                          +{match.reward} moedas
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => playMatch(match)}
                      disabled={isPlaying}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 w-full md:w-auto"
                    >
                      {isPlaying && selectedMatch === match ? "Jogando..." : "Jogar"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers" className="space-y-4">
            <Card className="bg-slate-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-green-400" />
                  Propostas de Clubes
                </CardTitle>
                <CardDescription className="text-green-300">
                  {offers.length > 0 
                    ? `Você tem ${offers.length} proposta(s) aguardando` 
                    : "Nenhuma proposta no momento. Continue jogando!"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {offers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Aguardando propostas...</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Melhore suas habilidades para receber ofertas de clubes maiores!
                    </p>
                  </div>
                ) : (
                  offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 border border-green-500/30 shadow-lg"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">{offer.team.name}</h3>
                          <p className="text-green-300 mb-4">{offer.team.league}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-slate-400">Salário Mensal</p>
                              <p className="text-xl font-bold text-green-400">
                                ${offer.salary.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-400">Bônus de Assinatura</p>
                              <p className="text-xl font-bold text-yellow-400">
                                ${offer.bonus.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-400">Duração</p>
                              <p className="text-lg font-semibold text-white">{offer.duration}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-400">Prestígio</p>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <p className="text-lg font-semibold text-white">{offer.team.prestige}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          <Button
                            onClick={() => acceptOffer(offer)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            Aceitar Proposta
                          </Button>
                          <Button
                            onClick={() => rejectOffer(offer.id)}
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500/10"
                          >
                            Recusar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shop Tab */}
          <TabsContent value="shop" className="space-y-4">
            <Card className="bg-slate-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-green-400" />
                  Loja de Packs
                </CardTitle>
                <CardDescription className="text-green-300">
                  Compre packs para melhorar suas habilidades
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PACKS.map((pack) => (
                  <div
                    key={pack.id}
                    className={`bg-gradient-to-br ${getRarityColor(pack.rarity)} rounded-xl p-6 shadow-xl hover:scale-105 transition-transform`}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                      <h3 className="text-xl font-bold text-white mb-2">{pack.name}</h3>
                      <Badge className="bg-white/20 text-white mb-3">
                        {pack.rarity.toUpperCase()}
                      </Badge>
                      
                      <div className="space-y-2 mb-4">
                        {pack.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-white text-sm">
                            <Star className="w-4 h-4 fill-white" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => buyPack(pack)}
                      className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold"
                      disabled={pack.currency === "coins" && coins < pack.price}
                    >
                      {pack.currency === "coins" ? (
                        <>
                          <Coins className="w-4 h-4 mr-2" />
                          {pack.price.toLocaleString()} Moedas
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4 mr-2" />
                          R$ {pack.price.toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Achievements */}
        {achievements.length > 0 && (
          <Card className="mt-6 bg-slate-900/50 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                Conquistas Desbloqueadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {achievements.includes("elite") && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    🏆 Jogador de Elite
                  </Badge>
                )}
                {achievements.includes("legendary") && (
                  <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
                    ⭐ Colecionador Lendário
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Customization Dialog */}
      <Dialog open={showCustomization} onOpenChange={setShowCustomization}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 border-green-500/30">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white flex items-center gap-2">
              <Palette className="w-6 h-6 text-purple-400" />
              Customizar Jogador
            </DialogTitle>
            <DialogDescription className="text-green-300">
              Personalize a aparência do seu jogador
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label className="text-white text-lg font-semibold">Nome do Jogador</Label>
              <div className="flex gap-2">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Digite o nome"
                  className="bg-slate-800 border-green-500/30 text-white"
                />
                <Button onClick={saveName} className="bg-green-600 hover:bg-green-700">
                  Salvar
                </Button>
              </div>
            </div>

            {/* Tom de Pele */}
            <div className="space-y-3">
              <Label className="text-white text-lg font-semibold">Tom de Pele</Label>
              <div className="grid grid-cols-5 gap-3">
                {APPEARANCE_OPTIONS.skinTones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => updateAppearance("skinTone", tone.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      player.appearance.skinTone === tone.id
                        ? "border-green-500 scale-105"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                    style={{ backgroundColor: tone.color }}
                  >
                    <p className="text-xs text-center text-white font-semibold drop-shadow-lg mt-2">
                      {tone.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Estilo de Cabelo */}
            <div className="space-y-3">
              <Label className="text-white text-lg font-semibold">Estilo de Cabelo</Label>
              <div className="grid grid-cols-4 gap-3">
                {APPEARANCE_OPTIONS.hairStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateAppearance("hairStyle", style.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      player.appearance.hairStyle === style.id
                        ? "border-green-500 bg-green-900/30"
                        : "border-slate-700 bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    <p className="text-sm text-white font-semibold">{style.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Cor do Cabelo */}
            <div className="space-y-3">
              <Label className="text-white text-lg font-semibold">Cor do Cabelo</Label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {APPEARANCE_OPTIONS.hairColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => updateAppearance("hairColor", color.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      player.appearance.hairColor === color.id
                        ? "border-green-500 scale-105"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                    style={{ backgroundColor: color.color }}
                  >
                    <p className="text-xs text-center text-white font-semibold drop-shadow-lg mt-2">
                      {color.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Barba */}
            <div className="space-y-3">
              <Label className="text-white text-lg font-semibold">Barba</Label>
              <div className="grid grid-cols-3 gap-3">
                {APPEARANCE_OPTIONS.facialHair.map((facial) => (
                  <button
                    key={facial.id}
                    onClick={() => updateAppearance("facialHair", facial.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      player.appearance.facialHair === facial.id
                        ? "border-green-500 bg-green-900/30"
                        : "border-slate-700 bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    <p className="text-sm text-white font-semibold">{facial.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Tatuagens */}
            <div className="space-y-3">
              <Label className="text-white text-lg font-semibold">Tatuagens</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {APPEARANCE_OPTIONS.tattoos.map((tattoo) => (
                  <button
                    key={tattoo.id}
                    onClick={() => updateAppearance("tattoos", tattoo.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      player.appearance.tattoos === tattoo.id
                        ? "border-green-500 bg-green-900/30"
                        : "border-slate-700 bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    <p className="text-sm text-white font-semibold text-center">{tattoo.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Brincos */}
            <div className="space-y-3">
              <Label className="text-white text-lg font-semibold">Brincos</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {APPEARANCE_OPTIONS.earrings.map((earring) => (
                  <button
                    key={earring.id}
                    onClick={() => updateAppearance("earrings", earring.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      player.appearance.earrings === earring.id
                        ? "border-green-500 bg-green-900/30"
                        : "border-slate-700 bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    <p className="text-sm text-white font-semibold text-center">{earring.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Cor dos Olhos */}
            <div className="space-y-3">
              <Label className="text-white text-lg font-semibold">Cor dos Olhos</Label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {APPEARANCE_OPTIONS.eyeColors.map((eye) => (
                  <button
                    key={eye.id}
                    onClick={() => updateAppearance("eyeColor", eye.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      player.appearance.eyeColor === eye.id
                        ? "border-green-500 scale-105"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                    style={{ backgroundColor: eye.color }}
                  >
                    <p className="text-xs text-center text-white font-semibold drop-shadow-lg mt-2">
                      {eye.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo Corporal */}
            <div className="space-y-3">
              <Label className="text-white text-lg font-semibold">Tipo Corporal</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {APPEARANCE_OPTIONS.bodyTypes.map((body) => (
                  <button
                    key={body.id}
                    onClick={() => updateAppearance("bodyType", body.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      player.appearance.bodyType === body.id
                        ? "border-green-500 bg-green-900/30"
                        : "border-slate-700 bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    <p className="text-sm text-white font-semibold">{body.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button
              onClick={() => setShowCustomization(false)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Concluir Customização
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
